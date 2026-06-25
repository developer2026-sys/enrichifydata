/* Enrichify — minimal site JS: mobile nav toggle + footer year */
(function () {
  "use strict";

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      var open = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is tapped
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  // Current year in footer
  var y = document.querySelectorAll("[data-year]");
  y.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
