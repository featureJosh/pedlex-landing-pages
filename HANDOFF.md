# HANDOFF.md: lead session state

> For the project lead (Claude) after a memory reset. Read this → PROJECT.md → the top of TIMELINE.md → `git log --oneline -20`. Then continue from **Next actions**.
> Last updated: 2026-10-30 17:45

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
- Repo: https://github.com/featureJosh/pedlex-landing-pages — **public since 2026-10-30** (Josh). **GitHub Pages is enabled** (https://featurejosh.github.io/pedlex-landing-pages/): every push to `main` deploys, so **only Josh pushes**. `ci.yml` builds every push. `main` is the **only branch**; it lives in the `Pedlex Landing Page` folder (the Pedlex-main worktree is gone).

## In flight

> **⚠ Round 2 (Raffi, client review, 2026-10-29) supersedes the v2 exploration plan.** The client chose the **white v1 on `main` as the base**, to be **elevated, not replaced**: same brand fonts (Scania Sans) and colours (official navy/blue), with a tighter type scale, a BrokerFlo-style dark photo hero with the proof strip built in, a top bar + sticky header, the explore/kimi « Réalisations » mosaic (titles under each photo), a St-Amour-style 1-2-3 process, a Why Pedlex video, testimonials, and FAQ before the form. References: brokerflo.io (hero; also by Luxy), manufacturingusa.st-amour.com (structure), starlit-salmiakki-bc0617.netlify.app. Media (upscaled photos, hero video, company video) come from Raffi/Josh: **builders use placeholders and never generate or upscale images or video.** Details: §5 « Round 2 » below; log: TIMELINE 2026-10-29 18:30.

- **Round 2 is built on `main`** and the round-2 review is fixed (TIMELINE 2026-10-30 17:45, PROJECT.md §8 « Round 2 »). Exploration branches are deleted.
- Dev server: `main` on :8081 (`npx eleventy --serve --port 8081` in the repo folder). Agents use other ports (8091+).
- Hero variant B (video) is at `/racking/video/` in preview builds.

## Next actions
0. **Mobile length decision** (QA-2 r2): 8 628px at 390 vs the 7 500 budget. Options: hide the Why video placeholder on phones until the film exists (≈ −280px); 2-column icon+title problem cards on phones without the body text (≈ −300px); drop the certification strip on phones (≈ −150px); show 3 gallery photos on phones (≈ −200px). **Josh, 2026-10-30: leave the length for now**; revisit when real media lands.
1. Josh / Raffi: drop in real media: upscaled hero photo (`assets-source/racking/racking-2` or a new key in `hero.image`), ~~hero video~~ (done 2026-10-30: `assets-source/racking/header-video/`, live as the Racking hero; a higher-resolution export would sharpen it, the delivered file is 854×480), company video (wire `why.video`), testimonials (replace the sample `reviews.items`, drop `sample`), real client logos.
2. Pedlex answers in PROJECT.md §9 (testimonials, 30–50 % source, logos, CSA wording, CNESST permission, vector logo).
3. Josh pushes `main` when the demo is ready (that deploys GitHub Pages; agents never push).
4. Then: Général / Mezzanines / Rousseau pages reuse this system.
