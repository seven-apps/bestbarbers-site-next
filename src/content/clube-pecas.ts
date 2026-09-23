/**
 * /clube/[peca] — O TEXTO DAS 11 PÁGINAS POR ANÚNCIO. Um template, onze objetos.
 *
 * Plano: bestbarbers-ai/docs/operacional/plano-v3-maquina-vendas/
 * 36-ARQUITETURA-TOPO-MEIO-E-PAGINAS-2026-09-23.md §4.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * A REGRA QUE FAZ ISTO FUNCIONAR: MESSAGE MATCH
 * ────────────────────────────────────────────────────────────────────────────
 * A primeira dobra REPETE a promessa do anúncio, quase literalmente. Quem clicou em
 * «o cartão recusou e a cobrança parou ali» tem que ler essa frase ao chegar. Por
 * isso cada peça carrega `anuncio.frase` — o trecho LITERAL do anúncio — e o teste
 * `clube-pecas.test.ts` recusa página cujo título não contenha essa frase.
 * Mudou o anúncio? Muda a `frase` e o título juntos, ou o teste para o deploy.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * O QUE ESTE ARQUIVO NÃO TEM (e o teste cobra)
 * ────────────────────────────────────────────────────────────────────────────
 *  - PORTA: mora em `lib/tracking/portas-clube.ts` (o pixel precisa dela em todo o
 *    site; este texto não). O tipo `SlugClube` amarra os dois.
 *  - NÚMERO DE ESCALA DIGITADO: «1.200+» e «51.000+» entram por token
 *    (`{barbearias}`, `{assinantes}`) e saem de `lib/numeros-oficiais.ts`.
 *  - ORIGEM DO PLOOMES: é do `useUtmParams`, dentro do formulário — nunca daqui.
 *  - PREÇO: a única menção é a nota do herói da família («A partir de R$299»).
 *  - NOME de cliente, parceiro ou concorrente — nem nas páginas dos vídeos de
 *    parceiro. O vídeo já mostra a pessoa; a página fala do mecanismo.
 *  - Número de tentativas ou prazo da retentativa, promessa de resultado
 *    («zero inadimplência», «garantido»), «100% automática» (ADENDO-LASTRO A2).
 *
 * O resto da página (demonstração, como funciona, comparativo, objeções, números,
 * condições, formulário, FAQ geral) é o da família `/projeto-do-clube`, pela
 * situação que a porta implica — ver `configDaPaginaClube`.
 *
 * Fontes do texto de cada anúncio:
 *  - ESTÁTICOS: bestbarbers-ai/docs/operacional/plano-v3-maquina-vendas/
 *    criativos-funil-clube/06-OITO-ESTATICOS-TEXTO-FINAL-2026-09-23.md — o SSOT do
 *    texto que foi para a arte (NÃO o 05, que são as 32 hipóteses dos autores).
 *    A `frase` de cada página é a headline do estático, literal; `kicker` e `cta` também
 *    são literais da arte vigente (`l8-cena-r2/`, revisada em 23/Set).
 *  - Vídeos: transcrições em bestbarbers-ai/output/trafego-pago/transcricoes/ —
 *    transcrição AUTOMÁTICA do original; conferir contra o corte que vai ao ar
 *    (cap. 36 §11, item 8). Por isso as quatro levam `conferir`.
 */

import type {
  PcArtefatoId,
  PcPaginaConfig,
  PcPeca,
  PcSituacao,
} from "../app/projeto-do-clube/_components/pc.types.ts";
import type { Porta } from "../lib/tracking/porta.ts";
import { PORTAS_CLUBE, type SlugClube } from "../lib/tracking/portas-clube.ts";
import { comNumerosOficiais } from "../lib/numeros-oficiais.ts";

/** Ids das telas animadas de `src/app/clube/_clube/telas.tsx` (o teste confere que existem). */
export type TelaClubeId =
  | "plano-regra"
  | "cobrancas-hoje"
  | "calendario-dia1"
  | "trilha-recusa"
  | "comissao"
  | "app-marca"
  | "resumo-assinantes"
  | "dois-sistemas"
  | "agenda-bloqueio"
  | "previsao-mes"
  | "jornada-assinante";

export interface ConteudoPecaClube {
  /** Nome curto do conceito, para quem lê o código e o Events Manager. */
  conceito: string;
  anuncio: {
    /** Onde está o texto do anúncio. */
    fonte: string;
    /** Trecho LITERAL do anúncio que a primeira dobra tem que repetir. */
    frase: string;
    /** Selo do estático, literal (vira o selo do herói). Só estáticos. */
    kicker?: string;
    /** Botão do estático, literal (vira o botão principal do herói). Só estáticos. */
    cta?: string;
    /** Trechos da headline que a arte pinta de dourado — a página pinta os mesmos. */
    destaque?: readonly string[];
  };
  /** Primeira dobra: título (contém `anuncio.frase`) e apoio. */
  titulo: string;
  apoio: string;
  /** Botão principal do herói quando o anúncio não tem CTA escrito (vídeos). */
  botaoPrincipal?: string;
  /** A prova específica DESTA promessa (bloco «O seu caso»). */
  prova: { titulo: string; texto: string };
  /** Pergunta em destaque no FAQ — a objeção que a promessa desperta. */
  faq: { pergunta: string; resposta: string };
  /**
   * A tela do sistema que prova ESTA promessa, no herói (id de `pc-artefatos.ts`).
   * Ausente = a tela padrão da situação. As telas são recriações fiéis do painel com
   * dados fictícios — a captura real traz cliente, faturamento e taxas.
   */
  tela?: PcArtefatoId;
  /**
   * Cor de atmosfera do herói: a média da cena da arte (`exportar-web.ts` imprime), usada a
   * ~10% atrás do texto. A marca fica fixa; só a luz de fundo muda por página.
   */
  atmosfera: string;
  /** A tela do sistema, em HTML animado, que prova a promessa (`_clube/telas.tsx`). */
  telaProva: TelaClubeId;
  /** Os 3 passos do mecanismo, empilhados ao lado da tela. Uma frase cada. */
  passos: readonly [string, string, string];
  /** Três pares «hoje × com a BestBarbers», escolhidos para ESTA promessa. */
  antesDepois: readonly { hoje: string; com: string }[];
  /** Pendência antes de o anúncio apontar para cá. Ausente = pronta. */
  conferir?: string;
}

const CONFERIR_VIDEO =
  "O texto do anúncio vem da transcrição automática do vídeo original. Conferir a frase contra o corte que vai ao ar (cap. 36 §11, item 8) antes de ligar o anúncio a esta página.";

export const CONTEUDO_CLUBE: Record<SlugClube, ConteudoPecaClube> = {
  // ─────────────────────────────── TOPO ───────────────────────────────
  "plano-com-regra": {
    conceito: "Medo do ilimitado",
    atmosfera: "#3f2910",
    telaProva: "plano-regra",
    passos: [
      "Você cadastra o plano com os dias em que ele vale — de segunda a quarta, por exemplo.",
      "Liga o limite de utilização: quantas vezes o assinante usa no mês.",
      "O assinante agenda pelo app dentro dessa regra; quem atrasou fica bloqueado.",
    ],
    antesDepois: [
      { hoje: "Plano sem regra: o assinante corta toda semana e ocupa a sexta.", com: "Plano de segunda a quarta: a sexta fica livre para o avulso." },
      { hoje: "Você explica a regra no balcão, cliente por cliente.", com: "A regra está no plano, e o app só agenda dentro dela." },
      { hoje: "Quem atrasou continua marcando horário.", com: "Quem atrasou fica bloqueado para agendar." },
    ],
    tela: "clube-plano-regra",
    anuncio: {
      fonte: "06 · t1 · COPY 3 do André (MEDO DO ILIMITADO)",
      frase: "E se o cliente pagar a assinatura e vier cortar toda semana?",
      kicker: "Plano com regra",
      cta: "Ver como configurar o plano",
      destaque: ["toda semana"],
    },
    titulo: "E se o cliente pagar a assinatura e vier cortar toda semana?",
    apoio:
      "O maior erro é vender assinatura sem regras e sem trava de agendamento no sistema. Crie planos limitados de segunda a quarta, por exemplo, e configure as regras de agendamento com a BestBarbers.",
    prova: {
      titulo: "A regra fica no plano, não na sua memória",
      texto:
        "Na BestBarbers você cadastra o plano com os dias em que ele vale e o limite de utilização no mês. O assinante agenda pelo app dentro dessa regra, a mensalidade é cobrada no cartão todo mês e quem atrasou fica bloqueado. Você não precisa barrar ninguém no balcão.",
    },
    faq: {
      // Os dois campos reais do cadastro do plano (a arte t1 mostra a tela):
      // «Dias específicos» e «Limite de utilização».
      pergunta: "Dá para limitar o plano por dia da semana e por quantidade de usos no mês?",
      resposta:
        "Sim. No cadastro do plano você escolhe os dias específicos em que ele vale e o limite de utilização no mês, e o agendamento pelo app segue essa regra.",
    },
  },

  "cobranca-automatica": {
    conceito: "Cobrança e inadimplência",
    atmosfera: "#322210",
    telaProva: "cobrancas-hoje",
    passos: [
      "Na adesão, o assinante cadastra o cartão uma vez.",
      "Todo mês, a mensalidade é cobrada no cartão, sozinha.",
      "Você vê na hora quem está em dia; quem atrasou fica bloqueado.",
    ],
    antesDepois: [
      { hoje: "Mensagem de cobrança para cada assinante, todo mês.", com: "Cobrança no cartão, sem mensagem." },
      { hoje: "Comprovante de Pix para conferir um por um.", com: "A lista mostra quem pagou." },
      { hoje: "Barrar no balcão quem não pagou.", com: "Quem atrasou fica bloqueado no app." },
    ],
    tela: "clube-cobranca",
    anuncio: {
      fonte: "06 · t2 · Anúncio 5 do André (Cobrança e Inadimplência)",
      frase: "Você não precisa mais se preocupar em cobrar a assinatura do seu cliente",
      kicker: "Cobrança automática",
      cta: "Ver a cobrança automática",
      destaque: ["cobrar a assinatura"],
    },
    titulo: "Você não precisa mais se preocupar em cobrar a assinatura do seu cliente.",
    apoio:
      // «100%» como na arte t2 — decisão do André, 23/Set/26 («não precisa trocar, vamos manter assim»).
      "A BestBarbers cuida das cobranças das assinaturas da sua barbearia para você, tudo 100% de forma automática.",
    prova: {
      titulo: "O cliente passa o cartão uma vez",
      texto:
        "Na adesão, o assinante cadastra o cartão. A partir daí a mensalidade é cobrada todo mês, sozinha. Se o cartão recusa, o sistema tenta cobrar de novo. E você vê na hora quem está em dia e quem atrasou. A BestBarbers está em {barbearias} barbearias.",
    },
    faq: {
      pergunta: "E se o cartão do cliente recusar?",
      resposta:
        "O sistema tenta a cobrança de novo, sozinho. Enquanto o pagamento não entra, o assinante fica bloqueado para agendar pelo app.",
    },
  },

  "mes-que-comeca-pago": {
    conceito: "O dia 1",
    atmosfera: "#182421",
    telaProva: "calendario-dia1",
    passos: [
      "Cada assinante tem a data de cobrança dele, definida na adesão.",
      "Nessa data, a mensalidade é cobrada no cartão, sem mensagem.",
      "Você abre o mês vendo no extrato quem já pagou.",
    ],
    antesDepois: [
      { hoje: "Virou o mês: começar a cobrar um por um.", com: "Virou o mês: as mensalidades cobradas no cartão." },
      { hoje: "Assinatura que depende de você lembrar.", com: "Recorrência que acontece na data." },
      { hoje: "Descobrir no fechamento quem não pagou.", com: "Ver no extrato quem já pagou." },
    ],
    tela: "clube-cobranca",
    anuncio: {
      fonte: "06 · t3 · O dia 1 (reescrita 23/Set, arte l8-cena-r2)",
      frase: "Virou o mês. Você ainda precisa ficar cobrando o cliente manualmente?",
      kicker: "Cobrança do clube",
      cta: "Ver o mês que começa pago",
      destaque: ["cobrando o cliente manualmente"],
    },
    titulo: "Virou o mês. Você ainda precisa ficar cobrando o cliente manualmente?",
    apoio:
      "O erro é ter clube e continuar cobrando um por um. Assinatura que depende de mensagem não é recorrência. Na BestBarbers, o cliente cadastra o cartão uma vez e a mensalidade é cobrada todo mês, na data, sozinha.",
    prova: {
      titulo: "Recorrência de verdade não depende de mensagem",
      texto:
        "Cada assinante tem a data de cobrança dele, definida na adesão. Nessa data a mensalidade é cobrada no cartão, sem você mandar mensagem para ninguém, e o extrato mostra quem já pagou. No primeiro mês entram as assinaturas que você acabou de vender; a partir daí, o mês já começa com o clube entrando.",
    },
    faq: {
      // O «dia 1» é da barbearia (a despesa), não da cobrança: o vencimento é por
      // assinante. A pergunta existe para ninguém ler a manchete como promessa de data.
      pergunta: "A mensalidade é cobrada sempre no dia 1?",
      resposta:
        "A cobrança acontece na data de vencimento de cada assinante, definida na adesão: quem vence no dia 1 paga no dia 1. Sempre no cartão, sem você cobrar ninguém.",
    },
  },

  retentativa: {
    conceito: "O cartão que recusou",
    atmosfera: "#4a371e",
    telaProva: "trilha-recusa",
    passos: [
      "O cartão do assinante recusa: cancelado, sem limite, banco fora do ar.",
      "O sistema tenta a cobrança de novo, sozinho.",
      "Enquanto não paga, o assinante fica bloqueado para agendar pelo app.",
    ],
    antesDepois: [
      { hoje: "Você cobra de novo — quando lembra.", com: "O sistema tenta de novo, sozinho." },
      { hoje: "O cliente com cartão recusado continua cortando.", com: "Quem está em atraso fica bloqueado para agendar." },
      { hoje: "A mensalidade parada no cartão some da conta.", com: "A assinatura aparece como vencida no painel." },
    ],
    tela: "clube-assinatura-vencida",
    anuncio: {
      fonte: "06 · t4 · O cartão que recusou",
      frase: "O cartão do assinante recusou. E aí, quem cobra de novo?",
      kicker: "O cartão recusou",
      cta: "Ver como o sistema cobra de novo",
      destaque: ["E aí, quem cobra de novo?"],
    },
    titulo: "O cartão do assinante recusou. E aí, quem cobra de novo?",
    apoio:
      "Na maioria das barbearias, esse alguém é o dono — quando ele lembra. Enquanto isso, o cliente continua cortando. Na BestBarbers, quando o cartão recusa, o sistema tenta de novo sozinho, e quem está em atraso fica bloqueado para agendar.",
    prova: {
      titulo: "Você não precisa ser a segunda tentativa",
      texto:
        "Cartão cancelado, limite estourado, banco fora do ar: acontece em qualquer cobrança no cartão, em qualquer barbearia. Na BestBarbers, quando o cartão do assinante recusa, o sistema tenta cobrar de novo, sem você precisar lembrar. E enquanto o pagamento não entra, o assinante fica bloqueado para marcar horário pelo app.",
    },
    faq: {
      pergunta: "O assinante com o cartão recusado continua agendando?",
      resposta:
        "Não pelo app. Enquanto a mensalidade não é paga, ele fica bloqueado para agendar. Quem está em dia agenda normalmente.",
    },
  },

  "parceiro-astro": {
    conceito: "Vídeo de parceiro · a cobrança que era chata",
    atmosfera: "#322210",
    telaProva: "comissao",
    passos: [
      "A mensalidade é cobrada no cartão todo mês, sozinha.",
      "Quem está em dia agenda pelo app; quem atrasou fica bloqueado.",
      "A comissão das assinaturas sai separada por profissional.",
    ],
    antesDepois: [
      { hoje: "Ficar cobrando cliente todo mês.", com: "Cobrança automática no cartão." },
      { hoje: "Assinatura como mais uma coisa para controlar.", com: "Assinatura como ferramenta de gestão." },
      { hoje: "Comissão do assinante calculada na mão.", com: "Comissão da assinatura calculada por profissional." },
    ],
    tela: "clube-cobranca",
    anuncio: {
      fonte: "transcricoes/du-duastro-assinatura-divisor-de-aguas-abr26.txt",
      frase: "ficar cobrando cliente",
    },
    titulo: "Chega de ficar cobrando cliente todo mês.",
    apoio:
      "Na BestBarbers, a cobrança do clube é automática: o cliente passa o cartão uma vez e a mensalidade é cobrada todo mês, sozinha. Quem está em dia agenda pelo app; quem atrasou fica bloqueado. Você volta a cuidar da barbearia, não da cobrança.",
    botaoPrincipal: "Ver a cobrança automática",
    prova: {
      titulo: "O clube não é só um plano para o cliente",
      texto:
        "É uma ferramenta de gestão para a barbearia. Na BestBarbers você vê na hora quem está em dia e quem atrasou, o histórico de cobrança de cada assinante, mês a mês, e a comissão das assinaturas separada por profissional.",
    },
    faq: {
      pergunta: "Preciso cobrar o assinante que atrasou?",
      resposta:
        "Não. A cobrança é no cartão e, se o cartão recusa, o sistema tenta de novo. Enquanto não paga, o assinante fica bloqueado para agendar pelo app.",
    },
    conferir: CONFERIR_VIDEO,
  },

  "app-proprio": {
    conceito: "Vídeo de parceiro · app com a marca da barbearia",
    atmosfera: "#1a1d24",
    telaProva: "app-marca",
    passos: [
      "O app sai com a marca, a logo e as cores da sua barbearia.",
      "O cliente escolhe o profissional e o serviço e agenda sozinho.",
      "Pelo mesmo app, ele assina o clube e cadastra o cartão.",
    ],
    antesDepois: [
      { hoje: "O cliente agenda por mensagem.", com: "O cliente agenda pelo app da sua barbearia." },
      { hoje: "Sua marca some depois que ele sai da cadeira.", com: "Sua marca fica no celular dele." },
      { hoje: "A assinatura é vendida no balcão.", com: "A assinatura é feita no app, com o cartão." },
    ],
    anuncio: {
      fonte: "transcricoes/rafael-guapo.txt",
      frase: "aplicativo com a sua marca",
    },
    titulo: "Um aplicativo com a sua marca, a sua logo e a sua identidade visual, no bolso do seu cliente.",
    apoio:
      "No app da sua barbearia o cliente escolhe o profissional e o serviço, agenda sozinho e assina o clube. A mensalidade é cobrada no cartão todo mês, e quem atrasou fica bloqueado para agendar.",
    botaoPrincipal: "Ver o app com a sua marca",
    prova: {
      titulo: "O clube mora dentro do app",
      texto:
        "O cliente faz login, escolhe o plano e assina pelo próprio app da sua barbearia. Dali em diante ele agenda pelo mesmo app, e a mensalidade é cobrada no cartão sem você pedir.",
    },
    faq: {
      pergunta: "O app sai com o nome e a marca da minha barbearia?",
      resposta:
        "Sim: o app leva a marca, a logo e a identidade visual da sua barbearia. O que entra no seu caso e as condições são apresentados na conversa, antes de qualquer compromisso.",
    },
    conferir:
      "Nenhum registro liga a transcrição `rafael-guapo.txt` ao anúncio «Topo 19: vídeo Guapo app próprio» (ad 120252969265930522) — a ligação foi pelo assunto. " +
      CONFERIR_VIDEO,
  },

  // ─────────────────────────────── MEIO ───────────────────────────────
  "sem-caderno": {
    conceito: "O fim do caderninho",
    atmosfera: "#472f14",
    telaProva: "resumo-assinantes",
    passos: [
      "Todos os assinantes numa lista, com a situação de cada um.",
      "Um toque em Vencidos e aparece só quem atrasou.",
      "Quem está em dia agenda pelo app; quem atrasou fica bloqueado.",
    ],
    antesDepois: [
      { hoje: "Caderno com nome, data e “pagou?”.", com: "Lista com Ativo e Vencido." },
      { hoje: "Cobrança por Pix, um por um.", com: "Cobrança automática no cartão." },
      { hoje: "Descobrir o atraso com o cliente na cadeira.", com: "Quem atrasou fica bloqueado antes de agendar." },
    ],
    tela: "clube-previsao-faturas",
    anuncio: {
      fonte: "06 · m1 · COPY 4 do André (O FIM DO CADERNINHO)",
      frase: "É impossível gerenciar as assinaturas da sua barbearia manualmente",
      kicker: "O fim do caderninho",
      cta: "Ver como sair do caderno",
      destaque: ["impossível", "manualmente"],
    },
    titulo: "É impossível gerenciar as assinaturas da sua barbearia manualmente.",
    apoio:
      // «100%» como na arte m1 — decisão do André, 23/Set/26.
      "Você vai perder o controle e vai ter prejuízos. Com a BestBarbers: cobrança 100% automática no cartão, quem pagou agenda pelo app e quem atrasou fica bloqueado, de forma automática.",
    prova: {
      titulo: "Você abre a lista e vê quem pagou",
      texto:
        "Na BestBarbers você vê na hora quais assinantes estão em dia e quais atrasaram. Quem atrasou entra numa lista, e você manda mensagem para todos de uma vez. A mensalidade de quem está em dia é cobrada no cartão todo mês, sozinha — você não cobra ninguém.",
    },
    faq: {
      pergunta: "Preciso começar o clube do zero para sair do caderno?",
      resposta:
        "Não. A gente importa a sua lista de assinantes com os vencimentos que eles já têm, e cada assinante cadastra o cartão para continuar no app.",
    },
  },

  "um-sistema-so": {
    conceito: "Dois sistemas",
    atmosfera: "#66502d",
    telaProva: "dois-sistemas",
    passos: [
      "O cliente assina e paga no cartão.",
      "Agenda pelo app da sua barbearia.",
      "A comissão do barbeiro já sai calculada dessa assinatura.",
    ],
    antesDepois: [
      { hoje: "Agenda num sistema, cobrança em outro.", com: "Agenda e cobrança no mesmo lugar." },
      { hoje: "Conferir em dois lugares quem pagou e quem cortou.", com: "O atendimento do assinante já aparece ligado à assinatura." },
      { hoje: "Comissão da assinatura numa planilha à parte.", com: "Comissão da assinatura calculada por profissional." },
    ],
    anuncio: {
      fonte: "06 · m3 · COPY 7 do André (DOIS SISTEMAS), cortada para 3 itens",
      frase: "A agenda da barbearia em um sistema e a cobrança das assinaturas em outro?",
      kicker: "Dois sistemas",
      cta: "Ver a agenda e a cobrança juntas",
      destaque: ["em outro?"],
    },
    // Só a headline do estático: com o sub junto, o título dava 8 linhas no celular.
    titulo: "A agenda da barbearia em um sistema e a cobrança das assinaturas em outro?",
    apoio:
      "Você está perdendo tempo e dinheiro. Com a BestBarbers, é um sistema só: o cliente assina e paga no cartão, agenda pelo app da sua barbearia, e a comissão do barbeiro já sai calculada dessa assinatura.",
    prova: {
      // Os três itens da COPY 7 cortada (cap. 36 §5.3): a comissão fica porque é o
      // item que só faz sentido com agenda e cobrança no mesmo sistema.
      titulo: "A comissão só fecha quando agenda e cobrança estão juntas",
      texto:
        "Com a agenda num sistema e a cobrança em outro, ninguém liga o corte do assinante ao pagamento dele. Na BestBarbers os dois estão juntos: o atendimento do assinante entra na comissão do profissional, em coluna separada, com o que já foi pago e o que está pendente.",
    },
    faq: {
      pergunta: "Troco de sistema sem perder assinante?",
      resposta:
        "Sim. A gente importa a sua planilha de assinantes com os vencimentos que eles já têm. Cada assinante cadastra o cartão de novo para continuar no app — e isso é dito a ele com transparência.",
    },
  },

  "bloqueio-na-agenda": {
    conceito: "O inadimplente que continua agendando",
    atmosfera: "#3c2814",
    telaProva: "agenda-bloqueio",
    passos: [
      "A mensalidade vence sem pagamento.",
      "O assinante tenta marcar pelo app e fica bloqueado.",
      "A agenda do barbeiro segue só com quem está em dia.",
    ],
    antesDepois: [
      { hoje: "Quem deve continua marcando horário.", com: "Quem atrasou fica bloqueado para agendar." },
      { hoje: "O barbeiro decide na cadeira se atende.", com: "A regra é do sistema." },
      { hoje: "Você avisa o cliente que ele está devendo.", com: "Você não precisa avisar nem barrar ninguém." },
    ],
    tela: "clube-assinatura-vencida",
    anuncio: {
      fonte: "06 · m4 · O inadimplente que continua agendando",
      frase: "O cliente que está devendo continua marcando horário no seu sistema?",
      kicker: "Quem atrasou não agenda",
      cta: "Ver o bloqueio na agenda",
      destaque: ["continua marcando horário"],
    },
    titulo: "O cliente que está devendo continua marcando horário no seu sistema?",
    apoio:
      "Se a resposta é sim, quem decide se atende ou não é o seu barbeiro, com o cliente já na cadeira. Na BestBarbers a regra é do sistema: quem está em dia agenda pelo app sozinho, quem atrasou a mensalidade fica bloqueado.",
    prova: {
      titulo: "O bloqueio acontece na agenda, não no balcão",
      texto:
        "Quando a mensalidade vence sem pagamento, o assinante fica bloqueado para agendar pelo app — sem você precisar avisar esse cliente nem barrar ele na porta. A mensalidade é cobrada no cartão todo mês; se o cartão recusa, o sistema tenta cobrar de novo.",
    },
    faq: {
      pergunta: "Quem está em dia sente alguma diferença?",
      resposta:
        "Não. Quem está com a mensalidade em dia agenda pelo app normalmente; o bloqueio vale só para quem atrasou.",
    },
  },

  "parceiro-seletto": {
    conceito: "Vídeo de parceiro · previsibilidade de caixa",
    atmosfera: "#1e3a5f",
    telaProva: "previsao-mes",
    passos: [
      "Cada assinante paga a mensalidade no cartão, na data dele.",
      "Você vê no mês quais faturas já foram pagas.",
      "E quais estão aguardando ou venceram.",
    ],
    antesDepois: [
      { hoje: "Descobrir no fechamento quanto entrou.", com: "Ver no mês o que já foi pago." },
      { hoje: "Receita que depende do movimento da semana.", com: "Mensalidade que entra na data." },
      { hoje: "Não saber quem atrasou.", com: "Faturas vencidas separadas." },
    ],
    tela: "clube-previsao-faturas",
    anuncio: {
      fonte: "transcricoes/joao-seletto-07-220-novos-assinantes-mai26.txt",
      frase: "previsibilidade de caixa",
    },
    // Os números do vídeo (assinantes novos, média por mês) são RESULTADO DE TERCEIRO:
    // não entram na página, que fala do mecanismo e não da operação de outra barbearia.
    titulo: "Assinante novo entrando todo mês vira previsibilidade de caixa.",
    apoio:
      "Na BestBarbers, cada assinante paga a mensalidade no cartão, na data dele, todo mês. Você vê quem está em dia antes de o mês começar, em vez de descobrir no fechamento.",
    botaoPrincipal: "Ver como o clube entra no caixa",
    prova: {
      titulo: "O ritmo do clube vira número na tela",
      texto:
        "Na BestBarbers você acompanha os assinantes do clube, quem está em dia e quem atrasou, e o histórico de cobrança de cada um, mês a mês. Resultado de outra barbearia não é previsão para a sua — por isso a conversa começa pela sua carteira.",
    },
    faq: {
      pergunta: "Quantos assinantes eu vou conseguir?",
      resposta:
        "Ninguém pode prometer esse número: depende da sua carteira, do preço e da regra do plano. Na conversa a gente olha a sua operação antes de falar de clube.",
    },
    conferir: CONFERIR_VIDEO,
  },

  "parceiro-guapo": {
    conceito: "Vídeo de parceiro · o mecanismo do clube",
    atmosfera: "#322210",
    telaProva: "jornada-assinante",
    passos: [
      "O cliente assina pelo app e cadastra o cartão.",
      "O valor da mensalidade cai automático, todo mês.",
      "Ele agenda sozinho pelo app; se atrasar, fica bloqueado.",
    ],
    antesDepois: [
      { hoje: "Cobrar cada assinante todo mês.", com: "O valor cai automático no cartão." },
      { hoje: "Agendar o assinante por mensagem.", com: "Ele agenda sozinho pelo app." },
      { hoje: "Mês que começa do zero.", com: "Mês que começa com o clube entrando." },
    ],
    tela: "clube-cobranca",
    anuncio: {
      fonte: "transcricoes/guapo-clube-faturamento-garantido-cortes-aprov.txt",
      frase: "O cliente assina, o valor cai automático",
    },
    titulo: "O cliente assina, o valor cai automático e ele agenda sozinho pelo app.",
    apoio:
      "É o clube rodando na BestBarbers: a mensalidade é cobrada no cartão, na data de cada assinante, e o mês já começa com a receita do clube entrando.",
    botaoPrincipal: "Ver o clube funcionando",
    prova: {
      titulo: "Três passos, um depois do outro",
      texto:
        "O cliente assina pelo app da sua barbearia e cadastra o cartão. A mensalidade é cobrada todo mês, sozinha. Com o pagamento em dia ele agenda pelo app; se atrasar, fica bloqueado.",
    },
    faq: {
      pergunta: "O primeiro mês já começa pago?",
      resposta:
        "O primeiro mês tem a receita das assinaturas que você acabou de vender. A partir daí, cada mês começa com a mensalidade dos assinantes sendo cobrada na data de cada um.",
    },
    conferir:
      "A transcrição traz «igualdade de faturamento garantido» e «Best Buy» — erros do reconhecimento de voz. A página usa só o trecho legível. " +
      CONFERIR_VIDEO,
  },
};

/* ───────────────────────────────────────────────────────────────────────────
   Montagem — do conteúdo para a configuração que o template da família entende.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * Porta → situação da família. A situação escolhe o texto de apoio da página
 * (comparativo, objeções, FAQ geral) e pré-preenche a pergunta do clube no
 * formulário. P1 cai em `geral`, e não em `abertura`: `abertura` na família é
 * «vai abrir a barbearia», e o dono que ainda não montou o clube já tem barbearia.
 */
/**
 * O pedido de contato das páginas /clube (botão da prova, chamada final, CTA fixo e o envio do
 * passo 2 do formulário). Um lugar só: os quatro têm que dizer a mesma coisa.
 */
export const ROTULO_CONTATO_CLUBE = "Quero melhorar meus resultados";

export function situacaoDaPorta(porta: Porta | null): PcSituacao {
  if (porta === 2) return "manual";
  if (porta === 3) return "migracao";
  return "geral";
}

export function pecaDoClube(slug: SlugClube): PcPeca {
  const c = CONTEUDO_CLUBE[slug];
  const { porta, etapa } = PORTAS_CLUBE[slug];
  return {
    id: `clube/${slug}`,
    conceito: c.conceito,
    situacao: situacaoDaPorta(porta),
    etapa,
    titulo: comNumerosOficiais(c.titulo),
    ...(c.anuncio.destaque ? { tituloDestaque: c.anuncio.destaque } : {}),
    apoio: comNumerosOficiais(c.apoio),
    // O botão repete o do anúncio: quem clicou em «Ver o bloqueio na agenda» procura isso.
    botaoPrincipal: c.anuncio.cta ?? c.botaoPrincipal ?? "Ver como funciona",
    exemploTitulo: comNumerosOficiais(c.prova.titulo),
    exemploTexto: comNumerosOficiais(c.prova.texto),
    faqPergunta: comNumerosOficiais(c.faq.pergunta),
    faqResposta: comNumerosOficiais(c.faq.resposta),
    // «Como segue a conversa» e nenhum artefato exigido: a página não promete
    // demonstração aberta que ainda é placeholder (guarda V9 da família).
    ponte: "como_segue",
    formularioVariante: "curto",
    botaoContato: ROTULO_CONTATO_CLUBE,
    artefatoExigido: null,
  };
}

export function configDaPaginaClube(slug: SlugClube): PcPaginaConfig {
  const peca = pecaDoClube(slug);
  return {
    situacao: peca.situacao,
    rota: `/clube/${slug}`,
    // `source` do dataLayer/useLeadForm e rótulo da visita DIRETA (sem UTM). No
    // tráfego pago a origem e a descrição vêm do `useUtmParams`, nunca daqui.
    source: `lp_clube_${slug.replace(/-/g, "_")}`,
    rotulo: `Clube-${slug}`,
    peca,
    ...(CONTEUDO_CLUBE[slug].anuncio.kicker ? { identificacao: CONTEUDO_CLUBE[slug].anuncio.kicker } : {}),
    ...(CONTEUDO_CLUBE[slug].tela ? { artefatoHeroi: CONTEUDO_CLUBE[slug].tela } : {}),
  };
}
