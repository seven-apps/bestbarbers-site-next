/**
 * BestBarbers Podcast — dados das temporadas, links do Spotify e atribuição.
 *
 * FONTE DE VERDADE DESTE ARQUIVO: o que está PUBLICADO no Spotify, medido ao vivo
 * (oEmbed + meta music:duration em open.spotify.com/episode/<id>) em 01/Set/2026.
 * Título e duração aqui são cópia do que o ouvinte vai encontrar no player — não do
 * roteiro. O planejamento (os/data/podcast/seasons.json no repo do OS) diverge de
 * propósito: lá são rascunhos, aqui é o que está no ar.
 *
 * DESCRIÇÕES: também medidas ao vivo, em 01/Set/2026. Elas NÃO estão no
 * `og:description` (esse devolve o genérico "BestBarbers Podcast · Episode" nos 12);
 * estão no `<meta name="description">`, que o Spotify só serve para user-agent de
 * crawler. O texto passa pela limpeza determinística de
 * scripts/podcast/spotify-descriptions.mjs — que tira o link auto-referente
 * bestbarbers.app/podcast (ruído: o leitor já está no destino), os CTAs de "clique
 * no link", o convite a tocar ("dê o play" — desde 01/Set/2026 não existe player
 * nesta página, quem toca é o Spotify), a pergunta-CTA de fecho ("Quer descobrir
 * como…?", que no Spotify vem seguida de um link e aqui pediria sem destino) e a
 * duração declarada no texto (errada em 6 dos 9 episódios que a declaram). Os textos
 * gravados abaixo são exatamente o que a limpeza devolve — regerar não os desfaz.
 * Para conferir se o SSOT ainda bate com o Spotify:
 *   node scripts/podcast/spotify-descriptions.mjs --check
 *
 * REGRA DURA: episódio sem `spotifyId` NÃO é renderizado na página /podcast.
 * Ao publicar um episódio novo, medir o ID e a duração no Spotify antes de incluir —
 * e gerar o `shareUrl` (o "Copiar link" do próprio Spotify) no mesmo passo.
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
  /**
   * Smartlink de compartilhamento do episódio — a URL que o próprio Spotify gera
   * no "Copiar link" (`?si=<token>`). É ELA que a página serve nos cliques, porque
   * é o formato que o Spotify reconhece como compartilhamento: abre no aplicativo
   * quando ele está instalado (em vez de prender a pessoa no navegador) e credita
   * a escuta na conta de quem clicou — que é o ponto todo de mandar para lá em vez
   * de tocar num embed (embed não move play/stream/listener no painel do Spotify).
   * Gerado em 01/Set/2026; ausente, `spotifyEpisodeShareUrl()` cai na URL limpa.
   */
  shareUrl?: string;
  /** Duração real do áudio em segundos (meta music:duration do Spotify). */
  durationSeconds: number;
  /**
   * Resumo do episódio para a listagem — o texto publicado no Spotify, limpo e
   * cortado em fronteira de frase (≤ 300 caracteres). É o que o card mostra.
   */
  description: string;
  /**
   * Texto publicado completo, limpo. Só existe quando o episódio tem descrição
   * longa no Spotify (EP1, 2, 4 e 5); nos demais o resumo já é o texto inteiro.
   * Use `episodeDescriptionFull()` em vez de ler este campo direto.
   */
  descriptionFull?: string;
}

/** Descrição completa do episódio — cai no resumo quando não há versão longa. */
export function episodeDescriptionFull(episode: PodcastEpisode): string {
  return episode.descriptionFull ?? episode.description;
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
      shareUrl: "https://open.spotify.com/episode/0z4AMIzVdeWxE0ceLdJNrv?si=eIMk8U_gTCecfRtpebD06w",
      durationSeconds: 802,
      description: "Quando você ouve falar de clube de assinatura, a primeira imagem que vem à sua cabeça é um combo com desconto? Se a resposta for sim, você corre o risco de fazer parte dos 90% dos donos de negócio que tentam implementar esse modelo e falham.",
      descriptionFull: "Quando você ouve falar de clube de assinatura, a primeira imagem que vem à sua cabeça é um combo com desconto? Se a resposta for sim, você corre o risco de fazer parte dos 90% dos donos de negócio que tentam implementar esse modelo e falham. Repete comigo: clube não é desconto, é arquitetura financeira. É a ferramenta definitiva para redesenhar a entrada de dinheiro no seu caixa e garantir previsibilidade antes mesmo de abrir as portas no dia primeiro. Neste episódio de estreia da série Assinatura do Zero, você vai descobrir como parar de começar o mês no zero absoluto e entender o reframe que faz você dobrar o ticket médio do mesmo cliente utilizando a frequência correta. Você vai sair deste áudio com 4 perguntas práticas para calcular, em números reais, quanta receita recorrente a sua barbearia está deixando de ganhar todos os meses.",
    },
    {
      number: 2,
      title: "Os três ciclos do dinheiro na barbearia",
      publishDate: "2026-06-22",
      spotifyId: "4TWCXe8NNMFny2aUMyY5dQ",
      shareUrl: "https://open.spotify.com/episode/4TWCXe8NNMFny2aUMyY5dQ?si=-WG0u0kISuiUzldS7UJB7A",
      durationSeconds: 709,
      description: "Neste episódio vai abrir seus olhos para a realidade estrutural do seu negócio. Existem três tipos de barbearia no Brasil hoje: a que vive em uma eterna montanha-russa, a que consegue subir alguns degraus e a que opera com receita garantida na conta antes mesmo do primeiro cliente entrar pela porta.",
      descriptionFull: "Neste episódio vai abrir seus olhos para a realidade estrutural do seu negócio. Existem três tipos de barbearia no Brasil hoje: a que vive em uma eterna montanha-russa, a que consegue subir alguns degraus e a que opera com receita garantida na conta antes mesmo do primeiro cliente entrar pela porta. Neste segundo episódio da série Assinatura do Zero, você vai descobrir exatamente onde sua barbearia está localizada nesse mapa e o que fazer para mudar de nível. O Diagnóstico dos 3 Ciclos: Entenda detalhadamente o funcionamento da Montanha-russa, da Escada e da Receita Garantida. O Teste das 3 Perguntas: Um método rápido e realista para avaliar seu extrato bancário, seu percentual de recorrência e a real segurança da sua empresa. O Custo Oculto da Inércia: Saiba por que uma barbearia tradicional de 4 cadeiras chega a perder, em média, R$ 95 mil por ano apenas por adiar a profissionalização. O Caminho de 6 Meses: O plano de ação prático e replicável para estruturar, lançar e estabilizar seu próprio clube de assinatura na cadeira. Pare de tomar decisões olhando apenas para o caixa do dia e comece a olhar para o ano inteiro.",
    },
    {
      number: 3,
      title: "A Frequência REAL do Cliente Assinatura",
      publishDate: "2026-06-29",
      spotifyId: "4xRX27SDxqHTNIp2dK8phs",
      shareUrl: "https://open.spotify.com/episode/4xRX27SDxqHTNIp2dK8phs?si=ldE8Xi0jSNKZgBiomJsSJQ",
      durationSeconds: 701,
      description: "O maior medo do clube ilimitado é falso. Os dados de 1.200 barbearias sobre frequência real do assinante e os 3 mecanismos que controlam abuso de verdade.",
    },
    {
      number: 4,
      title: "Como o cliente avulso vira assinante",
      publishDate: "2026-07-06",
      spotifyId: "5A2STZ3WOzXHgpYJIMjkK7",
      shareUrl: "https://open.spotify.com/episode/5A2STZ3WOzXHgpYJIMjkK7?si=FJE612KNRy6T6W_MnfIvKQ",
      durationSeconds: 647,
      description: "A Máquina de Vendas Está na Sua Cadeira. O Script de 3 Frases: A abordagem exata e natural que o barbeiro usa no fim do corte para colocar o plano na mesa, sem parecer uma venda agressiva.",
      descriptionFull: "A Máquina de Vendas Está na Sua Cadeira. O Script de 3 Frases: A abordagem exata e natural que o barbeiro usa no fim do corte para colocar o plano na mesa, sem parecer uma venda agressiva. O Fluxo Digital sem Papel: Por que puxar uma ficha física faz você perder a venda na hora e como fechar o plano pelo celular em poucos segundos. Comissão que Engaja: As duas formas padrão de comissionar o seu time para que os barbeiros vendam o clube com gosto. Os 3 Indicadores Cruciais: Como medir a conversão por profissional, o ganho real de ticket médio e o tempo que o cliente leva para virar assinante. O maior canal de vendas do seu clube de assinatura não é o Instagram, não é o tráfego pago e muito menos a indicação. O seu maior vendedor está na sua frente agora: é o cliente sentado na cadeira, esperando o acabamento do pezinho. Sabia que 80% das assinaturas de sucesso acontecem exatamente nesse momento? O problema é que quase nenhuma barbearia tem um processo desenhado para isso. Revelamos o passo a passo prático para transformar o atendimento comum em uma máquina de receita previsível. O que você vai aprender neste episódio: Pare de tentar vender o seu clube apenas pelas telas do celular. Descubra como usar a afinidade, a proximidade e o momento perfeito da cadeira para faturar mais.",
    },
    {
      number: 5,
      title: "Ilimitado ou limitado: por onde começar",
      publishDate: "2026-07-13",
      spotifyId: "4X1AHlqklUQKgQpcXyzkYO",
      shareUrl: "https://open.spotify.com/episode/4X1AHlqklUQKgQpcXyzkYO?si=oi3LztTDSt-MsBieLLgqMg",
      durationSeconds: 689,
      description: "Lançar plano limitado ou ilimitado? Cobrar o preço equivalente a dois ou três cortes avulsos no clube de assinatura? No episódio 5 da série Assinatura do Zero, nós desmistificamos o maior medo dos donos de barbearia: a matemática por trás do modelo ilimitado.",
      descriptionFull: "Lançar plano limitado ou ilimitado? Cobrar o preço equivalente a dois ou três cortes avulsos no clube de assinatura? No episódio 5 da série Assinatura do Zero, nós desmistificamos o maior medo dos donos de barbearia: a matemática por trás do modelo ilimitado. Você vai descobrir por que limitar o seu clube a 4 acessos por mês é um erro psicológico que pode reduzir a sua conversão de vendas em até 60%, transformando o que deveria ser uma decisão de desejo em uma equação complicada na cabeça do seu cliente. Entenda de uma vez por todas a Regra dos Dois Cortes, a tabela de precificação exata para o seu modelo de negócio e o comportamento real do cliente brasileiro que prova por que o modelo ilimitado é seguro, lucrativo e blinda o seu caixa.",
    },
    {
      number: 6,
      title: "Quanto cobrar sem matar a margem",
      publishDate: "2026-07-20",
      spotifyId: "0pnZ6K3XkoMigYXZZsa5UV",
      shareUrl: "https://open.spotify.com/episode/0pnZ6K3XkoMigYXZZsa5UV?si=fvKzsIU7TSCVVQjrGn8F3g",
      durationSeconds: 806,
      description: "Você não precifica assinatura olhando o corte. Olha a barbearia inteira. Os 5 dados que definem o preço certo e o erro que custa R$95 mil por ano.",
    },
    {
      number: 7,
      title: "A conta do barbeiro: ele ganha mais?",
      publishDate: "2026-07-27",
      spotifyId: "2dfLtRIt7exZBoIufnxESD",
      shareUrl: "https://open.spotify.com/episode/2dfLtRIt7exZBoIufnxESD?si=wuMHRp6DRtO05R6EsqK2zw",
      durationSeconds: 785,
      // EXCEÇÃO DECLARADA — a descrição publicada deste episódio no Spotify está
      // errada: é uma cópia levemente editada da descrição do EP6 e fala de
      // PRECIFICAÇÃO, não do ganho do barbeiro. Enquanto o Spotify não for
      // corrigido, o texto abaixo vem do planejamento (seasons.json, EP7 da
      // t01-clube), ancorado em "+83% de ganho médio do barbeiro em 6 meses".
      // A exceção está registrada em scripts/podcast/spotify-descriptions.mjs
      // (OVERRIDES) — corrigido o Spotify, apague lá e rode o script de novo.
      description: "O dia que você anuncia clube, sua equipe vai dizer 'vou ganhar menos'. A conta que você apresenta para mostrar que o ganho mensal sobe 83%.",
    },
    {
      number: 8,
      title: "Distribuindo comissão sem briga",
      publishDate: "2026-08-03",
      spotifyId: "5wSnqMKVK5cd8jujtZoxny",
      shareUrl: "https://open.spotify.com/episode/5wSnqMKVK5cd8jujtZoxny?si=oMBfw1wFQUCHVaV8XLytjg",
      durationSeconds: 796,
      description: "Você lançou o clube de assinatura e agora precisa dividir a comissão entre 5 barbeiros sem virar briga. A regra do pote, a tabela de fichas e o exemplo numérico completo.",
    },
    {
      number: 9,
      title: "Como vender o clube no balcão",
      publishDate: "2026-08-10",
      spotifyId: "21RU7CnMBt0AS4wIyNFonX",
      shareUrl: "https://open.spotify.com/episode/21RU7CnMBt0AS4wIyNFonX?si=s0dERhU8QsKJNTIutRRTpw",
      durationSeconds: 903,
      description: "Em 60 dias, dá para construir lista de espera com 380 pessoas e vender 60 assinaturas em 48h. O cronograma completo de pré-venda, o lançamento e os 3 lotes.",
    },
    {
      number: 10,
      title: "Os três pontos que travam o clube de assinatura",
      publishDate: "2026-08-17",
      spotifyId: "2jQc0qsWxDx5kWCEs44v2D",
      shareUrl: "https://open.spotify.com/episode/2jQc0qsWxDx5kWCEs44v2D?si=ivc3Puu-TOG3fFxOcihtOQ",
      durationSeconds: 973,
      description: "Três decisões estruturais matam clube de assinatura nos primeiros 6 meses. Quais são, como evitar e o cálculo correto de custo fixo que ninguém te conta.",
    },
    {
      number: 11,
      title: "O ponto mais importante sobre assinatura que ninguém te conta",
      publishDate: "2026-08-24",
      spotifyId: "1uldtxHE2Uvhf8ymye5fQV",
      shareUrl: "https://open.spotify.com/episode/1uldtxHE2Uvhf8ymye5fQV?si=fJmmQqDmTHGLMRuWkAnaxQ",
      durationSeconds: 851,
      description: "Quatro decisões separam quem cresce 2,5x de quem cresce 15% em 12 meses. Os 4 pilares inegociáveis e os 7 indicadores que precisam estar abertos toda manhã.",
    },
    {
      number: 12,
      title: "Do zero aos primeiros 100 assinantes",
      publishDate: "2026-08-31",
      spotifyId: "2MSpYislZ5pHDJJTwbQEKr",
      shareUrl: "https://open.spotify.com/episode/2MSpYislZ5pHDJJTwbQEKr?si=y1sIhAM7Q5Gb9scEX3cz4g",
      durationSeconds: 782,
      description: "Episódio final: Roadmap consolidado dos primeiros 100 assinantes em 12 meses + case real de uma barbearia 4 cadeiras que saiu de R$15.892 para R$31.690/mês.",
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

/**
 * URL canônica do episódio no Spotify, sem token de sessão.
 * Uso: JSON-LD e qualquer lugar que precise do endereço estável do episódio.
 * Para link clicável na página use `spotifyEpisodeShareUrl()`.
 */
export function spotifyEpisodeUrl(episode: PodcastEpisode): string {
  return `https://open.spotify.com/episode/${episode.spotifyId}`;
}

/**
 * Destino dos cliques da página: o smartlink do episódio quando existe, a URL
 * canônica quando não (episódio novo ainda sem link gerado nunca fica sem destino).
 */
export function spotifyEpisodeShareUrl(episode: PodcastEpisode): string {
  return episode.shareUrl ?? spotifyEpisodeUrl(episode);
}

/** URL pública do programa no Spotify — destino dos selos da marca na página. */
export function spotifyShowUrl(): string {
  return `https://open.spotify.com/show/${PODCAST_SHOW_ID}`;
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
