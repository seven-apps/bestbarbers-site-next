/**
 * WHATSAPP DO LUCAS — o número e a mensagem pronta que o lead com nota < 60 manda ao sair
 * do formulário (ADR-035 no bestbarbers-ai; regra em `src/lib/lead-nutricao.ts`).
 *
 * Arquivo de CONTEÚDO: para trocar um texto, edite só aqui. O código acrescenta sozinho,
 * no fim de cada mensagem, o código do card no Ploomes — "(cód. 1202661959)" — que é como
 * o Lucas acha o card mesmo quando o lead escreve de outro número. Não escreva o código
 * nos textos abaixo.
 *
 * Regras de copy (André): primeira pessoa do dono, sem jargão, "assinatura" (não "clube"),
 * nenhum nome de cliente, parceiro ou concorrente — a mensagem é conteúdo público.
 */

/**
 * Número do WhatsApp do Lucas, só dígitos, com 55 e DDD (ex.: 5531999999999). Confirmado com o
 * chip em 07/Out/26. O curso também usa este número (bônus da aula e link inválido).
 */
export const NUMERO_WHATSAPP_LUCAS: string = "553172183568";

/**
 * Liga o desvio do lead novo com nota < 60 para o Lucas (ADR-035). LIGADO em 10/Out/26 (GO do André;
 * o comercial confirmou o corte em 09/Out). Desligar = `false` + publicar: o lead < 60 volta ao
 * caminho de antes — contato pela chave do site, card na Qualificação, rodízio de SDR — e a rota da
 * nutrição nem é chamada.
 */
export const DESVIO_NOTA_60_LIGADO = true;

/**
 * Aprovados pelo André em 06/Out/26 (item L14 da página de textos) — todos os textos daqui para baixo.
 */

/** Página sem texto próprio: home, barra de navegação em qualquer página, blog, LPs /vN. */
export const MENSAGEM_PADRAO_LUCAS =
  "Oi! Acabei de me cadastrar no site da BestBarbers e quero entender como funciona para a minha barbearia.";

/**
 * Mensagem por página do formulário. `caminho` casa a própria página e tudo abaixo dela
 * (`/clube` vale também para `/clube/<peça>`); o caminho mais longo que casar vence.
 */
export const MENSAGENS_LUCAS: ReadonlyArray<{ caminho: string; mensagem: string }> = [
  {
    caminho: "/clube",
    mensagem: "Oi! Me cadastrei na página da assinatura. Quero entender como funciona a assinatura na minha barbearia.",
  },
  {
    caminho: "/projeto-do-clube",
    mensagem: "Oi! Pedi no site para montar o projeto da assinatura da minha barbearia. Como funciona?",
  },
  {
    caminho: "/projeto-do-clube/clube-manual",
    mensagem: "Oi! Já vendo planos de assinatura, mas controlo tudo no caderno. Quero organizar isso no sistema.",
  },
  {
    caminho: "/projeto-do-clube/migracao",
    mensagem: "Oi! Tenho assinatura na barbearia e quero avaliar a troca de sistema sem perder meus assinantes.",
  },
  {
    caminho: "/projeto-do-clube/abertura",
    mensagem: "Oi! Vou abrir minha barbearia e quero planejar a assinatura antes de começar a vender.",
  },
  {
    caminho: "/tabela-precificacao-clube",
    mensagem: "Oi! Usei a tabela de preço da assinatura no site. Quero ajuda para acertar o preço na minha barbearia.",
  },
  {
    caminho: "/tabela-precificacao-clube-gated",
    mensagem: "Oi! Usei a tabela de preço da assinatura no site. Quero ajuda para acertar o preço na minha barbearia.",
  },
  {
    caminho: "/calculadora-prejuizo",
    mensagem: "Oi! Fiz a conta de quanto a minha barbearia perde por mês. Quero entender como recuperar esse dinheiro.",
  },
  {
    caminho: "/calculadora-lucro-do-corte",
    mensagem: "Oi! Calculei quanto sobra de cada corte na minha barbearia. Quero entender como aumentar esse lucro.",
  },
  {
    caminho: "/cadeira-cheia",
    mensagem: "Oi! Pedi o guia Cadeira Cheia. Quero trazer de volta os clientes que sumiram da minha barbearia.",
  },
  {
    caminho: "/do-zero-a-assinatura",
    mensagem: "Oi! Pedi o guia Assinatura do Zero. Quero entender como começar a assinatura na minha barbearia.",
  },
  {
    caminho: "/assinante-por-indicacao",
    mensagem: "Oi! Pedi o guia Assinante por Indicação. Quero conseguir assinantes pela indicação dos meus clientes.",
  },
  {
    // Curso de assinatura (contrato do curso §2.2). A vitrine leva direto para a área do aluno, então
    // esta mensagem só fica na tela quando a inscrição no curso falha e a pessoa fica na vitrine.
    caminho: "/curso-assinatura",
    mensagem: "Oi! Me cadastrei no curso de assinatura do BestBarbers. Quero receber o link das aulas.",
  },
];

/** Textos da tela que leva ao WhatsApp (`src/components/ConversaComLucas.tsx`). */
export const TEXTOS_CONVERSA_LUCAS = {
  titulo: "Cadastro feito!",
  /** Celular, nas páginas em que o WhatsApp abre sozinho. */
  abrindo: "Abrindo o WhatsApp para você continuar a conversa com a BestBarbers…",
  /** Computador, ou celular nas páginas que só ganham o botão. */
  convite: "Mande a mensagem no WhatsApp para continuar a conversa com a BestBarbers.",
  botao: "Abrir o WhatsApp",
} as const;
