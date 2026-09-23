/**
 * Testes das funções puras de `porta.ts` + guarda do mapa página→porta.
 *
 * Runner: `node --test` nativo (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 * O site não tem vitest/jest; este arquivo não depende de nada além de `node:*`.
 *
 * A guarda mais importante é a primeira: toda chave de `PORTA_POR_PAGINA` precisa
 * existir de verdade (rota `src/app/<chave>/page.tsx` ou slug em `src/content/blog`).
 * Chave errada não quebra o `tsc` — só faz o ViewContent daquela porta nunca disparar
 * (foi o caso de `/blog/como-calcular-comissao`, corrigido em 12/Set/2026).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import * as modulo from "./porta.ts";

const {
  CLUBE_FORK,
  PORTA_POR_PAGINA,
  forkDoClube,
  paramsDaPagina,
  paramsGuiaBaixado,
  portaDaPagina,
  portaDoLead,
  portaDoUtmContent,
  utmContentPorta,
} = modulo as typeof import("./porta");

const RAIZ_SRC = fileURLToPath(new URL("../../", import.meta.url));

/** Slugs reais do blog: `slug: "<x>"` em src/content/blog/*.ts (sem importar React). */
function slugsDoBlog(): Set<string> {
  const dir = join(RAIZ_SRC, "content", "blog");
  const slugs = new Set<string>();
  for (const arquivo of readdirSync(dir)) {
    if (!arquivo.endsWith(".ts")) continue;
    const conteudo = readFileSync(join(dir, arquivo), "utf8");
    for (const m of conteudo.matchAll(/^\s*slug:\s*["']([^"']+)["']/gm)) slugs.add(m[1]);
  }
  return slugs;
}

test("toda chave de PORTA_POR_PAGINA aponta para página que existe", () => {
  const slugs = slugsDoBlog();
  assert.ok(slugs.size > 0, "nenhum slug lido de src/content/blog");
  for (const chave of Object.keys(PORTA_POR_PAGINA)) {
    if (chave.startsWith("/blog/")) {
      const slug = chave.slice("/blog/".length);
      assert.ok(slugs.has(slug), `slug do blog não existe: ${chave}`);
    } else {
      const page = join(RAIZ_SRC, "app", chave.slice(1), "page.tsx");
      assert.ok(existsSync(page), `rota sem page.tsx: ${chave}`);
    }
  }
});

test("chaves do mapa são pathname normalizado (minúsculo, sem barra final, sem query)", () => {
  for (const chave of Object.keys(PORTA_POR_PAGINA)) {
    assert.equal(chave, chave.toLowerCase(), chave);
    assert.ok(chave.startsWith("/") && !chave.endsWith("/"), chave);
    assert.ok(!chave.includes("?") && !chave.includes("#"), chave);
  }
});

test("portaDaPagina tolera barra final, query, hash e maiúsculas", () => {
  assert.deepEqual(portaDaPagina("/tabela-precificacao-clube/"), { porta: 1, tema: "tabela" });
  assert.deepEqual(portaDaPagina("/Tabela-Precificacao-Clube?x=1#y"), { porta: 1, tema: "tabela" });
  assert.deepEqual(portaDaPagina("/blog/como-calcular-comissao-barbeiro"), { porta: 2, tema: "comissao" });
  assert.equal(portaDaPagina("/blog/como-calcular-comissao"), null);
  assert.equal(portaDaPagina("/clube"), null);
  assert.equal(portaDaPagina("/"), null);
});

test("portaDoUtmContent aceita p[1-4] e ignora o legado", () => {
  assert.equal(portaDoUtmContent("p2-regua"), 2);
  assert.equal(portaDoUtmContent(" P3 "), 3);
  assert.equal(portaDoUtmContent("p4"), 4);
  assert.equal(portaDoUtmContent("p5-x"), null);
  assert.equal(portaDoUtmContent("p12"), null);
  assert.equal(portaDoUtmContent("du-01"), null);
  assert.equal(portaDoUtmContent("grupo-a"), null);
  assert.equal(portaDoUtmContent(""), null);
  assert.equal(portaDoUtmContent(null), null);
  assert.equal(portaDoUtmContent(undefined), null);
});

test("utmContentPorta gera slug ASCII: sem acento, minúsculo, hífens", () => {
  assert.equal(utmContentPorta(2, "Régua de Cobrança"), "p2-regua-de-cobranca");
  assert.equal(utmContentPorta(2, "Comissão"), "p2-comissao");
  assert.equal(utmContentPorta(1, "  Precificação / Tabela  "), "p1-precificacao-tabela");
  assert.equal(utmContentPorta(3, "MIGRAÇÃO já"), "p3-migracao-ja");
  assert.equal(utmContentPorta(1, "--tabela--"), "p1-tabela");
  assert.equal(utmContentPorta(4, ""), "p4");
  assert.equal(utmContentPorta(4, "   "), "p4");
});

test("utmContentPorta e portaDoUtmContent fecham o ciclo", () => {
  for (const porta of [1, 2, 3, 4] as const) {
    assert.equal(portaDoUtmContent(utmContentPorta(porta, "Régua")), porta);
    assert.equal(portaDoUtmContent(utmContentPorta(porta, "")), porta);
  }
});

test("portaDoLead: o link vence a página; sem link vale a página", () => {
  assert.equal(portaDoLead("/tabela-precificacao-clube", "p2-regua"), 2);
  assert.equal(portaDoLead("/tabela-precificacao-clube", "du-01"), 1);
  assert.equal(portaDoLead("/tabela-precificacao-clube", null), 1);
  assert.equal(portaDoLead("/clube", "p3-migrar"), 3);
  assert.equal(portaDoLead("/clube", undefined), undefined);
});

test("paramsDaPagina: porta da PÁGINA em `porta`, link só em `porta_link` quando difere", () => {
  assert.deepEqual(paramsDaPagina("/gestao-comissoes-barbeiro/", "p2-comissao"), {
    pagina: "/gestao-comissoes-barbeiro",
    porta: 2,
    tema: "comissao",
  });
  assert.deepEqual(paramsDaPagina("/gestao-comissoes-barbeiro", "p1-tabela"), {
    pagina: "/gestao-comissoes-barbeiro",
    porta: 2,
    tema: "comissao",
    porta_link: 1,
  });
  assert.deepEqual(paramsDaPagina("/clube", "p3"), { pagina: "/clube", porta_link: 3 });
  assert.deepEqual(paramsDaPagina("/clube", "grupo-a"), { pagina: "/clube" });
});

test("fork do /clube: só a faixa de migração é 'migrar' (porta 3); o resto é 'criar' (porta 1)", () => {
  assert.equal(forkDoClube("[Site-Clube]BT-Migracao"), "migrar");
  assert.equal(forkDoClube("[Site-Clube]BT-Hero"), "criar");
  assert.equal(forkDoClube(""), "criar");
  assert.equal(CLUBE_FORK.migrar.porta, 3);
  assert.equal(CLUBE_FORK.criar.porta, 1);
  assert.equal(CLUBE_FORK.migrar.evento, "clube_bt_migrar");
  assert.equal(CLUBE_FORK.criar.evento, "clube_bt_criar");
});

test("paramsGuiaBaixado: porta só quando a LP da isca está no mapa", () => {
  assert.deepEqual(paramsGuiaBaixado("do-zero-a-assinatura"), {
    guia: "do-zero-a-assinatura",
    porta: 1,
    tema: "guia-assinatura-do-zero",
    pagina: "/obrigado",
  });
  // Cadeira Cheia é porta 1 desde 12/Set/26 (decisão do André); uma isca fora do mapa fica sem porta
  assert.deepEqual(paramsGuiaBaixado("cadeira-cheia"), { guia: "cadeira-cheia", porta: 1, tema: "cadeira-cheia", pagina: "/obrigado" });
  assert.deepEqual(paramsGuiaBaixado("isca-que-nao-existe"), { guia: "isca-que-nao-existe", pagina: "/obrigado" });
});

// ————— /clube/[peca]: porta declarada em portas-clube.ts (cap. 36 §4.2) —————

test("/clube/<peca>: P2 e P3 nascem com a porta certa; página genérica não recebe porta", () => {
  assert.deepEqual(portaDaPagina("/clube/sem-caderno"), { porta: 2, tema: "sem-caderno" });
  assert.deepEqual(portaDaPagina("/clube/um-sistema-so"), { porta: 3, tema: "um-sistema-so" });
  assert.deepEqual(portaDaPagina("/clube/bloqueio-na-agenda/"), { porta: 3, tema: "bloqueio-na-agenda" });
  assert.deepEqual(portaDaPagina("/clube/plano-com-regra"), { porta: 1, tema: "plano-com-regra" });
  assert.equal(portaDaPagina("/clube/cobranca-automatica"), null);
  assert.equal(portaDaPagina("/clube/parceiro-guapo"), null);
  // Slug inexistente e sub-rota não inventam porta.
  assert.equal(portaDaPagina("/clube/precificacao"), null);
  assert.equal(portaDaPagina("/clube/sem-caderno/extra"), null);
  assert.equal(portaDaPagina("/clube"), null);
});

test("/clube/<peca>: o Lead leva a porta da página, e o link ainda vence", () => {
  assert.equal(portaDoLead("/clube/sem-caderno"), 2);
  assert.equal(portaDoLead("/clube/um-sistema-so", null), 3);
  assert.equal(portaDoLead("/clube/cobranca-automatica"), undefined);
  assert.equal(portaDoLead("/clube/sem-caderno", "p3-migracao"), 3);
  assert.deepEqual(paramsDaPagina("/clube/sem-caderno", "p2-caderno"), {
    pagina: "/clube/sem-caderno",
    porta: 2,
    tema: "sem-caderno",
  });
});
