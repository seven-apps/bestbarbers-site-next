/**
 * O POST do recadastro: o pedido de Nutrição do < 60 (emenda de 10/Out/26 ao ADR-035) e o `pipe` da resposta.
 * Roda no `npm test` (node --test), sem rede: o fetch é falso.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { criarCardRecadastro, type RecadastroInput } from "./recadastro.ts";

function fetchFalso(status: number, corpo: unknown) {
  const chamadas: Array<{ url: string; init?: RequestInit }> = [];
  const f = (async (url: string, init?: RequestInit) => {
    chamadas.push({ url, init });
    return new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json" } });
  }) as unknown as typeof fetch;
  return { f, chamadas };
}

const input = (over: Partial<RecadastroInput> = {}): RecadastroInput => ({
  phone: "(31) 99999-8888",
  barbershopName: "Barbearia do Zé",
  atribuicao: { originId: null, originDesc: null, fields: {} as never, leadScore: 20 },
  ...over,
});

test("com o pedido de Nutrição: manda nutricao=true e devolve o pipe do card", async () => {
  const { f, chamadas } = fetchFalso(201, { status: "criado", dealId: 777, contactId: 900, pipe: "nutricao" });
  const r = await criarCardRecadastro(input({ nutricao: true }), { fetch: f });
  assert.deepEqual(r, { ok: true, dealId: 777, contactId: 900, pipe: "nutricao" });
  const corpo = JSON.parse(String(chamadas[0].init?.body));
  assert.equal(corpo.nutricao, true);
  assert.equal(corpo.leadScore, 20);
  assert.match(chamadas[0].url, /\/api\/ploomes\/recadastro-deal$/);
});

test("sem o pedido: o corpo não leva nutricao; OS antigo sem pipe devolve sem pipe (= Qualificação)", async () => {
  const { f, chamadas } = fetchFalso(201, { status: "criado", dealId: 555, contactId: 900 });
  const r = await criarCardRecadastro(input(), { fetch: f });
  assert.deepEqual(r, { ok: true, dealId: 555, contactId: 900 });
  assert.equal("nutricao" in JSON.parse(String(chamadas[0].init?.body)), false);
});

test("pipe desconhecido é ignorado; erro HTTP é falha", async () => {
  const estranho = fetchFalso(201, { status: "criado", dealId: 555, pipe: "outro" });
  assert.deepEqual(await criarCardRecadastro(input({ nutricao: true }), { fetch: estranho.f }), { ok: true, dealId: 555, contactId: undefined });
  const erro = fetchFalso(502, { status: "erro" });
  assert.deepEqual(await criarCardRecadastro(input({ nutricao: true }), { fetch: erro.f }), { ok: false, motivo: "http_502" });
});
