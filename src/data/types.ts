export interface Tutorial {
  title: string;
  languages: string[];
  url: string;
  category: string;
  categorySlug: string;
  domain: string;
  mediaType: 'article' | 'video' | 'pdf' | 'repo' | 'guide';
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  tutorialCount: number;
  icon: string;
}

export interface Language {
  name: string;
  slug: string;
  tutorialCount: number;
}
