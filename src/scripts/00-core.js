/* Core helpers shared by every module. Each file in src/scripts/ is concatenated into
   /assets/js/main.js (see lib/bundle.js). Modules are IIFEs that register on DOMContentLoaded
   via Pedlex.ready() and only touch elements they own (data-* hooks, never classes). */
window.Pedlex = (function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  return {
    config: window.PEDLEX || {},
    reducedMotion: () => reducedMotion.matches,
    ready(fn) {
      if (document.readyState !== "loading") fn();
      else document.addEventListener("DOMContentLoaded", fn);
    },
    $$: (sel, root = document) => Array.from(root.querySelectorAll(sel)),
    push(event, data = {}) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event, ...data });
    },
  };
})();
