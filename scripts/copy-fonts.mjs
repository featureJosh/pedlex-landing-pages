// Self-hosts the webfonts in src/assets/fonts (no third-party requests: Law 25):
// - Barlow Condensed (OFL) from node_modules, for condensed caps labels;
// - Pedlex's brand fonts (Scania Sans CY / CY Headline WOFF2) from assets-source/fonts/.
// @font-face rules live in src/styles/01-fonts.css.
import fs from "node:fs";
import path from "node:path";

const OUT = "src/assets/fonts";
const FILES = [
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2", "barlow-condensed-500.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2", "barlow-condensed-600.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", "barlow-condensed-700.woff2"],
];

fs.mkdirSync(OUT, { recursive: true });
for (const [from, to] of FILES) {
  fs.copyFileSync(path.join("node_modules", from), path.join(OUT, to));
}
// Brand fonts are copied as-is.
const brand = "assets-source/fonts";
if (fs.existsSync(brand)) {
  for (const f of fs.readdirSync(brand).filter((f) => f.endsWith(".woff2"))) {
    fs.copyFileSync(path.join(brand, f), path.join(OUT, f));
  }
}
console.log(`[fonts] copied to ${OUT}`);
