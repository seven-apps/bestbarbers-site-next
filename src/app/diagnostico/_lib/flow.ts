import type { Problem } from "./types.ts";

/** Lê apenas o problema; os parâmetros de atribuição permanecem na URL. */
export function readDirectProblem(search: string, problems: readonly Problem[]) {
  const id = new URLSearchParams(search).get("problema");
  return problems.find((problem) => problem.id === id);
}

export function getFlowSteps(isDirect: boolean, isOther: boolean): readonly number[] {
  if (isDirect) return [0, 1, 4, 5, 6];
  if (isOther) return [0, 1, 2, 3, 5, 6];
  return [0, 1, 2, 3, 4, 5, 6];
}

export function getAdjacentStep(steps: readonly number[], step: number, direction: -1 | 1) {
  const index = steps.indexOf(step);
  return steps[Math.max(0, Math.min(steps.length - 1, index + direction))];
}
