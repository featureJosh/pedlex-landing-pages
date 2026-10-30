/* Testimonials row: on phones it is a horizontal scroller, so keyboard users need it in the tab
   order (tabindex="0" lets the arrow keys scroll it). From 48rem it is a static grid: no tab stop.
   Markup: sections/reviews.njk ([data-reviews-row]). */
(function () {
  Pedlex.ready(() => {
    const rows = Pedlex.$$("[data-reviews-row]");
    if (!rows.length) return;
    const update = () => rows.forEach((row) => {
      if (row.scrollWidth > row.clientWidth + 1) row.setAttribute("tabindex", "0");
      else row.removeAttribute("tabindex");
    });
    update();
    window.addEventListener("resize", update, { passive: true });
  });
})();
