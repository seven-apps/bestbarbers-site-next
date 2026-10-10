/**
 * Curso de assinatura — a lógica pura da área do aluno (`src/lib/curso.ts`), conferida contra o
 * contrato `02-contrato-tecnico.md` (bestbarbers-ai): estado do aluno, link pessoal, fração
 * assistida e marcos, ficha de cada aula, derivados e o plano montado.
 *
 * Runner: `node --test`. Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  agendaDaTabela,
  calcularDerivados,
  comMarco,
  contagens,
  dataBR,
  dataNaJanela,
  esperaParaRepetir,
  fracaoAssistida,
  hojeEmBrasilia,
  lerEstadoAluno,
  lerFragmento,
  lerIntervalos,
  lerNumeroDigitado,
  marcosParaEnviar,
  minutosDaDuracao,
  minutosTotais,
  moeda,
  montarPlano,
  mostrarBoasVindas,
  numeroBR,
  posicaoParaRetomar,
  registrarTique,
  respostasDaFicha,
  selosDaAula,
  semRegredir,
  serializarIntervalos,
  somarDias,
  somarIntervalo,
  telaInicial,
  textoDaComissao,
  tokensParaTentar,
  valoresIniciais,
  type Acompanhamento,
  type EstadoAluno,
  type Marco,
} from "./curso.ts";
import { AULAS } from "../content/curso-assinatura.ts";

const TOKEN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJ0123456"; // 43 caracteres
const OUTRO = "Z".repeat(43);
const HOJE = "2026-10-07";

/** A resposta do exemplo do contrato (§4.1), com a aula 1 assistida e a ficha 1 salva. */
type RespostaDeTeste = { aulas: Array<Record<string, unknown>>; [chave: string]: unknown };

function respostaDoContrato(extra: Record<string, unknown> = {}): RespostaDeTeste {
  return {
    aluno: { codigo: "K7M2QX", primeiroNome: "João", email: "joao@exemplo.com", whatsapp: "(31) 97226-8877", temAssinatura: false },
    aulas: [
      {
        numero: 1, marco: 90, concluida: true,
        ficha: { precoCorte: 55, diasRetorno: 40 },
        derivados: { visitasNoAno: 9, valorNoAno: 495, tetoDoPlano: 110 },
        fichaSalvaEm: "2026-10-07T14:02:11-03:00",
      },
      { numero: 2, marco: null, concluida: false, ficha: null, derivados: null, fichaSalvaEm: null },
      { numero: 3, marco: null, concluida: false, ficha: null, derivados: null, fichaSalvaEm: null },
      { numero: 4, marco: null, concluida: false, ficha: null, derivados: null, fichaSalvaEm: null },
      { numero: 5, marco: null, concluida: false, ficha: null, derivados: null, fichaSalvaEm: null },
      { numero: 6, marco: null, concluida: false, ficha: null, derivados: null, fichaSalvaEm: null },
    ],
    aulasConcluidas: 1,
    proximaAula: 2,
    plano: { assinaturaNoAno: null },
    dataQuerComecar: null,
    sinal: null,
    terminou: false,
    emailsLigados: true,
    ...extra,
  };
}

function estado(extra: Record<string, unknown> = {}): EstadoAluno {
  const e = lerEstadoAluno(respostaDoContrato(extra));
  assert.ok(e);
  return e;
}

/** Estado com fichas dadas por aula (o resto em branco). */
function estadoComFichas(fichas: Partial<Record<1 | 2 | 3 | 4 | 5 | 6, Record<string, unknown>>>, extra: Record<string, unknown> = {}) {
  const base = respostaDoContrato(extra);
  base.aulas = base.aulas.map((a) => ({
    ...a,
    ficha: (fichas as Record<number, Record<string, unknown>>)[a.numero as number] ?? null,
    derivados: null,
  }));
  const e = lerEstadoAluno(base);
  assert.ok(e);
  return e;
}

// ─── Estado do aluno ──────────────────────────────────────────────────────────────────────

test("lerEstadoAluno: a resposta do contrato vira o estado da tela", () => {
  const e = estado();
  assert.equal(e.aluno.codigo, "K7M2QX");
  assert.equal(e.aluno.primeiroNome, "João");
  assert.equal(e.aulas.length, 6);
  assert.equal(e.aulas[0].marco, 90);
  assert.equal(e.aulas[0].concluida, true);
  assert.deepEqual(e.aulas[0].derivados, { visitasNoAno: 9, valorNoAno: 495, tetoDoPlano: 110 });
  assert.equal(e.proximaAula, 2);
  assert.equal(e.sinal, null);
});

test("lerEstadoAluno: resposta fora do contrato = null; aula faltando nasce vazia; marco estranho vira null", () => {
  for (const ruim of [null, "x", {}, { aluno: {}, aulas: [] }, { aluno: { codigo: "" }, aulas: [] }, { aluno: { codigo: "K7M2QX" } }]) {
    assert.equal(lerEstadoAluno(ruim), null, JSON.stringify(ruim));
  }
  const e = lerEstadoAluno({ aluno: { codigo: "K7M2QX" }, aulas: [{ numero: 3, marco: 33 }, { numero: 2, marco: 50 }] });
  assert.ok(e);
  assert.deepEqual(e.aulas.map((a) => a.numero), [1, 2, 3, 4, 5, 6]);
  assert.equal(e.aulas[1].marco, 50);
  assert.equal(e.aulas[2].marco, null, "33 não é marco do contrato");
  assert.equal(e.proximaAula, 1, "sem o campo, a próxima é a menor não concluída");
  assert.equal(e.aluno.email, null);
});

test("selos e contagens: assistida ≥ 90, em andamento de 0 a 50, ficha respondida com algum valor", () => {
  const e = estadoComFichas({ 1: { precoCorte: 55 }, 3: { planos: [] } }, {});
  const aulas = e.aulas.map((a, i) => ({ ...a, marco: ([90, 0, 25, 50, null, 100] as Array<Marco | null>)[i], concluida: [true, false, false, false, false, true][i] }));
  assert.deepEqual(aulas.map((a) => selosDaAula(a).assistida), [true, false, false, false, false, true]);
  assert.deepEqual(aulas.map((a) => selosDaAula(a).emAndamento), [false, true, true, true, false, false]);
  assert.deepEqual(contagens({ ...e, aulas }), { assistidas: 2, fichas: 1 }, "lista vazia de planos não é ficha respondida");
});

test("telaInicial: o link manda (abrir=plano, aula=N); sem link, a próxima aula; todas vistas, o plano", () => {
  const e = estado();
  assert.deepEqual(telaInicial(e, { aula: null, abrir: "plano" }), { tipo: "plano" });
  assert.deepEqual(telaInicial(e, { aula: 4, abrir: null }), { tipo: "aula", aula: 4 });
  assert.deepEqual(telaInicial(e, { aula: null, abrir: null }), { tipo: "aula", aula: 2 });
  assert.deepEqual(telaInicial(estado({ proximaAula: 7 }), { aula: null, abrir: "sinal" }), { tipo: "plano" });
});

test("mostrarBoasVindas: só para quem ainda não fez nada e não dispensou o aviso", () => {
  const novo = estadoComFichas({});
  const semPlay = { ...novo, aulas: novo.aulas.map((a) => ({ ...a, marco: null, concluida: false })) };
  assert.equal(mostrarBoasVindas(semPlay, false), true);
  assert.equal(mostrarBoasVindas(semPlay, true), false);
  assert.equal(mostrarBoasVindas(estado(), false), false, "já assistiu a aula 1");
});

// ─── Link pessoal ─────────────────────────────────────────────────────────────────────────

test("lerFragmento: token, aula e abrir; o que não for do contrato é ignorado", () => {
  assert.deepEqual(lerFragmento(`#t=${TOKEN}&aula=3&abrir=sinal`), { token: TOKEN, aula: 3, abrir: "sinal", tinha: true });
  assert.deepEqual(lerFragmento(`#t=${TOKEN}`), { token: TOKEN, aula: null, abrir: null, tinha: true });
  assert.deepEqual(lerFragmento("#t=curto&aula=9&abrir=outra"), { token: null, aula: null, abrir: null, tinha: true });
  assert.deepEqual(lerFragmento(""), { token: null, aula: null, abrir: null, tinha: false });
  assert.equal(lerFragmento(`#t=${TOKEN}=`).token, null, "44 caracteres não é token");
});

test("tokensParaTentar: o do link primeiro, depois o guardado, sem repetir e sem lixo", () => {
  assert.deepEqual(tokensParaTentar(TOKEN, OUTRO), [TOKEN, OUTRO]);
  assert.deepEqual(tokensParaTentar(TOKEN, TOKEN), [TOKEN]);
  assert.deepEqual(tokensParaTentar(null, OUTRO), [OUTRO]);
  assert.deepEqual(tokensParaTentar(null, "lixo"), []);
});

// ─── Fração assistida e marcos (§9) ───────────────────────────────────────────────────────

function tocar(tempos: number[], inicio: Acompanhamento = { intervalos: [], ultimoTempo: null }): Acompanhamento {
  return tempos.reduce((acc, t) => registrarTique(acc, t), inicio);
}

test("fração: assistir de 0 a 100 s em tiques de 1 s cobre 100 s", () => {
  const acc = tocar(Array.from({ length: 101 }, (_, i) => i));
  assert.equal(fracaoAssistida(acc.intervalos, 200), 0.5);
});

test("fração: arrastar para o fim não conta (salto > 2,5 s é busca)", () => {
  const acc = tocar([0, 1, 2, 3, 395, 396, 397, 398, 399, 400]);
  assert.equal(fracaoAssistida(acc.intervalos, 400), 8 / 400);
  assert.ok(fracaoAssistida(acc.intervalos, 400) < 0.25);
});

test("fração: velocidade 2× conta (avanço de 2 s por tique)", () => {
  const acc = tocar(Array.from({ length: 51 }, (_, i) => i * 2));
  assert.equal(fracaoAssistida(acc.intervalos, 100), 1);
});

test("fração: rever o mesmo trecho não infla (segundos distintos)", () => {
  let acc = tocar(Array.from({ length: 31 }, (_, i) => i));
  acc = { ...acc, ultimoTempo: null }; // voltou ao começo (busca)
  acc = tocar(Array.from({ length: 31 }, (_, i) => i), acc);
  assert.equal(fracaoAssistida(acc.intervalos, 100), 0.3);
});

test("fração: voltar no vídeo (avanço negativo) não conta nem quebra", () => {
  const acc = tocar([10, 11, 12, 5, 6, 7]);
  assert.deepEqual(acc.intervalos, [[5, 7], [10, 12]]);
});

test("somarIntervalo funde o que encosta e ignora intervalo vazio", () => {
  let iv = somarIntervalo([], 0, 10);
  iv = somarIntervalo(iv, 20, 30);
  iv = somarIntervalo(iv, 10, 20);
  assert.deepEqual(iv, [[0, 30]]);
  assert.deepEqual(somarIntervalo(iv, 5, 5), [[0, 30]]);
});

test("intervalos guardados no aparelho: ida e volta; lixo vira lista vazia", () => {
  const iv = somarIntervalo(somarIntervalo([], 0, 12.34), 40, 50);
  assert.deepEqual(lerIntervalos(serializarIntervalos(iv)), [[0, 12.3], [40, 50]]);
  for (const lixo of [null, "", "{", "{}", "[[1]]", '[["a","b"]]']) assert.deepEqual(lerIntervalos(lixo), [], String(lixo));
});

test("marcos: 0 no play; 25, 50, 90 pela fração; 100 só no fim com ≥ 90%", () => {
  const base = { enviados: new Set<Marco>(), doServidor: null };
  assert.deepEqual(marcosParaEnviar({ ...base, fracao: 0, deuPlay: true, terminouVideo: false }), [0]);
  assert.deepEqual(marcosParaEnviar({ ...base, fracao: 0.6, deuPlay: true, terminouVideo: false }), [0, 25, 50]);
  assert.deepEqual(marcosParaEnviar({ ...base, fracao: 0.95, deuPlay: true, terminouVideo: true }), [0, 25, 50, 90, 100]);
  assert.deepEqual(marcosParaEnviar({ ...base, fracao: 0.4, deuPlay: true, terminouVideo: true }), [0, 25], "fim sem 90% não conclui");
});

test("marcos: não repete o que saiu neste carregamento nem o que o servidor já tem", () => {
  assert.deepEqual(
    marcosParaEnviar({ fracao: 0.92, deuPlay: true, terminouVideo: false, enviados: new Set<Marco>([0, 25]), doServidor: null }),
    [50, 90],
  );
  assert.deepEqual(marcosParaEnviar({ fracao: 0.92, deuPlay: true, terminouVideo: true, enviados: new Set<Marco>(), doServidor: 90 }), [100]);
});

test("posicaoParaRetomar: retoma onde parou; perto do fim ou no começo, do zero", () => {
  assert.equal(posicaoParaRetomar(120.7, 380), 120);
  assert.equal(posicaoParaRetomar(370, 380), 0);
  assert.equal(posicaoParaRetomar(3, 380), 0);
  assert.equal(posicaoParaRetomar(null, 380), 0);
});

// ─── Ficha: da tela para o contrato (§5) ──────────────────────────────────────────────────

test("lerNumeroDigitado: o jeito brasileiro de escrever número", () => {
  assert.equal(lerNumeroDigitado("94,90"), 94.9);
  assert.equal(lerNumeroDigitado("1.200"), 1200);
  assert.equal(lerNumeroDigitado("12.000,50"), 12000.5);
  assert.equal(lerNumeroDigitado("R$ 55"), 55);
  assert.equal(lerNumeroDigitado("94.9"), 94.9);
  assert.equal(lerNumeroDigitado("40%"), 40);
  assert.equal(lerNumeroDigitado(""), null);
  assert.ok(Number.isNaN(lerNumeroDigitado("abc")));
});

test("ficha 1: preço e dias; limites do contrato; vazio sai do objeto", () => {
  assert.deepEqual(respostasDaFicha(1, { precoCorte: "55", diasRetorno: "40" }, HOJE), { ok: true, respostas: { precoCorte: 55, diasRetorno: 40 } });
  assert.deepEqual(respostasDaFicha(1, { precoCorte: "", diasRetorno: "" }, HOJE), { ok: true, respostas: {} });
  assert.deepEqual(respostasDaFicha(1, { precoCorte: "0", diasRetorno: "40,5" }, HOJE), { ok: false, campos: ["precoCorte", "diasRetorno"] });
  assert.deepEqual(respostasDaFicha(1, { precoCorte: "2001", diasRetorno: "181" }, HOJE), { ok: false, campos: ["precoCorte", "diasRetorno"] });
});

test("ficha 2: atrasados só para quem já cobra; 'não sei' = null", () => {
  assert.deepEqual(
    respostasDaFicha(2, { comoCobraHoje: "pix", atrasados: "4", atrasadosNaoSei: false }, HOJE),
    { ok: true, respostas: { comoCobraHoje: "pix", atrasados: 4 } },
  );
  assert.deepEqual(
    respostasDaFicha(2, { comoCobraHoje: "sistema", atrasados: "", atrasadosNaoSei: true }, HOJE),
    { ok: true, respostas: { comoCobraHoje: "sistema", atrasados: null } },
  );
  assert.deepEqual(
    respostasDaFicha(2, { comoCobraHoje: "nao_cobra", atrasados: "9", atrasadosNaoSei: false }, HOJE),
    { ok: true, respostas: { comoCobraHoje: "nao_cobra" } },
    "quem não cobra não tem atrasado",
  );
  assert.deepEqual(respostasDaFicha(2, { comoCobraHoje: "pix", atrasados: "-1", atrasadosNaoSei: false }, HOJE), { ok: false, campos: ["atrasados"] });
});

test("ficha 3: planos completos entram; linha vazia some; linha pela metade marca o campo", () => {
  const r = respostasDaFicha(3, {
    agenda: "movimentada",
    planos: [
      { nome: " Plano corte ", preco: "94,90", oQueEntra: "corte, máquina e pezinho" },
      { nome: "", preco: "", oQueEntra: "" },
    ],
  }, HOJE);
  assert.deepEqual(r, { ok: true, respostas: { agenda: "movimentada", planos: [{ nome: "Plano corte", preco: 94.9, oQueEntra: "corte, máquina e pezinho" }] } });
  assert.deepEqual(
    respostasDaFicha(3, { agenda: "", planos: [{ nome: "Plano barba", preco: "", oQueEntra: "" }, { nome: "", preco: "50", oQueEntra: "" }] }, HOJE),
    { ok: false, campos: ["planos.0.preco", "planos.1.nome"] },
  );
  assert.deepEqual(respostasDaFicha(3, { agenda: "", planos: [{ nome: "", preco: "", oQueEntra: "" }] }, HOJE), { ok: true, respostas: {} });
});

test("ficha 4: serviço sem pontos não foi respondido; pontos inteiros de 1 a 1000", () => {
  const r = respostasDaFicha(4, {
    receitaAssinaturaMes: "12.000",
    percentualPote: "40",
    pesos: [
      { servico: "Corte", pontos: "40" },
      { servico: "Barba", pontos: "" },
      { servico: "Corte e barba", pontos: "60" },
    ],
  }, HOJE);
  assert.deepEqual(r, { ok: true, respostas: { receitaAssinaturaMes: 12000, percentualPote: 40, pesos: [{ servico: "Corte", pontos: 40 }, { servico: "Corte e barba", pontos: 60 }] } });
  assert.deepEqual(
    respostasDaFicha(4, { receitaAssinaturaMes: "", percentualPote: "101", pesos: [{ servico: "", pontos: "10" }, { servico: "Pezinho", pontos: "2,5" }] }, HOJE),
    { ok: false, campos: ["percentualPote", "pesos.0.servico", "pesos.1.pontos"] },
  );
});

test("ficha 5: reunião de hoje − 30 a hoje + 365; comissão sim/não; 'ainda não decidi' fica sem resposta", () => {
  assert.deepEqual(
    respostasDaFicha(5, { dataReuniaoEquipe: "2026-10-14", comissao: "sim", valor: "20", unidade: "reais_por_venda" }, HOJE),
    { ok: true, respostas: { dataReuniaoEquipe: "2026-10-14", comissaoDeVenda: { paga: true, valor: 20, unidade: "reais_por_venda" } } },
  );
  assert.deepEqual(respostasDaFicha(5, { dataReuniaoEquipe: "", comissao: "nao", valor: "99", unidade: "percentual" }, HOJE), { ok: true, respostas: { comissaoDeVenda: { paga: false } } });
  assert.deepEqual(respostasDaFicha(5, { dataReuniaoEquipe: "", comissao: "nao_decidi", valor: "", unidade: "" }, HOJE), { ok: true, respostas: {} });
  assert.deepEqual(respostasDaFicha(5, { dataReuniaoEquipe: "2026-08-01", comissao: "", valor: "", unidade: "" }, HOJE), { ok: false, campos: ["dataReuniaoEquipe"] });
  assert.deepEqual(respostasDaFicha(5, { dataReuniaoEquipe: "2026-09-10", comissao: "", valor: "", unidade: "" }, HOJE).ok, true, "até 30 dias atrás vale");
});

test("ficha 6: lançamento de hoje a hoje + 365; a data do sinal vai junto se ainda valer", () => {
  const valores = { dataLancamento: "2026-11-01", tamanhoPrimeiroLote: "50", listaDeEspera: "caderno do balcão" };
  assert.deepEqual(respostasDaFicha(6, valores, HOJE, "2026-11-03"), {
    ok: true,
    respostas: { dataLancamento: "2026-11-01", tamanhoPrimeiroLote: 50, listaDeEspera: "caderno do balcão", dataQuerComecar: "2026-11-03" },
  });
  assert.deepEqual(respostasDaFicha(6, valores, HOJE, "2026-10-01"), {
    ok: true,
    respostas: { dataLancamento: "2026-11-01", tamanhoPrimeiroLote: 50, listaDeEspera: "caderno do balcão" },
  }, "data que já passou seria recusada pelo servidor: não vai");
  assert.deepEqual(respostasDaFicha(6, { dataLancamento: "2026-10-06", tamanhoPrimeiroLote: "0", listaDeEspera: "" }, HOJE), { ok: false, campos: ["dataLancamento", "tamanhoPrimeiroLote"] });
});

test("valoresIniciais: a ficha guardada volta para os campos; ficha vazia traz as linhas iniciais", () => {
  assert.deepEqual(valoresIniciais(1, { precoCorte: 94.9, diasRetorno: 40 }), { precoCorte: "94,90", diasRetorno: "40" });
  assert.deepEqual(valoresIniciais(2, { comoCobraHoje: "pix", atrasados: null }), { comoCobraHoje: "pix", atrasados: "", atrasadosNaoSei: true });
  assert.equal(valoresIniciais(3, null).planos.length, 1);
  assert.deepEqual(valoresIniciais(4, null).pesos.map((p) => p.servico), ["Corte", "Barba", "Corte e barba", "Pezinho"]);
  assert.deepEqual(valoresIniciais(5, { comissaoDeVenda: { paga: true, valor: 10, unidade: "percentual" } }), { dataReuniaoEquipe: "", comissao: "sim", valor: "10", unidade: "percentual" });
  // Ida e volta: o que a tela salva, ela relê igual.
  const v6 = { dataLancamento: "2026-11-01", tamanhoPrimeiroLote: "50", listaDeEspera: "caderno" };
  const r6 = respostasDaFicha(6, v6, HOJE);
  assert.ok(r6.ok);
  assert.deepEqual(valoresIniciais(6, r6.respostas as Record<string, unknown>), v6);
});

// ─── Derivados e plano montado (03 §3.8) ──────────────────────────────────────────────────

test("derivados: o exemplo do roteiro (corte R$ 55, volta a cada 40 dias → 9 visitas, R$ 495, teto R$ 110)", () => {
  assert.deepEqual(calcularDerivados(1, { precoCorte: 55, diasRetorno: 40 }), { tetoDoPlano: 110, visitasNoAno: 9, valorNoAno: 495 });
  assert.deepEqual(calcularDerivados(3, { planos: [{ nome: "Plano corte", preco: 94.9, oQueEntra: "" }] }), { assinaturaNoAno: 1138.8 });
  assert.deepEqual(calcularDerivados(4, { receitaAssinaturaMes: 12000, percentualPote: 40 }), { poteEstimado: 4800 });
  assert.deepEqual(calcularDerivados(4, { percentualPote: 40 }), {}, "pote só com as duas respostas");
});

test("montarPlano: a ficha inteira vira as linhas do 03, com moeda e data no formato", () => {
  const e = estadoComFichas({
    1: { precoCorte: 55, diasRetorno: 40 },
    2: { comoCobraHoje: "pix", atrasados: 4 },
    3: { agenda: "sobra_horario", planos: [{ nome: "Plano corte", preco: 94.9, oQueEntra: "corte, máquina e pezinho" }] },
    4: { receitaAssinaturaMes: 12000, percentualPote: 40, pesos: [{ servico: "Corte", pontos: 40 }, { servico: "Barba", pontos: 20 }] },
    5: { dataReuniaoEquipe: "2026-10-14", comissaoDeVenda: { paga: true, valor: 20, unidade: "reais_por_venda" } },
    6: { dataLancamento: "2026-11-01", tamanhoPrimeiroLote: 50 },
  }, { plano: { assinaturaNoAno: 1138.8 } });
  const plano = montarPlano(e, { mostrarContaDoAno: true });
  const por = Object.fromEntries(plano.map((b) => [b.chave, b]));
  assert.deepEqual(plano.map((b) => b.chave), ["preco", "contaDoAno", "cobranca", "planos", "barbeiro", "equipe", "lancamento"]);
  assert.deepEqual(por.preco.linhas, ["Corte avulso: R$ 55,00", "O cliente fiel volta a cada 40 dias", "Teto do plano de corte: R$ 110,00"]);
  assert.deepEqual(por.contaDoAno.linhas, ["Avulso: 9 visitas × R$ 55,00 = R$ 495,00", "Assinatura (Plano corte): 12 × R$ 94,90 = R$ 1.138,80"]);
  assert.deepEqual(por.cobranca.linhas, ["Hoje você cobra: no Pix, todo mês", "Assinantes atrasados hoje: 4"]);
  assert.deepEqual(por.planos.linhas, ["Agenda: sobra horário"]);
  assert.deepEqual(por.planos.tabela, [{ nome: "Plano corte", preco: 94.9, oQueEntra: "corte, máquina e pezinho" }]);
  assert.deepEqual(por.barbeiro.linhas, ["Comissão da equipe: 40%", "Pontos: Corte = 40 · Barba = 20", "Pote estimado: R$ 4.800,00 por mês"]);
  assert.deepEqual(por.equipe.linhas, ["Reunião com a equipe: 14/10/2026", "Comissão de venda: sim, R$ 20,00 por venda"]);
  assert.deepEqual(por.lancamento.linhas, ["Lançamento para os clientes: 01/11/2026", "Primeiro lote: 50 vagas"]);
  assert.ok(plano.every((b) => !b.vazio));
});

test("montarPlano: ficha em branco vira bloco vazio com a aula para responder; conta do ano sai sem as fichas 1 e 3", () => {
  const plano = montarPlano(estadoComFichas({ 2: { comoCobraHoje: "sistema", atrasados: null } }), { mostrarContaDoAno: true });
  assert.deepEqual(plano.map((b) => [b.chave, b.vazio, b.aula]), [
    ["preco", true, 1],
    ["cobranca", false, 2],
    ["planos", true, 3],
    ["barbeiro", true, 4],
    ["equipe", true, 5],
    ["lancamento", true, 6],
  ]);
  assert.deepEqual(plano[1].linhas, ["Hoje você cobra: pelo sistema", "Assinantes atrasados hoje: não sei"]);
});

test("montarPlano: o veto da conta do ano (decisão 7 do 03) tira o bloco", () => {
  const e = estadoComFichas({ 1: { precoCorte: 55, diasRetorno: 40 } });
  assert.ok(montarPlano(e, { mostrarContaDoAno: true }).some((b) => b.chave === "contaDoAno"));
  assert.ok(!montarPlano(e, { mostrarContaDoAno: false }).some((b) => b.chave === "contaDoAno"));
});

test("montarPlano: os derivados do SERVIDOR mandam quando existem", () => {
  const base = respostaDoContrato();
  base.aulas[0].derivados = { visitasNoAno: 9, valorNoAno: 495, tetoDoPlano: 999 };
  const e = lerEstadoAluno(base);
  assert.ok(e);
  assert.ok(montarPlano(e, { mostrarContaDoAno: false })[0].linhas.includes("Teto do plano de corte: R$ 999,00"));
});

test("textoDaComissao", () => {
  assert.equal(textoDaComissao({ paga: false }), "não");
  assert.equal(textoDaComissao({ paga: true }), "sim");
  assert.equal(textoDaComissao({ paga: true, valor: 10, unidade: "percentual" }), "sim, 10% da assinatura");
  assert.equal(textoDaComissao({ paga: true, valor: 20, unidade: "reais_por_venda" }), "sim, R$ 20,00 por venda");
});

test("agendaDaTabela: a agenda da ficha 3 na régua da tabela de precificação", () => {
  assert.equal(agendaDaTabela("sobra_horario"), "tranquila");
  assert.equal(agendaDaTabela("movimentada"), "movimentada");
  assert.equal(agendaDaTabela("quase_lotada"), "lotada");
  assert.equal(agendaDaTabela(""), "tranquila");
});

// ─── Formatos e datas ─────────────────────────────────────────────────────────────────────

test("moeda e número no formato do 03", () => {
  assert.equal(moeda(1138.8), "R$ 1.138,80");
  assert.equal(moeda(55), "R$ 55,00");
  assert.equal(moeda(1234567.891), "R$ 1.234.567,89");
  assert.equal(numeroBR(12000), "12.000");
  assert.equal(numeroBR(12.5), "12,5");
  assert.equal(dataBR("2026-10-14"), "14/10/2026");
});

test("datas em Brasília: 23h30 de Brasília ainda é o mesmo dia; janelas do contrato", () => {
  assert.equal(hojeEmBrasilia(new Date("2026-10-08T02:30:00Z")), "2026-10-07");
  assert.equal(hojeEmBrasilia(new Date("2026-10-08T03:30:00Z")), "2026-10-08");
  assert.equal(somarDias("2026-12-31", 1), "2027-01-01");
  assert.equal(somarDias(HOJE, -30), "2026-09-07");
  assert.equal(dataNaJanela("2026-02-30", "2026-01-01", "2027-01-01"), false, "data que não existe");
});

test("durações saem da constante: 6:20 → 6 min; total do curso ≈ 33 min (aulas 1 e 2 reais, 09/Out/26)", () => {
  assert.equal(minutosDaDuracao("6:20"), "6 min");
  assert.equal(minutosDaDuracao("4:49"), "5 min");
  assert.equal(minutosDaDuracao(""), null);
  assert.equal(minutosTotais(AULAS.map((a) => a.duracao)), 33);
  assert.equal(minutosTotais(["6:20", ""]), null, "aula sem duração some do total");
});

test("comMarco: o marco só sobe; 90 conclui, muda a próxima aula e a contagem; aula 6 a 90 termina", () => {
  const e = estado();
  const depois = comMarco(e, 2, 50);
  assert.equal(depois.aulas[1].marco, 50);
  assert.equal(depois.aulas[1].concluida, false);
  assert.equal(comMarco(depois, 2, 25).aulas[1].marco, 50, "marco menor não desce");
  const concluiu = comMarco(depois, 2, 90);
  assert.equal(concluiu.aulasConcluidas, 2);
  assert.equal(concluiu.proximaAula, 3);
  assert.equal(comMarco(e, 6, 90).terminou, true);
  assert.equal(comMarco(e, 5, 100).terminou, false);
});

// ─── Revisão adversarial (06/Out/26) ──────────────────────────────────────────────────────

test("semRegredir: GET que saiu antes do marco gravado não faz o progresso da tela descer", () => {
  const naTela = comMarco(comMarco(estado(), 3, 90), 2, 50); // 1 e 3 concluídas, 2 em andamento
  const doGetAntigo = estado(); // o GET leu o banco antes dos dois marcos
  const mesclado = semRegredir(doGetAntigo, naTela);
  assert.equal(mesclado.aulas[2].marco, 90);
  assert.equal(mesclado.aulas[2].concluida, true);
  assert.equal(mesclado.aulas[1].marco, 50);
  assert.equal(mesclado.aulasConcluidas, 2);
  assert.equal(mesclado.proximaAula, 2);
});

test("semRegredir: o que o GET traz de novo (ficha, sinal, marco maior) vale; aluno diferente = o novo inteiro", () => {
  const naTela = comMarco(estado(), 2, 25);
  const doGet = comMarco(estado({ sinal: { tipo: "quero_isso", em: "2026-10-07T15:00:00Z" }, dataQuerComecar: "2026-11-03" }), 2, 90);
  const mesclado = semRegredir(doGet, naTela);
  assert.equal(mesclado.aulas[1].marco, 90, "marco maior do servidor fica");
  assert.deepEqual(mesclado.sinal, { tipo: "quero_isso", em: "2026-10-07T15:00:00Z" });
  assert.equal(mesclado.dataQuerComecar, "2026-11-03");
  const outroAluno = estado({ aluno: { codigo: "ZZZZZZ", primeiroNome: "Ana", email: null, whatsapp: "", temAssinatura: false } });
  assert.equal(semRegredir(outroAluno, naTela), outroAluno);
  assert.equal(semRegredir(doGet, null), doGet);
});

test("esperaParaRepetir: 2 s, 4 s, 8 s… até 60 s", () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 20].map(esperaParaRepetir), [2000, 4000, 8000, 16000, 32000, 60000, 60000, 60000]);
  assert.equal(esperaParaRepetir(0), 2000);
});

test("reenvio ao abrir a aula: trechos de uma visita anterior valem pela duração REAL do vídeo", () => {
  const trechos = somarIntervalo([], 0, 345);
  // Vídeo de 380 s: 345 s guardados = 90% → o 50 e o 90 que o OS ainda não tem saem na abertura.
  assert.deepEqual(marcosParaEnviar({ fracao: fracaoAssistida(trechos, 380), deuPlay: true, terminouVideo: false, enviados: new Set(), doServidor: 25 }), [50, 90]);
  // Player que ainda não sabe a duração (0): nada além do 0 sai — a constante (estimativa) não
  // pode inflar a fração e concluir a aula 3, que é sinal de compra.
  assert.deepEqual(marcosParaEnviar({ fracao: fracaoAssistida(trechos, 0), deuPlay: true, terminouVideo: false, enviados: new Set(), doServidor: null }), [0]);
});
