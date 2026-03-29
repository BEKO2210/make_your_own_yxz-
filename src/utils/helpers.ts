import { tutorials, categories, languages } from '../data/tutorials';
import type { Tutorial, Category, Language } from '../data/types';

export function getTutorialsByCategory(slug: string): Tutorial[] {
  return tutorials.filter((t) => t.categorySlug === slug);
}

function langToSlug(lang: string): string {
  const special: Record<string, string> = { 'C++': 'cpp', 'C#': 'csharp', 'F#': 'fsharp', 'Node.js': 'node-js' };
  if (special[lang]) return special[lang];
  return lang.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function getTutorialsByLanguage(slug: string): Tutorial[] {
  return tutorials.filter((t) =>
    t.languages.some((l) => langToSlug(l) === slug)
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getLanguageBySlug(slug: string): Language | undefined {
  return languages.find((l) => l.slug === slug);
}

export function getFeaturedCategories(): Category[] {
  return categories
    .filter((c) => c.slug !== 'uncategorized')
    .slice(0, 12);
}

export function getTopLanguages(): Language[] {
  return languages.slice(0, 15);
}

export function getMediaTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    article: 'Article',
    video: 'Video',
    pdf: 'PDF',
    repo: 'Repository',
    guide: 'Guide',
  };
  return labels[type] || 'Article';
}

export function getMediaTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    article: '📄',
    video: '▶️',
    pdf: '📕',
    repo: '💻',
    guide: '📖',
  };
  return icons[type] || '📄';
}

export { tutorials, categories, languages };
