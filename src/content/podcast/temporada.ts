/**
 * Material de APRESENTAÇÃO da temporada — o que a página /podcast usa para montar
 * a listagem e o hero, e que NÃO é dado do Spotify.
 *
 * Fica separado de src/content/podcast/index.ts de propósito: aquele arquivo é o
 * SSOT medido ao vivo no Spotify (título, data, ID e duração) e não se mistura com
 * texto editorial nosso. Aqui mora só o que a BestBarbers escreveu ou mediu por
 * fora do catálogo do Spotify.
 *
 * CAPA — medida em 01/Set/2026: o oEmbed dos 12 episódios devolve 12 URLs
 * DIFERENTES (hashes distintos em image-cdn-{ak,fa}.spotifycdn.com), mas as 12
 * imagens são BYTE A BYTE IDÊNTICAS (md5 0071f8f4…, 300×300, 22.895 bytes). Ou
 * seja: não existe arte por episódio — existe uma arte só, a da temporada. Por isso
 * a página serve UM arquivo local em vez de fazer 12 hotlinks para o CDN do Spotify
 * (que rotaciona hash sem aviso). O arquivo em public/ é essa mesma arte
 * redimensionada para 192×192 (12,7 KB), tamanho suficiente para o maior slot da
 * tela (64 px em telas 3×).
 */

import { publishedEpisodes } from "@/content/podcast";

/** Arte da temporada, servida da nossa origem (nada de hotlink no CDN do Spotify). */
export const SEASON_COVER = {
  src: "/podcast/capa-assinatura-do-zero.jpg",
  width: 192,
  height: 192,
  alt: "Capa da temporada Assinatura do Zero, do BestBarbers Podcast",
} as const;

export interface SeasonBlock {
  /** Rótulo humano da faixa, como aparece no hero. */
  range: string;
  title: string;
  text: string;
  /** Primeiro e último episódio da faixa (inclusive) — é daqui que sai o rótulo da linha. */
  from: number;
  to: number;
}

/**
 * O roteiro da temporada em quatro blocos — classificação nossa, declarada.
 *
 * CORREÇÃO (01/Set/2026): este comentário dizia que "o Spotify não devolve descrição
 * por episódio, o og:description dos 12 volta o genérico 'BestBarbers Podcast ·
 * Episode'". A primeira metade era falsa. O og:description realmente volta genérico,
 * mas a descrição real de cada episódio está no `<meta name="description">`, servido
 * só para user-agent de crawler. Os 12 textos foram medidos e agora vivem no campo
 * `description` de src/content/podcast/index.ts — a listagem usa a descrição de
 * verdade, e o bloco continua disponível apenas como rótulo de seção.
 */
export const seasonBlocks: SeasonBlock[] = [
  {
    range: "Episódios 1 a 3",
    title: "O conceito",
    text: "Por que clube não é desconto, os três ciclos do dinheiro na barbearia e a frequência real de quem assina.",
    from: 1,
    to: 3,
  },
  {
    range: "Episódios 4 e 5",
    title: "O desenho do plano",
    text: "Como o cliente avulso vira assinante e por onde começar a montar o plano.",
    from: 4,
    to: 5,
  },
  {
    range: "Episódios 6 a 8",
    title: "A conta",
    text: "Quanto cobrar sem matar a margem, o que muda no bolso do barbeiro e como distribuir comissão sem briga.",
    from: 6,
    to: 8,
  },
  {
    range: "Episódios 9 a 12",
    title: "A venda e a operação",
    text: "Vender o clube no balcão, destravar o que emperra e chegar aos primeiros 100 assinantes.",
    from: 9,
    to: 12,
  },
];

/** Bloco a que o episódio pertence — `undefined` se ele cair fora das faixas. */
export function blockOfEpisode(episodeNumber: number): SeasonBlock | undefined {
  return seasonBlocks.find(
    (b) => episodeNumber >= b.from && episodeNumber <= b.to
  );
}

/** Duração somada dos episódios no ar, em minutos inteiros (arredondado para baixo). */
export const seasonTotalMinutes: number = Math.floor(
  publishedEpisodes.reduce((total, ep) => total + ep.durationSeconds, 0) / 60
);
