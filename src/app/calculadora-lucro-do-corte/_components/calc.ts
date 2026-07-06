/**
 * Calculadora de Lucro por Corte — motor de cálculo
 *
 * REGRA DE VERACIDADE (projeto): TODOS os números do resultado vêm do próprio
 * usuário (ele digita nos sliders). Não há dado fabricado nem afirmação sobre a
 * base de produção. A conta é 100% transparente e está exposta em `calcular()`.
 *
 * A ideia central: faturamento não é lucro. O corte só dá dinheiro depois que
 * você desconta o produto gasto, a comissão do barbeiro e a fatia do custo fixo
 * (aluguel, luz, água, internet) que cada atendimento precisa carregar.
 */

// ── Premissas DEFAULT (ajustáveis pelo usuário) ──
// Com estes defaults o resultado é um LUCRO pequeno (~R$7,70/corte) — realista.
// Não forçamos prejuízo: o usuário descobre o dele ao ajustar os sliders.
export const DEFAULTS = {
  /** Preço cobrado no corte (R$). */
  precoCorte: 40,
  /** Custo de produto gasto por corte: lâmina, gel, etc. (R$). */
  custoProduto: 3,
  /** % de comissão do barbeiro sobre o corte. */
  comissaoPct: 40,
  /** Custos fixos no mês: aluguel + luz + água + internet (R$). */
  custoFixoMes: 4000,
  /** Nº de atendimentos no mês. */
  atendimentosMes: 300,
} as const;

// ── Limites dos sliders ──
export const LIMITES = {
  precoCorte: { min: 15, max: 150, step: 5 },
  custoProduto: { min: 0, max: 30, step: 1 },
  comissaoPct: { min: 0, max: 60, step: 5 },
  custoFixoMes: { min: 500, max: 30000, step: 100 },
  atendimentosMes: { min: 50, max: 2000, step: 10 },
} as const;

export interface CalcInputs {
  precoCorte: number;
  custoProduto: number;
  comissaoPct: number;
  custoFixoMes: number;
  atendimentosMes: number;
}

export interface CalcResult {
  /** R$ de comissão do barbeiro por corte (precoCorte × comissao%). */
  comissaoValor: number;
  /** Fatia do custo fixo do mês que cada atendimento carrega. */
  custoFixoPorAtendimento: number;
  /** Custo real de um corte: produto + comissão + fatia do fixo. */
  custoRealCorte: number;
  /** O que sobra (ou falta) em cada corte: preço − custo real. */
  lucroPorCorte: number;
  /** Margem sobre o preço do corte, em %. */
  margemPct: number;
  /** Resultado no mês: lucro por corte × atendimentos (lucro OU prejuízo mensal). */
  resultadoMes: number;
  /** true quando o corte dá prejuízo (lucroPorCorte < 0). */
  ehPrejuizo: boolean;
}

/**
 * Calcula o lucro por corte. Fórmula 100% transparente:
 *
 *  comissaoValor            = precoCorte × comissao%
 *  custoFixoPorAtendimento  = atendimentosMes > 0 ? custoFixoMes / atendimentosMes : 0
 *  custoRealCorte           = custoProduto + comissaoValor + custoFixoPorAtendimento
 *  lucroPorCorte            = precoCorte − custoRealCorte
 *  margemPct                = precoCorte > 0 ? (lucroPorCorte / precoCorte) × 100 : 0
 *  resultadoMes             = lucroPorCorte × atendimentosMes
 *  ehPrejuizo               = lucroPorCorte < 0
 */
export function calcular(inputs: CalcInputs): CalcResult {
  const precoCorte = Math.max(0, inputs.precoCorte);
  const custoProduto = Math.max(0, inputs.custoProduto);
  const comissao = clamp(inputs.comissaoPct, 0, 100) / 100;
  const custoFixoMes = Math.max(0, inputs.custoFixoMes);
  const atendimentosMes = Math.max(0, inputs.atendimentosMes);

  const comissaoValor = precoCorte * comissao;
  const custoFixoPorAtendimento =
    atendimentosMes > 0 ? custoFixoMes / atendimentosMes : 0;
  const custoRealCorte = custoProduto + comissaoValor + custoFixoPorAtendimento;
  const lucroPorCorte = precoCorte - custoRealCorte;
  const margemPct = precoCorte > 0 ? (lucroPorCorte / precoCorte) * 100 : 0;
  const resultadoMes = lucroPorCorte * atendimentosMes;
  const ehPrejuizo = lucroPorCorte < 0;

  return {
    comissaoValor,
    custoFixoPorAtendimento,
    custoRealCorte,
    lucroPorCorte,
    margemPct,
    resultadoMes,
    ehPrejuizo,
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

/** Formata R$ com 2 casas decimais (pt-BR) — para valores por corte (centavos importam). */
export function brl2(n: number): string {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
