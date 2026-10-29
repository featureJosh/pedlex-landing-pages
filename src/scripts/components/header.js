/* Header: toggles [data-scrolled] once the page leaves the top, for the border/shadow state. */
(function () {
  Pedlex.ready(() => {
    const header = document.querySelector("[data-header]");
    if (!header) return;
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none";
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => header.toggleAttribute("data-scrolled", !e.isIntersecting)).observe(sentinel);
  });
})();
