/**
 * Calculadora de Prejuízo — números de referência.
 *
 * REGRA DE VERACIDADE, revisada em 19/Set/26.
 *
 * A versão anterior deste arquivo publicava os números INTERNOS da base
 * (1.297 barbearias, 47.793 assinantes, 622 com clube, 48% de adoção,
 * R$72,3M movimentados, ~77 assinantes por clube, permanência de 12 meses)
 * e a "afirmação de mercado" de R$1,95 de prejuízo por corte. Todos são
 * proibidos em peça pública:
 *
 *  - agregado de clube em peça pública só pode ser o conjunto oficial de
 *    divulgação — 1.200+ barbearias · 51.000+ assinantes · R$5M+/mês ·
 *    6M+ agendamentos/mês (instagram-voz-do-time.md §9);
 *  - o guard de publish rejeita por nome "1.297", "47 mil" e "48 mil"
 *    (stories-instagram-playbook.md §7), e bane "R$1,95/corte";
 *  - retenção, LTV e permanência são argumento INTERNO de fechamento,
 *    nunca peça pública (decisão do CEO, 14/Jul/26).
 *
 * O case Pirajussara (R$15.892 → R$31.690) também saiu: está declarado
 * morto em clube-arsenal.md por editorial não reconciliado, e nenhum case
 * do banco vivo bate com ele.
 */

// ── 1. PÚBLICOS — agregados oficiais de divulgação ──
export const PUBLICOS = {
  /** Barbearias ativas na plataforma (agregado oficial de divulgação). */
  barbeariasAtivas: 1200,
  /** Assinantes ativos na plataforma (agregado oficial de divulgação). */
  assinantesAtivos: 51000,
} as const;

// ── 2. PREMISSA da projeção ──
export const PREMISSAS = {
  /**
   * Valor mensal do plano de clube usado na projeção.
   *
   * ATENÇÃO: isto é uma PREMISSA da conta, não um dado publicável da base.
   * A UI deve apresentá-lo como "premissa" e jamais como "ticket médio real
   * verificado". Pendência registrada para o André: virar slider, para que o
   * dono use o preço do plano dele em vez do nosso número.
   */
  planoClubeMes: 128,
} as const;

// ── 3. CASE — case real anonimizado do banco vivo ──
/** bb#13285 — knowledge/dominio/cases-clube.json (crivel: true, bloqueio: null). */
export const CASE = {
  cadeiras: 4,
  cidade: "Araxá/MG",
  antes: 9249,
  depois: 30447,
  assinantesAntes: 99,
  assinantesDepois: 277,
  janelaMeses: 19,
} as const;
