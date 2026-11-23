/**
 * Generates sitemap-index.xml + sitemap-0.xml from the built HTML.
 *
 * @astrojs/sitemap crashes on this project's hybrid output ("routes" is
 * undefined in build:done), and the site only has a handful of static pages,
 * so walking dist/ is simpler and has no dependency to break.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url);
const SITE = (process.env.SITE_URL ?? 'https://yeyobitz.dev').replace(/\/$/, '');
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/+$/, '');

const SKIP_DIRS = new Set(['_astro', 'projects', 'sounds', '.netlify', 'node_modules']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.isDirectory()) continue;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walk(join(dir, entry.name))));
    } else if (entry.name.endsWith('.html')) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

function routeFor(file) {
  const rel = relative(DIST.pathname, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function lastmod(file) {
  return readFile(file).then(() => new Date().toISOString().slice(0, 10));
}

const languages = [
  { code: 'es-CL', prefix: '' },
  { code: 'en', prefix: 'en' },
];

const files = await walk(DIST.pathname);
const routes = files
  .map((file) => ({ file, route: routeFor(file) }))
  .filter(({ route }) => !route.includes('404'))
  .sort((a, b) => a.route.localeCompare(b.route));

const urls = await Promise.all(
  routes.map(async ({ file, route }) => {
    const mod = await lastmod(file);
    const alternates = languages
      .map(({ code, prefix }) => {
        const href = prefix ? `${SITE}${BASE}/${prefix}/` : `${SITE}${BASE}/`;
        return `    <xhtml:link rel="alternate" hreflang="${code}" href="${href}"/>`;
      })
      .join('\n');
    return `  <url>
    <loc>${SITE}${BASE}${route}</loc>
    <lastmod>${mod}</lastmod>
    <changefreq>monthly</changefreq>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${BASE}/"/>
  </url>`;
  })
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE}${BASE}/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}${BASE}/sitemap-index.xml
`;

await writeFile(join(DIST.pathname, 'sitemap-0.xml'), xml, 'utf8');
await writeFile(join(DIST.pathname, 'sitemap-index.xml'), index, 'utf8');
await writeFile(join(DIST.pathname, 'robots.txt'), robots, 'utf8');

console.log(`[sitemap] ${routes.length} routes -> sitemap-index.xml`);
