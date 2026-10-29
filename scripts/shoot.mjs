// Screenshot harness for QA / User / Client review agents.
// Builds nothing: run `npm run build` first. Serves _site/ locally and drives the system
// Edge (or Chrome) through playwright-core, so no browser download is needed.
//
//   node scripts/shoot.mjs [path=/racking/] [--out qa/shots/<label>] [--widths 390,768,1440]
//                          [--sections] [--no-full] [--port 8090]   (use a unique port per parallel agent)
//
// Output: full-page PNG per width, plus one PNG per <section id> with --sections.
// For interaction scripts, import { launch } from "./shoot.mjs" and use the returned page.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import { serve } from "./serve.mjs";

const BROWSERS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

export async function launch({ port = 8090, width = 1440, height = 900 } = {}) {
  const server = await serve(port);
  const executablePath = BROWSERS.find((p) => fs.existsSync(p));
  if (!executablePath) throw new Error("No Edge/Chrome found; add its path to BROWSERS in scripts/shoot.mjs");
  const browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const base = `http://localhost:${port}`;
  const close = async () => { await browser.close(); server.close(); };
  return { browser, context, page, base, errors, close };
}

// Scroll through the page so lazy images load and scroll-reveal content becomes visible.
export async function settle(page) {
  // behavior "instant": html has scroll-behavior: smooth, which would make the loop barely move.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 80)); }
    window.scrollTo({ top: 0, behavior: "instant" });
    await Promise.race([
      Promise.all(Array.from(document.images).filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
      new Promise((r) => setTimeout(r, 2500)),
    ]);
  });
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible")));
  await page.waitForTimeout(800);
}

if (process.argv[1]?.endsWith("shoot.mjs")) {
  const args = process.argv.slice(2);
  const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
  const target = args.find((a) => a.startsWith("/")) || "/racking/";
  const out = opt("--out", path.join("qa/shots", target.replaceAll("/", "_").replace(/^_|_$/g, "") || "root"));
  const widths = opt("--widths", "390,768,1440").split(",").map(Number);
  fs.mkdirSync(out, { recursive: true });

  const { page, base, errors, close } = await launch({ port: Number(opt("--port", 8090)) });
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: w < 768 ? 844 : 900 });
    await page.goto(base + target, { waitUntil: "networkidle" });
    await page.evaluate(() => { try { localStorage.setItem("pedlex-consent", "denied"); } catch (e) {} });
    await page.reload({ waitUntil: "networkidle" });
    await settle(page);
    if (!args.includes("--no-full")) await page.screenshot({ path: path.join(out, `full-${w}.png`), fullPage: true });
    if (args.includes("--sections")) {
      // The sticky header would cover the top of each element screenshot.
      await page.addStyleTag({ content: "[data-header]{position:static !important}" });
      for (const id of await page.$$eval("main section[id]", (s) => s.map((x) => x.id))) {
        await page.locator(`#${id}`).screenshot({ path: path.join(out, `section-${id}-${w}.png`) });
      }
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) console.log(`[shoot] WARNING ${w}px: horizontal overflow of ${overflow}px`);
  }
  if (errors.length) console.log("[shoot] console/page errors:\n  " + errors.join("\n  "));
  console.log(`[shoot] saved to ${out}`);
  await close();
}
