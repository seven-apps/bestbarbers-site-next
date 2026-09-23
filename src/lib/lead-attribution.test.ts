/**
 * Guarda do `bb_ad_id`: com `ad_id={{ad.id}}` resolvido na URL, o campo recebe o id
 * NUMÉRICO (chave 1:1 com a Meta); sem ele, cai no nome (leads legados / links manuais).
 * Runner: `node --test` (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as modulo from "./lead-attribution.ts";
const { buildLeadAttribution } = modulo as typeof import("./lead-attribution");

// `window` falso só com o que o builder lê (search + pathname) — tipado como parcial
// em vez de `any`, para o lint não precisar de exceção num arquivo de teste.
type JanelaDeTeste = { window?: { location: { search: string; pathname: string } } };

const comUrl = (search: string, utm: Record<string, string> = { utm_content: "VIDEO-X-MEIO" }) => {
  const global = globalThis as unknown as JanelaDeTeste;
  global.window = { location: { search, pathname: "/clube" } };
  const r = buildLeadAttribution({
    utmParams: utm as unknown as Parameters<typeof buildLeadAttribution>[0]["utmParams"],
    originId: 1,
    originDesc: null,
  });
  delete global.window;
  return r;
};

test("bb_ad_id = id numérico quando ad_id vem resolvido", () => {
  const r = comUrl("?fase=MEIO&campanha=C&publico=P&ad=VIDEO-X-MEIO&creative=VIDEO-X-MEIO&ad_id=120252994485710522");
  assert.equal(r.fields.bb_ad_id, "120252994485710522");
  assert.equal(r.fields.bb_utm_content, "VIDEO-X-MEIO");
  assert.match(r.originDesc ?? "", /\| VIDEO-X-MEIO \| VIDEO-X-MEIO \|/); // descrição segue com o NOME
});

test("bb_ad_id = nome quando ad_id falta ou vem como placeholder", () => {
  assert.equal(comUrl("?fase=MEIO&ad=VIDEO-X-MEIO").fields.bb_ad_id, "VIDEO-X-MEIO");
  assert.equal(comUrl("?fase=MEIO&ad=VIDEO-X-MEIO&ad_id={{ad.id}}").fields.bb_ad_id, "VIDEO-X-MEIO");
});

test("macro da Meta não substituída vira ausência: campos vazios, descrição com n/d, fase preservada", () => {
  const r = comUrl(
    "?fase=LAB-AGO26&campanha={{campaign.name}}&publico={{adset.name}}&ad={{ad.name}}&creative={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&ad_id={{ad.id}}",
    { utm_content: "{{ad.name}}", utm_campaign: "{{campaign.name}}", utm_source: "meta" },
  );
  assert.equal(r.fields.bb_wave, "LAB-AGO26");
  assert.equal(r.fields.bb_utm_source, "meta");
  for (const k of ["bb_campaign_id", "bb_campaign_name", "bb_adset_id", "bb_ad_id", "bb_audience_type", "bb_utm_content", "bb_utm_campaign"] as const)
    assert.equal(r.fields[k], undefined, k);
  assert.equal(r.originDesc, "clube | LAB-AGO26 | n/d | n/d | n/d | n/d | n/d | n/d");
  assert.doesNotMatch(r.originDesc ?? "", /\{\{/);
});

// ————— CONJUNTO ATÉ O CARD: o fallback de `publicoSessao` (A/B de set/26) —————

test("volta pela segunda vez (URL limpa): o conjunto da sessão preenche bb_adset_id", () => {
  // Cenário real: clicou no ad, caiu na /clube com url_tags completo, navegou para dentro
  // do site e só então preencheu o formulário. Até 19/Set/26 esse lead chegava ao Ploomes
  // sem conjunto nenhum, e lead sem conjunto não entra na leitura do A/B pelo CRM.
  const r = comUrl("", { publicoSessao: "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE" });
  assert.equal(r.fields.bb_adset_id, "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE");
  assert.equal(r.fields.bb_audience_type, "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE");
});

test("o conjunto herdado da sessão NÃO muda o formato da descrição", () => {
  // `has8Segs` continua decidido só pela URL viva: sem sinal Wave 4 na URL, a descrição
  // segue no ramo legacy. O fallback é de ESCRITA de campo, não de formato — os leitores
  // de tráfego que parseiam split('|') não podem receber um formato novo por causa dele.
  const r = comUrl("", { publicoSessao: "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE" });
  assert.equal(r.originDesc, null);
});

test("URL viva GANHA do conjunto da sessão (last-touch decide o conjunto do card)", () => {
  const r = comUrl("?fase=MEIO&publico=AMPLO-P1-M2-ADVANTAGE-SINAL-LEAD", {
    publicoSessao: "AMPLO-P1-M2-ADVANTAGE-SINAL-EQUIPE",
  });
  assert.equal(r.fields.bb_adset_id, "AMPLO-P1-M2-ADVANTAGE-SINAL-LEAD");
  assert.match(r.originDesc ?? "", /\| AMPLO-P1-M2-ADVANTAGE-SINAL-LEAD \|/);
});

test("macro não substituída no publicoSessao vira ausência, como na URL", () => {
  assert.equal(comUrl("", { publicoSessao: "{{adset.name}}" }).fields.bb_adset_id, undefined);
});

/* ───────────────────────────────────────────────────────────────────────────
   bb_lp_version — a chave que separa as entradas no CRM (19/Set/26).
   ─────────────────────────────────────────────────────────────────────────── */

/** Mesmo builder, com o pathname escolhido pelo teste. */
const comRota = (pathname: string, search = "") => {
  const global = globalThis as unknown as JanelaDeTeste;
  global.window = { location: { search, pathname } };
  const r = buildLeadAttribution({
    utmParams: {} as unknown as Parameters<typeof buildLeadAttribution>[0]["utmParams"],
    originId: 1,
    originDesc: null,
  });
  delete global.window;
  return r;
};

test("projeto-do-clube: cada entrada grava o SLUG COMPLETO, não o primeiro segmento", () => {
  assert.equal(comRota("/projeto-do-clube").fields.bb_lp_version, "projeto-do-clube");
  assert.equal(
    comRota("/projeto-do-clube/clube-manual").fields.bb_lp_version,
    "projeto-do-clube-clube-manual",
  );
  assert.equal(
    comRota("/projeto-do-clube/migracao").fields.bb_lp_version,
    "projeto-do-clube-migracao",
  );
  assert.equal(
    comRota("/projeto-do-clube/abertura").fields.bb_lp_version,
    "projeto-do-clube-abertura",
  );
  // O controle é o braço B: se ele colapsasse na entrada geral, o teste não existiria.
  assert.equal(
    comRota("/projeto-do-clube/controle").fields.bb_lp_version,
    "projeto-do-clube-controle",
  );
});

test("a exceção NÃO vaza: rota multi-segmento de fora da família segue no 1º segmento", () => {
  // Série histórica destas rotas não pode mudar de nome sem aviso.
  assert.equal(comRota("/blog/precificar-clube-assinatura-barbearia").fields.bb_lp_version, "blog");
  assert.equal(comRota("/sistema-para-barbearia/belo-horizonte").fields.bb_lp_version, "sistema-para-barbearia");
  assert.equal(comRota("/dezembro-lotado/materiais").fields.bb_lp_version, "dezembro-lotado");
  assert.equal(comRota("/conteudo/algum-post").fields.bb_lp_version, "conteudo");
  // E as duas regras antigas continuam de pé.
  assert.equal(comRota("/v12").fields.bb_lp_version, "V12");
  assert.equal(comRota("/").fields.bb_lp_version, "home");
  assert.equal(comRota("/cadeira-cheia").fields.bb_lp_version, "cadeira-cheia");
});

// ————— /clube/[peca]: as 11 páginas por anúncio (cap. 36 §4, 23/Set/26) —————

test("/clube/<peca> grava o slug no bb_lp_version; a /clube sozinha segue 'clube'", () => {
  assert.equal(comRota("/clube/sem-caderno").fields.bb_lp_version, "clube-sem-caderno");
  assert.equal(comRota("/clube/retentativa/").fields.bb_lp_version, "clube-retentativa");
  // Série histórica da /clube não muda de nome.
  assert.equal(comRota("/clube").fields.bb_lp_version, "clube");
  assert.equal(comRota("/clube/").fields.bb_lp_version, "clube");
  // Rota irmã de nome parecido não pega a exceção.
  assert.equal(comRota("/clube-de-assinaturas").fields.bb_lp_version, "clube-de-assinaturas");
});

test("/clube/<peca>: campanha, conjunto e anúncio da URL chegam ao card", () => {
  const r = comRota(
    "/clube/bloqueio-na-agenda",
    "?fase=MEIO-SET26&campanha=BB-MEIO-CLUBE-SET26&publico=AMPLO-P3-M4-MIGRACAO" +
      "&ad=ESTATICO-P3-M4-BLOQUEIO-NA-AGENDA-MEIO&creative=ESTATICO-P3-M4-BLOQUEIO-NA-AGENDA-MEIO" +
      "&campaign_id=120250000000000001&adset_id=120250000000000002&ad_id=120250000000000003",
  );
  assert.equal(r.fields.bb_campaign_name, "BB-MEIO-CLUBE-SET26");
  assert.equal(r.fields.bb_campaign_id, "120250000000000001");
  assert.equal(r.fields.bb_adset_id, "120250000000000002");
  assert.equal(r.fields.bb_ad_id, "120250000000000003");
  assert.equal(r.fields.bb_lp_version, "clube-bloqueio-na-agenda");
  // A Descrição da Campanha (8 segmentos) abre pela página e carrega conjunto e anúncio.
  assert.equal(
    r.originDesc,
    "clube-bloqueio-na-agenda | MEIO-SET26 | BB-MEIO-CLUBE-SET26 | AMPLO-P3-M4-MIGRACAO | " +
      "ESTATICO-P3-M4-BLOQUEIO-NA-AGENDA-MEIO | ESTATICO-P3-M4-BLOQUEIO-NA-AGENDA-MEIO | n/d | AMPLO-P3-M4-MIGRACAO",
  );
});

test("A/B do herói: o braço `cena` vai no bb_lp_version (lido da <meta> que a página renderiza)", () => {
  const g = globalThis as unknown as { document?: { querySelector: (q: string) => { getAttribute: () => string } | null } };
  g.document = { querySelector: () => ({ getAttribute: () => "cena" }) };
  try {
    assert.equal(comRota("/clube/retentativa").fields.bb_lp_version, "clube-retentativa-cena");
    // Fora da família /clube/<slug> a meta não muda nada.
    assert.equal(comRota("/cadeira-cheia").fields.bb_lp_version, "cadeira-cheia");
  } finally {
    delete g.document;
  }
  assert.equal(comRota("/clube/retentativa").fields.bb_lp_version, "clube-retentativa", "sem meta = braço base");
});
