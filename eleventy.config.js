// Eleventy config. Output is plain static HTML/CSS/JS in _site/, so the result can be
// hosted anywhere (GitHub Pages preview, Netlify, Cloudflare Pages) or ported to
// WordPress template parts later. See PROJECT.md > Architecture.
import fs from "node:fs";
import path from "node:path";

const PATH_PREFIX = process.env.PATH_PREFIX || "/";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Production builds of a single landing (LANDING=racking) don't ship the internal QA hub.
  if (process.env.LANDING) eleventyConfig.ignores.add("src/index.njk");
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");
  eleventyConfig.addWatchTarget("src/content/");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  const url = (p) => eleventyConfig.getFilter("url")(p);

  // {% icon "warehouse" %} -> inline Lucide SVG (ISC), decorative by default.
  eleventyConfig.addShortcode("icon", (name, cls = "") => {
    const file = path.join("node_modules/lucide-static/icons", `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`[icon] unknown Lucide icon "${name}"`);
    return fs
      .readFileSync(file, "utf8")
      .replace(/<!--.*?-->\s*/s, "")
      .replace(/class="[^"]*"/, `class="icon ${cls}" aria-hidden="true" focusable="false"`)
      .replace(/\s*\n\s*/g, " ")
      .trim();
  });

  // {% picture "racking/racking-2", "alt text", "(min-width: 64rem) 50vw, 100vw", { class, loading, fetchpriority } %}
  eleventyConfig.addShortcode("picture", (key, alt, sizes = "100vw", opts = {}) => {
    // Read the manifest directly so the shortcode also works inside imported macros.
    const img = JSON.parse(fs.readFileSync("src/_data/images.json", "utf8"))[key];
    if (!img) throw new Error(`[picture] "${key}" not in src/_data/images.json (run npm run images)`);
    if (alt === undefined) throw new Error(`[picture] "${key}" needs alt text ("" if decorative)`);
    const loading = opts.loading || "lazy";
    const attrs = [
      `alt="${alt.replaceAll('"', "&quot;")}"`,
      `width="${img.width}"`,
      `height="${img.height}"`,
      `loading="${loading}"`,
      `decoding="${loading === "eager" ? "sync" : "async"}"`,
      opts.fetchpriority ? `fetchpriority="${opts.fetchpriority}"` : "",
      opts.class ? `class="${opts.class}"` : "",
    ].filter(Boolean).join(" ");
    if (img.type === "logo") {
      return `<picture><source type="image/webp" srcset="${url(img.base + ".webp")}"><img src="${url(img.base + ".png")}" ${attrs}></picture>`;
    }
    const set = (ext) => img.widths.map((w) => `${url(`${img.base}-${w}.${ext}`)} ${w}w`).join(", ");
    return `<picture><source type="image/webp" srcset="${set("webp")}" sizes="${sizes}"><img src="${url(`${img.base}-${img.widths.at(-1)}.jpg`)}" srcset="${set("jpg")}" sizes="${sizes}" ${attrs}></picture>`;
  });

  // {% preloadPicture "racking/racking-2", sizes %} -> <link rel="preload"> for the LCP image (hero).
  // Mirrors the WebP <source> that {% picture %} emits; `sizes` MUST match the picture's sizes.
  eleventyConfig.addShortcode("preloadPicture", (key, sizes = "100vw") => {
    const img = JSON.parse(fs.readFileSync("src/_data/images.json", "utf8"))[key];
    if (!img) throw new Error(`[preloadPicture] "${key}" not in src/_data/images.json (run npm run images)`);
    if (img.type === "logo") return `<link rel="preload" as="image" href="${url(img.base + ".webp")}" type="image/webp" fetchpriority="high">`;
    const set = img.widths.map((w) => `${url(`${img.base}-${w}.webp`)} ${w}w`).join(", ");
    return `<link rel="preload" as="image" imagesrcset="${set}" imagesizes="${sizes}" type="image/webp" fetchpriority="high">`;
  });

  // Content strings may hold limited inline HTML (<strong>, <em>, <br>). Strip it for attributes/meta.
  // 10000 -> "10 000" (fr-CA, narrow no-break space) / "10,000" (en-CA). stats-counter.js formats the same way.
  eleventyConfig.addFilter("num", (n, lang = "fr") => new Intl.NumberFormat(`${lang}-CA`).format(n));
  eleventyConfig.addFilter("plain", (s = "") => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    pathPrefix: PATH_PREFIX,
    templateFormats: ["njk", "11ty.js"],
    htmlTemplateEngine: "njk",
  };
}
