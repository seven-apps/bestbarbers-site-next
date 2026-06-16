/**
 * Calculadora de Prejuízo — motor de cálculo
 *
 * REGRA DE VERACIDADE (projeto): todos os números de base são CASES/ESTIMATIVAS
 * validadas da BestBarbers, NÃO dados ao vivo da base do usuário. As premissas
 * abaixo são exibidas na UI e (as principais) ajustáveis por slider. O resultado
 * é uma PROJEÇÃO transparente, nunca uma afirmação sobre a operação real do lead.
 */

// ── Constantes de prova social (cases reais BestBarbers — rotular sempre) ──
export const PROVA = {
  /** Assinantes ativos somados na base BestBarbers (case agregado). */
  assinantesAtivos: 51000,
  /** Barbearias usando a plataforma (case agregado). */
  barbearias: 1200,
  /** Ticket médio mensal de um assinante de clube (case validado). */
  ticketAssinante: 128,
  /** Visitas médias/mês de um assinante (case validado — desmonta o medo de "vir todo dia"). */
  visitasAssinanteMes: 2.1,
  /** Case de 4 cadeiras: faturamento antes → depois do clube (≈2x). */
  caseAntes: 15892,
  caseDepois: 31690,
} as const;

// ── Premissas DEFAULT da projeção (ajustáveis pelo usuário) ──
export const DEFAULTS = {
  cadeiras: 3,
  clientesMes: 320,
  ticketAvulso: 45,
  /** % de clientes que voltam todo mês hoje (recorrência atual estimada). */
  recorrenciaAtualPct: 30,
  /** % dos clientes que viraria assinante na projeção COM clube. */
  conversaoClubePct: 25,
} as const;

// ── Limites dos sliders ──
export const LIMITES = {
  cadeiras: { min: 1, max: 12, step: 1 },
  clientesMes: { min: 40, max: 2000, step: 10 },
  ticketAvulso: { min: 20, max: 200, step: 5 },
  recorrenciaAtualPct: { min: 0, max: 80, step: 5 },
  conversaoClubePct: { min: 5, max: 60, step: 5 },
} as const;

export interface CalcInputs {
  cadeiras: number;
  clientesMes: number;
  ticketAvulso: number;
  recorrenciaAtualPct: number;
  conversaoClubePct: number;
}

export interface CalcResult {
  /** Faturamento atual estimado/mês (clientes × ticket avulso). */
  faturamentoAtual: number;
  /** Nº de clientes que NÃO voltam de forma previsível hoje. */
  clientesSemRecorrencia: number;
  /**
   * "Prejuízo invisível"/mês: a receita previsível que esses clientes não-fidelizados
   * deixariam SE virassem assinantes. É o custo de oportunidade da ausência de recorrência.
   */
  prejuizoInvisivel: number;
  /** Nº de assinantes projetados COM clube (fração dos clientes atuais). */
  assinantesProjetados: number;
  /** Receita recorrente/mês vinda do clube na projeção. */
  receitaRecorrenteClube: number;
  /** Receita avulsa restante (clientes que não viram assinantes). */
  receitaAvulsaRestante: number;
  /** Faturamento total projetado COM clube. */
  faturamentoComClube: number;
  /** GAP: faturamentoComClube − faturamentoAtual (o que está deixando na mesa). */
  gapMensal: number;
  /** GAP anualizado. */
  gapAnual: number;
  /** Multiplicador de faturamento projetado (ex.: 1,9x). */
  multiplicador: number;
}

/**
 * Calcula a projeção. Fórmula 100% transparente:
 *
 *  faturamentoAtual         = clientesMes × ticketAvulso
 *  clientesSemRecorrencia   = clientesMes × (1 − recorrenciaAtual%)
 *  prejuizoInvisivel        = clientesSemRecorrencia × (ticketAssinante − ticketAvulso),
 *                             pisado em 0 (se o avulso já paga mais que o assinante, não há "perda")
 *  assinantesProjetados     = clientesMes × conversaoClube%
 *  receitaRecorrenteClube   = assinantesProjetados × ticketAssinante (R$128, case)
 *  receitaAvulsaRestante    = (clientesMes − assinantesProjetados) × ticketAvulso
 *  faturamentoComClube      = receitaRecorrenteClube + receitaAvulsaRestante
 *  gapMensal                = faturamentoComClube − faturamentoAtual
 */
export function calcular(inputs: CalcInputs): CalcResult {
  const clientesMes = Math.max(0, inputs.clientesMes);
  const ticketAvulso = Math.max(0, inputs.ticketAvulso);
  const recorrencia = clamp(inputs.recorrenciaAtualPct, 0, 100) / 100;
  const conversao = clamp(inputs.conversaoClubePct, 0, 100) / 100;

  const faturamentoAtual = clientesMes * ticketAvulso;

  const clientesSemRecorrencia = Math.round(clientesMes * (1 - recorrencia));
  const prejuizoInvisivel = Math.max(
    0,
    Math.round(clientesSemRecorrencia * (PROVA.ticketAssinante - ticketAvulso))
  );

  const assinantesProjetados = Math.round(clientesMes * conversao);
  const receitaRecorrenteClube = assinantesProjetados * PROVA.ticketAssinante;
  const receitaAvulsaRestante =
    Math.max(0, clientesMes - assinantesProjetados) * ticketAvulso;
  const faturamentoComClube = receitaRecorrenteClube + receitaAvulsaRestante;

  const gapMensal = Math.max(0, faturamentoComClube - faturamentoAtual);
  const gapAnual = gapMensal * 12;
  const multiplicador =
    faturamentoAtual > 0 ? faturamentoComClube / faturamentoAtual : 0;

  return {
    faturamentoAtual,
    clientesSemRecorrencia,
    prejuizoInvisivel,
    assinantesProjetados,
    receitaRecorrenteClube,
    receitaAvulsaRestante,
    faturamentoComClube,
    gapMensal,
    gapAnual,
    multiplicador,
  };
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Formata R$ sem casas decimais (pt-BR). */
export function brl(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
