/* Every CTA ([data-scroll-to], rendered by the button macro) scrolls to the form and puts
   the cursor in the first field, so an impatient visitor can start typing immediately.
   Below 64rem (stacked layout) it lands on the form card itself ([data-scroll-anchor] inside the
   target) rather than the section's heading, so the focused field is on screen on short phones.
   Also pushes a cta_click event so Maïeutyk can see which CTA position converts. */
(function () {
  const stacked = window.matchMedia("(max-width: 63.99rem)");

  Pedlex.ready(() => {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-scroll-to]");
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const anchor = (stacked.matches && target.querySelector("[data-scroll-anchor]")) || target;
      anchor.scrollIntoView({ behavior: Pedlex.reducedMotion() ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      const field = target.querySelector("input:not([type=hidden]):not([tabindex='-1']), textarea, select");
      // Focus after the smooth scroll settles; preventScroll avoids a second jump.
      setTimeout(() => field && field.focus({ preventScroll: true }), Pedlex.reducedMotion() ? 0 : 650);
      const section = link.closest("section[id], header, footer");
      Pedlex.push("cta_click", { cta_location: section ? section.id || section.tagName.toLowerCase() : "unknown" });
    });
  });
})();
