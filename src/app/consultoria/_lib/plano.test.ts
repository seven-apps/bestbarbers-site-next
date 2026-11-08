import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  comMeses, distancia, distanciaNoCard, enderecoDoPlano, horariosDisponiveis, linkParaEquipe, mesDeBrasilia, montarPlano,
  opcoesDaMeta, planoDaTrava, respostasDoEndereco,
} from "./plano.ts";
import type { ConteudoConsultoria, Respostas } from "./types.ts";

const conteudo = JSON.parse(readFileSync(new URL("../_data/consultoria-v2.json", import.meta.url), "utf8")) as ConteudoConsultoria;

/** Um dia de cada mês de 2026, ao meio-dia de Brasília. */
const dia = (mes: number) => new Date(Date.UTC(2026, mes - 1, 10, 15));
const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

test("A meta mostra só as faixas acima da de hoje, no máximo 4", () => {
  assert.deepEqual(opcoesDaMeta(conteudo, { faturamento: "10a20" }).map((f) => f.id), ["20a30", "30a60", "60a100", "100+"]);
  assert.deepEqual(opcoesDaMeta(conteudo, { faturamento: "ate2" }).map((f) => f.id), ["2a5", "5a10", "10a20", "20a30"]);
  assert.deepEqual(opcoesDaMeta(conteudo, { faturamento: "60+" }).map((f) => f.id), ["60a100", "100+"]);
  assert.equal(opcoesDaMeta(conteudo, { quem: "abrir" }).length, 5);
});

test("A distância sai pelo meio das faixas, só com as duas fechadas (vai à linha do card, não à página)", () => {
  assert.equal(distancia(conteudo, { faturamento: "10a20", meta: "30a60" }), 30000);
  assert.equal(distanciaNoCard(conteudo, { faturamento: "10a20", meta: "30a60" }), "cerca de +R$ 30 mil por mês");
  assert.equal(distancia(conteudo, { faturamento: "2a5", meta: "5a10" }), 4000);
  assert.equal(distancia(conteudo, { faturamento: "20a30", meta: "100+" }), null);
  assert.equal(distancia(conteudo, { faturamento: "60+", meta: "60a100" }), null);
  assert.equal(distancia(conteudo, { meta: "30a60" }), null);
});

test("Toda trava da ficha tem plano: passo 1 para amanhã, a ação da 1ª tela e a mensagem pronta", () => {
  for (const [objetivo, { opcoes }] of Object.entries(conteudo.travas).filter(([k]) => k !== "fonte")) {
    for (const opcao of opcoes) {
      const plano = planoDaTrava(conteudo, { objetivo, trava: opcao.id });
      const onde = `${objetivo}/${opcao.id}`;
      assert.ok(plano.titulo && plano.passo1, onde);
      assert.match(plano.passo1, /^Amanhã/, onde);
      assert.ok(plano.acao.titulo && plano.acao.como && plano.acao.traz, onde);
      assert.ok(plano.pronto.rotulo && plano.pronto.texto, onde);
    }
  }
});

test("O texto do plano não promete o que o produto não faz nem usa o que o André vetou", () => {
  const bruto = JSON.stringify(conteudo.planos);
  const proibidos = [
    /ilimitad/i, /cai na conta/i, /cai todo mês/i, /não perde assinante/i, /\bDRE\b/, /lucro/i,
    /\bclube\b/i, /paga menos/i, /ninguém perde/i, /lista de espera/i, /da BestBarbers/, /aviso antes de vencer/i,
    /boleto/i, /salário/i, /\bcontrato\b/i, /no cartão ninguém atrasa/i,
    /divide o corte/i, /meta já senta/i, /está com a cadeira parada/i,
  ];
  for (const proibido of proibidos) assert.equal(proibido.test(bruto), false, String(proibido));
});

test("Cada caso completo é de uma trava e de um 'quem' que existem, e cada ação tem o seu bloco", () => {
  const travas = new Set(Object.entries(conteudo.travas).filter(([k]) => k !== "fonte").flatMap(([, t]) => t.opcoes.map((o) => o.id)));
  const quem = new Set(conteudo.quem.map((q) => q.id));
  assert.ok(Object.keys(conteudo.planos.v5).length >= 4);
  for (const [chave, caso] of Object.entries(conteudo.planos.v5)) {
    const [trava, q] = chave.split(":");
    assert.ok(travas.has(trava) && quem.has(q), chave);
    assert.equal(caso.acoes.length, 3, chave);
    const blocos = new Set(caso.blocos.map((b) => b.id));
    for (const a of caso.acoes) assert.ok(blocos.has(a.id), `${chave}: ação ${a.id} sem bloco`);
    assert.ok(caso.ligacao.chamada, chave);
  }
});

test("A 1ª tela cabe no celular: os cartões têm texto curto", () => {
  const acoes = [
    ...Object.values(conteudo.planos.v5).flatMap((c) => c.acoes),
    ...Object.values(conteudo.planos.por_trava).map((p) => p.acao),
  ];
  for (const a of acoes) {
    assert.ok(a.titulo.length <= 70, a.titulo);
    assert.ok(a.como.length <= 95, a.como);
    assert.ok(a.traz.length <= 80, a.traz);
  }
});

test("O caso completo abre com '{nome}, 3 coisas para amanhã'; a trava sem caso, com 1 coisa", () => {
  const piloto: Respostas = { objetivo: "faturamento", trava: "p19", quem: "equipe", porte: "2a4" };
  const plano = montarPlano(conteudo, piloto, "Diego", dia(11));
  assert.equal(plano.completo, true);
  assert.equal(plano.titulo, "Diego, 3 coisas para amanhã");
  assert.deepEqual(plano.acoes.map((a) => a.num), [1, 2, 3]);
  assert.ok(plano.ligacao);

  const curto = montarPlano(conteudo, { objetivo: "clientes", trava: "p08", quem: "equipe" }, "Ana", dia(11));
  assert.equal(curto.completo, false);
  assert.equal(curto.titulo, "Ana, 1 coisa para amanhã");
  assert.equal(curto.acoes.length, 1);
  assert.ok(curto.blocos[0].pronto?.texto);
  assert.equal(curto.ligacao, null);

  assert.equal(montarPlano(conteudo, piloto, "", dia(11)).titulo, "3 coisas para amanhã");
  assert.equal(montarPlano(conteudo, { objetivo: "faturamento", trava: "p19", quem: "solo" }, "", dia(11)).completo, false);
});

test("O reajuste do solo só vale de outubro a janeiro; fora disso, a ação sai e o texto acompanha", () => {
  const solo: Respostas = { objetivo: "faturamento", trava: "p10", quem: "solo" };
  for (const mes of [10, 11, 12, 1]) {
    const plano = montarPlano(conteudo, solo, "Thiago", dia(mes));
    assert.equal(plano.acoes.length, 3, `mês ${mes}`);
    assert.ok(plano.blocos.some((b) => b.id === "preco"), `mês ${mes}`);
  }
  for (const mes of [2, 3, 4, 5, 6, 7, 8, 9]) {
    const plano = montarPlano(conteudo, solo, "Thiago", dia(mes));
    assert.equal(plano.titulo, "Thiago, 2 coisas para amanhã", `mês ${mes}`);
    assert.deepEqual(plano.acoes.map((a) => a.num), [1, 2]);
    assert.equal(plano.blocos.some((b) => b.id === "preco"), false);
    const texto = JSON.stringify(plano);
    assert.equal(/no preço|As 3 coisas|R\$\s?5 a mais em cada corte|reajuste/.test(texto), false, `mês ${mes}`);
  }
});

test("Os meses saem da data de hoje: o teste da divisão é o mês seguinte, e a fala não marca a data da regra nova", () => {
  assert.equal(comMeses("{Mes+1} é o mês de teste; a regra começa em 1º de {mes+2}.", 11), "Dezembro é o mês de teste; a regra começa em 1º de janeiro.");
  assert.equal(comMeses("{mes-1} e {mes}", 1), "dezembro e janeiro");
  assert.equal(comMeses("em {mes+2}", 12), "em fevereiro");
  const texto = JSON.stringify(montarPlano(conteudo, { objetivo: "equipe", trava: "p03", quem: "equipe" }, "Felipe", dia(3)));
  assert.ok(texto.includes("Abril é o mês de teste"));
  assert.ok(texto.includes("Antes de maio: a assinatura no cartão"));
  assert.ok(texto.includes("sua assinatura de fevereiro"));
  // o teste é teste: a regra nova só começa depois de cada um ver as duas contas (André virtual, 08/Nov/26)
  assert.equal(/1º de [a-zç]+/.test(texto), false);
});

test("Nenhum caso sai com marcador de mês sobrando, em nenhum mês do ano", () => {
  const respostas: Respostas[] = [
    ...Object.keys(conteudo.planos.v5).map((k) => ({ trava: k.split(":")[0], quem: k.split(":")[1] })),
    ...Object.keys(conteudo.planos.por_trava).map((trava) => ({ trava, quem: "equipe" })),
  ];
  for (const r of respostas) {
    for (const mes of MESES) {
      const texto = JSON.stringify(montarPlano(conteudo, r, "Ana", dia(mes)));
      assert.equal(/\{[Mm]es/.test(texto), false, `${r.trava}:${r.quem} no mês ${mes}`);
    }
  }
});

test("A frase de dezembro só aparece em novembro e dezembro", () => {
  const piloto: Respostas = { trava: "p19", quem: "equipe" };
  const tem = (mes: number) => JSON.stringify(montarPlano(conteudo, piloto, "Diego", dia(mes))).includes("Em dezembro a barbearia enche sozinha");
  assert.equal(tem(11), true);
  assert.equal(tem(12), true);
  assert.equal(tem(1), false);
  assert.equal(tem(6), false);
});

test("O mês é o de Brasília: 23h de 30/Nov em Brasília ainda é novembro", () => {
  assert.equal(mesDeBrasilia(new Date("2026-12-01T02:00:00Z")), 11);
  assert.equal(mesDeBrasilia(new Date("2026-12-01T03:00:00Z")), 12);
});

test("O botão de mandar à equipe leva o aviso com a frase no WhatsApp", () => {
  const url = linkParaEquipe("Todo cliente ouve isto:\n\n\"{texto}\"", "Já deixo a sua próxima marcada?");
  assert.ok(url.startsWith("https://wa.me/?text="));
  assert.equal(decodeURIComponent(url.split("text=")[1]), "Todo cliente ouve isto:\n\n\"Já deixo a sua próxima marcada?\"");
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

test("\"Hoje, até as 18h\" só aparece em dia útil antes das 17h de Brasília", () => {
  const sexta14h = new Date("2026-11-06T17:00:00Z");
  const sexta18h = new Date("2026-11-06T21:00:00Z");
  const sabado10h = new Date("2026-11-07T13:00:00Z");
  assert.ok(horariosDisponiveis(conteudo.horarios, sexta14h).some((h) => h.id === "hoje"));
  assert.equal(horariosDisponiveis(conteudo.horarios, sexta18h).some((h) => h.id === "hoje"), false);
  assert.equal(horariosDisponiveis(conteudo.horarios, sabado10h).some((h) => h.id === "hoje"), false);
  assert.equal(horariosDisponiveis(conteudo.horarios, sabado10h).length, 3);
});
