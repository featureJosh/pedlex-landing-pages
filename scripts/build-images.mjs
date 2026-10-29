// Responsive image pipeline.
// Reads originals from assets-source/<group>/, writes optimized files to
// src/assets/img/<group>/ and a manifest to src/_data/images.json that the
// `picture` macro uses to build srcset/sizes. Generated files are gitignored.
//
// Groups:
//   brand            Pedlex logo (transparent PNG) -> trimmed PNG + WebP, plus a "-white" variant
//   clients          client logos                  -> trimmed, flattened on white, WebP + PNG
//   certifications   safety/compliance badges      -> same as clients
//   anything else    photos                        -> WebP + JPEG at PHOTO_WIDTHS
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-source";
const OUT = "src/assets/img";
const MANIFEST = "src/_data/images.json";
const PHOTO_WIDTHS = [480, 800, 1200, 1600, 2000];
const LOGO_HEIGHT = 120; // rendered at ~40-56px, so this covers 2x+ displays
const EXT = /\.(png|jpe?g|webp|tiff?)$/i;

const manifest = {};

function upToDate(src, out) {
  return fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;
}

async function photo(group, file) {
  const src = path.join(SRC, group, file);
  const name = path.parse(file).name;
  const outDir = path.join(OUT, group);
  fs.mkdirSync(outDir, { recursive: true });
  const meta = await sharp(src).metadata();
  const widths = PHOTO_WIDTHS.filter((w) => w < meta.width);
  widths.push(Math.min(meta.width, PHOTO_WIDTHS.at(-1)));
  const unique = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of unique) {
    for (const [fmt, opts] of [["webp", { quality: 78 }], ["jpg", { quality: 80, mozjpeg: true }]]) {
      const out = path.join(outDir, `${name}-${w}.${fmt}`);
      if (upToDate(src, out)) continue;
      let img = sharp(src).flatten({ background: "#ffffff" }).resize({ width: w, withoutEnlargement: true });
      img = fmt === "webp" ? img.webp(opts) : img.jpeg(opts);
      await img.toFile(out);
    }
  }
  const maxW = unique.at(-1);
  manifest[`${group}/${name}`] = {
    type: "photo",
    base: `/assets/img/${group}/${name}`,
    widths: unique,
    width: maxW,
    height: Math.round((meta.height / meta.width) * maxW),
  };
}

async function logo(group, file) {
  const src = path.join(SRC, group, file);
  const name = path.parse(file).name;
  const outDir = path.join(OUT, group);
  fs.mkdirSync(outDir, { recursive: true });
  // Logos arrive with mixed white / light-grey boxes. Flatten to white, trim the
  // box away, then pad slightly so every logo sits on the same clean canvas.
  // linear() lifts near-white greys (e.g. Airbus' #EEEFF2 box) to pure white.
  const trimmed = await sharp(src)
    .flatten({ background: "#ffffff" })
    .linear(1.12, -15)
    .trim({ background: "#ffffff", threshold: 40 })
    .resize({ height: LOGO_HEIGHT, withoutEnlargement: false })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = trimmed.info;
  for (const fmt of ["webp", "png"]) {
    const out = path.join(outDir, `${name}.${fmt}`);
    if (upToDate(src, out)) continue;
    const img = sharp(trimmed.data);
    await (fmt === "webp" ? img.webp({ quality: 90 }) : img.png()).toFile(out);
  }
  manifest[`${group}/${name}`] = {
    type: "logo",
    base: `/assets/img/${group}/${name}`,
    width,
    height,
  };
}

async function brand(group, file) {
  const src = path.join(SRC, group, file);
  const name = path.parse(file).name;
  const outDir = path.join(OUT, group);
  fs.mkdirSync(outDir, { recursive: true });
  // TODO(client): replace with the vector logo from Drive ("Logo Pedlex sans slogan").
  // Current source is the 329px PNG embedded in pedlex.com's logo.svg.
  const base = await sharp(src).trim().png().toBuffer({ resolveWithObject: true });
  const { width, height } = base.info;
  // White variant: keep the alpha mask, paint every pixel white.
  const alpha = await sharp(base.data).extractChannel("alpha").toBuffer();
  const white = await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
  for (const [suffix, buf] of [["", base.data], ["-white", white]]) {
    await sharp(buf).png().toFile(path.join(outDir, `${name}${suffix}.png`));
    await sharp(buf).webp({ quality: 95, alphaQuality: 100 }).toFile(path.join(outDir, `${name}${suffix}.webp`));
    manifest[`${group}/${name}${suffix}`] = { type: "logo", base: `/assets/img/${group}/${name}${suffix}`, width, height };
  }
}

// Favicon: the square "P" mark on the left of the logo, on white, 64px.
async function favicon() {
  const src = path.join(SRC, "brand", "pedlex-logo.png");
  if (!fs.existsSync(src)) return;
  const { info } = await sharp(src).trim().toBuffer({ resolveWithObject: true });
  const mark = await sharp(src).trim().extract({ left: 0, top: 0, width: info.height, height: info.height }).toBuffer();
  await sharp(mark).resize(56, 56, { fit: "contain", background: "#ffffff" })
    .extend({ top: 4, bottom: 4, left: 4, right: 4, background: "#ffffff" })
    .png().toFile(path.join(OUT, "favicon.png"));
}

const HANDLERS = { brand, clients: logo, certifications: logo };

for (const group of fs.readdirSync(SRC)) {
  const dir = path.join(SRC, group);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir).filter((f) => EXT.test(f)).sort()) {
    await (HANDLERS[group] || photo)(group, file);
  }
}

await favicon();

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`[images] ${Object.keys(manifest).length} images -> ${OUT}`);
