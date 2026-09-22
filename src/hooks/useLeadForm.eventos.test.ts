/**
 * CONTRATO DE DISPARO do useLeadForm — lido do CÓDIGO-FONTE, de propósito.
 *
 * POR QUE ASSIM: o repositório não tem harness de hook (nem jsdom, nem testing-library — o
 * runner é `node --test` puro), e importar o hook em runtime puxaria React + os aliases
 * `@/` que nada resolve fora do build. A alternativa honesta seria extrair uma função pura
 * `eventosDoLead({ leadScore, employeeCount, publico })` e o hook só orquestrar — é a
 * correção ESTRUTURAL certa e está anotada como pendência, não feita aqui para não colidir
 * com quem está editando o mesmo arquivo nesta rodada.
 *
 * O QUE ESTE TESTE PEGA DE VERDADE (as três classes de bug mais caras deste PR, todas
 * silenciosas em produção — nenhuma delas aparece como erro em lugar nenhum):
 *   1. o evento novo condicionado à célula → os dois lados do A/B medindo coisas diferentes;
 *   2. sufixo de event_id repetido → a Meta descarta a cópia do servidor como duplicata e o
 *      evento chega sem telefone/e-mail/fbc, que é exatamente o que a célula B compra;
 *   3. evento que sai pelo pixel e não pela CAPI (ou vice-versa) → metade do par de dedup.
 *
 * O QUE ELE NÃO PEGA: comportamento em execução. O aceite de verdade continua sendo o smoke
 * do dia do deploy (lead '3 a 4 profissionais' na /clube gera Lead E LeadComEquipe, cada um
 * com navegador + servidor casados; lead 'Sou apenas eu' NÃO gera o evento novo).
 *
 * Runner: `node --test`. Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const fonte = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "useLeadForm.ts"), "utf8");

/** Só o miolo do disparo: da montagem das promessas até o await que as fecha. */
const blocoDeDisparo = (() => {
  const i = fonte.indexOf("const pixelPromises");
  const f = fonte.indexOf("await Promise.all(pixelPromises)");
  assert.ok(i > 0 && f > i, "bloco de disparo não encontrado — o teste precisa ser reancorado");
  return fonte.slice(i, f);
})();

/** O `if (...)` que guarda cada evento, pelo nome do evento. */
const guardaDe = (evento: string): string => {
  const pos = blocoDeDisparo.indexOf(`'${evento}'`);
  assert.ok(pos > 0, `${evento} não é disparado`);
  const ifs = [...blocoDeDisparo.slice(0, pos).matchAll(/if \(([^)]*)\) \{/g)];
  return ifs[ifs.length - 1]?.[1] ?? "";
};

test("LeadComEquipe dispara pela RESPOSTA do formulário, nunca pela célula", () => {
  // A regra do A/B: os dois lados precisam emitir a MESMA série, senão a diferença
  // observada não é o evento comprado — é o gate. Se um dia alguém "economizar" o evento
  // restringindo-o à célula B, o teste cai aqui antes de o estudo começar (e o estudo
  // CONGELA depois de começar: não dá para corrigir no meio).
  const guarda = guardaDe("LeadComEquipe");
  assert.equal(guarda, "comEquipe");
  for (const proibido of ["celula", "metaLeadFired", "publico", "leadScore"]) {
    assert.doesNotMatch(guarda, new RegExp(proibido, "i"), `guarda do LeadComEquipe cita ${proibido}`);
  }
  assert.match(fonte, /const comEquipe = temEquipe\(formData\.employeeCount\)/);
  assert.match(fonte, /import \{[^}]*\btemEquipe\b[^}]*\} from '@\/lib\/lead-score'/);
});

test("cada sufixo de event_id é único — nome novo, sufixo novo", () => {
  // A Meta deduplica pelo par (event_name, event_id) dentro de 48 h. Reaproveitar um
  // sufixo faz a cópia do servidor ser DESCARTADA como duplicata: nenhum erro, nenhum log,
  // só a qualidade de correspondência caindo no evento que o teste está comprando.
  const sufixos = [...blocoDeDisparo.matchAll(/\$\{leadEventId\}([^`]*)`/g)].map((m) => m[1]);
  const unicos = [...new Set(sufixos)].sort();
  assert.deepEqual(unicos, ["-eq", "-q", "-q60"]);
  // Cada sufixo aparece exatamente 2×: uma no pixel, uma na CAPI. É esta contagem que pega
  // o evento que sai por uma via só — metade do par de dedup, invisível no painel.
  for (const s of unicos) assert.equal(sufixos.filter((x) => x === s).length, 2, `sufixo ${s}`);
  // O 'Lead' é o único que usa o id CRU (sem sufixo), também nas duas vias.
  assert.equal(blocoDeDisparo.match(/\(pixelData, leadEventId\)|sendCapiEvent\('Lead', leadEventId\)/g)?.length, 2);
});

test("LeadComEquipe usa trackNonCatalogEvent (verbo certo + fallback de ad-blocker)", () => {
  // `trackCustomEvent` manda tudo por fbq('track'), verbo ERRADO para nome fora do
  // catálogo. `trackNonCatalogEvent` usa trackCustom e tem o image pixel com o MESMO
  // eventID — sem ele o evento morre para quem usa ad-blocker.
  assert.match(blocoDeDisparo, /trackNonCatalogEvent\('LeadComEquipe', pixelData, `\$\{leadEventId\}-eq`\)/);
  assert.match(blocoDeDisparo, /sendCapiEvent\('LeadComEquipe', `\$\{leadEventId\}-eq`\)/);
  assert.doesNotMatch(blocoDeDisparo, /trackCustomEvent/);
});

test("o nome novo está declarado no contrato da CAPI do site", () => {
  // Espelho da união literal de `sendCapiEvent`: ela precisa ser subconjunto de
  // EVENTOS_CAPI em bestbarbers-ai/lib/integrations/meta-capi-eventos.ts:43-53. Nome que a
  // rota não conhece volta 400 — e o 400 não interrompe nada aqui (fetch RESOLVE em 4xx).
  const uniao = fonte.match(/eventName: ((?:'[A-Za-z0-9]+'\s*\|?\s*)+),/)?.[1] ?? "";
  assert.deepEqual(
    [...uniao.matchAll(/'([A-Za-z0-9]+)'/g)].map((m) => m[1]).sort(),
    ["Lead", "LeadComEquipe", "QualifiedLead", "QualifiedLead60"],
  );
});

test("a CAPI deixou de engolir erro: HTTP não-ok vira aviso", () => {
  // `fetch` não rejeita em 400, ele resolve — sem este `if (!res.ok)` o `.catch` nunca é
  // acionado por resposta de erro e a falha não deixa rastro nenhum. Foi assim que o
  // QualifiedLead60 passou meses com a cópia do servidor muda.
  assert.match(fonte, /if \(!res\.ok\)/);
});

test("CELULAS_COM_CORTE segue intocado pelo evento novo", () => {
  // O conjunto da célula B não está na lista, então `metaLeadFired` sai true e o 'Lead'
  // continua disparando em todo envio — é o comportamento certo: a célula B compra o
  // evento novo E alimenta a série do Lead, que é o que torna as duas comparáveis.
  const lista = fonte.slice(fonte.indexOf("CELULAS_COM_CORTE"), fonte.indexOf("const celula ="));
  assert.doesNotMatch(lista, /EQUIPE/i);
  assert.equal([...lista.matchAll(/conjunto: '/g)].length, 2);
});
