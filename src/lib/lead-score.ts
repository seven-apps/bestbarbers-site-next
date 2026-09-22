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
  'Já tenho o clube, integrado no meu sistema de gestão',
  'Já tenho o clube, mas gerencio manualmente',
  'Ainda não tenho, mas tenho muito interesse em implementar',
  'Ainda não tenho, mas quero entender melhor como funciona',
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
  'Já tenho o clube, integrado no meu sistema de gestão': 25,
  'Já tenho o clube, mas gerencio manualmente': 25,
  'Ainda não tenho, mas tenho muito interesse em implementar': 25,
  'Ainda não tenho, mas quero entender melhor como funciona': 0,
  'Não tenho nenhum interesse em clube de assinaturas': 0,
};

/** Quem trabalha sozinho fechou 1 venda em 21 reuniões, contra 16 em 52 de quem tem 2 a 4 (medido em 10/Set/26). */
const PONTOS_PROFISSIONAIS: Record<Profissionais, number> = {
  'Sou apenas eu': -20,
  '2 profissionais': 0,
  '3 a 4 profissionais': 10,
  '5 ou mais profissionais': 15,
};

/**
 * TEM EQUIPE? — a variável que o A/B de set/26 compra (célula B otimiza o evento
 * `LeadComEquipe`). Espelha `PONTOS_PROFISSIONAIS` de propósito: `Record<Profissionais, …>`
 * exaustivo faz o compilador COBRAR a decisão se uma quinta opção entrar em
 * `PROFISSIONAIS_OPCOES` — com uma negação (`!== 'Sou apenas eu'`) a opção nova entraria
 * como "tem equipe" em silêncio, e o evento passaria a medir outra coisa no meio do teste.
 *
 * NÃO é um score mais duro: medido em 19/Set, "Sou apenas eu" + R$ 10-30 mil + quer clube +
 * usa sistema dá score 60 exato (50 + 25 − 20 + 5), ou seja o corte Q60 COMPRA dono sozinho.
 * Equipe e score são perguntas ortogonais, e é por isso que o teste vale a pena.
 */
export const EQUIPE_POR_OPCAO: Record<Profissionais, boolean> = {
  'Sou apenas eu': false,
  '2 profissionais': true,
  '3 a 4 profissionais': true,
  '5 ou mais profissionais': true,
};

/**
 * Devolve true só para as respostas que AFIRMAM 2 ou mais profissionais.
 *
 * Desconhecido é `false`, nunca `true` — mesma regra que `calcularScoreV2` já aplica ao
 * devolver `null` em vez de 0: ausência de resposta não vira valor. Isso cobre três casos
 * vivos hoje: campo vazio (o `validateForm` do useLeadForm barra, mas este helper é público
 * e a próxima LP que tornar a pergunta opcional não pode quebrar o evento em silêncio), o
 * vocabulário legado da V11 ("2 a 4 colaboradores") e o número livre da V5/MultiStepForm
 * ("4") — os mesmos que `calcularScoreV2` já recusa pontuar.
 *
 * `Object.hasOwn` e não `in`: o `in` enxerga a cadeia de protótipos, então
 * `temEquipe('constructor')` devolveria a FUNÇÃO herdada de Object.prototype — que é
 * truthy e faria o evento disparar, com o TypeScript jurando que o retorno é boolean
 * (a assinatura mente, o runtime não). Exótico, mas este helper existe exatamente para
 * garantir que desconhecido nunca vira true, e "quase sempre" não serve como garantia.
 */
export function temEquipe(profissionais?: string): boolean {
  if (!profissionais) return false;
  return Object.hasOwn(EQUIPE_POR_OPCAO, profissionais)
    ? EQUIPE_POR_OPCAO[profissionais as Profissionais]
    : false;
}

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
