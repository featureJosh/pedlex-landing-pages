# Pedlex Campaign Landing Pages: PROJECT.md

> **Source of truth for every human and agent on this project.** If something here is wrong, fix it here first.
> Agent rules live in [CLAUDE.md](CLAUDE.md). The change log is [TIMELINE.md](TIMELINE.md). Lead session state is [HANDOFF.md](HANDOFF.md).
> Last updated: 2026-10-29 15:30 by the project lead (Claude).

---

## 1. What this is

Dedicated **campaign landing pages** for **Pedlex Ltée**, a family-owned Québec integrator of industrial storage (pallet racking, mezzanines, shelving, Rousseau products) founded in 1976. 2026 is their 50th anniversary.

Pedlex's agency **Maïeutyk** is running four paid video campaigns (4–6 weeks each, dates TBD): **Racking → Général → Mezzanines → Rousseau**. Without a dedicated page, paid clicks land on pedlex.com, a full corporate site with navigation, catalogues and a Shopify store, and get lost. Each landing page continues the conversation its video starts and asks for **one action: a free consultation request**.

| | |
|---|---|
| **Client** | Pedlex Ltée: Francis Poirier (President, final mockup sign-off), Camille Brun (Marketing), Alex (lead inbox) |
| **Agency (ads + copy)** | Maïeutyk: Erin O'Reilly (copy, videos, GTM), Elke Steinwender (budget, approvals) |
| **Built by** | Luxy Media: Raffi (strategy), Josh (production lead), Kaisey (scope), Avinash K (WordPress, if chosen) |
| **Visitors** | B2B decision-makers in Québec (plant, ops, warehouse and maintenance managers, owners, procurement) arriving from a video ad on mobile or desktop. They are busy professionals: they skim, judge in seconds, and leave if the page doesn't match the ad. |
| **Their goal** | Confirm Pedlex can fix *their* warehouse problem, trust them quickly, and ask for a consultation with minimal effort. |
| **Our goal** | A completed consultation form, which fires a measurable conversion (GTM → GA4, Meta, LinkedIn) so Maïeutyk can optimise ad spend. |

**Brief:** [docs/internal/Pedlex Landing Pages — Brief.pdf](docs/internal/) (Kaisey, 2026-10-28). Follow it **closely but not slavishly**: it is a guide, not guardrails.
**Client context:** [claude/context.md](claude/context.md) (Luxy's assistant context for Pedlex: brand, contacts, proof figures). Read-only reference for this project.

---

## 2. Scope

| Page | Status | Copy | Photos | Preview URL |
|---|---|---|---|---|
| **Racking** (master template) | **In review** (round 1) | FR: [docs/copy/racking-fr.md](docs/copy/racking-fr.md) · EN: **Luxy draft** (`racking/en.json`) until Maïeutyk's | 9 Racking photos ✅ (8 used) | `/racking/` · `/racking/en/` |
| Général | Not started | FR written, pending client validation (not in repo yet) | Pending (mixed: racking, mezzanines, shelving, workstations) | `/general/` |
| Mezzanines | Not started | To come (Erin) | Pending | `/mezzanines/` |
| Rousseau | Not started | To come (Erin) | Pending | `/rousseau/` |

Each page ships **FR (master) + EN** and has a **thank-you page** (`/merci/`, `/en/thank-you/`). EN copy comes later: French is designed first because it is longer and harder to fit.

**Repo:** https://github.com/featureJosh/pedlex-landing-pages (private).

**Live preview (team QA): Cloudflare Pages on Josh's account (decided by Josh, 2026-10-29).** The repo stays **private** on `featureJosh` (no GitHub Pro). It goes public only when the client says so, and at that point GitHub Pages can take over (`pages.yml` is ready, gated on the repo variable `PAGES_ENABLED`). Until Josh connects Cloudflare, previews are local (`npm run dev`).

**Connecting Cloudflare Pages (Josh, one time, ~5 min):** Cloudflare dashboard → Workers & Pages → Create → Pages → *Connect to Git* → authorise the Cloudflare GitHub app for `featureJosh/pedlex-landing-pages` only → settings:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Environment variables | none for previews (`SITE_ENV` stays unset, so tracking is off and pages are `noindex`) |
| Node | read from `.node-version` (22) |

Every push to `main` then deploys to `https://<project>.pages.dev/`, and every other branch gets its own preview URL (handy for builder branches). The QA hub is at `/`, Racking at `/racking/`. Preview builds also emit a `_headers` file with `X-Robots-Tag: noindex, nofollow`. A `*.pages.dev` URL is public to anyone who has it. To restrict it to the team, add Cloudflare Access (Zero Trust, free up to 50 users) on the project. Optional.

**Moving to the client's Cloudflare later:** transfer the repo (§12), then the client creates their own Pages project from it with the same settings, adds the production env vars (`SITE_ENV=production`, `LANDING=<slug>`, `FORM_ENDPOINT`) and their custom domain. Josh's project is then deleted. Nothing in the repo is tied to Josh's account.

---

## 3. Platform strategy (CMS-agnostic, transferable)

The final host is **undecided** (brief §10 #1): WordPress (as quoted), raw files on Cloudflare, or GitHub → Netlify / Cloudflare Pages (client's likely direction). So this repo is built to fit any of them:

- **Output is plain static HTML/CSS/JS** in `_site/`, built by [Eleventy](https://www.11ty.dev/) (`npm run build`). No runtime framework, no client-side rendering.
- **Content is data:** each page's copy lives in `src/content/<slug>/<lang>.json`. Templates never contain copy. Porting to WordPress means mapping these JSON keys to ACF fields or blocks and the section partials to template parts.
- **One master template:** sections are reusable partials (`src/_includes/sections/*.njk`). A new landing is a new content folder plus photos. The page's `"sections": [...]` array picks and orders blocks.
- **Build modes:**
  - Preview (default): every landing under `/<slug>/`, plus the QA hub at `/`.
  - `PATH_PREFIX=/pedlex-landing-pages/`: used by GitHub Pages.
  - `LANDING=racking`: one landing at the site root (production subdomain, e.g. `racking.pedlex.com/`, `/en/`, `/merci/`). No QA hub.
  - `SITE_ENV=production`: turns on GTM and production robots rules. **Off in every preview.**
  - `FORM_ENDPOINT=<url>`: where the form POSTs. Empty means preview mode (validates, fires the dataLayer event, redirects to the thank-you page, sends nothing).
- **Netlify / Cloudflare Pages:** build command `npm run build`, output dir `_site`, plus env vars above. Node ≥ 20.
- **Transfer:** the repo lives at `featureJosh/pedlex-landing-pages` (private) and will be transferred to the client's GitHub. See §12, "Before transfer".

---

## 4. Architecture & folder map

```
├── PROJECT.md  CLAUDE.md  TIMELINE.md  HANDOFF.md  README.md
├── assets-source/           Original media + brand fonts (committed). Never edit; re-run `npm run images`.
│   ├── racking/             Racking 1–9 (Drive "2. Images")
│   ├── clients/             6 client logos (Drive "Logos clients")
│   ├── certifications/      CNESST, SafeContractor, ComplyWorks (from pedlex.com footer)
│   ├── brand/               Pedlex logo (329px PNG from pedlex.com; vector pending)
│   └── fonts/               Scania Sans CY + CY Headline WOFF2 (from pedlex.com; licensed for Pedlex)
├── docs/
│   ├── copy/                Verbatim copy from Maïeutyk's docs (racking-fr.md)
│   └── internal/            Brief PDF (Luxy-internal: remove before transfer)
├── claude/                  Luxy's assistant context for Pedlex (internal: remove before transfer)
├── qa/                      Review reports (QA / User / Client agents). shots/ is gitignored.
├── scripts/                 build-images, copy-fonts, serve, shoot (screenshot harness)
├── lib/bundle.js            Concatenates src/styles and src/scripts into one CSS and one JS file
├── eleventy.config.js       Shortcodes: {% icon %}, {% picture %}; filters: plain
└── src/
    ├── _data/               site.js (company facts, tracking, form), landings.js (content loader + FR typography), build.js
    ├── content/
    │   ├── _shared/{fr,en}.json   UI strings: CTA, form, footer, cookie banner, thank-you
    │   └── racking/{fr,en}.json   Page copy (sections, images, alt text)
    ├── _includes/
    │   ├── layouts/base.njk
    │   ├── partials/        header, footer, tracking-head/body, cookie-banner
    │   ├── components/ui.njk  Macros: button, sectionHead, featureCard, ctaRow
    │   └── sections/        hero, stats, trust, problem, gallery, process, why, form, faq
    ├── styles/              00-tokens → 04-motion, components/, sections/, pages/ (bundled in that order)
    ├── scripts/             00-core.js, components/, sections/ (bundled, IIFE modules)
    ├── landing.njk  merci.njk  index.njk (QA hub)
    └── bundles/             css.11ty.js, js.11ty.js
```

**Images:** originals in `assets-source/` → `npm run images` → responsive WebP + JPEG in `src/assets/img/` (gitignored, rebuilt on every build) + `src/_data/images.json`. Use `{% picture "racking/racking-2", alt, sizes, opts %}`; never write `<img>` by hand.
**Icons:** [Lucide](https://lucide.dev) via `{% icon "name" %}`. One icon family only.
**Fonts:** self-hosted **Scania Sans CY** (body, H2/H3) and **Scania Sans CY Headline** (H1 only; caps-only display cut, as pedlex.com uses it). The WOFF2 files are the ones pedlex.com serves, in `assets-source/fonts/`; licensed for Pedlex (Josh / Kaisey). **Barlow Condensed** (OFL) stays for condensed caps labels until a Scania Sans Condensed WOFF2 arrives (it exists in Drive `CATALOGUE/FONTS`).

---

## 5. Design direction

**Clean, modern, professional.** It should feel like a serious industrial company's site, with the details a professional visitor expects. **Subtle motion only: "it's not a theme park."** Restraint and whitespace do the work.

- **Industrial, confident, precise** (brief §1.1). Built from Pedlex's real installs and 50-year family story. Never stock warehouses or AI renders.
- **Echo pedlex.com without copying it.** Navy-led palette, condensed caps labels, crisp 4px button radius.
- **Borrow Federal Steel's structure, not its look.** Their page is the client's inspiration for section order only. It has placeholder copy, mixed CTA labels, duplicated assets and generic photos. We are the opposite.
- **One action, labels that follow the copy:** every CTA scrolls to the form and focuses the first field, and each label is the copywriter's for that spot (hero/process « Demandez une… », problem « Demandez votre… », form « Demander ma… », header « Consultation gratuite »). Josh, 2026-10-29: forcing one identical string everywhere is bad design. No off-page links except legal, phone and the FR/EN toggle.
- **No navigation** in the header: logo, phone, FR/EN, CTA.
- **Skimmable:** every section reads in 3 seconds via eyebrow → headline → visual. Body copy is supporting detail.
- **An appetizer, not the company (Josh, 2026-10-29):** only what matters for the one action, so the visitor *wants* more. When in doubt, cut. No extra proof blocks or sections. The full story lives on pedlex.com (quiet footer link). Length budget at 390px: page ≤ ~7,000px, first form field ≤ ~4,800px (was 10,280 / 7,376).

**Palette (official, pedlex.com):** navy `#0F3A5F`, button navy `#1C3A5C`, blue `#2F5091`, link blue `#234F96`, ink `#1D1C1E`, text `#333333` / `#3F464C`, greys `#EEEFF2` / `#D4DCE2`. Derived tints live in `src/styles/00-tokens.css`. **Never** `#005DA4` or `#8EA4B0`.

**Motion budget:** fade-up reveal (14px, 700ms, once), animated stat counters (once), slow hero image drift, auto-scrolling logo marquee (pausable), hover lifts of ≤2px. Everything respects `prefers-reduced-motion`. Nothing loops attention-grabbingly, bounces, parallaxes or spins.

### Section rhythm (Racking master)

| # | Block | Surface | Notes |
|---|---|---|---|
| — | Header | white, sticky | logo · phone · FR/EN · CTA |
| 1 | Hero | white | split: copy left, photo right (racking-2) with slow drift; trust line; CTA; « 50 ans · 1976–2026 » chip |
| 2 | Stats | navy | 30 à 50 % · 50 ans · 10 000+ entreprises (2026 catalogue); counters animate once |
| 3 | Trust bar | white | « Ils nous font confiance… » + logo marquee |
| 4 | Problem + solution | tint | 2 paragraphs + 4 feature cards + CTA |
| 5 | Gallery « Réalisations » | white | 5 real installs, carousel (swipe / arrows / keys) |
| 6 | Process | tint | 3 numbered steps + installer photo (racking-5) + CTA |
| 7 | Why Pedlex | white | 4 feature cards + certification badges |
| 8 | Form | navy | copy + reassurance left, form card right |
| 9 | FAQ | white | 4-item accordion + closing CTA |
| — | Footer | deep navy | address, phones, email, privacy, cookie prefs, RBQ |

---

## 6. Functional requirements (summary of brief §6)

- **Form fields:** Prénom et nom · Entreprise · Courriel · Téléphone · Ville · Projet (facultatif). Inline validation, accessible errors, honeypot, no CAPTCHA.
- **On submit:** push `{ event: "generate_lead", landing, lang }` to `dataLayer`, POST to `FORM_ENDPOINT` (when set), redirect to the thank-you page. GTM also triggers on the thank-you URL.
- **Routing (go-live):** email to info@pedlex.com + row in a shared Google Sheet. Endpoint depends on the platform decision.
- **Tracking:** GTM `GTM-M6T7MH6` (production only) → GA4, Meta Lead, LinkedIn Insight. Google Consent Mode v2, **denied by default** until the visitor accepts the Law 25 banner.
- **Performance:** LCP < 2.5s on mobile. WebP images with explicit dimensions, hero image eager + high priority, everything else lazy, one CSS and one JS file, self-hosted fonts.
- **Accessibility:** WCAG 2.2 AA. Semantic landmarks, skip link, visible focus, labelled fields, accordion/carousel keyboard support, AA contrast, reduced motion.
- **SEO:** `noindex` on previews. Production robots per Maïeutyk (paid-only pages usually `noindex, follow`).

---

## 7. Status board

> Agents: move items as you work: **To-do → In progress (with your branch name) → Done (with date)**. Never delete history; Done items stay.

### 🔄 In progress
- [ ] Racking FR: approved round-1 notes → builders. Phase 1: `feat/r1-system` (tokens, macros, phone, buttons, eyebrow, merci) ∥ `feat/r1-behaviour` (scroll-to, cookie banner, marquee pause, carousel, form). Phase 2: `feat/r1-hero` (mobile photo, motion variants + placeholder loop) ∥ `feat/r1-sections` (compact cards, trust + placeholder logos, problem, stats)

### 📋 To-do
- [ ] **Josh:** connect Cloudflare Pages to the repo (§2: settings table). Everything on the repo side is ready
- [ ] Racking FR: re-review (round 2) after the approved notes land
- [ ] Hero motion: preview variants for Francis (photo drift / video loop / slideshow) with a **placeholder** loop until Erin's videos arrive (brief §10 #4)
- [ ] Client logos: placeholders to reach 10 in the trust bar until real files arrive (Josh, 2026-10-29)
- [ ] Racking EN: swap the Luxy draft for Maïeutyk's EN copy when it arrives (brief §10 #3)
- [ ] Form endpoint for the chosen platform (Netlify Forms / CF Pages Function / WordPress) + Google Sheet logging
- [ ] Lighthouse / Core Web Vitals pass on mobile (target LCP < 2.5s)
- [ ] Scania Sans **Condensed** WOFF2 (Drive `CATALOGUE/FONTS`) to replace Barlow Condensed on labels/buttons
- [ ] Swap logo for the vector file from Drive
- [ ] Add 2–4 client logos to reach 8–10 (Bombardier, Air Canada, CAE, Hydro-Québec candidates)
- [ ] Général page (copy in Drive, pending validation)
- [ ] Mezzanines page (copy to come)
- [ ] Rousseau page (copy to come)

### ✅ Done
- [x] 2026-10-29: Review round 1 run (QA / User / Client agents) and triaged into §8
- [x] 2026-10-29: Josh's answers applied: CTA labels follow the copy doc per section; stat « 30 à 50 % » (stats + FAQ); « 1 jour ouvrable » kept; certification badges kept (label made accurate); Cloudflare Pages on Josh's account for previews
- [x] 2026-10-29: Scania Sans CY + CY Headline self-hosted (H1 in Headline, everything else in CY); Barlow sans removed
- [x] 2026-10-29: Racking EN Luxy draft (`src/content/racking/en.json`) → `/racking/en/` + `/racking/en/thank-you/`; FR/EN toggle (header from 30rem, footer always)
- [x] 2026-10-29: Cloudflare-ready: `.node-version` (22), preview-only `_headers` noindex
- [x] 2026-10-29: Racking FR sections built by 3 builder agents, lead-reviewed and merged (1st attempt, no prunes): `feat/hero-stats-trust`, `feat/problem-gallery-process-why`, `feat/form-faq`
- [x] 2026-10-29: Lead fixes from builder reports: `--line-strong` input borders (WCAG 1.4.11), motion tokens `--dur-drift` / `--dur-marquee`, header CTA nowrap, screenshot harness instant-scroll + image wait + static header for section shots
- [x] 2026-10-29: Repo scaffold: Eleventy static build, CMS-agnostic content model, build modes (preview / single-landing / production)
- [x] 2026-10-29: Asset intake: 9 Racking photos, 6 client logos, Pedlex logo + 3 certification badges (pedlex.com); responsive image pipeline
- [x] 2026-10-29: Design system: tokens, fonts (stand-in), base, layout primitives, motion rules, button / card / header / footer / cookie banner components
- [x] 2026-10-29: Shared UI: header, footer, Law 25 cookie banner + Consent Mode v2, thank-you page, QA hub
- [x] 2026-10-29: Racking FR copy captured verbatim from Maïeutyk's doc → `docs/copy/racking-fr.md` + `src/content/racking/fr.json`
- [x] 2026-10-29: Review tooling: `scripts/shoot.mjs` (Playwright + system Edge) screenshots at 390 / 768 / 1440
- [x] 2026-10-29: PROJECT.md, CLAUDE.md, TIMELINE.md, HANDOFF.md
- [x] 2026-10-29: Private GitHub repo `featureJosh/pedlex-landing-pages`; CI build check (`ci.yml`); Pages deploy workflow ready but gated (see §2: plan limitation)

### 🐞 Bugs
_None open._ Format: `- [ ] BUG-### (severity) description: where, how to reproduce, owner`

---

## 8. Review notes (approved by the lead)

> Review agents write raw findings to `qa/`. **Only the lead copies findings here, after approving them.** Approved notes are mandatory work. Rejected notes go under "Declined" with a one-line reason.
> Format: `- [ ] QA-### [section] finding → expected fix` (tick when fixed, with the date).

### QA Notes
Round 1 report: [qa/qa-2026-10-29-r1.md](qa/qa-2026-10-29-r1.md). Passed: no overflow, no console errors, one h1, clean heading order, alt text, noindex, every CTA → `#consultation` + focus, accessible validation, `generate_lead` without PII, no-JS POST, FAQ + carousel keyboard, reduced motion, CLS 0.004, contrast ≥ 5.28:1, section padding consistent.
- [ ] QA-1 [consultation, phones] CTA lands on the section intro; focused field off-screen at 390×664 → scroll to the form card below 64rem (= USER-6)
- [ ] QA-2 [cookie banner, phones] 226px sheet hides the hero CTA; no Escape → compact bar ≤140px below 30rem, visually-hidden title, side-by-side buttons; Escape = Refuser (= USER-5)
- [ ] QA-3 [merci] icon + eyebrow on one line → `display:grid; margin-inline:auto` + eyebrow fix (= USER-7)
- [ ] QA-4 [trust] marquee can't be paused by touch/keyboard (WCAG 2.2.2) → pause/play button (`data-marquee-toggle`, aria-pressed, 44px)
- [ ] QA-5 [global] `.eyebrow` inline-flex sits 10–11px low in every section → `display:flex; width:fit-content` (+ centred variants)
- [ ] QA-6 [CTAs, phones] ctaRow + submit wrap to 73px vs hero 56px → move the tight mobile padding into `button.css` for every `.btn--lg` (= USER-10)
- [ ] QA-7 [problem] head→cards gap uses the split gap, not `--section-gap`; ≥80rem the CTA floats 231px under the intro → `row-gap: var(--section-gap)`; CTA inside the sticky intro
- [ ] QA-8 [gallery] counter skips « 05 » (clamped end) → report the left-most fully visible slide, keep the last-slide override
- [ ] QA-9 [cookie banner] reopened banner drops focus to body on choice → return focus to the opener
- [ ] QA-10 [form] « (514) 324-5310 poste 22 » rejected → strip extension suffix (poste/ext/x) before counting digits
- [ ] QA-11 [header, footer] header CTA 40px, phone 40×40 → 44px (`--target-min: 2.75rem`) for header controls + footer links
- [ ] QA-12 [global] phone link built 6 ways → `phoneLink` macro + `components/phone.css`, replace all copies
- [ ] QA-13 [global] raw values outside tokens (icons, controls, tracking, opacity, header bg, measures, nudges) → tokens, list in TIMELINE
- [ ] QA-14 [global] hand-rolled buttons (submit, cookie), eyebrows (hero, merci), heads (faq closing, trust) → `button` gets `type`/`attrs`/`iconStart`, `sectionHead` gets `level`/`class`
- [ ] QA-15 [global] caps-label declaration repeated 6× → `.label-caps` utility
- [ ] QA-16 [trust] JS hard-codes 40s, token dead → read `--trust-loop`
- [ ] QA-17 [hero, consultation] lead vs body measures misalign (54ch at two sizes) → font-independent measure
- [ ] QA-18 [hero, stats] FR line breaks: lone « simplement » at 1024 (recheck with Scania); stats labels capped at 26ch → recheck H1; drop the cap
- [ ] QA-19 [gallery, <64rem] controls before the track in tab order → move controls after the list
- [ ] QA-20 [merci] back arrow after the label → `iconStart`
- [ ] QA-21 [merci, 360] steps box cramped → `--space-m` padding below 30rem
- [ ] QA-22 [trust] uneven logo optical size; Pro-Expert barely legible → per-logo `scale` in content (`--logo-scale`)

### User Agent Notes
Round 1 report: [qa/user-2026-10-29-r1.md](qa/user-2026-10-29-r1.md). Verdict: "I'd have converted, but on mobile it was closer than it should be."
- [ ] USER-1 [hero, <48rem] first phone screen is all text, the photo starts at y≈804 → show the hero photo in the first screen (between H1 and lead, ~16:9), copy unchanged (same as CLIENT-7)
- [ ] USER-2 [problem, why, <48rem] 10 full-width cards ≈ 3,200px → compact `featureCard` variant on mobile (icon inline with h3, tighter padding tokens)
- [x] USER-4 [why] « Accréditations » + CNESST logo reads as borrowed authority → label « Santé et sécurité : conformité et préqualification » (lead, 2026-10-29)
- [ ] USER-5 [cookie banner, <48rem] 226px sheet covers the hero CTA → compact sheet ≤150px, buttons equal weight (same as CLIENT-18)
- [ ] USER-6 [consultation, <48rem] CTA lands on the section pitch, first field at the bottom edge → scroll to the form card on mobile
- [ ] USER-7 [merci] check icon and eyebrow side by side, off-centre → stack them (same as CLIENT-16)
- [x] USER-8 [gallery] store photos look like a back room → duplicate store shot (racking-8) removed, last slide captioned truthfully (lead, 2026-10-29); more industrial photos requested (§9)
- [ ] USER-9 [hero] trust-line icons touch the divider → padding-top token
- [ ] USER-10 [problem, process, consultation, <48rem] CTAs wrap to 2 lines with the arrow adrift → one-line or tidy wrap at 360–400px, consistent across all CTAs (same as CLIENT-14)
- [x] USER-11 [footer] RBQ number breaks mid-number → `.nowrap` (lead, 2026-10-29)
- [ ] USER-12 [trust, <48rem] only ~2 logos visible → smaller logo size on mobile so 3–4 show

### Client Agent Notes
Round 1 report: [qa/client-2026-10-29-r1.md](qa/client-2026-10-29-r1.md). Verdict: **approve with changes**. "Clearly better than and clearly different from Federal Steel"; undersells Pedlex's proof.
- [x] CLIENT-1 [stats] « Clé en main » is a phrase, not proof → « 10 000+ entreprises servies » (2026 catalogue headline figure) (lead, 2026-10-29)
- [x] CLIENT-2 [stats, faq] 40 % unbacked and inconsistent with Général → « 30 à 50 % » everywhere (Josh, 2026-10-29)
- [x] CLIENT-4 [why] CNESST is a regulator, not an accreditor → accurate label (lead, 2026-10-29)
- [x] CLIENT-6 [gallery] « Centre de distribution » caption on a store photo; two angles of one store → racking-8 removed, racking-9 « Entreposage commercial et de détail » (lead, 2026-10-29)
- [ ] CLIENT-7 [hero, mobile] no photo in the first screen → see USER-1
- [x] CLIENT-9 [hero, why] no family story / 50th moment → hero trust line « Entreprise familiale québécoise depuis 1976 », chip « 50 ans · 1976–2026 » (lead, 2026-10-29). Footer slogan logo waits for the vector file
- [x] CLIENT-10 [global] typography softer than the brand → Scania Sans (Headline for the H1) (lead, 2026-10-29)
- [ ] CLIENT-11 [trust] 6 mid-tier logos → placeholders to 10 now (Josh); real logos from the approved list requested (§9)
- [x] CLIENT-12 [consultation] toll-free only in the footer → « Sans frais 1 888 733-5399 » beside the phone in the form section (lead, 2026-10-29)
- [x] CLIENT-13 [why] « Sécurité et conformité » card is vague → certified installers + engineer inspection/certification to CSA A344 (from Pedlex's services list; flagged for client validation, §9) (lead, 2026-10-29)
- [ ] CLIENT-14 [CTAs, mobile] see USER-10
- [ ] CLIENT-16 [merci] icon/eyebrow off-balance → see USER-7. « Retour à la page Palettiers » done (lead, 2026-10-29)
- [x] CLIENT-17 [footer] RBQ split → see USER-11
- [ ] CLIENT-18 [cookie banner, mobile] → see USER-5

### Declined (with reason)
- QA-23 [header] short CTA « Consultation gratuite » not logged as a client question: settled by Josh's decision that labels follow context (§9 Q1).
- CLIENT-3 [consultation, merci] soften « 1 jour ouvrable »: Josh confirmed Pedlex replies within a day (2026-10-29).
- CLIENT-5 / USER-3 [gallery, proof] named projects and testimonials: we won't invent captions or quotes. Requested from Pedlex (§9). Gallery `detail` support gets built when the content exists.
- CLIENT-8 [header] vector logo: not available yet (Josh: later). Stays in §9 as a go-live condition.
- CLIENT-12 (part) [header] toll-free number in the header: no room at mobile widths, and 514 is Pedlex's main line. It's in the form section and footer instead.
- CLIENT-13 (part) [problem] add an install photo to the problem column: the only unused photo is a third store shot (racking-7); duplicating a gallery photo would weaken the gallery. Revisit when new photos arrive.
- CLIENT-15 [CTAs] « one label »: Josh decided labels follow the copy doc per section (2026-10-29).
- CLIENT-16 (part) [merci] add a photo to the thank-you page: it stays focused on confirmation and next steps.
- CLIENT-19 [hero] over-processed hero photo at 2×: not fixable in code. Original file requested (§9, raised to before go-live).

---

## 9. Outstanding from the client / agency

| Item | From | Blocks | Status |
|---|---|---|---|
| English copy (all pages) | Maïeutyk (Erin) | Official EN (Luxy draft live meanwhile) | Waiting |
| Scania Sans **Condensed** WOFF2 | Drive `CATALOGUE/FONTS` | Brand condensed labels (Barlow Condensed meanwhile) | Not in repo |
| Vector logo (« défie l'espace », sans slogan, white) | Drive (Luxy) | Crisp logo (329px PNG meanwhile) | Not in repo |
| 4+ client logos from the approved list (Bombardier, Air Canada, CAE, Hydro-Québec…), vector/hi-res | Pedlex / Luxy Drive | Trust bar (placeholders meanwhile) | Waiting |
| Campaign videos (4) | Erin | Hero video-loop option (placeholder loop meanwhile) | WeTransfer expired; re-send via Drive |
| 1–2 named projects with a figure (e.g. Groupe Ricochet, Airbus) + matching photos, or a short client quote | Pedlex | Gallery captions / proof (CLIENT-5, USER-3) | Requested |
| 2 more large industrial racking photos | Pedlex | Gallery (5 slides now) | Requested |
| Privacy-policy URL + Law 25 consent tool | Pedlex | Footer / consent links (placeholder URLs now) | Waiting |
| DNS access for subdomains | Pedlex | Go-live | Waiting |
| Shared Google Sheet for leads | TBD | Form routing | Waiting |
| Meta pixel status, LinkedIn Insight ID, GTM tag ownership | Erin | Conversion tracking | Waiting |
| Platform decision (WordPress vs static) | Raffi + Elke | Form endpoint, deploy | Open (brief §10 #1) |
| Hero treatment: photo vs motion loop | Francis | Hero | Open (brief §10 #4) |
| Original full-res racking-2 (hero) + higher-res Racking photos (max 1662px now) | Pedlex | Hero looks over-processed at 2× (CLIENT-19) | **Before go-live** |

### Client questions (raise at next review)
Josh, 2026-10-29: the content is followed loosely. The lead does what is right now, and the client gives feedback later. Unreasonable client input can be overridden.
1. ~~CTA wording~~ **Decided (Josh):** labels follow the copy doc per section (« une » hero/process, « votre » problem, « ma » submit). Forcing one identical label everywhere is bad design.
2. ~~Speed-to-lead~~ **Decided (Josh):** Pedlex can reply within a day; « 1 jour ouvrable » stays.
3. ~~Stat consistency~~ **Decided (Josh):** « 30 à 50 % » on every page.
4. **FAQ heading:** Luxy microcopy « Questions fréquentes » / « Vos questions, nos réponses. » (no change; confirm at review).
5. ~~Certification badges~~ **Decided (Josh):** OK to show. Label changed to « Santé et sécurité : conformité et préqualification », because CNESST is a regulator, not an accreditor.
6. **Luxy copy edits to validate:**
   - stat « 10 000+ entreprises servies au Québec et ailleurs » replaces « Clé en main »;
   - hero trust item « Entreprise familiale québécoise depuis 1976 » replaces « 50 ans d'expertise »;
   - « Sécurité et conformité » card text now names certified installers + CSA A344 engineer inspection;
   - FAQ figure « de 30 à 50 % »;
   - **appetizer trims:** hero 2nd paragraph, problem 1st paragraph, why cards « 50 ans d'expertise » + « Expertise technique » (repeat stats/hero), form 2nd paragraph, FAQ « s'occupe aussi de l'installation ? » (covered by « clé en main »);
   - footer link « Découvrir pedlex.com ».
7. **EN copy** is a Luxy draft; Maïeutyk's version replaces it wholesale.

---

## 10. Decisions log

| Date | Decision | By |
|---|---|---|
| 2026-10-29 | Static Eleventy build, content as JSON, CMS-agnostic, so it can go to WordPress, Netlify or Cloudflare later | Lead (per Josh) |
| 2026-10-29 | French is the design master; EN implemented after | Josh |
| 2026-10-29 | Private repo `featureJosh/pedlex-landing-pages`, GitHub Pages for team preview, transferable to the client | Josh |
| 2026-10-29 | Barlow / Barlow Condensed as a self-hosted stand-in for Scania Sans | Josh |
| 2026-10-29 | Tracking off in previews; Consent Mode v2 denied-by-default in production | Lead |
| 2026-10-29 | Preview form sends nothing: validates, fires the dataLayer event, redirects to the thank-you page | Lead |
| 2026-10-29 | Hero uses the racking-2 still with a slow CSS drift as the "motion loop" until videos arrive | Lead |
| 2026-10-29 | Previews on **Cloudflare Pages (Josh's account)**; repo stays private; client's Cloudflare later; GitHub Pages only if the repo goes public | Josh |
| 2026-10-29 | Client content is a guide: lead decides what's right now, client feedback later; unreasonable client input can be overridden | Josh |
| 2026-10-29 | CTA labels follow the copy doc per section (not one identical string) | Josh |
| 2026-10-29 | Stat « 30 à 50 % »; « 1 jour ouvrable » kept; certification badges shown | Josh |
| 2026-10-29 | Scania Sans (licensed for Pedlex) replaces Barlow; Headline cut for the H1 only; Barlow Condensed kept for labels until Scania Condensed arrives | Josh (licence) / Lead (usage) |
| 2026-10-29 | Placeholders are allowed for missing assets (client logos, hero video) until real files arrive; they must look intentionally neutral and be listed in §9 | Josh |
| 2026-10-29 | EN: Luxy draft translation now, replaced by Maïeutyk's copy later | Josh |
| 2026-10-29 | **Landing = appetizer:** short, only what matters; lead may trim client copy; reviewers' "add more proof" requests default to declined | Josh |
| 2026-10-29 | On phones (<30rem) the FR/EN toggle lives in the footer, not the header (room for phone + CTA) | Lead |

---

## 11. Workflow (summary; details in CLAUDE.md)

1. The lead plans the work and writes briefs. **Builder agents** work on branches (`feat/<area>`), one area each.
2. The lead reviews every branch against CLAUDE.md's Definition of Done. Pass → merge to `main`. Fail → delete the branch, retry with a sharper brief. **After 2 failed attempts the lead does it.**
3. After a merge set, three review agents run in parallel on the build:
   - **QA agent:** nitpicks everything (spacing, alignment, type scale, token misuse, duplicated markup that should be a component, a11y, console errors, responsive breakage).
   - **User agent:** an impatient, skimming professional from the ad. Clicks, scrolls and fills the form, and screenshots friction.
   - **Client agent:** Pedlex's eyes. Judges brand fit and identity from the rendered page only.
4. The lead triages findings into §8. Approved notes become work and go back to step 1.
5. Every merge is logged in TIMELINE.md. The status board above stays current.

---

## 12. Before transfer to the client's GitHub

- [ ] Remove Luxy-internal material: `claude/`, `docs/internal/`, `HANDOFF.md`, `qa/` reports (keep the tooling), and internal notes in this file (§7–§9) if Pedlex shouldn't see them
- [ ] Make sure no credentials or tokens are anywhere in history
- [ ] Before making the repo **public**: confirm the Scania Sans licence allows its WOFF2 files in a public repo. If not, move `assets-source/fonts/` out of git (and out of history) and supply the fonts at build time
- [ ] README: platform-specific deploy steps for the chosen host
- [ ] Transfer: GitHub → Settings → Transfer ownership → client org. Re-enable Pages / connect Netlify or CF Pages on their side
