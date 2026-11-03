// Fonte: bestbarbers-ai/_sandbox/diagnostico-v1/render.cjs e o contrato 02-dados.json.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildPlan, evaluateExpression, fillText, formatValue, removeInternalNotes } from "./plano.ts";
import { parseAnswers, validateAnswers, validateContact } from "./validation.ts";
import { buildPayload, ENVIO_PLOOMES_ATIVO, getPendingPayload, keepPayloadLocally, originId } from "./ploomes.ts";
import { PLOOMES_CONTACT_FIELDS, PLOOMES_LEGACY_FIELDS } from "../../../lib/ploomes-fields.ts";
import type { Answers, DraftAnswers, Problem } from "./types.ts";

const source = JSON.parse(readFileSync(new URL("../_data/diagnostico-v1.json", import.meta.url), "utf8")) as { problemas: Problem[] };
// Saída integral de: node <bestbarbers-ai>/_sandbox/diagnostico-v1/render.cjs <contrato>/02-dados.json.
// Cada cabeçalho já contém as entradas originais do EX, sem uma segunda transcrição.
const fixture = readFileSync(new URL("../_fixtures/render.txt", import.meta.url), "utf8");
const examples = [...fixture.matchAll(/^=== (p\d+) #\d+ · ([ABN]) · (.+)\n([\s\S]*?)(?=\n===|\nerros:)/gm)].map((match) => ({
  id: match[1], example: match[2], answers: JSON.parse(match[3]) as Answers,
  steps: match[4].trim().split("\n").map((line) => line.replace(/^\d+\. /, "")),
}));

function assertSafe(plan: ReturnType<typeof buildPlan>) {
  assert.doesNotMatch(JSON.stringify(plan), /\{\w+\}|NaN|Infinity/);
  for (const value of Object.values(plan.values)) {
    assert.ok(value === null || (Number.isFinite(value) && value >= 0));
  }
}

test("A fixture cobre os 15 problemas e todos os 31 exemplos A, B e N", () => {
  assert.match(fixture, /erros: 0\s*$/);
  assert.equal(examples.length, 31);
  assert.equal(source.problemas.length, 15);
  for (const problem of source.problemas) {
    assert.deepEqual(examples.filter((item) => item.id === problem.id).map((item) => item.example), problem.id === "p03" ? ["A", "B", "N"] : ["A", "B"]);
  }
});

for (const example of examples) {
  test(`${example.id} · ${example.example}: cada passo é idêntico à referência, sem marcador, NaN ou valor negativo`, () => {
    const problem = source.problemas.find((item) => item.id === example.id)!;
    const plan = buildPlan(problem, example.answers);
    assert.deepEqual(plan.steps, example.steps);
    assertSafe(plan);
  });
}

for (const problem of source.problemas) {
  test(`${problem.id}: limites mínimo e máximo válidos produzem números finitos e não negativos`, () => {
    for (const edge of ["min", "max"] as const) {
      const drafts: DraftAnswers = {};
      for (const question of problem.perguntas) {
        const choices = question.opcoes?.map((option) => option.valor).filter((value): value is number => typeof value === "number");
        drafts[question.var] = String(question[edge] ?? (edge === "min" ? Math.min(...choices!) : Math.max(...choices!)));
      }
      for (const question of problem.perguntas) {
        if (question.max_var) drafts[question.var] = String(Math.min(Number(drafts[question.var]), Number(drafts[question.max_var])));
      }
      assert.deepEqual(validateAnswers(problem.perguntas, drafts), {});
      assertSafe(buildPlan(problem, parseAnswers(drafts)));
    }
  });
  for (const question of problem.perguntas.filter((item) => item.aceita_nao_sei || item.opcoes?.some((option) => option.valor === null))) {
    test(`${problem.id}: não sei em ${question.var} usa o texto alternativo e propaga o nulo`, () => {
      const answers = { ...examples.find((item) => item.id === problem.id)!.answers, [question.var]: null };
      const plan = buildPlan(problem, answers);
      assertSafe(plan);
      assert.equal(plan.numbers.find((item) => item.label === question.rotulo)?.value, "não sei");
      for (const calculation of problem.calculos) {
        if (new RegExp(`\\b${question.var}\\b`).test(calculation.expr)) assert.equal(plan.values[calculation.var], null);
      }
    });
  }
}

test("A gramática respeita precedência, parênteses, sinais e as quatro funções", () => {
  assert.equal(evaluateExpression("2 + 3 * (7 - 2) / 5", {}), 5);
  assert.equal(evaluateExpression("min(max(2, 5), ceil(4.1)) + round(1.5)", {}), 7);
  assert.equal(evaluateExpression("-2 * -3 + +1", {}), 7);
  assert.equal(evaluateExpression("min(2, unknown) + 5", { unknown: null }), null);
  assert.equal(evaluateExpression("known + dependent", { known: 3, dependent: null }), null);
  for (const expression of ["process.exit()", "globalThis", "Math.round(2)", "x = 2", "2 ** 3", "2; 3", "ceil()", "round(1, 2)", "1 / 0", "1 +", "(2", "2 3"]) {
    assert.throws(() => evaluateExpression(expression, {}));
  }
});

test("A formatação segue os quatro formatos do contrato", () => {
  assert.equal(formatValue(8000, "reais"), "R$ 8.000");
  assert.equal(formatValue(12.5, "reais_centavos"), "R$ 12,50");
  assert.equal(formatValue(40, "percentual"), "40%");
  assert.equal(formatValue(1234, "inteiro"), "1.234");
  assert.throws(() => fillText("{missing}", {}));
});

test("As notas do time saem; os campos das mensagens do dono permanecem", () => {
  assert.equal(removeInternalNotes("Recebido. [prazo: a definir com o João]"), "Recebido.");
  assert.equal(removeInternalNotes("Oi, [nome do cliente], [seu nome], [barbearia], [link]."), "Oi, [nome do cliente], [seu nome], [barbearia], [link].");
});

test("A validação bloqueia ausência, frações indevidas, limites e max_var", () => {
  const problem = source.problemas.find((item) => item.id === "p05")!;
  const invalidDrafts: DraftAnswers[] = [{}, { assinantes: "" }, { assinantes: "0" }, { assinantes: "1.5" }, { assinantes: "5001" }, { assinantes: null }];
  for (const drafts of invalidDrafts) {
    assert.ok(validateAnswers(problem.perguntas, drafts).assinantes);
  }
  assert.ok(validateAnswers(problem.perguntas, { assinantes: "10", valor_plano: "80", lembrar_mes: "11" }).lembrar_mes);
  assert.deepEqual(validateAnswers(problem.perguntas, { assinantes: "10", valor_plano: "80", lembrar_mes: "10" }), {});
  const cents = [{ var: "amount", texto: "Valor", rotulo: "valor", tipo: "reais_centavos", min: 0, max: 2000 }];
  assert.deepEqual(validateAnswers(cents, { amount: "12,50" }), {});
  assert.ok(validateAnswers(cents, { amount: "12,501" }).amount);
  const choice = source.problemas.find((item) => item.id === "p13")!.perguntas.find((item) => item.tipo === "escolha")!;
  assert.ok(validateAnswers([choice], { cortes_plano: "5" }).cortes_plano);
  assert.deepEqual(validateAnswers([choice], { cortes_plano: "4" }), {});
});

test("O contato exige nome e WhatsApp de 10 ou 11 dígitos; Instagram é opcional", () => {
  for (const whatsapp of ["(11) 99999-9999", "(11) 3333-3333"]) {
    assert.deepEqual(validateContact({ name: "Teste local", whatsapp, instagram: "" }), {});
  }
  for (const whatsapp of ["", "123456789", "5511999999999"]) {
    assert.ok(validateContact({ name: "Teste", whatsapp, instagram: "" }).whatsapp);
  }
  assert.ok(validateContact({ name: "  ", whatsapp: "11999999999", instagram: "" }).nome);
});

test("O payload conserva os campos existentes, sem score, campos novos ou envio", () => {
  const problem = source.problemas[0];
  const payload = buildPayload({ contact: { name: " Teste local ", whatsapp: "(11) 99999-9999", instagram: "@teste" }, moment: "Com equipe", theme: "Assinatura", problem, answers: examples[0].answers, otherText: "", otherLabel: "É outra coisa" });
  assert.equal(ENVIO_PLOOMES_ATIVO, false);
  assert.equal(originId, null);
  assert.equal(payload.payload.OriginId, null);
  assert.equal(payload.payload.Name, "Teste local");
  assert.equal(payload.payload.Phones[0].PhoneNumber, "11999999999");
  const properties = payload.payload.OtherProperties;
  assert.equal(properties.find((item) => item.FieldKey === PLOOMES_LEGACY_FIELDS.ownerName)?.StringValue, "Teste local");
  assert.equal(properties.find((item) => item.FieldKey === PLOOMES_CONTACT_FIELDS.bb_lp_version)?.StringValue, "diagnostico-v1");
  assert.equal(properties.find((item) => item.FieldId === 120010584)?.StringValue, "@teste");
  assert.equal(properties.find((item) => item.FieldKey === PLOOMES_LEGACY_FIELDS.campaignDescStr)?.StringValue, `[Diagnóstico] Com equipe · Assinatura · #3 ${problem.opcao} · assinatura_mes=9864; comissao_pct=40; atend_assin=228`);
  assert.doesNotMatch(JSON.stringify(payload), /SCORE:|bb_diag_|user-key|api.?key/i);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("Uma requisição não pode acontecer."); };
  try {
    keepPayloadLocally(payload);
    assert.equal(getPendingPayload(), payload);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("É outra coisa guarda o relato no resumo, sem inventar mapa ou números", () => {
  const payload = buildPayload({ contact: { name: "Teste", whatsapp: "11999999999", instagram: "" }, moment: "Vai abrir", theme: "Equipe", answers: {}, otherText: " Meu relato ", otherLabel: "É outra coisa" });
  assert.equal(payload.payload.OtherProperties.find((item) => item.FieldKey === PLOOMES_LEGACY_FIELDS.campaignDescStr)?.StringValue, "[Diagnóstico] Vai abrir · Equipe · É outra coisa · outra_coisa=Meu relato");
  assert.equal(payload.payload.OtherProperties.length, 3);
});
