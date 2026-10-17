import { test } from "node:test";
import assert from "node:assert/strict";
import { CUPONS_PARCEIROS, acharCupom, cupomDaUrl, caminhoDoCupom, mensagemLucasDoCupom, doParceiro, cupomDoLinkNormal, buscaComCupom } from "./cupom-parceiro.ts";

const DENTRO = new Date("2026-10-20T12:00:00-03:00");
const DEPOIS = new Date("2026-11-01T00:00:01-03:00");

test("os 23 cupons de 15/Out/26: códigos, slugs e origens únicos", () => {
  assert.equal(CUPONS_PARCEIROS.length, 23);
  for (const campo of ["codigo", "slug", "originId"] as const) {
    assert.equal(new Set(CUPONS_PARCEIROS.map((c) => c[campo])).size, 23, `${campo} repetido`);
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

test("o link normal do Araújo abre o cupom; o dos outros parceiros, não", () => {
  const q = (s: string) => new URLSearchParams(s);
  assert.equal(cupomDoLinkNormal(q("source=araujo-salviano"), DENTRO)?.codigo, "ARAUJO200");
  assert.equal(cupomDoLinkNormal(q("source=Araujo-Salviano&origin=120001037&odesc=Ara%C3%BAjo%20Salviano"), DENTRO)?.codigo, "ARAUJO200");
  assert.equal(cupomDoLinkNormal(q("origin=120001037"), DENTRO)?.codigo, "ARAUJO200");
  assert.equal(cupomDoLinkNormal(q("source=joao-seletto"), DENTRO), null);
  assert.equal(cupomDoLinkNormal(q(""), DENTRO), null);
  // já com ?cupom= (válido ou não) não redireciona: sem laço, e cupom de outro parceiro continua sem valer
  assert.equal(cupomDoLinkNormal(q("source=araujo-salviano&cupom=ARAUJO200"), DENTRO), null);
  assert.equal(cupomDoLinkNormal(q("source=araujo-salviano&cupom="), DENTRO), null);
  assert.equal(cupomDoLinkNormal(q("source=araujo-salviano"), DEPOIS), null);
  assert.deepEqual(CUPONS_PARCEIROS.filter((c) => c.linkNormalComCupom).map((c) => c.slug), ["araujo-salviano"]);
});

test("o redirecionamento guarda as UTMs e completa o link do cupom", () => {
  const c = acharCupom("ARAUJO200", DENTRO)!;
  const r = buscaComCupom(new URLSearchParams("source=araujo-salviano&utm_source=cartao&fbclid=x"), c);
  assert.deepEqual(Object.fromEntries(r), {
    source: "araujo-salviano", utm_source: "cartao", fbclid: "x", origin: "120001037", odesc: "Araújo Salviano", cupom: "ARAUJO200",
  });
  assert.equal(cupomDaUrl({ cupom: r.get("cupom"), source: r.get("source") }, DENTRO)?.codigo, "ARAUJO200");
});
