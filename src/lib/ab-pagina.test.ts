/**
 * A/B do endereço fixo `/ir/<teste>` (`ab-pagina.ts`): o sorteio, a preservação da query (byte a byte) e o cookie.
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./ab-pagina.ts";
const {
  TESTES_DE_PAGINA,
  bracoDoVisitante,
  cookieDoTeste,
  decidirIr,
  abPaginaVista,
  queryDoDestino,
  DIAS_COOKIE_AB_PAGINA,
} = modulo as typeof import("./ab-pagina");

const semCookie = () => undefined;
const comCookie = (valores: Record<string, string>) => (nome: string) => valores[nome];

// Query como a Meta entrega: url_tags com as macros resolvidas (o nome do anúncio com espaço codificado como %20 e
// barra vertical %7C), o fbclid e os utm_*. É o que grava `bb_ad_id` (ad_id) e `bb_campaign_name` (campanha).
const QUERY_DA_META =
  "?utm_source=facebook&utm_medium=paid&utm_campaign=MORNO-AB-NOV26&utm_content=CLUBE%20DAVID%20%7C%20FATURAMENTO" +
  "&fase=MORNO&campanha=MORNO-AB-NOV26&publico=A-CLUBE&ad=CLUBE-DAVID&creative=CLUBE-DAVID&angulo=garantido" +
  "&campaign_id=120239999999990001&adset_id=120239999999990002&ad_id=120239999999990003" +
  "&fbclid=IwZXh0bgNhZW0BMABhZGlkAasZ_d3Jx-Ex";

// ————— a configuração —————

test("os dois testes no ar começam em 50/50 e apontam para páginas que existem", () => {
  assert.deepEqual(TESTES_DE_PAGINA.clube, { assunto: "/clube", percentualAssunto: 50 });
  assert.deepEqual(TESTES_DE_PAGINA["agente-ia"], { assunto: "/agente-ia-whatsapp", percentualAssunto: 50 });
  for (const t of Object.values(TESTES_DE_PAGINA)) {
    assert.ok(t.percentualAssunto >= 0 && t.percentualAssunto <= 100);
  }
});

// ————— o sorteio —————

test("sorteio respeita o percentual (50, 70, 0 e 100)", () => {
  const n = 10_000;
  const contar = (pct: number) => {
    let assunto = 0;
    for (let i = 0; i < n; i++) if (bracoDoVisitante(pct, undefined, i / n) === "assunto") assunto++;
    return assunto;
  };
  assert.equal(contar(50), 5_000);
  assert.equal(contar(70), 7_000);
  assert.equal(contar(0), 0);
  assert.equal(contar(100), n);
});

test("sorteio com Math.random fica perto de 50/50 nos dois testes", () => {
  for (const teste of ["clube", "agente-ia"]) {
    let home = 0;
    const n = 20_000;
    for (let i = 0; i < n; i++) if (decidirIr(`/ir/${teste}`, "", semCookie, Math.random()).braco === "home") home++;
    // 50% ± 1,5 p.p. (o desvio-padrão é 0,35 p.p. com n = 20 mil: a folga é de ~4 desvios)
    assert.ok(Math.abs(home / n - 0.5) < 0.015, `${teste}: ${home}/${n}`);
  }
});

test("braço do assunto e da home vão para as páginas certas", () => {
  assert.equal(decidirIr("/ir/clube", "", semCookie, 0.1).destino, "/clube?bb_ab=ir-clube-assunto");
  assert.equal(decidirIr("/ir/clube", "", semCookie, 0.9).destino, "/?bb_ab=ir-clube-home");
  assert.equal(decidirIr("/ir/agente-ia", "", semCookie, 0.1).destino, "/agente-ia-whatsapp?bb_ab=ir-agente-ia-assunto");
  assert.equal(decidirIr("/ir/agente-ia", "", semCookie, 0.9).destino, "/?bb_ab=ir-agente-ia-home");
});

// ————— a query de entrada passa inteira —————

test("a query da Meta chega inteira e byte a byte ao destino, nos dois braços e nos dois testes", () => {
  for (const teste of ["clube", "agente-ia"] as const) {
    for (const sorteio of [0.1, 0.9]) {
      const { destino, braco } = decidirIr(`/ir/${teste}`, QUERY_DA_META, semCookie, sorteio);
      const [caminho, query] = destino.split("?");
      assert.equal(caminho, braco === "home" ? "/" : TESTES_DE_PAGINA[teste].assunto);
      // Byte a byte: a query de entrada é o começo exato da query do destino; só o bb_ab entra no fim.
      assert.equal("?" + query, `${QUERY_DA_META}&bb_ab=ir-${teste}-${braco}`);
      // E pelo leitor do site: cada parâmetro com o mesmo valor decodificado.
      const antes = new URLSearchParams(QUERY_DA_META);
      const depois = new URLSearchParams(query);
      for (const [k, v] of antes) assert.equal(depois.get(k), v, k);
      assert.equal(depois.get("utm_content"), "CLUBE DAVID | FATURAMENTO");
      assert.equal(depois.get("ad_id"), "120239999999990003");
      assert.equal(depois.get("campanha"), "MORNO-AB-NOV26");
      assert.equal(depois.get("fbclid"), "IwZXh0bgNhZW0BMABhZGlkAasZ_d3Jx-Ex");
    }
  }
});

test("macro não resolvida, parâmetro repetido, sem valor e '+' passam como chegaram", () => {
  const q = "?ad={{ad.name}}&x=1&x=2&vazio&a+b=c+d&utm_term=%C3%A9";
  const { destino } = decidirIr("/ir/clube", q, semCookie, 0.1);
  assert.equal(destino, "/clube" + q + "&bb_ab=ir-clube-assunto");
});

test("um bb_ab velho na entrada é trocado pelo braço sorteado, e o ?ab= de QA não segue", () => {
  assert.equal(
    decidirIr("/ir/clube", "?utm_source=fb&bb_ab=ir-clube-assunto&fbclid=F", semCookie, 0.9).destino,
    "/?utm_source=fb&fbclid=F&bb_ab=ir-clube-home",
  );
  assert.equal(queryDoDestino("?a=1&bb_ab=x&b=2", ["bb_ab"]), "?a=1&b=2");
  assert.equal(queryDoDestino("", ["bb_ab"]), "");
  assert.equal(queryDoDestino("?", ["bb_ab"], ["bb_ab", "y"]), "?bb_ab=y");
});

test("endereço desconhecido vai para a home com a query, sem rótulo e sem cookie (clique pago nunca cai em 404)", () => {
  for (const caminho of ["/ir", "/ir/", "/ir/teste-que-acabou", "/ir/clube/extra"]) {
    const d = decidirIr(caminho, "?utm_source=facebook&fbclid=F&bb_ab=lixo", semCookie, 0.1);
    assert.equal(d.destino, "/?utm_source=facebook&fbclid=F", caminho);
    assert.equal(d.braco, null);
    assert.equal(d.cookie, null);
  }
});

test("barra final e maiúscula no endereço não mudam o teste", () => {
  assert.equal(decidirIr("/ir/clube/", "", semCookie, 0.1).teste, "clube");
  assert.equal(decidirIr("/ir/Agente-IA", "", semCookie, 0.1).teste, "agente-ia");
});

// ————— o cookie —————

test("primeira visita grava o cookie do teste por 30 dias com o braço sorteado", () => {
  const d = decidirIr("/ir/agente-ia", "", semCookie, 0.9);
  assert.deepEqual(d.cookie, { nome: "bb_ab_ir_agente_ia", valor: "home", maxAge: 30 * 86400 });
  assert.equal(DIAS_COOKIE_AB_PAGINA, 30);
  assert.equal(cookieDoTeste("clube"), "bb_ab_ir_clube");
});

test("com cookie, a mesma pessoa vê sempre a mesma página, qualquer que seja o sorteio, e o cookie não é regravado", () => {
  const home = comCookie({ bb_ab_ir_clube: "home" });
  const assunto = comCookie({ bb_ab_ir_clube: "assunto" });
  for (const sorteio of [0, 0.1, 0.49, 0.5, 0.9, 0.999]) {
    const a = decidirIr("/ir/clube", "?fbclid=F", home, sorteio);
    assert.equal(a.braco, "home");
    assert.equal(a.cookie, null);
    const b = decidirIr("/ir/clube", "?fbclid=F", assunto, sorteio);
    assert.equal(b.braco, "assunto");
    assert.equal(b.cookie, null);
  }
});

test("os cookies dos dois testes são independentes", () => {
  const cookies = comCookie({ bb_ab_ir_clube: "home" });
  assert.equal(decidirIr("/ir/clube", "", cookies, 0.1).braco, "home");
  const ia = decidirIr("/ir/agente-ia", "", cookies, 0.1);
  assert.equal(ia.braco, "assunto");
  assert.equal(ia.cookie?.nome, "bb_ab_ir_agente_ia");
});

test("cookie com lixo ressorteia e é regravado", () => {
  const d = decidirIr("/ir/clube", "", comCookie({ bb_ab_ir_clube: "curta" }), 0.1);
  assert.equal(d.braco, "assunto");
  assert.equal(d.cookie?.valor, "assunto");
});

test("teste desligado (100 ou 0): destino fixo, cookie velho ignorado e nenhum cookie novo", () => {
  assert.equal(bracoDoVisitante(100, "home", 0.9), "assunto");
  assert.equal(bracoDoVisitante(0, "assunto", 0.1), "home");
});

test("?ab=home|assunto força o braço (QA), não grava cookie e não segue para o destino", () => {
  const d = decidirIr("/ir/clube", "?utm_source=fb&ab=home&fbclid=F", comCookie({ bb_ab_ir_clube: "assunto" }), 0.1);
  assert.equal(d.destino, "/?utm_source=fb&fbclid=F&bb_ab=ir-clube-home");
  assert.equal(d.cookie, null);
  // ?ab= que não é braço deste teste passa adiante como qualquer parâmetro
  assert.equal(decidirIr("/ir/clube", "?ab=longa", semCookie, 0.1).destino, "/clube?ab=longa&bb_ab=ir-clube-assunto");
});

// ————— a leitura na página de destino —————

test("a página lê o braço só quando está no destino daquele braço", () => {
  assert.equal(abPaginaVista("?fbclid=F&bb_ab=ir-clube-home", "/"), "ir-clube-home");
  assert.equal(abPaginaVista("?bb_ab=ir-clube-assunto", "/clube"), "ir-clube-assunto");
  assert.equal(abPaginaVista("?bb_ab=ir-clube-assunto", "/clube/"), "ir-clube-assunto");
  assert.equal(abPaginaVista("?bb_ab=ir-agente-ia-assunto", "/agente-ia-whatsapp"), "ir-agente-ia-assunto");
  assert.equal(abPaginaVista("?bb_ab=ir-agente-ia-home", "/"), "ir-agente-ia-home");
  // link copiado e aberto em outra página, rótulo inventado ou ausente: nada
  assert.equal(abPaginaVista("?bb_ab=ir-clube-assunto", "/"), null);
  assert.equal(abPaginaVista("?bb_ab=ir-clube-home", "/clube"), null);
  assert.equal(abPaginaVista("?bb_ab=ir-clube-assunto", "/agente-ia-whatsapp"), null);
  assert.equal(abPaginaVista("?bb_ab=qualquer", "/"), null);
  assert.equal(abPaginaVista("?utm_source=fb", "/"), null);
});

test("o rótulo que o redirect escreve é exatamente o que a página de destino lê (ida e volta)", () => {
  for (const teste of ["clube", "agente-ia"]) {
    for (const sorteio of [0.1, 0.9]) {
      const { destino, braco } = decidirIr(`/ir/${teste}`, QUERY_DA_META, semCookie, sorteio);
      const [caminho, query] = destino.split("?");
      assert.equal(abPaginaVista("?" + query, caminho), `ir-${teste}-${braco}`);
    }
  }
});
