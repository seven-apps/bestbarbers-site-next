/**
 * BestBarbers Podcast — dados das temporadas, links do Spotify e atribuição.
 *
 * FONTE DE VERDADE DESTE ARQUIVO: o que está PUBLICADO no Spotify, medido ao vivo
 * (oEmbed + meta music:duration em open.spotify.com/episode/<id>) em 01/Set/2026.
 * Título e duração aqui são cópia do que o ouvinte vai encontrar no player — não do
 * roteiro. O planejamento (os/data/podcast/seasons.json no repo do OS) diverge de
 * propósito: lá são rascunhos, aqui é o que está no ar.
 *
 * REGRA DURA: episódio sem `spotifyId` NÃO é renderizado na página /podcast.
 * Ao publicar um episódio novo, medir o ID e a duração no Spotify antes de incluir.
 *
 * Links divulgados no Spotify usam código curto: /podcast?desc=<temporada>.<episodio>
 * (ex: /podcast?desc=1.3 → Temporada 1, Episódio 3). O código vira a descrição
 * legível enviada ao Ploomes junto da origem "Site - Podcast".
 */

// Origem no Ploomes: "Site - Podcast" (120001484, criada em 12/Jun/2026) —
// mapeada em useUtmParams.originMap via source=podcast.

export const PODCAST_SHOW_NAME = "BestBarbers Podcast";

/** Show no Spotify (verificado: /show/<id> e /embed/show/<id> respondem 200). */
export const PODCAST_SHOW_ID = "4ZsRrxtwDm3LHyijPX5NJ5";

export interface PodcastEpisode {
  number: number;
  /** Título EXATO como está publicado no Spotify (sem o prefixo "Episódio N - "). */
  title: string;
  /** Data de publicação no Spotify (YYYY-MM-DD) */
  publishDate: string;
  /** ID do episódio no Spotify. Sem ele, o episódio não vai para a página. */
  spotifyId: string;
  /** Duração real do áudio em segundos (meta music:duration do Spotify). */
  durationSeconds: number;
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
    {
      number: 1,
      title: "Clube de Assinatura não é desconto",
      publishDate: "2026-06-15",
      spotifyId: "0z4AMIzVdeWxE0ceLdJNrv",
      durationSeconds: 802,
    },
    {
      number: 2,
      title: "Os três ciclos do dinheiro na barbearia",
      publishDate: "2026-06-22",
      spotifyId: "4TWCXe8NNMFny2aUMyY5dQ",
      durationSeconds: 709,
    },
    {
      number: 3,
      title: "A Frequência REAL do Cliente Assinatura",
      publishDate: "2026-06-29",
      spotifyId: "4xRX27SDxqHTNIp2dK8phs",
      durationSeconds: 701,
    },
    {
      number: 4,
      title: "Como o cliente avulso vira assinante",
      publishDate: "2026-07-06",
      spotifyId: "5A2STZ3WOzXHgpYJIMjkK7",
      durationSeconds: 647,
    },
    {
      number: 5,
      title: "Ilimitado ou limitado: por onde começar",
      publishDate: "2026-07-13",
      spotifyId: "4X1AHlqklUQKgQpcXyzkYO",
      durationSeconds: 689,
    },
    {
      number: 6,
      title: "Quanto cobrar sem matar a margem",
      publishDate: "2026-07-20",
      spotifyId: "0pnZ6K3XkoMigYXZZsa5UV",
      durationSeconds: 806,
    },
    {
      number: 7,
      title: "A conta do barbeiro: ele ganha mais?",
      publishDate: "2026-07-27",
      spotifyId: "2dfLtRIt7exZBoIufnxESD",
      durationSeconds: 785,
    },
    {
      number: 8,
      title: "Distribuindo comissão sem briga",
      publishDate: "2026-08-03",
      spotifyId: "5wSnqMKVK5cd8jujtZoxny",
      durationSeconds: 796,
    },
    {
      number: 9,
      title: "Como vender o clube no balcão",
      publishDate: "2026-08-10",
      spotifyId: "21RU7CnMBt0AS4wIyNFonX",
      durationSeconds: 903,
    },
    {
      number: 10,
      title: "Os três pontos que travam o clube de assinatura",
      publishDate: "2026-08-17",
      spotifyId: "2jQc0qsWxDx5kWCEs44v2D",
      durationSeconds: 973,
    },
    {
      number: 11,
      title: "O ponto mais importante sobre assinatura que ninguém te conta",
      publishDate: "2026-08-24",
      spotifyId: "1uldtxHE2Uvhf8ymye5fQV",
      durationSeconds: 851,
    },
    {
      number: 12,
      title: "Do zero aos primeiros 100 assinantes",
      publishDate: "2026-08-31",
      spotifyId: "2MSpYislZ5pHDJJTwbQEKr",
      durationSeconds: 782,
    },
  ],
};

export const seasons: PodcastSeason[] = [currentSeason];

/**
 * Episódios que podem ir para a tela: só os que têm ID de Spotify medido.
 * É este array (nunca `currentSeason.episodes` cru) que a página renderiza.
 */
export const publishedEpisodes: PodcastEpisode[] = currentSeason.episodes.filter(
  (e) => e.spotifyId.length > 0
);

/** URL pública do episódio no Spotify. */
export function spotifyEpisodeUrl(episode: PodcastEpisode): string {
  return `https://open.spotify.com/episode/${episode.spotifyId}`;
}

/** URL do player embutível (iframe compacto, 152px de altura). */
export function spotifyEmbedUrl(episode: PodcastEpisode): string {
  return `https://open.spotify.com/embed/episode/${episode.spotifyId}`;
}

/** 802 → "13:22" */
export function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

/** 802 → "PT13M22S" (ISO 8601, para o JSON-LD) */
export function isoDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `PT${min}M${sec}S`;
}

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
 * Com episódio: "Assinatura do Zero - EP03 - A Frequência REAL do Cliente Assinatura"
 * Sem código (link do show): "BestBarbers Podcast - Assinatura do Zero"
 */
export function podcastOriginDesc(code: string | null | undefined): string {
  const decoded = decodeEpisodeCode(code);
  if (!decoded) return `${PODCAST_SHOW_NAME} - ${currentSeason.name}`;
  const ep = String(decoded.episode.number).padStart(2, "0");
  return `${decoded.season.name} - EP${ep} - ${decoded.episode.title}`;
}
