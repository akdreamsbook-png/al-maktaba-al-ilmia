/* طبقة البيانات: تحاول API الخادم أولاً، ثم التخزين المحلي كاحتياط */
const Store = (() => {
  const LS_KEY = "ablib_v1";
  const TOKEN_KEY = "ablib_token";
  const RESUME_PREFIX = "ablib_resume_";

  const seed = () => ({
    settings: {
      site_title: "المكتبة العلمية لفضيلة الشيخ أبي أنس محمد مصطفى صار",
      sheikh_name: "فضيلة الشيخ أبو أنس محمد مصطفى صار",
      tagline: "الدروس العلمية • المحاضرات العامة • الخطب • الكتب والبحوث",
      bio: "نبذة تعريفية بالشيخ تُعدَّل من لوحة التحكم. (لم ترد معلومات مؤكدة بعد، ولن تُكتب أي معلومات غير مؤكدة.)",
      photo: "",
      footer_note: "جميع المواد العلمية والتسجيلات محفوظة الحقوق للمكتبة العلمية.",
      contact: ""
    },
    categories: [
      { id: "c1", name: "الدروس العلمية", sort: 1 },
      { id: "c2", name: "المحاضرات العامة", sort: 2 },
      { id: "c3", name: "الخطب والمواعظ", sort: 3 },
      { id: "c4", name: "الكتب والبحوث", sort: 4 }
    ],
    series: [],
    lessons: []
  });

  function localLoad() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const s = seed();
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {}
    return s;
  }
  function localSave(d) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch (e) {} }

  async function api(path, opts = {}) {
    const headers = Object.assign({ "Content-Type": "application/json" }, opts.headers || {});
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) headers["Authorization"] = "Bearer " + t;
    const res = await fetch(path, Object.assign({}, opts, { headers }));
    if (!res.ok) {
      let msg = "خطأ " + res.status;
      try { const j = await res.json(); if (j.error) msg = j.error; } catch (e) {}
      throw new Error(msg);
    }
    return res.json();
  }

  async function apiAvailable() {
    try {
      const c = new AbortController();
      const t = setTimeout(() => c.abort(), 2500);
      const r = await fetch("/api/public/settings", { signal: c.signal });
      clearTimeout(t);
      return r.ok;
    } catch (e) { return false; }
  }

  // قراءة عامة (منشور فقط)
  async function getPublic() {
    const ok = await apiAvailable();
    if (ok) {
      const [settings, categories, series, lessons] = await Promise.all([
        api("/api/public/settings").then(r => r.settings),
        api("/api/public/categories").then(r => r.items),
        api("/api/public/series").then(r => r.items),
        api("/api/public/lessons").then(r => r.items)
      ]);
      return { mode: "server", settings, categories, series, lessons };
    }
    // قراءة من ملفات بيانات ثابتة (النسخة المنشورة على GitHub Pages)
    try {
      const j = p => fetch("assets/data/" + p + ".json", { cache: "no-cache" }).then(r => {
        if (!r.ok) throw new Error("no static data");
        return r.json();
      });
      const [settings, categories, series, lessons] = await Promise.all([
        j("settings").then(v => v.settings),
        j("categories").then(v => v.items),
        j("series").then(v => v.items),
        j("lessons").then(v => v.items)
      ]);
      return { mode: "static", settings, categories, series, lessons };
    } catch (e) {}
    const d = localLoad();
    return {
      mode: "local",
      settings: d.settings,
      categories: d.categories,
      series: (d.series || []).filter(s => (s.status || "published") === "published"),
      lessons: (d.lessons || []).filter(l => (l.status || "published") === "published")
    };
  }

  function filterLessons(lessons, { q, seriesId, cat, kind }) {
    q = (q || "").trim();
    return lessons.filter(l => {
      if (seriesId && l.series_id !== seriesId) return false;
      if (cat && !(l.categories || []).includes(cat) && l.category !== cat) return false;
      if (kind && l.kind !== kind) return false;
      if (q) {
        const hay = [l.title, l.description, l.sheikh, l.series_name, (l.tags || []).join(" ")].join(" ");
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => ((a.sort || a.number || 0) - (b.sort || b.number || 0)) || String(a.created || "").localeCompare(String(b.created || "")));
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  function lessonUrl(l) { return "lesson.html?id=" + encodeURIComponent(l.id); }
  function seriesUrl(s) { return "series-view.html?id=" + encodeURIComponent(s.id); }

  return {
    seed, localLoad, localSave, api, apiAvailable,
    getPublic, filterLessons, esc, lessonUrl, seriesUrl,
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setToken: t => t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY),
    resumeKey: id => RESUME_PREFIX + id,
    LS_KEY
  };
})();
