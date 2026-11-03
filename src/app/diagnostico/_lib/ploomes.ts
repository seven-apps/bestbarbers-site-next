// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json, chave ploomes.
import { PLOOMES_CONTACT_FIELDS, PLOOMES_LEGACY_FIELDS } from "../../../lib/ploomes-fields.ts";
import type { Answers, Problem } from "./types.ts";
import type { Contact } from "./validation.ts";

export const ENVIO_PLOOMES_ATIVO = false;
// A origem Diagnóstico ainda não existe. Só preencher depois da criação e do alinhamento com o João.
export const originId: number | null = null;

interface PayloadInput {
  contact: Contact;
  moment: string;
  theme: string;
  problem?: Problem;
  answers: Answers;
  otherText: string;
  otherLabel: string;
}

/** Mesmo formato de contato do formulário atual, sem importar os hooks que fazem requisições. */
export function buildPayload(input: PayloadInput) {
  const { contact, moment, theme, problem, answers } = input;
  const numbers = problem
    ? problem.perguntas.map((question) => `${question.var}=${answers[question.var] === null ? "não sei" : answers[question.var]}`).join("; ")
    : `outra_coisa=${input.otherText.trim()}`;
  const choice = problem ? `${problem.mapa} ${problem.opcao}` : input.otherLabel;
  const summary = `[Diagnóstico] ${moment} · ${theme} · ${choice} · ${numbers}`;
  return {
    action: "createContact" as const,
    payload: {
      Name: contact.name.trim(),
      OriginId: originId,
      Phones: [{ PhoneNumber: contact.whatsapp.replace(/\D/g, ""), TypeId: 2, CountryId: 0 }],
      OtherProperties: [
        { FieldKey: PLOOMES_LEGACY_FIELDS.ownerName, StringValue: contact.name.trim() },
        { FieldKey: PLOOMES_CONTACT_FIELDS.bb_lp_version, StringValue: "diagnostico-v1" },
        { FieldKey: PLOOMES_LEGACY_FIELDS.campaignDescStr, StringValue: summary },
        ...(contact.instagram.trim() ? [{ FieldId: 120010584, StringValue: contact.instagram.trim() }] : []),
      ],
    },
  };
}

let pendingPayload: ReturnType<typeof buildPayload> | null = null;

export function getPendingPayload() {
  return pendingPayload;
}

export function keepPayloadLocally(payload: ReturnType<typeof buildPayload>) {
  if (ENVIO_PLOOMES_ATIVO) throw new Error("O envio depende da origem, da deduplicação e do fluxo de recadastro alinhados com o João.");
  pendingPayload = payload;
  if (process.env.NODE_ENV === "development") {
    console.info("[Diagnóstico] Envio desligado; payload guardado apenas em memória.", payload);
  }
}
