/* القائمة الجانبية على الهاتف: درج ثابت + خلفية معتمة + قفل التمرير */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var btn = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    var bar = document.querySelector(".topbar");
    if (!btn || !nav || !bar) return;

    var wrap = bar.querySelector(".wrap");
    var backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);

    var open = false;
    function isMobile(){ return window.matchMedia && window.matchMedia("(max-width:820px)").matches; }

    // على الهاتف: انقل الدرج خارج الشريط (sticky) كي يكون position:fixed
    // بالنسبة للشاشة في كل المتصفحات؛ وعند العودة للحاسوب أعده لموضعه.
    function place(){
      if (isMobile()) { if (nav.parentElement !== document.body) document.body.appendChild(nav); }
      else if (nav.parentElement !== wrap) wrap.appendChild(nav);
    }

    function setOpen(v){
      open = v;
      place();
      nav.classList.toggle("open", v);
      backdrop.classList.toggle("on", v);
      btn.setAttribute("aria-expanded", v ? "true" : "false");
      document.body.classList.toggle("nav-lock", v);
      var top = (bar && v) ? bar.offsetHeight : 0;
      if (v) {
        nav.style.top = top + "px";
        nav.style.height = (window.innerHeight - top) + "px";
      } else {
        nav.style.top = ""; nav.style.height = "";
      }
    }

    // أحداث موثوقة للهاتف والحاسوب معًا (بلا تكرار الرفع المزدوج)
    function onTap(el, fn){
      if ("ontouchend" in window) el.addEventListener("touchend", function(e){ e.preventDefault(); fn(e); });
      else el.addEventListener("click", fn);
    }
    onTap(btn, function(){ setOpen(!open); });
    onTap(backdrop, function(){ setOpen(false); });                    // إغلاق بالضغط على الخلفية
    nav.addEventListener("click", function(e){                          // إغلاق عند اختيار رابط
      var el = e.target;
      while (el && el !== nav) { if (el.tagName === "A") { setOpen(false); return; } el = el.parentElement; }
    });
    window.addEventListener("resize", function(){ place(); if (open) setOpen(true); });
  });
})();
