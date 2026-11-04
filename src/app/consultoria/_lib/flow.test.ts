import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { escolher, objetivoDaUrl, perguntasDoFluxo, progresso, proximaTela, pulaAssinatura, telaRespondida } from "./flow.ts";
import type { ConteudoConsultoria, Respostas, Tela } from "./types.ts";

const conteudo = JSON.parse(readFileSync(new URL("../_data/consultoria-v1.json", import.meta.url), "utf8")) as ConteudoConsultoria;

/** Simula os toques na ordem e devolve as telas por onde a pessoa passou. */
function caminhar(inicio: Tela, toques: [keyof Respostas, string][], r0: Respostas = {}) {
  let tela = inicio;
  let r = r0;
  const visitadas: Tela[] = [tela];
  for (const [chave, valor] of toques) {
    r = escolher(conteudo, r, chave, valor);
    if (telaRespondida(tela, r)) {
      tela = proximaTela(conteudo, tela, r);
      visitadas.push(tela);
    }
  }
  return { visitadas, r };
}

test("Pela bio: as 5 perguntas na ordem, depois contato", () => {
  const { visitadas, r } = caminhar("objetivo", [
    ["objetivo", "equipe"], ["trava", "p34"], ["quem", "equipe"], ["porte", "2a4"], ["assinatura", "nao"], ["prazo", "tres"],
  ]);
  assert.deepEqual(visitadas, ["objetivo", "trava", "quem", "assinatura", "prazo", "contato"]);
  assert.deepEqual(perguntasDoFluxo(conteudo, r), ["objetivo", "trava", "quem", "assinatura", "prazo"]);
});

test("\"Dono, com equipe\" só avança depois do número de profissionais", () => {
  const r = escolher(conteudo, { objetivo: "assinatura", trava: "p13" }, "quem", "equipe");
  assert.equal(telaRespondida("quem", r), false);
  assert.equal(telaRespondida("quem", escolher(conteudo, r, "porte", "5+")), true);
  assert.equal(telaRespondida("quem", escolher(conteudo, r, "quem", "solo")), true);
  assert.equal(escolher(conteudo, { quem: "equipe", porte: "2a4" }, "quem", "solo").porte, undefined);
});

test("A trava \"cobrar cada assinante na mão\" responde a assinatura e pula a pergunta", () => {
  const { visitadas, r } = caminhar("trava", [["trava", "p05"], ["quem", "solo"], ["prazo", "mes"]], { objetivo: "assinatura" });
  assert.deepEqual(visitadas, ["trava", "quem", "prazo", "contato"]);
  assert.equal(r.assinatura, "mao");
  assert.equal(pulaAssinatura(conteudo, r), true);
  assert.deepEqual(perguntasDoFluxo(conteudo, r), ["objetivo", "trava", "quem", "prazo"]);
});

test("Trocar a trava que respondia a assinatura apaga a resposta implícita", () => {
  const r = escolher(conteudo, escolher(conteudo, { objetivo: "assinatura" }, "trava", "p05"), "trava", "p13");
  assert.equal(r.assinatura, undefined);
  assert.equal(pulaAssinatura(conteudo, r), false);
});

test("\"Sou barbeiro\" pula a pergunta da assinatura e não grava resposta", () => {
  const { visitadas, r } = caminhar("quem", [["quem", "barbeiro"], ["prazo", "entender"]], { objetivo: "equipe", trava: "p20", assinatura: "nao" });
  assert.deepEqual(visitadas, ["quem", "prazo", "contato"]);
  assert.equal(r.assinatura, undefined);
});

test("Trocar o objetivo apaga a trava do objetivo anterior", () => {
  const r = escolher(conteudo, { objetivo: "assinatura", trava: "p05", assinatura: "mao" }, "objetivo", "clientes");
  assert.equal(r.trava, undefined);
  assert.equal(r.assinatura, undefined);
});

test("?objetivo= só aceita um objetivo que existe; os outros parâmetros não atrapalham", () => {
  assert.equal(objetivoDaUrl("?objetivo=assinatura&utm_source=meta", conteudo), "assinatura");
  for (const busca of ["", "?objetivo=", "?objetivo=imposto", "?objetivo=ASSINATURA", "?utm_source=meta"]) {
    assert.equal(objetivoDaUrl(busca, conteudo), undefined);
  }
});

test("Todo objetivo tem trava com \"Outra coisa\", e nenhuma opção abre campo de texto", () => {
  for (const objetivo of conteudo.objetivos) {
    const trava = conteudo.travas[objetivo.id];
    assert.ok(trava, `sem trava para ${objetivo.id}`);
    assert.equal(trava.opcoes.at(-1)?.id, "outra");
    assert.ok(trava.opcoes.length <= 6);
  }
});

test("A barra só anda para frente e chega a 100% no fim", () => {
  const r: Respostas = { objetivo: "assinatura", trava: "p13", quem: "solo", assinatura: "nao", prazo: "mes" };
  const valores = (["objetivo", "trava", "quem", "assinatura", "prazo", "contato", "pronto"] as Tela[]).map((t) => progresso(conteudo, t, r));
  for (let i = 1; i < valores.length; i++) assert.ok(valores[i] > valores[i - 1]);
  assert.equal(valores.at(-1), 1);
});
