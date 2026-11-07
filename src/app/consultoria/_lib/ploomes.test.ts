import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CLUBE_OPCOES, EQUIPE_OPCOES_V3, QUANDO_OPCOES } from "../../../lib/lead-score.ts";
import { PLOOMES_OPCOES_CLUBE, PLOOMES_OPCOES_QUANDO } from "../../../lib/ploomes-fields.ts";
import {
  ENVIO_PLOOMES_ATIVO, FATURAMENTO_DO_CRM, LIMITE_DO_CAMPO, LP_VERSION, anotacaoDoHorario, resumoCurto, clubeDoCRM, dadosDoContato, equipeDoCRM,
  limparTextoLivre, quandoDoCRM, resumoDaFicha,
} from "./ploomes.ts";
import { enderecoDoPlano } from "./plano.ts";
import type { ConteudoConsultoria, Respostas } from "./types.ts";

const conteudo = JSON.parse(readFileSync(new URL("../_data/consultoria-v2.json", import.meta.url), "utf8")) as ConteudoConsultoria;
const caso: Respostas = { objetivo: "assinatura", trava: "p05", quem: "equipe", porte: "2a4", assinatura: "mao", faturamento: "10a20", meta: "30a60", prazo: "mes" };

test("O envio está ligado e a versão da página é a do braço do texto", () => {
  assert.equal(ENVIO_PLOOMES_ATIVO, true);
  assert.equal(LP_VERSION, "consultoria-v2-texto");
});

test("Equipe, assinatura e prazo saem no vocabulário que o CRM e o placar já leem", () => {
  assert.equal(equipeDoCRM({ quem: "solo" }), "Sou apenas eu");
  assert.equal(equipeDoCRM({ quem: "equipe", porte: "2a4" }), "2 a 4 colaboradores");
  assert.equal(equipeDoCRM({ quem: "equipe", porte: "5+" }), "5 ou mais colaboradores");
  assert.equal(equipeDoCRM({ quem: "abrir" }), undefined);
  for (const quem of ["solo", "equipe"]) for (const porte of ["2a4", "5+"]) {
    const valor = equipeDoCRM({ quem, porte });
    if (valor) assert.ok((EQUIPE_OPCOES_V3 as readonly string[]).includes(valor));
  }
  for (const assinatura of ["nao", "mao", "sistema"]) for (const objetivo of ["assinatura", "faturamento"]) {
    const clube = clubeDoCRM({ assinatura, objetivo })!;
    assert.ok((CLUBE_OPCOES as readonly string[]).includes(clube));
    assert.ok(PLOOMES_OPCOES_CLUBE[clube], clube);
  }
  for (const prazo of ["mes", "tres", "entender"]) {
    const quando = quandoDoCRM({ prazo })!;
    assert.ok((QUANDO_OPCOES as readonly string[]).includes(quando));
    assert.ok(PLOOMES_OPCOES_QUANDO[quando], quando);
  }
});

test("As 7 faixas da ficha caem nas 4 do formulário v2, sem buraco", () => {
  const v2 = ["Até R$ 2.000", "R$ 2.000 a R$ 10.000", "De R$ 10.000 a R$ 30.000", "Acima de R$ 30.000"];
  for (const faixa of conteudo.faixas_hoje) assert.ok(v2.includes(FATURAMENTO_DO_CRM[faixa.id]), faixa.id);
});

test("A linha do card segue o contrato: chaves na ordem, partes vazias fora, o plano no fim", () => {
  const plano = enderecoDoPlano(caso, "Rafael");
  const linha = resumoDaFicha(conteudo, caso, plano);
  assert.equal(linha,
    "[Consultoria] Objetivo: Montar ou crescer a assinatura · Trava: Cobrar cada assinante, todo mês, na mão · " +
    "Quem: Dono, com equipe (2 a 4) · Assinatura: Tenho e cobro na mão ou no Pix · Faturamento: R$ 10 a 20 mil · " +
    "Meta: R$ 30 a 60 mil · Distância: cerca de +R$ 30 mil por mês · Prazo: Este mês · Braço: texto · " +
    `Plano: ${plano}`);
  const barbeiro = resumoDaFicha(conteudo, { objetivo: "clientes", trava: "p08", quem: "barbeiro", prazo: "entender" }, plano);
  assert.equal(/Assinatura:|Faturamento:|Meta:|Distância:/.test(barbeiro), false);
});

test("\"Outra coisa\" vai com a frase do dono, limpa e com até 200 caracteres", () => {
  const r: Respostas = { objetivo: "troca", trava: "outra", outra: "o sistema · trava [sempre]\nno sábado", quem: "solo", prazo: "tres" };
  const linha = resumoDaFicha(conteudo, r, "https://x");
  assert.match(linha, /Trava: Outra coisa: "o sistema trava sempre no sábado"/);
  assert.equal(limparTextoLivre("a".repeat(300)).length, 200);
});

test("O contato leva a linha no fim da descrição, a versão, o faturamento do CRM e a nota", () => {
  const plano = enderecoDoPlano(caso, "Rafael");
  const dados = dadosDoContato({ nome: " Rafael Souza ", whatsapp: "(31) 99999-0000", respostas: caso, conteudo, enderecoDoPlano: plano, leadEventId: "1-rs" });
  assert.equal(dados.barbershopName, "Rafael Souza");
  assert.equal(dados.ownerName, "Rafael Souza");
  assert.equal(dados.monthlyRevenue, "De R$ 10.000 a R$ 30.000");
  assert.equal(dados.employeeCount, "2 a 4 colaboradores");
  assert.equal(dados.startWhen, "Este mês");
  assert.equal(dados.lpVersion, "consultoria-v2-texto");
  assert.equal(dados.leadEventId, "1-rs");
  assert.equal(typeof dados.leadScore, "number");
  assert.equal(dados.descricaoExtra, "[Consultoria] Trava: Cobrar cada assinante, todo mês, na mão · Faturamento: R$ 10 a 20 mil · Meta: R$ 30 a 60 mil · Plano nas anotações");
});

test("A versão curta cabe no campo de 250 caracteres com os prefixos mais longos, em toda trava", () => {
  const prefixos = "[SCORE: 100] [QUANDO: Nos próximos 3 meses] [CUPOM: PARCEIRO-XXXXXXXX] ";
  for (const [objetivo, { opcoes }] of Object.entries(conteudo.travas).filter(([k]) => k !== "fonte")) {
    for (const opcao of opcoes) {
      const curto = resumoCurto(conteudo, { objetivo, trava: opcao.id, outra: "x".repeat(300), faturamento: "60+", meta: "100+" });
      assert.ok((prefixos + curto).length <= LIMITE_DO_CAMPO, `${objetivo}/${opcao.id}: ${(prefixos + curto).length}`);
    }
  }
});

test("A anotação do horário segue o contrato", () => {
  assert.equal(anotacaoDoHorario(conteudo.horarios[1]), "[Consultoria] Horário escolhido: amanhã de manhã");
  assert.deepEqual(conteudo.horarios.map((h) => h.quando), ["hoje até as 18h", "amanhã de manhã", "amanhã à tarde", "prefiro por mensagem"]);
});
