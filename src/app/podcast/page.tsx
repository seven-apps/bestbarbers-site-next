import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { PodcastAttribution } from "@/components/podcast/PodcastAttribution";
import { SpotifyEmbed } from "@/components/podcast/SpotifyEmbed";
import { EpisodeList } from "@/components/podcast/EpisodeList";
import {
  PODCAST_SHOW_NAME,
  currentSeason,
  publishedEpisodes,
  isoDuration,
  spotifyEpisodeUrl,
} from "@/content/podcast";

/**
 * Destino da campanha de atenção do podcast — e destino dos links publicados na
 * descrição dos episódios no Spotify (/podcast e /podcast?desc=1.3).
 *
 * Antes desta versão a rota renderizava <HomePage/> (espelho da home). Quem ouvia
 * um episódio e digitava o link caía numa página que não mencionava o podcast.
 * Agora a página mostra a temporada que está no ar, com player embutido.
 *
 * SEMEADURA: a página não pede nada. Sem formulário, sem modal — nem o CTA da
 * Navbar (por isso `withoutCta`). O único caminho para a BestBarbers é um link
 * discreto no rodapé da página. A atribuição de quem converter depois continua
 * viajando na sessão (ver PodcastAttribution).
 *
 * SÓ DADO VERIFICÁVEL: os 12 episódios vêm de src/content/podcast, com título,
 * duração e ID medidos ao vivo no Spotify. Episódio sem spotifyId não é renderizado.
 *
 * noindex MANTIDO: a razão antiga ("espelho da home") acabou, mas trocar o status
 * de indexação é decisão do André. Para indexar: apagar o bloco `robots` abaixo e
 * acrescentar `/podcast` à lista MANUAL de src/app/sitemap.ts.
 */

const PAGE_URL = "https://www.bestbarbers.app/podcast";

export const metadata: Metadata = {
  title: "BestBarbers Podcast — Assinatura do Zero | Clube de assinaturas na barbearia",
  description:
    "Temporada 1 do BestBarbers Podcast: 12 episódios curtos sobre como montar, precificar, vender e gerir o clube de assinaturas da sua barbearia. Ouça de graça.",
  keywords: [
    "podcast para barbearia",
    "clube de assinaturas barbearia",
    "assinatura barbearia",
    "gestão de barbearia",
    "como vender assinatura na barbearia",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
  openGraph: {
    title: "BestBarbers Podcast — Assinatura do Zero",
    description:
      "12 episódios curtos para o dono de barbearia montar, precificar, vender e gerir o clube de assinaturas.",
    url: PAGE_URL,
    siteName: "BestBarbers",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BestBarbers Podcast — Assinatura do Zero",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD                                                            */
/* ------------------------------------------------------------------ */
const podcastJsonLd = {
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  name: `${PODCAST_SHOW_NAME} — ${currentSeason.name}`,
  url: PAGE_URL,
  inLanguage: "pt-BR",
  description: currentSeason.subtitle,
  publisher: {
    "@type": "Organization",
    name: "BestBarbers",
    url: "https://www.bestbarbers.app",
  },
  hasPart: publishedEpisodes.map((ep) => ({
    "@type": "PodcastEpisode",
    name: ep.title,
    episodeNumber: ep.number,
    datePublished: ep.publishDate,
    timeRequired: isoDuration(ep.durationSeconds),
    url: spotifyEpisodeUrl(ep),
    inLanguage: "pt-BR",
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.bestbarbers.app",
    },
    { "@type": "ListItem", position: 2, name: "Podcast", item: PAGE_URL },
  ],
};

/* ------------------------------------------------------------------ */
/*  Roteiro da temporada — agrupamento dos episódios que estão no ar    */
/* ------------------------------------------------------------------ */
const blocos = [
  {
    faixa: "Episódios 1 a 3",
    titulo: "O conceito",
    texto:
      "Por que clube não é desconto, os três ciclos do dinheiro na barbearia e a frequência real de quem assina.",
  },
  {
    faixa: "Episódios 4 e 5",
    titulo: "O desenho do plano",
    texto:
      "Como o cliente avulso vira assinante e por onde começar a montar o plano.",
  },
  {
    faixa: "Episódios 6 a 8",
    titulo: "A conta",
    texto:
      "Quanto cobrar sem matar a margem, o que muda no bolso do barbeiro e como distribuir comissão sem briga.",
  },
  {
    faixa: "Episódios 9 a 12",
    titulo: "A venda e a operação",
    texto:
      "Vender o clube no balcão, destravar o que emperra e chegar aos primeiros 100 assinantes.",
  },
];

/* ------------------------------------------------------------------ */
/*  Página                                                             */
/* ------------------------------------------------------------------ */
export default function PodcastPage() {
  const primeiro = publishedEpisodes[0];
  const totalEpisodios = publishedEpisodes.length;

  return (
    <>
      <PodcastAttribution />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar withoutCta />

      <main className="pt-[70px] md:pt-[80px] bg-white">
        {/* ---------------------------------------------------------- */}
        {/*  HERO — o que é, para quem é, e o play                      */}
        {/* ---------------------------------------------------------- */}
        <section
          className="bg-[#121212] pt-12 pb-14 md:pt-16 md:pb-20"
          aria-labelledby="hero-title"
        >
          <div className="container-custom">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-gray-500 mb-8"
            >
              <Link href="/" className="hover:text-[#ffaf02] transition-colors">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="text-gray-400">Podcast</span>
            </nav>

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start">
              {/* Coluna esquerda — texto + player do episódio 1 */}
              <div>
                <p className="text-xs md:text-sm font-bold tracking-[0.18em] uppercase text-[#ffaf02]">
                  {PODCAST_SHOW_NAME} · Temporada {currentSeason.number}
                </p>

                <h1
                  id="hero-title"
                  className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-[1.1]"
                >
                  {currentSeason.name}
                </h1>

                <p className="mt-5 text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
                  Um podcast para o dono de barbearia que decidiu montar — ou
                  consertar — o clube de assinaturas. Um assunto por episódio,
                  do conceito à conta que fecha no fim do mês.
                </p>

                <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
                  Sem convidado e sem enrolação: é a BestBarbers falando do que
                  vê acontecer na operação de quem já roda um clube.{" "}
                  <strong className="text-gray-200">
                    Os 12 episódios estão no ar
                  </strong>{" "}
                  — dá para ouvir a temporada inteira, na ordem, sem esperar
                  episódio novo.
                </p>

                {/* Fatos verificáveis da temporada */}
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs md:text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full bg-[#ffaf02]"
                    />
                    {totalEpisodios} episódios
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full bg-[#ffaf02]"
                    />
                    Nenhum passa de 17 minutos
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="w-1.5 h-1.5 rounded-full bg-[#ffaf02]"
                    />
                    De graça, no Spotify
                  </li>
                </ul>

                {primeiro && (
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#ffaf02]">
                      Comece por aqui
                    </p>
                    <p className="mt-2 text-white font-bold text-lg leading-snug">
                      Episódio {primeiro.number} — {primeiro.title}
                    </p>
                    <div className="mt-5">
                      <SpotifyEmbed
                        spotifyId={primeiro.spotifyId}
                        title={primeiro.title}
                        label="Ouvir o episódio 1"
                        featured
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna direita — o roteiro da temporada */}
              <aside
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
                aria-labelledby="roteiro-title"
              >
                <h2
                  id="roteiro-title"
                  className="text-lg md:text-xl font-bold text-white"
                >
                  A temporada em quatro blocos
                </h2>
                <ol className="mt-6 space-y-6">
                  {blocos.map((b) => (
                    <li key={b.titulo} className="border-l-2 border-[#ffaf02]/40 pl-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#ffaf02]">
                        {b.faixa}
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">
                        {b.titulo}
                      </p>
                      <p className="mt-1 text-sm text-gray-400 leading-relaxed">
                        {b.texto}
                      </p>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  EPISÓDIOS                                                  */}
        {/* ---------------------------------------------------------- */}
        <section
          className="py-14 md:py-20 bg-white"
          aria-labelledby="episodios-title"
        >
          <div className="container-custom">
            <h2
              id="episodios-title"
              className="text-2xl md:text-3xl font-extrabold text-[#121212]"
            >
              Os {totalEpisodios} episódios da temporada
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl">
              Aperte o play e o episódio toca aqui mesmo — sem sair da página,
              sem cadastro. Se preferir ouvir no aplicativo, cada episódio também
              abre direto no Spotify.
            </p>

            <div className="mt-10">
              <EpisodeList episodes={publishedEpisodes} />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  COMO OUVIR / O QUE VEM DEPOIS                              */}
        {/* ---------------------------------------------------------- */}
        <section
          className="bg-[#121212] py-14 md:py-20"
          aria-labelledby="ouvir-title"
        >
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h2
                  id="ouvir-title"
                  className="text-2xl md:text-3xl font-extrabold text-white"
                >
                  Não pedimos nada em troca
                </h2>
                <p className="mt-4 text-base text-gray-400 leading-relaxed">
                  Não tem formulário, não tem cadastro e não tem lista de espera
                  nesta página. O conteúdo é o produto aqui: se um episódio te
                  ajudar a resolver alguma coisa na sua barbearia esta semana,
                  ele já valeu.
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  Um assunto só, do começo ao fim
                </h2>
                <p className="mt-4 text-base text-gray-400 leading-relaxed">
                  Os 12 episódios tratam de uma coisa só: o clube de assinaturas
                  da sua barbearia. Começam no reframe de que clube não é
                  desconto, passam por preço, frequência, comissão e a conversa
                  com a equipe, e terminam no roteiro dos primeiros assinantes.
                  É uma sequência — não uma pilha de episódios soltos — e ela
                  está inteira aqui, para ouvir no seu ritmo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  SAÍDA SUAVE — quem faz o podcast (link, nunca modal)       */}
        {/* ---------------------------------------------------------- */}
        <section
          className="py-14 md:py-20 bg-white"
          aria-labelledby="quem-faz-title"
        >
          <div className="container-custom">
            <div className="rounded-2xl border border-gray-200 p-6 md:p-10">
              <h2
                id="quem-faz-title"
                className="text-xl md:text-2xl font-extrabold text-[#121212]"
              >
                Quem faz este podcast
              </h2>
              <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl">
                A BestBarbers é a plataforma de gestão usada por mais de 1.200
                barbearias, com mais de 51.000 assinantes pagando todo mês em
                toda a rede. No clube, cada barbearia configura os planos e os
                dias de utilização do jeito que faz sentido para a operação dela.
              </p>
              <p className="mt-4 text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl">
                Se depois de ouvir você quiser ver como isso funciona por dentro,
                os caminhos estão aqui — sem pressa.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/clube-de-assinaturas"
                  className="inline-flex items-center justify-center gap-2 border border-[#121212]/20 text-[#121212] px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:border-[#121212] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Conhecer o clube de assinaturas
                </Link>
                <Link
                  href="/sistema-para-barbearia"
                  className="inline-flex items-center justify-center gap-2 border border-[#121212]/20 text-[#121212] px-6 py-3.5 rounded-full text-sm font-bold transition-all duration-300 hover:border-[#121212] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Ver o sistema
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
