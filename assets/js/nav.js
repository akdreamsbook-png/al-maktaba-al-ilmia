/* قائمة الهاتف */
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var btn = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function(){
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function(e){
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  });
})();
