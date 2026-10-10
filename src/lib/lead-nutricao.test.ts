/**
 * Lead < 60 → Lucas (ADR-035). Testa a regra e o contrato com a rota do OS com `fetch` FALSO:
 * nenhum teste aqui chama a rede, muito menos a rota de produção.
 *
 * O hook (`useLeadForm`) não roda fora do build — sem jsdom nem testing-library, e com os
 * aliases `@/` —, então a orquestração mora em funções puras daqui e o hook só as chama. O que
 * é do hook é conferido no código-fonte, como em `useLeadForm.eventos.test.ts`.
 *
 * Runner: `node --test`. Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  abaixoDoCorte,
  cadastrarContatoNovo,
  caminhoDoLead,
  corpoDaNutricao,
  criarLeadNutricao,
  linkDoWhatsAppLucas,
  mensagemDaPagina,
  numeroValidoDoLucas,
  type CorpoNutricao,
  type ResultadoNutricao,
} from "./lead-nutricao.ts";
import {
  PLOOMES_CONTACT_FIELDS,
  PLOOMES_CONTACT_INT_FIELDS,
  PLOOMES_CONTACT_OPTION_FIELDS,
  PLOOMES_LEGACY_FIELDS,
} from "./ploomes-fields.ts";
import {
  MENSAGEM_PADRAO_LUCAS,
  MENSAGENS_LUCAS,
  NUMERO_WHATSAPP_LUCAS,
  TEXTOS_CONVERSA_LUCAS,
} from "../content/lucas-whatsapp.ts";

const NUMERO = "5531988887777";

const corpo = (): CorpoNutricao =>
  corpoDaNutricao({
    contato: {
      Name: "Barbearia Teste",
      OriginId: 40210426,
      Phones: [{ PhoneNumber: "(31) 98888-7777", TypeId: 2, CountryId: 0 }],
      OtherProperties: [{ FieldKey: PLOOMES_LEGACY_FIELDS.ownerName, StringValue: "Dono Teste" }],
    },
    atribuicao: { originId: 40210426, originDesc: "[SCORE: 40] desc", fields: { bb_lp_version: "clube" }, leadScore: 40 },
    nota: 40,
    faturamento: "De R$ 2.001 a R$ 5.000",
    colaboradores: "Sou apenas eu",
  });

/** `fetch` falso que devolve a resposta dada e guarda o que recebeu. */
function fetchFalso(resposta: () => Response | Promise<Response>) {
  const chamadas: Array<{ url: string; init?: RequestInit }> = [];
  const f = (async (url: string, init?: RequestInit) => {
    chamadas.push({ url, init });
    return resposta();
  }) as unknown as typeof fetch;
  return { f, chamadas };
}

const json = (status: number, corpoResposta: unknown) =>
  new Response(JSON.stringify(corpoResposta), { status, headers: { "Content-Type": "application/json" } });

// ─── A regra do corte (a mesma do servidor) ───────────────────────────────────────────────

test("abaixoDoCorte: < 60 está; 60 ou mais, ausente e NaN não estão", () => {
  for (const n of [59, 59.9, 0, -100]) assert.equal(abaixoDoCorte(n), true, String(n));
  for (const n of [60, 60.1, 100, null, undefined, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(abaixoDoCorte(n), false, String(n));
  }
});

test("caminhoDoLead: < 60 com contato novo e número do Lucas → lucas", () => {
  assert.equal(caminhoDoLead({ telefoneExiste: false, nota: 40, numeroLucas: NUMERO }), "lucas");
});

test("caminhoDoLead: telefone que já existe → recadastro, mesmo com nota < 60", () => {
  assert.equal(caminhoDoLead({ telefoneExiste: true, nota: 40, numeroLucas: NUMERO }), "recadastro");
  assert.equal(caminhoDoLead({ telefoneExiste: true, nota: 80, numeroLucas: NUMERO }), "recadastro");
});

test("caminhoDoLead: nota ≥ 60 e sem nota → sdr (o caminho de hoje)", () => {
  assert.equal(caminhoDoLead({ telefoneExiste: false, nota: 60, numeroLucas: NUMERO }), "sdr");
  assert.equal(caminhoDoLead({ telefoneExiste: false, nota: 95, numeroLucas: NUMERO }), "sdr");
  assert.equal(caminhoDoLead({ telefoneExiste: false, nota: null, numeroLucas: NUMERO }), "sdr");
});

test("caminhoDoLead: sem número do Lucas (vazio ou torto) → sdr, a rota nem é chamada", () => {
  for (const numeroLucas of ["", "   ", "31988887777", "55319888", "abc"]) {
    assert.equal(caminhoDoLead({ telefoneExiste: false, nota: 40, numeroLucas }), "sdr", numeroLucas);
  }
  assert.equal(numeroValidoDoLucas("+55 (31) 98888-7777"), NUMERO);
});

// ─── A orquestração do contato novo ───────────────────────────────────────────────────────

test("< 60: chama a rota e devolve o card e o contato; o caminho de hoje NÃO roda", async () => {
  let hoje = 0;
  const feito = await cadastrarContatoNovo(
    "lucas",
    async (): Promise<ResultadoNutricao> => ({ ok: true, dealId: 1202661959, contactId: 120554433 }),
    async () => { hoje++; },
  );
  assert.deepEqual(feito, { caminho: "lucas", dealId: 1202661959, contactId: 120554433 });
  assert.equal(hoje, 0);
});

test("< 60 com a rota sem contactId (versão antiga do OS): o card vale, o contato fica null", async () => {
  const feito = await cadastrarContatoNovo(
    "lucas",
    async (): Promise<ResultadoNutricao> => ({ ok: true, dealId: 1202661959 }),
    async () => ({ contactId: 1 }),
  );
  assert.deepEqual(feito, { caminho: "lucas", dealId: 1202661959, contactId: null });
});

test("< 60 com a rota falhando: cai no caminho de hoje e não devolve card", async () => {
  const avisos: unknown[] = [];
  const warn = console.warn;
  console.warn = (...a: unknown[]) => { avisos.push(a); };
  try {
    let hoje = 0;
    const feito = await cadastrarContatoNovo(
      "lucas",
      async (): Promise<ResultadoNutricao> => ({ ok: false, motivo: "http_502" }),
      async () => { hoje++; return { contactId: 120554433 }; },
    );
    // O caminho é o que RODOU: o `lucas` que falhou vira `sdr` (o curso inscreve com isso).
    assert.deepEqual(feito, { caminho: "sdr", dealId: null, contactId: 120554433 });
    assert.equal(hoje, 1);
    assert.equal(avisos.length, 1, "falha da rota não pode ser silenciosa");
  } finally {
    console.warn = warn;
  }
});

test("sdr (≥ 60, sem nota, sem número): a rota nunca é chamada", async () => {
  let rota = 0;
  let hoje = 0;
  const feito = await cadastrarContatoNovo(
    "sdr",
    async (): Promise<ResultadoNutricao> => { rota++; return { ok: true, dealId: 1 }; },
    async () => { hoje++; },
  );
  // Caminho de hoje sem id na resposta (ou chamador antigo que devolve void): contato null.
  assert.deepEqual(feito, { caminho: "sdr", dealId: null, contactId: null });
  assert.equal(rota, 0);
  assert.equal(hoje, 1);
});

test("erro do caminho de hoje sobe para o formulário, como sempre subiu", async () => {
  const warn = console.warn;
  console.warn = () => {};
  try {
    await assert.rejects(
      cadastrarContatoNovo(
        "lucas",
        async (): Promise<ResultadoNutricao> => ({ ok: false, motivo: "TypeError" }),
        async () => { throw new Error("Erro ao criar contato no Ploomes: 500"); },
      ),
      /Erro ao criar contato/,
    );
  } finally {
    console.warn = warn;
  }
});

// ─── O POST na rota do OS ─────────────────────────────────────────────────────────────────

test("201 criado → ok com o dealId e o contactId; POST JSON na rota da nutrição da mesma base do recadastro", async () => {
  const { f, chamadas } = fetchFalso(() => json(201, { status: "criado", contactId: 9, dealId: 1202661959 }));
  const r = await criarLeadNutricao(corpo(), { fetch: f });
  assert.deepEqual(r, { ok: true, dealId: 1202661959, contactId: 9 });
  assert.equal(chamadas.length, 1);
  assert.match(chamadas[0].url, /\/api\/ploomes\/lead-nutricao$/);
  assert.equal(chamadas[0].init?.method, "POST");
  assert.ok(chamadas[0].init?.signal, "sem signal não há timeout");
  assert.deepEqual(JSON.parse(String(chamadas[0].init?.body)), corpo());
});

test("409, 400, 502 e 503 → falha (o lead segue o caminho de hoje)", async () => {
  for (const status of [409, 400, 502, 503, 500, 200]) {
    const { f } = fetchFalso(() => json(status, { status: "erro" }));
    const r = await criarLeadNutricao(corpo(), { fetch: f });
    assert.deepEqual(r, { ok: false, motivo: `http_${status}` }, String(status));
  }
});

test("201 com resposta inesperada → falha", async () => {
  const respostas = [
    () => json(201, { status: "criado" }),
    () => json(201, { status: "criado", dealId: "1202661959" }),
    () => json(201, { status: "criado", dealId: 0 }),
    () => json(201, { status: "fora_do_corte", dealId: 1 }),
    () => new Response("<html>proxy</html>", { status: 201 }),
  ];
  for (const resposta of respostas) {
    const { f } = fetchFalso(resposta);
    const r = await criarLeadNutricao(corpo(), { fetch: f });
    assert.equal(r.ok, false);
  }
});

test("rede fora → falha, sem lançar", async () => {
  const { f } = fetchFalso(() => { throw new TypeError("Failed to fetch"); });
  assert.deepEqual(await criarLeadNutricao(corpo(), { fetch: f }), { ok: false, motivo: "TypeError" });
});

test("timeout → aborta e falha, sem lançar", async () => {
  const pendurado = ((_url: string, init?: RequestInit) =>
    new Promise<Response>((_, rejeitar) => {
      init?.signal?.addEventListener("abort", () => rejeitar(new DOMException("abortado", "AbortError")));
    })) as unknown as typeof fetch;
  const r = await criarLeadNutricao(corpo(), { fetch: pendurado, timeoutMs: 20 });
  assert.deepEqual(r, { ok: false, motivo: "AbortError" });
});

// ─── O corpo: exatamente o que o `leadNutricaoBodySchema` do OS aceita ────────────────────

test("corpo: OriginId nulo sai (o schema da rota não aceita null); positivo fica", () => {
  const semOrigem = corpoDaNutricao({
    contato: { Name: "B", OriginId: null, Phones: [{ PhoneNumber: "(31) 98888-7777" }], OtherProperties: [] },
    atribuicao: { originId: null, originDesc: null, fields: {} },
    nota: 10,
  });
  assert.equal("OriginId" in semOrigem.contato, false);
  assert.equal("origemDesc" in semOrigem.card, false);
  assert.equal(corpo().contato.OriginId, 40210426);
});

test("corpo: nota inteira no card e campos do formulário como no recadastro", () => {
  const c = corpoDaNutricao({
    contato: { Name: "B", Phones: [{ PhoneNumber: "(31) 98888-7777" }], OtherProperties: [] },
    atribuicao: { originId: 1, originDesc: "desc", fields: { bb_ad_id: "123" } },
    nota: 59.9,
    clube: "Quero começar",
    sistema: "Não utilizo nenhum",
  });
  assert.equal(c.card.leadScore, 59);
  assert.deepEqual(c.card, {
    origemDesc: "desc",
    clube: "Quero começar",
    sistema: "Não utilizo nenhum",
    leadScore: 59,
    atribuicao: { bb_ad_id: "123" },
  });
});

test("toda FieldKey de contato do site passa no filtro da rota (senão o < 60 volta ao SDR em silêncio)", () => {
  // Mesmo regex de `leadNutricaoBodySchema.contato.OtherProperties` (bestbarbers-ai/os/routes/ploomes-crm.ts).
  const regexDaRota = /^contact_[0-9A-Fa-f-]{36}$/;
  const chaves = [
    ...Object.values(PLOOMES_CONTACT_FIELDS),
    ...Object.values(PLOOMES_CONTACT_INT_FIELDS),
    ...Object.values(PLOOMES_CONTACT_OPTION_FIELDS),
    ...Object.values(PLOOMES_LEGACY_FIELDS),
  ];
  assert.ok(chaves.length >= 20);
  for (const chave of chaves) assert.match(chave, regexDaRota);
});

// ─── O link e a mensagem ──────────────────────────────────────────────────────────────────

test("< 60 com card: link do WhatsApp do Lucas com a mensagem da página e o código do card", () => {
  const mensagem = mensagemDaPagina("/clube", MENSAGENS_LUCAS, MENSAGEM_PADRAO_LUCAS);
  const link = linkDoWhatsAppLucas("+55 31 98888-7777", mensagem, 1202661959);
  const url = new URL(link);
  assert.equal(url.origin + url.pathname, `https://wa.me/${NUMERO}`);
  const texto = url.searchParams.get("text") ?? "";
  assert.ok(texto.startsWith(mensagem));
  // Contrato com o Lucas: o código fecha a mensagem neste formato.
  assert.match(texto, /\(cód\. 1202661959\)$/);
});

test("mensagemDaPagina: o caminho mais longo vence; subpágina herda; o resto cai no padrão", () => {
  const de = (p: string) => mensagemDaPagina(p, MENSAGENS_LUCAS, MENSAGEM_PADRAO_LUCAS);
  const texto = (caminho: string) => MENSAGENS_LUCAS.find((m) => m.caminho === caminho)?.mensagem;
  assert.equal(de("/clube/precificou-errado"), texto("/clube"));
  assert.equal(de("/clube/"), texto("/clube"));
  assert.equal(de("/projeto-do-clube/migracao"), texto("/projeto-do-clube/migracao"));
  assert.equal(de("/projeto-do-clube/condicoes"), texto("/projeto-do-clube"));
  assert.equal(de("/tabela-precificacao-clube-gated"), texto("/tabela-precificacao-clube-gated"));
  assert.equal(de("/"), MENSAGEM_PADRAO_LUCAS);
  assert.equal(de("/blog/qualquer"), MENSAGEM_PADRAO_LUCAS);
  assert.equal(de("/clubes"), MENSAGEM_PADRAO_LUCAS, "prefixo sem barra não casa");
});

test("textos: 'assinatura' e nunca 'clube'; o código não vai escrito à mão; número vazio ou válido", () => {
  const todos = [MENSAGEM_PADRAO_LUCAS, ...MENSAGENS_LUCAS.map((m) => m.mensagem), ...Object.values(TEXTOS_CONVERSA_LUCAS)];
  for (const t of todos) {
    assert.doesNotMatch(t, /clube/i, t);
    assert.doesNotMatch(t, /c[óo]d\./i, t);
    assert.ok(t.trim().length > 0);
  }
  assert.equal(new Set(MENSAGENS_LUCAS.map((m) => m.caminho)).size, MENSAGENS_LUCAS.length, "caminho repetido");
  assert.ok(
    NUMERO_WHATSAPP_LUCAS === "" || numeroValidoDoLucas(NUMERO_WHATSAPP_LUCAS) !== "",
    "número do Lucas preenchido fora do formato 55 + DDD + número: o < 60 voltaria ao SDR sem aviso",
  );
});

// ─── O hook, lido do código-fonte ─────────────────────────────────────────────────────────

const hook = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../hooks/useLeadForm.ts"), "utf8");

test("hook: a CAPI sai com keepalive (senão o evento some quando a página vai para o WhatsApp)", () => {
  const i = hook.indexOf("/api/meta-capi/track");
  const f = hook.indexOf("body: JSON.stringify", i);
  assert.ok(i > 0 && f > i, "envio da CAPI não encontrado — reancorar o teste");
  assert.match(hook.slice(i, f), /keepalive: true/);
});

test("hook: recadastro primeiro; contato novo pela orquestração, com submitLead como caminho de hoje", () => {
  assert.match(hook, /telefoneExiste: dedup\.exists/);
  assert.match(hook, /if \(caminho === 'recadastro'\) \{/);
  assert.match(hook, /\(\) => submitLead\(ploomesData\),\n\s*\);/);
  // Os eventos de pixel e CAPI continuam DEPOIS do cadastro, para todos os caminhos.
  assert.ok(hook.indexOf("cadastrarContatoNovo(") < hook.indexOf("const pixelPromises"));
});

test("hook: a conversa com o Lucas só abre com card criado, e o redirect genérico não roda junto", () => {
  assert.match(hook, /if \(dealIdLucas !== null\) \{[\s\S]*?abrirConversaComLucas\(/);
  assert.match(hook, /\} else if \(redirectToWhatsApp\) \{/);
});
