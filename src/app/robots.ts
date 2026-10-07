import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/admin/',
        '/private/',
        // Área do aluno do curso: abre só com o link pessoal (contrato do curso §3).
        '/curso-assinatura/aluno',
      ],
    },
    sitemap: 'https://www.bestbarbers.app/sitemap.xml',
  }
}
