/**
 * CADASTRO CONCLUÍDO — o que o `useLeadForm` entrega ao `onSuccess` da página.
 *
 * Nasceu com o curso de assinatura (contrato `02-contrato-tecnico.md` §2.2, no bestbarbers-ai):
 * depois do cadastro, a página do curso precisa saber QUEM se cadastrou e POR ONDE o lead entrou
 * no Ploomes, para inscrever a pessoa no curso sem pedir nada de novo. Quem já passa
 * `onSuccess: () => …` ignora o argumento e nada muda.
 *
 * Função pura, sem React e sem `@/`: é o que deixa o `node --test` (npm test) carregar o módulo.
 */

import type { LeadAttribution } from "./lead-attribution";

/** O caminho que DE FATO rodou: `lucas` que falhou vira `sdr` (ver `cadastrarContatoNovo`). */
export type CaminhoFeito = "sdr" | "lucas" | "recadastro";

export interface CadastroConcluido {
  /** `formData.ownerName.trim()`. */
  nome: string;
  /** `formData.barbershopName.trim()`. */
  barbearia: string;
  /** Como a pessoa digitou (com a máscara). Quem recebe normaliza. */
  telefone: string;
  /** Minúsculo e sem espaço; ausente quando o campo ficou vazio. */
  email?: string;
  /** `calcularScoreV2`; `null` quando falta resposta (nunca vira 0). */
  nota: number | null;
  /** Resposta da pergunta 7, a string canônica de `CLUBE_OPCOES`. */
  clube: string;
  caminho: CaminhoFeito;
  /** Card criado na hora: nutrição (`lucas`) e recadastro. No `sdr` o card nasce pela automação. */
  dealId: number | null;
  /** Contato do Ploomes, nos três caminhos (quando a resposta trouxe o id). */
  contactId: number | null;
  atribuicao: LeadAttribution;
}

/** Inteiro positivo ou `null`. O que vem de resposta de API nunca é confiado sem conferir. */
export function idPositivo(valor: unknown): number | null {
  return typeof valor === "number" && Number.isInteger(valor) && valor > 0 ? valor : null;
}

/**
 * Id do contato na resposta do `POST /Contacts` do Ploomes, que devolve `{ value: [{ Id, … }] }`
 * (quirk medido: o POST responde dentro de `value`). Formato inesperado = `null`, nunca erro:
 * o cadastro já deu certo, e o id é só um atalho para quem lê depois.
 */
export function idDoContatoCriado(resposta: unknown): number | null {
  const lista = (resposta as { value?: unknown } | null | undefined)?.value;
  if (!Array.isArray(lista)) return null;
  return idPositivo((lista[0] as { Id?: unknown } | undefined)?.Id);
}

export function montarCadastroConcluido(input: {
  formData: { ownerName: string; barbershopName: string; whatsapp: string; email: string; clubStatus: string };
  nota: number | null;
  caminho: CaminhoFeito;
  dealId: number | null | undefined;
  contactId: number | null | undefined;
  atribuicao: LeadAttribution;
}): CadastroConcluido {
  const email = input.formData.email.trim().toLowerCase();
  return {
    nome: input.formData.ownerName.trim(),
    barbearia: input.formData.barbershopName.trim(),
    telefone: input.formData.whatsapp,
    ...(email ? { email } : {}),
    nota: typeof input.nota === "number" && Number.isFinite(input.nota) ? input.nota : null,
    clube: input.formData.clubStatus,
    caminho: input.caminho,
    // No `sdr` não existe card criado pelo site: um id que tenha sobrado não vale nada aqui.
    dealId: input.caminho === "sdr" ? null : idPositivo(input.dealId),
    contactId: idPositivo(input.contactId),
    atribuicao: input.atribuicao,
  };
}
