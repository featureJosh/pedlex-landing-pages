/* Trust marquee: turns each [data-marquee] logo row into a slow, seamless horizontal loop.
   The list is cloned so the rail holds two identical halves (CSS slides it by -50%); clones are
   aria-hidden with empty alts so assistive tech reads each company once. If one set is narrower
   than the viewport, each half repeats it so the loop never shows a gap, and the duration grows to
   keep the same speed. Reduced motion (or no JS): nothing runs and the static centred row stays.
   Markup: sections/trust.njk. Styles: styles/sections/trust.css. */
(function () {
  const SECONDS_PER_SET = 40;

  Pedlex.ready(() => {
    if (Pedlex.reducedMotion()) return;
    Pedlex.$$("[data-marquee]").forEach((root) => {
      const rail = root.querySelector("[data-marquee-rail]");
      const list = rail && rail.querySelector("[data-marquee-list]");
      if (!list || !list.children.length) return;

      // Switch to the single-line layout first so the set can be measured as it will scroll.
      root.setAttribute("data-marquee-ready", "");
      const setWidth = list.getBoundingClientRect().width;
      if (!setWidth) return root.removeAttribute("data-marquee-ready");
      const perHalf = Math.max(1, Math.ceil(root.clientWidth / setWidth));

      for (let i = 1; i < perHalf * 2; i++) {
        const clone = list.cloneNode(true);
        clone.removeAttribute("data-marquee-list");
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("img").forEach((img) => { img.alt = ""; });
        rail.appendChild(clone);
      }
      root.style.setProperty("--trust-loop", `${SECONDS_PER_SET * perHalf}s`);
    });
  });
})();
