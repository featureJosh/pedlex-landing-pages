/* Scroll reveal for [data-reveal]. Children of [data-reveal-stagger] reveal in sequence
   (80ms apart, capped). Runs once per element. Styles: styles/04-motion.css. */
(function () {
  Pedlex.ready(() => {
    Pedlex.$$("[data-reveal-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.setAttribute("data-reveal", "");
        child.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 80}ms`);
      });
    });
    const items = Pedlex.$$("[data-reveal]");
    if (Pedlex.reducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  });
})();
