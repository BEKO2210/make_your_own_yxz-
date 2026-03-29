import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// GitHub Pages: uses repo name as base when no custom domain is set.
// Set CUSTOM_DOMAIN=true in your environment or GitHub secrets if you
// have a custom domain configured, to use '/' as the base path.
const isGitHubPages = !!process.env.GITHUB_ACTIONS;
const hasCustomDomain = !!process.env.CUSTOM_DOMAIN;
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';

export default defineConfig({
  site: hasCustomDomain
    ? 'https://makeyourownxyz.com'
    : isGitHubPages
      ? `https://${process.env.GITHUB_REPOSITORY_OWNER || 'beko2210'}.github.io`
      : 'https://makeyourownxyz.com',
  base: isGitHubPages && !hasCustomDomain && repoName ? `/${repoName}` : '/',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
});
