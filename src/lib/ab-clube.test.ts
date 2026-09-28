/**
 * A/B de página de `/clube/[peca]` — a regra pura do sorteio (ciclo 1, 24/Set/26).
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./ab-clube.ts";

const ab = modulo as typeof import("./ab-clube");

test("o sorteio tem um braço só, longa, desde 28/Set/26 (decisão do André: a longa fez 12 de 24 com equipe × 4 de 16 da curta)", () => {
  assert.deepEqual([...ab.BRACOS_NO_SORTEIO], ["longa"]);
  for (const sorteio of [0, 0.499, 0.5, 0.999, 1, -1]) assert.equal(ab.bracoDoVisitante(undefined, sorteio), "longa");
});

test("cookie válido vence o sorteio; cookie do teste anterior (base/cena) ou lixo ressorteia", () => {
  assert.equal(ab.bracoDoVisitante("longa", 0.1), "longa");
  // `curta` e `cena` estão em código mas FORA do sorteio: um cookie antigo com eles não prende o visitante lá.
  assert.equal(ab.bracoDoVisitante("curta", 0.9), "longa");
  assert.equal(ab.bracoDoVisitante("cena", 0.1), "longa");
  assert.equal(ab.bracoDoVisitante("cena", 0.9), "longa");
  assert.equal(ab.bracoDoVisitante("base", 0.9), "longa", "o nome antigo do braço curto não vale mais");
  assert.equal(ab.bracoDoVisitante("lixo", 0.1), "longa");
  assert.equal(ab.bracoDoVisitante("", 0.9), "longa");
});

test("?ab= força qualquer braço em código (QA), inclusive o cena fora do sorteio", () => {
  assert.equal(ab.bracoForcado("curta"), "curta");
  assert.equal(ab.bracoForcado("longa"), "longa");
  assert.equal(ab.bracoForcado("cena"), "cena");
  assert.equal(ab.bracoForcado("base"), undefined);
  assert.equal(ab.bracoForcado(null), undefined);
  assert.equal(ab.bracoForcado(""), undefined);
  // Só os braços do sorteio viram cookie (o middleware usa esta guarda).
  assert.equal(ab.ehBracoSorteado("cena"), false);
  assert.equal(ab.ehBracoSorteado("longa"), true);
});

test("rota interna por braço: longa para as 11, cena só com foto, curta é a própria página", () => {
  assert.equal(ab.rotaDoBraco("retentativa", "longa"), "/clube-longa/retentativa");
  assert.equal(ab.rotaDoBraco("parceiro-guapo", "longa"), "/clube-longa/parceiro-guapo");
  assert.equal(ab.rotaDoBraco("retentativa", "curta"), null);
  assert.equal(ab.rotaDoBraco("retentativa", "cena"), "/clube-cena/retentativa");
  assert.equal(ab.rotaDoBraco("parceiro-guapo", "cena"), null, "página de vídeo não tem cena");
});

test("varianteVista lê a <meta name=\"bb-variante\"> e ignora valor desconhecido ou ausência", () => {
  const doc = (valor: string | null) => ({
    querySelector: (q: string) => (q === `meta[name="${ab.META_VARIANTE}"]` && valor !== null ? { getAttribute: () => valor } : null),
  });
  assert.equal(ab.META_VARIANTE, "bb-variante");
  assert.equal(ab.varianteVista(doc("longa") as unknown as Document), "longa");
  assert.equal(ab.varianteVista(doc("curta") as unknown as Document), "curta");
  assert.equal(ab.varianteVista(doc("cena") as unknown as Document), "cena");
  assert.equal(ab.varianteVista(doc("base") as unknown as Document), null);
  assert.equal(ab.varianteVista(doc(null) as unknown as Document), null);
  assert.equal(ab.varianteVista(undefined), null, "sem document (servidor/teste) = null, sem quebrar");
});

test("cookie: nome e validade de 30 dias", () => {
  assert.equal(ab.COOKIE_AB_CLUBE, "bb_ab_clube");
  assert.equal(ab.DIAS_COOKIE_AB, 30);
});
