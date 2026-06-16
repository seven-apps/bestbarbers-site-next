// Dados reais da base BestBarbers — fonte: API v4 internal-analytics — coletado em 16/06/2026

/**
 * Calculadora de Prejuízo — números de referência.
 *
 * Há três categorias, com rotulagem distinta na UI (REGRA DE VERACIDADE):
 *
 *  1. REAIS  — verificados ao vivo na base de produção (jun/2026). Exibir como
 *              prova social/autoridade real. NÃO afirmar como "dado da SUA base".
 *  2. CASE   — case real anonimizado (Pirajussara). Rotular "case real".
 *  3. MERCADO— afirmação de mercado/case, NÃO dado da base. Rotular como tal.
 */

// ── 1. REAIS — base BestBarbers (jun/2026) ──
export const REAIS = {
  /** Barbearias ativas na plataforma. */
  barbeariasAtivas: 1297,
  /** Assinantes ativos somados na base (real verificado — substitui o antigo 51K). */
  assinantesAtivos: 47793,
  /** Barbearias que já operam clube de assinaturas. */
  barbeariasComClube: 622,
  /** % das barbearias com clube (622 / 1297 ≈ 48%). */
  percentualComClube: 48,
  /** Volume total já movimentado em clubes de assinatura (R$). */
  movimentadoClube: 72_300_000,
  /** Ticket médio mensal de assinante — REAL verificado (R$128,14). Base da projeção. */
  ticketAssinatura: 128,
  /** Média de assinantes ativos por barbearia com clube (47.793 / 622 ≈ 77). */
  assinantesMediaPorClube: 77,
  /** Retenção média do assinante, em meses. */
  retencaoMeses: 12,
} as const;

// ── 2. CASE — case real anonimizado ──
export const CASE = {
  /** Pirajussara, 4 cadeiras: faturamento antes → depois do clube (≈2x). */
  cadeiras: 4,
  antes: 15892,
  depois: 31690,
} as const;

// ── 3. MERCADO — afirmação de mercado/case (NÃO é dado da base) ──
export const MERCADO = {
  /** "A cada corte sem recorrência, ~R$1,95 de prejuízo" — afirmação de mercado. */
  prejuizoPorCorte: 1.95,
} as const;
