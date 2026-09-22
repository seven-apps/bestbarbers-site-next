/**
 * A REGRA DO SNAPSHOT — e as duas exceções de conjunto que vivem nela.
 *
 * `restaurarSnapshot` foi extraída de `getUtmParams` em 19/Set/26 justamente para caber
 * aqui: o "`publico` não restaura, `publicoSessao` restaura" é a decisão mais sutil do
 * arquivo e até então existia só como comentário. Comentário não quebra o build quando
 * alguém "conserta" a assimetria achando que é esquecimento.
 *
 * Runner: `node --test` (Node >= 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./useUtmParams.ts";
const { restaurarSnapshot } = modulo as typeof import("./useUtmParams");

type Utm = Parameters<typeof restaurarSnapshot>[0];

/** URL "limpa": é o estado de quem voltou ao site sem parâmetro nenhum. */
const urlLimpa = (over: Partial<Utm> = {}): Utm => ({
  utm_source: null,
  utm_desc: null,
  utm_inf: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  publico: null,
  publicoSessao: null,
  origin: null,
  odesc: null,
  fbclid: null,
  fbclidFresh: null,
  gclid: null,
  ...over,
});

const SNAPSHOT_CELULA_B = {
  utm_source: "meta",
  utm_campaign: "BB-MEIO-P1-M2-SINAL-EQUIPE-SET26",
  utm_content: "VIDEO-P1-M2-EQUIPE-01",
  publico: "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE",
  publicoSessao: "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE",
};

test("URL limpa: o snapshot preenche o que falta", () => {
  const r = restaurarSnapshot(urlLimpa(), SNAPSHOT_CELULA_B);
  assert.equal(r.utm_source, "meta");
  assert.equal(r.utm_campaign, "BB-MEIO-P1-M2-SINAL-EQUIPE-SET26");
  assert.equal(r.utm_content, "VIDEO-P1-M2-EQUIPE-01");
});

test("EXCEÇÃO 1 — `publico` NUNCA volta do snapshot (o gate de score ficaria cego)", () => {
  // Restaurar o `publico` faria o gate aplicar o corte da PRIMEIRA célula a um lead do
  // controle: 'Lead' suprimido em quem serve de régua, e a experiência sem comparação.
  // Sem restore o gate erra para o lado seguro (Lead cru, como sempre foi).
  assert.equal(restaurarSnapshot(urlLimpa(), SNAPSHOT_CELULA_B).publico, null);
});

test("EXCEÇÃO 2 — `publicoSessao` VOLTA do snapshot (é o conjunto que chega ao card)", () => {
  // Ele não alimenta gate nenhum: só atribuição (bb_adset_id). Nada é suprimido a partir
  // dele, então o risco de first-touch é aceitável onde o do `publico` não era.
  const r = restaurarSnapshot(urlLimpa(), SNAPSHOT_CELULA_B);
  assert.equal(r.publicoSessao, "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE");
});

test("as duas exceções são ASSIMÉTRICAS de propósito, no mesmo retorno", () => {
  // O teste que uma "limpeza" futura quebra primeiro: quem igualar os dois campos —
  // para qualquer lado — derruba esta linha antes de derrubar a leitura do A/B em produção.
  const r = restaurarSnapshot(urlLimpa(), SNAPSHOT_CELULA_B);
  assert.notEqual(r.publico, r.publicoSessao);
});

test("URL viva ganha do snapshot, inclusive no conjunto da sessão", () => {
  const r = restaurarSnapshot(
    urlLimpa({ publico: "AMPLO-P1-M2-ADVANTAGE-SINAL-LEAD", publicoSessao: "AMPLO-P1-M2-ADVANTAGE-SINAL-LEAD", utm_source: "insta" }),
    SNAPSHOT_CELULA_B,
  );
  assert.equal(r.publico, "AMPLO-P1-M2-ADVANTAGE-SINAL-LEAD");
  assert.equal(r.publicoSessao, "AMPLO-P1-M2-ADVANTAGE-SINAL-LEAD");
  assert.equal(r.utm_source, "insta");
});

test("snapshot ANTIGO (sem publicoSessao) ainda entrega o conjunto", () => {
  // Quem já estava navegando na hora do deploy tem um snapshot gravado pela versão
  // anterior: mesmo valor, só com o nome antigo. Sem este fallback, essas sessões
  // chegariam ao card sem conjunto — e o A/B começaria com um buraco de um dia.
  const antigo = { publico: "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE", utm_source: "meta" };
  assert.equal(restaurarSnapshot(urlLimpa(), antigo).publicoSessao, "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE");
  assert.equal(restaurarSnapshot(urlLimpa(), antigo).publico, null);
});

test("snapshot vazio não inventa nada: tudo null, nada undefined", () => {
  const r = restaurarSnapshot(urlLimpa(), {});
  for (const [k, v] of Object.entries(r)) assert.equal(v, null, k);
});
