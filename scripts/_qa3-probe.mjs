import { launch } from "./shoot.mjs";
const { browser, base, close } = await launch({ port: 8097 });
for (const w of [360, 390, 430]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(base + "/racking/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const banner = await page.evaluate(() => {
    const b = document.querySelector(".cookie-banner__inner"); if (!b) return null;
    const t = b.querySelector(".cookie-banner__text, p");
    const r = b.getBoundingClientRect();
    return { h: Math.round(r.height), top: Math.round(r.top), textFs: getComputedStyle(t).fontSize, textEl: t.outerHTML.slice(0, 120), pFs: [...b.querySelectorAll("p")].map((p) => getComputedStyle(p).fontSize) };
  });
  await page.evaluate(() => { localStorage.setItem("pedlex-consent", "denied"); });
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
  await page.waitForTimeout(600);
  const m = await page.evaluate(() => {
    const R = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.left), r: Math.round(r.right), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
    const lines = (s) => { const e = document.querySelector(s); if (!e) return null; const rg = document.createRange(); rg.selectNodeContents(e); const rects = [...rg.getClientRects()]; const ys = {}; rects.forEach((r) => { const k = Math.round(r.top); ys[k] = Math.max(ys[k] || 0, Math.round(r.right)); }); return Object.values(ys); };
    const cs = (s, p) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[p] : null; };
    return {
      vw: innerWidth,
      headerInner: R(".site-header__inner"), logo: R(".site-header__logo"), phone: R(".site-header__phone"), cta: R(".site-header__cta"),
      heroTag: R(".hero__tag"), heroTitle: R(".hero__title"), heroTitleLines: lines(".hero__title"), heroLead: R(".hero__lead"), heroCta: R(".hero__cta"), heroPhone: R(".hero__phone"), proof: R(".hero__proof"), hero: R(".hero"),
      eyebrows: [...document.querySelectorAll(".eyebrow")].map((e) => Math.round(e.getBoundingClientRect().height)),
      cardPad: cs(".problem__cards .card", "padding"), card: R(".problem__cards .card"),
      galleryCaps: [...document.querySelectorAll(".gallery__caption")].map((e) => Math.round(e.getBoundingClientRect().height)),
      galleryMedia: [...document.querySelectorAll(".gallery__media")].map((e) => `${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`),
      faqToggle: R(".faq__toggle"), faqQ: R(".faq__question"),
      reviewCard: [...document.querySelectorAll(".reviews__card")].map((e) => `${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`),
      reviewQuote: [...document.querySelectorAll(".reviews__quote")].map((e) => Math.round(e.getBoundingClientRect().height)),
      whyVideo: R(".why__video-frame"), whyCaption: R(".why__video-caption"), certs: [...document.querySelectorAll(".why__cert-img")].map((e) => `${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`),
      processNum: R(".process__num"), processCta: R("#process .btn"),
      formCard: R(".lead-form, form"), input: R("#consultation input"), formPad: cs(".lead-form", "padding"),
      footerLegal: document.querySelector(".site-footer__legal")?.innerText,
      problemCta: R("#problem .btn"), problemCards: R(".problem__cards"),
      sectionTitleLines: [...document.querySelectorAll(".section-title")].map((e) => e.textContent.trim().slice(0, 30) + " :: " + Math.round(e.getBoundingClientRect().height / 30.24) + " lines"),
    };
  });
  console.log(w, JSON.stringify({ banner, ...m }, null, 1));
  await ctx.close();
}
await close();
