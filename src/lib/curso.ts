/**
 * CURSO DE ASSINATURA — a lógica pura da área do aluno.
 *
 * Contrato: `02-contrato-tecnico.md` (bestbarbers-ai, `docs/operacional/marketing-vendas-out26/
 * curso-assinatura/`). Aqui moram as regras que a tela segue e que dá para testar sem navegador:
 *   - o estado do aluno que o OS devolve (`GET /api/curso/aluno`), lido com desconfiança;
 *   - o link pessoal no fragmento (`#t=…&aula=…&abrir=…`);
 *   - a fração REALMENTE assistida de cada vídeo e os marcos 0/25/50/90/100;
 *   - a ficha de cada aula: dos campos da tela para as `respostas` do contrato (§5), e de volta;
 *   - os derivados (teto, conta do ano, pote) e o plano montado da tela final;
 *   - moeda e data no formato do 03 ("R$ 1.138,80", "14/10/2026").
 *
 * Sem React e sem `@/`: o `node --test` (npm test) carrega direto. A tela só orquestra.
 */

import { NUMEROS_AULA, ROTULOS_DO_PLANO, type NumeroAula } from "../content/curso-assinatura.ts";

// ─── Tipos do contrato (§4.1 e §5) ──────────────────────────────────────────────────────────

export type Marco = 0 | 25 | 50 | 90 | 100;
export const MARCOS: ReadonlyArray<Marco> = [0, 25, 50, 90, 100];

export type ComoCobraHoje = "nao_cobra" | "pix" | "cartao_por_fora" | "sistema";
export type AgendaFicha = "sobra_horario" | "movimentada" | "quase_lotada";
export type UnidadeComissao = "reais_por_venda" | "percentual";

export interface PlanoDaFicha {
  nome: string;
  preco: number;
  oQueEntra: string;
}
export interface PesoDoServico {
  servico: string;
  pontos: number;
}
export interface ComissaoDeVenda {
  paga: boolean;
  valor?: number;
  unidade?: UnidadeComissao;
}

export interface Ficha1 { precoCorte?: number; diasRetorno?: number }
export interface Ficha2 { comoCobraHoje?: ComoCobraHoje; atrasados?: number | null }
export interface Ficha3 { agenda?: AgendaFicha; planos?: PlanoDaFicha[] }
export interface Ficha4 { receitaAssinaturaMes?: number; percentualPote?: number; pesos?: PesoDoServico[] }
export interface Ficha5 { dataReuniaoEquipe?: string; comissaoDeVenda?: ComissaoDeVenda }
export interface Ficha6 { dataLancamento?: string; tamanhoPrimeiroLote?: number; listaDeEspera?: string; dataQuerComecar?: string }

export interface FichasPorAula {
  1: Ficha1;
  2: Ficha2;
  3: Ficha3;
  4: Ficha4;
  5: Ficha5;
  6: Ficha6;
}

/** Calculados NO SERVIDOR (§4.3): a tela, o e-mail e o card mostram o mesmo número. */
export interface Derivados {
  visitasNoAno?: number;
  valorNoAno?: number;
  tetoDoPlano?: number;
  poteEstimado?: number;
  assinaturaNoAno?: number;
}

export interface AulaDoAluno {
  numero: NumeroAula;
  /** Maior marco registrado; `null` = nunca deu play. */
  marco: Marco | null;
  /** Marco ≥ 90. */
  concluida: boolean;
  ficha: Record<string, unknown> | null;
  derivados: Derivados | null;
  fichaSalvaEm: string | null;
}

export type TipoSinalExplicito = "quero_isso" | "data_inicio";

export interface EstadoAluno {
  aluno: {
    codigo: string;
    primeiroNome: string;
    email: string | null;
    /** Já formatado pelo OS: "(31) 97226-8877". */
    whatsapp: string;
    temAssinatura: boolean;
  };
  /** Sempre as 6, em ordem. */
  aulas: AulaDoAluno[];
  aulasConcluidas: number;
  /** Menor aula não concluída; 7 = todas. */
  proximaAula: number;
  plano: { assinaturaNoAno: number | null };
  dataQuerComecar: string | null;
  /** O 1º sinal EXPLÍCITO ("quero isso" ou data). A aula 3 concluída não conta aqui. */
  sinal: { tipo: TipoSinalExplicito; em: string } | null;
  terminou: boolean;
  emailsLigados: boolean;
}

const ehObjeto = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const numeroOuNull = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const textoOuNull = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v : null);

function lerMarco(v: unknown): Marco | null {
  return MARCOS.includes(v as Marco) ? (v as Marco) : null;
}

function lerDerivados(v: unknown): Derivados | null {
  if (!ehObjeto(v)) return null;
  const d: Derivados = {};
  for (const chave of ["visitasNoAno", "valorNoAno", "tetoDoPlano", "poteEstimado", "assinaturaNoAno"] as const) {
    const n = numeroOuNull(v[chave]);
    if (n !== null) d[chave] = n;
  }
  return d;
}

/**
 * Lê a resposta do `GET /api/curso/aluno` com desconfiança: o que não bate com o contrato vira
 * `null` (a tela mostra o erro), e campo opcional ausente ganha o valor neutro. Aula que faltar
 * na lista nasce vazia — a tela sempre tem as 6.
 */
export function lerEstadoAluno(json: unknown): EstadoAluno | null {
  if (!ehObjeto(json) || !ehObjeto(json.aluno) || !Array.isArray(json.aulas)) return null;
  const a = json.aluno;
  if (typeof a.codigo !== "string" || !a.codigo) return null;

  const porNumero = new Map<number, Record<string, unknown>>();
  for (const item of json.aulas) {
    if (ehObjeto(item) && typeof item.numero === "number") porNumero.set(item.numero, item);
  }
  const aulas: AulaDoAluno[] = NUMEROS_AULA.map((numero) => {
    const item = porNumero.get(numero) ?? {};
    const marco = lerMarco(item.marco);
    return {
      numero,
      marco,
      concluida: marco !== null && marco >= 90,
      ficha: ehObjeto(item.ficha) ? item.ficha : null,
      derivados: lerDerivados(item.derivados),
      fichaSalvaEm: textoOuNull(item.fichaSalvaEm),
    };
  });

  const concluidas = aulas.filter((x) => x.concluida).length;
  const proxima = aulas.find((x) => !x.concluida)?.numero ?? 7;
  const sinal = ehObjeto(json.sinal) && (json.sinal.tipo === "quero_isso" || json.sinal.tipo === "data_inicio") && typeof json.sinal.em === "string"
    ? { tipo: json.sinal.tipo as TipoSinalExplicito, em: json.sinal.em }
    : null;

  return {
    aluno: {
      codigo: a.codigo,
      primeiroNome: textoOuNull(a.primeiroNome) ?? "",
      email: textoOuNull(a.email),
      whatsapp: textoOuNull(a.whatsapp) ?? "",
      temAssinatura: a.temAssinatura === true,
    },
    aulas,
    aulasConcluidas: typeof json.aulasConcluidas === "number" ? json.aulasConcluidas : concluidas,
    proximaAula: typeof json.proximaAula === "number" ? json.proximaAula : proxima,
    plano: { assinaturaNoAno: ehObjeto(json.plano) ? numeroOuNull(json.plano.assinaturaNoAno) : null },
    dataQuerComecar: dataIsoValida(json.dataQuerComecar) ? (json.dataQuerComecar as string) : null,
    sinal,
    terminou: json.terminou === true,
    emailsLigados: json.emailsLigados !== false,
  };
}

// ─── O link pessoal (§3) ────────────────────────────────────────────────────────────────────

/** 32 bytes em base64url = 43 caracteres. Fora disso o OS responde 401 sem consultar o banco. */
export const FORMATO_TOKEN = /^[A-Za-z0-9_-]{43}$/;

export function tokenComFormato(token: unknown): token is string {
  return typeof token === "string" && FORMATO_TOKEN.test(token);
}

export interface Fragmento {
  token: string | null;
  aula: NumeroAula | null;
  abrir: "plano" | "sinal" | null;
  /** Havia fragmento na URL (então a tela apaga com `history.replaceState`). */
  tinha: boolean;
}

/**
 * Lê `#t=<token>&aula=<1-6>&abrir=plano|sinal`. Token fora do formato é ignorado (a área tenta o
 * guardado no aparelho); `aula` fora de 1–6 e `abrir` desconhecido também.
 */
export function lerFragmento(hash: string): Fragmento {
  const bruto = hash.replace(/^#/, "");
  const params = new URLSearchParams(bruto);
  const t = params.get("t");
  const aula = Number(params.get("aula"));
  const abrir = params.get("abrir");
  return {
    token: tokenComFormato(t) ? t : null,
    aula: NUMEROS_AULA.includes(aula as NumeroAula) ? (aula as NumeroAula) : null,
    abrir: abrir === "plano" || abrir === "sinal" ? abrir : null,
    tinha: bruto.length > 0,
  };
}

/** Ordem de tentativa: o token do link novo e, se ele não valer, o guardado no aparelho. */
export function tokensParaTentar(doFragmento: string | null, guardado: string | null): string[] {
  const lista = [doFragmento, tokenComFormato(guardado) ? guardado : null].filter((t): t is string => !!t);
  return [...new Set(lista)];
}

// ─── Quanto do vídeo foi assistido (§9) ─────────────────────────────────────────────────────

/** Intervalos de segundos já tocados, `[início, fim)`, ordenados e sem sobreposição. */
export type Intervalos = ReadonlyArray<readonly [number, number]>;

/** Avanço máximo entre dois tiques de 1 s que ainda conta como tocado (cobre a velocidade 2×). */
export const AVANCO_MAXIMO_S = 2.5;

/** Acrescenta `[de, ate)` e funde o que encostar. */
export function somarIntervalo(intervalos: Intervalos, de: number, ate: number): Intervalos {
  if (!(ate > de) || !Number.isFinite(de) || !Number.isFinite(ate)) return intervalos;
  const todos = [...intervalos, [de, ate] as const].sort((x, y) => x[0] - y[0]);
  const fundidos: Array<[number, number]> = [];
  for (const [ini, fim] of todos) {
    const ultimo = fundidos[fundidos.length - 1];
    if (ultimo && ini <= ultimo[1] + 0.001) ultimo[1] = Math.max(ultimo[1], fim);
    else fundidos.push([ini, fim]);
  }
  return fundidos;
}

export function segundosCobertos(intervalos: Intervalos): number {
  return intervalos.reduce((soma, [ini, fim]) => soma + (fim - ini), 0);
}

export interface Acompanhamento {
  intervalos: Intervalos;
  /** `getCurrentTime()` do tique anterior; `null` logo depois de um play ou de uma busca. */
  ultimoTempo: number | null;
}

/**
 * Um tique de 1 s com o vídeo TOCANDO. Conta o trecho entre o tique anterior e este só se o
 * avanço ficar entre 0 e 2,5 s: salto maior é busca (arrastar até o fim não conclui a aula, e a
 * aula 3 concluída é sinal de compra). Diferença do contrato, de propósito: conta SEGUNDOS
 * DISTINTOS, não a soma dos avanços — rever o mesmo trecho não infla a fração.
 */
export function registrarTique(estado: Acompanhamento, tempoAtual: number): Acompanhamento {
  if (!Number.isFinite(tempoAtual) || tempoAtual < 0) return estado;
  const anterior = estado.ultimoTempo;
  if (anterior === null) return { ...estado, ultimoTempo: tempoAtual };
  const avanco = tempoAtual - anterior;
  if (avanco > 0 && avanco <= AVANCO_MAXIMO_S) {
    return { intervalos: somarIntervalo(estado.intervalos, anterior, tempoAtual), ultimoTempo: tempoAtual };
  }
  return { ...estado, ultimoTempo: tempoAtual };
}

export function fracaoAssistida(intervalos: Intervalos, duracao: number): number {
  if (!(duracao > 0)) return 0;
  return Math.min(1, segundosCobertos(intervalos) / duracao);
}

/**
 * Marcos que ainda precisam sair para o OS: `0` no 1º play; `25`, `50` e `90` pela fração;
 * `100` só no fim do vídeo com fração ≥ 90%. Fica de fora o que já saiu neste carregamento e o
 * que o servidor já tem (o servidor só sobe, então marco menor que o dele não muda nada).
 */
export function marcosParaEnviar(input: {
  fracao: number;
  deuPlay: boolean;
  terminouVideo: boolean;
  enviados: ReadonlySet<Marco>;
  doServidor: Marco | null;
}): Marco[] {
  const alcancados: Marco[] = [];
  if (input.deuPlay) alcancados.push(0);
  if (input.fracao >= 0.25) alcancados.push(25);
  if (input.fracao >= 0.5) alcancados.push(50);
  if (input.fracao >= 0.9) alcancados.push(90);
  if (input.terminouVideo && input.fracao >= 0.9) alcancados.push(100);
  return alcancados.filter((m) => !input.enviados.has(m) && (input.doServidor === null || m > input.doServidor));
}

/**
 * Espera antes de repetir um marco que falhou por rede ou servidor (§9): 2 s, 4 s, 8 s… até 60 s.
 * Crescente para uma queda de rede não estourar o limite de 200/h por token.
 */
export function esperaParaRepetir(tentativas: number): number {
  const n = Math.max(1, Math.floor(tentativas));
  return Math.min(60_000, 2_000 * 2 ** (n - 1));
}

/** Serializa os intervalos para o `localStorage` (inteiros de décimo de segundo: cabe pouco). */
export function serializarIntervalos(intervalos: Intervalos): string {
  return JSON.stringify(intervalos.map(([a, b]) => [Math.round(a * 10) / 10, Math.round(b * 10) / 10]));
}

/** Lê o que foi guardado; qualquer coisa estranha vira lista vazia (nunca lança). */
export function lerIntervalos(texto: string | null | undefined): Intervalos {
  if (!texto) return [];
  try {
    const bruto = JSON.parse(texto) as unknown;
    if (!Array.isArray(bruto)) return [];
    let intervalos: Intervalos = [];
    for (const par of bruto) {
      if (Array.isArray(par) && typeof par[0] === "number" && typeof par[1] === "number") {
        intervalos = somarIntervalo(intervalos, par[0], par[1]);
      }
    }
    return intervalos;
  } catch {
    return [];
  }
}

/** Onde o vídeo recomeça: a última posição, a menos que esteja perto do fim (aí, do começo). */
export function posicaoParaRetomar(ultimaPosicao: number | null, duracao: number | null): number {
  if (ultimaPosicao === null || !Number.isFinite(ultimaPosicao) || ultimaPosicao < 5) return 0;
  if (duracao !== null && duracao > 0 && ultimaPosicao > duracao - 15) return 0;
  return Math.floor(ultimaPosicao);
}

// ─── O estado da área ───────────────────────────────────────────────────────────────────────

/** A ficha tem ao menos uma resposta (um campo com valor; lista vazia não conta). */
export function fichaRespondida(ficha: Record<string, unknown> | null | undefined): boolean {
  if (!ficha) return false;
  return Object.values(ficha).some((v) => {
    if (v === undefined || v === "") return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  });
}

export interface SelosDaAula {
  assistida: boolean;
  /** Deu play e não chegou a 90% (marco 0, 25 ou 50: a mesma régua do e-mail "parou no meio"). */
  emAndamento: boolean;
  fichaRespondida: boolean;
}

export function selosDaAula(aula: AulaDoAluno): SelosDaAula {
  return {
    assistida: aula.concluida,
    emAndamento: aula.marco !== null && aula.marco < 90,
    fichaRespondida: fichaRespondida(aula.ficha),
  };
}

export function contagens(estado: EstadoAluno): { assistidas: number; fichas: number } {
  return {
    assistidas: estado.aulas.filter((a) => a.concluida).length,
    fichas: estado.aulas.filter((a) => fichaRespondida(a.ficha)).length,
  };
}

export function fichaTodaEmBranco(estado: EstadoAluno): boolean {
  return contagens(estado).fichas === 0;
}

export type Tela = { tipo: "aula"; aula: NumeroAula } | { tipo: "plano" };

/** Onde a área abre: o que o link pede (`abrir=plano`, `aula=N`) ou a próxima aula a assistir. */
export function telaInicial(estado: EstadoAluno, fragmento: Pick<Fragmento, "aula" | "abrir">): Tela {
  if (fragmento.abrir === "plano") return { tipo: "plano" };
  if (fragmento.aula) return { tipo: "aula", aula: fragmento.aula };
  const proxima = estado.proximaAula;
  if (NUMEROS_AULA.includes(proxima as NumeroAula)) return { tipo: "aula", aula: proxima as NumeroAula };
  return { tipo: "plano" };
}

/** O aviso "Seu acesso está liberado" aparece uma vez: aluno sem nada feito e aviso não dispensado. */
export function mostrarBoasVindas(estado: EstadoAluno, dispensado: boolean): boolean {
  if (dispensado) return false;
  return estado.aulas.every((a) => a.marco === null && !fichaRespondida(a.ficha)) && estado.sinal === null;
}

/**
 * O estado depois de um marco aceito pelo OS, sem esperar um novo GET: o marco só sobe, e a aula
 * passa a concluída em 90. É o mesmo que o servidor faz (§4.2), para a lista e o topo mudarem na hora.
 */
export function comMarco(estado: EstadoAluno, aula: NumeroAula, marco: Marco): EstadoAluno {
  const aulas = estado.aulas.map((a) => {
    if (a.numero !== aula || (a.marco !== null && a.marco >= marco)) return a;
    return { ...a, marco, concluida: marco >= 90 };
  });
  const aulasConcluidas = aulas.filter((a) => a.concluida).length;
  const proximaAula = aulas.find((a) => !a.concluida)?.numero ?? 7;
  return { ...estado, aulas, aulasConcluidas, proximaAula, terminou: estado.terminou || (aula === 6 && marco >= 90) };
}

/**
 * O estado relido do OS sem deixar o progresso da tela descer. Um GET que saiu antes de um marco
 * ser gravado volta com o marco antigo; o servidor só sobe (§4.2), então o marco que a tela já
 * tinha (só entra na tela depois do 200 do OS) continua valendo. Aluno diferente = o novo inteiro.
 */
export function semRegredir(novo: EstadoAluno, anterior: EstadoAluno | null): EstadoAluno {
  if (!anterior || anterior.aluno.codigo !== novo.aluno.codigo) return novo;
  let estado = novo;
  for (const a of anterior.aulas) {
    if (a.marco !== null) estado = comMarco(estado, a.numero, a.marco);
  }
  return { ...estado, terminou: novo.terminou || anterior.terminou || estado.terminou };
}

export function proximaDepois(aula: NumeroAula): NumeroAula | null {
  return aula < 6 ? ((aula + 1) as NumeroAula) : null;
}

// ─── Datas no fuso de Brasília (§5) ─────────────────────────────────────────────────────────

const FORMATO_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;

export function dataIsoValida(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const m = FORMATO_DATA.exec(v);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.getUTCFullYear() === Number(m[1]) && d.getUTCMonth() === Number(m[2]) - 1 && d.getUTCDate() === Number(m[3]);
}

/** "AAAA-MM-DD" de hoje em Brasília (o contrato valida as datas nesse fuso). */
export function hojeEmBrasilia(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(agora);
}

export function somarDias(iso: string, dias: number): string {
  const m = FORMATO_DATA.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + dias));
  return d.toISOString().slice(0, 10);
}

/** Comparação de "AAAA-MM-DD" como texto: a ordem alfabética é a ordem das datas. */
export function dataNaJanela(iso: string, min: string, max: string): boolean {
  return dataIsoValida(iso) && iso >= min && iso <= max;
}

/** Janela do contrato para a data em que quer começar e a do lançamento: de hoje a hoje + 365. */
export function janelaFutura(hoje: string): { min: string; max: string } {
  return { min: hoje, max: somarDias(hoje, 365) };
}

/** Janela da reunião com a equipe: de hoje − 30 a hoje + 365. */
export function janelaReuniao(hoje: string): { min: string; max: string } {
  return { min: somarDias(hoje, -30), max: somarDias(hoje, 365) };
}

// ─── Formatos do 03 ("R$ 1.138,80" · "14/10/2026") ──────────────────────────────────────────

function milhares(inteiro: string): string {
  return inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Sempre com centavos e espaço comum depois do "R$" (o `Intl` põe espaço especial). */
export function moeda(valor: number): string {
  const negativo = valor < 0;
  const [inteiro, centavos] = Math.abs(valor).toFixed(2).split(".");
  return `${negativo ? "-" : ""}R$ ${milhares(inteiro)},${centavos}`;
}

/** Número sem unidade: "12.000", "40", "12,5". */
export function numeroBR(valor: number): string {
  const [inteiro, decimais] = String(Math.round(valor * 100) / 100).split(".");
  const sinal = inteiro.startsWith("-") ? "-" : "";
  const absoluto = inteiro.replace("-", "");
  return `${sinal}${milhares(absoluto)}${decimais ? `,${decimais}` : ""}`;
}

export function dataBR(iso: string): string {
  const m = FORMATO_DATA.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/**
 * Lê o número que a pessoa digitou do jeito brasileiro: "94,90", "1.200", "12.000,50",
 * "R$ 55". Vazio = `null`; o que não for número = `NaN` (a ficha marca o campo).
 * Ponto sozinho seguido de 3 dígitos no fim é milhar ("1.200"); senão, é decimal ("94.9").
 */
export function lerNumeroDigitado(texto: string): number | null {
  const limpo = texto.replace(/R\$|%|\s/g, "");
  if (!limpo) return null;
  let normalizado: string;
  if (limpo.includes(",")) normalizado = limpo.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) normalizado = limpo.replace(/\./g, "");
  else normalizado = limpo;
  if (!/^-?\d+(\.\d+)?$/.test(normalizado)) return Number.NaN;
  return Number(normalizado);
}

/** Valor da tela para o campo de texto: 94.9 → "94,90" quando tem centavos, 55 → "55". */
export function numeroParaCampo(valor: number | null | undefined, comCentavos = false): string {
  if (typeof valor !== "number" || !Number.isFinite(valor)) return "";
  if (Number.isInteger(valor)) return String(valor);
  return comCentavos ? valor.toFixed(2).replace(".", ",") : String(valor).replace(".", ",");
}

// ─── A ficha: da tela para o contrato (§5) e de volta ───────────────────────────────────────

/** Texto livre: sem caracteres de controle, sem espaço nas pontas, no tamanho do contrato. */
export function textoLimpo(texto: string, max: number): string {
  return texto.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

export interface LinhaPlano { nome: string; preco: string; oQueEntra: string }
export interface LinhaPeso { servico: string; pontos: string }

export interface ValoresDaFicha {
  1: { precoCorte: string; diasRetorno: string };
  2: { comoCobraHoje: "" | ComoCobraHoje; atrasados: string; atrasadosNaoSei: boolean };
  3: { agenda: "" | AgendaFicha; planos: LinhaPlano[] };
  4: { receitaAssinaturaMes: string; percentualPote: string; pesos: LinhaPeso[] };
  5: {
    dataReuniaoEquipe: string;
    comissao: "" | "sim" | "nao" | "nao_decidi";
    valor: string;
    unidade: "" | UnidadeComissao;
  };
  6: { dataLancamento: string; tamanhoPrimeiroLote: string; listaDeEspera: string };
}

const SERVICOS_INICIAIS = ["Corte", "Barba", "Corte e barba", "Pezinho"];
const COMO_COBRA: ReadonlyArray<ComoCobraHoje> = ["nao_cobra", "pix", "cartao_por_fora", "sistema"];
const AGENDAS: ReadonlyArray<AgendaFicha> = ["sobra_horario", "movimentada", "quase_lotada"];
const UNIDADES: ReadonlyArray<UnidadeComissao> = ["reais_por_venda", "percentual"];

const lista = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const texto = (v: unknown): string => (typeof v === "string" ? v : "");

/** A ficha guardada no OS vira o que os campos da tela mostram. Ficha vazia = campos iniciais. */
export function valoresIniciais<N extends NumeroAula>(aula: N, ficha: Record<string, unknown> | null): ValoresDaFicha[N] {
  const f = ficha ?? {};
  const porAula: { [K in NumeroAula]: () => ValoresDaFicha[K] } = {
    1: () => ({ precoCorte: numeroParaCampo(f.precoCorte as number, true), diasRetorno: numeroParaCampo(f.diasRetorno as number) }),
    2: () => ({
      comoCobraHoje: COMO_COBRA.includes(f.comoCobraHoje as ComoCobraHoje) ? (f.comoCobraHoje as ComoCobraHoje) : "",
      atrasados: numeroParaCampo(f.atrasados as number),
      atrasadosNaoSei: "atrasados" in f && f.atrasados === null,
    }),
    3: () => {
      const planos = lista(f.planos).map((p) => {
        const o = (p ?? {}) as Record<string, unknown>;
        return { nome: texto(o.nome), preco: numeroParaCampo(o.preco as number, true), oQueEntra: texto(o.oQueEntra) };
      });
      return {
        agenda: AGENDAS.includes(f.agenda as AgendaFicha) ? (f.agenda as AgendaFicha) : "",
        planos: planos.length ? planos : [{ nome: "", preco: "", oQueEntra: "" }],
      };
    },
    4: () => {
      const pesos = lista(f.pesos).map((p) => {
        const o = (p ?? {}) as Record<string, unknown>;
        return { servico: texto(o.servico), pontos: numeroParaCampo(o.pontos as number) };
      });
      return {
        receitaAssinaturaMes: numeroParaCampo(f.receitaAssinaturaMes as number, true),
        percentualPote: numeroParaCampo(f.percentualPote as number),
        pesos: pesos.length ? pesos : SERVICOS_INICIAIS.map((servico) => ({ servico, pontos: "" })),
      };
    },
    5: () => {
      const c = (f.comissaoDeVenda ?? null) as ComissaoDeVenda | null;
      return {
        dataReuniaoEquipe: dataIsoValida(f.dataReuniaoEquipe) ? (f.dataReuniaoEquipe as string) : "",
        comissao: c ? (c.paga ? "sim" : "nao") : "",
        valor: c?.paga ? numeroParaCampo(c.valor) : "",
        unidade: c?.paga && c.unidade && UNIDADES.includes(c.unidade) ? c.unidade : "",
      };
    },
    6: () => ({
      dataLancamento: dataIsoValida(f.dataLancamento) ? (f.dataLancamento as string) : "",
      tamanhoPrimeiroLote: numeroParaCampo(f.tamanhoPrimeiroLote as number),
      listaDeEspera: texto(f.listaDeEspera),
    }),
  };
  return porAula[aula]() as ValoresDaFicha[N];
}

export type ResultadoFicha<N extends NumeroAula> =
  | { ok: true; respostas: FichasPorAula[N] }
  | { ok: false; campos: string[] };

/** Número dentro do limite do contrato, com até 2 casas. `undefined` = vazio; `NaN` = inválido. */
function numeroNoLimite(textoDigitado: string, min: number, max: number, inteiro = false): number | undefined {
  const n = lerNumeroDigitado(textoDigitado);
  if (n === null) return undefined;
  if (Number.isNaN(n) || n < min || n > max || (inteiro && !Number.isInteger(n))) return Number.NaN;
  return Math.round(n * 100) / 100;
}

/**
 * Dos campos da tela para as `respostas` do contrato (§5), com os mesmos limites do servidor:
 * campo vazio sai do objeto (todos são opcionais), campo fora do limite volta em `campos` com o
 * nome do contrato (lista: `planos.0.preco`). Linha de plano ou de serviço toda vazia é ignorada.
 *
 * `dataQuerComecar` (aula 6): a data que a pessoa já escolheu no botão do sinal vai junto quando
 * ainda está na janela, porque a ficha substitui a aula inteira e omitir poderia apagá-la.
 */
export function respostasDaFicha<N extends NumeroAula>(
  aula: N,
  valores: ValoresDaFicha[N],
  hoje: string,
  dataQuerComecarAtual: string | null = null,
): ResultadoFicha<N> {
  const campos: string[] = [];
  const marcar = (campo: string) => campos.push(campo);
  const conferir = (campo: string, valor: number | undefined): number | undefined => {
    if (valor !== undefined && Number.isNaN(valor)) {
      marcar(campo);
      return undefined;
    }
    return valor;
  };

  let respostas: Record<string, unknown> = {};

  if (aula === 1) {
    const v = valores as ValoresDaFicha[1];
    respostas = {
      precoCorte: conferir("precoCorte", numeroNoLimite(v.precoCorte, 1, 2000)),
      diasRetorno: conferir("diasRetorno", numeroNoLimite(v.diasRetorno, 1, 180, true)),
    };
  } else if (aula === 2) {
    const v = valores as ValoresDaFicha[2];
    const cobra = v.comoCobraHoje || undefined;
    respostas = { comoCobraHoje: cobra };
    // A pergunta dos atrasados só existe para quem já cobra assinatura de algum jeito.
    if (cobra && cobra !== "nao_cobra") {
      if (v.atrasadosNaoSei) respostas.atrasados = null;
      else respostas.atrasados = conferir("atrasados", numeroNoLimite(v.atrasados, 0, 5000, true));
    }
  } else if (aula === 3) {
    const v = valores as ValoresDaFicha[3];
    const planos: PlanoDaFicha[] = [];
    v.planos.forEach((linha, i) => {
      const nome = textoLimpo(linha.nome, 60);
      const oQueEntra = textoLimpo(linha.oQueEntra, 300);
      const preco = numeroNoLimite(linha.preco, 1, 2000);
      if (!nome && preco === undefined && !oQueEntra) return;
      let ok = true;
      if (!nome) { marcar(`planos.${i}.nome`); ok = false; }
      if (preco === undefined || Number.isNaN(preco)) { marcar(`planos.${i}.preco`); ok = false; }
      if (ok) planos.push({ nome, preco: preco as number, oQueEntra });
    });
    respostas = { agenda: v.agenda || undefined, ...(planos.length ? { planos: planos.slice(0, 4) } : {}) };
  } else if (aula === 4) {
    const v = valores as ValoresDaFicha[4];
    // Na ordem da tela: estimativa e comissão antes dos pontos (é a ordem em que os erros aparecem).
    const receitaAssinaturaMes = conferir("receitaAssinaturaMes", numeroNoLimite(v.receitaAssinaturaMes, 0, 1_000_000));
    const percentualPote = conferir("percentualPote", numeroNoLimite(v.percentualPote, 0, 100));
    const pesos: PesoDoServico[] = [];
    v.pesos.forEach((linha, i) => {
      const servico = textoLimpo(linha.servico, 60);
      const pontos = numeroNoLimite(linha.pontos, 1, 1000, true);
      // O serviço já vem escrito nas linhas iniciais: sem pontos, a linha não foi respondida.
      if (pontos === undefined) return;
      let ok = true;
      if (!servico) { marcar(`pesos.${i}.servico`); ok = false; }
      if (Number.isNaN(pontos)) { marcar(`pesos.${i}.pontos`); ok = false; }
      if (ok) pesos.push({ servico, pontos });
    });
    respostas = { receitaAssinaturaMes, percentualPote, ...(pesos.length ? { pesos: pesos.slice(0, 10) } : {}) };
  } else if (aula === 5) {
    const v = valores as ValoresDaFicha[5];
    const { min, max } = janelaReuniao(hoje);
    let data: string | undefined;
    if (v.dataReuniaoEquipe) {
      if (dataNaJanela(v.dataReuniaoEquipe, min, max)) data = v.dataReuniaoEquipe;
      else marcar("dataReuniaoEquipe");
    }
    let comissao: ComissaoDeVenda | undefined;
    if (v.comissao === "nao") comissao = { paga: false };
    if (v.comissao === "sim") {
      const valor = conferir("comissaoDeVenda.valor", numeroNoLimite(v.valor, 0, 100_000));
      comissao = { paga: true, ...(valor !== undefined ? { valor } : {}), ...(v.unidade ? { unidade: v.unidade } : {}) };
    }
    // "Ainda não decidi" não tem lugar no contrato (§5: `paga` é sim ou não): fica sem resposta.
    respostas = { dataReuniaoEquipe: data, comissaoDeVenda: comissao };
  } else {
    const v = valores as ValoresDaFicha[6];
    const { min, max } = janelaFutura(hoje);
    let data: string | undefined;
    if (v.dataLancamento) {
      if (dataNaJanela(v.dataLancamento, min, max)) data = v.dataLancamento;
      else marcar("dataLancamento");
    }
    const espera = textoLimpo(v.listaDeEspera, 120);
    respostas = {
      dataLancamento: data,
      tamanhoPrimeiroLote: conferir("tamanhoPrimeiroLote", numeroNoLimite(v.tamanhoPrimeiroLote, 1, 5000, true)),
      listaDeEspera: espera || undefined,
      dataQuerComecar: dataQuerComecarAtual && dataNaJanela(dataQuerComecarAtual, min, max) ? dataQuerComecarAtual : undefined,
    };
  }

  if (campos.length) return { ok: false, campos };
  // `undefined` sai do JSON de qualquer jeito; tirar aqui deixa o objeto igual ao que vai na rede.
  const limpo = Object.fromEntries(Object.entries(respostas).filter(([, valor]) => valor !== undefined));
  return { ok: true, respostas: limpo as FichasPorAula[N] };
}

// ─── Derivados (os mesmos do servidor, §5) ──────────────────────────────────────────────────

const centavos = (n: number) => Math.round(n * 100) / 100;

/**
 * As contas do contrato. A tela usa os derivados QUE O SERVIDOR DEVOLVE; estes só cobrem a
 * ausência deles (resposta antiga, ficha guardada antes de o servidor calcular).
 */
export function calcularDerivados(aula: NumeroAula, ficha: Record<string, unknown> | null): Derivados | null {
  if (!ficha) return null;
  if (aula === 1) {
    const preco = numeroOuNull(ficha.precoCorte);
    const dias = numeroOuNull(ficha.diasRetorno);
    const d: Derivados = {};
    if (preco !== null) d.tetoDoPlano = centavos(2 * preco);
    if (preco !== null && dias !== null && dias > 0) {
      d.visitasNoAno = Math.floor(365 / dias);
      d.valorNoAno = centavos(d.visitasNoAno * preco);
    }
    return d;
  }
  if (aula === 3) {
    const primeiro = lista(ficha.planos)[0] as { preco?: unknown } | undefined;
    const preco = numeroOuNull(primeiro?.preco);
    return preco !== null ? { assinaturaNoAno: centavos(12 * preco) } : {};
  }
  if (aula === 4) {
    const receita = numeroOuNull(ficha.receitaAssinaturaMes);
    const pct = numeroOuNull(ficha.percentualPote);
    return receita !== null && pct !== null ? { poteEstimado: centavos((receita * pct) / 100) } : {};
  }
  return {};
}

/** Os derivados de uma aula: os do servidor e, no que faltar, a mesma conta feita aqui. */
export function derivadosDaAula(aula: AulaDoAluno): Derivados {
  return { ...(calcularDerivados(aula.numero, aula.ficha) ?? {}), ...(aula.derivados ?? {}) };
}

// ─── O plano montado (03 §3.8) ──────────────────────────────────────────────────────────────

export interface BlocoDoPlano {
  chave: keyof typeof ROTULOS_DO_PLANO.blocos;
  titulo: string;
  /** A aula que responde este bloco (o botão "responder a ficha da aula N"). */
  aula: NumeroAula;
  vazio: boolean;
  linhas: string[];
  /** Só no bloco dos planos. */
  tabela?: PlanoDaFicha[];
}

/**
 * Monta a tela final a partir das fichas. Bloco sem ficha = `vazio` (a tela mostra "A ficha da
 * aula N está em branco" e o botão de responder). A conta do ano só aparece com ao menos uma das
 * duas fichas de que ela depende (1 e 3) e se o André não vetar (`mostrarContaDoAno`).
 */
export function montarPlano(estado: EstadoAluno, opcoes: { mostrarContaDoAno: boolean }): BlocoDoPlano[] {
  const R = ROTULOS_DO_PLANO;
  const aula = (n: NumeroAula) => estado.aulas[n - 1];
  const ficha = (n: NumeroAula) => (fichaRespondida(aula(n).ficha) ? (aula(n).ficha as Record<string, unknown>) : null);
  const blocos: BlocoDoPlano[] = [];
  const bloco = (chave: BlocoDoPlano["chave"], n: NumeroAula, linhas: string[] | null, tabela?: PlanoDaFicha[]) =>
    blocos.push({ chave, titulo: R.blocos[chave], aula: n, vazio: linhas === null, linhas: linhas ?? [], ...(tabela ? { tabela } : {}) });

  // Aula 1 · preço
  const f1 = ficha(1) as Ficha1 | null;
  const d1 = derivadosDaAula(aula(1));
  if (f1) {
    const linhas: string[] = [];
    if (f1.precoCorte !== undefined) linhas.push(`Corte avulso: ${moeda(f1.precoCorte)}`);
    if (f1.diasRetorno !== undefined) linhas.push(`O cliente fiel volta a cada ${f1.diasRetorno} dias`);
    if (d1.tetoDoPlano !== undefined) linhas.push(`Teto do plano de corte: ${moeda(d1.tetoDoPlano)}`);
    bloco("preco", 1, linhas);
  } else bloco("preco", 1, null);

  // A conta do ano (aulas 1 e 3)
  const f3 = ficha(3) as Ficha3 | null;
  if (opcoes.mostrarContaDoAno && (f1 || f3)) {
    const linhas: string[] = [];
    if (f1?.precoCorte !== undefined && d1.visitasNoAno !== undefined && d1.valorNoAno !== undefined) {
      linhas.push(`Avulso: ${d1.visitasNoAno} visitas × ${moeda(f1.precoCorte)} = ${moeda(d1.valorNoAno)}`);
    }
    const primeiro = f3?.planos?.[0];
    const assinaturaNoAno = estado.plano.assinaturaNoAno ?? derivadosDaAula(aula(3)).assinaturaNoAno;
    if (primeiro && assinaturaNoAno !== undefined && assinaturaNoAno !== null) {
      linhas.push(`Assinatura (${primeiro.nome}): 12 × ${moeda(primeiro.preco)} = ${moeda(assinaturaNoAno)}`);
    }
    if (linhas.length) bloco("contaDoAno", 1, linhas);
  }

  // Aula 2 · cobrança
  const f2 = ficha(2) as Ficha2 | null;
  if (f2) {
    const linhas: string[] = [];
    if (f2.comoCobraHoje) linhas.push(`Hoje você cobra: ${R.comoCobraHoje[f2.comoCobraHoje]}`);
    if (f2.atrasados !== undefined) {
      linhas.push(`Assinantes atrasados hoje: ${f2.atrasados === null ? "não sei" : numeroBR(f2.atrasados)}`);
    }
    bloco("cobranca", 2, linhas);
  } else bloco("cobranca", 2, null);

  // Aula 3 · planos
  if (f3) {
    const linhas: string[] = [];
    if (f3.agenda) linhas.push(`Agenda: ${R.agenda[f3.agenda]}`);
    bloco("planos", 3, linhas, f3.planos ?? []);
  } else bloco("planos", 3, null);

  // Aula 4 · pagamento do barbeiro
  const f4 = ficha(4) as Ficha4 | null;
  if (f4) {
    const linhas: string[] = [];
    if (f4.percentualPote !== undefined) linhas.push(`Comissão da equipe: ${numeroBR(f4.percentualPote)}%`);
    if (f4.pesos?.length) linhas.push(`Pontos: ${f4.pesos.map((p) => `${p.servico} = ${numeroBR(p.pontos)}`).join(" · ")}`);
    const pote = derivadosDaAula(aula(4)).poteEstimado;
    if (pote !== undefined) linhas.push(`Pote estimado: ${moeda(pote)} por mês`);
    bloco("barbeiro", 4, linhas);
  } else bloco("barbeiro", 4, null);

  // Aula 5 · equipe
  const f5 = ficha(5) as Ficha5 | null;
  if (f5) {
    const linhas: string[] = [];
    if (f5.dataReuniaoEquipe) linhas.push(`Reunião com a equipe: ${dataBR(f5.dataReuniaoEquipe)}`);
    if (f5.comissaoDeVenda) linhas.push(`Comissão de venda: ${textoDaComissao(f5.comissaoDeVenda)}`);
    bloco("equipe", 5, linhas);
  } else bloco("equipe", 5, null);

  // Aula 6 · lançamento
  const f6 = ficha(6) as Ficha6 | null;
  if (f6 && (f6.dataLancamento || f6.tamanhoPrimeiroLote !== undefined || f6.listaDeEspera)) {
    const linhas: string[] = [];
    if (f6.dataLancamento) linhas.push(`Lançamento para os clientes: ${dataBR(f6.dataLancamento)}`);
    if (f6.tamanhoPrimeiroLote !== undefined) linhas.push(`Primeiro lote: ${numeroBR(f6.tamanhoPrimeiroLote)} vagas`);
    if (f6.listaDeEspera) linhas.push(`Lista de espera: ${f6.listaDeEspera}`);
    bloco("lancamento", 6, linhas);
  } else bloco("lancamento", 6, null);

  return blocos;
}

/** "sim, R$ 20,00 por venda" · "sim, 10% da assinatura" · "sim" · "não". */
export function textoDaComissao(c: ComissaoDeVenda): string {
  if (!c.paga) return "não";
  if (c.valor === undefined) return "sim";
  if (c.unidade === "percentual") return `sim, ${numeroBR(c.valor)}% da assinatura`;
  if (c.unidade === "reais_por_venda") return `sim, ${moeda(c.valor)} por venda`;
  return `sim, ${numeroBR(c.valor)}`;
}

/** A agenda da ficha 3 na régua da tabela de precificação (`calc.ts`). */
export function agendaDaTabela(agenda: "" | AgendaFicha | undefined): "tranquila" | "movimentada" | "lotada" {
  if (agenda === "quase_lotada") return "lotada";
  if (agenda === "movimentada") return "movimentada";
  return "tranquila";
}

// ─── Durações (lidas da constante, nunca escritas à mão) ────────────────────────────────────

/** "6:20" → 380. Vazia ou fora do formato = `null`. */
export function segundosDaDuracao(duracao: string): number | null {
  const m = /^(\d{1,2}):([0-5]\d)$/.exec(duracao.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

/** "6:20" → "6 min" (minuto mais próximo, nunca menos de 1). Vazia = `null`. */
export function minutosDaDuracao(duracao: string): string | null {
  const s = segundosDaDuracao(duracao);
  return s === null ? null : `${Math.max(1, Math.round(s / 60))} min`;
}

/** Soma das durações em minutos; `null` se alguma aula ainda não tem duração. */
export function minutosTotais(duracoes: ReadonlyArray<string>): number | null {
  let total = 0;
  for (const d of duracoes) {
    const s = segundosDaDuracao(d);
    if (s === null) return null;
    total += s;
  }
  return Math.round(total / 60);
}
