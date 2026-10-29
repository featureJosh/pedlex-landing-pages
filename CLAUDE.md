# CLAUDE.md: agent instructions for the Pedlex landing pages

> **⚠ Read this before any design work (Josh, 2026-10-29).** Be **inspired** by pedlex.com, never **guided** by it. **This landing page sets the precedent for Pedlex's NEW website**: the direction we set here is the direction their next site will take. So it has to look forward, not back.
> The v1 attempt (on `main` up to ee05eb1) was **good**: clean, professional, well built, and the reviewers liked it. But it **failed at modernizing**. It mimicked the existing site's ideas (layout, components, type treatment) instead of proposing a new one. Don't repeat that: take Pedlex's *essence* (identity, values, real work, family story), not pedlex.com's *design*.

> **⚠ Round 2 (Raffi, client review, 2026-10-29) supersedes the v2 exploration plan.** The client chose the **white v1 on `main` as the base**, to be **elevated, not replaced**: same brand fonts (Scania Sans) and colours (official navy/blue), with a tighter type scale, a BrokerFlo-style dark photo hero with the proof strip built in, a top bar + sticky header, the explore/kimi « Réalisations » mosaic (titles under each photo), a St-Amour-style 1-2-3 process, a Why Pedlex video, testimonials, and FAQ before the form. References: brokerflo.io (hero; also by Luxy), manufacturingusa.st-amour.com (structure), starlit-salmiakki-bc0617.netlify.app. Media (upscaled photos, hero video, company video) come from Raffi/Josh: **builders use placeholders and never generate or upscale images or video.** Details: §5 « Round 2 » below; log: TIMELINE 2026-10-29 18:30.

You are working on Pedlex's campaign landing pages for Luxy Media. **Read [PROJECT.md](PROJECT.md) first**: it is the source of truth (scope, design direction, status board, approved review notes). Then read the part of this file that matches your role.

> The `claude/` folder is Luxy's *assistant* context for the Pedlex account. Use `claude/context.md` as **read-only reference** (brand, contacts, proof figures). Its `Instructions.md` (meeting logging, etc.) does **not** apply to this project.

---

## 0. Ground rules (everyone)

1. **Update the shared docs as you work.** Move your item on the PROJECT.md status board to *In progress* (with your branch) when you start, and to *Done* (with the date) when you finish. Append a TIMELINE.md entry for every change you commit. If your context might reset, write it down.
2. **Builders never rewrite client copy.** Page copy starts from Maïeutyk's docs (`docs/copy/*.md` → `src/content/<slug>/<lang>.json`). Only the lead edits copy: Josh (2026-10-29) says the copy is a guide, the page is an **appetizer** (only what matters, short), and the lead may trim or adjust. Every lead copy change is logged in PROJECT.md §9 "Client questions".
3. **Real Pedlex photos only.** No stock, no AI-generated imagery. **Placeholders** are allowed for assets that are still missing (client logos, hero video; Josh, 2026-10-29), but only if they look deliberately neutral (grey, labelled as a placeholder, never a fake brand), sit in `assets-source/placeholders/`, are marked `"placeholder": true` in content, and are listed in PROJECT.md §9.
4. **Clean, modern, professional, subtle, and NEW.** Design v2 (PROJECT.md §5) must not look like pedlex.com (the old site). It is photo-led, so photos carry the page. If an animation would make someone notice the animation rather than the content, cut it.
5. **French first.** FR is the master and the hardest to fit. Test with FR copy. FR typography (narrow no-break spaces before `? ! ; :`, « guillemets », ’ apostrophes) is applied **automatically** by `src/_data/landings.js`. Don't hand-insert special spaces, and don't put raw URLs containing `?` inside copy strings.
6. **No secrets** in the repo, ever. No pricing in docs.
7. Commit messages: `type(scope): summary` (types: feat, fix, style, refactor, docs, chore, content). End every commit message with
   `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

---

## 1. Commands

```bash
npm install            # once
npm run build          # images + fonts + Eleventy -> _site/
npm run dev            # live-reload dev server on http://localhost:8080
npm run serve          # serve an existing _site/ on :8080
npm run shoot -- /racking/ --sections            # screenshots 390/768/1440 -> qa/shots/racking/
npm run shoot -- /racking/ --widths 390 --out qa/shots/mine --port 8091   # unique port per parallel agent
```
Windows Git Bash: prefix env vars that hold paths with `MSYS_NO_PATHCONV=1` (e.g. `MSYS_NO_PATHCONV=1 PATH_PREFIX=/pedlex-landing-pages/ npm run build`).
For custom interaction tests, `import { launch, settle } from "./scripts/shoot.mjs"`. It returns a Playwright `page` on the local build using the system Edge/Chrome; no download needed.

---

## 2. Architecture rules (builders, QA enforces them)

**Content**
- All copy lives in `src/content/<slug>/<lang>.json` (page) or `src/content/_shared/<lang>.json` (UI). **No copy in templates.** Strings may contain `<strong>`, `<em>`, `<br>` only, rendered with `| safe`.
- A section reads its data from `c.<sectionName>` (e.g. `c.hero.title`). `c`, `lang`, `entry`, `site` are in scope in every section partial.
- If a section needs a new key, add it to `fr.json` (and `en.json` when it exists) and document it at the top of the section partial.

**Markup**
- One section = one file: `src/_includes/sections/<name>.njk`, root element `<section class="section [section--tint|section--dark]" id="<name>" aria-labelledby="<name>-title">`, wrapped content in `<div class="container">`.
- **Use the shared macros** from `components/ui.njk`: `button`, `sectionHead`, `featureCard`, `ctaRow`. Never hand-roll a button, eyebrow, section heading, CTA row or feature card. If you need a variant, extend the macro (backwards-compatible) and note it in TIMELINE.md.
- Images: `{% picture "group/name", alt, sizes, { loading, fetchpriority, class } %}` only. Every image needs meaningful FR alt text from the content file (`""` only if purely decorative). Icons: `{% icon "lucide-name" %}` only.
- Exactly one `<h1>` per page (the hero). Sections use `<h2>` (via `sectionHead`), cards `<h3>`.
- Every CTA points at `#consultation` (via `button`/`ctaRow`, which add `data-scroll-to`). The label is the section's own `c.<section>.cta` when the copy doc gives one, else `c.ui.cta` (Josh, 2026-10-29: labels follow the copy, not one identical string everywhere).

**CSS**
- One file per section: `src/styles/sections/<name>.css`. It is bundled automatically (no index to edit).
- **Tokens only** (`src/styles/00-tokens.css`): no raw hex, px font sizes, ad-hoc spacing, shadows, radii or durations in section CSS. Allowed raw values: `0`, `1px` borders, `100%`, aspect ratios, `fr` units, percentages in gradients/transforms. Need a new value? Add a token and log it.
- Use the layout primitives (`.container`, `.section`, `.section--tint/--dark`, `.section-body`, `.grid--2/3/4`, `.split`, `.media`) before writing new layout.
- BEM-ish class names prefixed with the section (`.hero__title`, `.faq__item`). No IDs in selectors. No `!important` (except the reduced-motion block).
- Mobile-first. It must work at **360px** with no horizontal overflow, and look intentional at 768, 1024, 1440 and 1920.

**JS**
- One file per behaviour: `src/scripts/sections/<name>.js` or `src/scripts/components/<name>.js`, wrapped in an IIFE, started with `Pedlex.ready(() => …)`. Hook onto `data-*` attributes, never on styling classes.
- No libraries. Progressive enhancement: content must be readable and the form submittable without JS.
- Respect `Pedlex.reducedMotion()`. Push analytics only via `Pedlex.push(event, data)`.

**Motion** (from PROJECT.md §5): reveal = `data-reveal` (or `data-reveal-stagger` on a list parent). Nothing else animates on scroll without lead approval.

**Accessibility (WCAG 2.2 AA):** labelled controls, visible focus, keyboard support (accordion: native `<details>/<summary>` or buttons with `aria-expanded`/`aria-controls`; carousel: buttons + arrow keys + `aria-roledescription`), AA contrast, touch targets ≥ 44px, no information conveyed by colour alone.

---

## 3. Branch workflow & Definition of Done

**Builders** work on a branch `feat/<area>` (or in a worktree) from the latest `main`. Touch only your area's files. Shared files (`ui.njk`, tokens, layout CSS, content JSON) need a note in your report explaining why.

A branch is **Done** when:
1. `npm run build` passes with no warnings from your code.
2. You ran `npm run shoot -- /racking/ --sections` and **looked at your section at 390, 768 and 1440**. No overflow, no broken layout, no console errors.
3. It follows every rule in §2 (tokens, macros, picture/icon shortcodes, content in JSON).
4. Copy matches `docs/copy/*.md` verbatim.
5. PROJECT.md status and TIMELINE.md are updated, and the work is committed on your branch.
6. Your final report lists: files changed, any shared-file changes, anything you couldn't do, and the screenshot paths.

**The lead** reviews each branch (diff + screenshots). Merge if it meets the DoD. Otherwise **delete the branch**, record why in TIMELINE.md, and re-brief a new agent with sharper instructions. **After 2 failed attempts on the same area, the lead builds it.**

---

## 4. Review agents

Review agents **do not edit code**. They write a report to `qa/<role>-<YYYY-MM-DD>-r<round>.md` and save screenshots in `qa/shots/<role>-r<round>/`, then return a summary. Build first (`npm run build`), then use `scripts/shoot.mjs` or your own Playwright script via `launch()`.

Every finding uses this format:
```
### <ROLE>-<n> · <severity: blocker | major | minor | nit> · <section id>
**What:** what's wrong, as observed (quote text, give px values / viewport)
**Where:** viewport(s) + screenshot path (crop or full)
**Why it matters:** one line
**Suggested fix:** concrete, in terms of this codebase (token, macro, file)
```
The lead decides what's approved (→ PROJECT.md §8) and what's declined (with a reason).

### QA agent: the nitpicker
Check everything, at 360, 390, 768, 1024, 1440 and 1920:
- Spacing rhythm: consistent section padding, heading→content gaps, card padding; elements aligned to the container edges; baseline/optical alignment of icons and text.
- Typography: correct scale tokens; no orphans or widows in headings where avoidable; no awkward FR line breaks (e.g. « 40 » separated from « % », a lone word on the last line of an H1/H2); consistent eyebrow / H2 / lead patterns.
- **Global vs one-off:** elements that should be shared but were rebuilt per section (buttons, eyebrows, cards, CTA rows, section heads). Grep the CSS for raw hex/px values outside tokens.
- Functions: every CTA scrolls to the form and focuses the first field; form validation (empty, bad email, bad phone, error messages, focus to the first error); submit → `dataLayer` has `generate_lead` → thank-you page; accordion; carousel (buttons, swipe, keys); marquee pause; cookie banner accept/decline/reopen; FR/EN toggle (when EN exists); phone `tel:` links.
- Accessibility: one H1, heading order, alt text, labels, focus visibility, keyboard-only pass, contrast, reduced motion.
- Tech: console errors, horizontal overflow, image sizes/CLS, broken links, `noindex` present.

### User agent: the impatient professional
You are a plant or operations manager at a mid-size Québec manufacturer. You clicked a video ad asking « Votre entrepôt est plein… ou simplement mal optimisé? » on your phone between meetings. You are **competent, busy and sceptical**, not a novice. You **skim**: headlines, numbers, photos, buttons. You don't read paragraphs unless something hooks you. You give a page **~5 seconds** to prove it's relevant and **~30 seconds** to decide whether to act.
- Do at least two runs: **mobile (390×844)** and **desktop (1440×900)**. Scroll as a skimmer would (fast, with pauses where something catches your eye) and screenshot what you see at each stop.
- Note: what you understood in the first 5 seconds; where you hesitated, got bored or confused; whether you trusted the company and why; whether you could find the CTA at every moment; whether the form felt short and safe; any friction filling it on mobile (keyboard types, autofill, error handling).
- Actually fill and submit the form, including one deliberate mistake.
- Report in first person, blunt and specific. You are a professional, so judge it like one.

### Client agent: Pedlex's eyes
You are Francis Poirier (President) reviewing the mockup with Camille (Marketing). You care about **how Pedlex is represented**, not how it's built. Judge only what's on screen.
- Does it feel like **Pedlex**: industrial, confident, precise, a 50-year family company, « défie l'espace »? And does it feel like Pedlex's **next** look (new, photo-led, PROJECT.md §5 v2), not a re-skin of the old pedlex.com, a generic template, or a competitor (Federal Steel)?
- Are our real installations, clients, figures and certifications shown well and truthfully? Anything we'd be uncomfortable claiming?
- Is the French natural Québec French? Is the tone right (professional, reassuring, expert)?
- Would you sign off? What would you ask Luxy to change before the campaign goes live?
- Reference: pedlex.com (the **old** site: recognisable identity, but v2 must NOT look like it) and `claude/context.md` (brand facts). Output: verdict (approve / approve with changes / reject) and itemised feedback.

---

## 5. The lead

The lead (project-lead Claude session) owns PROJECT.md §7–§10, merges, approvals and HANDOFF.md. On a fresh session: read HANDOFF.md → PROJECT.md → the latest TIMELINE.md entries → `git log --oneline -20`, then continue from HANDOFF.md's "Next actions".
