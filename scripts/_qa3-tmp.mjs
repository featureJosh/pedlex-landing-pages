import fs from "node:fs";
import path from "node:path";
import { launch, settle } from "./shoot.mjs";

const out = "qa/shots/qa-r3";
fs.mkdirSync(out, { recursive: true });
const sizes = [[390, 844], [360, 640], [430, 932], [1440, 900]];
const { browser, base, close } = await launch({ port: 8096, width: 390, height: 844 });

for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 768 ? 2 : 1, isMobile: w < 768, hasTouch: w < 768 });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));

  if (w === 390) {
    // Cookie banner once, first screen
    await page.goto(base + "/racking/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(out, `banner-first-screen-${w}.png`) });
    await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "instant" }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(out, `banner-midpage-${w}.png`) });
  }
  await ctx.addInitScript(() => { try { localStorage.setItem("pedlex-consent", "denied"); } catch (e) {} });
  await page.goto(base + "/racking/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(out, `first-screen-${w}.png`) });
  await settle(page);
  await page.screenshot({ path: path.join(out, `full-${w}.png`), fullPage: true });

  // viewport-by-viewport screens (what the phone user actually sees)
  if (w < 768) {
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    let i = 0;
    for (let y = 0; y < total; y += Math.round(h * 0.9)) {
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(out, `scroll-${w}-${String(i).padStart(2, "0")}.png`) });
      i++;
    }
  } else {
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(out, `sticky-header-${w}.png`) });
  }

  if (w === 390) {
    await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(out, `sticky-header-${w}.png`), clip: { x: 0, y: 0, width: w, height: 200 } });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(out, `topbar-${w}.png`), clip: { x: 0, y: 0, width: w, height: 140 } });
  }

  // section shots with static header
  await page.addStyleTag({ content: "[data-header]{position:static !important}" });
  const ids = await page.$$eval("main section[id]", (s) => s.map((x) => x.id));
  for (const id of ids) await page.locator(`#${id}`).screenshot({ path: path.join(out, `section-${id}-${w}.png`) });
  const footer = page.locator("footer").first();
  if (await footer.count()) await footer.screenshot({ path: path.join(out, `section-footer-${w}.png`) });

  // metrics
  const metrics = await page.evaluate(() => {
    const r = (el) => { const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width), h: Math.round(b.height) }; };
    const sections = [...document.querySelectorAll("main section[id], footer, header, [data-topbar], .topbar")].map((s) => ({ id: s.id || s.className.split(" ")[0], ...r(s), pt: getComputedStyle(s).paddingTop, pb: getComputedStyle(s).paddingBottom, bg: getComputedStyle(s).backgroundColor }));
    const fonts = {};
    document.querySelectorAll("body *").forEach((el) => {
      if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const key = `${cs.fontSize}/${cs.lineHeight}/${cs.fontWeight}/${cs.fontFamily.split(",")[0]}`;
      const cls = (el.className && typeof el.className === "string" ? el.className.split(" ")[0] : el.tagName.toLowerCase());
      (fonts[key] ||= new Set()).add(cls);
    });
    const f = {}; for (const k in fonts) f[k] = [...fonts[k]].slice(0, 25);
    const firstField = document.querySelector("#consultation input, #consultation select");
    const btns = [...document.querySelectorAll("a.btn, button.btn, .btn")].map((b) => ({ t: b.textContent.trim().slice(0, 40), cls: b.className, ...r(b) }));
    return { scrollH: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth - innerWidth, firstField: firstField ? r(firstField).y : null, sections, fonts: f, btns };
  });
  metrics.errors = errs;
  fs.writeFileSync(path.join(out, `metrics-${w}.json`), JSON.stringify(metrics, null, 2));
  await ctx.close();
}
await close();
console.log("done");
