# Pedlex Campaign Landing Pages: PROJECT.md

> **Source of truth for every human and agent on this project.** If something here is wrong, fix it here first.
> Agent rules live in [CLAUDE.md](CLAUDE.md). The change log is [TIMELINE.md](TIMELINE.md). Lead session state is [HANDOFF.md](HANDOFF.md).
> Last updated: 2026-10-29 by the project lead (Claude).

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
| **Racking** (master template) | **In build** | FR verbatim: [docs/copy/racking-fr.md](docs/copy/racking-fr.md) · EN pending | 9 Racking photos ✅ | `/racking/` |
| Général | Not started | FR written, pending client validation (not in repo yet) | Pending (mixed: racking, mezzanines, shelving, workstations) | `/general/` |
| Mezzanines | Not started | To come (Erin) | Pending | `/mezzanines/` |
| Rousseau | Not started | To come (Erin) | Pending | `/rousseau/` |

Each page ships **FR (master) + EN** and has a **thank-you page** (`/merci/`, `/en/thank-you/`). EN copy comes later: French is designed first because it is longer and harder to fit.

**Live preview (team QA):** https://featurejosh.github.io/pedlex-landing-pages/ (GitHub Pages, auto-deploys from `main`). The URL is unlisted and every page is `noindex`, but anyone with the link can open it. Don't share it outside Luxy and Pedlex.

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
├── assets-source/           Original media (committed). Never edit; re-run `npm run images`.
│   ├── racking/             Racking 1–9 (Drive "2. Images")
│   ├── clients/             6 client logos (Drive "Logos clients")
│   ├── certifications/      CNESST, SafeContractor, ComplyWorks (from pedlex.com footer)
│   └── brand/               Pedlex logo (329px PNG from pedlex.com; vector pending)
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
**Fonts:** self-hosted Barlow / Barlow Condensed **as a stand-in** for Scania Sans (§9).

---

## 5. Design direction

**Clean, modern, professional.** It should feel like a serious industrial company's site, with the details a professional visitor expects. **Subtle motion only: "it's not a theme park."** Restraint and whitespace do the work.

- **Industrial, confident, precise** (brief §1.1). Built from Pedlex's real installs and 50-year family story. Never stock warehouses or AI renders.
- **Echo pedlex.com without copying it.** Navy-led palette, condensed caps labels, crisp 4px button radius.
- **Borrow Federal Steel's structure, not its look.** Their page is the client's inspiration for section order only. It has placeholder copy, mixed CTA labels, duplicated assets and generic photos. We are the opposite.
- **One CTA label everywhere:** « Demandez une consultation gratuite ». Every CTA scrolls to the form and focuses the first field. No off-page links except legal, phone and the FR/EN toggle.
- **No navigation** in the header: logo, phone, FR/EN, CTA.
- **Skimmable:** every section reads in 3 seconds via eyebrow → headline → visual. Body copy is supporting detail.

**Palette (official, pedlex.com):** navy `#0F3A5F`, button navy `#1C3A5C`, blue `#2F5091`, link blue `#234F96`, ink `#1D1C1E`, text `#333333` / `#3F464C`, greys `#EEEFF2` / `#D4DCE2`. Derived tints live in `src/styles/00-tokens.css`. **Never** `#005DA4` or `#8EA4B0`.

**Motion budget:** fade-up reveal (14px, 700ms, once), animated stat counters (once), slow hero image drift, auto-scrolling logo marquee (pausable), hover lifts of ≤2px. Everything respects `prefers-reduced-motion`. Nothing loops attention-grabbingly, bounces, parallaxes or spins.

### Section rhythm (Racking master)

| # | Block | Surface | Notes |
|---|---|---|---|
| — | Header | white, sticky | logo · phone · FR/EN · CTA |
| 1 | Hero | white | split: copy left, photo right (racking-2) with slow drift; trust line; CTA |
| 2 | Stats | navy | 3 figures, counters animate once |
| 3 | Trust bar | white | « Ils nous font confiance… » + logo marquee |
| 4 | Problem + solution | tint | 2 paragraphs + 4 feature cards + CTA |
| 5 | Gallery « Réalisations » | white | 6 real installs, carousel (swipe / arrows / keys) |
| 6 | Process | tint | 3 numbered steps + installer photo (racking-5) + CTA |
| 7 | Why Pedlex | white | 6 feature cards + certification badges |
| 8 | Form | navy | copy + reassurance left, form card right |
| 9 | FAQ | white | 5-item accordion + closing CTA |
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
- [ ] Racking FR: section builds (hero, stats, trust, problem, gallery, process, why, form, faq). Assigned to builder agents via workflow. See TIMELINE.md.

### 📋 To-do
- [ ] Racking FR: lead review + merge of section branches
- [ ] Racking FR: QA agent pass → triage into §8 QA Notes
- [ ] Racking FR: User agent pass → triage into §8 User Agent Notes
- [ ] Racking FR: Client agent pass → triage into §8 Client Agent Notes
- [ ] Racking FR: apply approved notes, re-review
- [ ] Hero motion: compare "photo drift" vs "video loop" variants for Francis (brief §10 #4); needs campaign video files
- [ ] Racking EN: `src/content/racking/en.json` once Maïeutyk supplies EN copy (brief §10 #3)
- [ ] Form endpoint for the chosen platform (Netlify Forms / CF Pages Function / WordPress) + Google Sheet logging
- [ ] Lighthouse / Core Web Vitals pass on mobile (target LCP < 2.5s)
- [ ] Swap stand-in fonts for Scania Sans WOFF2 (when files + web licence arrive)
- [ ] Swap logo for the vector file from Drive
- [ ] Add 2–4 client logos to reach 8–10 (Bombardier, Air Canada, CAE, Hydro-Québec candidates)
- [ ] Général page (copy in Drive, pending validation)
- [ ] Mezzanines page (copy to come)
- [ ] Rousseau page (copy to come)

### ✅ Done
- [x] 2026-10-29: Repo scaffold: Eleventy static build, CMS-agnostic content model, build modes (preview / single-landing / production)
- [x] 2026-10-29: Asset intake: 9 Racking photos, 6 client logos, Pedlex logo + 3 certification badges (pedlex.com); responsive image pipeline
- [x] 2026-10-29: Design system: tokens, fonts (stand-in), base, layout primitives, motion rules, button / card / header / footer / cookie banner components
- [x] 2026-10-29: Shared UI: header, footer, Law 25 cookie banner + Consent Mode v2, thank-you page, QA hub
- [x] 2026-10-29: Racking FR copy captured verbatim from Maïeutyk's doc → `docs/copy/racking-fr.md` + `src/content/racking/fr.json`
- [x] 2026-10-29: Review tooling: `scripts/shoot.mjs` (Playwright + system Edge) screenshots at 390 / 768 / 1440
- [x] 2026-10-29: PROJECT.md, CLAUDE.md, TIMELINE.md, HANDOFF.md
- [x] 2026-10-29: Private GitHub repo + GitHub Pages preview (Actions)

### 🐞 Bugs
_None open._ Format: `- [ ] BUG-### (severity) description: where, how to reproduce, owner`

---

## 8. Review notes (approved by the lead)

> Review agents write raw findings to `qa/`. **Only the lead copies findings here, after approving them.** Approved notes are mandatory work. Rejected notes go under "Declined" with a one-line reason.
> Format: `- [ ] QA-### [section] finding → expected fix` (tick when fixed, with the date).

### QA Notes
_No review run yet._

### User Agent Notes
_No review run yet._

### Client Agent Notes
_No review run yet._

### Declined (with reason)
_None._

---

## 9. Outstanding from the client / agency

| Item | From | Blocks | Status |
|---|---|---|---|
| English copy (all pages) | Maïeutyk (Erin) | EN pages | Waiting |
| Scania Sans WOFF2 + web-licence confirmation | Luxy / Pedlex | Final typography (Barlow stand-in meanwhile) | Waiting |
| Vector logo (« défie l'espace », sans slogan, white) | Drive (Luxy) | Crisp logo (329px PNG meanwhile) | Not in repo |
| 2–4 more client logos, vector/hi-res | Pedlex | Trust bar 8–10 logos (6 now) | Waiting |
| Campaign videos (4) | Erin | Hero video-loop option | WeTransfer expired; re-send via Drive |
| Privacy-policy URL + Law 25 consent tool | Pedlex | Footer / consent links (placeholder URLs now) | Waiting |
| DNS access for subdomains | Pedlex | Go-live | Waiting |
| Shared Google Sheet for leads | TBD | Form routing | Waiting |
| Meta pixel status, LinkedIn Insight ID, GTM tag ownership | Erin | Conversion tracking | Waiting |
| Platform decision (WordPress vs static) | Raffi + Elke | Form endpoint, deploy | Open (brief §10 #1) |
| Hero treatment: photo vs motion loop | Francis | Hero | Open (brief §10 #4) |
| Higher-res Racking photos (max is 1662px wide now) | Pedlex | Sharper hero on large screens | Nice to have |

### Client questions (raise at next review)
1. **CTA wording:** copy doc section 3 says « Demandez **votre** consultation gratuite »; the brief requires one label (« … **une** … »). We use « une » everywhere. OK?
2. **Speed-to-lead promise:** the form's reassurance line says « Réponse d'un expert en 1 jour ouvrable ». Can Pedlex commit to that? (brief §10 #9) If not, we soften it.
3. **Stat consistency:** Racking says « jusqu'à 40 % », Général says « 30 à 50 % » (brief §10 #7).
4. **FAQ heading:** the copy doc has no eyebrow/H2 for the FAQ. Luxy microcopy used: « Questions fréquentes » / « Vos questions, nos réponses. »
5. **Certification badges** (CNESST, SafeContractor, ComplyWorks) under "Sécurité et conformité": taken from pedlex.com's footer. OK to show?

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
- [ ] README: platform-specific deploy steps for the chosen host
- [ ] Transfer: GitHub → Settings → Transfer ownership → client org. Re-enable Pages / connect Netlify or CF Pages on their side
