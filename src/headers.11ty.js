// Cloudflare Pages / Netlify response headers (other hosts ignore the file). Preview builds only:
// belt-and-braces noindex on top of the robots meta, since *.pages.dev URLs are public.
export const data = {
  permalink: (data) => (data.site.isPreview ? "/_headers" : false),
  eleventyExcludeFromCollections: true,
};

export function render() {
  return "/*\n  X-Robots-Tag: noindex, nofollow\n";
}
