import { test } from "node:test";
import assert from "node:assert/strict";
import { CUPONS_PARCEIROS, acharCupom, cupomDaUrl, caminhoDoCupom, mensagemLucasDoCupom, doParceiro } from "./cupom-parceiro.ts";

const DENTRO = new Date("2026-10-20T12:00:00-03:00");
const DEPOIS = new Date("2026-11-01T00:00:01-03:00");

test("os 22 cupons de 15/Out/26: códigos, slugs e origens únicos", () => {
  assert.equal(CUPONS_PARCEIROS.length, 22);
  for (const campo of ["codigo", "slug", "originId"] as const) {
    assert.equal(new Set(CUPONS_PARCEIROS.map((c) => c[campo])).size, 22, `${campo} repetido`);
  }
  assert.ok(CUPONS_PARCEIROS.every((c) => /^[A-Z]+200$/.test(c.codigo)));
});

test("acha o cupom sem diferenciar maiúsculas, só até 31/Out", () => {
  assert.equal(acharCupom("seletto200", DENTRO)?.slug, "joao-seletto");
  assert.equal(acharCupom(" THECHAMPS200 ", DENTRO)?.originId, 120001224);
  assert.equal(acharCupom("GRATIS999", DENTRO), null);
  assert.equal(acharCupom("", DENTRO), null);
  assert.equal(acharCupom("SELETTO200", DEPOIS), null);
  assert.equal(acharCupom("SELETTO200", new Date("2026-10-31T23:59:00-03:00"))?.codigo, "SELETTO200");
});

test("o cupom de um parceiro no link de outro não vale", () => {
  assert.equal(cupomDaUrl({ cupom: "SELETTO200", source: "joao-seletto" }, DENTRO)?.codigo, "SELETTO200");
  assert.equal(cupomDaUrl({ cupom: "SELETTO200", source: "jorgin" }, DENTRO), null);
  assert.equal(cupomDaUrl({ cupom: "SELETTO200" }, DENTRO)?.codigo, "SELETTO200");
});

test("o link longo carrega slug, origem, nome e cupom", () => {
  const c = acharCupom("THAIS200", DENTRO)!;
  const q = new URLSearchParams(caminhoDoCupom(c).split("?")[1]);
  assert.deepEqual(Object.fromEntries(q), { source: "thais-dantunes", origin: "40215957", odesc: "Thais D'Antunes", cupom: "THAIS200" });
  assert.equal(doParceiro(c), "da Thaís D'Antunes");
  assert.match(mensagemLucasDoCupom(c), /^Oi! Vim pelo cupom THAIS200, da Thaís D'Antunes\./);
  assert.equal(doParceiro(acharCupom("JORGIN200", DENTRO)!), "do Jorgin");
});
