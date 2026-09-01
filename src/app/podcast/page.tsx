import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { PodcastAttribution } from "@/components/podcast/PodcastAttribution";
import {
  PlayFirstEpisodeButton,
  PodcastPlayerProvider,
} from "@/components/podcast/PodcastPlayer";
import { EpisodeList } from "@/components/podcast/EpisodeList";
import { SpotifyGlyph } from "@/components/podcast/SpotifyGlyph";
import {
  PODCAST_SHOW_NAME,
  currentSeason,
  publishedEpisodes,
  episodeDescriptionFull,
  isoDuration,
  spotifyEpisodeUrl,
  spotifyShowUrl,
} from "@/content/podcast";
import { seasonTotalMinutes } from "@/content/podcast/temporada";

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
 * ESCUTA: a página inteira tem UM player do Spotify, montado uma vez e reaproveitado
 * — os 12 botões da listagem trocam o episódio dentro dele. Daí saem as três coisas
 * que a rota precisava: um clique em vez de dois, "clicou em outro, o anterior para"
 * sem nenhum listener (não existe segundo player), e 1 embed em vez de 12. Toda a
 * mecânica, os limites do autoplay e o plano B estão documentados em
 * src/components/podcast/PodcastPlayer.tsx.
 *
 * O QUE MUDOU EM 01/Set/2026 (pedido do André, olhando a página no celular): saíram
 * os dois cartões que ficavam entre o hero e a lista — "COMECE POR AQUI / Episódio
 * 1" e "A temporada em quatro blocos". Eles empurravam a primeira linha da lista
 * para 2.134px do topo, 2,5 telas de rolagem, e a intenção da página é o contrário:
 * quem abre tem que ver na hora que existe uma temporada inteira. Nada do que eles
 * faziam se perdeu — o "comece por aqui" virou uma linha do hero mais o botão
 * `PlayFirstEpisodeButton`, e os quatro blocos viraram os cabeçalhos dos trechos da
 * própria lista. O player, que morava dentro do primeiro cartão, passou a nascer
 * como barra fixa no rodapé.
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
  /* `description` é campo válido de PodcastEpisode no schema.org e é o que o
     buscador usa como sinopse do episódio no resultado rico — vale o texto
     COMPLETO, não o resumo cortado que o card mostra. */
  hasPart: publishedEpisodes.map((ep) => ({
    "@type": "PodcastEpisode",
    name: ep.title,
    episodeNumber: ep.number,
    datePublished: ep.publishDate,
    description: episodeDescriptionFull(ep),
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
/*  Página                                                             */
/* ------------------------------------------------------------------ */
/* O roteiro da temporada em quatro blocos é dado, em
   src/content/podcast/temporada.ts. Quem o consome hoje é só a listagem, que o usa
   como cabeçalho dos quatro trechos — o hero deixou de repeti-lo num cartão. */
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

      <PodcastPlayerProvider episodes={publishedEpisodes}>
      <main className="pt-[70px] md:pt-[80px] bg-white">
        {/* ---------------------------------------------------------- */}
        {/*  HERO — o que é, para quem é, e o play                      */}
        {/* ---------------------------------------------------------- */}
        <section
          className="bg-[#121212] pt-10 pb-10 md:pt-16 md:pb-16"
          aria-labelledby="hero-title"
        >
          <div className="container-custom">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex items-center gap-2 text-xs text-gray-500 md:mb-7"
            >
              {/* `min-h-11` porque no celular este é um alvo de dedo, não de mouse. */}
              <Link
                href="/"
                className="inline-flex min-h-11 items-center pr-1 transition-colors hover:text-[#ffaf02] motion-reduce:transition-none"
              >
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="text-gray-400">Podcast</span>
            </nav>

            <div className="max-w-3xl">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm font-bold tracking-[0.14em] md:tracking-[0.18em] uppercase text-[#ffaf02]">
                <span>{PODCAST_SHOW_NAME}</span>
                <span aria-hidden>·</span>
                {/* "Temporada 1" não quebra: com o tracking em caixa alta o número
                    ficava órfão sozinho na segunda linha no celular. */}
                <span className="whitespace-nowrap">
                  Temporada {currentSeason.number}
                </span>
              </p>

              <h1
                id="hero-title"
                className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-[1.1]"
              >
                {currentSeason.name}
              </h1>

              {/* Selo da plataforma nº 1 — em 1 segundo o lead sabe onde ouvir. */}
              <a
                href={spotifyShowUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir o ${PODCAST_SHOW_NAME} no Spotify`}
                className="mt-5 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:border-[#1DB954]/60 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] motion-reduce:transition-none"
              >
                <SpotifyGlyph className="h-5 w-5 shrink-0 text-[#1DB954]" />
                <span aria-hidden>Ouça no Spotify</span>
              </a>

              <p className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
                Um podcast para o dono de barbearia que decidiu montar — ou
                consertar — o clube de assinaturas. Um assunto por episódio,
                do conceito à conta que fecha no fim do mês.
              </p>

              {/* A linha que o cartão "COMECE POR AQUI" fazia: quantos são, que é
                  uma temporada fechada, e por onde começar. */}
              <p className="mt-4 text-sm md:text-base text-gray-400 leading-relaxed max-w-xl">
                Sem convidado e sem enrolação: é a BestBarbers falando do que
                vê acontecer na operação de quem já roda um clube.{" "}
                <strong className="text-gray-200">
                  Os {totalEpisodios} episódios estão no ar
                </strong>{" "}
                — a temporada inteira, na ordem, logo aqui embaixo. Se estiver em
                dúvida por onde entrar, comece pelo episódio 1: é ele que vira a
                chave de que clube não é desconto.
              </p>

              {primeiro && (
                <div className="mt-7">
                  <PlayFirstEpisodeButton episode={primeiro} />
                </div>
              )}

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
                  {Math.floor(seasonTotalMinutes / 60)}h{seasonTotalMinutes % 60}{" "}
                  no total
                </li>
                <li className="flex items-center gap-2">
                  <SpotifyGlyph className="h-4 w-4 shrink-0 text-[#1DB954]" />
                  De graça, no Spotify
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  EPISÓDIOS                                                  */}
        {/* ---------------------------------------------------------- */}
        <section
          className="border-t border-white/[0.06] bg-[#0c0c0c] pt-10 pb-14 md:pt-16 md:pb-20"
          aria-labelledby="episodios-title"
        >
          {/* LARGURA: a lista usa o MESMO container de todas as outras seções.
              Havia um `max-w-4xl` aqui que a deixava 112px mais curta que o resto
              da página no desktop (terminava em 1112px contra 1224px) — era o
              desalinhamento que o André viu. A densidade que esse limite protegia
              agora vem do desenho da própria linha, não de um teto de largura. */}
          <div className="container-custom">
            <div className="flex items-center gap-3">
              <SpotifyGlyph className="h-7 w-7 shrink-0 text-[#1DB954] md:h-8 md:w-8" />
              <h2
                id="episodios-title"
                className="text-2xl font-extrabold text-white md:text-3xl"
              >
                Os {totalEpisodios} episódios da temporada
              </h2>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400 md:text-base">
              Aperte o play e o episódio toca aqui mesmo — sem sair da página,
              sem cadastro. É um player só para a temporada inteira: ao tocar
              outro episódio, o anterior para. Se preferir ouvir no aplicativo,
              cada episódio também abre direto no Spotify.
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
                  Os {totalEpisodios} episódios tratam de uma coisa só: o clube
                  de assinaturas da sua barbearia. Começam no reframe de que
                  clube não é desconto, passam por preço, frequência, comissão e
                  a conversa com a equipe, e terminam no roteiro dos primeiros
                  assinantes. É uma sequência — não uma pilha de episódios
                  soltos — e ela está inteira aqui, para ouvir no seu ritmo.
                </p>
              </div>
            </div>

            {/* Fecho: quem preferir o aplicativo sai daqui direto para o programa. */}
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.08] pt-8">
              <a
                href={spotifyShowUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Seguir o ${PODCAST_SHOW_NAME} no Spotify`}
                className="inline-flex min-h-11 items-center gap-2.5 text-sm font-bold text-white transition-colors duration-200 hover:text-[#1DB954] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] motion-reduce:transition-none"
              >
                <SpotifyGlyph className="h-6 w-6 shrink-0 text-[#1DB954]" />
                <span aria-hidden>
                  Seguir o {PODCAST_SHOW_NAME} no Spotify
                </span>
              </a>
              <p className="text-sm text-gray-500">
                No aplicativo dá para baixar, ouvir offline e continuar de onde
                parou.
              </p>
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
      </PodcastPlayerProvider>

      <Footer />
    </>
  );
}
