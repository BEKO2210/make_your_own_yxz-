import { SITE, canonicalUrl } from './site';

/* ── Schema.org Helpers ────────────────────────────────── */

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  pathname: string;
  items: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: canonicalUrl(opts.pathname),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

export function breadcrumbSchema(
  crumbs: { name: string; pathname?: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.name,
        ...(c.pathname ? { item: canonicalUrl(c.pathname) } : {}),
      })),
    ],
  };
}
