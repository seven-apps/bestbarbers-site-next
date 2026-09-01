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
 * verdade.
 *
 * ONDE ISTO APARECE (01/Set/2026): o cartão "A temporada em quatro blocos" saiu do
 * hero a pedido do André — ele empurrava a listagem para 2,5 telas de rolagem no
 * celular. Os blocos não morreram: viraram os cabeçalhos dos quatro trechos da
 * própria lista de episódios (EpisodeList), onde orientam a leitura corrida em vez
 * de disputar espaço com ela.
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

/* `blockOfEpisode()` morava aqui e servia à segunda linha de cada episódio ("O
   conceito · 15 jun 2026 · 13:22"). Com o bloco virando cabeçalho de trecho da
   lista, repetir o nome dele em toda linha era ruído — e a linha ganhou de volta a
   largura que ele consumia. Quem reparte os episódios agora é `groupByBlock()`,
   em EpisodeList, direto sobre `seasonBlocks`. */

/** Duração somada dos episódios no ar, em minutos inteiros (arredondado para baixo). */
export const seasonTotalMinutes: number = Math.floor(
  publishedEpisodes.reduce((total, ep) => total + ep.durationSeconds, 0) / 60
);
