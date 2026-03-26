import { MetadataRoute } from 'next'
import { cities } from '@/data/cities'
import { articles } from '@/content/blog'
import { videos } from '@/content/videos'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bestbarbers.app'

  const featurePages = [
    'clube-de-assinaturas',
    'agendamento-online',
    'app-proprio-barbearia',
    'nota-fiscal-barbearia',
    'totem-autoatendimento',
    'gestao-financeira-barbearia',
    'gestao-comissoes-barbeiro',
    'sistema-para-barbearia',
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...featurePages.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/conteudo`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...videos.map((video) => ({
      url: `${baseUrl}/conteudo/${video.slug}`,
      lastModified: new Date(video.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...cities.map((city) => ({
      url: `${baseUrl}/sistema-para-barbearia/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/termos-de-uso`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
