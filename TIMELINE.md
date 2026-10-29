# TIMELINE.md

Chronological log of every change, merge, review and decision, **newest first**. It's like `git log` for humans and agents, but it includes the *why*, and rejected work too.

Format:
```
## YYYY-MM-DD HH:MM (America/Toronto) · <who: lead | builder:<area> | qa | user | client>
- What changed / happened (files or branch)
- Why / outcome
```

---

## 2026-10-29 14:05 · builder:problem-gallery-process-why
- Built sections 4–7 on `feat/problem-gallery-process-why`: `sections/{problem,gallery,process,why}.njk`, `styles/sections/{problem,gallery,process,why}.css`, `scripts/sections/gallery-carousel.js`. No shared files or copy changed; macros used as-is.
- Problem: 5/7 split with sticky intro from 80rem (stacked head + 2x2 cards below that), CTA row. Gallery: full-bleed scroll-snap row (slides rest on the container edges, scroll out to the viewport), prev/next + « 01 / 06 » counter + arrow/Home/End keys, aria-disabled ends, no autoplay; plain scrollable row without JS. Process: photo column stretched to the steps' height, numbered chips joined by a hairline rail, CTA. Why: centred head, 6 cards, grayscale certification strip; no CTA (form follows).
- Verified: build clean; 360–1920 screenshots; carousel Playwright test 34/34 in Chrome 156 and 32/32 in Edge (buttons, keys, swipe counter, reduced motion, no-JS). Found: `settle()` in shoot.mjs doesn't reach the page bottom (smooth scroll), so lazy images low on long pages show blank in harness shots (see report).

## 2026-10-29 13:45 · lead
- **Scaffold + foundation committed** (initial commit on `main`).
  - Eleventy 3 static build; content model `src/content/<slug>/<lang>.json` + `_shared`; loader with automatic FR typography (`src/_data/landings.js`); build modes preview / `LANDING=<slug>` / `SITE_ENV=production` / `PATH_PREFIX`.
  - Design system: tokens (official pedlex.com palette), self-hosted Barlow stand-in, base, layout primitives, motion rules; components: button, feature card, header, footer, cookie banner; macros `button`, `sectionHead`, `featureCard`, `ctaRow`; shortcodes `{% picture %}`, `{% icon %}` (Lucide).
  - Header (logo, phone, CTA; FR/EN toggle appears when EN exists), footer, Law 25 cookie banner + Google Consent Mode v2 (denied by default), GTM production-only, thank-you page, QA hub.
  - Section partials are **stubs** (hero → faq), to be built by builder agents next.
- **Assets:** 9 Racking photos + 6 client logos from Josh's Drive export (`2. Images`) → `assets-source/`; Pedlex logo (329px PNG inside pedlex.com's `logo.svg`) and CNESST / SafeContractor / ComplyWorks badges from pedlex.com's footer. Image pipeline `scripts/build-images.mjs` (WebP + JPEG, logos trimmed and normalised to white, white logo variant, favicon).
- **Copy:** Racking FR captured verbatim from Maïeutyk's Google Doc (read through Kaisey's account with permission, after josh@ was denied) → `docs/copy/racking-fr.md` → `src/content/racking/fr.json`. Deviations flagged in PROJECT.md §9 (CTA « votre » → « une », FAQ heading is Luxy microcopy).
- **Tooling:** `scripts/serve.mjs`, `scripts/shoot.mjs` (playwright-core + system Edge) for review agents.
- **Docs:** PROJECT.md, CLAUDE.md, TIMELINE.md, HANDOFF.md, README.md.
- Why: the foundation has to exist before parallel builders start, so every section uses the same tokens, macros and data shape. Otherwise QA would be fixing five different button styles.

## 2026-10-29 12:52 · lead
- Project kicked off by Josh. Read the brief (Kaisey, 2026-10-28), `claude/` context, Federal Steel reference (structure only: its weaknesses are placeholder copy in the "types" cards, five different CTA labels, duplicated galleries and logo rows, uncaptioned generic photos, no footer).
- Josh's direction: clean, modern, professional, subtle animation ("not a theme park"); French first; CMS-agnostic; private repo + GitHub Pages; transferable to the client.
