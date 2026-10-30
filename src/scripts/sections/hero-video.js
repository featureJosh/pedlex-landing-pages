/* Hero video (variant B, sections/hero.njk): plays the muted background loop unless the visitor
   prefers reduced motion, and wires the pause/play button (WCAG 2.2.2: moving content > 5 s must be
   pausable). The button's label says what it will do (« Mettre la vidéo en pause » / « Lire la
   vidéo »); it is a plain button, not a toggle, so screen readers never hear a contradictory
   « Lire, enfoncé ». Without JS the poster image shows and the button stays hidden. */
(function () {
  Pedlex.ready(() => {
    const video = document.querySelector("[data-hero-video]");
    const btn = document.querySelector("[data-hero-pause]");
    if (!video || !btn) return;

    const set = (playing) => {
      btn.setAttribute("aria-label", playing ? btn.dataset.labelPause : btn.dataset.labelPlay);
      btn.toggleAttribute("data-paused", !playing);
    };
    btn.hidden = false;
    set(false);
    btn.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
    video.addEventListener("play", () => set(true));
    video.addEventListener("pause", () => set(false));

    if (!Pedlex.reducedMotion()) video.play().catch(() => set(false));
  });
})();
