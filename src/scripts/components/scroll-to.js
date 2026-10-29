/* Every CTA ([data-scroll-to], rendered by the button macro) scrolls to the form and puts
   the cursor in the first field, so an impatient visitor can start typing immediately.
   Also pushes a cta_click event so Maïeutyk can see which CTA position converts. */
(function () {
  Pedlex.ready(() => {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-scroll-to]");
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: Pedlex.reducedMotion() ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      const field = target.querySelector("input:not([type=hidden]):not([tabindex='-1']), textarea, select");
      // Focus after the smooth scroll settles; preventScroll avoids a second jump.
      setTimeout(() => field && field.focus({ preventScroll: true }), Pedlex.reducedMotion() ? 0 : 650);
      const section = link.closest("section[id], header, footer");
      Pedlex.push("cta_click", { cta_location: section ? section.id || section.tagName.toLowerCase() : "unknown" });
    });
  });
})();
