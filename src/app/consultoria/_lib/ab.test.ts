import test from "node:test";
import assert from "node:assert/strict";
import {
  AB_CONTATO_ATIVO, FRACAO_CEDO, TELAS_MEDIDAS, bracoDoEventId, bracoDoVisitante, bracoForcado, eventoDaTela, eventoDoContato,
  sufixoDoBraco,
} from "./ab.ts";

test("O sorteio está ligado, meio a meio", () => {
  assert.equal(AB_CONTATO_ATIVO, true);
  assert.equal(FRACAO_CEDO, 0.5);
});

test("O cookie válido mantém o braço do visitante; sem cookie, o número sorteado decide", () => {
  assert.equal(bracoDoVisitante("cedo", 0.99), "cedo");
  assert.equal(bracoDoVisitante("fim", 0.01), "fim");
  assert.equal(bracoDoVisitante(undefined, 0.49), "cedo");
  assert.equal(bracoDoVisitante(undefined, 0.5), "fim");
  assert.equal(bracoDoVisitante("lixo", 0.1), "cedo");
});

test("Com o sorteio desligado, todo mundo volta ao controle, até quem tinha cookie do braço cedo", () => {
  assert.equal(bracoDoVisitante("cedo", 0.1, false), "fim");
  assert.equal(bracoDoVisitante(undefined, 0.1, false), "fim");
});

test("?contato= só força braço que existe", () => {
  assert.equal(bracoForcado("cedo"), "cedo");
  assert.equal(bracoForcado("fim"), "fim");
  assert.equal(bracoForcado("inicio"), undefined);
  assert.equal(bracoForcado(null), undefined);
});

test("O braço vai e volta pelo leadEventId, e não se confunde com o teste de formulário da /clube", () => {
  for (const braco of ["fim", "cedo"] as const) {
    assert.equal(bracoDoEventId(`1794083413785-tc${sufixoDoBraco(braco)}`), braco);
  }
  assert.equal(bracoDoEventId("1794083413785-tc-form_prog"), undefined);
  assert.equal(bracoDoEventId("1794083413785-tc"), undefined);
  assert.equal(bracoDoEventId(null), undefined);
});

test("Os nomes de evento do pixel cabem nos 40 caracteres da Meta e só usam letra, número e _", () => {
  const nomes = [
    ...TELAS_MEDIDAS.flatMap((tela) => [eventoDaTela(tela, "fim"), eventoDaTela(tela, "cedo")]),
    eventoDoContato("fim"), eventoDoContato("cedo"),
  ];
  assert.equal(new Set(nomes).size, nomes.length);
  for (const nome of nomes) {
    assert.ok(nome.length <= 40, nome);
    assert.match(nome, /^[A-Za-z0-9_]+$/);
  }
  assert.equal(eventoDaTela("faturamento", "cedo"), "ConsultoriaTela_faturamento_cedo");
});
