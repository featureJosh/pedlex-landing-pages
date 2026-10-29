# HANDOFF.md: lead session state

> For the project lead (Claude) after a memory reset. Read this → PROJECT.md → the top of TIMELINE.md → `git log --oneline -20`. Then continue from **Next actions**.
> Last updated: 2026-10-29 15:45

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
- Dev server: `.claude/launch.json` → `pedlex-dev` (`npm run dev`, http://localhost:8080/racking/) for Josh to view locally.
- Round-1 fixes go to builders in two phases (PROJECT.md §7 "In progress" lists the branches). Check `git branch -a` / `git worktree list` after a reset.

## Next actions
1. Phase 1 builders: `feat/r1-system` ∥ `feat/r1-behaviour`. Review, merge.
2. Phase 2 builders: `feat/r1-hero` ∥ `feat/r1-sections`, against the length budget in PROJECT.md §5. Review, merge.
3. Round-2 review (QA / User / Client), triage, then the final report to Josh.
4. Josh connects Cloudflare Pages (PROJECT.md §2 table).

## Design decisions I've made (keep consistent)
- Hero: split layout. Copy left on white, racking-2 photo right with slow CSS drift (the "motion loop" stand-in). LCP image eager + `fetchpriority=high`.
- Section surfaces: hero white · stats navy · trust white · problem tint · gallery white · process tint · why white · form navy · faq white · footer deep navy.
- CTA label per section (`c.<section>.cta`, fallback `c.ui.cta`); every CTA scrolls to `#consultation` and focuses the first field.
- Type: Scania Sans CY (body, H2/H3), CY Headline caps for the H1 only, Barlow Condensed for labels/buttons.
- Buttons: condensed caps, 4px radius, navy. Cards: white, 1px border, 8px radius, icon chip in blue-100.
