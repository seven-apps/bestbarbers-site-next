import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { escolher, objetivoDaUrl, perguntasDoFluxo, progresso, proximaTela, pulaAssinatura, telaRespondida } from "./flow.ts";
import type { ConteudoConsultoria, Respostas, Tela } from "./types.ts";

const conteudo = JSON.parse(readFileSync(new URL("../_data/consultoria-v2.json", import.meta.url), "utf8")) as ConteudoConsultoria;

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

test("Pela bio: as 7 perguntas na ordem, depois contato", () => {
  const { visitadas, r } = caminhar("objetivo", [
    ["objetivo", "equipe"], ["trava", "p34"], ["quem", "equipe"], ["porte", "2a4"], ["assinatura", "nao"],
    ["faturamento", "10a20"], ["meta", "30a60"], ["prazo", "tres"],
  ]);
  assert.deepEqual(visitadas, ["objetivo", "trava", "quem", "assinatura", "faturamento", "meta", "prazo", "contato"]);
  assert.deepEqual(perguntasDoFluxo(conteudo, r), ["objetivo", "trava", "quem", "assinatura", "faturamento", "meta", "prazo"]);
});

test("A trava que já responde a assinatura pula a pergunta da assinatura", () => {
  const { visitadas, r } = caminhar("objetivo", [
    ["objetivo", "assinatura"], ["trava", "p05"], ["quem", "solo"], ["faturamento", "5a10"], ["meta", "20a30"], ["prazo", "mes"],
  ]);
  assert.equal(r.assinatura, "mao");
  assert.ok(pulaAssinatura(conteudo, r));
  assert.deepEqual(visitadas, ["objetivo", "trava", "quem", "faturamento", "meta", "prazo", "contato"]);
});

test("Quem vai abrir pula o faturamento de hoje e responde a meta; o barbeiro pula assinatura, faturamento e meta", () => {
  const abrir = caminhar("objetivo", [["objetivo", "faturamento"], ["trava", "p10"], ["quem", "abrir"], ["assinatura", "nao"], ["meta", "10a20"], ["prazo", "tres"]]);
  assert.deepEqual(abrir.visitadas, ["objetivo", "trava", "quem", "assinatura", "meta", "prazo", "contato"]);
  assert.equal(abrir.r.faturamento, undefined);
  const barbeiro = caminhar("objetivo", [["objetivo", "clientes"], ["trava", "p08"], ["quem", "barbeiro"], ["prazo", "entender"]]);
  assert.deepEqual(barbeiro.visitadas, ["objetivo", "trava", "quem", "prazo", "contato"]);
});

test("\"Outra coisa\" não avança no toque: espera o botão, e o texto livre cai se a trava mudar", () => {
  let r = escolher(conteudo, { objetivo: "troca" }, "trava", "outra");
  assert.equal(telaRespondida("trava", r), false);
  r = { ...r, outra: "o barbeiro falta" };
  assert.equal(proximaTela(conteudo, "trava", r), "quem");
  r = escolher(conteudo, r, "trava", "t-medo");
  assert.equal(r.outra, undefined);
  assert.equal(telaRespondida("trava", r), true);
});

test("Trocar o faturamento apaga a meta, porque as opções da meta dependem dele", () => {
  const r = escolher(conteudo, { faturamento: "10a20", meta: "30a60" }, "faturamento", "20a30");
  assert.equal(r.meta, undefined);
});

test("A 6ª porta, \"Trocar de sistema\", existe e a cobrança que falha já diz que a assinatura é do sistema", () => {
  assert.ok(conteudo.objetivos.some((o) => o.id === "troca"));
  const r = escolher(conteudo, { objetivo: "troca" }, "trava", "t-cobranca");
  assert.equal(r.assinatura, "sistema");
});

test("Nenhum texto da ficha fala do Lucas nem promete WhatsApp de consultor", () => {
  const bruto = readFileSync(new URL("../_data/consultoria-v2.json", import.meta.url), "utf8");
  assert.equal(/Lucas/.test(bruto), false);
});

test("objetivo pela URL só vale id que existe; progresso vai de 0 a 1", () => {
  assert.equal(objetivoDaUrl("?objetivo=troca", conteudo), "troca");
  assert.equal(objetivoDaUrl("?objetivo=xyz", conteudo), undefined);
  assert.equal(progresso(conteudo, "objetivo", {}), 0);
  assert.equal(progresso(conteudo, "pronto", {}), 1);
  const r: Respostas = { objetivo: "equipe", trava: "p34", quem: "solo" };
  assert.ok(progresso(conteudo, "contato", r) < 1);
});
