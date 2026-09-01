/**
 * PASSO 1 dos formulários multi-step — o portão onde o e-mail mora.
 *
 * Duas responsabilidades, as duas nascidas da revisão do campo de e-mail (set/26):
 *
 * 1. VALIDAÇÃO NO LUGAR CERTO. O campo de e-mail está no passo 1, mas a validação do
 *    formulário só rodava no submit, que acontece no passo 2 — quem digitava "joao@gmail"
 *    via "E-mail deve ser válido" numa tela onde o campo nem existe, e tinha que
 *    descobrir o "← Voltar" sozinho. A regra é a MESMA nos dois pontos (mesma função,
 *    mesma mensagem): vazio SEMPRE passa (o campo é opcional e continua opcional), só o
 *    formato torto é avisado — e agora é avisado com o campo na tela.
 *
 * 2. MEDIÇÃO DO AVANÇO. Sem evento de passo 1 → passo 2 é impossível separar "desistiu
 *    no passo 1" (onde o campo novo está) de "desistiu no passo 2", e a régua de
 *    reversão combinada (queda >15% na conclusão em 7 dias tira o campo) arbitraria no
 *    escuro. O push carrega se o e-mail veio preenchido — nunca o e-mail em si.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mensagem única — o passo 1 e o submit falam exatamente a mesma coisa. */
export const MSG_EMAIL_INVALIDO = 'E-mail deve ser válido';

/**
 * Valida o e-mail OPCIONAL. Devolve `null` quando está tudo certo — inclusive (e
 * principalmente) quando o campo está vazio, que é o caso que nunca pode barrar ninguém.
 */
export function validarEmailOpcional(email: string | null | undefined): string | null {
  const valor = (email ?? '').trim();
  if (!valor) return null;
  return EMAIL_REGEX.test(valor) ? null : MSG_EMAIL_INVALIDO;
}

/**
 * Marca o avanço para o passo 2 no dataLayer. Dispara UMA vez por formulário
 * preenchido (o `jaMedido` do chamador segura o ida-e-volta pelo "← Voltar", que não é
 * um avanço novo). Nunca lança: medição quebrada não pode derrubar o formulário.
 */
export function trackAvancoPasso2(params: {
  /** Versão da LP — mesma string que o `source` do useLeadForm usa. */
  lpVersion: string;
  /** Só o fato de ter ou não ter e-mail; o endereço não entra na medição. */
  emailPreenchido: boolean;
}): void {
  if (typeof window === 'undefined') return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'form_step_2',
      lp_version: params.lpVersion,
      email_preenchido: params.emailPreenchido,
    });
  } catch {
    // Medição é acessório: qualquer falha aqui é silenciosa de propósito.
  }
}
