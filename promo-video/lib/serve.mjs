// Tiny static file server (read-only) for the site repo root.
// The site is served as plain static files: no /api route runs, no secret is read.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".css": "text/css", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".woff": "font/woff",
};

export function serve() {
  const server = http.createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
    // Never expose env files or anything outside the repo.
    if (path.includes("..") || /\/\.env/.test(path)) { res.writeHead(403).end(); return; }
    const file = join(ROOT, path.endsWith("/") ? path + "index.html" : path);
    try {
      const body = await readFile(file);
      res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" }).end(body);
    } catch { res.writeHead(404).end(); }
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}

// Only allow requests to our local server: no Google Fonts, no API, no analytics.
export async function lockToLocal(context, origin) {
  await context.route("**/*", (route) => (route.request().url().startsWith(origin) ? route.continue() : route.abort()));
}

// Same fonts as the site, loaded from local @fontsource files.
export const FONT_CSS = (base) => `
@font-face{font-family:"Bricolage Grotesque";font-weight:600;src:url(${base}/bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"Bricolage Grotesque";font-weight:700;src:url(${base}/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:"Bricolage Grotesque";font-weight:800;src:url(${base}/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2) format("woff2")}
@font-face{font-family:"DM Sans";font-weight:400;src:url(${base}/dm-sans/files/dm-sans-latin-400-normal.woff2) format("woff2")}
@font-face{font-family:"DM Sans";font-weight:500;src:url(${base}/dm-sans/files/dm-sans-latin-500-normal.woff2) format("woff2")}
@font-face{font-family:"DM Sans";font-weight:700;src:url(${base}/dm-sans/files/dm-sans-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:"DM Mono";font-weight:500;src:url(${base}/dm-mono/files/dm-mono-latin-500-normal.woff2) format("woff2")}
`;
