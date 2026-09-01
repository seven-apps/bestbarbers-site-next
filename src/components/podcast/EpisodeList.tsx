"use client";

import {
  formatDuration,
  spotifyEpisodeUrl,
  type PodcastEpisode,
} from "@/content/podcast";
import { SEASON_COVER, blockOfEpisode } from "@/content/podcast/temporada";
import {
  NowPlayingBars,
  PauseGlyph,
  PlayGlyph,
  usePodcastPlayer,
} from "@/components/podcast/PodcastPlayer";

interface EpisodeListProps {
  episodes: PodcastEpisode[];
}

/**
 * Lista dos episódios no desenho do Spotify: fundo escuro, capa quadrada, título,
 * linha de contexto e o play redondo à direita, com fio fino separando as linhas.
 *
 * Nenhuma linha monta player próprio — todas mandam no player único da página (ver
 * PodcastPlayer). É daí que vem "clicou em outro, o anterior para": não existe um
 * segundo player para continuar tocando.
 *
 * O estado visual (tocando / pausado) vem do evento `playback_update` do Spotify,
 * não de um `useState` otimista: se a pessoa apertar o ⏸ de dentro do iframe, a
 * linha acompanha na hora.
 *
 * SEM DESCRIÇÃO POR EPISÓDIO de propósito: nem o SSOT tem o campo, nem o Spotify
 * devolve uma (og:description volta genérico nos 12). A segunda linha usa o BLOCO da
 * temporada — classificação nossa, declarada em content/podcast/temporada.ts —, não
 * uma sinopse inventada sobre um áudio que a página não mediu.
 *
 * A regra "episódio sem spotifyId não entra" continua sendo aplicada na origem
 * (`publishedEpisodes`); aqui renderizamos exatamente o que recebemos.
 */
export function EpisodeList({ episodes }: EpisodeListProps) {
  const {
    activeEpisodeId,
    isPlaying,
    isBuffering,
    needsManualPlay,
    hasStarted,
    toggle,
  } = usePodcastPlayer();

  return (
    <ol className="border-y border-white/[0.07] divide-y divide-white/[0.07]">
      {episodes.map((ep) => {
        const num = String(ep.number).padStart(2, "0");
        const block = blockOfEpisode(ep.number);
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
            key={ep.spotifyId}
            aria-current={isThisPlaying ? "true" : undefined}
            className={`relative transition-colors duration-200 motion-reduce:transition-none ${
              isActive ? "bg-white/[0.05]" : "hover:bg-white/[0.035]"
            }`}
          >
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px] bg-[#ffaf02]"
              />
            )}

            <div className="flex items-start gap-3 px-2.5 py-3.5 md:gap-4 md:px-4 md:py-4">
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
                  className="text-[10px] font-extrabold uppercase leading-none tracking-[0.16em] text-[#ffaf02]"
                >
                  EP {num}
                </p>

                <h3
                  className={`mt-1.5 text-[15px] font-bold leading-snug md:text-base ${
                    isActive ? "text-[#ffaf02]" : "text-white"
                  }`}
                >
                  <span className="sr-only">Episódio {ep.number}: </span>
                  {ep.title}
                </h3>

                <p className="mt-1 text-[12px] leading-relaxed text-gray-400 md:text-[13px]">
                  {block && (
                    <>
                      <span>{block.title}</span>
                      <span aria-hidden> · </span>
                    </>
                  )}
                  <time dateTime={ep.publishDate}>{publishedLabel}</time>
                  <span aria-hidden> · </span>
                  <span className="sr-only">Duração: </span>
                  <span>{formatDuration(ep.durationSeconds)}</span>
                  {isThisBuffering && (
                    <span className="ml-2 text-[#ffaf02]">carregando…</span>
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 self-center md:gap-3">
                <a
                  href={spotifyEpisodeUrl(ep)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full px-1.5 py-2 text-xs font-semibold text-gray-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] motion-reduce:transition-none md:px-3"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14L21 3" />
                    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
                  </svg>
                  <span className="hidden md:inline">Abrir no Spotify</span>
                  <span className="sr-only">
                    Abrir no Spotify — episódio {ep.number}, {ep.title}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => toggle(ep)}
                  aria-label={
                    isThisPlaying
                      ? `Pausar episódio ${ep.number} — ${ep.title}`
                      : `Tocar episódio ${ep.number} — ${ep.title}`
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffaf02] text-[#121212] transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] motion-reduce:transition-none motion-reduce:hover:scale-100 md:h-11 md:w-11"
                >
                  {isThisPlaying ? (
                    <PauseGlyph className="h-4 w-4 md:h-[18px] md:w-[18px]" />
                  ) : (
                    <PlayGlyph className="ml-0.5 h-4 w-4 md:h-[18px] md:w-[18px]" />
                  )}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
