/**
 * /quero dos stories (26/Nov/26): a lista fechada de temas, o rewrite que a repete e a ATRIBUIÇÃO do link inteiro,
 * da URL ao payload do card (origem, Descrição da Campanha e campos bb_*).
 *
 * O link dos stories: /quero?t=<tema>&origin=120004089&utm_source=stories&utm_medium=organic
 *   &utm_campaign=stories-nov26&utm_content=<bloco>
 * e o Instagram pode acrescentar `&utm_source=ig&fbclid=…` no fim. Os três pontos que este arquivo trava:
 *   1. `utm_campaign` e `utm_content` chegam ao card (bb_utm_campaign, bb_utm_content); bb_campaign_name fica vazio;
 *   2. `utm_source=stories` não vira "ads" (Tráfego Pago, 40210173);
 *   3. com o `ig` e o `fbclid` acrescentados, o `origin=120004089` explícito continua vencendo.
 *
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as moduloQuero from "./quero-stories.ts";
import * as moduloAtribuicao from "./lead-attribution.ts";
import * as moduloUtm from "../hooks/useUtmParams.ts";
const { CHAVES_TEMA_QUERO, ORIGEM_QUERO, TEMAS_QUERO, descricaoDoQuero, temaDoParametro } =
  moduloQuero as typeof import("./quero-stories");
const { buildLeadAttribution } = moduloAtribuicao as typeof import("./lead-attribution");
const { resolverOrigem, utmDaBusca } = moduloUtm as typeof import("../hooks/useUtmParams");

type JanelaDeTeste = { window?: { location: { search: string; pathname: string } } };

const TRAFEGO_PAGO = 40210173;
/** O fallback global do modal (`SITE_ORIGIN_ID` em src/components/sections/LeadFormModal.tsx). */
const SITE_ORIGIN_ID = 40210426;

const LINK_IA =
  "?t=ia&origin=120004089&utm_source=stories&utm_medium=organic&utm_campaign=stories-nov26&utm_content=d1-19h-ia-a";

/**
 * O caminho inteiro do envio, na ordem do código: `getUtmParams` (utmDaBusca) → `getOriginMapping` (resolverOrigem)
 * → a prioridade do modal (`utmMapping.originId ?? originId ?? SITE_ORIGIN_ID` e `originDesc || utmMapping.originDesc`,
 * LeadFormModal.tsx, no `useLeadForm`) → `buildLeadAttribution` (o que vai ao card).
 */
function envioDaQuero(search: string, tema = temaDoParametro(new URLSearchParams(search).get("t"))) {
  const local = { search, pathname: "/quero" };
  const utm = utmDaBusca(search);
  const mapa = resolverOrigem(utm, local);
  const global = globalThis as unknown as JanelaDeTeste;
  global.window = { location: local };
  try {
    const atribuicao = buildLeadAttribution({
      utmParams: utm,
      originId: mapa.originId ?? ORIGEM_QUERO ?? SITE_ORIGIN_ID,
      originDesc: descricaoDoQuero(tema) || mapa.originDesc || "[Site]Modal",
    });
    return { utm, mapa, atribuicao };
  } finally {
    delete global.window;
  }
}

// ————— Temas —————

test("tema: lista fechada; sem `t` ou fora dela vale `app`", () => {
  for (const t of ["app", "ia", "assinatura", "nota", "tudo"]) assert.equal(temaDoParametro(t), t);
  for (const t of [null, undefined, "", "IA", "xyz", "toString", "__proto__", "ia "]) assert.equal(temaDoParametro(t), "app", String(t));
});

test("tema: título e botão de cada story", () => {
  const texto = (t: keyof typeof TEMAS_QUERO) => {
    const { antes, destaque, depois } = TEMAS_QUERO[t].titulo;
    return `${antes}**${destaque}**${depois} · ${TEMAS_QUERO[t].botao}`;
  };
  assert.equal(texto("app"), "Tenha um **Aplicativo Próprio** com a marca da sua barbearia · Quero o app da minha barbearia");
  assert.equal(texto("ia"), "Tenha a **IA no WhatsApp** atendendo a sua barbearia 24 horas · Quero a IA na minha barbearia");
  assert.equal(texto("assinatura"), "Tenha **assinatura no cartão** caindo todo mês na sua barbearia · Quero assinatura na minha barbearia");
  assert.equal(texto("nota"), "Tenha a **nota fiscal** saindo direto do atendimento · Quero a nota automática");
  assert.equal(texto("tudo"), "Tenha o **BestBarbers** na sua barbearia · Quero conhecer");
});

test("rewrite do next.config.ts lista exatamente os temas de TEMAS_QUERO", () => {
  // Tema novo só aqui e não no rewrite = `/quero?t=novo` serve a página do app, em silêncio.
  const config = readFileSync(new URL("../../next.config.ts", import.meta.url), "utf8");
  const regex = config.match(/key: "t", value: "\(\?<tema>([^)]+)\)"/);
  assert.ok(regex, "rewrite do /quero com o `t` não encontrado no next.config.ts");
  assert.deepEqual(regex[1].split("|").sort(), [...CHAVES_TEMA_QUERO].sort());
  assert.match(config, /\{ source: "\/quero", destination: "\/quero\/app" \}/);
});

// ————— Atribuição —————

test("link dos stories: origem 120004089, UTMs no card e descrição [Stories]<tema> | <bloco>", () => {
  const { mapa, atribuicao } = envioDaQuero(LINK_IA);
  assert.equal(mapa.originId, 120004089);
  assert.equal(atribuicao.originId, 120004089);
  assert.equal(atribuicao.originDesc, "[Stories]ia | d1-19h-ia-a");
  assert.equal(atribuicao.fields.bb_utm_source, "stories");
  assert.equal(atribuicao.fields.bb_utm_medium, "organic");
  assert.equal(atribuicao.fields.bb_utm_campaign, "stories-nov26");
  assert.equal(atribuicao.fields.bb_utm_content, "d1-19h-ia-a");
  assert.equal(atribuicao.fields.bb_lp_version, "quero");
  // Sem `campanha=` (url_tags da Meta) nem cupom, o bb_campaign_name fica VAZIO: a campanha dos stories vive no
  // bb_utm_campaign, e a descrição segue no formato curto (não no de 8 segmentos dos anúncios).
  assert.equal(atribuicao.fields.bb_campaign_name, undefined);
  assert.equal(atribuicao.fields.bb_fbclid, undefined);
});

test("utm_source=stories NÃO vira Tráfego Pago, nem sem o `origin` no link", () => {
  const semOrigem = "?t=ia&utm_source=stories&utm_medium=organic&utm_campaign=stories-nov26&utm_content=d1-19h-ia-a";
  const { mapa, atribuicao } = envioDaQuero(semOrigem);
  assert.equal(mapa.originId, null); // ninguém reivindica → vale a origem padrão da página
  assert.equal(atribuicao.originId, ORIGEM_QUERO);
  assert.notEqual(atribuicao.originId, TRAFEGO_PAGO);
  // E a /quero crua (link sem parâmetro nenhum) também cai na origem padrão.
  assert.equal(envioDaQuero("").atribuicao.originId, ORIGEM_QUERO);
  assert.equal(envioDaQuero("").atribuicao.originDesc, "[Stories]app");
});

test("Instagram acrescenta `&utm_source=ig&fbclid=x`: o `origin` e o primeiro utm_source continuam valendo", () => {
  const { utm, mapa, atribuicao } = envioDaQuero(`${LINK_IA}&utm_source=ig&fbclid=x`);
  assert.equal(utm.utm_source, "stories"); // URLSearchParams.get devolve a PRIMEIRA ocorrência
  assert.equal(utm.fbclidFresh, "x");
  assert.equal(mapa.originId, 120004089);
  assert.equal(atribuicao.originId, 120004089);
  assert.equal(atribuicao.originDesc, "[Stories]ia | d1-19h-ia-a");
  assert.equal(atribuicao.fields.bb_utm_source, "stories");
  assert.equal(atribuicao.fields.bb_utm_content, "d1-19h-ia-a");
  assert.equal(atribuicao.fields.bb_fbclid, "x"); // guardado no card, sem mudar a origem
  // O acréscimo típico do link de bio (`utm_medium=social&utm_content=link_in_bio`) também não pisa no do link.
  const bio = envioDaQuero(`${LINK_IA}&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=x`).atribuicao;
  assert.equal(bio.originId, 120004089);
  assert.equal(bio.fields.bb_utm_medium, "organic");
  assert.equal(bio.fields.bb_utm_content, "d1-19h-ia-a");
});

test("contraprova: SEM o `origin` no link, o `fbclid` do Instagram vira Tráfego Pago (o `origin` é obrigatório no link)", () => {
  // É a regra do site inteiro (fbclid fresco = clique em anúncio) e ela vence a origem padrão da página. Por isso
  // todo link dos stories leva `origin=120004089`: é ele que segura a origem quando o Instagram põe o fbclid.
  const { atribuicao } = envioDaQuero("?t=ia&utm_source=stories&utm_campaign=stories-nov26&utm_content=d1-19h-ia-a&fbclid=x");
  assert.equal(atribuicao.originId, TRAFEGO_PAGO);
});
