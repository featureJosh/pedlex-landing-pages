/* Gallery carousel ([data-carousel]). Progressive enhancement over a native scroll-snap row:
   prev/next scroll one slide (smooth unless reduced motion), buttons are aria-disabled at the ends,
   the counter follows the scroll position (rAF-throttled), and ←/→/Home/End work when the track has
   focus. No autoplay. Without JS the row simply scrolls and the controls stay hidden.
   Markup: sections/gallery.njk · Styles: styles/sections/gallery.css */
(function () {
  Pedlex.ready(() => {
    Pedlex.$$("[data-carousel]").forEach(init);
  });

  function init(root) {
    const track = root.querySelector("[data-carousel-track]");
    const slides = Pedlex.$$("[data-carousel-slide]", root);
    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");
    const current = root.querySelector("[data-carousel-current]");
    const currentSr = root.querySelector("[data-carousel-current-sr]");
    if (!track || slides.length < 2 || !prev || !next) return;

    const pad = slides.length < 10 ? 2 : 1;
    const EDGE = 4; // px tolerance for sub-pixel scroll positions
    let index = -1;
    let frame = 0;

    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const offsetOf = (i) => slides[i].offsetLeft - slides[0].offsetLeft;

    // Slide whose left edge is nearest the snap line.
    function snapIndex() {
      const x = track.scrollLeft;
      let best = 0;
      slides.forEach((_, i) => {
        if (Math.abs(offsetOf(i) - x) < Math.abs(offsetOf(best) - x)) best = i;
      });
      return best;
    }

    // Counter value. At the far end the last slide is fully in view even though it can't reach
    // the snap line, so report it as current.
    function nearest() {
      return track.scrollLeft >= maxScroll() - EDGE ? slides.length - 1 : snapIndex();
    }

    function setDisabled(btn, off) {
      btn.setAttribute("aria-disabled", String(off));
    }

    function update() {
      frame = 0;
      const x = track.scrollLeft;
      setDisabled(prev, x <= EDGE);
      setDisabled(next, x >= maxScroll() - EDGE);
      const i = nearest();
      if (i === index) return;
      index = i;
      if (current) current.textContent = String(i + 1).padStart(pad, "0");
      if (currentSr) currentSr.textContent = String(i + 1);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function scrollToX(left) {
      track.scrollTo({ left, behavior: Pedlex.reducedMotion() ? "auto" : "smooth" });
    }

    // Positions the buttons/keys stop at: every slide start, plus the clamped end of the row.
    // When several slides are in view the end sits a little past the last reachable slide start;
    // a start closer than half a slide to the end is skipped so no click only nudges the row.
    function stops() {
      const max = maxScroll();
      const half = slides[0].offsetWidth / 2;
      const list = slides.map((_, i) => offsetOf(i)).filter((o, i) => i === 0 || o < max - half);
      if (max - list[list.length - 1] > EDGE) list.push(max);
      return list;
    }

    // Previous = the last stop left of the current position; next = the first stop right of it.
    // Works from any position, including after a free swipe.
    function step(dir) {
      const x = track.scrollLeft;
      const list = stops();
      const left = dir > 0 ? list.find((o) => o > x + EDGE) : list.findLast((o) => o < x - EDGE);
      if (left !== undefined) scrollToX(left);
    }

    prev.addEventListener("click", () => {
      if (prev.getAttribute("aria-disabled") !== "true") step(-1);
    });
    next.addEventListener("click", () => {
      if (next.getAttribute("aria-disabled") !== "true") step(1);
    });

    track.addEventListener("keydown", (e) => {
      if (e.target !== track || e.altKey || e.ctrlKey || e.metaKey) return;
      const actions = {
        ArrowLeft: () => step(-1),
        ArrowRight: () => step(1),
        Home: () => scrollToX(0),
        End: () => scrollToX(maxScroll()),
      };
      if (!actions[e.key]) return;
      e.preventDefault();
      actions[e.key]();
    });

    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    root.classList.add("is-ready");
    update();
  }
})();
