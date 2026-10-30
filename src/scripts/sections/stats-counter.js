/* Stats counters: when a [data-stats] group is on screen, every [data-count-to] inside it counts up
   from 0 to its target over ~1.4s (ease-out), once. The HTML already holds the final value and
   nothing is zeroed in advance: until the group is visible it shows the real figures (no-JS, slow
   scripts and screen readers read them; the animated span is aria-hidden in the markup). A group that
   is already visible on load (the hero strip) counts immediately.
   Skipped entirely under reduced motion. Markup: partials/proof-strip.njk (in the hero). */
(function () {
  const DURATION = 1400;
  const easeOut = (t) => 1 - Math.pow(1 - t, 4); // quartic: settles early, glides in

  // Same grouping as the `num` filter in eleventy.config.js, so the end state matches the HTML.
  const fmt = new Intl.NumberFormat(`${document.documentElement.lang.slice(0, 2) || "fr"}-CA`);

  function run(group) {
    const items = Pedlex.$$("[data-count-to]", group)
      .map((el) => ({ el, to: Number(el.dataset.countTo) }))
      .filter(({ to }) => Number.isFinite(to));
    // Reserve each final width so the suffix doesn't shift while counting. Measured here, not at
    // ready: by now the webfont has loaded (and the group separator is narrower than a digit).
    items.forEach(({ el, to }) => {
      el.textContent = fmt.format(to);
      el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    });
    const start = performance.now();
    (function frame(now) {
      const t = Math.min(1, (now - start) / DURATION);
      items.forEach(({ el, to }) => { el.textContent = fmt.format(Math.round(to * easeOut(t))); });
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  Pedlex.ready(() => {
    const groups = Pedlex.$$("[data-stats]");
    if (!groups.length || Pedlex.reducedMotion() || !("IntersectionObserver" in window)) return;

    // Fires as soon as any part of the group is in the viewport (no inset margin: a strip at the
    // bottom edge of the first screen must count too). The first callback reports the initial state.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target);
      });
    });
    groups.forEach((g) => io.observe(g));
  });
})();
