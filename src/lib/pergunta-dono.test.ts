/**
 * Guarda da pergunta do dono: só o tráfego do TOPO vê o modal; macro literal não
 * conta; os parâmetros do evento carregam célula, criativo e porta sem dado pessoal.
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./pergunta-dono.ts";
const { deveMostrarPergunta, parametrosDaResposta, lerResposta, gravarResposta, EVENTO_POR_RESPOSTA } =
  modulo as typeof import("./pergunta-dono");

const TOPO = "?utm_source=meta&utm_campaign=BB-TOPO-PAGE-VIEW-ESTATICO-SET26&publico=LOOK-A-LIKE-DONOS-2024-E-LEADS-SCORE70-01&ad_id=120253000000000001&utm_content=VIDEO-P1-M1-JS-APP-CORTES-CLUBE&fase=TOPO-SET26";

test("mostra para campanha BB-TOPO-* e para fase TOPO-*, e para mais ninguém", () => {
  assert.equal(deveMostrarPergunta(TOPO), true);
  assert.equal(deveMostrarPergunta("?fase=TOPO-OUT26"), true);
  assert.equal(deveMostrarPergunta("?utm_campaign=bb-topo-page-view-video-set26"), true, "sem caixa");
  assert.equal(deveMostrarPergunta("?utm_campaign=BB-MEIO-ENGAJADOS-ASSINATURA-SET26&fase=MEIO-SET26"), false);
  assert.equal(deveMostrarPergunta("?utm_campaign=BB-LAB-Q60-ASSINATURA-SET26"), false);
  assert.equal(deveMostrarPergunta(""), false, "orgânico");
  assert.equal(deveMostrarPergunta("?source=instabio"), false, "link da bio");
});

test("macro não resolvida ({{campaign.name}}) não conta; snapshot da sessão conta", () => {
  assert.equal(deveMostrarPergunta("?utm_campaign=%7B%7Bcampaign.name%7D%7D"), false);
  assert.equal(deveMostrarPergunta("", "BB-TOPO-PAGE-VIEW-VIDEO-SET26"), true, "navegou dentro do site");
  assert.equal(deveMostrarPergunta("", "{{campaign.name}}"), false);
});

test("parâmetros: resposta, página, célula, criativo numérico e porta; nada pessoal", () => {
  const p = parametrosDaResposta("sim", TOPO, "/clube/", 2);
  assert.deepEqual(p, {
    resposta: "sim",
    pagina: "/clube",
    campanha: "BB-TOPO-PAGE-VIEW-ESTATICO-SET26",
    publico: "LOOK-A-LIKE-DONOS-2024-E-LEADS-SCORE70-01",
    ad_id: "120253000000000001",
    porta: 2,
  });
  const semLink = parametrosDaResposta("nao", "?ad_id=VIDEO-NOME", "/tabela-precificacao-clube-gated", null);
  assert.equal(semLink.ad_id, undefined, "ad_id não numérico é descartado");
  assert.equal(semLink.porta, undefined, "sem porta = sem chave (nada inventado)");
  assert.equal(EVENTO_POR_RESPOSTA.sim, "DonoBarbearia");
  assert.equal(EVENTO_POR_RESPOSTA.nao, "NaoDonoBarbearia");
});

test("storage: grava e lê a resposta; valor estranho vira null; storage ausente não quebra", () => {
  const mem = new Map<string, string>();
  const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
  assert.equal(lerResposta(storage), null);
  gravarResposta(storage, "sim", 1_758_000_000_000);
  assert.deepEqual(lerResposta(storage), { resposta: "sim", ts: 1_758_000_000_000 });
  mem.set("bb_dono", '{"resposta":"talvez"}');
  assert.equal(lerResposta(storage), null);
  assert.equal(lerResposta(undefined), null);
  assert.doesNotThrow(() => gravarResposta(undefined, "nao", 0));
});
