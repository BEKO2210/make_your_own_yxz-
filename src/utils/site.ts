/** Central site configuration — single source of truth for all metadata. */
export const SITE = {
  name: 'Make Your Own XYZ',
  tagline: 'Learn by Building',
  description:
    'A curated directory of 350+ step-by-step tutorials for learning by building. Build your own database, programming language, game, neural network, and more from scratch.',
  url: 'https://makeyourownxyz.com',
  github: 'https://github.com/codecrafters-io/build-your-own-x',
  ogImage: '/og-default.png',
  locale: 'en_US',
  twitterHandle: '',
} as const;

/**
 * Build a canonical URL from a pathname.
 */
export function canonicalUrl(pathname: string): string {
  const base = SITE.url.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

/**
 * Prefix an internal path with the Astro base URL.
 * Ensures all internal links work correctly on GitHub Pages
 * (where the site lives under /repo-name/) and with custom domains.
 *
 * Usage in .astro files:  href={url('/categories')}
 */
export function url(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
