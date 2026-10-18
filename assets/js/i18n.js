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
    "nav.ask": { ar: "اسأل الشيخ", fr: "Questions" },
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
    "msg.suggestNone": { ar: "لا نتائج مطابقة — اضغط بحث لعرض صفحة الدروس.", fr: "Aucun résultat — cliquez sur Rechercher pour ouvrir la page des cours." },
    /* ===== اسأل الشيخ ===== */
    "ask.over": { ar: "باب الأسئلة العلمية", fr: "Section des questions" },
    "ask.h1": { ar: "اسأل الشيخ", fr: "Posez votre question au cheikh" },
    "ask.intro": { ar: "أرسل سؤالك مكتوبًا أو صوتيًا، وسيُراجعه فضيلة الشيخ ويجيب عنه بإذن الله. الإجابة العامة تظهر على الموقع بعد اعتمادها.", fr: "Envoyez votre question écrite ou audio ; le cheikh la lira et y répondra, si Dieu le veut. La réponse publique apparaîtra ici après validation." },
    "ask.how": { ar: "كيف تريد إرسال سؤالك؟", fr: "Comment voulez-vous envoyer votre question ?" },
    "ask.mAudio": { ar: "سؤال صوتي", fr: "Question audio" },
    "ask.mAudioS": { ar: "سجّل من جهازك أو ارفع تسجيلًا", fr: "Enregistrez ou importez un audio" },
    "ask.mWritten": { ar: "سؤال مكتوب", fr: "Question écrite" },
    "ask.mWrittenS": { ar: "اكتب سؤالك بالتفصيل", fr: "Écrivez votre question en détail" },
    "ask.fName": { ar: "اسمك (اختياري)", fr: "Votre nom (facultatif)" },
    "ask.fNameP": { ar: "يظهر مع سؤالك إن لم تخفه", fr: "Affiché avec votre question si non masqué" },
    "ask.fContact": { ar: "وسيلة تواصل (اختياري — للإجابة الخاصة)", fr: "Contact (facultatif — réponse privée)" },
    "ask.fContactP": { ar: "بريد إلكتروني أو رقم واتساب", fr: "E-mail ou numéro WhatsApp" },
    "ask.fAnon": { ar: "إخفاء اسمي عن زوار الموقع (يظهر للإدارة فقط)", fr: "Masquer mon nom aux visiteurs (visible de l’administration)" },
    "ask.fCat": { ar: "تصنيف السؤال", fr: "Catégorie de la question" },
    "ask.cat.akida": { ar: "عقيدة", fr: "Croyance" },
    "ask.cat.ibadat": { ar: "عبادات", fr: "Adorations" },
    "ask.cat.muamalat": { ar: "معاملات", fr: "Transactions" },
    "ask.cat.usra": { ar: "أسرة", fr: "Famille" },
    "ask.cat.akhlaq": { ar: "أخلاق", fr: "Mœurs" },
    "ask.cat.other": { ar: "أخرى", fr: "Autres" },
    "ask.fTitle": { ar: "عنوان مختصر للسؤال", fr: "Titre court de la question" },
    "ask.fText": { ar: "نص السؤال بالتفصيل", fr: "Texte détaillé de la question" },
    "ask.fAnsType": { ar: "نوع الإجابة المطلوبة", fr: "Type de réponse souhaité" },
    "ask.ansPublic": { ar: "عامة تُنشر على الموقع", fr: "Publique (publiée sur le site)" },
    "ask.ansPrivate": { ar: "خاصة تصل صاحب السؤال فقط", fr: "Privée (à la personne uniquement)" },
    "ask.ansNote": { ar: "لا تُنشر أي سؤال أو إجابة تلقائيًا؛ النشر بعد مراجعة فضيلة الشيخ أو المسؤول.", fr: "Aucune question ni réponse n’est publiée automatiquement ; publication après examen du cheikh ou de l’administrateur." },
    "ask.send": { ar: "إرسال السؤال", fr: "Envoyer la question" },
    "ask.recStart": { ar: "بدء التسجيل", fr: "Commencer l’enregistrement" },
    "ask.recStop": { ar: "إيقاف التسجيل", fr: "Arrêter" },
    "ask.recDel": { ar: "حذف التسجيل", fr: "Supprimer l’enregistrement" },
    "ask.recHint": { ar: "يمكنك الاستماع إلى التسجيل قبل الإرسال وإعادة تسجيله، أو رفع ملف صوتي مسجَّل مسبقًا.", fr: "Écoutez avant d’envoyer, réenregistrez, ou importez un fichier audio existant." },
    "ask.recOn": { ar: "🎙️ جارٍ التسجيل…", fr: "🎙️ Enregistrement en cours…" },
    "ask.recReady": { ar: "✓ تم التسجيل — استمع قبل الإرسال", fr: "✓ Enregistré — écoutez avant d’envoyer" },
    "ask.recDenied": { ar: "لم يُمنح إذن الميكروفون — فعِّله من إعدادات المتصفح أو استخدم رفع ملف.", fr: "Micro refusé — activez-le dans le navigateur ou importez un fichier." },
    "ask.recNoSupport": { ar: "التسجيل غير مدعوم في هذا المتصفح — استخدم زر رفع ملف صوتي.", fr: "Enregistrement non pris en charge — importez un fichier audio." },
    "ask.uploading": { ar: "⏳ جارٍ رفع التسجيل…", fr: "⏳ Envoi de l’enregistrement…" },
    "ask.fileReady": { ar: "✓ الملف جاهز:", fr: "✓ Fichier prêt :" },
    "ask.tooBig": { ar: "الملف أكبر من الحد المسموح (15MB)", fr: "Fichier trop volumineux (max 15 Mo)" },
    "ask.badType": { ar: "صيغة غير مدعومة — استخدم ملفًا صوتيًا", fr: "Format non pris en charge — fichier audio requis" },
    "ask.errNoMode": { ar: "اختر طريقة الإرسال أولًا", fr: "Choisissez d’abord le mode d’envoi" },
    "ask.errTitle": { ar: "اكتب عنوانًا من 5 أحرف على الأقل", fr: "Titre d’au moins 5 caractères requis" },
    "ask.errText": { ar: "اكتب نص السؤال (10 أحرف على الأقل)", fr: "Texte de la question requis (10 caractères min.)" },
    "ask.errNoRec": { ar: "سجّل صوتك أو ارفع ملفًا صوتيًا", fr: "Enregistrez ou importez un fichier audio" },
    "ask.errContact": { ar: "وسيلة التواصل غير صحيحة (بريد صحيح أو رقم)", fr: "Contact invalide (e-mail ou numéro valides)" },
    "ask.errSend": { ar: "لم يتم الإرسال: ", fr: "Échec de l’envoi : " },
    "ask.okTitle": { ar: "تم استلام سؤالك بنجاح ✓", fr: "Question bien reçue ✓" },
    "ask.okText": { ar: "راجعه فضيلة الشيخ إن شاء الله. إن اخترت الإجابة العامة فستظهر في «أسئلة وأجوبة» بعد الإجابة والاعتماد، وإن كانت خاصة فستصل وسائل التواصل المذكورة.", fr: "Le cheikh la lira, si Dieu le voulez. Réponse publique : affichée dans « Questions & réponses » ; réponse privée : envoyée via votre contact." },
    "ask.okTrack": { ar: "رمز متابعة سؤالك (احفظه):", fr: "Code de suivi (à conserver) :" },
    "ask.copy": { ar: "نسخ", fr: "Copier" },
    "ask.okSee": { ar: "الأسئلة المجاب عنها ↓", fr: "Réponses publiées ↓" },
    "ask.trackT": { ar: "متابعة سؤالك برمز التتبع", fr: "Suivre votre question par code" },
    "ask.trackBtn": { ar: "تتبع", fr: "Suivre" },
    "ask.trackNone": { ar: "لا يوجد سؤال بهذا الرمز", fr: "Aucune question pour ce code" },
    "ask.st.new": { ar: "جديد — بانتظار المراجعة", fr: "Nouvelle — en attente" },
    "ask.st.review": { ar: "قيد المراجعة", fr: "En cours d’examen" },
    "ask.st.answered": { ar: "تمت الإجابة", fr: "Répondue" },
    "ask.st.deferred": { ar: "مؤجل", fr: "Reportée" },
    "ask.answersTitle": { ar: "أسئلة وأجوبة", fr: "Questions et réponses" },
    "ask.answersNote": { ar: "لا تُعرض إلا الأسئلة التي اعتمدها الشيخ ونشر إجابتها عمومًا.", fr: "Seules les questions validées par le cheikh et publiées sont affichées." },
    "ask.searchP": { ar: "ابحث في الأسئلة والأجوبة…", fr: "Rechercher…" },
    "ask.allCats": { ar: "كل التصنيفات", fr: "Toutes les catégories" },
    "ask.noAnswers": { ar: "لا توجد إجابات منشورة بعد.", fr: "Aucune réponse publiée pour l’instant." },
    "ask.sheikhAnswered": { ar: "إجابة فضيلة الشيخ أبي أنس محمد مصطفى صار", fr: "Réponse du cheikh Abû Anas Muhammad Mustafâ Sâr" },
    "ask.pdf": { ar: "افتح الملف", fr: "Ouvrir le fichier" },
    "ask.share": { ar: "مشاركة", fr: "Partager" },
    "ask.copied": { ar: "نُسخ ✓", fr: "Copié ✓" },
    "ask.offlineNote": { ar: "⚠️ استقبال الأسئلة الجديدة يعمل فقط عند اتصال الخادم المباشر (التطبيق المحلي). هذه النسخة تعرض الإجابات المنشورة فقط.", fr: "⚠️ La réception de nouvelles questions fonctionne uniquement avec le serveur actif. Cette version affiche les réponses publiées uniquement." },
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
    const map = { "index.html": "nav.home", "lessons.html": "nav.lessons", "series.html": "nav.series", "books.html": "nav.books", "ask.html": "nav.ask", "admin.html": "nav.admin" };
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


