/**
 * GATE DAS 11 PÁGINAS POR ANÚNCIO — `/clube/[peca]` (cap. 36 §4.2).
 *
 * Um template e onze configurações: este teste é o motivo de a arquitetura valer a
 * pena. Ele roda UMA vez e cobre as onze — e cobre a 12ª no dia em que ela entrar.
 * Cada `test` abaixo é uma das travas do plano; violação = não entrega.
 *
 * Runner: `node --test` nativo (Node ≥ 22.6 lê `.ts` sem build). Rodar: `npm test`.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import * as conteudo from "./clube-pecas.ts";
import * as portas from "../lib/tracking/portas-clube.ts";
import * as numeros from "../lib/numeros-oficiais.ts";

const { CONTEUDO_CLUBE, pecaDoClube, configDaPaginaClube } = conteudo as typeof import("./clube-pecas");
const { PORTAS_CLUBE, SLUGS_CLUBE } = portas as typeof import("../lib/tracking/portas-clube");
const { NUMEROS_OFICIAIS } = numeros as typeof import("../lib/numeros-oficiais");

const RAIZ_SRC = fileURLToPath(new URL("../", import.meta.url));
const ler = (rel: string) => readFileSync(join(RAIZ_SRC, rel), "utf8");

/** Os onze destinos do cap. 36 §1.4 e §2.2. A precificação NÃO está aqui (§4.4). */
const ESPERADOS = [
  "plano-com-regra",
  "cobranca-automatica",
  "mes-que-comeca-pago",
  "retentativa",
  "parceiro-astro",
  "app-proprio",
  "sem-caderno",
  "um-sistema-so",
  "bloqueio-na-agenda",
  "parceiro-seletto",
  "parceiro-guapo",
];

/** Todo texto que chega à tela de cada página, já com os números resolvidos. */
function textosVisiveis(slug: (typeof SLUGS_CLUBE)[number]): string[] {
  const p = pecaDoClube(slug);
  const c = CONTEUDO_CLUBE[slug];
  return [
    p.titulo, p.apoio, p.botaoPrincipal, c.anuncio.kicker ?? "", p.exemploTitulo, p.exemploTexto, p.faqPergunta, p.faqResposta,
    ...c.passos, ...c.antesDepois.flatMap((par) => [par.hoje, par.com]),
  ];
}

/** Texto CRU da configuração (antes do token virar número). */
function textosCrus(slug: (typeof SLUGS_CLUBE)[number]): string[] {
  const c = CONTEUDO_CLUBE[slug];
  return [c.conceito, c.titulo, c.apoio, c.botaoPrincipal ?? "", c.anuncio.kicker ?? "", c.anuncio.cta ?? "", c.prova.titulo, c.prova.texto, c.faq.pergunta, c.faq.resposta];
}

const normalizar = (s: string) =>
  s.normalize("NFC").toLowerCase().replace(/[“”«»"]/g, "").replace(/\s+/g, " ").replace(/[.?!\s]+$/, "").trim();

test("são exatamente as 11 páginas do cap. 36, com slug kebab-case", () => {
  assert.deepEqual([...SLUGS_CLUBE].sort(), [...ESPERADOS].sort());
  assert.deepEqual(Object.keys(CONTEUDO_CLUBE).sort(), [...ESPERADOS].sort());
  for (const slug of SLUGS_CLUBE) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, slug);
});

test("a peça de precificação NÃO ganha página (vai para /tabela-precificacao-clube-gated)", () => {
  for (const slug of SLUGS_CLUBE) assert.doesNotMatch(slug, /precific|tabela|preco/, slug);
  for (const slug of SLUGS_CLUBE) {
    assert.doesNotMatch(CONTEUDO_CLUBE[slug].conceito.toLowerCase(), /precifica/, slug);
  }
});

test("MESSAGE MATCH: a primeira dobra repete a frase do anúncio", () => {
  for (const slug of SLUGS_CLUBE) {
    const { titulo, anuncio } = CONTEUDO_CLUBE[slug];
    assert.ok(anuncio.frase.trim().length >= 15, `${slug}: frase do anúncio curta demais para casar`);
    assert.ok(
      normalizar(titulo).includes(normalizar(anuncio.frase)),
      `${slug}: o título não repete a frase do anúncio\n  título: ${titulo}\n  frase:  ${anuncio.frase}`,
    );
  }
});

test("PORTA declarada por página e coerente com o conjunto que aponta para ela", () => {
  for (const slug of SLUGS_CLUBE) {
    const { porta, conjunto, porque } = PORTAS_CLUBE[slug];
    assert.ok(porque.trim().length > 20, `${slug}: porta sem motivo escrito`);
    if (/-P2-/.test(conjunto)) assert.equal(porta, 2, `${slug}: conjunto ${conjunto} exige porta 2`);
    if (/-P3-/.test(conjunto)) assert.equal(porta, 3, `${slug}: conjunto ${conjunto} exige porta 3`);
    // A situação da família (texto de apoio + pré-preenchimento do formulário) segue a porta.
    const esperada = porta === 2 ? "manual" : porta === 3 ? "migracao" : "geral";
    assert.equal(pecaDoClube(slug).situacao, esperada, slug);
    assert.equal(configDaPaginaClube(slug).situacao, esperada, slug);
  }
  // O meio tem as duas portas que o André decidiu atacar — e nenhuma página nasce sem ela.
  assert.equal(PORTAS_CLUBE["sem-caderno"].porta, 2);
  assert.equal(PORTAS_CLUBE["um-sistema-so"].porta, 3);
  assert.equal(PORTAS_CLUBE["bloqueio-na-agenda"].porta, 3);
});

test("NÚMEROS de fonte única: nenhum 1.200 / 51.000 digitado; token resolve para o oficial", () => {
  const literal = /\b1[.\s]?200\b|\b51[.\s]?000\b|\b51\s?mil\b|\b1[,.]2\s?mil\b/i;
  for (const slug of SLUGS_CLUBE) {
    for (const t of textosCrus(slug)) assert.doesNotMatch(t, literal, `${slug}: número digitado — use {barbearias}/{assinantes}`);
    for (const t of textosVisiveis(slug)) assert.doesNotMatch(t, /\{[a-z]+\}/, `${slug}: token não resolvido`);
  }
  assert.ok(
    pecaDoClube("cobranca-automatica").exemploTexto.includes(NUMEROS_OFICIAIS.barbearias.texto),
    "o token {barbearias} tem que sair como o texto oficial",
  );
  assert.throws(() => numeros.comNumerosOficiais("{assinates}"), /desconhecido/);
});

test("PREÇO: nenhuma página traz valor; a única nota é «A partir de R$299» da família", () => {
  for (const slug of SLUGS_CLUBE) {
    for (const t of textosVisiveis(slug)) assert.doesNotMatch(t, /R\$|reais|\bgrátis\b|desconto/i, slug);
  }
  const copyDaFamilia = ler("app/projeto-do-clube/_components/pc-copy.ts");
  const nota = copyDaFamilia.match(/notaPreco:\s*"([^"]+)"/)?.[1] ?? "";
  assert.match(nota, /^A partir de R\$299\./, "a nota de preço do herói mudou");
  assert.deepEqual(nota.match(/R\$\s?\d+/g), ["R$299"], "a nota de preço cita outro valor");
});

test("ZERO nome de cliente, parceiro ou concorrente no texto das páginas", () => {
  const nomes =
    // Com limite de palavra: «cadastro» contém «astro» e não pode reprovar a página.
    /\b(astro|du|seletto|select|guapo|rafael|jorge|santiago|mileno|rapha|bagulho|david|trinks|appbarber|booksy|frizzar|cash\s?barber|striva|avec|barberpro|inbarber|agendabarber|simples agenda)\b/i;
  for (const slug of SLUGS_CLUBE) {
    for (const t of textosVisiveis(slug)) assert.doesNotMatch(t, nomes, `${slug}: ${t}`);
  }
});

test("só afirmação liberada: sem promessa de resultado, sem prazo/tentativas da retentativa", () => {
  const proibido =
    // «100% automática» é a exceção: decisão do André, 23/Set/26 («não precisa trocar, vamos
    // manter assim»), igual às artes t2 e m1. Qualquer outro «100%» continua barrado.
    /100\s?%(?! (de forma )?automática)|zero inadimpl|nunca mais|garantid|sem risco|tentativas|\d+\s?(vezes|dias|horas)|dobr(a|ar)|triplic|ilimitad/i;
  for (const slug of SLUGS_CLUBE) {
    for (const t of textosVisiveis(slug)) assert.doesNotMatch(t, proibido, `${slug}: ${t}`);
  }
});

test("PT-BR com acentuação completa (as palavras que mais escapam)", () => {
  const semAcento =
    /\b(nao|voce|voces|ja|cobranca|cobrancas|tambem|entao|sao|mes|ate|ninguem|comissao|previsao|adesao|transparencia|numero|unica|sera)\b/i;
  for (const slug of SLUGS_CLUBE) {
    for (const t of textosVisiveis(slug)) {
      const m = t.match(semAcento);
      assert.equal(m, null, `${slug}: «${m?.[0]}» sem acento em: ${t}`);
    }
  }
});

test("NOINDEX na casca, sem sobrescrita nas páginas; slug fora da lista = 404 (nos três braços do A/B)", () => {
  for (const rota of ["clube/[peca]", "clube-longa/[peca]", "clube-cena/[peca]"]) {
    const casca = ler(`app/${rota}/layout.tsx`);
    assert.match(casca, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false/, rota);
    const pagina = ler(`app/${rota}/page.tsx`);
    assert.doesNotMatch(pagina, /robots\s*:/, `${rota}: a página não pode redeclarar robots`);
    assert.match(pagina, /export const dynamicParams = false;/, rota);
  }
  // E nenhuma delas entra no sitemap.
  assert.doesNotMatch(ler("app/sitemap.ts"), /["'`/]clube\//);
});

test("originId NUNCA hardcoded: a origem do Ploomes é do useUtmParams, no formulário", () => {
  for (const rel of ["app/clube/[peca]/page.tsx", "app/clube-longa/[peca]/page.tsx", "app/clube-cena/[peca]/page.tsx", "app/clube/_clube/ClubePecaPagina.tsx", "app/clube/_clube/Ilhas.tsx", "content/clube-pecas.ts", "lib/tracking/portas-clube.ts"]) {
    const codigo = ler(rel);
    assert.doesNotMatch(codigo, /originId\s*[:=]|OriginId|[?&]origin=|\b4021\d{4}\b|\b12000\d{4}\b/, rel);
  }
  // E a página usa o formulário da família, que resolve a origem pelo UTM.
  assert.match(ler("app/projeto-do-clube/_components/PcFormulario.tsx"), /originId:\s*utm\.originId\s*\?\?/);
});

test("rota, source e id de cada página saem do slug (rastreio automático)", () => {
  for (const slug of SLUGS_CLUBE) {
    const cfg = configDaPaginaClube(slug);
    assert.equal(cfg.rota, `/clube/${slug}`);
    assert.equal(cfg.peca.id, `clube/${slug}`);
    assert.match(cfg.source, /^lp_clube_[a-z0-9_]+$/);
  }
  assert.ok(existsSync(join(RAIZ_SRC, "app/clube/[peca]/page.tsx")));
});

test("TELA do herói: toda tela declarada existe no registro, está `real` e tem arquivo", () => {
  const registro = ler("app/projeto-do-clube/_components/pc-artefatos.ts");
  for (const slug of SLUGS_CLUBE) {
    const tela = CONTEUDO_CLUBE[slug].tela;
    if (!tela) continue;
    const bloco = registro.match(new RegExp(`"${tela}":\\s*\\{([\\s\\S]*?)\\n  \\}`))?.[1];
    assert.ok(bloco, `${slug}: tela «${tela}» não está em pc-artefatos.ts`);
    assert.match(bloco, /status:\s*"real"/, `${slug}: tela «${tela}» ainda é placeholder — não aparece em produção`);
    const arquivo = bloco.match(/arquivoFinal:\s*"([^"]+)"/)?.[1] ?? "";
    assert.ok(existsSync(join(RAIZ_SRC, "..", "public", arquivo)), `${slug}: arquivo ausente ${arquivo}`);
    assert.equal(configDaPaginaClube(slug).artefatoHeroi, tela);
  }
});

test("ESTÁTICOS: selo e botão do herói são o kicker e o CTA literais da arte", () => {
  for (const slug of SLUGS_CLUBE) {
    const { anuncio } = CONTEUDO_CLUBE[slug];
    const cfg = configDaPaginaClube(slug);
    if (PORTAS_CLUBE[slug].formato === "estatico") {
      assert.ok(anuncio.kicker && anuncio.cta, `${slug}: estático sem kicker/CTA da arte`);
      assert.equal(cfg.identificacao, anuncio.kicker, slug);
      assert.equal(cfg.peca.botaoPrincipal, anuncio.cta, slug);
      // Selo e botão também passam pelas travas de texto (acento, nomes, promessa).
      assert.doesNotMatch(`${anuncio.kicker} ${anuncio.cta}`, /\b(nao|voce|cobranca|ja)\b|garantid/i, slug);
    } else {
      assert.ok(cfg.peca.botaoPrincipal.trim().length > 5, `${slug}: vídeo sem botão principal`);
    }
  }
});

test("DESTAQUE dourado: todo trecho existe, literal, no título (senão some em silêncio)", () => {
  for (const slug of SLUGS_CLUBE) {
    for (const trecho of CONTEUDO_CLUBE[slug].anuncio.destaque ?? []) {
      assert.ok(pecaDoClube(slug).titulo.includes(trecho), `${slug}: «${trecho}» não está no título`);
    }
  }
});

test("PROVA: toda página tem tela animada existente, 3 passos, 3 pares hoje × com e atmosfera", () => {
  const telas = ler("app/clube/_clube/telas.tsx");
  for (const slug of SLUGS_CLUBE) {
    const c = CONTEUDO_CLUBE[slug];
    assert.ok(new RegExp(`["\\s]${c.telaProva}"?:\\s*\\(\\)\\s*=>`).test(telas), `${slug}: tela «${c.telaProva}» não existe em telas.tsx`);
    assert.equal(c.passos.length, 3, slug);
    assert.equal(c.antesDepois.length, 3, slug);
    assert.match(c.atmosfera, /^#[0-9a-f]{6}$/i, slug);
  }
});

test("A/B de página (ciclo 1): sorteio curta × longa por cookie; cena fora do sorteio; rewrite, nunca redirect", async () => {
  const ab = (await import("../lib/ab-clube.ts")) as typeof import("../lib/ab-clube");
  // A regra fina do módulo está em `lib/ab-clube.test.ts`; aqui, o contrato que as páginas usam.
  assert.deepEqual([...ab.BRACOS_NO_SORTEIO], ["curta", "longa"]);
  assert.equal(ab.rotaDoBraco("retentativa", "longa"), "/clube-longa/retentativa");
  assert.equal(ab.rotaDoBraco("parceiro-guapo", "longa"), "/clube-longa/parceiro-guapo", "todas as 11 têm braço longo");
  assert.equal(ab.rotaDoBraco("retentativa", "curta"), null);
  // A página curta serve `curta`; a longa renderiza a meta `longa`; a cena continua existindo.
  assert.match(ler("app/clube/[peca]/page.tsx"), /variante="curta"/);
  assert.match(ler("app/clube-longa/[peca]/page.tsx"), /content="longa"/);
  assert.match(ler("app/clube-longa/[peca]/page.tsx"), /<ClubePage \/>/, "o braço longo É a página longa /clube");
  assert.match(ler("app/clube-cena/[peca]/page.tsx"), /variante="cena"/);
  assert.match(ler("app/clube/_clube/ClubePecaPagina.tsx"), /name=\{META_VARIANTE\} content=\{variante\}/);
  for (const slug of ab.SLUGS_COM_CENA) {
    assert.ok(SLUGS_CLUBE.includes(slug), slug);
    assert.equal(PORTAS_CLUBE[slug].formato, "estatico", `${slug}: só estático tem a foto da arte`);
    for (const f of ["faixa.avif", "faixa.webp", "retrato.avif", "retrato.webp"]) {
      assert.ok(existsSync(join(RAIZ_SRC, "..", "public", "images", "clube", "cena", `${slug}-${f}`)), `${slug}-${f}`);
    }
  }
  // O middleware usa a regra pura e faz REWRITE, nunca redirect (a URL é o predicado da Meta).
  const mw = ler("middleware.ts");
  assert.match(mw, /NextResponse\.rewrite/);
  assert.doesNotMatch(mw, /NextResponse\.redirect/);
  assert.match(mw, /matcher:\s*"\/clube\/:peca"/);
  assert.match(mw, /url\.pathname = destino/, "o rewrite troca só o pathname: a query inteira segue");
  assert.doesNotMatch(mw, /url\.search\s*=|searchParams\.(set|delete)/, "o middleware não mexe na query");
});
