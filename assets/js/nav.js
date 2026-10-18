/* القائمة الجانبية على الهاتف: درج ثابت + خلفية معتمة + قفل التمرير */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var btn = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    var bar = document.querySelector(".topbar");
    if (!btn || !nav) return;

    // الخلفية الداكنة خلف القائمة (تنشأ مرة واحدة لكل صفحة)
    var backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);

    function setOpen(open){
      nav.classList.toggle("open", open);
      backdrop.classList.toggle("on", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-lock", open);
      // الدرج يبدأ أسفل الشريط مباشرة ويصل حتى نهاية الشاشة (بلا تغطيته)
      if (open) {
        var top = bar ? bar.offsetHeight : 0;
        nav.style.top = top + "px";
        nav.style.height = (window.innerHeight - top) + "px";
      } else {
        nav.style.top = ""; nav.style.height = "";
      }
    }

    btn.addEventListener("click", function(){
      setOpen(!nav.classList.contains("open"));
    });
    backdrop.addEventListener("click", function(){ setOpen(false); });      // إغلاق بالضغط على الخلفية
    nav.addEventListener("click", function(e){                               // إغلاق عند اختيار رابط
      if (e.target.tagName === "A") setOpen(false);
    });
  });
})();
