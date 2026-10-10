/**
 * Conteúdo do curso de assinatura — as 6 aulas iguais às do contrato (o OS guarda as mesmas) e
 * as regras de copy do André passadas em TODO texto da vitrine e da área.
 *
 * Runner: `node --test`. Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AULAS,
  CAMINHO_AREA,
  CAMINHO_VITRINE,
  NOME_DO_CURSO,
  ROTULOS_DO_PLANO,
  SLUG_CURSO,
  TEXTOS_AREA,
  TEXTOS_FICHA,
  TEXTOS_PENDENTES_DE_APROVACAO,
  TEXTOS_VITRINE,
  ehAreaDoAluno,
} from "./curso-assinatura.ts";
import { segundosDaDuracao } from "../lib/curso.ts";

/** Todo texto de um objeto de conteúdo, chamando as funções com valores de exemplo. */
function todosOsTextos(valor: unknown, saida: string[] = []): string[] {
  if (typeof valor === "string") saida.push(valor);
  else if (typeof valor === "function") {
    const argumentos = Array.from({ length: valor.length }, (_, i) => (i === 0 ? "X" : "Y"));
    todosOsTextos((valor as (...a: unknown[]) => unknown)(...argumentos), saida);
  } else if (Array.isArray(valor)) valor.forEach((v) => todosOsTextos(v, saida));
  else if (valor && typeof valor === "object") Object.values(valor).forEach((v) => todosOsTextos(v, saida));
  return saida;
}

const TEXTOS = todosOsTextos([TEXTOS_VITRINE, TEXTOS_AREA, TEXTOS_FICHA, ROTULOS_DO_PLANO, AULAS.map((a) => [a.titulo, a.resumo])]);

test("as 6 aulas, na ordem, com os títulos do contrato (§1) e duração no formato m:ss", () => {
  assert.deepEqual(AULAS.map((a) => a.numero), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(AULAS.map((a) => a.titulo), [
    "Quanto cobrar: os dois erros de preço",
    "Cobrar sem correr atrás de ninguém",
    "Monte o seu plano",
    "Como pagar o barbeiro na assinatura",
    "A aula para a sua equipe",
    "Lançar, migrar e acompanhar",
  ]);
  for (const a of AULAS) {
    assert.ok(a.duracao === "" || segundosDaDuracao(a.duracao) !== null, `duração da aula ${a.numero}`);
    assert.ok(a.youtubeId === "" || /^[A-Za-z0-9_-]{11}$/.test(a.youtubeId), `id do YouTube da aula ${a.numero}`);
  }
});

test("slug e caminhos fixos do contrato; a guarda da área casa só a área", () => {
  assert.equal(SLUG_CURSO, "curso-assinatura");
  assert.equal(CAMINHO_VITRINE, "/curso-assinatura");
  assert.equal(CAMINHO_AREA, "/curso-assinatura/aluno");
  assert.equal(ehAreaDoAluno("/curso-assinatura/aluno"), true);
  assert.equal(ehAreaDoAluno("/curso-assinatura"), false);
  assert.equal(ehAreaDoAluno("/curso-assinatura/alunos"), false);
});

test("nome provisório e textos marcados como pendentes", () => {
  assert.equal(NOME_DO_CURSO, "Assinatura na Prática");
  assert.equal(TEXTOS_PENDENTES_DE_APROVACAO, true);
});

test("copy: 'clube' só no botão de migração já aprovado", () => {
  const comClube = TEXTOS.filter((t) => /clube/i.test(t));
  assert.deepEqual([...new Set(comClube)], ["QUERO MIGRAR MEU CLUBE DE ASSINATURAS"]);
});

test("copy: nenhuma objeção plantada nem promessa de preço", () => {
  for (const t of TEXTOS) {
    assert.doesNotMatch(t, /gr[áa]tis|gratuit|sem compromisso|sem senha|n[ãa]o [ée] venda/i, t);
    assert.doesNotMatch(t, /garant/i, t);
  }
});

test("copy: o código do aluno nunca vai escrito à mão (o código acrescenta '(aluno <codigo>)')", () => {
  for (const t of TEXTOS) {
    assert.doesNotMatch(t, /\(aluno /, t);
    assert.doesNotMatch(t, /c[óo]d\./i, t);
  }
});

test("a guarda do layout usa o mesmo caminho da área", async () => {
  const { readFileSync } = await import("node:fs");
  const { dirname, join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const layout = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../app/layout.tsx"), "utf8");
  const guardas = layout.match(/location\.pathname\.startsWith\('([^']+)'\)/g) ?? [];
  assert.equal(guardas.length, 2, "GTM e pixel: as duas guardas");
  for (const g of guardas) assert.ok(g.includes(`'${CAMINHO_AREA}'`), g);
});
