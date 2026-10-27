/**
 * Mensagens de validação das perguntas de qualificação do formulário.
 *
 * Formulário v3 (porta do lead, 27/Out/26): são DUAS perguntas de 1 toque, equipe e "quando quer começar", que
 * alimentam `calcularScoreV3` e decidem a rota do lead. As mensagens do v2 (faturamento, sistema, clube) ficam
 * exportadas para quem ainda as importa, mas nenhuma é mais exigida pelo `useLeadForm`.
 *
 * Moram aqui, e não dentro do componente, porque QUEM VALIDA é o `useLeadForm` e
 * QUEM PINTA o campo de vermelho é o `<PerguntasQualificacao>`: as duas pontas
 * precisam casar pela mesma string.
 */

export const MSG_EQUIPE = 'Diga quantas pessoas trabalham na barbearia';
export const MSG_QUANDO = 'Diga quando você quer começar';

/** Formulário v2 (até 27/Out/26) — não são mais exigidas. */
export const MSG_FATURAMENTO = 'Faturamento médio é obrigatório';
export const MSG_SISTEMA = 'Sistema atual é obrigatório';
export const MSG_CLUBE = 'Situação do clube é obrigatória';
/** Alias da equipe: a pergunta mudou de forma, o campo (`employeeCount`) é o mesmo. */
export const MSG_PROFISSIONAIS = MSG_EQUIPE;

/** Qual das perguntas está com erro — o formulário repassa para o componente. */
export interface ErrosQualificacao {
  employeeCount?: boolean;
  startWhen?: boolean;
  /** v2 — ninguém mais marca; mantidos para os formulários que ainda os repassam. */
  monthlyRevenue?: boolean;
  currentSystem?: boolean;
  clubStatus?: boolean;
}

/**
 * Traduz o `submitError` (uma string só, do hook) no mapa por campo. Comparação
 * EXATA: qualquer outro erro (WhatsApp, e-mail, backend fora) devolve o mapa vazio
 * e nenhum campo de qualificação fica marcado sem motivo.
 */
export function errosDeQualificacao(submitError: string | null | undefined): ErrosQualificacao {
  if (!submitError) return {};
  return {
    employeeCount: submitError === MSG_EQUIPE,
    startWhen: submitError === MSG_QUANDO,
  };
}
