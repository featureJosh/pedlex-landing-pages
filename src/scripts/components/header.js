/* Header: toggles [data-scrolled] (solid header with the call button + CTA) as soon as the header
   sticks, i.e. once the top bar ([data-topbar]) has scrolled away. At rest the first screen shows the
   hero CTA only; a short scroll brings the header CTA in, even while the hero CTA is still visible
   (Josh, 2026-10-30: a brief duplicate is fine, a late header is not). */
(function () {
  Pedlex.ready(() => {
    const header = document.querySelector("[data-header]");
    if (!header) return;
    const set = (on) => header.toggleAttribute("data-scrolled", on);

    const topbar = document.querySelector("[data-topbar]");
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;pointer-events:none";
    sentinel.style.height = `${Math.max(8, topbar ? topbar.offsetHeight : 0)}px`;
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => set(!e.isIntersecting)).observe(sentinel);
  });
})();
