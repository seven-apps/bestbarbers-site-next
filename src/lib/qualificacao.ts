/**
 * Mensagens de validação das perguntas 5 a 8 do formulário (faturamento, sistema,
 * clube e profissionais) — as quatro que alimentam `calcularScoreV2`.
 *
 * Moram aqui, e não dentro do componente, porque QUEM VALIDA é o `useLeadForm` e
 * QUEM PINTA o campo de vermelho é o `<PerguntasQualificacao>`: as duas pontas
 * precisam casar pela mesma string, e um arquivo de texto no meio é o que impede
 * a comparação por `includes('Faturamento')` de voltar a existir.
 */

export const MSG_FATURAMENTO = 'Faturamento médio é obrigatório';
export const MSG_SISTEMA = 'Sistema atual é obrigatório';
export const MSG_CLUBE = 'Situação do clube é obrigatória';
export const MSG_PROFISSIONAIS = 'Número de profissionais é obrigatório';

/** Qual das quatro perguntas está com erro — o formulário repassa para o componente. */
export interface ErrosQualificacao {
  monthlyRevenue?: boolean;
  currentSystem?: boolean;
  clubStatus?: boolean;
  employeeCount?: boolean;
}

/**
 * Traduz o `submitError` (uma string só, do hook) no mapa por campo. Comparação
 * EXATA: qualquer outro erro (WhatsApp, e-mail, backend fora) devolve o mapa vazio
 * e nenhum campo de qualificação fica marcado sem motivo.
 */
export function errosDeQualificacao(submitError: string | null | undefined): ErrosQualificacao {
  if (!submitError) return {};
  return {
    monthlyRevenue: submitError === MSG_FATURAMENTO,
    currentSystem: submitError === MSG_SISTEMA,
    clubStatus: submitError === MSG_CLUBE,
    employeeCount: submitError === MSG_PROFISSIONAIS,
  };
}
