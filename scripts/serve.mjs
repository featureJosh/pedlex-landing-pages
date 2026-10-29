// Minimal static server for _site/ (no dependencies). Used by scripts/shoot.mjs and by the
// review agents. Usage: node scripts/serve.mjs [port=8080]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

// SITE_DIR lets a second build (e.g. `eleventy --output=_site-lead`) be served while _site is in use.
const ROOT = path.resolve(process.env.SITE_DIR || "_site");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".ico": "image/x-icon",
};

export function serve(port = 8080) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return res.writeHead(404, { "content-type": "text/plain" }).end("404 " + p);
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (process.argv[1]?.endsWith("serve.mjs")) {
  const port = Number(process.argv[2] || 8080);
  await serve(port);
  console.log(`[serve] ${path.basename(ROOT)} on http://localhost:${port}/`);
}
