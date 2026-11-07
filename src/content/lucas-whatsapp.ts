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
 * CHAVE do desvio ao Lucas (ADR-038 no bestbarbers-ai). Ligada em 10/Out/26 (ADR-035) e DESLIGADA em 06/Nov/26, com o
 * GO do André: "pode desligar o redirecionamento do Lucas nas páginas do bestbarbers-site-next, e mandar tudo pro pipe
 * de qualificação para os SDRs". Medido antes: 0 reunião em 117 leads que escreveram ao Lucas desde 13/Out.
 *
 * - `leadNovo`: todas as páginas do site (LPs, guias, calculadoras, tabela, projeto, clube, home). Desligada, o lead
 *   segue o caminho do "Este mês": contato pela chave do site → automação do card na Qualificação → rodízio de SDR.
 *   A rota da nutrição nem é chamada, o recadastro não pede a Nutrição e a tela do WhatsApp do Lucas não abre.
 * - `curso`: o curso de assinatura. Desligada em 07/Nov/26 ("Pode mandar sim o lead do curso de assinatura para
 *   qualificação"): o curso também vai à Qualificação. Ligada, volta a regra dele (Nutrição + passagem ao SDR pelo sinal
 *   do aluno).
 *
 * Religar = trocar o valor e publicar. O OS tem o espelho (`DESVIO_DO_LUCAS` em lib/integrations/ploomes-fields.ts):
 * basta um dos dois lados desligado para o lead ir à Qualificação.
 */
export const DESVIO_DO_LUCAS: Readonly<{ leadNovo: boolean; curso: boolean }> = Object.freeze({
  leadNovo: false,
  curso: false,
});

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
  /** O cartão: computador, celular nas páginas que só ganham o botão, e a reserva quando o app não abre. */
  convite: "Mande a mensagem no WhatsApp para continuar a conversa com a BestBarbers.",
  botao: "Abrir o WhatsApp",
} as const;
