// Loads every landing's content from src/content/<slug>/<lang>.json, merges it over the
// shared UI strings in src/content/_shared/<lang>.json, applies French typography, and
// computes URLs. Templates paginate over this array: one entry = one page.
//
// URL scheme
//   preview (default):  /<slug>/  /<slug>/en/  /<slug>/merci/  /<slug>/en/merci/
//   LANDING=<slug>:     /         /en/         /merci/         /en/merci/
import fs from "node:fs";
import path from "node:path";

const DIR = "src/content";
const LANGS = ["fr", "en"];
const ONLY = process.env.LANDING || null;

// French typography: narrow no-break space (U+202F) before ? ! ; and inside « »,
// no-break space (U+00A0) before : and %, typographic apostrophe. Applied to FR only,
// on every string, so copy can be pasted from Maïeutyk's docs as-is.
// Caveat: don't put raw URLs with "?" inside copy strings; use a {placeholder} instead.
function frTypo(s) {
  return s
    .replace(/(\p{L})'(\p{L})/gu, "$1’$2")
    .replace(/[   ]*([?!;])/g, (m, p, off, str) => (/[\wÀ-ſ»)…]$/.test(str.slice(0, off)) ? ` ${p}` : m))
    .replace(/(\S)[   ]*:(\s|$)/g, (m, a, b) => (/[\d/]/.test(a) && /\d/.test(b) ? m : `${a} :${b}`))
    .replace(/(\d)[   ]*%/g, "$1 %")
    .replace(/«[   ]*/g, "« ")
    .replace(/[   ]*»/g, " »");
}

// Skip URLs, anchors, emails, HTML attributes and keys that are identifiers.
const SKIP_KEYS = new Set(["id", "href", "url", "image", "icon", "slug", "type", "name", "autocomplete", "inputmode"]);
function walk(v, fn, key = "") {
  if (typeof v === "string") return SKIP_KEYS.has(key) || /^(https?:|mailto:|tel:|#|\/)/.test(v) ? v : fn(v);
  if (Array.isArray(v)) return v.map((x) => walk(x, fn, key));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, fn, k)]));
  return v;
}

// Deep merge: page content wins over shared strings; arrays are replaced, not merged.
function merge(base, over) {
  if (Array.isArray(over) || typeof over !== "object" || over === null) return over ?? base;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = k in out ? merge(out[k], v) : v;
  return out;
}

const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"));

export default function () {
  const slugs = fs
    .readdirSync(DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .filter((s) => !ONLY || s === ONLY);

  const entries = [];
  for (const slug of slugs) {
    for (const lang of LANGS) {
      const file = path.join(DIR, slug, `${lang}.json`);
      if (!fs.existsSync(file)) continue;
      const shared = read(path.join(DIR, "_shared", `${lang}.json`));
      let c = merge(shared, read(file));
      if (lang === "fr") c = walk(c, frTypo);
      const root = ONLY ? "/" : `/${slug}/`;
      const langRoot = lang === "fr" ? root : `${root}en/`;
      entries.push({
        slug,
        lang,
        c,
        url: langRoot,
        thanksUrl: `${langRoot}${lang === "fr" ? "merci" : "thank-you"}/`,
        alt: null, // filled below
      });
    }
  }
  // Link each page to its other-language counterpart for the FR/EN toggle and hreflang.
  for (const e of entries) {
    const other = entries.find((o) => o.slug === e.slug && o.lang !== e.lang);
    e.alt = other ? { lang: other.lang, url: other.url, thanksUrl: other.thanksUrl } : null;
  }
  return entries;
}
