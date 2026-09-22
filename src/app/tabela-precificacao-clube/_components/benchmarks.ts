// Tabela de Precificação de Clubes — números de referência.
// Mesma disciplina da calculadora-prejuizo (REGRA DE VERACIDADE): cada número
// carrega sua categoria e é rotulado na UI. Nada aqui é dado da base do lead.

// ── 1. REAIS — agregados OFICIAIS de divulgação ──
// Revisado em 19/Set/26: este bloco publicava os números INTERNOS da base
// (1.297 barbearias, 47.793 assinantes, 622 com clube, 48% de adoção, R$72,3M
// movimentados). Agregado de clube em peça pública só pode ser o conjunto
// oficial — 1.200+ barbearias · 51.000+ assinantes · R$5M+/mês · 6M+
// agendamentos/mês (knowledge/marketing/instagram-voz-do-time.md §9) — e o
// guard de publish rejeita "1.297", "47 mil" e "48 mil" por nome
// (knowledge/marketing/stories-instagram-playbook.md §7).
export const REAIS = {
  /** Barbearias ativas na plataforma (agregado oficial). */
  barbeariasAtivas: 1200,
  /** Assinantes ativos na plataforma (agregado oficial). */
  assinantesAtivos: 51000,
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
