import { MetadataRoute } from 'next'

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
      url: `${baseUrl}/termos-de-uso`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
