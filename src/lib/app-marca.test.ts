/**
 * Tema do app com a marca (`app-marca.ts`), extraído do whitelabel do bestbarbers-web-cra.
 * Runner: `node --test` (npm test).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./app-marca.ts";

const { CORES_PADRAO_APP, PALETAS_APP, contraste, ehHex, temaComPrincipal, variaveisDoTema } =
  modulo as typeof import("./app-marca");

test("padrões = `defaultColors` do whitelabel (a demonstração não pode inventar o app)", () => {
  assert.deepEqual(CORES_PADRAO_APP, {
    primary: "#45BBD7",
    secondary: "#111111",
    background: "#000000",
    component: "#1F1F1F",
    backgroundComponent: "#292929",
    backgroundBottomBar: "#1F1F1F",
    border: "#363D49",
    white: "#EBE9E1",
  });
});

test("paletas: todas hex válidas, nomes únicos, a 1ª é a padrão do app", () => {
  assert.equal(PALETAS_APP[0].cores, CORES_PADRAO_APP);
  assert.equal(new Set(PALETAS_APP.map((p) => p.nome)).size, PALETAS_APP.length);
  for (const p of PALETAS_APP) for (const v of Object.values(p.cores)) assert.ok(ehHex(v), `${p.nome}: ${v}`);
});

test("contraste WCAG: preto × branco = 21, igual × igual = 1", () => {
  assert.equal(Math.round(contraste("#000000", "#FFFFFF")), 21);
  assert.equal(contraste("#45BBD7", "#45BBD7"), 1);
});

test("a cor do dono nunca apaga o «Agendar»: o texto do botão escolhe o lado legível", () => {
  for (const cor of ["#0A1F44", "#7A0019", "#FFFFFF", "#F2F2F2", "#45BBD7", "#E4B53B", "#123456", "#FF00FF"]) {
    const t = temaComPrincipal(cor);
    assert.equal(t.primary, cor);
    assert.ok(contraste(t.primary, t.secondary) >= 4.5, `${cor}: ${contraste(t.primary, t.secondary).toFixed(2)}`);
  }
  assert.equal(temaComPrincipal("#0A1F44").secondary, "#F5F5F5", "fundo escuro → texto claro");
  assert.equal(temaComPrincipal("#E4B53B").secondary, "#111111", "fundo claro → texto escuro");
  assert.deepEqual(temaComPrincipal("lixo"), CORES_PADRAO_APP, "valor inválido não quebra o app");
});

test("variáveis CSS: uma por chave, no formato --app-<chave>", () => {
  const v = variaveisDoTema(CORES_PADRAO_APP);
  assert.equal(Object.keys(v).length, 8);
  assert.equal(v["--app-primary"], "#45BBD7");
  assert.equal(v["--app-backgroundBottomBar"], "#1F1F1F");
});
