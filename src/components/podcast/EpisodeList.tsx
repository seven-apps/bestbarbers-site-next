"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  formatDuration,
  spotifyEpisodeUrl,
  type PodcastEpisode,
} from "@/content/podcast";
import {
  SEASON_COVER,
  seasonBlocks,
  type SeasonBlock,
} from "@/content/podcast/temporada";
import {
  NowPlayingBars,
  PauseGlyph,
  PlayGlyph,
  usePodcastPlayer,
} from "@/components/podcast/PodcastPlayer";
import { SpotifyGlyph } from "@/components/podcast/SpotifyGlyph";

interface EpisodeListProps {
  episodes: PodcastEpisode[];
}

/**
 * Lista dos episódios no desenho do Spotify: capa quadrada, título, "data ·
 * duração", o resumo do episódio em duas linhas e o play redondo à direita.
 *
 * Nenhuma linha monta player próprio — todas mandam no player único da página (ver
 * PodcastPlayer). É daí que vem "clicou em outro, o anterior para": não existe um
 * segundo player para continuar tocando.
 *
 * O estado visual (tocando / pausado) vem do evento `playback_update` do Spotify,
 * não de um `useState` otimista: se a pessoa apertar o ⏸ de dentro do iframe, a
 * linha acompanha na hora.
 *
 * DESCRIÇÃO (01/Set/2026): a lista passou a mostrar o resumo de cada episódio — o
 * MESMO texto publicado no Spotify, medido ao vivo e limpo, vivendo no campo
 * `description` de content/podcast. O comentário que existia aqui dizia que o
 * Spotify não devolvia descrição; era falso — o texto está no `<meta
 * name="description">`, não no `og:description`. O card mostra o resumo (≤300
 * caracteres) cortado em 2 linhas, expansível ao toque. O texto COMPLETO dos
 * episódios longos não entra na linha: ele é grande demais para um item de lista e
 * já viaja no JSON-LD da página (`episodeDescriptionFull`) e no próprio Spotify.
 *
 * BLOCOS DA TEMPORADA: o cartão "A temporada em quatro blocos" saiu do hero. O
 * conteúdo dele não se perdeu — virou o cabeçalho de cada trecho da própria lista,
 * onde ele orienta a leitura corrida em vez de competir com ela.
 *
 * GEOMETRIA DE TOQUE (a causa medida do "pausar não funciona" no celular): o link
 * do Spotify e o botão de play ficavam a 2,0px um do outro, com 28×32 e 40×40 de
 * área — o dedo escorregava para o link, que abre outra aba com o áudio seguindo
 * atrás. Agora eles estão em LINHAS DIFERENTES do cartão, ambos com 44×44 de área
 * mínima: o play no alto, à direita do título; o link do Spotify no rodapé da
 * linha, com a marca verde e rótulo visível.
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
  const {
    activeEpisodeId,
    isPlaying,
    isBuffering,
    needsManualPlay,
    hasStarted,
    toggle,
  } = usePodcastPlayer();

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
  // O episódio 1 já nasce CARREGADO no player, mas ninguém o escolheu ainda —
  // destacar a linha antes da primeira escolha diria que ele está tocando.
  const isActive = hasStarted && activeEpisodeId === ep.spotifyId;
  // Enquanto o player pede confirmação manual ele está PARADO, por mais que o
  // estado otimista diga que mandamos tocar. Mostrar ⏸ aqui seria mentir para
  // a pessoa — e faria o próximo clique pausar um áudio que nunca começou.
  const isThisPlaying = isActive && isPlaying && !needsManualPlay;
  // "carregando…" para de valer quando o player pediu confirmação manual —
  // aí quem espera é a pessoa, não a rede.
  const isThisBuffering = isActive && isBuffering && !needsManualPlay;
  // "15 jun 2026" em vez de "15 de jun. de 2026": no celular a coluna de texto
  // é estreita e a forma longa jogava a linha de contexto para duas linhas.
  const published = new Date(`${ep.publishDate}T12:00:00`);
  const month = published
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  const publishedLabel = `${published.getDate()} ${month} ${published.getFullYear()}`;

  return (
    <li
      aria-current={isThisPlaying ? "true" : undefined}
      className={`relative border-b border-white/[0.07] py-4 transition-colors duration-200 motion-reduce:transition-none ${
        isActive ? "bg-white/[0.04]" : ""
      }`}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute inset-y-0 -left-2 w-[3px] rounded-full bg-[#ffaf02] md:-left-3"
        />
      )}

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
          {isThisPlaying && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[#ffaf02]">
              <NowPlayingBars />
            </span>
          )}
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

          <h4
            className={`mt-1.5 text-[15px] font-bold leading-snug md:text-base ${
              isActive ? "text-[#ffaf02]" : "text-white"
            }`}
          >
            <span className="sr-only">Episódio {ep.number}: </span>
            {ep.title}
          </h4>

          <p className="mt-1 text-xs leading-relaxed text-gray-400 md:text-[13px]">
            <time dateTime={ep.publishDate}>{publishedLabel}</time>
            <span aria-hidden> · </span>
            <span className="sr-only">Duração: </span>
            <span>{formatDuration(ep.durationSeconds)}</span>
            {isThisBuffering && (
              <span className="ml-2 text-[#ffaf02]">carregando…</span>
            )}
          </p>
        </div>

        {/* O play fica SOZINHO nesta linha: nada de alvo pequeno colado nele. */}
        <button
          type="button"
          onClick={() => toggle(ep)}
          aria-label={
            isThisPlaying
              ? `Pausar episódio ${ep.number} — ${ep.title}`
              : `Tocar episódio ${ep.number} — ${ep.title}`
          }
          className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffaf02] text-[#121212] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          {isThisPlaying ? (
            <PauseGlyph className="h-[18px] w-[18px]" />
          ) : (
            <PlayGlyph className="ml-0.5 h-[18px] w-[18px]" />
          )}
        </button>
      </div>

      {/* Resumo — largura cheia no celular (é onde ele tem espaço para respirar),
          alinhado com o título a partir do md. */}
      <div className="mt-2.5 md:pl-20">
        <p
          ref={summaryRef}
          id={summaryId}
          className={`text-[13px] leading-relaxed text-gray-300 md:text-sm ${
            isExpanded ? "" : "line-clamp-2"
          }`}
        >
          {ep.description}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-4">
          {canExpand && (
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              aria-expanded={isExpanded}
              aria-controls={summaryId}
              className="inline-flex min-h-11 items-center text-xs font-bold text-gray-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] motion-reduce:transition-none"
            >
              {isExpanded ? "Ler menos" : "Ler mais"}
            </button>
          )}

          <a
            href={spotifyEpisodeUrl(ep)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir o episódio ${ep.number} no Spotify — ${ep.title}`}
            className="ml-auto inline-flex min-h-11 items-center gap-2 text-xs font-bold text-gray-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] motion-reduce:transition-none"
          >
            <SpotifyGlyph className="h-[18px] w-[18px] shrink-0 text-[#1DB954]" />
            <span aria-hidden>Ouvir no Spotify</span>
          </a>
        </div>
      </div>
    </li>
  );
}
