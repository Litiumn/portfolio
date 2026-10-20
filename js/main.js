// 006: scroll-driven section fades (progressive enhancement; no-JS stays opaque)
(function () {
  'use strict';

  const sections = Array.from(document.querySelectorAll('main > section'));
  const nav = document.querySelector('.topnav');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function clearFades() {
    sections.forEach(function (section) {
      section.style.opacity = '';
    });
  }

  if (reduced.matches) {
    clearFades();
    return;
  }

  function update() {
    const navH = nav ? nav.offsetHeight : 0;
    const vh = window.innerHeight;
    const range = vh * 0.5;
    sections.forEach(function (section) {
      const rect = section.getBoundingClientRect();
      // Fade in while the top edge rises from the bottom of the viewport;
      // fade out while the bottom edge sinks under the nav. A section whose
      // top is well inside the viewport and bottom is well below the nav is 1.
      const fadeIn = (vh - rect.top) / range;
      const fadeOut = (rect.bottom - navH) / range;
      const o = Math.min(1, Math.max(0, Math.min(fadeIn, fadeOut)));
      section.style.opacity = String(o);
    });
  }

  let ticking = false;
  function schedule() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
})();