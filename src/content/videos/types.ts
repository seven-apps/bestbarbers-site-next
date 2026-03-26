export interface VideoContent {
  slug: string;
  youtubeId: string;
  title: string;
  description: string;
  keywords: string[];
  source: "bestbarbers" | "terceiros";
  channel: string;
  publishedAt: string;
  duration: string;
  category: string;
  tags: string[];

  transcript: string;

  summary: string;
  keyTakeaways: string[];
  painsAddressed: {
    pain: string;
    relevanceToBB: "alta" | "media" | "baixa";
  }[];
  quotes: {
    text: string;
    useCase: "hook" | "copy" | "prova_social" | "autoridade";
  }[];
  benchmarks: {
    metric: string;
    value: string;
    context?: string;
  }[];

  relatedFeatures: { title: string; href: string; description: string }[];
  relatedVideoSlugs: string[];
  relatedBlogSlugs: string[];
}
