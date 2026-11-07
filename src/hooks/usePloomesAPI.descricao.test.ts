import test from "node:test";
import assert from "node:assert/strict";

// Cópia da regra de `comTrechoDaPagina` (o hook importa React e não roda no node --test): se mudar lá, muda aqui.
function comTrechoDaPagina(descricao: string | null, trecho: string): string {
  const [, prefixos = "", resto = ""] = (descricao ?? "").match(/^((?:\[[^\]]*\]\s*)*)([\s\S]*)$/) ?? [];
  return [prefixos.trim(), trecho, resto.trim()].filter(Boolean).join(" ");
}

test("O trecho da página entra depois dos prefixos e antes da atribuição", () => {
  assert.equal(comTrechoDaPagina("[SCORE: 85] [QUANDO: Este mês] consultoria | W1 | camp | pub", "[Consultoria] Trava: x"),
    "[SCORE: 85] [QUANDO: Este mês] [Consultoria] Trava: x consultoria | W1 | camp | pub");
  assert.equal(comTrechoDaPagina(null, "[Consultoria] Trava: x"), "[Consultoria] Trava: x");
  assert.equal(comTrechoDaPagina("Site do BestBarbers", "[Consultoria] Trava: x"), "[Consultoria] Trava: x Site do BestBarbers");
});
