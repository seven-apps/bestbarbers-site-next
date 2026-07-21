// Tabela de Precificação de Clubes — números de referência.
// Mesma disciplina da calculadora-prejuizo (REGRA DE VERACIDADE): cada número
// carrega sua categoria e é rotulado na UI. Nada aqui é dado da base do lead.

// ── 1. REAIS — base BestBarbers (verificados em jun/2026) ──
export const REAIS = {
  /** Barbearias ativas na plataforma. */
  barbeariasAtivas: 1297,
  /** Assinantes ativos somados na base. */
  assinantesAtivos: 47793,
  /** Barbearias que já operam clube de assinaturas. */
  barbeariasComClube: 622,
  /** % das barbearias com clube (622 / 1297 ≈ 48%). */
  percentualComClube: 48,
  /** Volume total já movimentado em clubes de assinatura (R$). */
  movimentadoClube: 72_300_000,
} as const;

// ── 2. MÉTODO — referências de quem aplica clube há anos (NÃO são dados da base) ──
// Rotular sempre como "referência de mercado/do método" na UI.
export const METODO = {
  /** Frequência típica do assinante: 2 a 3 visitas/mês (referência de mercado). */
  frequenciaMin: 2,
  frequenciaMax: 3,
  /**
   * Carteira de assinantes que lota a agenda de UM barbeiro (referência do
   * método: 40 a 70; usamos o ponto médio conservador para a projeção).
   */
  assinantesPorBarbeiroMin: 40,
  assinantesPorBarbeiroMax: 70,
  assinantesPorBarbeiroRef: 50,
} as const;
