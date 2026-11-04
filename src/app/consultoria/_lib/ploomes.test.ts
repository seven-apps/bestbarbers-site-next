import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PLOOMES_CONTACT_FIELDS, PLOOMES_CONTACT_INT_FIELDS, PLOOMES_CONTACT_OPTION_FIELDS, PLOOMES_LEGACY_FIELDS, PLOOMES_OPCOES_CLUBE, PLOOMES_OPCOES_QUANDO } from "../../../lib/ploomes-fields.ts";
import { CLUBE_OPCOES, EQUIPE_OPCOES_V3, QUANDO_OPCOES } from "../../../lib/lead-score.ts";
import { clubeDoCRM, ENVIO_PLOOMES_ATIVO, equipeDoCRM, guardarLocalmente, montarContato, montarCorpoNutricao, quandoDoCRM, resumoDaFicha, rotaDoLead } from "./ploomes.ts";
import { linkDaConsultoria } from "./whatsapp.ts";
import type { ConteudoConsultoria, Respostas } from "./types.ts";

const conteudo = JSON.parse(readFileSync(new URL("../_data/consultoria-v1.json", import.meta.url), "utf8")) as ConteudoConsultoria;
const caso: Respostas = { objetivo: "assinatura", trava: "p05", quem: "equipe", porte: "2a4", assinatura: "mao", prazo: "tres" };
const propriedade = (contato: ReturnType<typeof montarContato>, chave: string) => contato.OtherProperties.find((p) => p.FieldKey === chave);

test("O envio ao Ploomes está desligado e guardar não envia nada", () => {
  assert.equal(ENVIO_PLOOMES_ATIVO, false);
  assert.doesNotThrow(() => guardarLocalmente(montarContato({ contato: { name: "Teste", whatsapp: "(31) 99999-0000" }, respostas: caso, conteudo })));
});

test("Equipe, assinatura e prazo saem no vocabulário que o CRM e o placar já leem", () => {
  assert.equal(equipeDoCRM({ quem: "solo" }), "Sou apenas eu");
  assert.equal(equipeDoCRM({ quem: "equipe", porte: "2a4" }), "2 a 4 colaboradores");
  assert.equal(equipeDoCRM({ quem: "equipe", porte: "5+" }), "5 ou mais colaboradores");
  assert.equal(equipeDoCRM({ quem: "abrir" }), undefined);
  assert.equal(equipeDoCRM({ quem: "barbeiro" }), undefined);
  for (const quem of ["solo", "equipe"]) for (const porte of ["2a4", "5+"]) {
    const valor = equipeDoCRM({ quem, porte });
    if (valor) assert.ok((EQUIPE_OPCOES_V3 as readonly string[]).includes(valor));
  }
  for (const assinatura of ["nao", "mao", "sistema"]) for (const objetivo of ["assinatura", "faturamento"]) {
    assert.ok((CLUBE_OPCOES as readonly string[]).includes(clubeDoCRM({ assinatura, objetivo })!));
  }
  for (const prazo of ["mes", "tres", "entender"]) assert.ok((QUANDO_OPCOES as readonly string[]).includes(quandoDoCRM({ prazo })!));
});

test("O contato leva a versão da página, a ficha na descrição e os campos da rota", () => {
  const contato = montarContato({ contato: { name: " Rafael ", whatsapp: "(31) 99999-0000" }, respostas: caso, conteudo });
  assert.equal(contato.Name, "Rafael");
  assert.deepEqual(contato.Phones, [{ PhoneNumber: "31999990000", TypeId: 2, CountryId: 0 }]);
  assert.deepEqual(propriedade(contato, PLOOMES_CONTACT_FIELDS.bb_lp_version), { FieldKey: PLOOMES_CONTACT_FIELDS.bb_lp_version, StringValue: "consultoria-v1" });
  assert.deepEqual(propriedade(contato, PLOOMES_LEGACY_FIELDS.employeeCount), { FieldKey: PLOOMES_LEGACY_FIELDS.employeeCount, StringValue: "2 a 4 colaboradores" });
  assert.deepEqual(propriedade(contato, PLOOMES_CONTACT_OPTION_FIELDS.bb_clube), { FieldKey: PLOOMES_CONTACT_OPTION_FIELDS.bb_clube, IntegerValue: PLOOMES_OPCOES_CLUBE["Já tenho o clube, mas gerencio manualmente"] });
  assert.deepEqual(propriedade(contato, PLOOMES_CONTACT_OPTION_FIELDS.bb_quando), { FieldKey: PLOOMES_CONTACT_OPTION_FIELDS.bb_quando, IntegerValue: PLOOMES_OPCOES_QUANDO["Nos próximos 3 meses"] });
  assert.deepEqual(propriedade(contato, PLOOMES_CONTACT_INT_FIELDS.bb_lead_score), { FieldKey: PLOOMES_CONTACT_INT_FIELDS.bb_lead_score, IntegerValue: 60 });
  assert.equal(
    (propriedade(contato, PLOOMES_LEGACY_FIELDS.campaignDescStr) as { StringValue: string }).StringValue,
    "[Consultoria] Objetivo: Montar ou crescer a assinatura · Trava: Cobrar cada assinante, todo mês, na mão · Quem: Dono, com equipe (2 a 4) · Assinatura: Tenho e cobro na mão ou no Pix · Prazo: Nos próximos 3 meses",
  );
});

test("Quem não declarou equipe nem assinatura não ganha valor inventado", () => {
  const contato = montarContato({ contato: { name: "Ana", whatsapp: "11988887777" }, respostas: { objetivo: "equipe", trava: "p20", quem: "barbeiro", prazo: "entender" }, conteudo });
  assert.equal(propriedade(contato, PLOOMES_LEGACY_FIELDS.employeeCount), undefined);
  assert.equal(propriedade(contato, PLOOMES_CONTACT_OPTION_FIELDS.bb_clube), undefined);
  assert.ok(!resumoDaFicha(conteudo, { objetivo: "equipe", trava: "p20", quem: "barbeiro", prazo: "entender" }).includes("Assinatura"));
});

test("Rota igual à do formulário v3: \"Este mês\" vai ao SDR, o resto ao Lucas", () => {
  assert.equal(rotaDoLead({ ...caso, prazo: "mes" }), "sdr");
  assert.equal(rotaDoLead({ ...caso, prazo: "tres" }), "lucas");
  assert.equal(rotaDoLead({ ...caso, prazo: "entender" }), "lucas");
});

test("O corpo da Nutrição leva equipe, assinatura e prazo para o card", () => {
  const contato = montarContato({ contato: { name: "Rafael", whatsapp: "31999990000" }, respostas: caso, conteudo });
  const corpo = montarCorpoNutricao(contato, caso, { originId: null, originDesc: null, fields: {} });
  assert.equal(corpo.card.colaboradores, "2 a 4 colaboradores");
  assert.equal(corpo.card.clube, "Já tenho o clube, mas gerencio manualmente");
  assert.equal(corpo.card.quando, "Nos próximos 3 meses");
  assert.equal(corpo.card.leadScore, 60);
  assert.equal("OriginId" in corpo.contato, false);
});

test("O botão do WhatsApp usa o número do Lucas e a mensagem da consultoria", () => {
  const numero = "5531999990000";
  assert.equal(linkDaConsultoria("Oi! Quero começar a minha consultoria.", null, numero),
    "https://wa.me/5531999990000?text=Oi!%20Quero%20come%C3%A7ar%20a%20minha%20consultoria.");
  assert.match(linkDaConsultoria("Oi!", 123, numero)!, /\(c%C3%B3d\.%20123\)$/);
  assert.equal(linkDaConsultoria("Oi!", null, ""), null);
});
