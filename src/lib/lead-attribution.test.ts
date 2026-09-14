/**
 * Guarda do `bb_ad_id`: com `ad_id={{ad.id}}` resolvido na URL, o campo recebe o id
 * NUMÉRICO (chave 1:1 com a Meta); sem ele, cai no nome (leads legados / links manuais).
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./lead-attribution.ts";
const { buildLeadAttribution } = modulo as typeof import("./lead-attribution");

// `window` falso só com o que o builder lê (search + pathname) — tipado como parcial
// em vez de `any`, para o lint não precisar de exceção num arquivo de teste.
type JanelaDeTeste = { window?: { location: { search: string; pathname: string } } };

const comUrl = (search: string, utm: Record<string, string> = { utm_content: "VIDEO-X-MEIO" }) => {
  const global = globalThis as unknown as JanelaDeTeste;
  global.window = { location: { search, pathname: "/clube" } };
  const r = buildLeadAttribution({
    utmParams: utm as unknown as Parameters<typeof buildLeadAttribution>[0]["utmParams"],
    originId: 1,
    originDesc: null,
  });
  delete global.window;
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

test("macro da Meta não substituída vira ausência: campos vazios, descrição com n/d, fase preservada", () => {
  const r = comUrl(
    "?fase=LAB-AGO26&campanha={{campaign.name}}&publico={{adset.name}}&ad={{ad.name}}&creative={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}",
    { utm_content: "{{ad.name}}", utm_campaign: "{{campaign.name}}", utm_source: "meta" },
  );
  assert.equal(r.fields.bb_wave, "LAB-AGO26");
  assert.equal(r.fields.bb_utm_source, "meta");
  for (const k of ["bb_campaign_id", "bb_campaign_name", "bb_adset_id", "bb_ad_id", "bb_audience_type", "bb_utm_content", "bb_utm_campaign"] as const)
    assert.equal(r.fields[k], undefined, k);
  assert.equal(r.originDesc, "clube | LAB-AGO26 | n/d | n/d | n/d | n/d | n/d | n/d");
  assert.doesNotMatch(r.originDesc ?? "", /\{\{/);
});
