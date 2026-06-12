/**
 * BestBarbers Podcast — dados das temporadas e atribuição.
 *
 * Links divulgados no Spotify usam código curto: /podcast?desc=<temporada>.<episodio>
 * (ex: /podcast?desc=1.3 → Temporada 1, Episódio 3). O código vira a descrição
 * legível enviada ao Ploomes junto da origem "Site - Podcast".
 */

// Origem no Ploomes: "Site - Podcast" (120001484, criada em 12/Jun/2026) —
// mapeada em useUtmParams.originMap via source=podcast.

export const PODCAST_SHOW_NAME = "BestBarbers Podcast";

export interface PodcastEpisode {
  number: number;
  title: string;
  /** Data de publicação no Spotify (YYYY-MM-DD) */
  publishDate: string;
}

export interface PodcastSeason {
  number: number;
  name: string;
  subtitle: string;
  episodes: PodcastEpisode[];
}

export const currentSeason: PodcastSeason = {
  number: 1,
  name: "Assinatura do Zero",
  subtitle:
    "12 episódios para montar, precificar, vender e gerir o clube de assinaturas da sua barbearia.",
  episodes: [
    { number: 1, title: "Assinatura não é desconto", publishDate: "2026-06-15" },
    { number: 2, title: "Os 3 ciclos do dinheiro na barbearia", publishDate: "2026-06-22" },
    { number: 3, title: "A frequência real do cliente", publishDate: "2026-06-29" },
    { number: 4, title: "Como o cliente avulso vira assinante", publishDate: "2026-07-06" },
    { number: 5, title: "Ilimitado ou limitado: por onde começar", publishDate: "2026-07-13" },
    { number: 6, title: "Quanto cobrar sem matar a margem", publishDate: "2026-07-20" },
    { number: 7, title: "A conta do barbeiro: ele ganha mais?", publishDate: "2026-07-27" },
    { number: 8, title: "Distribuindo comissão sem briga", publishDate: "2026-08-03" },
    { number: 9, title: "Como vender o clube no balcão", publishDate: "2026-08-10" },
    { number: 10, title: "Os três pontos que travam o clube", publishDate: "2026-08-17" },
    { number: 11, title: "O ponto mais importante que ninguém te conta", publishDate: "2026-08-24" },
    { number: 12, title: "Do zero aos primeiros 100 assinantes", publishDate: "2026-08-31" },
  ],
};

export const seasons: PodcastSeason[] = [currentSeason];

/** Decodifica "1.3" → { season, episode }. Retorna null se o código for inválido. */
export function decodeEpisodeCode(
  code: string | null | undefined
): { season: PodcastSeason; episode: PodcastEpisode } | null {
  if (!code) return null;
  const match = code.trim().match(/^(\d+)\.(\d+)$/);
  if (!match) return null;
  const season = seasons.find((s) => s.number === Number(match[1]));
  const episode = season?.episodes.find((e) => e.number === Number(match[2]));
  if (!season || !episode) return null;
  return { season, episode };
}

/**
 * Descrição de origem para o Ploomes a partir do código do link.
 * Com episódio: "Assinatura do Zero - EP03 - A frequência real do cliente"
 * Sem código (link do show): "BestBarbers Podcast - Assinatura do Zero"
 */
export function podcastOriginDesc(code: string | null | undefined): string {
  const decoded = decodeEpisodeCode(code);
  if (!decoded) return `${PODCAST_SHOW_NAME} - ${currentSeason.name}`;
  const ep = String(decoded.episode.number).padStart(2, "0");
  return `${decoded.season.name} - EP${ep} - ${decoded.episode.title}`;
}
