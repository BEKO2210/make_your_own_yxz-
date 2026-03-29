#!/usr/bin/env node

// scripts/update-tutorials.mjs
// Fetches the latest README from codecrafters-io/build-your-own-x
// and regenerates the structured tutorial data file.

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../src/data/tutorials.ts');
const README_URL = 'https://raw.githubusercontent.com/codecrafters-io/build-your-own-x/master/README.md';

// ── Fetch README ──────────────────────────────────────────────

async function fetchReadme() {
  console.log(`Fetching README from ${README_URL}...`);
  const res = await fetch(README_URL);
  if (!res.ok) throw new Error(`Failed to fetch README: ${res.status} ${res.statusText}`);
  return res.text();
}

// ── Category metadata ─────────────────────────────────────────

const categoryDescriptions = {
  '3D Renderer': 'Learn computer graphics by building ray tracers, rasterizers, and 3D rendering engines from scratch.',
  'AI Model': 'Build large language models, diffusion models, and RAG systems from the ground up.',
  'Augmented Reality': 'Create AR experiences and learn spatial computing fundamentals.',
  'BitTorrent Client': 'Understand peer-to-peer networking by implementing the BitTorrent protocol.',
  'Blockchain / Cryptocurrency': 'Explore distributed ledger technology by building your own blockchain and cryptocurrency.',
  'Bot': 'Build chatbots, social media bots, and automated agents for various platforms.',
  'Command-Line Tool': 'Create powerful CLI applications and learn terminal interaction patterns.',
  'Database': 'Understand data storage by building databases, key-value stores, and query engines.',
  'Docker': 'Learn containerization by implementing Linux containers from scratch.',
  'Emulator / Virtual Machine': 'Build emulators for classic systems and virtual machines for custom bytecode.',
  'Front-end Framework / Library': 'Understand how React, Angular, and other frameworks work under the hood.',
  'Game': 'Learn game development by building classic and modern games from scratch.',
  'Git': 'Implement version control systems and understand Git internals.',
  'Memory Allocator': 'Dive deep into systems programming by building your own malloc implementation.',
  'Network Stack': 'Understand networking protocols by implementing TCP/IP and other network layers.',
  'Neural Network': 'Build neural networks from scratch and understand deep learning fundamentals.',
  'Operating System': 'The ultimate systems programming challenge — build a kernel and OS from scratch.',
  'Physics Engine': 'Simulate real-world physics for games and interactive applications.',
  'Processor': 'Design and implement CPUs and understand computer architecture at the hardware level.',
  'Programming Language': 'Build compilers, interpreters, and programming languages from scratch.',
  'Regex Engine': 'Implement regular expression engines and learn about formal language theory.',
  'Search Engine': 'Build search indexing and retrieval systems from the ground up.',
  'Shell': 'Create command-line shells and learn about process management and I/O.',
  'Template Engine': 'Build template rendering engines for dynamic content generation.',
  'Text Editor': 'Create text editors and learn about buffer management and terminal rendering.',
  'Visual Recognition System': 'Build computer vision systems for image recognition and classification.',
  'Voxel Engine': 'Create 3D voxel-based rendering engines for Minecraft-like worlds.',
  'Web Browser': 'Understand the web platform by building a browser engine from scratch.',
  'Web Server': 'Learn HTTP and server architecture by building web servers from scratch.',
  'Distributed Systems': 'Build distributed systems like Kafka and learn about consensus protocols.',
  'Uncategorized': 'Miscellaneous tutorials covering unique and diverse topics.',
};

const categoryIcons = {
  '3D Renderer': '🎨',
  'AI Model': '🤖',
  'Augmented Reality': '👓',
  'BitTorrent Client': '📡',
  'Blockchain / Cryptocurrency': '⛓️',
  'Bot': '🤖',
  'Command-Line Tool': '⌨️',
  'Database': '🗄️',
  'Docker': '🐳',
  'Emulator / Virtual Machine': '💻',
  'Front-end Framework / Library': '⚛️',
  'Game': '🎮',
  'Git': '📦',
  'Memory Allocator': '🧠',
  'Network Stack': '🌐',
  'Neural Network': '🧬',
  'Operating System': '🖥️',
  'Physics Engine': '⚡',
  'Processor': '🔧',
  'Programming Language': '📝',
  'Regex Engine': '🔍',
  'Search Engine': '🔎',
  'Shell': '🐚',
  'Template Engine': '📄',
  'Text Editor': '✏️',
  'Visual Recognition System': '👁️',
  'Voxel Engine': '🧊',
  'Web Browser': '🌍',
  'Web Server': '🖧',
  'Distributed Systems': '🔗',
  'Uncategorized': '📚',
};

// ── Helpers ───────────────────────────────────────────────────

function slugify(str) {
  const specialSlugs = {
    'C++': 'cpp',
    'C#': 'csharp',
    'F#': 'fsharp',
    'Node.js': 'node-js',
  };
  if (specialSlugs[str]) return specialSlugs[str];

  return str
    .toLowerCase()
    .replace(/[\/\\]/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

function detectMediaType(line) {
  if (line.includes('[video]')) return 'video';
  if (line.includes('[pdf]')) return 'pdf';
  const url = line.match(/\]\((https?:\/\/[^\)]+)\)/)?.[1] || '';
  if (url.includes('github.com')) return 'repo';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
  return 'article';
}

// ── Parse README ──────────────────────────────────────────────

function parseReadme(readme) {
  const lines = readme.split('\n');
  const tutorials = [];
  let currentCategory = null;

  for (const line of lines) {
    const catMatch = line.match(/^####?\s+Build your own\s+`([^`]+)`/);
    const uncatMatch = line.match(/^####?\s+Uncategorized/);

    if (catMatch) {
      currentCategory = catMatch[1];
    } else if (uncatMatch) {
      currentCategory = 'Uncategorized';
    }

    // Standard format: [**Language**: _Title_](url)
    const tutMatch = line.match(/^\*\s+\[\*\*([^*]+)\*\*:\s*_([^_]+)_\]\(([^\)]+)\)/);
    if (tutMatch && currentCategory) {
      const [, langStr, title, url] = tutMatch;
      const languages = langStr.split(/\s*\/\s*/).map((l) => l.trim().replace(/[()]/g, ''));

      tutorials.push({
        title: title.trim(),
        languages,
        url,
        category: currentCategory,
        categorySlug: slugify(currentCategory),
        domain: extractDomain(url),
        mediaType: detectMediaType(line),
      });
      continue;
    }

    // Alternate format (some Uncategorized entries)
    if (!tutMatch && currentCategory) {
      const altMatch = line.match(/^\*\s+\[\*\*([^*]+)\*\*:?\s*([^\]]*)\]\(([^\)]+)\)/);
      if (altMatch) {
        const [, langStr, title, url] = altMatch;
        const languages = langStr.split(/\s*\/\s*/).map((l) => l.trim().replace(/[()]/g, ''));
        const cleanTitle = title.replace(/^_|_$/g, '').trim();
        if (cleanTitle) {
          tutorials.push({
            title: cleanTitle,
            languages,
            url,
            category: currentCategory,
            categorySlug: slugify(currentCategory),
            domain: extractDomain(url),
            mediaType: detectMediaType(line),
          });
        }
      }
    }
  }

  // Build categories
  const categoryMap = {};
  for (const t of tutorials) {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = {
        name: t.category,
        slug: t.categorySlug,
        description: categoryDescriptions[t.category] || '',
        tutorialCount: 0,
        icon: categoryIcons[t.category] || '📁',
      };
    }
    categoryMap[t.category].tutorialCount++;
  }

  // Build languages
  const langMap = {};
  for (const t of tutorials) {
    for (const lang of t.languages) {
      const ls = slugify(lang);
      if (!langMap[lang]) {
        langMap[lang] = { name: lang, slug: ls, tutorialCount: 0 };
      }
      langMap[lang].tutorialCount++;
    }
  }

  const categories = Object.values(categoryMap).sort((a, b) => b.tutorialCount - a.tutorialCount);
  const languages = Object.values(langMap).sort((a, b) => b.tutorialCount - a.tutorialCount);

  return { tutorials, categories, languages };
}

// ── Main ──────────────────────────────────────────────────────

async function main() {
  const readme = await fetchReadme();
  const { tutorials, categories, languages } = parseReadme(readme);

  console.log(`Parsed ${tutorials.length} tutorials in ${categories.length} categories across ${languages.length} languages`);

  const output = `// Auto-generated from codecrafters-io/build-your-own-x README
// License: CC0 (Public Domain)
// Last updated: ${new Date().toISOString()}
import type { Tutorial, Category, Language } from './types';

export const tutorials: Tutorial[] = ${JSON.stringify(tutorials, null, 2)};

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export const languages: Language[] = ${JSON.stringify(languages, null, 2)};
`;

  writeFileSync(OUTPUT_PATH, output);
  console.log(`Written to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Failed to update tutorials:', err);
  process.exit(1);
});
