// Writes a real HTML file per route so search engines and link previews see content,
// and GitHub Pages serves deep links without the SPA 404 trick.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const dist = path.resolve("dist");
const { render, routes, SITE_URL } = await import(pathToFileURL(path.resolve("dist-ssr/entry-server.js")).href);
const template = await readFile(path.join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HawkEye Data Solutions",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  email: "learn@hawkeyedata.ca",
  founder: {
    "@type": "Person",
    name: "Amandeep Sawhney",
    sameAs: ["https://www.udemy.com/user/amandeep-singh-sawhney/"],
  },
};

function head(route, url) {
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="HawkEye Data" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:image" content="${SITE_URL}/brand/og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (url) tags.push(`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`);
  else tags.push(`<meta name="robots" content="noindex" />`);
  if (route.path === "/") tags.push(`<script type="application/ld+json">${JSON.stringify(orgJsonLd)}</script>`);
  return tags.join("\n    ");
}

const pages = [];
for (const route of routes) {
  const notFound = route.path === "*";
  const url = notFound ? null : SITE_URL + (route.path === "/" ? "/" : `${route.path}/`);
  const html = template
    .replace("<!--head-->", head(route, url))
    .replace("<!--app-->", render(notFound ? "/404" : url.slice(SITE_URL.length)));
  const file = notFound ? "404.html" : path.join(route.path.slice(1), "index.html");
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true });
  await writeFile(path.join(dist, file), html);
  if (url) pages.push(url);
  console.log(`prerendered ${route.path} -> ${file}`);
}

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);
await rm("dist-ssr", { recursive: true, force: true });
