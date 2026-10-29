# HANDOFF.md: lead session state

> For the project lead (Claude) after a memory reset. Read this → PROJECT.md → the top of TIMELINE.md → `git log --oneline -20`. Then continue from **Next actions**.
> Last updated: 2026-10-29 16:15

## Who / what
- I am the **lead web dev AI** for Luxy Media on Pedlex's campaign landing pages. Josh (josh@luxymedia.com, GitHub `featureJosh`) is my human. He checks in occasionally; work autonomously and leave everything documented.
- Josh's standing direction: **clean, modern, professional, subtle animation** ("not a theme park"); **a landing page is an appetizer: short, only what matters**; client content is a guide, and the lead may override it; follow the brief and references loosely but not *too* loosely, and keep **Pedlex's identity** (not the old site, not Federal Steel); French first; CMS-agnostic; repo must be transferable to the client.
- Josh wants a workflow: **builder sub-agents on branches → I review → merge or prune (2 strikes, then I do it)**, plus **QA / User / Client review agents**, with approved findings recorded in PROJECT.md §8.

## Access notes
- **Google Docs:** josh@luxymedia.com is denied on Maïeutyk's copy doc. Josh signed **kaisey@luxymedia.com into his Chrome with her permission**: use it (Claude in Chrome) for any access-denied Luxy doc, **read-only**. `/document/d/<id>/mobilebasic` gives clean text. Never click "Request access" (that sends a message on someone's behalf).
- **pedlex.com:** blocks cloud fetch; local `curl` with a browser UA works, and so does the built-in browser.
- **GitHub:** `gh` authenticated as featureJosh (scopes: repo, workflow).
- **Git Bash:** use `MSYS_NO_PATHCONV=1` with `PATH_PREFIX=/…`, or the prefix gets mangled into `C:/Program Files/Git/…`.
- Shell heredocs containing apostrophes in large multi-file commands have failed to parse. Prefer the Write tool for multi-file content.

## State right now
- Foundation is done and committed: see TIMELINE.md 13:45. **All 9 Racking FR sections are built and merged** (TIMELINE 14:35, commit 6498260). Feature branches and worktrees are deleted.
- Repo: https://github.com/featureJosh/pedlex-landing-pages (private, pushed). Previews: **Cloudflare Pages on Josh's account** (he connects it; settings in PROJECT.md §2). No GitHub Pro; GitHub Pages only if the repo goes public. `ci.yml` builds every push.

## In flight

> **⚠ Read this before any design work (Josh, 2026-10-29).** Be **inspired** by pedlex.com, never **guided** by it. **This landing page sets the precedent for Pedlex's NEW website**: the direction we set here is the direction their next site will take. So it has to look forward, not back.
> The v1 attempt (on `main` up to ee05eb1) was **good**: clean, professional, well built, and the reviewers liked it. But it **failed at modernizing**. It mimicked the existing site's ideas (layout, components, type treatment) instead of proposing a new one. Don't repeat that: take Pedlex's *essence* (identity, values, real work, family story), not pedlex.com's *design*.

- Dev server: `.claude/launch.json` → `pedlex-dev` (`npm run dev`, http://localhost:8080/racking/) for Josh to view locally.
- **v2 redesign.** Josh, 2026-10-29: v1 "looks too much like the current (old) website… create something ENTIRELY new… more photo-heavy"; placeholders are fine. Round-1 polish builders were stopped and pruned. **Step 1 is NOT started yet** (the session hit its limit right after the docs were written). Launch it first: a Workflow with 3 parallel builder agents (`isolation: 'worktree'`), each building a FULL Racking page in one v2 direction on its own branch, with full-page shots at 390 and 1440 in `qa/shots/explore-<name>/`:
  - `explore/atelier`: light editorial, scania.com-like. White + warm concrete neutral, big mixed-case Scania Sans Bold, full-bleed photo bands, asymmetric grid, square corners, hairlines, bright-blue accent.
  - `explore/nuit`: dark cinematic. Deep ink-navy page, photos dominate with scrims, white type, full-viewport hero, mosaics.
  - `explore/plan`: engineered precision. White/ink with a subtle blueprint layer (fine grid lines, numbered annotations, tabular numerals), photo tiles. Never gimmicky, never fake specs.

  Every brief must give the PROJECT.md §5 v2 rules (keep/retire lists, photo-led, placeholders, appetizer length budget, unchanged rules) plus CLAUDE.md. Give unique ports per agent (not 8080), and keep content JSON copy unchanged; adding image keys is OK.

## Next actions
0. Josh is running other (non-Claude) agents on `explore/<agent>` branches. My own attempt goes on `explore/claude` (the three-direction exploration can feed it). Then compare every `qa/explore/*/` (shots + DESIGN-NOTES.md) and **combine the best points** into one page on `main`.
1. Review the 3 explorations (390 + 1440 full pages, first phone screen, length budget). Pick one, possibly grafting the best ideas from the others; merge to `main`; record why in TIMELINE + PROJECT §10. Keep the losers' screenshots in `qa/explore/` so Josh can see the alternatives.
2. Finishing builders on the winner: round-1 behaviour/a11y carry-overs (PROJECT §8 note), hero motion options (drift / video placeholder / slideshow) as preview variants, placeholder client logos to 10, compact cookie banner, merci page, EN check.
3. Review round 2 (QA / User / Client), triage, report to Josh.
4. Josh connects Cloudflare Pages (PROJECT.md §2 table).

## Design decisions (v2: set by the chosen exploration; v1 below is retired)
- v1 (retired): split hero, navy stats band, condensed-caps eyebrows, icon-card grids, navy caps buttons. Don't reintroduce.
- Kept from v1: per-section CTA labels (`c.<section>.cta`), CTA → `#consultation` + focus, Scania Sans (mixed case), tokens/macros/BEM architecture, content JSON model.
