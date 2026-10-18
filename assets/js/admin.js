/* لوحة التحكم: تعمل مع الخادم (server.py)، ومع وضع محلي احتياطي */
(function(){
  const $ = id => document.getElementById(id);
  let MODE = "local", SERIES = [], LESSONS = [], CATS = [], SETTINGS = null;

  const tabs = document.querySelectorAll(".tabs button");
  function showTab(t){
    tabs.forEach(x => x.classList.toggle("on", x.dataset.t === t));
    document.querySelectorAll("[data-p]").forEach(p => p.style.display = p.dataset.p === t ? "" : "none");
  }
  tabs.forEach(b => b.onclick = () => showTab(b.dataset.t));

  const KIND_LABEL = { lesson: "درس علمي", lecture: "محاضرة/خطبة", khotba: "خطبة", general: "محاضرة عامة", audio: "صوتي", video: "مرئي", book: "كتاب", research: "بحث علمي", file: "ملف/وثيقة" };

  function toggleBookFields(){
    const box = $("L-book-box");
    if (box) box.style.display = (["book","research","file"].indexOf($("L-kind").value) >= 0) ? "" : "none";
  }

  function toggleSermonFields(){
    const box = $("L-sermon-box");
    if (box) box.style.display = (["khotba","general","lecture"].indexOf($("L-kind").value) >= 0) ? "" : "none";
  }

  function uid(p){ return p + "_" + Date.now().toString(36) + Math.floor(Math.random()*999); }
  function split(v){ return (v||"").split(/[،,]/).map(s=>s.trim()).filter(Boolean); }

  async function refresh(){
    const ok = await Store.apiAvailable();
    MODE = ok ? "server" : "local";
    $("login-mode").textContent = ok ? "الخادم متصل — الحفظ مركزي في قاعدة البيانات." : "الخادم غير مشغّل — العمل في الوضع المحلي (localStorage). شغّل: python3 server.py";
    if (ok && Store.getToken()) { await loadServer(); }
    else if (!ok && Store.getToken()) { loadLocal(); }
  }

  function loadLocal(){
    const d = Store.localLoad();
    SETTINGS = d.settings; CATS = d.categories; SERIES = d.series; LESSONS = d.lessons;
    $("mode-note").innerHTML = '<div class="mode-banner">وضع محلي — البيانات في هذا المتصفح فقط. لعمل جماعي وحفظ مركزي شغّل الخادم.</div>';
    draw();
  }
  async function loadServer(){
    const [s, c, se, l] = await Promise.all([
      Store.api("/api/public/settings").then(r=>r.settings).catch(()=>Store.api("/api/admin/settings").then(r=>r.settings)),
      Store.api("/api/admin/categories").then(r=>r.items),
      Store.api("/api/admin/series").then(r=>r.items),
      Store.api("/api/admin/lessons").then(r=>r.items)
    ]);
    SETTINGS = s; CATS = c; SERIES = se; LESSONS = l;
    try { const st = await Store.api("/api/admin/stats"); $("stats").innerHTML = "<span class='badge'>الدروس: "+st.lessons+"</span> <span class='badge'>السلاسل: "+st.series+"</span> <span class='badge'>التصنيفات: "+st.categories+"</span>"; } catch(e){}
    $("mode-note").innerHTML = "";
    draw();
  }

  function draw(){
    // الدروس
    const q = ($("adm-q").value || "").trim();
    const rows = LESSONS.filter(l => !q || (l.title + (l.description||"")).includes(q));
    const sMap = {}; SERIES.forEach(s => sMap[s.id] = s.title);
    $("lessons-tb").innerHTML = rows.map(l =>
      "<tr><td><b>"+Store.esc(l.title)+"</b><br><small style='color:var(--muted)'>"+Store.esc((l.description||"").slice(0,60))+"</small></td>"
      + "<td>"+Store.esc(sMap[l.series_id]||"—")+"</td><td>"+Store.esc(l.number||"—")+"</td><td>"+Store.esc(KIND_LABEL[l.kind]||l.kind||"")+"</td>"
      + "<td>"+(l.status==="published"?"✅ منشور":"📝 مسودة")+"</td>"
      + "<td><div class='row'><button class='btn small' data-edit='"+l.id+"'>تعديل</button>"
      + "<button class='btn small ghost' data-prev='"+l.id+"'>معاينة</button>"
      + "<button class='btn small ghost' data-toggle='"+l.id+"'>"+(l.status==="published"?"إلغاء النشر":"نشر")+"</button>"
      + "<button class='btn small danger' data-del='"+l.id+"'>حذف</button></div></td></tr>").join("")
      || "<tr><td colspan='6' style='text-align:center;color:var(--muted)'>لا توجد دروس بعد.</td></tr>";
    $("L-series").innerHTML = '<option value="">— بدون سلسلة —</option>' + SERIES.map(s=>"<option value='"+s.id+"'>"+Store.esc(s.title)+"</option>").join("");
    // أفعال الصفوف (تُبنى مرة وتُنسخ في الجدولين)
    const acts = l => "<td>"+(l.status==="published"?"✅ منشور":"📝 مسودة")+"</td>"
      + "<td><div class='row'><button class='btn small' data-edit='"+l.id+"'>تعديل</button>"
      + "<button class='btn small ghost' data-prev='"+l.id+"'>معاينة</button>"
      + "<button class='btn small ghost' data-toggle='"+l.id+"'>"+(l.status==="published"?"إلغاء النشر":"نشر")+"</button>"
      + "<button class='btn small danger' data-del='"+l.id+"'>حذف</button></div></td></tr>";
    // الخطب (نوع «خطبة») — قسم مستقل عن المحاضرات
    const khq = ($("kh-q").value || "").trim();
    const kh = LESSONS.filter(l => l.kind === "khotba" && (!khq || (l.title + " " + (l.description||"")).includes(khq)));
    $("khutab-tb").innerHTML = kh.length ? kh.map(l =>
      "<tr><td><b>"+Store.esc(l.title)+"</b><br><small style='color:var(--muted)'>"+Store.esc((l.description||"").slice(0,60))+"</small></td>"
      + "<td>"+Store.esc(l.khatib||"—")+"</td><td>"+Store.esc(l.place||"—")+"</td>"
      + "<td>"+Store.esc(l.hijri_date||"—")+(l.date?"<br><small style='color:var(--muted)'>"+Store.esc(l.date)+"</small>":"")+"</td>"
      + acts(l)).join("")
      : "<tr><td colspan='6' style='text-align:center;color:var(--muted)'>لا توجد خطب بعد — اضغط «+ خطبة جديدة».</td></tr>";
    // المحاضرات العامة (نوع «محاضرة عامة» — صوتية أو مرئية)
    const lq = ($("lec-q").value || "").trim();
    const lc = LESSONS.filter(l => l.kind === "general" && (!lq || (l.title + " " + (l.description||"")).includes(lq)));
    $("lectures-tb").innerHTML = lc.length ? lc.map(l =>
      "<tr><td><b>"+Store.esc(l.title)+"</b><br><small style='color:var(--muted)'>"+Store.esc((l.description||"").slice(0,60))+"</small></td>"
      + "<td>"+Store.esc(l.khatib||"—")+"</td><td>"+Store.esc(l.place||"—")+"</td>"
      + "<td>"+Store.esc(l.hijri_date||"—")+(l.date?"<br><small style='color:var(--muted)'>"+Store.esc(l.date)+"</small>":"")+"</td>"
      + "<td>"+(l.audio_url ? "🎧 صوتية" : (l.video_url ? "🎥 مرئية" : "—"))+"</td>"
      + acts(l)).join("")
      : "<tr><td colspan='7' style='text-align:center;color:var(--muted)'>لا توجد محاضرات عامة بعد — اضغط «+ محاضرة عامة».</td></tr>";
    // الكتب والبحوث والملفات (نفس ما يراه الزائر في صفحة «الكتب والبحوث والملفات العلمية»)
    const isBookish = l => ["book","research","file"].indexOf(l.kind) >= 0 || !!l.pdf_url;
    const bkq = ($("bk-q").value || "").trim();
    const bk = LESSONS.filter(l => isBookish(l) && (!bkq || (l.title + " " + (l.description||"") + " " + (l.author||"")).indexOf(bkq) >= 0));
    $("books-tb").innerHTML = bk.length ? bk.map(l =>
      "<tr><td><b>"+Store.esc(l.title)+"</b><br><small style='color:var(--muted)'>"+Store.esc((l.description||"").slice(0,60))+"</small></td>"
      + "<td>"+Store.esc(KIND_LABEL[l.kind]||l.kind||"")+"</td>"
      + "<td>"+Store.esc(l.author||"—")+"</td>"
      + "<td>"+(l.pdf_url ? "<a href='"+Store.esc(l.pdf_url)+"' target='_blank' rel='noopener'>📄 فتح الملف</a>" : "—")+"</td>"
      + "<td>"+(l.status==="published"?"✅ منشور":"📝 مسودة")+"</td>"
      + "<td><div class='row'><button class='btn small' data-edit='"+l.id+"'>تعديل</button>"
      + "<button class='btn small ghost' data-prev='"+l.id+"'>معاينة</button>"
      + "<button class='btn small ghost' data-toggle='"+l.id+"'>"+(l.status==="published"?"إلغاء النشر":"نشر")+"</button>"
      + "<button class='btn small danger' data-del='"+l.id+"'>حذف</button></div></td></tr>").join("")
      : "<tr><td colspan='6' style='text-align:center;color:var(--muted)'>لا توجد كتب أو بحوث أو ملفات بعد — اضغط «+ كتاب / بحث / ملف».</td></tr>";
    // السلاسل
    const cnt = {}; LESSONS.forEach(l => { if (l.series_id) cnt[l.series_id]=(cnt[l.series_id]||0)+1; });
    $("series-tb").innerHTML = SERIES.map(s =>
      "<tr><td><b>"+Store.esc(s.title)+"</b></td><td>"+(cnt[s.id]||0)+"</td><td>"+(s.status==="published"?"✅":"📝")+"</td>"
      + "<td><div class='row'><button class='btn small' data-sedit='"+s.id+"'>تعديل</button><button class='btn small danger' data-sdel='"+s.id+"'>حذف</button></div></td></tr>").join("")
      || "<tr><td colspan='4' style='text-align:center;color:var(--muted)'>لا توجد سلاسل بعد.</td></tr>";
    // التصنيفات
    $("cats-tb").innerHTML = CATS.map(c =>
      "<tr><td>"+Store.esc(c.name)+"</td><td><button class='btn small danger' data-cdel='"+c.id+"'>حذف</button></td></tr>").join("");
    // الإعدادات
    if (SETTINGS) { $("Set-title").value=SETTINGS.site_title||""; $("Set-sheikh").value=SETTINGS.sheikh_name||""; $("Set-tagline").value=SETTINGS.tagline||""; $("Set-bio").value=SETTINGS.bio||""; $("Set-photo").value=SETTINGS.photo||""; $("Set-contact").value=SETTINGS.contact||""; $("Set-footer").value=SETTINGS.footer_note||"";
      $("Set-title-fr").value=SETTINGS.site_title_fr||""; $("Set-sheikh-fr").value=SETTINGS.sheikh_name_fr||""; $("Set-tagline-fr").value=SETTINGS.tagline_fr||""; $("Set-bio-fr").value=SETTINGS.bio_fr||""; $("Set-footer-fr").value=SETTINGS.footer_note_fr||""; }
    bindRowButtons();
  }

  function bindRowButtons(){
    document.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => {
      const l = LESSONS.find(x=>x.id===b.dataset.edit); if(!l) return;
      showTab("lessons");
      $("L-id").value=l.id; $("L-title").value=l.title||""; $("L-number").value=l.number||"";
      $("L-kind").value=l.kind||"lesson"; $("L-series").value=l.series_id||"";
      $("L-date").value=l.date||""; $("L-desc").value=l.description||"";
      $("L-title-fr").value=l.title_fr||""; $("L-desc-fr").value=l.description_fr||"";
      $("L-khatib").value=l.khatib||""; $("L-place").value=l.place||""; $("L-hijri").value=l.hijri_date||"";
      $("L-author").value=l.author||"";
      toggleSermonFields(); toggleBookFields();
      $("L-audio").value=l.audio_url||""; $("L-pdf").value=l.pdf_url||"";
      $("L-video").value=l.video_url||""; $("L-text").value=l.text||"";
      $("L-cats").value=(l.categories||[]).join("، "); $("L-tags").value=(l.tags||[]).join("، ");
      $("L-status").value=l.status||"draft"; $("L-dl").value=l.allow_download===false?"0":"1";
      $("L-duration").value=l.duration||""; $("L-sort").value=(l.sort||l.number||0);
      $("lesson-form-title").textContent = "تعديل درس"; window.scrollTo({top:$("lesson-form-title").offsetTop-80,behavior:"smooth"});
    });
    document.querySelectorAll("[data-prev]").forEach(b => b.onclick = () => window.open("lesson.html?id="+encodeURIComponent(b.dataset.prev)+(MODE==="server"?"&preview=1":""), "_blank"));
    document.querySelectorAll("[data-toggle]").forEach(b => b.onclick = async () => {
      const l = LESSONS.find(x=>x.id===b.dataset.toggle);
      await saveLesson(Object.assign({}, l, { status: l.status==="published" ? "draft" : "published" }));
    });
    document.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
      if (!confirm("حذف هذا الدرس نهائيًا؟")) return;
      if (MODE==="server") await Store.api("/api/admin/lessons/"+b.dataset.del, { method:"DELETE" });
      else { const d=Store.localLoad(); d.lessons=d.lessons.filter(x=>x.id!==b.dataset.del); Store.localSave(d); }
      await reloadData();
    });
    document.querySelectorAll("[data-sedit]").forEach(b => b.onclick = () => {
      const s = SERIES.find(x=>x.id===b.dataset.sedit); if(!s) return;
      $("S-id").value=s.id; $("S-title").value=s.title; $("S-desc").value=s.description||"";
      $("S-title-fr").value=s.title_fr||""; $("S-desc-fr").value=s.description_fr||"";
      $("S-status").value=s.status||"published"; $("S-sort").value=s.sort||0;
    });
    document.querySelectorAll("[data-sdel]").forEach(b => b.onclick = async () => {
      if (LESSONS.some(l=>l.series_id===b.dataset.sdel)) { alert("لا يمكن حذف سلسلة تحتوي على دروس. انقل الدروس أولًا."); return; }
      if (!confirm("حذف هذه السلسلة؟")) return;
      if (MODE==="server") await Store.api("/api/admin/series/"+b.dataset.sdel, { method:"DELETE" });
      else { const d=Store.localLoad(); d.series=d.series.filter(x=>x.id!==b.dataset.sdel); Store.localSave(d); }
      await reloadData();
    });
    document.querySelectorAll("[data-cdel]").forEach(b => b.onclick = async () => {
      if (!confirm("حذف هذا التصنيف؟")) return;
      if (MODE==="server") await Store.api("/api/admin/categories/"+b.dataset.cdel, { method:"DELETE" });
      else { const d=Store.localLoad(); d.categories=d.categories.filter(x=>x.id!==b.dataset.cdel); Store.localSave(d); }
      await reloadData();
    });
  }

  async function reloadData(){ if (MODE==="server") await loadServer(); else loadLocal(); }

  async function saveLesson(l){
    const payload = {
      title: l.title, series_id: l.series_id || null, number: l.number ? Number(l.number) : null,
      kind: l.kind || "lesson", date: l.date || null, description: l.description || null,
      title_fr: l.title_fr || null, description_fr: l.description_fr || null,
      khatib: l.khatib || null, place: l.place || null, hijri_date: l.hijri_date || null, author: l.author || null,
      audio_url: l.audio_url || null, pdf_url: l.pdf_url || null, video_url: l.video_url || null,
      text: l.text || null, categories: l.categories || [], tags: l.tags || [],
      status: l.status || "draft", allow_download: l.allow_download !== false, sort: Number(l.sort) || (l.number ? Number(l.number) : 0),
      duration: l.duration || null
    };
    let savedId = l.id || null;
    if (MODE === "server") {
      if (l.id) await Store.api("/api/admin/lessons/"+l.id, { method:"PUT", body: JSON.stringify(payload) });
      else { const r = await Store.api("/api/admin/lessons", { method:"POST", body: JSON.stringify(payload) }); savedId = (r && r.id) || null; }
    } else {
      const d = Store.localLoad();
      if (l.id) { const i = d.lessons.findIndex(x=>x.id===l.id); if(i>=0) d.lessons[i]=Object.assign({},d.lessons[i],payload); }
      else d.lessons.push(Object.assign({ id: uid("l"), created: new Date().toISOString() }, payload));
      Store.localSave(d);
    }
    const isDraft = (l.status || "draft") === "draft";
    $("L-msg").innerHTML = isDraft
      ? '<div class="error" style="background:#fff8e1;border-color:#e6c84a;color:#7a5c00">تم الحفظ، لكنه محفوظ كـ«مسودة» فلن يظهر للزوار. <button type="button" class="btn small" id="pub-now">نشر الآن</button></div>'
      : '<div class="notice">تم الحفظ ونُشر — سيظهر في الموقع.</div>';
    $("lesson-form").reset(); $("L-id").value = "";
    toggleSermonFields(); toggleBookFields();
    await reloadData();
    const pb = $("pub-now");
    if (pb) pb.onclick = async () => {
      pb.disabled = true; pb.textContent = "جارٍ النشر…";
      const row = LESSONS.find(x => x.id === savedId);
      if (row) await saveLesson(Object.assign({}, row, { status: "published" }));
      else { pb.disabled = false; pb.textContent = "نشر الآن"; }
    };
  }

  let UP_PENDING = 0;   // عدد عمليات الرفع الجارية الآن
  window.__upPending = () => UP_PENDING;

  function fmtMB(b){ return (b/1048576).toFixed(1) + "MB"; }

  async function uploadFile(input, kind, statusEl){
    const f = input.files[0];
    if (!f) { alert("اختر ملفًا أولًا"); return null; }
    if (MODE !== "server") { alert("الرفع يتطلب تشغيل الخادم (python3 server.py). في الوضع المحلي الصق رابطًا مباشرًا."); return null; }
    if (statusEl) statusEl.textContent = "جارٍ رفع " + f.name + " (" + fmtMB(f.size) + ")… 0%";
    UP_PENDING++;
    try {
      const url = await new Promise((resolve, reject) => {
        const fd = new FormData(); fd.append("file", f); fd.append("kind", kind);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/upload");
        const t = Store.getToken(); if (t) xhr.setRequestHeader("Authorization", "Bearer " + t);
        xhr.upload.onprogress = e => {
          if (statusEl && e.lengthComputable) statusEl.textContent = "جارٍ رفع " + f.name + " (" + fmtMB(f.size) + ")… " + Math.round(e.loaded / e.total * 100) + "%";
        };
        xhr.onload = () => {
          let j = {}; try { j = JSON.parse(xhr.responseText); } catch (e) {}
          if (xhr.status >= 200 && xhr.status < 300 && j.url) resolve(j.url);
          else reject(new Error(j.error || ("فشل الرفع (رمز " + xhr.status + ")")));
        };
        xhr.onerror = () => reject(new Error("تعذّر الاتصال بالخادم — تأكد أنه يعمل"));
        xhr.send(fd);
      });
      if (statusEl) statusEl.textContent = "✓ تم رفع " + f.name + " بنجاح — الرابط جاهز في الحقل أدناه.";
      return url;
    } finally {
      UP_PENDING--;
    }
  }

  // قبل أي حفظ: ارفع تلقائيًا أي ملف اختاره المستخدم ولم يُرفع بعد (شبكة أمان ضد نسيان الزر)
  async function flushChosenFiles(){
    const pairs = [["L-audio-file","audio","L-audio","L-audio-status"],["L-pdf-file","doc","L-pdf","L-pdf-status"],["Set-photo-file","image","Set-photo","Set-photo-status"]];
    for (const pair of pairs) {
      const inp = $(pair[0]), target = $(pair[2]), st = $(pair[3]);
      if (!inp || !target) continue;
      if (inp.files && inp.files[0] && !target.value.trim()) {
        try { const u = await uploadFile(inp, pair[1], st); if (u) target.value = u; }
        catch (err) { if (st) st.textContent = "✗ " + err.message; throw err; }
      }
    }
  }

  // رفع تلقائي بمجرد اختيار الملف (لا حاجة لزر منفصل — وهي مصيدة التصميم القديمة)
  function autoUpload(inputId, kind, targetId, statusId){
    const inp = $(inputId), st = $(statusId);
    if (!inp) return;
    inp.addEventListener("change", async () => {
      if (!inp.files[0]) return;
      try {
        const u = await uploadFile(inp, kind, st);
        if (u) { $(targetId).value = u; }
      } catch (err) {
        if (st) st.textContent = "✗ " + err.message;
      }
    });
  }

  // تسجيل الدخول
  $("login-form").addEventListener("submit", async e => {
    e.preventDefault();
    const ok = await Store.apiAvailable();
    if (!ok) {
      // وضع محلي: دخول تجريبي
      Store.setToken("local-admin");
      $("login").style.display="none"; $("dash").style.display=""; $("logout").style.display="";
      loadLocal(); return;
    }
    try {
      const r = await Store.api("/api/login", { method:"POST", body: JSON.stringify({ username:$("u").value, password:$("p").value }) });
      Store.setToken(r.token);
      $("login").style.display="none"; $("dash").style.display=""; $("logout").style.display="";
      await loadServer();
    } catch(err){ $("login-err").innerHTML = '<div class="error">'+Store.esc(err.message)+'</div>'; }
  });
  $("logout").onclick = async () => {
    try { if (MODE==="server") await Store.api("/api/logout", { method:"POST" }); } catch(e){}
    Store.setToken(null); location.reload();
  };
  $("adm-q").addEventListener("input", draw);
  $("new-lesson").onclick = () => { showTab("lessons"); $("lesson-form").reset(); $("L-id").value=""; toggleSermonFields(); toggleBookFields(); $("lesson-form-title").textContent="إضافة / تعديل درس"; };
  $("new-khotba").onclick = () => {
    showTab("lessons");
    $("lesson-form").reset(); $("L-id").value = "";
    $("L-kind").value = "khotba";
    toggleSermonFields();
    $("lesson-form-title").textContent = "إضافة خطبة";
    window.scrollTo({ top: $("lesson-form-title").offsetTop - 80, behavior: "smooth" });
    $("L-title").focus();
  };
  $("kh-q").addEventListener("input", draw);
  $("lec-q").addEventListener("input", draw);
  $("bk-q").addEventListener("input", draw);
  $("L-kind").addEventListener("change", function(){ toggleSermonFields(); toggleBookFields(); });
  $("new-general").onclick = () => {
    showTab("lessons");
    $("lesson-form").reset(); $("L-id").value = "";
    $("L-kind").value = "general";
    toggleBookFields(); toggleSermonFields();
    $("lesson-form-title").textContent = "إضافة محاضرة عامة";
    window.scrollTo({ top: $("lesson-form-title").offsetTop - 80, behavior: "smooth" });
  };
  $("new-book").onclick = () => {
    showTab("lessons");
    $("lesson-form").reset(); $("L-id").value = "";
    $("L-kind").value = "book";
    toggleSermonFields(); toggleBookFields();
    $("lesson-form-title").textContent = "إضافة كتاب / بحث / ملف";
    window.scrollTo({ top: $("lesson-form-title").offsetTop - 80, behavior: "smooth" });
  };
  toggleSermonFields(); toggleBookFields();
  $("L-clear").onclick = () => { $("lesson-form").reset(); $("L-id").value=""; toggleSermonFields(); toggleBookFields(); };
  $("S-clear").onclick = () => { $("series-form").reset(); $("S-id").value=""; };

  $("lesson-form").addEventListener("submit", async e => {
    e.preventDefault();
    if (UP_PENDING > 0) { $("L-msg").innerHTML = '<div class="error">انتظر انتهاء رفع الملفات قبل الحفظ (الرفع جارٍ الآن).</div>'; return; }
    try {
      await flushChosenFiles();   // يرفع أي ملف مختار لم يُرفع بعد
      const id = $("L-id").value || null;
      await saveLesson({ id, title:$("L-title").value.trim(), number:$("L-number").value, kind:$("L-kind").value,
        series_id:$("L-series").value, date:$("L-date").value.trim(), description:$("L-desc").value.trim(),
        title_fr:$("L-title-fr").value.trim(), description_fr:$("L-desc-fr").value.trim(),
        khatib:$("L-khatib").value.trim(), place:$("L-place").value.trim(), hijri_date:$("L-hijri").value.trim(),
        author:$("L-author").value.trim(),
        audio_url:$("L-audio").value.trim(), pdf_url:$("L-pdf").value.trim(), video_url:$("L-video").value.trim(),
        text:$("L-text").value, categories:split($("L-cats").value), tags:split($("L-tags").value),
        status:$("L-status").value, allow_download:$("L-dl").value==="1",
        duration:$("L-duration").value.trim(), sort:$("L-sort").value });
    } catch(err){ $("L-msg").innerHTML = '<div class="error">'+Store.esc(err.message)+'</div>'; }
  });
  $("L-preview").onclick = () => {
    const id = $("L-id").value;
    if (!id) { alert("احفظ الدرس أولًا لتتمكن من معاينته"); return; }
    window.open("lesson.html?id="+encodeURIComponent(id)+(MODE==="server"?"&preview=1":""), "_blank");
  };
  // الرفع التلقائي للثلاثة حقول
  autoUpload("L-audio-file","audio","L-audio","L-audio-status");
  autoUpload("L-pdf-file","doc","L-pdf","L-pdf-status");
  autoUpload("Set-photo-file","image","Set-photo","Set-photo-status");

  $("up-audio").onclick = async e => { const b=e.target; b.disabled=true; try{ const u=await uploadFile($("L-audio-file"),"audio",$("L-audio-status")); if(u){$("L-audio").value=u;} }catch(err){alert(err.message);} b.disabled=false; };
  $("up-pdf").onclick = async e => { const b=e.target; b.disabled=true; try{ const u=await uploadFile($("L-pdf-file"),"doc",$("L-pdf-status")); if(u){$("L-pdf").value=u;} }catch(err){alert(err.message);} b.disabled=false; };
  $("up-photo").onclick = async e => { const b=e.target; b.disabled=true; try{ const u=await uploadFile($("Set-photo-file"),"image",$("Set-photo-status")); if(u){$("Set-photo").value=u;} }catch(err){alert(err.message);} b.disabled=false; };

  $("series-form").addEventListener("submit", async e => {
    e.preventDefault();
    const payload = { title:$("S-title").value.trim(), description:$("S-desc").value.trim(),
      title_fr:$("S-title-fr").value.trim(), description_fr:$("S-desc-fr").value.trim(),
      status:$("S-status").value, sort:Number($("S-sort").value||0) };
    const id = $("S-id").value;
    if (MODE==="server") {
      if (id) await Store.api("/api/admin/series/"+id, { method:"PUT", body:JSON.stringify(payload) });
      else await Store.api("/api/admin/series", { method:"POST", body:JSON.stringify(payload) });
    } else {
      const d = Store.localLoad();
      if (id) { const i=d.series.findIndex(x=>x.id===id); if(i>=0) d.series[i]=Object.assign({},d.series[i],payload); }
      else d.series.push(Object.assign({ id:uid("s") }, payload));
      Store.localSave(d);
    }
    $("series-form").reset(); $("S-id").value=""; await reloadData();
  });
  $("cat-form").addEventListener("submit", async e => {
    e.preventDefault();
    const name = $("C-name").value.trim(); if(!name) return;
    if (MODE==="server") await Store.api("/api/admin/categories", { method:"POST", body:JSON.stringify({ name }) });
    else { const d=Store.localLoad(); d.categories.push({ id:uid("c"), name, sort:d.categories.length+1 }); Store.localSave(d); }
    $("C-name").value=""; await reloadData();
  });
  $("settings-form").addEventListener("submit", async e => {
    e.preventDefault();
    try { await flushChosenFiles(); } catch (err) { $("Set-msg").innerHTML = '<div class="error">'+Store.esc(err.message)+'</div>'; return; }
    const payload = { site_title:$("Set-title").value, sheikh_name:$("Set-sheikh").value, tagline:$("Set-tagline").value,
      bio:$("Set-bio").value, photo:$("Set-photo").value.trim(), contact:$("Set-contact").value, footer_note:$("Set-footer").value,
      site_title_fr:$("Set-title-fr").value, sheikh_name_fr:$("Set-sheikh-fr").value, tagline_fr:$("Set-tagline-fr").value,
      bio_fr:$("Set-bio-fr").value, footer_note_fr:$("Set-footer-fr").value };
    if (MODE==="server") await Store.api("/api/admin/settings", { method:"PUT", body:JSON.stringify(payload) });
    else { const d=Store.localLoad(); d.settings=Object.assign({},d.settings,payload); Store.localSave(d); }
    $("Set-msg").innerHTML = '<div class="notice">تم حفظ الإعدادات.</div>'; await reloadData();
  });
  $("pw-form").addEventListener("submit", async e => {
    e.preventDefault();
    if (MODE!=="server"){ alert("تغيير كلمة المرور يتطلب تشغيل الخادم."); return; }
    try { await Store.api("/api/admin/password", { method:"PUT", body:JSON.stringify({ password:$("Pw").value }) }); alert("تم تغيير كلمة المرور"); $("Pw").value=""; }
    catch(err){ alert(err.message); }
  });

  // بدء
  (async () => {
    await refresh();
    if (Store.getToken()) { $("login").style.display="none"; $("dash").style.display=""; $("logout").style.display=""; if(MODE==="server") await loadServer(); else loadLocal(); }
  })();
})();
