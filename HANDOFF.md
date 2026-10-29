# HANDOFF.md: lead session state

> For the project lead (Claude) after a memory reset. Read this → PROJECT.md → the top of TIMELINE.md → `git log --oneline -20`. Then continue from **Next actions**.
> Last updated: 2026-10-29 13:50

## Who / what
- I am the **lead web dev AI** for Luxy Media on Pedlex's campaign landing pages. Josh (josh@luxymedia.com, GitHub `featureJosh`) is my human. He's **away** (walking the dog) and said there would be **no further input**, so work autonomously and leave everything documented.
- Josh's standing direction: **clean, modern, professional, subtle animation** ("not a theme park"); follow the brief and references loosely but not *too* loosely, and keep **Pedlex's identity** (not the old site, not Federal Steel); French first; CMS-agnostic; repo must be transferable to the client.
- Josh wants a workflow: **builder sub-agents on branches → I review → merge or prune (2 strikes, then I do it)**, plus **QA / User / Client review agents**, with approved findings recorded in PROJECT.md §8.

## Access notes
- **Google Docs:** josh@luxymedia.com is denied on Maïeutyk's copy doc. Josh signed **kaisey@luxymedia.com into his Chrome with her permission**: use it (Claude in Chrome) for any access-denied Luxy doc, **read-only**. `/document/d/<id>/mobilebasic` gives clean text. Never click "Request access" (that sends a message on someone's behalf).
- **pedlex.com:** blocks cloud fetch; local `curl` with a browser UA works, and so does the built-in browser.
- **GitHub:** `gh` authenticated as featureJosh (scopes: repo, workflow).
- **Git Bash:** use `MSYS_NO_PATHCONV=1` with `PATH_PREFIX=/…`, or the prefix gets mangled into `C:/Program Files/Git/…`.
- Shell heredocs containing apostrophes in large multi-file commands have failed to parse. Prefer the Write tool for multi-file content.

## State right now
- Foundation is done and committed: see TIMELINE.md 13:45. Section partials in `src/_includes/sections/*.njk` are **stubs**.
- Repo: `featureJosh/pedlex-landing-pages` (private). Pages via `.github/workflows/pages.yml`.

## Next actions
1. Run the **builder workflow**: three builders in worktrees/branches (A: hero + stats + trust; B: problem + gallery + process + why; C: form + faq + form JS). Review each diff + screenshots, merge or prune.
2. Build → deploy → run **QA / User / Client** agents in parallel (reports in `qa/`).
3. Triage into PROJECT.md §8, fix the approved items (builders or me), re-review.
4. Update PROJECT.md status board, TIMELINE.md and this file. Final report to Josh: preview URL, what's done, client questions (PROJECT.md §9), what's blocked.

## Design decisions I've made (keep consistent)
- Hero: split layout. Copy left on white, racking-2 photo right with slow CSS drift (the "motion loop" stand-in). LCP image eager + `fetchpriority=high`.
- Section surfaces: hero white · stats navy · trust white · problem tint · gallery white · process tint · why white · form navy · faq white · footer deep navy.
- One CTA label from `c.ui.cta`; every CTA scrolls to `#consultation` and focuses the first field.
- Buttons: Barlow Condensed caps, 4px radius, navy. Cards: white, 1px border, 8px radius, icon chip in blue-100.
