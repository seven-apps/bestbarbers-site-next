"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatDuration, type PodcastEpisode } from "@/content/podcast";
import {
  SEASON_COVER,
  seasonBlocks,
  type SeasonBlock,
} from "@/content/podcast/temporada";
import { EpisodeRowLink } from "@/components/podcast/SpotifyLinks";
import { SpotifyGlyph } from "@/components/podcast/SpotifyGlyph";

interface EpisodeListProps {
  episodes: PodcastEpisode[];
}

/**
 * Lista dos episódios no desenho do Spotify: capa quadrada, título, "data ·
 * duração" e o resumo do episódio em duas linhas.
 *
 * UMA AÇÃO SÓ (01/Set/2026): a linha inteira é um link para o episódio no Spotify.
 * Antes ela tinha um play que tocava a página inteira num embed; o embed saiu
 * porque a escuta que acontecia nele não contava no painel do Spotify (nem play,
 * nem stream, nem listener) e porque quem clica num anúncio não para 13 minutos ali
 * — no aplicativo ele salva, segue e ouve depois. O ícone verde e o rótulo "Ouvir
 * no Spotify" são a affordance; quem carrega o clique é a camada de link que cobre
 * o cartão (ver EpisodeRowLink, em SpotifyLinks). Com o play fora, a linha ganhou a
 * largura que o botão ocupava.
 *
 * DESCRIÇÃO: o resumo é o MESMO texto publicado no Spotify, medido ao vivo e limpo,
 * vivendo no campo `description` de content/podcast. O card mostra o resumo (≤300
 * caracteres) cortado em 2 linhas, expansível ao toque. O texto COMPLETO dos
 * episódios longos não entra na linha: é grande demais para um item de lista e já
 * viaja no JSON-LD da página (`episodeDescriptionFull`) e no próprio Spotify.
 *
 * BLOCOS DA TEMPORADA: o cartão "A temporada em quatro blocos" saiu do hero. O
 * conteúdo dele não se perdeu — virou o cabeçalho de cada trecho da própria lista,
 * onde ele orienta a leitura corrida em vez de competir com ela.
 *
 * GEOMETRIA DE TOQUE: o alvo agora é o cartão inteiro (bem acima dos 44px em
 * qualquer tela). O único outro alvo da linha é o "Ler mais", com 44px de altura e
 * num plano acima do link — é o motivo de o link ser uma camada absoluta e não um
 * `<a>` embrulhando tudo: botão dentro de link é HTML inválido, e foi colar alvo
 * pequeno em alvo grande que quebrou esta linha no celular da última vez.
 *
 * A regra "episódio sem spotifyId não entra" continua sendo aplicada na origem
 * (`publishedEpisodes`); aqui renderizamos exatamente o que recebemos.
 */
export function EpisodeList({ episodes }: EpisodeListProps) {
  const groups = groupByBlock(episodes);

  return (
    <div className="space-y-10 md:space-y-12">
      {groups.map((group, index) => (
        <EpisodeGroup
          key={group.block?.title ?? `sem-bloco-${index}`}
          block={group.block}
          episodes={group.episodes}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Agrupamento por bloco da temporada                                 */
/* ------------------------------------------------------------------ */

interface EpisodeGroupData {
  block?: SeasonBlock;
  episodes: PodcastEpisode[];
}

/**
 * Reparte os episódios nos quatro blocos declarados em content/podcast/temporada.
 * Quem cair fora de todas as faixas vai para um grupo final SEM cabeçalho — nunca
 * some da tela por não ter classificação.
 */
function groupByBlock(episodes: PodcastEpisode[]): EpisodeGroupData[] {
  const groups: EpisodeGroupData[] = [];
  const used = new Set<number>();

  for (const block of seasonBlocks) {
    const inBlock = episodes.filter(
      (ep) => ep.number >= block.from && ep.number <= block.to
    );
    if (inBlock.length === 0) continue;
    inBlock.forEach((ep) => used.add(ep.number));
    groups.push({ block, episodes: inBlock });
  }

  const orphans = episodes.filter((ep) => !used.has(ep.number));
  if (orphans.length > 0) groups.push({ episodes: orphans });

  return groups;
}

function EpisodeGroup({
  block,
  episodes,
}: {
  block?: SeasonBlock;
  episodes: PodcastEpisode[];
}) {
  const headingId = useId();

  return (
    <section aria-labelledby={block ? headingId : undefined}>
      {block && (
        <header className="mb-1">
          <div className="flex items-center gap-3">
            <h3
              id={headingId}
              className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#ffaf02]"
            >
              {block.range} · {block.title}
            </h3>
            <span aria-hidden className="h-px flex-1 bg-white/10" />
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
            {block.text}
          </p>
        </header>
      )}

      <ol
        start={episodes[0]?.number}
        className="mt-4 border-t border-white/[0.07]"
      >
        {episodes.map((ep) => (
          <EpisodeRow key={ep.spotifyId} episode={ep} />
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  A linha do episódio                                                */
/* ------------------------------------------------------------------ */

function EpisodeRow({ episode: ep }: { episode: PodcastEpisode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement | null>(null);
  const summaryId = useId();

  /**
   * "Ler mais" só aparece quando o texto REALMENTE não coube nas duas linhas —
   * medido no elemento, não chutado por contagem de caracteres (a quebra depende
   * da largura da tela e da fonte). Enquanto está expandido não medimos: ali
   * `scrollHeight` e `clientHeight` são iguais por definição, e a medição apagaria
   * o botão de recolher.
   */
  useEffect(() => {
    if (isExpanded) return;
    const el = summaryRef.current;
    if (!el) return;

    const measure = () => setCanExpand(el.scrollHeight - el.clientHeight > 1);
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isExpanded]);

  const num = String(ep.number).padStart(2, "0");
  // "15 jun 2026" em vez de "15 de jun. de 2026": no celular a coluna de texto
  // é estreita e a forma longa jogava a linha de contexto para duas linhas.
  const published = new Date(`${ep.publishDate}T12:00:00`);
  const month = published
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  const publishedLabel = `${published.getDate()} ${month} ${published.getFullYear()}`;

  return (
    <li className="group relative border-b border-white/[0.07] py-4 transition-colors duration-200 hover:bg-white/[0.04] motion-reduce:transition-none">
      {/* A camada que faz a linha inteira valer um clique. Vem antes do conteúdo
          no DOM para que a ordem de tabulação seja "episódio → Ler mais". */}
      <EpisodeRowLink episode={ep} />

      <div className="flex items-start gap-3 md:gap-4">
        {/* Capa da temporada — a mesma arte que o Spotify mostra nos 12 episódios. */}
        <div className="relative mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#1a1a1a] ring-1 ring-white/10 md:h-16 md:w-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SEASON_COVER.src}
            alt=""
            width={SEASON_COVER.width}
            height={SEASON_COVER.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* O número é linha própria, não prefixo: no celular a coluna de texto
              é estreita e um prefixo inline empurrava o título para 4 linhas. */}
          <p
            aria-hidden
            className="text-xs font-extrabold uppercase leading-none tracking-[0.14em] text-[#ffaf02]"
          >
            EP {num}
          </p>

          <h4 className="mt-1.5 text-[15px] font-bold leading-snug text-white transition-colors duration-200 group-hover:text-[#ffaf02] md:text-base motion-reduce:transition-none">
            <span className="sr-only">Episódio {ep.number}: </span>
            {ep.title}
          </h4>

          <p className="mt-1 text-xs leading-relaxed text-gray-400 md:text-[13px]">
            <time dateTime={ep.publishDate}>{publishedLabel}</time>
            <span aria-hidden> · </span>
            <span className="sr-only">Duração: </span>
            <span>{formatDuration(ep.durationSeconds)}</span>
          </p>
        </div>

      </div>

      {/* Resumo — largura cheia no celular (é onde ele tem espaço para respirar),
          alinhado com o título a partir do md.

          MEDIDA (`max-w-[68ch]`): sem teto o resumo corria 928px no 1440, o texto
          mais largo da página — mais largo que o parágrafo do hero (768px). O teto
          está em `ch` de propósito, e NÃO nas escalas nomeadas: src/styles/tokens.css
          redefine --container-sm/md/lg/xl/2xl como os valores de BREAKPOINT
          (640/768/1024/1280/1536px), e no Tailwind v4 é dessas variáveis que
          `max-w-*` vive — ou seja, neste site `max-w-2xl` vale 1536px e não prende
          nada abaixo disso (medido: com max-w-2xl o parágrafo continuou em 928px).
          `ch` também diz o que a regra quer: caberem ~68 caracteres por linha.
          Fica no <p> e não no container para a linha de ação embaixo continuar
          livre. */}
      <div className="mt-2.5 md:pl-20">
        <p
          ref={summaryRef}
          id={summaryId}
          className={`max-w-[68ch] text-[13px] leading-relaxed text-gray-300 md:text-sm ${
            isExpanded ? "" : "line-clamp-2"
          }`}
        >
          {ep.description}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-4">
          {canExpand && (
            /* z-20: fica ACIMA da camada de link, senão o toque abriria o Spotify
               em vez de expandir o texto. É o único alvo da linha que não leva
               para fora. */
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              aria-expanded={isExpanded}
              aria-controls={summaryId}
              className="relative z-20 inline-flex min-h-11 items-center text-xs font-bold text-gray-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] motion-reduce:transition-none"
            >
              {isExpanded ? "Ler menos" : "Ler mais"}
            </button>
          )}

          {/* A affordance da linha: uma só, com rótulo, no mesmo lugar em toda
              tela. É DECORAÇÃO — quem tem nome acessível é a camada de link que
              cobre o cartão; um segundo link aqui faria o leitor de tela anunciar
              o mesmo destino duas vezes e criaria um alvo pequeno dentro de um
              alvo grande (foi assim que esta linha quebrou no celular da última
              vez). Desenhada como pílula porque precisa PARECER o botão que era o
              play — o cartão inteiro clica, mas o olho procura um botão.

              SEM `ml-auto`: encostada na direita ela ficava, no desktop, sozinha a
              ~760px do texto a que pertence — e em 11 dos 12 episódios o resumo
              cabe nas duas linhas, então o "Ler mais" some e sobra uma faixa vazia
              inteira à esquerda dela. Aqui ela segue o fluxo do texto: nasce
              embaixo do resumo, ao lado do "Ler mais" quando ele existe. */}
          <span
            aria-hidden
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 text-xs font-bold text-white transition-colors duration-200 group-hover:border-[#1DB954]/60 group-hover:bg-[#1DB954]/10 md:text-[13px] motion-reduce:transition-none"
          >
            <SpotifyGlyph className="h-[18px] w-[18px] shrink-0 text-[#1DB954]" />
            Ouvir no Spotify
          </span>
        </div>
      </div>
    </li>
  );
}
