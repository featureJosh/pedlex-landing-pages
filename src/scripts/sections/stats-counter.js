/* Stats counters: when a [data-stats] group enters the viewport, every [data-count-to] inside it
   counts up from 0 to its target over ~1.4s (ease-out), once. The HTML already holds the final
   value (no-JS and screen readers read it; the animated span is aria-hidden in the markup).
   Skipped entirely under reduced motion. Markup: sections/stats.njk. */
(function () {
  const DURATION = 1400;
  const easeOut = (t) => 1 - Math.pow(1 - t, 4); // quartic: settles early, glides in

  function run(group) {
    const items = Pedlex.$$("[data-count-to]", group).map((el) => ({ el, to: Number(el.dataset.countTo) }));
    const start = performance.now();
    (function frame(now) {
      const t = Math.min(1, (now - start) / DURATION);
      items.forEach(({ el, to }) => { el.textContent = String(Math.round(to * easeOut(t))); });
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  Pedlex.ready(() => {
    const groups = Pedlex.$$("[data-stats]");
    if (!groups.length || Pedlex.reducedMotion() || !("IntersectionObserver" in window)) return;

    groups.forEach((group) => {
      Pedlex.$$("[data-count-to]", group).forEach((el) => {
        const to = Number(el.dataset.countTo);
        if (!Number.isFinite(to)) return el.removeAttribute("data-count-to");
        // Reserve the final width (tabular digits) so the suffix doesn't shift while counting.
        el.style.minWidth = `${String(to).length}ch`;
        el.textContent = "0";
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          run(entry.target);
        });
      },
      // Starts once the row is clearly on screen; a margin (not a ratio) so tall rows still fire.
      { rootMargin: "0px 0px -15% 0px", threshold: 0 }
    );
    groups.forEach((g) => io.observe(g));
  });
})();
