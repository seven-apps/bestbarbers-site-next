/**
 * Curso de assinatura — o cliente das rotas do OS (`src/lib/curso-api.ts`) com `fetch` FALSO:
 * nenhum teste chama a rede. Confere o corpo da inscrição contra a allowlist do contrato, a
 * repetição com a mesma chave, o token só no cabeçalho, o link da área e o do bônus do Lucas.
 *
 * Runner: `node --test`. Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHAVE_INSCRICAO_PENDENTE,
  CHAVE_TOKEN,
  apagarToken,
  corpoDaInscricao,
  guardarInscricaoPendente,
  guardarToken,
  inscreverNoCurso,
  lerAluno,
  lerInscricaoPendente,
  lerTokenGuardado,
  linkBonusLucas,
  linkDaArea,
  linkLucasSemCodigo,
  novaChave,
  pedirLink,
  registrarProgresso,
  registrarSinal,
  salvarFicha,
  type CorpoInscricao,
} from "./curso-api.ts";
import type { CadastroConcluido } from "./cadastro-concluido.ts";
import { lerFragmento } from "./curso.ts";
import { TEXTOS_AREA } from "../content/curso-assinatura.ts";

const TOKEN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJ0123456";
const CHAVE = "3f1c2a9e-8b7d-4c1e-9a0f-2b6d5e4c3a21";
const BASE = "https://os.teste";

function fetchFalso(respostas: Array<() => Response | Promise<Response>>) {
  const chamadas: Array<{ url: string; init?: RequestInit }> = [];
  let i = 0;
  const f = (async (url: string, init?: RequestInit) => {
    chamadas.push({ url, init });
    const resposta = respostas[Math.min(i, respostas.length - 1)];
    i++;
    return resposta();
  }) as unknown as typeof fetch;
  return { f, chamadas };
}
const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json" } });

function memoria() {
  const dados = new Map<string, string>();
  return {
    dados,
    getItem: (k: string) => dados.get(k) ?? null,
    setItem: (k: string, v: string) => void dados.set(k, v),
    removeItem: (k: string) => void dados.delete(k),
  };
}

const cadastro = (extra: Partial<CadastroConcluido> = {}): CadastroConcluido => ({
  nome: "João Silva",
  barbearia: "Barbearia do João",
  telefone: "(31) 97226-8877",
  email: "joao@exemplo.com",
  nota: 42,
  clube: "Já tenho o clube, mas gerencio manualmente",
  caminho: "lucas",
  dealId: 1202661959,
  contactId: 120554433,
  atribuicao: {
    originId: 40210426,
    originDesc: "[SCORE: 42] LP - Curso de assinatura",
    fields: { bb_lp_version: "curso-assinatura", bb_lead_event_id: "1759790000000-js", bb_utm_source: "facebook" },
    leadScore: 42,
  },
  ...extra,
});

// ─── Corpo da inscrição (§2.3) ────────────────────────────────────────────────────────────

test("corpoDaInscricao: o exemplo do contrato, só com as chaves que o .strict() aceita", () => {
  const corpo = corpoDaInscricao(cadastro(), CHAVE);
  assert.deepEqual(corpo, {
    chave: CHAVE,
    nome: "João Silva",
    barbearia: "Barbearia do João",
    telefone: "(31) 97226-8877",
    email: "joao@exemplo.com",
    nota: 42,
    clube: "Já tenho o clube, mas gerencio manualmente",
    caminho: "lucas",
    dealId: 1202661959,
    contactId: 120554433,
    atribuicao: {
      originId: 40210426,
      originDesc: "[SCORE: 42] LP - Curso de assinatura",
      leadEventId: "1759790000000-js",
      campos: { bb_lp_version: "curso-assinatura", bb_lead_event_id: "1759790000000-js", bb_utm_source: "facebook" },
    },
  });
});

test("corpoDaInscricao: corta no tamanho do contrato, tira o que não existe e não decide pela nota", () => {
  const corpo = corpoDaInscricao(
    cadastro({
      nome: "N".repeat(300),
      email: `${"a".repeat(201)}@x.com`,
      nota: null,
      caminho: "sdr",
      dealId: null,
      contactId: null,
      barbearia: "",
      atribuicao: {
        originId: null,
        originDesc: "D".repeat(900),
        fields: { bb_lp_version: "x".repeat(80), bb_fbclid: "f".repeat(900) } as CadastroConcluido["atribuicao"]["fields"],
      },
    }),
    CHAVE,
  );
  assert.equal(corpo.nome.length, 120);
  assert.equal(corpo.email, undefined, "e-mail longo demais não vai (o OS recusaria o corpo inteiro)");
  assert.equal(corpo.nota, null);
  assert.equal("dealId" in corpo, false);
  assert.equal("contactId" in corpo, false);
  assert.equal("barbearia" in corpo, false);
  assert.equal(corpo.atribuicao.originDesc?.length, 500);
  assert.equal(corpo.atribuicao.campos.bb_lp_version?.length, 40);
  assert.equal(corpo.atribuicao.campos.bb_fbclid?.length, 400);
  assert.equal("originId" in corpo.atribuicao, false);
});

test("corpoDaInscricao: chave fora da allowlist bb_* não passa", () => {
  const fields = { bb_lp_version: "curso-assinatura", bb_qualquer: "x", outra: "y" } as unknown as CadastroConcluido["atribuicao"]["fields"];
  const corpo = corpoDaInscricao(cadastro({ atribuicao: { originId: 1, originDesc: null, fields } }), CHAVE);
  assert.deepEqual(corpo.atribuicao.campos, { bb_lp_version: "curso-assinatura" });
});

// ─── Inscrição com repetição ──────────────────────────────────────────────────────────────

const inscrito = () => json(201, { status: "inscrito", codigo: "K7M2QX", token: TOKEN });

test("inscrição 201 → código e token; POST na rota com o corpo", async () => {
  const { f, chamadas } = fetchFalso([inscrito]);
  const corpo = corpoDaInscricao(cadastro(), CHAVE);
  const r = await inscreverNoCurso(corpo, { fetch: f, base: BASE });
  assert.deepEqual(r, { ok: true, codigo: "K7M2QX", token: TOKEN });
  assert.equal(chamadas[0].url, `${BASE}/api/curso/inscricao`);
  assert.equal(chamadas[0].init?.method, "POST");
  assert.deepEqual(JSON.parse(String(chamadas[0].init?.body)), corpo);
});

test("inscrição: 503 e rede caída repetem com a MESMA chave (1 s e 3 s); a 3ª dá certo", async () => {
  const esperas: number[] = [];
  const { f, chamadas } = fetchFalso([
    () => json(503, { status: "erro", detalhe: "indisponivel" }),
    () => { throw new TypeError("Failed to fetch"); },
    inscrito,
  ]);
  const r = await inscreverNoCurso(corpoDaInscricao(cadastro(), CHAVE), { fetch: f, base: BASE, esperar: async (ms) => void esperas.push(ms) });
  assert.equal(r.ok, true);
  assert.deepEqual(esperas, [1000, 3000]);
  assert.equal(chamadas.length, 3);
  const chaves = chamadas.map((c) => JSON.parse(String(c.init?.body)).chave);
  assert.deepEqual(chaves, [CHAVE, CHAVE, CHAVE]);
});

test("inscrição: 400 não repete nem guarda; 429 não repete e guarda para a próxima visita", async () => {
  const quatrocentos = fetchFalso([() => json(400, { status: "erro", detalhe: "corpo_invalido", campos: ["telefone"] })]);
  assert.deepEqual(
    await inscreverNoCurso(corpoDaInscricao(cadastro(), CHAVE), { fetch: quatrocentos.f, base: BASE, esperar: async () => {} }),
    { ok: false, motivo: "corpo_invalido", guardarPendente: false },
  );
  assert.equal(quatrocentos.chamadas.length, 1);
  const limite = fetchFalso([() => json(429, { status: "erro", detalhe: "limite" })]);
  assert.deepEqual(
    await inscreverNoCurso(corpoDaInscricao(cadastro(), CHAVE), { fetch: limite.f, base: BASE, esperar: async () => {} }),
    { ok: false, motivo: "limite", guardarPendente: true },
  );
  assert.equal(limite.chamadas.length, 1);
});

test("inscrição: 201 com token fora do formato é falha (e tenta de novo)", async () => {
  const { f, chamadas } = fetchFalso([() => json(201, { status: "inscrito", codigo: "K7M2QX", token: "curto" })]);
  const r = await inscreverNoCurso(corpoDaInscricao(cadastro(), CHAVE), { fetch: f, base: BASE, esperar: async () => {} });
  assert.deepEqual(r, { ok: false, motivo: "resposta_inesperada", guardarPendente: true });
  assert.equal(chamadas.length, 3);
});

test("inscrição pendente no aparelho: guarda, lê e apaga; lixo vira null", () => {
  const s = memoria();
  const corpo: CorpoInscricao = corpoDaInscricao(cadastro(), CHAVE);
  guardarInscricaoPendente(s, corpo);
  assert.deepEqual(lerInscricaoPendente(s), corpo);
  s.setItem(CHAVE_INSCRICAO_PENDENTE, "{lixo");
  assert.equal(lerInscricaoPendente(s), null);
});

// ─── Token no aparelho e nas chamadas (§3) ────────────────────────────────────────────────

test("token guardado: só com o formato; armazenamento que lança não derruba nada", () => {
  const s = memoria();
  guardarToken(s, "curto");
  assert.equal(s.dados.has(CHAVE_TOKEN), false);
  guardarToken(s, TOKEN);
  assert.equal(lerTokenGuardado(s), TOKEN);
  apagarToken(s);
  assert.equal(lerTokenGuardado(s), null);
  const quebrado = {
    getItem: () => { throw new Error("SecurityError"); },
    setItem: () => { throw new Error("QuotaExceeded"); },
    removeItem: () => { throw new Error("SecurityError"); },
  };
  assert.equal(lerTokenGuardado(quebrado), null);
  assert.doesNotThrow(() => guardarToken(quebrado, TOKEN));
  assert.doesNotThrow(() => apagarToken(quebrado));
  assert.equal(lerTokenGuardado(null), null);
});

test("GET do aluno: token no cabeçalho Authorization, nunca na URL; 200 vira o estado", async () => {
  const { f, chamadas } = fetchFalso([
    () => json(200, { aluno: { codigo: "K7M2QX", primeiroNome: "João", email: null, whatsapp: "(31) 97226-8877", temAssinatura: true }, aulas: [] }),
  ]);
  const r = await lerAluno(TOKEN, { fetch: f, base: BASE });
  assert.ok(r.ok);
  assert.equal(r.dados.aluno.temAssinatura, true);
  assert.equal(r.dados.aulas.length, 6);
  assert.equal(chamadas[0].url, `${BASE}/api/curso/aluno`);
  assert.ok(!chamadas[0].url.includes(TOKEN));
  assert.equal((chamadas[0].init?.headers as Record<string, string>).Authorization, `Bearer ${TOKEN}`);
  assert.equal(chamadas[0].init?.cache, "no-store");
});

test("GET do aluno: 401 = token_invalido; token malformado nem chama; 429 e rede têm motivo próprio", async () => {
  const quatrocentos = fetchFalso([() => json(401, { status: "token_invalido" })]);
  assert.deepEqual(await lerAluno(TOKEN, { fetch: quatrocentos.f, base: BASE }), { ok: false, motivo: "token_invalido" });
  const nunca = fetchFalso([() => json(200, {})]);
  assert.deepEqual(await lerAluno("curto", { fetch: nunca.f, base: BASE }), { ok: false, motivo: "token_invalido" });
  assert.equal(nunca.chamadas.length, 0);
  assert.deepEqual(await lerAluno(TOKEN, { fetch: fetchFalso([() => json(429, {})]).f, base: BASE }), { ok: false, motivo: "limite" });
  assert.deepEqual(await lerAluno(TOKEN, { fetch: fetchFalso([() => { throw new TypeError("x"); }]).f, base: BASE }), { ok: false, motivo: "rede" });
  assert.deepEqual(await lerAluno(TOKEN, { fetch: fetchFalso([() => json(200, { estranho: true })]).f, base: BASE }), { ok: false, motivo: "servidor" });
});

test("progresso, ficha e sinal: corpos exatos do contrato (§4.2–§4.4)", async () => {
  const { f, chamadas } = fetchFalso([
    () => json(200, { status: "ok", marco: 90, aulasConcluidas: 3 }),
    () => json(200, { status: "salvo", derivados: { tetoDoPlano: 110 } }),
    () => json(200, { status: "ja_registrado" }),
    () => json(200, { status: "registrado" }),
  ]);
  const o = { fetch: f, base: BASE };
  assert.deepEqual(await registrarProgresso(TOKEN, 3, 90, o), { ok: true, dados: { marco: 90, aulasConcluidas: 3 } });
  assert.deepEqual(await salvarFicha(TOKEN, 1, { precoCorte: 55 }, o), { ok: true, dados: { derivados: { tetoDoPlano: 110 } } });
  assert.deepEqual(await registrarSinal(TOKEN, { aula: 3, dataQuerComecar: "2026-11-03" }, o), { ok: true, dados: { status: "ja_registrado" } });
  assert.deepEqual(await registrarSinal(TOKEN, { aula: 6, dataQuerComecar: null }, o), { ok: true, dados: { status: "registrado" } });
  assert.deepEqual(chamadas.map((c) => c.url.replace(BASE, "")), [
    "/api/curso/aluno/progresso",
    "/api/curso/aluno/ficha",
    "/api/curso/aluno/sinal",
    "/api/curso/aluno/sinal",
  ]);
  assert.deepEqual(chamadas.map((c) => JSON.parse(String(c.init?.body))), [
    { aula: 3, marco: 90 },
    { aula: 1, respostas: { precoCorte: 55 } },
    { tipo: "quero_isso", aula: 3, dataQuerComecar: "2026-11-03" },
    { tipo: "quero_isso", aula: 6 },
  ]);
  for (const c of chamadas) assert.equal((c.init?.headers as Record<string, string>).Authorization, `Bearer ${TOKEN}`);
});

test("ficha 400: os campos que o servidor recusou voltam para a tela marcar", async () => {
  const { f } = fetchFalso([() => json(400, { status: "erro", detalhe: "ficha_invalida", campos: ["percentualPote", 7] })]);
  assert.deepEqual(await salvarFicha(TOKEN, 4, { percentualPote: 40 }, { fetch: f, base: BASE }), { ok: false, motivo: "invalido", campos: ["percentualPote"] });
});

test("pedir o link: 202 é ok exista ou não o cadastro; corpo só com o e-mail; sem token", async () => {
  const { f, chamadas } = fetchFalso([() => json(202, { status: "ok" })]);
  assert.deepEqual(await pedirLink({ email: "joao@exemplo.com" }, { fetch: f, base: BASE }), { ok: true, dados: null });
  assert.deepEqual(JSON.parse(String(chamadas[0].init?.body)), { email: "joao@exemplo.com" });
  assert.equal((chamadas[0].init?.headers as Record<string, string>).Authorization, undefined);
  assert.deepEqual(await pedirLink({ email: "x@y.z" }, { fetch: fetchFalso([() => json(429, {})]).f, base: BASE }), { ok: false, motivo: "limite" });
});

// ─── Links (§3 e §12) ─────────────────────────────────────────────────────────────────────

test("linkDaArea: token no fragmento, e a área lê de volta o que o link pediu", () => {
  const link = linkDaArea(TOKEN, { aula: 4, abrir: "sinal" }, "https://bestbarbers.app");
  assert.equal(link, `https://bestbarbers.app/curso-assinatura/aluno#t=${TOKEN}&aula=4&abrir=sinal`);
  const [, hash] = link.split("#");
  assert.deepEqual(lerFragmento(`#${hash}`), { token: TOKEN, aula: 4, abrir: "sinal", tinha: true });
  assert.equal(linkDaArea(TOKEN), `/curso-assinatura/aluno#t=${TOKEN}`);
});

test("bônus do Lucas: a mensagem termina em (aluno <codigo>), o sufixo que o contrato fixa", () => {
  const link = linkBonusLucas("5531988887777", TEXTOS_AREA.bonus.mensagem, "K7M2QX");
  const texto = decodeURIComponent(link.split("?text=")[1]);
  assert.ok(link.startsWith("https://wa.me/5531988887777?text="));
  assert.match(texto, /\(aluno ([0-9A-HJKMNP-TV-Z]{6})\)\s*$/, "o padrão que o Lucas lê");
  assert.ok(texto.includes("lembretes das aulas"), "a frase que o bloco F reconhece");
  assert.ok(!texto.includes("cód."), "o (cód. dealId) é da nutrição, não do curso");
});

test("bônus do Lucas: número vazio, fora do formato ou código estranho = sem botão", () => {
  assert.equal(linkBonusLucas("", "Oi", "K7M2QX"), "");
  assert.equal(linkBonusLucas("31988887777", "Oi", "K7M2QX"), "");
  assert.equal(linkBonusLucas("5531988887777", "Oi", "K7M2QI"), "", "I não existe no alfabeto Crockford");
  assert.equal(linkLucasSemCodigo("", "Oi"), "");
  assert.equal(linkLucasSemCodigo("5531988887777", "Oi"), "https://wa.me/5531988887777?text=Oi");
});

// ─── Revisão adversarial (06/Out/26) ──────────────────────────────────────────────────────

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test("novaChave: com randomUUID usa ele; sem ele (Safari < 15.4) monta um v4 válido para o OS", () => {
  assert.match(novaChave(), UUID_V4);
  assert.equal(novaChave({ getRandomValues: (a) => a, randomUUID: () => CHAVE }), CHAVE);
  const semUuid = { getRandomValues: <T extends Uint8Array>(a: T): T => { a.fill(0xff); return a; } };
  const chave = novaChave(semUuid);
  assert.match(chave, UUID_V4, "a rota do OS só aceita UUID v4");
  assert.equal(chave, "ffffffff-ffff-4fff-bfff-ffffffffffff");
  assert.notEqual(novaChave({ getRandomValues: (a) => globalThis.crypto.getRandomValues(a) }), novaChave({ getRandomValues: (a) => globalThis.crypto.getRandomValues(a) }));
});

test("progresso: navegador que recusa keepalive com preflight (TypeError) repete sem keepalive", async () => {
  const { f, chamadas } = fetchFalso([
    () => { throw new TypeError("Preflight request for request with keepalive specified is currently not supported"); },
    () => json(200, { status: "ok", marco: 90, aulasConcluidas: 3 }),
  ]);
  const r = await registrarProgresso(TOKEN, 3, 90, { fetch: f, base: BASE });
  assert.deepEqual(r, { ok: true, dados: { marco: 90, aulasConcluidas: 3 } });
  assert.equal(chamadas.length, 2);
  assert.equal(chamadas[0].init?.keepalive, true);
  assert.equal(chamadas[1].init?.keepalive, undefined);
  assert.deepEqual(JSON.parse(String(chamadas[1].init?.body)), { aula: 3, marco: 90 });
});

test("progresso: resposta HTTP (mesmo 5xx) não repete na hora; o player repete com espera", async () => {
  const { f, chamadas } = fetchFalso([() => json(503, { status: "erro", detalhe: "indisponivel" })]);
  assert.deepEqual(await registrarProgresso(TOKEN, 1, 25, { fetch: f, base: BASE }), { ok: false, motivo: "servidor" });
  assert.equal(chamadas.length, 1);
});
