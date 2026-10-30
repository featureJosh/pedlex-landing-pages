// Pages rendered by src/landing.njk: every landing from landings.js, plus (preview builds only) a
// /video/ twin of each page whose hero has a `video` but shows the image, so hero variant A (image) and B (background
// video) can be compared side by side (Raffi, 2026-10-29). The twin shares the original's thank-you
// page, so src/merci.njk keeps paginating over plain `landings`.
import landings from "./landings.js";
import site from "./site.js";

export default function () {
  const pages = landings();
  if (!site.isPreview) return pages;
  const twins = pages
    .filter((e) => e.c.hero && e.c.hero.video && e.c.hero.variant !== "video")
    .map((e) => ({ ...e, c: { ...e.c, hero: { ...e.c.hero, variant: "video" } }, url: `${e.url}video/`, variant: "video" }));
  return [...pages, ...twins];
}
