/**
 * GitHub Pages serves project sites from /<repo>/, so every internal URL has
 * to go through the configured base. Astro rewrites bundled assets by itself;
 * these helpers cover the links we write by hand.
 */

const RAW_BASE = import.meta.env.BASE_URL || '/';

/** Base path without the trailing slash: '' or '/portfolio'. */
export const base = RAW_BASE.replace(/\/+$/, '');

/** Prefix an internal path with the base: withBase('cv') -> '/portfolio/cv'. */
export function withBase(path = ''): string {
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}

/** Absolute URL for a page, for canonical/hreflang tags. */
export function absolute(path: string, site: URL | undefined): string {
  const origin = site?.origin ?? 'https://yeyobitz.dev';
  return `${origin}${withBase(path)}`;
}
