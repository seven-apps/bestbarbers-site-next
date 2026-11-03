import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getAdjacentStep, getFlowSteps, readDirectProblem } from "./flow.ts";
import { buildPayload } from "./ploomes.ts";
import type { Problem, Screens } from "./types.ts";

const source = JSON.parse(readFileSync(new URL("../_data/diagnostico-v1.json", import.meta.url), "utf8")) as {
  problemas: Problem[];
  telas: ({ id: string } & Screens["tema"])[];
};

function walk(steps: readonly number[], direction: -1 | 1) {
  let current = direction === 1 ? 0 : 6;
  const visited = [current];
  for (let index = 1; index < steps.length; index++) {
    current = getAdjacentStep(steps, current, direction);
    visited.push(current);
  }
  return visited;
}

test("O link de cada problema ativo pula tema e problema, inclusive ao voltar", () => {
  for (const expected of source.problemas) {
    const problem = readDirectProblem(`?problema=${expected.id}`, source.problemas);
    assert.equal(problem, expected);
    const steps = getFlowSteps(Boolean(problem), false);
    assert.deepEqual(walk(steps, 1), [0, 1, 4, 5, 6]);
    assert.deepEqual(walk(steps, -1), [6, 5, 4, 1, 0]);
    assert.equal(getAdjacentStep(steps, 0, -1), 0);
    assert.equal(getAdjacentStep(steps, 6, 1), 6);
  }
});

test("Parâmetro ausente, vazio, inválido ou problema da reserva mantém o fluxo normal", () => {
  for (const search of ["", "?utm_source=meta", "?problema=", "?problema=invalido", "?problema=p21", "?problema=P03"]) {
    const problem = readDirectProblem(search, source.problemas);
    assert.equal(problem, undefined);
    const steps = getFlowSteps(Boolean(problem), false);
    assert.deepEqual(walk(steps, 1), [0, 1, 2, 3, 4, 5, 6]);
    assert.deepEqual(walk(steps, -1), [6, 5, 4, 3, 2, 1, 0]);
  }
});

test("É outra coisa continua pulando apenas os números", () => {
  const steps = getFlowSteps(false, true);
  assert.deepEqual(walk(steps, 1), [0, 1, 2, 3, 5, 6]);
  assert.deepEqual(walk(steps, -1), [6, 5, 3, 2, 1, 0]);
});

test("A leitura decodifica o id sem consumir nem alterar utm_* e origin", () => {
  const url = new URL("https://exemplo.test/diagnostico?utm_source=meta&utm_medium=cpc&utm_campaign=novembro&utm_content=anuncio&utm_term=barbearia&origin=123&problema=%70%30%33");
  const before = url.href;
  assert.equal(readDirectProblem(url.search, source.problemas)?.id, "p03");
  assert.equal(url.href, before);
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    utm_source: "meta", utm_medium: "cpc", utm_campaign: "novembro", utm_content: "anuncio",
    utm_term: "barbearia", origin: "123", problema: "p03",
  });
});

test("O problema do anúncio encontra seu tema e gera o mesmo payload da escolha manual", () => {
  const themes = source.telas.find((screen) => screen.id === "tema")!.opcoes;
  for (const manualProblem of source.problemas) {
    const directProblem = readDirectProblem(`?problema=${manualProblem.id}`, source.problemas)!;
    const theme = themes.find((item) => item.problemas.includes(directProblem.id));
    assert.ok(theme);
    const input = {
      contact: { name: "Teste local", whatsapp: "11999999999", instagram: "" },
      moment: "Com equipe", theme: theme.texto,
      answers: Object.fromEntries(directProblem.perguntas.map((question) => [question.var, question.min ?? 1])),
      otherText: "", otherLabel: "É outra coisa",
    };
    const payload = buildPayload({ ...input, problem: directProblem });
    assert.deepEqual(payload, buildPayload({ ...input, problem: manualProblem }));
    assert.ok(payload.payload.OtherProperties.some((item) => item.StringValue?.includes(`${directProblem.mapa} ${directProblem.opcao}`)));
  }
});
