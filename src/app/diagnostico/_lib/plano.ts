// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json.
import type { Answers, Problem } from "./types.ts";

type Value = number | null;

/** Análise descendente: soma → produto → sinal → número, variável ou função. */
export function evaluateExpression(expression: string, values: Answers): Value {
  const tokens = expression.match(/\d+(?:\.\d+)?|[A-Za-z_]\w*|[()+\-*/,]|\S/g) ?? [];
  let cursor = 0;
  const take = () => tokens[cursor++];
  const expect = (token: string) => {
    if (take() !== token) throw new Error(`Expressão inválida: esperado ${token}.`);
  };
  const finite = (value: number) => {
    if (!Number.isFinite(value)) throw new Error("A conta não produz um número finito.");
    return value;
  };
  function primary(): Value {
    const token = take();
    if (token === "+" || token === "-") {
      const value = primary();
      return value === null ? null : token === "-" ? -value : value;
    }
    if (token === "(") {
      const value = sum();
      expect(")");
      return value;
    }
    if (token && /^\d+(?:\.\d+)?$/.test(token)) return finite(Number(token));
    if (!token || !/^[A-Za-z_]\w*$/.test(token)) throw new Error("Expressão inválida.");
    if (tokens[cursor] !== "(") {
      if (!Object.hasOwn(values, token)) throw new Error(`Variável desconhecida: ${token}.`);
      const value = values[token];
      return value === null ? null : finite(value);
    }
    if (!["ceil", "round", "max", "min"].includes(token)) throw new Error(`Função não permitida: ${token}.`);
    take();
    const args: Value[] = [sum()];
    while (tokens[cursor] === ",") {
      take();
      args.push(sum());
    }
    expect(")");
    if ((token === "ceil" || token === "round") && args.length !== 1) throw new Error("A função exige um argumento.");
    if (args.some((value) => value === null)) return null;
    const numbers = args as number[];
    if (token === "ceil") return finite(Math.ceil(numbers[0]));
    if (token === "round") return finite(Math.round(numbers[0]));
    return finite(token === "max" ? Math.max(...numbers) : Math.min(...numbers));
  }
  function product(): Value {
    let value = primary();
    while (tokens[cursor] === "*" || tokens[cursor] === "/") {
      const operator = take();
      const right = primary();
      value = value === null || right === null ? null : finite(operator === "*" ? value * right : value / right);
    }
    return value;
  }
  function sum(): Value {
    let value = product();
    while (tokens[cursor] === "+" || tokens[cursor] === "-") {
      const operator = take();
      const right = product();
      value = value === null || right === null ? null : finite(operator === "+" ? value + right : value - right);
    }
    return value;
  }
  const result = sum();
  if (cursor !== tokens.length) throw new Error("Há conteúdo inválido depois da expressão.");
  return result;
}

export function formatValue(value: Value, format: string): string {
  if (value === null) return "não sei";
  if (!Number.isFinite(value)) throw new Error("Número inválido para formatação.");
  const decimals = format === "reais_centavos" ? 2 : 0;
  const number = (decimals ? value : Math.round(value)).toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (format === "reais" || format === "reais_centavos") return `R$ ${number}`;
  return format === "percentual" ? `${number}%` : number;
}

/** Só notas editoriais são retiradas; [link] e os campos da mensagem do dono ficam. */
export function removeInternalNotes(text: string): string {
  return text.replace(/\s*\[(?:prazo:|a definir|a levantar)[^\]]*\]/g, "").trim();
}

export function fillText(text: string, replacements: Record<string, string>): string {
  const result = removeInternalNotes(text).replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!Object.hasOwn(replacements, key)) throw new Error(`Marcador sem valor: ${key}.`);
    return replacements[key];
  });
  if (/\{[^{}]+\}/.test(result)) throw new Error("O texto contém um marcador não resolvido.");
  return result;
}

export function buildPlan(problem: Problem, answers: Answers) {
  const values: Answers = {};
  const formatted: Record<string, string> = {};
  for (const question of problem.perguntas) {
    if (!Object.hasOwn(answers, question.var)) throw new Error(`Resposta ausente: ${question.var}.`);
    const value = answers[question.var];
    values[question.var] = value;
    if (value !== null) formatted[question.var] = formatValue(value, question.tipo);
  }
  for (const calculation of problem.calculos) {
    const value = evaluateExpression(calculation.expr, values);
    if (value !== null && value < 0) throw new Error(`Resultado negativo: ${calculation.var}.`);
    values[calculation.var] = value;
    if (value !== null) formatted[calculation.var] = formatValue(value, calculation.formato);
  }
  return {
    title: fillText(problem.plano.titulo, formatted),
    numbers: problem.perguntas.map((question) => ({
      label: question.rotulo,
      value: formatValue(answers[question.var], question.tipo),
    })),
    steps: problem.plano.passos.map((step) => fillText(
      step.se_nao_sabe && values[step.se_nao_sabe.var] === null ? step.se_nao_sabe.texto : step.texto,
      formatted,
    )),
    bestbarbers: fillText(problem.bestbarbers.texto, formatted),
    proof: problem.prova ? fillText(problem.prova.texto, formatted) : null,
    material: problem.material ? { text: fillText(problem.material.texto, formatted), link: problem.material.link } : null,
    values,
  };
}
