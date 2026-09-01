import {
  formatDuration,
  spotifyEpisodeUrl,
  type PodcastEpisode,
} from "@/content/podcast";
import { SpotifyEmbed } from "@/components/podcast/SpotifyEmbed";

interface EpisodeListProps {
  episodes: PodcastEpisode[];
}

/**
 * Lista dos episódios da temporada. Server Component: só o player (fachada) é
 * client. Renderiza exatamente o que recebe — a regra "episódio sem spotifyId
 * não entra" é aplicada na origem (publishedEpisodes, src/content/podcast).
 */
export function EpisodeList({ episodes }: EpisodeListProps) {
  return (
    <ol className="space-y-4">
      {episodes.map((ep) => {
        const num = String(ep.number).padStart(2, "0");
        return (
          <li
            key={ep.spotifyId}
            className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 transition-all hover:border-[#ffaf02]/50 hover:shadow-lg"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4 min-w-0">
                <span
                  aria-hidden
                  className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-[#121212] text-[#ffaf02] font-extrabold text-sm"
                >
                  {num}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-[#121212] leading-snug">
                    <span className="sr-only">Episódio {ep.number}: </span>
                    {ep.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-500">
                    <time dateTime={ep.publishDate}>
                      {new Date(`${ep.publishDate}T12:00:00`).toLocaleDateString(
                        "pt-BR",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </time>
                    <span aria-hidden> · </span>
                    <span className="sr-only">Duração: </span>
                    <span>{formatDuration(ep.durationSeconds)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 md:pl-4">
                <SpotifyEmbed
                  spotifyId={ep.spotifyId}
                  title={ep.title}
                  label="Ouvir aqui"
                />
                <a
                  href={spotifyEpisodeUrl(ep)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-gray-500 underline underline-offset-4 hover:text-[#121212] transition-colors"
                >
                  Abrir no Spotify
                  <span className="sr-only"> — episódio {ep.number}, {ep.title}</span>
                </a>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
