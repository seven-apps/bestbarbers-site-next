/**
 * Tabela de Precificação de Clubes — motor de cálculo
 *
 * Método (Regra dos 2 Cortes, aplicada por milhares de barbearias por assinatura):
 *
 *  1. O TETO da mensalidade é o valor de 2 cortes avulsos. Acima disso, só
 *     assina quem já corta 4× por mês — e o clube não escala.
 *  2. O preço de LANÇAMENTO fica um pouco abaixo do teto (efeito "uau"): o
 *     cliente que corta de 20 em 20 ou de 30 em 30 dias olha e pensa
 *     "se eu usar duas vezes, já valeu" — e é ele quem sustenta o clube.
 *  3. A POSIÇÃO dentro da faixa acompanha a agenda: com horário sobrando,
 *     preço mais convidativo (converte mais); agenda lotada, topo da faixa.
 *
 * REGRA DE VERACIDADE: o resultado é uma RECOMENDAÇÃO de ponto de partida a
 * partir dos números que o usuário informou, nunca um dado da operação dele.
 * As referências de mercado/método vivem em benchmarks.ts, rotuladas na UI.
 */

import { METODO } from "./benchmarks";

// ── Premissas DEFAULT (ajustáveis pelo usuário) ──
export const DEFAULTS = {
  corteAvulso: 40,
  cadeiras: 3,
  comissaoPct: 40,
  agenda: "tranquila" as Agenda,
} as const;

// ── Limites dos sliders ──
export const LIMITES = {
  corteAvulso: { min: 20, max: 200, step: 5 },
  cadeiras: { min: 1, max: 12, step: 1 },
  comissaoPct: { min: 20, max: 60, step: 5 },
} as const;

/** Situação da agenda — desloca a recomendação dentro da faixa saudável. */
export type Agenda = "tranquila" | "movimentada" | "lotada";

export const AGENDA_OPCOES: { value: Agenda; label: string; hint: string }[] = [
  { value: "tranquila", label: "Sobra horário", hint: "Preço mais convidativo — prioridade é encher a agenda" },
  { value: "movimentada", label: "Movimentada", hint: "Meio da faixa saudável" },
  { value: "lotada", label: "Quase lotada", hint: "Topo da faixa — você pode cobrar mais" },
];

export interface CalcInputs {
  corteAvulso: number;
  cadeiras: number;
  comissaoPct: number;
  agenda: Agenda;
}

export interface CalcResult {
  /** Teto da Regra dos 2 Cortes (2 × corte avulso). */
  teto: number;
  /** Faixa saudável de mensalidade (piso "uau" → topo logo abaixo do teto). */
  faixaMin: number;
  faixaMax: number;
  /** Mensalidade recomendada (posição na faixa conforme a agenda). */
  mensalidade: number;
  /** Ganho do barbeiro por assinante/mês (comissão × mensalidade). */
  ganhoBarbeiroAssinante: number;
  /** Margem da barbearia por assinante/mês (o que sobra após a comissão). */
  margemAssinante: number;
  /** Quanto sai cada visita do assinante (mensalidade ÷ frequência 2–3). */
  visitaMin: number;
  visitaMax: number;
  /** Carteira projetada com agenda de clube cheia (referência do método). */
  carteiraTotal: number;
  /** Receita recorrente/mês da carteira projetada. */
  receitaRecorrente: number;
  /** Margem da barbearia/mês na carteira projetada. */
  margemMensal: number;
  /** Comissão total do time/mês na carteira projetada. */
  comissaoTimeMensal: number;
  /** Ganho de UM barbeiro/mês com a carteira dele cheia. */
  ganhoBarbeiroMes: number;
}

/**
 * Arredonda para o preço psicológico ",90" mais próximo (múltiplo de R$5 − 10
 * centavos): 68 → 69,90 · 72 → 69,90 · 75,2 → 74,90 · 80 → 79,90.
 */
function preco90(v: number): number {
  return Math.max(Math.round(v / 5) * 5 - 0.1, 9.9);
}

export function calcular(inputs: CalcInputs): CalcResult {
  const corte = Math.max(0, inputs.corteAvulso);
  const cadeiras = Math.max(1, Math.round(inputs.cadeiras));
  const comissao = clamp(inputs.comissaoPct, 0, 100) / 100;

  const teto = 2 * corte;
  // Piso "uau": ~12,5% abaixo do teto (corte R$40 → faixa R$69,90–R$79,90).
  const faixaMin = preco90(teto * 0.875);
  const faixaMax = preco90(teto);
  const meio = preco90(teto * 0.9375);

  const mensalidade =
    inputs.agenda === "tranquila" ? faixaMin : inputs.agenda === "lotada" ? faixaMax : meio;

  const ganhoBarbeiroAssinante = mensalidade * comissao;
  const margemAssinante = mensalidade - ganhoBarbeiroAssinante;

  const visitaMin = mensalidade / METODO.frequenciaMax;
  const visitaMax = mensalidade / METODO.frequenciaMin;

  const carteiraTotal = cadeiras * METODO.assinantesPorBarbeiroRef;
  const receitaRecorrente = carteiraTotal * mensalidade;
  const comissaoTimeMensal = receitaRecorrente * comissao;
  const margemMensal = receitaRecorrente - comissaoTimeMensal;
  const ganhoBarbeiroMes = METODO.assinantesPorBarbeiroRef * mensalidade * comissao;

  return {
    teto,
    faixaMin,
    faixaMax,
    mensalidade,
    ganhoBarbeiroAssinante,
    margemAssinante,
    visitaMin,
    visitaMax,
    carteiraTotal,
    receitaRecorrente,
    margemMensal,
    comissaoTimeMensal,
    ganhoBarbeiroMes,
  };
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Formata R$ sem centavos (pt-BR) — para totais grandes. */
export function brl(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

/** Formata R$ com centavos (pt-BR) — para preços ",90". */
export function brl2(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
