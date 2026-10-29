// Copies the stand-in webfonts (Barlow / Barlow Condensed, OFL) from node_modules
// into src/assets/fonts so they are self-hosted (no third-party requests: Law 25).
// When Pedlex's Scania Sans WOFF2 files arrive, drop them in assets-source/fonts/
// and switch the @font-face block in src/styles/01-fonts.css. See PROJECT.md.
import fs from "node:fs";
import path from "node:path";

const OUT = "src/assets/fonts";
const FILES = [
  ["@fontsource/barlow/files/barlow-latin-400-normal.woff2", "barlow-400.woff2"],
  ["@fontsource/barlow/files/barlow-latin-400-italic.woff2", "barlow-400-italic.woff2"],
  ["@fontsource/barlow/files/barlow-latin-500-normal.woff2", "barlow-500.woff2"],
  ["@fontsource/barlow/files/barlow-latin-600-normal.woff2", "barlow-600.woff2"],
  ["@fontsource/barlow/files/barlow-latin-700-normal.woff2", "barlow-700.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2", "barlow-condensed-500.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2", "barlow-condensed-600.woff2"],
  ["@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", "barlow-condensed-700.woff2"],
];

fs.mkdirSync(OUT, { recursive: true });
for (const [from, to] of FILES) {
  fs.copyFileSync(path.join("node_modules", from), path.join(OUT, to));
}
// Real brand fonts, if present, are copied as-is.
const brand = "assets-source/fonts";
if (fs.existsSync(brand)) {
  for (const f of fs.readdirSync(brand).filter((f) => f.endsWith(".woff2"))) {
    fs.copyFileSync(path.join(brand, f), path.join(OUT, f));
  }
}
console.log(`[fonts] copied to ${OUT}`);
