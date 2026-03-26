export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  sections: BlogSection[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
  relatedFeatures: { title: string; href: string; description: string }[];
}

export interface BlogSection {
  heading: string;
  blocks: ContentBlock[];
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "highlight"; value: string; label: string }
  | { type: "callout"; text: string }
  | { type: "link-box"; title: string; href: string; description: string };
