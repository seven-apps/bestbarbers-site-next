/**
 * `CadastroConcluido` — o que o `useLeadForm` entrega ao `onSuccess` (contrato do curso §2.2) —
 * e o id do contato na resposta do Ploomes. O hook não roda fora do build; o que é dele é
 * conferido no código-fonte, no padrão de `useLeadForm.eventos.test.ts`.
 *
 * Runner: `node --test`. Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { idDoContatoCriado, idPositivo, montarCadastroConcluido } from "./cadastro-concluido.ts";

const atribuicao = { originId: 40210426, originDesc: "[SCORE: 42] x", fields: { bb_lp_version: "curso-assinatura" }, leadScore: 42 };
const formData = {
  ownerName: "  João Silva ",
  barbershopName: " Barbearia do João ",
  whatsapp: "(31) 97226-8877",
  email: " Joao@Exemplo.COM ",
  clubStatus: "Já tenho o clube, mas gerencio manualmente",
};

test("montarCadastroConcluido: nome e barbearia sem espaço, e-mail minúsculo, telefone como digitado", () => {
  const c = montarCadastroConcluido({ formData, nota: 42, caminho: "lucas", dealId: 1202661959, contactId: 120554433, atribuicao });
  assert.deepEqual(c, {
    nome: "João Silva",
    barbearia: "Barbearia do João",
    telefone: "(31) 97226-8877",
    email: "joao@exemplo.com",
    nota: 42,
    clube: "Já tenho o clube, mas gerencio manualmente",
    caminho: "lucas",
    dealId: 1202661959,
    contactId: 120554433,
    atribuicao,
  });
});

test("montarCadastroConcluido: e-mail vazio sai; nota ausente fica null (nunca 0); sdr não tem card", () => {
  const c = montarCadastroConcluido({ formData: { ...formData, email: "  " }, nota: null, caminho: "sdr", dealId: 99, contactId: undefined, atribuicao });
  assert.equal("email" in c, false);
  assert.equal(c.nota, null);
  assert.equal(c.dealId, null, "no caminho de hoje o card nasce pela automação; nenhum id do site vale");
  assert.equal(c.contactId, null);
  const recadastro = montarCadastroConcluido({ formData, nota: 70, caminho: "recadastro", dealId: 5, contactId: 6, atribuicao });
  assert.equal(recadastro.dealId, 5);
});

test("idDoContatoCriado: o POST /Contacts devolve { value: [{ Id }] }; formato estranho = null", () => {
  assert.equal(idDoContatoCriado({ value: [{ Id: 120554433, Name: "x" }] }), 120554433);
  for (const ruim of [null, undefined, {}, { value: [] }, { value: [{ Id: "1" }] }, { value: [{ Id: 0 }] }, { Id: 5 }]) {
    assert.equal(idDoContatoCriado(ruim), null, JSON.stringify(ruim));
  }
  assert.equal(idPositivo(3.5), null);
});

test("useLeadForm entrega o CadastroConcluido ao onSuccess e liga o e-mail obrigatório só por opção", () => {
  const fonte = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../hooks/useLeadForm.ts"), "utf8");
  assert.match(fonte, /onSuccess\?: \(cadastro: CadastroConcluido\) => void;/);
  assert.match(fonte, /onSuccess\?\.\(\s*montarCadastroConcluido\(/);
  assert.match(fonte, /emailObrigatorio = false,/, "o padrão continua opcional em todo o site");
  assert.match(fonte, /if \(emailObrigatorio && !formData\.email\.trim\(\)\) return MSG_EMAIL_OBRIGATORIO;/);
  // O caminho que vai no cadastro é o que RODOU: o `lucas` que falhou chega como `sdr`.
  assert.match(fonte, /caminhoFeito = novo\.caminho;/);
  assert.match(fonte, /caminhoFeito = 'recadastro';/);
});
