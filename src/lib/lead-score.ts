/**
 * Lead score v2 — escala graduada decidida pelo André em 11-14/Set/26.
 *
 * Fonte da régua: bestbarbers-ai/docs/operacional/formulario-score-v2-set26/PLANO.md §2.1.
 * Dois pontos fixos que o André deu: o cenário supremo (acima de R$ 30 mil + quer clube +
 * 5 ou mais profissionais + usa sistema) vale 100, e o piso do ICP é 70.
 *
 * O score v2 SUBSTITUI o v1 no mesmo campo do Ploomes (`bb_lead_score`) e no `[SCORE: n]`
 * da descrição da campanha — decisão dele em 14/Set: nada de campo paralelo nem de campo de
 * versão, a data do deploy marca a era. Os eventos da Meta (Lead, QualifiedLead,
 * QualifiedLead60) continuam com os mesmos nomes; só o número por trás muda.
 */

export const FATURAMENTO_OPCOES = [
  'Até R$ 2.000',
  'De R$ 2.001 a R$ 5.000',
  'De R$ 5.001 a R$ 10.000',
  'De R$ 10.001 a R$ 30.000',
  'Acima de R$ 30.000',
] as const;

export const CLUBE_OPCOES = [
  'Já tenho o clube de assinaturas implementado na minha barbearia, integrado com o meu sistema',
  'Já tenho o clube de assinaturas na minha barbearia, mas gerencio manualmente',
  'Ainda não tenho o clube implementado, mas tenho muito interesse em implementar',
  'Ainda não tenho o clube, mas quero entender melhor como funciona',
  'Não tenho nenhum interesse em clube de assinaturas',
] as const;

/** Lista com os nomes — exceção datada do André (14/Set/26): nome de concorrente pode em OPÇÃO DE FORMULÁRIO, nunca em conteúdo publicado. */
export const SISTEMA_OPCOES = [
  'Não utilizo nenhum',
  'AppBarber',
  'Booksy',
  'Cash Barber',
  'Fresha',
  'One Beleza',
  'Trinks',
  'Utilizo outro',
] as const;

export const PROFISSIONAIS_OPCOES = [
  'Sou apenas eu',
  '2 profissionais',
  '3 a 4 profissionais',
  '5 ou mais profissionais',
] as const;

export type Faturamento = (typeof FATURAMENTO_OPCOES)[number];
export type SituacaoClube = (typeof CLUBE_OPCOES)[number];
export type SistemaAtual = (typeof SISTEMA_OPCOES)[number];
export type Profissionais = (typeof PROFISSIONAIS_OPCOES)[number];

export interface RespostasV2 {
  faturamento?: string;
  clube?: string;
  profissionais?: string;
  sistema?: string;
}

const PONTOS_FATURAMENTO: Record<Faturamento, number> = {
  'Até R$ 2.000': -100,
  'De R$ 2.001 a R$ 5.000': 5,
  'De R$ 5.001 a R$ 10.000': 20,
  'De R$ 10.001 a R$ 30.000': 50,
  'Acima de R$ 30.000': 55,
};

/** Ter clube ou querer vale o mesmo (decisão D3). "Quero entender melhor" e "nenhum interesse" valem 0 (decisão de 12/Set). */
const PONTOS_CLUBE: Record<SituacaoClube, number> = {
  'Já tenho o clube de assinaturas implementado na minha barbearia, integrado com o meu sistema': 25,
  'Já tenho o clube de assinaturas na minha barbearia, mas gerencio manualmente': 25,
  'Ainda não tenho o clube implementado, mas tenho muito interesse em implementar': 25,
  'Ainda não tenho o clube, mas quero entender melhor como funciona': 0,
  'Não tenho nenhum interesse em clube de assinaturas': 0,
};

/** Quem trabalha sozinho fechou 1 venda em 21 reuniões, contra 16 em 52 de quem tem 2 a 4 (medido em 10/Set/26). */
const PONTOS_PROFISSIONAIS: Record<Profissionais, number> = {
  'Sou apenas eu': -20,
  '2 profissionais': 0,
  '3 a 4 profissionais': 10,
  '5 ou mais profissionais': 15,
};

const PONTOS_SISTEMA = 5;

const PISO = -100;
const TETO = 100;

/** ICP: a régua da casa continua sendo 70. */
export const CORTE_ICP = 70;
export const CORTE_QUALIFICADO_60 = 60;
export const CORTE_QUALIFICADO = 30;

/**
 * Score v2. Devolve null (nunca 0) quando falta faturamento, clube ou profissionais:
 * quem não respondeu não é "score zero", é "sem score" — o canal "já conhece a BestBarbers"
 * marca reunião em 16,8% sem responder nada.
 */
export function calcularScoreV2(r: RespostasV2): number | null {
  const faturamento = r.faturamento as Faturamento | undefined;
  const clube = r.clube as SituacaoClube | undefined;
  const profissionais = r.profissionais as Profissionais | undefined;
  if (!faturamento || !clube || !profissionais) return null;
  if (!(faturamento in PONTOS_FATURAMENTO) || !(clube in PONTOS_CLUBE) || !(profissionais in PONTOS_PROFISSIONAIS)) return null;

  const usaSistema = Boolean(r.sistema) && r.sistema !== 'Não utilizo nenhum';
  const soma =
    PONTOS_FATURAMENTO[faturamento] +
    PONTOS_CLUBE[clube] +
    PONTOS_PROFISSIONAIS[profissionais] +
    (usaSistema ? PONTOS_SISTEMA : 0);

  return Math.max(PISO, Math.min(TETO, soma));
}

/**
 * Texto `[Interesse: ...]` que a descrição da campanha carrega desde 2026 — os leitores
 * legados (funil por origem, painéis, template do SDR) casam por essas duas strings exatas,
 * então a pergunta nova é traduzida para elas. Quem tem ou quer clube cai no lado do app.
 */
export function interesseLegado(clube?: string): string {
  const pontos = PONTOS_CLUBE[clube as SituacaoClube];
  return pontos && pontos > 0
    ? 'Meu Próprio App + Clube de Assinaturas e emissão de NFs'
    : 'Agenda e Controle Financeiro';
}

/** Faixas antigas, para quem ainda compara séries antes e depois da virada. */
export function faturamentoLegado(faturamento?: string): string | undefined {
  switch (faturamento) {
    case 'Até R$ 2.000':
      return 'Até R$ 2.000';
    case 'De R$ 2.001 a R$ 5.000':
    case 'De R$ 5.001 a R$ 10.000':
      return 'R$ 2.000 a R$ 10.000';
    case 'De R$ 10.001 a R$ 30.000':
      return 'De R$ 10.000 a R$ 30.000';
    case 'Acima de R$ 30.000':
      return 'Acima de R$ 30.000';
    default:
      return undefined;
  }
}

export function profissionaisLegado(profissionais?: string): string | undefined {
  switch (profissionais) {
    case 'Sou apenas eu':
      return 'Sou apenas eu';
    case '2 profissionais':
    case '3 a 4 profissionais':
      return '2 a 4 colaboradores';
    case '5 ou mais profissionais':
      return '5 ou mais colaboradores';
    default:
      return undefined;
  }
}
