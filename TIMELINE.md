# TIMELINE.md

Chronological log of every change, merge, review and decision, **newest first**. It's like `git log` for humans and agents, but it includes the *why*, and rejected work too.

Format:
```
## YYYY-MM-DD HH:MM (America/Toronto) · <who: lead | builder:<area> | qa | user | client>
- What changed / happened (files or branch)
- Why / outcome
```

---

## 2026-10-30 20:00 · lead
- Pushed 64398bb (Josh: « Push it »).
- **Josh's mobile feedback:**
  - Hero proof figures were misaligned (« 50 % » pushed right, « 10 000+ » indented). Cause: `stats-counter.js` locked each number to a px `min-width` measured once (before the webfont / at the load-time font size) and never released it, so a resize or a late font left right-aligned gaps. Now measured after `document.fonts.ready`, in em, and cleared when the count ends.
  - Testimonials stack vertically below 48rem (no horizontal scroll row). `reviews.js` and `data-reviews-row` removed (no scroller, no tab stop needed); `--peek-col` token removed.
- Check: figures flush left at 390, 725 and after resizing 1440 → 725; reviews stacked at 390/725, three columns at 1440; no overflow; build clean.


## 2026-10-30 19:30 · lead
- **Mobile visual QA round 3** (agent): `qa/qa-2026-10-30-r3.md`, 21 findings; Josh approved the top 10 (« Yes, fix all 10 »). Triage in PROJECT.md §8 « Round 3 ».
- Fixes (phones unless noted):
  - Tokens: phone `--fs-h1` clamp(2rem, 8.7vw, 2.5rem) and `--fs-display` 1.875rem; new `--lh-lead` 1.45 (all widths, `.section-lead`, `.hero__lead`); `--section-pad` min 3rem; `--logo-w` min 7rem.
  - `02-base.css`: h3 at `--fs-body` below 48rem; `.card__title` / `.process__title` no longer set their own size.
  - Hero: tag hidden ≤ 40rem; proof labels body size, rows centred (lead size from 48rem); lead `text-wrap: pretty`.
  - Header: call button + CTA badge hidden ≤ 29.99rem (CTA overran the gutter up to 480px).
  - Problem: hairline list with bare icons ≤ 39.99rem; below 80rem `.problem__intro` is `display: contents` and the CTA row is ordered after the cards.
  - Why: bare icons, 44px play mark, solid « à venir » chip bottom-left, label-size caption.
  - Consultation: bare check marks below 48rem.
  - Gallery: square thumbnails and stacked number/title ≤ 40rem; digits in `--font-sans` (also `.eyebrow__index`, all widths).
  - Reviews: « Exemple » moved from the dashed corner tag into the role line (`reviews.njk`, all widths); phone cards `align-items: start`.
  - Process: step gap `--space-m`.
- Check: build clean; no page overflow at 360/390/430/480/600/768/1024/1440/1920; H1 three lines at 360/390/430; hero 800px at 390 with the full proof strip on screen; sticky CTA inside the gutter at 360/390/430. Length at 390: 8 541px (first field 6 893). Shots: `qa/shots/r3-fix/`.


## 2026-10-30 18:40 · lead
- **GitHub Pages live:** no deploy had ever run (all earlier Pages runs were skipped while Pages was off, and the 7 commits since were unpushed). Josh asked to fix it ASAP, so the lead pushed `main` (ec6a89c..f6f3b41). The Pages run succeeded; /, /racking/, /racking/en/ and /racking/merci/ return 200 and fonts, CSS and images load (checked at 390).
- **Trust: marquee pause button removed** (Josh: « it looks ugly »). Button, its CSS, the JS wiring and `ui.marquee` strings deleted. The loop still pauses on hover/focus; reduced motion keeps the static row. Accepted WCAG 2.2.2 gap (PROJECT.md §8 QA-5).
- Mobile visual QA round 3 started (Josh: mobile looks « incredibly amateur », desktop good): report due at `qa/qa-2026-10-30-r3.md`.


## 2026-10-30 17:45 · lead
- **Branches:** `main` is the only branch (Josh: « this is the new main… purge all other branches »). Deleted `explore/kimi` (19069b5) and `rounded-branch` (39f9468); removed the Pedlex-main worktree; `main` now lives in the `Pedlex Landing Page` folder.
- **Repo public + GitHub Pages** (Josh): `gh repo edit --visibility public`; Pages source = workflow; `PAGES_ENABLED=true`. A sub-agent fixed the old failed deploy (2b30909: Pages was off on the private repo; actions bumped to Node 24 majors). `ci.yml` actions bumped too. Nothing pushed.
- **Round-2 review batch** (Josh's notes + QA/User/Client r2, all in one pass; triage in PROJECT.md §8 « Round 2 »):
  - Type: `--fs-label` 13 / `--fs-body` 16–17 / `--fs-lead` 18–22 / `--fs-display` 28–42 + `--fs-h1`; old `--fs-2xs…--fs-stat`, `--fw-medium/semibold`, `--font-condensed` removed; one h3 treatment; measures widened (`--measure-lead` 60ch, `--head-width` 52rem). Barlow removed (faces, `@fontsource/barlow-condensed`, `copy-fonts.mjs`).
  - New tokens: `--target`, `--btn-h(-sm/-lg)`, `--icon-s/m/tile`, `--logo-w(-footer)`, `--client-logo-w/h`, `--card-pad`, `--col-min-2/3/4`, `--measure-narrow/title`, `--head-width`, `--hero-max`, `--peek-col`, `--focus-ring`, `--stroke-bold`, `--opacity-muted/disabled`, `--nudge`, `--lh-control`, `--blur-header`, `--chip-dark`; `--topbar-h` 44px everywhere; `--section-pad` min 40px.
  - Header/top bar: header actions (new call button + CTA) hidden at rest and shown as soon as the header sticks, i.e. the top bar ([data-topbar]) has scrolled away (`header.js`). A first version waited for the hero CTA to pass; Josh: too late, a brief duplicate is fine; top bar without CTA, 50 ans message (short on phones), square call button on phones; white focus ring on dark surfaces.
  - Hero: dark tag chip, wider lead, drift once, proof strip at display/lead sizes (rows on phones), same-height phone actions; `stats-counter.js` never zeroes in advance and fires without an inset margin; `hero-video.js` drops `aria-pressed`; placeholder loop regenerated without text.
  - Sections: trust caption body-bold one line + marquee pause button; compact phone cards (icon + title row) in problem and why; why video stretches on desktop + quiet play mark; reviews samples (« mark, initials, « Exemple »), `reviews.js` tab stop only while scrolling; form numbered 07, intro top-aligned, phone + city share a row on phones, card padding 16 on phones, submit one line; footer 44px links, « · » with the RBQ span; cookie strip on phones + Escape + focus return; `scroll-to.js` lands on the card below 64rem; `lead-form.js` accepts extensions; `plain` filter keeps FR no-break spaces; `button` macro `iconStart`, `ctaRow` short label.
  - Copy: see PROJECT.md §9 item 9.
- QA: build clean; no overflow at 360/390/768/1024/1440/1920 (FR) or 390/1440 (EN); scripted checks all pass (counter at 7 viewports, header timing, CTA focus at 390×664, cookie Escape/focus, marquee pause, reviews tab stop, « poste 22 » submit → merci, merci arrow, EN + /video/ pages). Shots: `qa/shots/r2b/`, `qa/shots/r2b-en/`, `qa/shots/r2b-merci/`.
- **Not met:** mobile length 8 628px at 390 (budget 7 500), first field 6 985 (budget 5 000). Decision needed (HANDOFF).


## 2026-10-29 19:05 · lead
- **Square-based shapes on `main`** (Josh: « Pedlex likes its square-based design… rounded things aren't banned, but keep them to a minimum »). Radius tokens to 2px (`--radius-s/m/l`), `--radius-pill` replaced by `--radius-round` (video play/pause only). Buttons, button badges, hero tag chip, top-bar/hero dots, process numbers, FAQ toggle, form checks, testimonial tags/avatars/bars, thank-you icon and steps are now square. Files: `00-tokens.css`, `button.css`, `topbar.css`, `header.css`, `hero.css`, `process.css`, `reviews.css`, `why.css`, `faq.css`, `form.css`, `pages/thanks.css`, `ui.njk` (comment).
- **`rounded-branch`** created at 39f9468: the round-2 build with pills and round badges, kept for comparison (local only).
- QA: build clean; `qa/shots/r2sq/` at 390 + 1440; no overflow, no console errors.

## 2026-10-29 18:30 · lead
- **Round 2: Raffi's client review implemented on `main`** (base = the white v1, elevated). Files: tokens, base, layout, button, new `partials/topbar.njk` + `components/topbar.css`, header, hero (+ `partials/proof-strip.njk`, replaces the stats section; `scripts/sections/hero-video.js`), gallery (Kimi mosaic, carousel JS removed), process, why, new `sections/reviews.njk` + `reviews.css`, faq (closing block removed), `src/_data/landingPages.js` (hero-video twin pages in preview), `src/landing.njk` (auto-numbered eyebrows), `eleventy.config.js` (passthrough `assets-source/placeholders` + `assets-source/video`), FR/EN content + `_shared` UI strings.
- New tokens: `--fs-2xs`, `--fw-display`, `--ls-display`, `--ls-label-tight`, `--font-label`, `--blue-300`, `--glass`, `--glass-hover`, `--blur-glass`, `--header-bg`, `--topbar-h`, `--hero-measure`, `--split-gap`, `--gallery-row`, `--radius-pill`, `--scrim-*`; scale, radii, section padding retuned (smaller). Macros: `button` gains `glass` variant, round icon badge and `attrs`; `sectionHead` gains `index`.
- Placeholders: `assets-source/placeholders/hero-video-placeholder.webm` + `hero-video-poster.jpg` (neutral grey loop recorded from a canvas, labelled PLACEHOLDER; not AI, not stock), why-video poster = real hq-fleet photo with a « vidéo à venir » tag, 3 testimonial placeholder cards. All listed in PROJECT.md §9.
- QA (lead): build clean; shots at 360/390/768/1024/1440/1920 in `qa/shots/r2/` (+ `r2-video/`); no horizontal overflow; 1 H1, no missing alt, no console errors on FR, EN and video pages; hero CTA scrolls to the form and focuses « Prénom et nom »; header switches to solid on scroll; video pause button toggles play state and label. Page length 390: ~8 870px.
- Why: Raffi (2026-10-29) picked the white version as the base, asked for consistent and smaller typography, a BrokerFlo-like hero with the trust bar inside it, the Kimi gallery, a St-Amour-like process, a company video, testimonials, FAQ before the form, and a shorter mobile page.

## 2026-10-29 16:30 · lead
- Josh, reiterated: be **inspired, not guided** by pedlex.com. **The landing page sets the precedent for Pedlex's new website.** v1 was good, but it failed at modernizing and only mimicked the existing site. A banner note was added at the top of CLAUDE.md, PROJECT.md §5 and HANDOFF.md "In flight", plus a §10 decision.
- Josh will also run non-Claude agents on `explore/<agent>` branches with a shared brief. The lead builds `explore/claude`, then merges the best points of every attempt into one page on `main`. All attempts deliver `qa/explore/<name>/` (390/1440 shots + DESIGN-NOTES.md).

## 2026-10-29 16:15 · lead
- **Josh retired the v1 look:** "It looks too much like the current website, which is the 'old' version… just a new polish of an old website. Loosely follow it but create something ENTIRELY new. And be a bit more photo-heavy." Placeholders are fine for missing photos. "This is a landing page, an appetizer… we don't want this insanely lengthy."
- Stopped the round-1 polish workflow (`feat/r1-system`, `feat/r1-behaviour`; both barely started) and pruned its branches and worktrees. Their design-neutral items carry into v2 (PROJECT.md §8 note).
- **Photo intake:** 7 real Pedlex photos from pedlex.com → `assets-source/web/` (SOURCES.md lists URLs and sizes). The image pipeline picks them up as the `web` group.
- **Docs rewritten for v2:**
  - PROJECT.md §5: new direction, keep/retire lists, photo-led rules, placeholder rule, length budget, content order + photo inventory. §7 plan, §8 carry-over note, §10 decisions.
  - CLAUDE.md: rule 4 + Client agent references pedlex.com as the OLD site.
  - HANDOFF.md: exact next steps + exploration briefs.
  - README.
- **Not started:** the v2 explorations (session limit). HANDOFF.md "In flight" has the briefs; launch them first.

## 2026-10-29 15:45 · lead
- **Josh's answers, applied:**
  - Previews on Cloudflare Pages on his account; repo stays private (no Pro).
  - Client content is a guide. Unreasonable input can be overridden.
  - CTA labels follow the copy doc per section (`c.<section>.cta`, fallback `c.ui.cta`).
  - Pedlex replies within a day.
  - « 30 à 50 % ».
  - Badges OK.
  - Scania Sans is licensed for use.
  - Placeholders are allowed for missing logos and video.
  - Luxy EN draft for now.
  - **"This is a landing page, an appetizer, not the whole company. Don't make it lengthy."**
- **Fonts:** Scania Sans CY (400/400i/700) + CY Headline (400/700) self-hosted from the files pedlex.com serves (`assets-source/fonts/`).
  - The Headline cut is caps-only and extended, so it's used for the H1 only, tracked at 0, `--fs-h1` lowered to 30–52px. H2/H3 use CY Bold.
  - Barlow Condensed stays for labels; Barlow sans removed (`@fontsource/barlow` uninstalled).
  - New tokens: `--font-display`, `--font-sans` changed.
- **Stats:**
  - Range support (`from` + `c.ui.rangeSep`): « 30 à 50 % ».
  - « Clé en main » → « 10 000+ » entreprises servies (2026 catalogue). Locale number formatting via the new `num` filter + `Intl` in `stats-counter.js`.
  - Suffix spacing driven by a leading space in content.
  - Counter width measured at count start (it was measured before the webfont loaded, which indented « 10 000+ »).
- **Round-1 review triage** (QA / User / Client) into PROJECT.md §8, with Josh's direction applied. Proof additions (testimonials, named projects, more figures) declined or deferred: appetizer.
- **Lead fixes:**
  - CNESST label made accurate.
  - Store duplicate racking-8 removed; last caption made truthful.
  - Hero trust line « Entreprise familiale québécoise depuis 1976 »; chip « 50 ans · 1976–2026 ».
  - « Sécurité et conformité » card names CSA A344 engineer certification.
  - Toll-free beside the phone in the form section.
  - RBQ `.nowrap` (new utility).
  - Thank-you back label « Retour à la page Palettiers ».
- **Appetizer trims (FR + EN):**
  - hero 2nd paragraph; problem 1st paragraph; form 2nd paragraph;
  - why 6 → 4 cards; FAQ 5 → 4;
  - footer link « Découvrir pedlex.com ».
  - Copy alone took the 390px page only from 10,453 to 10,280px. Layout compaction goes to builders with a budget.
- **EN:** Luxy draft `src/content/racking/en.json` → `/racking/en/` + thank-you. The FR/EN toggle hides in the header below 30rem (it caused 28px overflow) and is always in the footer legal links.
- **Tooling:**
  - `.node-version` 22; preview-only `_headers` (`src/headers.11ty.js`, X-Robots-Tag noindex).
  - `scripts/serve.mjs` honours `SITE_DIR`, used to review a second build (`_site-lead/`, gitignored) while reviewers held `_site/`.
  - `.claude/launch.json` (`pedlex-dev`, `npm run dev` on :8080).
- CLAUDE.md rules 2 and 3 updated: the lead may trim copy; placeholders are allowed under rules.

## 2026-10-29 14:35 · lead
- **Reviewed and merged all three builder branches** (`feat/hero-stats-trust`, `feat/problem-gallery-process-why`, `feat/form-faq`) on the first attempt, so none were pruned. Audit: no raw hex, no px font sizes, no `!important`; macros, `{% picture %}` and `{% icon %}` used throughout; copy rendered from JSON only. The form JS keeps PII out of the dataLayer, has a honeypot, double-submit protection, accessible errors and UTM capture; checked by reading the code. Doc conflicts (PROJECT.md / TIMELINE.md) resolved as unions.
- **Approved builder requests, applied by lead:** `--line-strong` (#8A949C, 3.1:1) for input borders; `--dur-drift` / `--dur-marquee` tokens (section vars now point at them); header CTA `nowrap` (+ smaller under 23rem); `shoot.mjs` `settle()` uses instant scroll and waits for images (it never reached the bottom under smooth scroll, so lazy images were blank in screenshots); section shots make the sticky header static; `.claude/worktrees/` gitignored.
- **Declined:** none. Deferred: certification-badge optical normalisation (minor; better source files from Pedlex would fix it).
- Lead visual pass at 1440 and 390: cohesive. One suspected bug (« projet(facultatif) » missing a space) was **disproved** with an element shot (the text is « projet (facultatif) »); it was a crop artefact. Mobile full-width CTAs wrap to 2 lines; left for the review round to weigh in independently.

## 2026-10-29 · builder:hero-stats-trust
- Built Hero, Stats and Trust bar on `feat/hero-stats-trust` (`sections/{hero,stats,trust}.njk`, `styles/sections/{hero,stats,trust}.css`, `scripts/sections/{stats-counter,trust-marquee}.js`).
  - Hero: copy left (eyebrow, the one H1, lead, text, CTA + quiet phone link, check-icon trust line), photo right. From 64rem the photo bleeds to the right edge and sits on the stats band; slow 24s drift (off under reduced motion); small « Depuis 1976 » tag. LCP preload via new `{% preloadPicture %}` shortcode (`eleventy.config.js`) in `layouts/base.njk`.
  - Stats: navy compact band, three columns with hairlines (subgrid aligns figures), visually-hidden h2; counters count up once in view, final values in HTML, SR-safe.
  - Trust: calm h2 caption, grayscale logos at a uniform optical size; JS marquee (clones aria-hidden, 40s loop, edge fade, pauses on hover/focus); static centred row without JS or with reduced motion.
- Why: sections 1-3 of the Racking master; nothing above the fold animates in, so the hero renders immediately.

## 2026-10-29 14:05 · builder:problem-gallery-process-why
- Built sections 4–7 on `feat/problem-gallery-process-why`: `sections/{problem,gallery,process,why}.njk`, `styles/sections/{problem,gallery,process,why}.css`, `scripts/sections/gallery-carousel.js`. No shared files or copy changed; macros used as-is.
- Problem: 5/7 split with sticky intro from 80rem (stacked head + 2x2 cards below that), CTA row. Gallery: full-bleed scroll-snap row (slides rest on the container edges, scroll out to the viewport), prev/next + « 01 / 06 » counter + arrow/Home/End keys, aria-disabled ends, no autoplay; plain scrollable row without JS. Process: photo column stretched to the steps' height, numbered chips joined by a hairline rail, CTA. Why: centred head, 6 cards, grayscale certification strip; no CTA (form follows).
- Verified: build clean; 360–1920 screenshots; carousel Playwright test 34/34 in Chrome 156 and 32/32 in Edge (buttons, keys, swipe counter, reduced motion, no-JS). Found: `settle()` in shoot.mjs doesn't reach the page bottom (smooth scroll), so lazy images low on long pages show blank in harness shots (see report).

## 2026-10-29 · builder:form-faq
- Branch `feat/form-faq`: section 8 Form (`#consultation`, navy) and section 9 FAQ. Files: `sections/form.njk`, `faq.njk`, `styles/sections/form.css`, `faq.css`, `scripts/sections/lead-form.js`. No shared files, macros or content changed.
- Form: `.split` with intro + reassurance + phone fallback left, white card right (card sits between intro and phone on mobile); 2-column fields from a container query; POST only; inline accessible errors (aria-invalid/describedby, `role="alert"` summary, focus first error), honeypot, UTM capture (URL → sessionStorage), `generate_lead` with no personal data, preview redirect / endpoint fetch. JS sets `novalidate` so no-JS visitors keep native validation.
- FAQ: native `<details>` accordion (hairlines, plus → x), height ease via `::details-content` (reduced-motion off, no JS), closing card with `ctaRow` + phone.
- Why: the form is the page's conversion point; tested with Playwright (validation, redirect, dataLayer, honeypot, endpoint failure, FAQ keyboard).

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
