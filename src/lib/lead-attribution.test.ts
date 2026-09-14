/**
 * Guarda do `bb_ad_id`: com `ad_id={{ad.id}}` resolvido na URL, o campo recebe o id
 * NUMÉRICO (chave 1:1 com a Meta); sem ele, cai no nome (leads legados / links manuais).
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./lead-attribution.ts";
const { buildLeadAttribution } = modulo as typeof import("./lead-attribution");

const comUrl = (search: string) => {
  (globalThis as any).window = { location: { search, pathname: "/clube" } };
  const r = buildLeadAttribution({ utmParams: { utm_content: "VIDEO-X-MEIO" } as any, originId: 1, originDesc: null });
  delete (globalThis as any).window;
  return r;
};

test("bb_ad_id = id numérico quando ad_id vem resolvido", () => {
  const r = comUrl("?fase=MEIO&campanha=C&publico=P&ad=VIDEO-X-MEIO&creative=VIDEO-X-MEIO&ad_id=120252994485710522");
  assert.equal(r.fields.bb_ad_id, "120252994485710522");
  assert.equal(r.fields.bb_utm_content, "VIDEO-X-MEIO");
  assert.match(r.originDesc ?? "", /\| VIDEO-X-MEIO \| VIDEO-X-MEIO \|/); // descrição segue com o NOME
});

test("bb_ad_id = nome quando ad_id falta ou vem como placeholder", () => {
  assert.equal(comUrl("?fase=MEIO&ad=VIDEO-X-MEIO").fields.bb_ad_id, "VIDEO-X-MEIO");
  assert.equal(comUrl("?fase=MEIO&ad=VIDEO-X-MEIO&ad_id={{ad.id}}").fields.bb_ad_id, "VIDEO-X-MEIO");
});
