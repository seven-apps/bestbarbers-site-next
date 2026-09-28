/**
 * Formulário progressivo do modal — a regra pura de revelação e o sorteio do teste.
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as modulo from "./form-progressivo.ts";

const aqui = dirname(fileURLToPath(import.meta.url));
const ler = (rel: string) => readFileSync(join(aqui, rel), "utf8");

const fp = modulo as typeof import("./form-progressivo");

const vazio: import("./form-progressivo").ValoresForm = {
  ownerName: "",
  whatsapp: "",
  barbershopName: "",
  email: "",
  monthlyRevenue: "",
  currentSystem: "",
  clubStatus: "",
  employeeCount: "",
};
const contato = { ...vazio, ownerName: "João Silva", whatsapp: "(11) 99999-9999", barbershopName: "Barbearia do João" };

test("abre com três campos: nada aparece enquanto falta nome, WhatsApp ou barbearia", () => {
  assert.equal(fp.etapaLiberada(vazio, false), 1);
  assert.equal(fp.etapaLiberada({ ...contato, barbershopName: "" }, true), 1);
  assert.equal(fp.etapaLiberada({ ...contato, ownerName: "" }, true), 1);
  assert.equal(fp.etapaLiberada(contato, false), 1, "telefone incompleto não libera");
  assert.equal(fp.etapaLiberada({ ...contato, barbershopName: "B" }, true), 1, "uma letra não é nome");
  assert.equal(fp.perguntasVisiveis(1), 0);
});

test("os três preenchidos liberam e-mail e faturamento JUNTOS", () => {
  assert.equal(fp.etapaLiberada(contato, true), 2);
  assert.equal(fp.ETAPA_DO_CAMPO.email, 2);
  assert.equal(fp.ETAPA_DO_CAMPO.monthlyRevenue, 2);
  assert.equal(fp.perguntasVisiveis(2), 1);
});

test("o e-mail nunca é portão: vazio ou preenchido, a etapa é a mesma", () => {
  for (const email of ["", "joao@email.com", "torto"]) {
    assert.equal(fp.etapaLiberada({ ...contato, email }, true), 2);
    assert.equal(fp.etapaLiberada({ ...contato, email, monthlyRevenue: "x" }, true), 3);
  }
  assert.notEqual(fp.primeiroPendente({ ...contato, email: "" }, true), "email");
});

test("cada resposta libera a pergunta seguinte, uma de cada vez", () => {
  const a = { ...contato, monthlyRevenue: "De R$ 10 mil a R$ 20 mil" };
  assert.equal(fp.etapaLiberada(a, true), 3);
  const b = { ...a, currentSystem: "Não utilizo nenhum" };
  assert.equal(fp.etapaLiberada(b, true), 4);
  const c = { ...b, clubStatus: "Já tenho o clube, mas gerencio manualmente" };
  assert.equal(fp.etapaLiberada(c, true), 5);
  assert.equal(fp.perguntasVisiveis(5), 4);
});

test("campo que apareceu não some: apagar um anterior não recolhe a tela", () => {
  assert.equal(fp.proximaEtapa(4, { ...contato, ownerName: "" }, true), 4);
  assert.equal(fp.proximaEtapa(2, vazio, false), 2);
  assert.equal(fp.proximaEtapa(1, contato, true), 2);
});

test("preenchimento automático do navegador com tudo de uma vez abre até onde os dados chegam", () => {
  const tudo = { ...contato, monthlyRevenue: "a", currentSystem: "b", clubStatus: "c", employeeCount: "d" };
  assert.equal(fp.proximaEtapa(1, tudo, true), 5);
  assert.equal(fp.primeiroPendente(tudo, true), null);
});

test("o botão leva ao primeiro obrigatório que falta, na ordem da tela", () => {
  assert.equal(fp.primeiroPendente(vazio, false), "ownerName");
  assert.equal(fp.primeiroPendente({ ...vazio, ownerName: "João" }, false), "whatsapp");
  assert.equal(fp.primeiroPendente({ ...contato, barbershopName: "" }, true), "barbershopName");
  assert.equal(fp.primeiroPendente(contato, true), "monthlyRevenue");
  assert.equal(fp.primeiroPendente({ ...contato, monthlyRevenue: "a", currentSystem: "b" }, true), "clubStatus");
});

test("todo campo tem etapa, e a ordem da tela respeita a ordem das etapas", () => {
  const etapas = fp.ORDEM_DOS_CAMPOS.map((c) => fp.ETAPA_DO_CAMPO[c]);
  assert.deepEqual(etapas, [...etapas].sort((a, b) => a - b));
  assert.equal(fp.ORDEM_DOS_CAMPOS.length, Object.keys(fp.ETAPA_DO_CAMPO).length);
});

test("rótulos do André: dono da barbearia por extenso, barbearia antes do e-mail, e-mail sem 'opcional'", () => {
  const campos = fp.CAMPOS_DE_CONTATO_PROGRESSIVO;
  assert.deepEqual(campos.map((c) => c.name), ["ownerName", "whatsapp", "barbershopName", "email"]);
  assert.deepEqual(campos.map((c) => c.label), [
    "Nome do dono da barbearia",
    "WhatsApp do dono da barbearia",
    "Nome da barbearia",
    "Seu e-mail",
  ]);
});

test("sorteio 50/50; cookie válido vence; lixo ressorteia", () => {
  assert.equal(fp.bracoDoForm(undefined, 0), "atual");
  assert.equal(fp.bracoDoForm(undefined, 0.499), "atual");
  assert.equal(fp.bracoDoForm(undefined, 0.5), "progressivo");
  assert.equal(fp.bracoDoForm(undefined, 0.999), "progressivo");
  assert.equal(fp.bracoDoForm(undefined, 1), "progressivo", "sorteio fora da faixa não estoura o índice");
  assert.equal(fp.bracoDoForm("progressivo", 0.1), "progressivo");
  assert.equal(fp.bracoDoForm("atual", 0.9), "atual");
  assert.equal(fp.bracoDoForm("lixo", 0.9), "progressivo");
  assert.equal(fp.bracoFormForcado("progressivo"), "progressivo");
  assert.equal(fp.bracoFormForcado("outro"), undefined);
});

test("cookie lido da string do navegador, sem confundir nome parecido", () => {
  assert.equal(fp.lerCookie("a=1; bb_ab_form=progressivo; b=2", fp.COOKIE_AB_FORM), "progressivo");
  assert.equal(fp.lerCookie("bb_ab_form_x=atual", fp.COOKIE_AB_FORM), undefined);
  assert.equal(fp.lerCookie("", fp.COOKIE_AB_FORM), undefined);
});

test("marcador do card: vai e volta, e iniciais de nome nunca são lidas como braço", () => {
  assert.equal(fp.bracoDoMarcador(`1790000000000-js-${fp.MARCADOR_FORM.progressivo}`), "progressivo");
  assert.equal(fp.bracoDoMarcador(`1790000000000-js-${fp.MARCADOR_FORM.atual}`), "atual");
  // Card anterior ao teste, inclusive de quem tem iniciais "fp" ou "fa".
  assert.equal(fp.bracoDoMarcador("1790000000000-fp"), null);
  assert.equal(fp.bracoDoMarcador("1790000000000-fa"), null);
  assert.equal(fp.bracoDoMarcador("react-set26-123"), null);
  assert.equal(fp.bracoDoMarcador(null), null);
});

test("os dois braços emitem os mesmos três marcos, com nomes que não se repetem", () => {
  const nomes = (["aberto", "contato", "enviado"] as const).flatMap((m) =>
    fp.BRACOS_FORM.map((b) => fp.eventoDoMarco(m, b)),
  );
  assert.equal(new Set(nomes).size, 6);
  assert.deepEqual(nomes, ["FormAbertoCtrl", "FormAbertoProg", "FormContatoCtrl", "FormContatoProg", "FormEnviadoCtrl", "FormEnviadoProg"]);
});

// ── Contratos lidos do CÓDIGO-FONTE (o repositório não tem harness de componente) ──────

test("o marcador entra no id do evento DEPOIS das iniciais e ANTES dos sufixos -q/-q60/-eq", () => {
  const hook = ler("../hooks/useLeadForm.ts");
  assert.match(hook, /const leadEventId = `\$\{Date\.now\(\)\}-\$\{initials\}\$\{marcadorEvento \? `-\$\{marcadorEvento\}` : ''\}`;/);
  // Fora do teste nenhuma página passa o marcador: o id nasce como sempre nasceu.
  assert.match(hook, /marcadorEvento\?: string;/);
});

test("só a página do clube liga o teste; o modal sem braço não esconde nem mede nada", () => {
  const modal = ler("../components/sections/LeadFormModal.tsx");
  assert.match(modal, /const emTeste = bracoTeste === "atual" \|\| bracoTeste === "progressivo";/);
  assert.match(modal, /quantas=\{progressivo \? perguntasVisiveis\(etapa\) : undefined\}/);
  assert.match(modal, /noValidate=\{progressivo\}/);
  assert.match(ler("../components/clube-v2/ClubeV2Page.tsx"), /bracoTeste=\{bracoForm\}/);
  for (const outro of ["../components/HomePage.tsx", "../components/sections/Navbar.tsx", "../components/FeatureCTA.tsx"]) {
    assert.doesNotMatch(ler(outro), /bracoTeste/, `${outro} entrou no teste sem decisão`);
  }
});

test("o braço de controle é o formulário de sempre: rótulos e ordem intocados", () => {
  const modal = ler("../components/sections/LeadFormModal.tsx");
  const i = modal.indexOf("const formFields = [");
  const bloco = modal.slice(i, modal.indexOf("];", i));
  const nomes = [...bloco.matchAll(/name: "(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(nomes, ["ownerName", "whatsapp", "email", "barbershopName"]);
  assert.match(bloco, /label: "Seu e-mail \(opcional, pra gente falar com você depois\)"/);
});
