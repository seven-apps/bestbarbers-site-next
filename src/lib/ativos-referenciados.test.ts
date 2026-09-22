/**
 * GATE DE ATIVOS — toda imagem que o código referencia precisa (a) existir no disco e
 * (b) estar rastreada pelo git.
 *
 * POR QUE ESTE TESTE EXISTE (19/Set/2026)
 *
 * Numa mesma tarde, as duas metades deste gate quebraram de verdade:
 *
 * 1. FALTAVA NO DISCO. Frentes trocaram artes contaminadas por nomes de arquivo que ninguém
 *    tinha produzido ainda, com um comentário em caixa alta avisando. O comentário ajuda quem
 *    lê o código e não ajuda quem abre a página: duas seções da home ficaram renderizando
 *    imagem quebrada. Trocar arte errada por arte inexistente não é uma troca.
 *
 * 2. FALTAVA NO GIT. As quatro artes substitutas foram produzidas e o código passou a apontar
 *    para elas, mas os arquivos ficaram `untracked`. Um `git commit -a` — que pega só o que
 *    está modificado — levaria o código sem as imagens, e a home e a /clube subiriam com o
 *    herói e as notificações quebrados. A /clube é o destino do tráfego pago.
 *
 * Nenhuma das duas falhas aparece no `tsc`, em teste de componente ou em revisão de diff:
 * o código está correto nos dois casos. Só um gate que olha o disco e o índice do git pega.
 *
 * O que fazer quando este teste falhar:
 *  - "não existe no disco": produza a arte ou reverta a referência. Não suba assim.
 *  - "não está no git": `git add` o caminho apontado. Binário de produto entra no repositório
 *    do site normalmente — a regra de "binário nunca no git" é do repositório do OS, não deste.
 */

import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";

const RAIZ = resolve(import.meta.dirname, "../..");
const SRC = join(RAIZ, "src");
const PUBLIC = join(RAIZ, "public");

/** Referência a ativo público: "/images/x.png", "/arquivos/y.pdf" etc. */
const REFERENCIA = /["'`](\/(?:images|assets|arquivos|videos|fonts)\/[^"'`\s)]+\.[a-z0-9]{2,5})["'`]/gi;

/**
 * `src/bestbarbers.webflow/` é a exportação legada do Webflow. O Next não a serve (não há
 * referência a ela no next.config nem em src/app/), e ela aponta para dezenas de ativos
 * antigos. Fica fora do gate de propósito: é código morto arquivado, não superfície pública.
 */
const IGNORAR = ["bestbarbers.webflow", "node_modules", ".next"];

function arquivosDeCodigo(dir: string, saida: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    if (IGNORAR.some((i) => entrada === i)) continue;
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) arquivosDeCodigo(caminho, saida);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entrada)) saida.push(caminho);
  }
  return saida;
}

/**
 * Caminhos rastreados pelo git sob public/, em um único processo.
 *
 * Duas armadilhas de nome de arquivo, as duas medidas aqui em 19/Set/26 — e as duas produzem
 * FALSO POSITIVO, que é o pior defeito possível num gate (oito arquivos corretos acusados, e
 * ninguém volta a confiar):
 *
 *  - `git ls-files` escapa caracteres não-ASCII em octal e põe o nome entre aspas
 *    (`"public/images/gest\303\243o-de-comiss\303\265es.svg"`). Por isso `-z`, que emite os
 *    caminhos crus separados por NUL, sem quoting nenhum.
 *  - o macOS grava nomes em NFD (o "ã" vira "a" + til combinante) e o git costuma guardar NFC.
 *    Os dois são o mesmo nome para o usuário e bytes diferentes para o `Set`. Por isso o
 *    `.normalize("NFC")` nos dois lados da comparação.
 */
function rastreadosNoGit(): Set<string> {
  const saida = execFileSync("git", ["ls-files", "-z", "--", "public"], {
    cwd: RAIZ,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  return new Set(saida.split("\0").filter(Boolean).map((c) => c.normalize("NFC")));
}

function referencias(): Map<string, string[]> {
  const mapa = new Map<string, string[]>();
  for (const arquivo of arquivosDeCodigo(SRC)) {
    const conteudo = readFileSync(arquivo, "utf8");
    for (const achado of conteudo.matchAll(REFERENCIA)) {
      const ativo = achado[1];
      const relativo = arquivo.slice(RAIZ.length + 1);
      const lista = mapa.get(ativo) ?? [];
      if (!lista.includes(relativo)) lista.push(relativo);
      mapa.set(ativo, lista);
    }
  }
  return mapa;
}

test("todo ativo referenciado pelo código existe no disco", () => {
  const faltando: string[] = [];
  for (const [ativo, onde] of referencias()) {
    if (!existsSync(join(PUBLIC, ativo))) faltando.push(`  ${ativo}\n    referenciado em: ${onde.join(", ")}`);
  }
  assert.equal(
    faltando.length,
    0,
    `\n\n${faltando.length} ativo(s) referenciados pelo código NÃO existem em public/:\n\n${faltando.join("\n")}\n\n` +
      `A página vai renderizar imagem quebrada. Produza o arquivo ou reverta a referência — não suba assim.\n`,
  );
});

test("todo ativo referenciado pelo código está rastreado no git", () => {
  const rastreados = rastreadosNoGit();
  const soltos: string[] = [];
  for (const [ativo, onde] of referencias()) {
    const caminhoRepo = `public${ativo}`.normalize("NFC");
    if (existsSync(join(PUBLIC, ativo)) && !rastreados.has(caminhoRepo)) {
      soltos.push(`  ${caminhoRepo}\n    referenciado em: ${onde.join(", ")}`);
    }
  }
  assert.equal(
    soltos.length,
    0,
    `\n\n${soltos.length} ativo(s) existem no disco mas NÃO estão no git:\n\n${soltos.join("\n")}\n\n` +
      `Um commit de arquivos modificados levaria o código sem as imagens, e a página subiria quebrada.\n` +
      `Resolva com: git add <caminho>\n`,
  );
});
