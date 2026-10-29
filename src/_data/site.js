// Global, page-independent settings. Company facts come from claude/context.md and
// the brief (docs/internal). Change them here only, never inline in templates.
//
// Build modes (env vars):
//   PATH_PREFIX=/pedlex-landing-pages/  GitHub Pages preview (set by the Actions workflow)
//   LANDING=racking                     Production build of ONE landing at the site root
//                                       (racking.pedlex.com/, /en/, /merci/, /en/merci/)
//   SITE_ENV=production                 Enables tracking (GTM) and indexing rules for go-live
const env = process.env.SITE_ENV === "production" ? "production" : "preview";

export default {
  env,
  isPreview: env !== "production",
  // Only one landing at root in production; every landing under /<slug>/ otherwise.
  landing: process.env.LANDING || null,
  company: {
    name: "Pedlex",
    legalName: "Pedlex Ltée",
    since: 1976,
    phone: "514 324-5310",
    phoneHref: "+15143245310",
    tollFree: "1 888 733-5399",
    tollFreeHref: "+18887335399",
    email: "info@pedlex.com",
    street: "10 000, boul. du Golf",
    city: "Anjou (Montréal)",
    region: "QC",
    postal: "H1J 2Y7",
    rbq: "8226-5026-35",
    website: { fr: "https://www.pedlex.com/", en: "https://www.pedlex.com/en/" },
    // TODO(client): confirm privacy-policy URLs (brief §9.1)
    privacy: { fr: "https://www.pedlex.com/politique-de-confidentialite/", en: "https://www.pedlex.com/en/privacy-policy/" },
  },
  tracking: {
    // GTM only loads in production builds. Previews must never pollute Pedlex analytics.
    enabled: env === "production",
    gtmId: "GTM-M6T7MH6",
    leadEvent: "generate_lead",
  },
  form: {
    // Static hosts have no backend. Set the real endpoint per platform at go-live
    // (Netlify Forms, Cloudflare Pages Function, WordPress handler...). Empty = preview mode:
    // the form validates, pushes the dataLayer event and redirects to /merci without sending.
    endpoint: process.env.FORM_ENDPOINT || "",
  },
  // Preview pages must never be indexed. Paid-only landers are usually noindex too (brief §6.4).
  robots: env === "production" ? (process.env.ROBOTS || "noindex, follow") : "noindex, nofollow",
};
