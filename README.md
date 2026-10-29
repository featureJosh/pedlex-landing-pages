# Pedlex — Campaign landing pages

Static, CMS-agnostic landing pages for Pedlex's 2026 video campaigns (Racking, Général, Mezzanines, Rousseau). French master, English parity.

- **Start here:** [PROJECT.md](PROJECT.md) (source of truth) · [CLAUDE.md](CLAUDE.md) (contributor/agent rules) · [TIMELINE.md](TIMELINE.md) (change log)
- **Preview:** hosting pending (GitHub Pages needs a paid plan on private repos). See PROJECT.md section 2. Locally: `npm run dev`.

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # -> _site/
```

**Deploying elsewhere** (Netlify / Cloudflare Pages): build command `npm run build`, output `_site`, Node ≥ 20.
Single landing at a subdomain root: `LANDING=racking SITE_ENV=production FORM_ENDPOINT=<url> npm run build`. See PROJECT.md §3.
