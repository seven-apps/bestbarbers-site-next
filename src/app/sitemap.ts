import { MetadataRoute } from 'next'
import { articles } from '@/content/blog'
import { videos } from '@/content/videos'

const baseUrl = 'https://www.bestbarbers.app'

/**
 * Data da última mudança REAL de conteúdo de cada página (SEO, 23/Nov/26). Antes era `new Date()`: toda URL dizia
 * "mudei agora" a cada deploy, e o Google passa a ignorar o lastmod do site inteiro, inclusive o do artigo que mudou
 * de verdade. Mudou o texto de uma página? Atualize a data dela aqui no mesmo commit.
 * Fora do sitemap de propósito: as 30 cidades (noindex, ver [cidade]/page.tsx) e termos/política (página legal).
 */
const ATUALIZADO_EM: Record<string, string> = {
  '': '2026-11-23',
  'sistema-para-barbearia': '2026-11-23',
  'clube-de-assinaturas': '2026-11-24',
  'agendamento-online': '2026-11-24',
  'agente-ia-whatsapp': '2026-07-31',
  'app-proprio-barbearia': '2026-11-24',
  'nota-fiscal-barbearia': '2026-03-26',
  'totem-autoatendimento': '2026-03-26',
  'gestao-financeira-barbearia': '2026-11-24',
  'gestao-comissoes-barbeiro': '2026-09-12',
  'calculadora-prejuizo': '2026-09-12',
  'calculadora-lucro-do-corte': '2026-09-12',
  'tabela-precificacao-clube': '2026-09-12',
  'curso-assinatura': '2026-10-06',
  conteudo: '2026-03-26',
}

const PAGINAS_DE_PRODUTO = [
  'sistema-para-barbearia',
  'clube-de-assinaturas',
  'agendamento-online',
  'agente-ia-whatsapp',
  'app-proprio-barbearia',
  'nota-fiscal-barbearia',
  'totem-autoatendimento',
  'gestao-financeira-barbearia',
  'gestao-comissoes-barbeiro',
]

const FERRAMENTAS = ['calculadora-prejuizo', 'calculadora-lucro-do-corte', 'tabela-precificacao-clube', 'curso-assinatura']

function pagina(slug: string, priority: number): MetadataRoute.Sitemap[number] {
  return { url: slug ? `${baseUrl}/${slug}` : baseUrl, lastModified: new Date(ATUALIZADO_EM[slug]!), priority }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const ultimoArtigo = articles.map((a) => a.updatedAt).sort().at(-1)!
  return [
    pagina('', 1),
    ...PAGINAS_DE_PRODUTO.map((slug) => pagina(slug, 0.9)),
    ...FERRAMENTAS.map((slug) => pagina(slug, 0.8)),
    { url: `${baseUrl}/blog`, lastModified: new Date(ultimoArtigo), priority: 0.8 },
    ...articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      priority: 0.8,
    })),
    pagina('conteudo', 0.6),
    ...videos.map((video) => ({
      url: `${baseUrl}/conteudo/${video.slug}`,
      lastModified: new Date(video.publishedAt),
      priority: 0.5,
    })),
  ]
}
