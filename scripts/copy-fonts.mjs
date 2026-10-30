// Self-hosts the webfonts in src/assets/fonts (no third-party requests: Law 25):
// Pedlex's brand fonts (Scania Sans CY / CY Headline WOFF2) from assets-source/fonts/.
// @font-face rules live in src/styles/01-fonts.css.
import fs from "node:fs";
import path from "node:path";

const OUT = "src/assets/fonts";

// Start clean so retired faces (e.g. the old Barlow Condensed stand-in) don't linger in the build.
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const brand = "assets-source/fonts";
if (fs.existsSync(brand)) {
  for (const f of fs.readdirSync(brand).filter((f) => f.endsWith(".woff2"))) {
    fs.copyFileSync(path.join(brand, f), path.join(OUT, f));
  }
}
console.log(`[fonts] copied to ${OUT}`);
