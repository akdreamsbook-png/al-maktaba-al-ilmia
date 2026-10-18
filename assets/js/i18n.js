/* الترجمة الثنائية: العربية (افتراضي) + الفرنسية
   - تفضيل الزائر يُحفظ في localStorage
   - محتوى الدروس/السلاسل: يُعرض الحقل الفرنسي إن وُجد، وإلا العربي تلقائيًا
*/
const I18N = (function () {
  const KEY = "ablib_lang";
  let lang = "ar";
  // ?lang=fr أو ?lang=ar في الرابط يحدّد اللغة ويُحفظ للزيارات القادمة (روابط قابلة للمشاركة)
  try {
    const qp = new URLSearchParams(location.search).get("lang");
    if (qp === "fr" || qp === "ar") localStorage.setItem(KEY, qp);
  } catch (e) {}
  try { lang = localStorage.getItem(KEY) || "ar"; } catch (e) {}
  if (lang !== "fr") lang = "ar";

  const D = {
    /* الشريط العام */
    "brand": { ar: "المكتبة العلمية", fr: "Bibliothèque scientifique" },
    "brand.sheikh": { ar: "فضيلة الشيخ أبو أنس محمد مصطفى صار", fr: "Cheikh Abû Anas Muhammad Mustafâ Sâr" },
    "footer.title": { ar: "المكتبة العلمية لفضيلة الشيخ أبي أنس محمد مصطفى صار", fr: "Bibliothèque scientifique de Cheikh Abû Anas Muhammad Mustafâ Sâr" },
    "nav.home": { ar: "الرئيسية", fr: "Accueil" },
    "nav.lessons": { ar: "الدروس", fr: "Cours" },
    "nav.series": { ar: "السلاسل العلمية", fr: "Séries" },
    "nav.khotab": { ar: "الخطب", fr: "Sermons" },
    "nav.lectures": { ar: "المحاضرات", fr: "Conférences" },
    "nav.books": { ar: "الكتب والبحوث", fr: "Livres" },
    "nav.admin": { ar: "🔒 لوحة التحكم", fr: "🔒 Admin" },
    "nav.menu": { ar: "القائمة", fr: "Menu" },
    /* التذييل */
    "footer.sections": { ar: "أقسام المكتبة", fr: "Sections" },
    "footer.contact": { ar: "تواصل", fr: "Contact" },
    "footer.adminLogin": { ar: "دخول المشرف 🔒", fr: "Espace administrateur 🔒" },
    "footer.lLessons": { ar: "الدروس العلمية", fr: "Cours scientifiques" },
    "footer.lSeries": { ar: "السلاسل العلمية", fr: "Séries scientifiques" },
    "footer.lLectures": { ar: "الخطب", fr: "Sermons" },
    "footer.lGeneral": { ar: "المحاضرات العامة", fr: "Conférences générales" },
    "footer.lBooks": { ar: "الكتب والبحوث والملفات", fr: "Livres, recherches et fichiers" },
    /* الرئيسية */
    "home.overTitle": { ar: "📚 المكتبة العلمية الرسمية", fr: "📚 Bibliothèque scientifique officielle" },
    "home.ctaLessons": { ar: "تصفح الدروس", fr: "Parcourir les cours" },
    "home.ctaSeries": { ar: "استكشف السلاسل العلمية", fr: "Découvrir les séries" },
    "home.searchPh": { ar: "ابحث عن درس أو محاضرة أو سلسلة علمية...", fr: "Rechercher un cours, une conférence ou une série…" },
    "home.searchBtn": { ar: "بحث", fr: "Rechercher" },
    "home.statLessons": { ar: "الدروس العلمية", fr: "Cours" },
    "home.statKhotab": { ar: "الخطب", fr: "Sermons" },
    "home.statLectures": { ar: "المحاضرات العامة", fr: "Conférences" },
    "home.statSeries": { ar: "السلاسل العلمية", fr: "Séries" },
    "home.statBooks": { ar: "الكتب والبحوث", fr: "Livres" },
    "home.photoCap": { ar: "صورة الشيخ — تُضاف من لوحة التحكم", fr: "Photo du cheikh — ajoutée depuis l’administration" },
    "home.kickLibrary": { ar: "المكتبة العلمية", fr: "Bibliothèque scientifique" },
    "home.secLatest": { ar: "أحدث الدروس", fr: "Derniers cours" },
    "home.kickSystem": { ar: "منظومة متكاملة", fr: "Un ensemble complet" },
    "home.secSeries": { ar: "السلاسل العلمية المميزة", fr: "Séries en vedette" },
    "home.kickSermons": { ar: "مواعظ وكلمات", fr: "Exhortations et paroles" },
    "home.secLectures": { ar: "الخطب", fr: "Sermons" },
    "home.kickMedia": { ar: "في اللقاءات — صوتية أو مرئية", fr: "Lors des rencontres — audio ou vidéo" },
    "home.secMedia": { ar: "المحاضرات العامة", fr: "Conférences générales" },
    "home.kickBooks": { ar: "للقراءة والتحميل", fr: "À lire et à télécharger" },
    "home.secBooks": { ar: "الكتب والبحوث والملفات", fr: "Livres, recherches et documents" },
    "btn.viewAll": { ar: "عرض الكل ←", fr: "Voir tout ←" },
    "btn.viewAllResults": { ar: "عرض كل النتائج ←", fr: "Voir tous les résultats ←" },
    /* أنواع الدروس */
    "kind.lesson": { ar: "درس علمي", fr: "Cours" },
    "kind.lecture": { ar: "محاضرة/خطبة", fr: "Conférence / sermon" },
    "kind.khotba": { ar: "خطبة", fr: "Sermon" },
    "kind.general": { ar: "محاضرة عامة", fr: "Conférence générale" },
    "kind.audio": { ar: "صوتي", fr: "Audio" },
    "kind.video": { ar: "مرئي", fr: "Vidéo" },
    "kind.book": { ar: "كتاب", fr: "Livre" },
    "kind.research": { ar: "بحث علمي", fr: "Recherche" },
    "kind.file": { ar: "ملف/وثيقة", fr: "Document" },
    "word.lesson": { ar: "درس", fr: "Cours" },
    "count.lessons": { ar: "%d درسًا", fr: "%d cours" },
    /* أزرار شائعة */
    "btn.details": { ar: "التفاصيل", fr: "Détails" },
    "btn.listen": { ar: "استماع", fr: "Écouter" },
    "btn.viewLesson": { ar: "عرض الدرس", fr: "Voir le cours" },
    "btn.view": { ar: "عرض", fr: "Voir" },
    "btn.downloadPdf": { ar: "تنزيل PDF", fr: "Télécharger le PDF" },
    "btn.seriesOpen": { ar: "عرض دروس السلسلة", fr: "Voir les cours de la série" },
    "btn.shareLesson": { ar: "مشاركة الدرس", fr: "Partager le cours" },
    "btn.shareSeries": { ar: "مشاركة السلسلة", fr: "Partager la série" },
    "btn.copyLink": { ar: "نسخ الرابط", fr: "Copier le lien" },
    /* صفحة الدروس */
    "lessons.title": { ar: "الدروس والمحاضرات والخطب", fr: "Cours, conférences et sermons" },
    "lessons.searchPh": { ar: "بحث بعنوان الدرس أو السلسلة أو الموضوع…", fr: "Rechercher par titre, série ou thème…" },
    "filter.allSeries": { ar: "كل السلاسل", fr: "Toutes les séries" },
    "filter.allCats": { ar: "كل التصنيفات", fr: "Toutes les catégories" },
    "filter.allKinds": { ar: "كل الأنواع", fr: "Tous les types" },
    "lessons.count": { ar: "عدد النتائج: ", fr: "Résultats : " },
    "lessons.noResults": { ar: "لا توجد نتائج مطابقة. جرّب كلمة أخرى أو أزل الفلاتر.", fr: "Aucun résultat. Essayez un autre mot ou retirez les filtres." },
    /* السلاسل */
    "series.title": { ar: "السلاسل العلمية", fr: "Séries scientifiques" },
    "series.empty": { ar: "لا توجد سلاسل علمية منشورة بعد.", fr: "Aucune série publiée pour le moment." },
    "series.notFound": { ar: "السلسلة غير موجودة أو غير منشورة.", fr: "Série introuvable ou non publiée." },
    "series.noId": { ar: "لم تُحدَّد السلسلة.", fr: "Aucune série indiquée." },
    "series.lessonsOf": { ar: "دروس السلسلة", fr: "Cours de la série" },
    "series.lessonsEmpty": { ar: "لا توجد دروس منشورة في هذه السلسلة بعد.", fr: "Aucun cours publié dans cette série pour le moment." },
    "badge.audio": { ar: "🎧 صوتي", fr: "🎧 Audio" },
    "badge.file": { ar: "📄 ملف", fr: "📄 Document" },
    /* صفحة الدرس */
    "lesson.loading": { ar: "جارٍ تحميل الدرس…", fr: "Chargement du cours…" },
    "lesson.noId": { ar: "لم يُحدَّد الدرس.", fr: "Aucun cours indiqué." },
    "lesson.notFound": { ar: "الدرس غير موجود أو غير منشور.", fr: "Cours introuvable ou non publié." },
    "lesson.seriesLbl": { ar: "السلسلة", fr: "Série" },
    "lesson.numberLbl": { ar: "رقم الدرس", fr: "Numéro" },
    "lesson.durationLbl": { ar: "⏱ المدة", fr: "⏱ Durée" },
    "lesson.dateLbl": { ar: "التاريخ", fr: "Date" },
    "lesson.audioTitle": { ar: "🎧 التسجيل الصوتي", fr: "🎧 Enregistrement audio" },
    "lesson.noAudio": { ar: "لا يوجد تسجيل صوتي مرفق بهذا الدرس.", fr: "Aucun enregistrement audio n’est joint à ce cours." },
    "lesson.back10": { ar: "−10 ثوانٍ", fr: "−10 secondes" },
    "lesson.playPause": { ar: "تشغيل / إيقاف", fr: "Lecture / Pause" },
    "lesson.fwd10": { ar: "+10 ثوانٍ", fr: "+10 secondes" },
    "lesson.speed": { ar: "السرعة", fr: "Vitesse" },
    "lesson.videoTitle": { ar: "الدرس المرئي", fr: "Vidéo du cours" },
    "lesson.watchVideo": { ar: "مشاهدة الفيديو", fr: "Regarder la vidéo" },
    "lesson.pdfTitle": { ar: "الملف العلمي المرفق", fr: "Document joint" },
    "lesson.downloadFile": { ar: "تنزيل الملف", fr: "Télécharger le fichier" },
    "lesson.imagesTitle": { ar: "الصور المرفقة", fr: "Images jointes" },
    "lesson.textTitle": { ar: "التفريغ النصي", fr: "Transcription" },
    "lesson.tagsTitle": { ar: "التصنيفات والكلمات المفتاحية", fr: "Catégories et mots-clés" },
    "lesson.prev": { ar: "السابق", fr: "Précédent" },
    "lesson.next": { ar: "التالي", fr: "Suivant" },
    "lesson.khatibLbl": { ar: "الخطيب", fr: "Prédicateur" },
    "lesson.placeLbl": { ar: "مكان الخطبة", fr: "Lieu de la khutba" },
    "lesson.hijriLbl": { ar: "التاريخ الهجري", fr: "Date hégirienne" },
    "lesson.authorLbl": { ar: "المؤلّف", fr: "Auteur" },
    "lesson.lecturerLbl": { ar: "المحاضر", fr: "Conférencier" },
    "lesson.venueLbl": { ar: "مكان اللقاء", fr: "Lieu de la rencontre" },
    "medium.audio": { ar: "صوتية", fr: "Audio" },
    "medium.video": { ar: "مرئية", fr: "Vidéo" },
    "msg.copied": { ar: "تم نسخ الرابط", fr: "Lien copié" },
    "msg.copiedLesson": { ar: "تم نسخ رابط الدرس", fr: "Lien du cours copié" },
    "msg.copiedSeries": { ar: "تم نسخ رابط السلسلة", fr: "Lien de la série copié" },
    /* الكتب */
    "books.title": { ar: "الكتب والبحوث والملفات العلمية", fr: "Livres, recherches et documents" },
    "books.empty": { ar: "لا توجد كتب أو ملفات منشورة بعد.", fr: "Aucun livre ou fichier publié pour le moment." },
    /* رسائل عامة */
    "home.emptyLatest": { ar: "لا توجد دروس منشورة بعد — تُضاف الدروس من لوحة التحكم.", fr: "Aucun cours publié pour le moment — les cours s’ajoutent depuis l’administration." },
    "home.emptySeries": { ar: "لا توجد سلاسل علمية بعد — تُنشأ من لوحة التحكم.", fr: "Aucune série pour le moment — les séries se créent depuis l’administration." },
    "home.emptyLectures": { ar: "لا توجد خطب منشورة بعد — تُضاف بنوع «خطبة» من اللوحة.", fr: "Aucun sermon publié pour le moment — ils s’ajoutent depuis l’administration." },
    "home.emptyMedia": { ar: "لا توجد محاضرات عامة منشورة بعد — تُضاف بنوع «محاضرة عامة» من اللوحة.", fr: "Aucune conférence générale publiée pour le moment — elles s’ajoutent depuis l’administration." },
    "home.emptyBooks": { ar: "لا توجد كتب أو ملفات منشورة بعد.", fr: "Aucun livre ou fichier publié pour le moment." },
    "title.home": { ar: "المكتبة العلمية لفضيلة الشيخ أبي أنس محمد مصطفى صار", fr: "Bibliothèque scientifique de Cheikh Abû Anas Muhammad Mustafâ Sâr" },
    "title.lessons": { ar: "الدروس والمحاضرات — المكتبة العلمية", fr: "Cours et conférences — Bibliothèque scientifique" },
    "title.series": { ar: "السلاسل العلمية — المكتبة العلمية", fr: "Séries scientifiques — Bibliothèque scientifique" },
    "title.seriesView": { ar: "السلسلة — المكتبة العلمية", fr: "Série — Bibliothèque scientifique" },
    "title.lesson": { ar: "الدرس — المكتبة العلمية", fr: "Cours — Bibliothèque scientifique" },
    "title.books": { ar: "الكتب والملفات — المكتبة العلمية", fr: "Livres et fichiers — Bibliothèque scientifique" },
    "title.admin": { ar: "لوحة التحكم — المكتبة العلمية", fr: "Administration — Bibliothèque scientifique" },
    "common.loading": { ar: "جارٍ التحميل…", fr: "Chargement…" },
    "msg.loadError": { ar: "تعذر تحميل البيانات: ", fr: "Impossible de charger les données : " },
    "msg.localMode": { ar: "وضع العرض المحلي — شغّل الخادم (server.py) لعرض البيانات المركزية.", fr: "Mode local — lancez le serveur (server.py) pour afficher les données centralisées." },
    "msg.suggestNone": { ar: "لا نتائج مطابقة — اضغط بحث لعرض صفحة الدروس.", fr: "Aucun résultat — cliquez sur Rechercher pour ouvrir la page des cours." }
  };

  function t(key) {
    const e = D[key];
    if (!e) return key;
    return e[lang] || e.ar || key;
  }
  function tf(key, n) { return t(key).replace("%d", n); }
  /* محتوى: يُعرض الحقل الفرنسي إن وُجد، وإلا العربي */
  function ct(item) {
    if (!item) return "";
    if (lang === "fr" && String(item.title_fr || "").trim()) return item.title_fr;
    return item.title || "";
  }
  function cd(item) {
    if (!item) return "";
    if (lang === "fr" && String(item.description_fr || "").trim()) return item.description_fr;
    return item.description || "";
  }
  /* إعدادات الموقع: نسخة فرنسية إن وُجدت */
  function st(settings, key) {
    if (!settings) return "";
    if (lang === "fr") {
      const v = settings[key + "_fr"];
      if (v && String(v).trim()) return v;
    }
    return settings[key] || "";
  }

  function applyDir() {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = (lang === "ar") ? "rtl" : "ltr";
    if (document.body) document.body.classList.toggle("lang-fr", lang === "fr");
  }
  function setLang(l) {
    lang = (l === "fr") ? "fr" : "ar";
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    applyDir();
  }

  const TITLES = {
    "المكتبة العلمية لفضيلة الشيخ أبي أنس محمد مصطفى صار": "title.home",
    "الدروس والمحاضرات — المكتبة العلمية": "title.lessons",
    "السلاسل العلمية — المكتبة العلمية": "title.series",
    "السلسلة — المكتبة العلمية": "title.seriesView",
    "الدرس — المكتبة العلمية": "title.lesson",
    "الكتب والملفات — المكتبة العلمية": "title.books",
    "لوحة التحكم — المكتبة العلمية": "title.admin"
  };

  function applyStatic() {
    const tk = TITLES[document.title];
    if (tk && lang === "fr") document.title = t(tk);
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    document.querySelectorAll("[data-i18n-title]").forEach(el => { el.title = t(el.getAttribute("data-i18n-title")); });
    const map = { "index.html": "nav.home", "lessons.html": "nav.lessons", "series.html": "nav.series", "books.html": "nav.books", "admin.html": "nav.admin" };
    document.querySelectorAll("#main-nav a").forEach(a => {
      const href = (a.getAttribute("href") || "").split("?")[0];
      const key = map[href];
      if (key && !a.hasAttribute("data-i18n")) a.textContent = t(key);
    });
    const brandB = document.querySelector(".brand .t b");
    if (brandB) brandB.textContent = t("brand");
    document.querySelectorAll(".brand .t small").forEach(el => { el.textContent = t("brand.sheikh"); });
    document.querySelectorAll("footer .copy").forEach(el => { el.textContent = t("footer.title"); });
    // في صفحة الدروس: أبرِز الرابطة المطابقة للنوع (?kind=khotba / ?kind=general)
    if (/lessons\.html/.test(location.pathname)) {
      const kk = { khotba: "nav.khotab", general: "nav.lectures" }[new URLSearchParams(location.search).get("kind")];
      if (kk) document.querySelectorAll("#main-nav a").forEach(a => {
        if (a.getAttribute("data-i18n") === kk) {
          document.querySelectorAll("#main-nav a.active").forEach(x => x.classList.remove("active"));
          a.classList.add("active");
        }
      });
    }
    const menuBtn = document.getElementById("nav-toggle");
    if (menuBtn) menuBtn.setAttribute("aria-label", t("nav.menu"));
  }

  function switcher() {
    if (document.querySelector(".langbar")) return;
    const bar = document.createElement("div");
    bar.className = "langbar";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Language / اللغة");
    bar.innerHTML = '<button type="button" data-l="ar" title="العربية" aria-label="العربية">AR</button><button type="button" data-l="fr" title="Français" aria-label="Français">FR</button>';
    bar.querySelector(lang === "ar" ? '[data-l="ar"]' : '[data-l="fr"]').classList.add("on");
    bar.querySelectorAll("button").forEach(b => {
      b.addEventListener("click", () => { setLang(b.getAttribute("data-l")); location.reload(); });
    });
    const wrap = document.querySelector(".topbar .wrap") || document.body;
    const brandEl = wrap.querySelector(".brand");
    if (brandEl && brandEl.nextSibling) wrap.insertBefore(bar, brandEl.nextSibling);
    else if (brandEl) wrap.appendChild(bar);
    else wrap.insertBefore(bar, wrap.firstChild);
  }

  function init() { applyDir(); switcher(); applyStatic(); }
  applyDir();                               // بلا وميض: تُضبط فورًا
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return { get lang() { return lang; }, t, tf, ct, cd, st, setLang, applyStatic, init, isFr: () => lang === "fr" };
})();

function t(k) { return I18N.t(k); }
function tf(k, n) { return I18N.tf(k, n); }
