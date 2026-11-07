import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  distancia, distanciaNoCard, enderecoDoPlano, horariosDisponiveis, linhaDoCaminho, opcoesDaMeta, planoDaTrava, respostasDoEndereco,
} from "./plano.ts";
import type { ConteudoConsultoria, Respostas } from "./types.ts";

const conteudo = JSON.parse(readFileSync(new URL("../_data/consultoria-v2.json", import.meta.url), "utf8")) as ConteudoConsultoria;

test("A meta mostra só as faixas acima da de hoje, no máximo 4", () => {
  assert.deepEqual(opcoesDaMeta(conteudo, { faturamento: "10a20" }).map((f) => f.id), ["20a30", "30a60", "60a100", "100+"]);
  assert.deepEqual(opcoesDaMeta(conteudo, { faturamento: "ate2" }).map((f) => f.id), ["2a5", "5a10", "10a20", "20a30"]);
  assert.deepEqual(opcoesDaMeta(conteudo, { faturamento: "60+" }).map((f) => f.id), ["60a100", "100+"]);
  assert.equal(opcoesDaMeta(conteudo, { quem: "abrir" }).length, 5);
});

test("A distância sai pelo meio das faixas, só com as duas fechadas", () => {
  assert.equal(distancia(conteudo, { faturamento: "10a20", meta: "30a60" }), 30000);
  assert.equal(distanciaNoCard(conteudo, { faturamento: "10a20", meta: "30a60" }), "cerca de +R$ 30 mil por mês");
  assert.equal(distancia(conteudo, { faturamento: "2a5", meta: "5a10" }), 4000);
  assert.equal(distancia(conteudo, { faturamento: "20a30", meta: "100+" }), null);
  assert.equal(distancia(conteudo, { faturamento: "60+", meta: "60a100" }), null);
  assert.equal(distancia(conteudo, { meta: "30a60" }), null);
});

test("Toda trava da ficha tem plano com título e passo 1, e o passo 1 é para amanhã", () => {
  for (const [objetivo, { opcoes }] of Object.entries(conteudo.travas).filter(([k]) => k !== "fonte")) {
    for (const opcao of opcoes) {
      const plano = planoDaTrava(conteudo, { objetivo, trava: opcao.id });
      assert.ok(plano.titulo && plano.passo1, `${objetivo}/${opcao.id}`);
      assert.match(plano.passo1, /^Amanhã/, `${objetivo}/${opcao.id}`);
    }
  }
});

test("O texto do plano não promete o que o produto não faz", () => {
  const bruto = JSON.stringify(conteudo.planos);
  for (const proibido of [/ilimitad/i, /cai na conta/i, /cai todo mês/i, /não perde assinante/i, /\bDRE\b/, /lucro/i]) {
    assert.equal(proibido.test(bruto), false, String(proibido));
  }
});

test("O endereço do plano leva as respostas e volta igual; id desconhecido é ignorado", () => {
  const r: Respostas = { objetivo: "assinatura", trava: "p05", quem: "equipe", porte: "2a4", assinatura: "mao", faturamento: "10a20", meta: "30a60", prazo: "mes" };
  const url = enderecoDoPlano(r, " Rafael Souza ");
  assert.ok(url.startsWith("https://www.bestbarbers.app/consultoria/plano?"));
  const params = Object.fromEntries(new URL(url).searchParams);
  const lido = respostasDoEndereco(conteudo, params);
  assert.deepEqual(lido.respostas, r);
  assert.equal(lido.nome, "Rafael");
  const sujo = respostasDoEndereco(conteudo, { o: "assinatura", t: "nao-existe", n: "<script>" });
  assert.deepEqual(sujo.respostas, { objetivo: "assinatura" });
  assert.equal(sujo.nome, "script");
});

test("O caminho fala de hoje para a meta, começando pela trava nas palavras dele", () => {
  const r: Respostas = { objetivo: "assinatura", trava: "p05", faturamento: "10a20", meta: "30a60" };
  assert.equal(linhaDoCaminho(conteudo, { ...r, faturamento: "ate2", meta: "2a5" }).startsWith("De até R$ 2 mil para R$ 2 a 5 mil"), true);
  assert.equal(linhaDoCaminho(conteudo, r), "De R$ 10 a 20 mil para R$ 30 a 60 mil por mês, começando por: “Cobrar cada assinante, todo mês, na mão”.");
});

test("\"Hoje, até as 18h\" só aparece em dia útil antes das 17h de Brasília", () => {
  const sexta14h = new Date("2026-11-06T17:00:00Z");
  const sexta18h = new Date("2026-11-06T21:00:00Z");
  const sabado10h = new Date("2026-11-07T13:00:00Z");
  assert.ok(horariosDisponiveis(conteudo.horarios, sexta14h).some((h) => h.id === "hoje"));
  assert.equal(horariosDisponiveis(conteudo.horarios, sexta18h).some((h) => h.id === "hoje"), false);
  assert.equal(horariosDisponiveis(conteudo.horarios, sabado10h).some((h) => h.id === "hoje"), false);
  assert.equal(horariosDisponiveis(conteudo.horarios, sabado10h).length, 3);
});
