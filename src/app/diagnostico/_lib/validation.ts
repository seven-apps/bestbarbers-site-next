// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json.
import type { Answers, DraftAnswers, Question } from "./types.ts";

export function parseAnswers(drafts: DraftAnswers): Answers {
  return Object.fromEntries(Object.entries(drafts).map(([key, value]) => [
    key, value === null ? null : value.trim() === "" ? NaN : Number(value.replace(",", ".")),
  ]));
}

export function validateAnswers(questions: Question[], drafts: DraftAnswers): Record<string, string> {
  const answers = parseAnswers(drafts);
  const errors: Record<string, string> = {};
  for (const question of questions) {
    const value = answers[question.var];
    if (value === null && (question.aceita_nao_sei || question.opcoes?.some((option) => option.valor === null))) continue;
    if (value === null || value === undefined || drafts[question.var] === "" || !Number.isFinite(value)) {
      errors[question.var] = "Preencha este campo.";
    } else if (question.tipo !== "reais_centavos" && !Number.isInteger(value)) {
      errors[question.var] = "Use um número inteiro.";
    } else if (question.tipo === "reais_centavos" && Math.abs(value * 100 - Math.round(value * 100)) > 0.000001) {
      errors[question.var] = "Use até duas casas decimais.";
    } else if (value < (question.min ?? 0) || value > (question.max ?? Infinity)) {
      errors[question.var] = `Use um valor entre ${question.min ?? 0} e ${question.max?.toLocaleString("pt-BR") ?? "o limite indicado"}.`;
    } else if (question.tipo === "escolha" && !question.opcoes?.some((option) => option.valor === value)) {
      errors[question.var] = "Escolha uma das opções.";
    } else if (question.max_var && typeof answers[question.max_var] === "number" && value > answers[question.max_var]!) {
      const reference = questions.find((item) => item.var === question.max_var);
      errors[question.var] = `O valor não pode passar de ${reference?.rotulo ?? question.max_var} (${answers[question.max_var]?.toLocaleString("pt-BR")}).`;
    }
  }
  return errors;
}

export interface Contact {
  name: string;
  whatsapp: string;
  instagram: string;
}

export function validateContact(contact: Contact): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!contact.name.trim()) errors.nome = "Preencha o seu nome.";
  if (!/^\d{10,11}$/.test(contact.whatsapp.replace(/\D/g, ""))) errors.whatsapp = "Informe o WhatsApp com DDD, com 10 ou 11 dígitos.";
  return errors;
}
