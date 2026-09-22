/**
 * GATE DE NÚMEROS MORTOS — nenhum número já aposentado, nenhum agregado de uso interno e
 * nenhum número vetado pelo CEO pode voltar a aparecer em `src/`.
 *
 * POR QUE ESTE TESTE EXISTE (19/Set/2026)
 *
 * A régua que decide qual número pode ir ao público NÃO mora neste repositório. Ela mora no
 * repositório do OS, em dois arquivos:
 *
 *   ../bestbarbers-ai/knowledge/dominio/cases-clube.json
 *       — os 82 casos auditáveis, cada um com `ref` (bb#…), `crivel` e `bloqueio`. É a fonte
 *         de qualquer número de caso: assinantes, receita, janela em meses, porte e cidade.
 *
 *   ../bestbarbers-ai/knowledge/marketing/instagram-voz-do-time.md  (§9 "Gates de conteúdo")
 *       — a lista dos números legados PROIBIDOS por nome, os quatro agregados oficiais de
 *         divulgação (1.200+ barbearias · 51.000+ assinantes · R$5M+/mês · 6M+ agendamentos/mês)
 *         e a regra de que retenção, LTV e permanência são internos, nunca peça pública.
 *
 * O site não lê nenhum dos dois. Ele carrega uma CÓPIA dos números, escrita à mão em dezenas
 * de arquivos. Régua num repositório, cópia no outro, e nada ligando os dois: é por isso que,
 * em 19/Set/2026, o MESMO número morto estava vivo em 4 rotas ao mesmo tempo, os agregados de
 * uso interno estavam publicados na `meta description` de 13 artigos do blog, e existiam DOIS
 * arquivos `benchmarks.ts` distintos com os mesmos números internos — um deles numa rota que
 * nenhum mapeamento tinha apontado, e que por isso ninguém tinha revisado.
 *
 * Enquanto o site não consumir a régua de verdade, este teste é a ponte: ele não sabe qual é o
 * número certo, mas sabe cravar quais estão proibidos e não deixa nenhum deles voltar calado.
 *
 * O QUE FAZER QUANDO ESTE TESTE FALHAR
 *
 *  1. NÃO troque o literal por uma variação que engane o gate ("R$ 128" no lugar de "R$128",
 *     "2,8 x" no lugar de "2,8x"). O problema é a AFIRMAÇÃO, não a grafia.
 *  2. Vá aos dois arquivos acima e pegue o número vivo e auditável para o que você quer dizer.
 *     Todo número de caso tem um `bb#ref` — cite a ref num comentário ao lado, como o resto
 *     do repositório já faz.
 *  3. Se o seu uso for legítimo (o mesmo dígito com outro significado — ver a ALLOWLIST logo
 *     abaixo, que tem casos assim), acrescente uma entrada NOVA à allowlist explicando por quê,
 *     com a mesma clareza das que já estão lá. Entrada sem motivo escrito não vale.
 *  4. Nunca apague um literal desta lista para fazer o teste passar. Quem tirar um número da
 *     lista está reabrindo a porta que este gate fecha.
 *
 * Este arquivo é `.test.ts` e, como todo arquivo de teste, fica FORA da própria varredura —
 * senão o gate acusaria a si mesmo, já que precisa escrever os 15 literais para procurá-los.
 */

import { strict as assert } from "node:assert";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import test from "node:test";

const RAIZ = resolve(import.meta.dirname, "../..");
const SRC = join(RAIZ, "src");

/** Por que cada número está proibido — a mensagem que o gate mostra a quem for barrado. */
type Motivo = "número morto" | "agregado interno" | "veto do CEO";

interface Proibido {
  literal: string;
  motivo: Motivo;
  porque: string;
}

const PROIBIDOS: Proibido[] = [
  {
    literal: "1.297",
    motivo: "agregado interno",
    porque:
      "total de barbearias da coleta interna de 16/Jun. `knowledge/marketing/stories-instagram-playbook.md` é explícito: " +
      "o par 47.793 / 1.297 NUNCA vai ao público. O agregado oficial de barbearias é 1.200+.",
  },
  {
    literal: "47.793",
    motivo: "agregado interno",
    porque:
      "total de assinantes da coleta interna de 16/Jun, morto pela coleta de 15/Jul (a mais recente é a canônica). " +
      "Nunca vai ao público. O agregado oficial de assinantes é 51.000+.",
  },
  {
    literal: "47 mil",
    motivo: "agregado interno",
    porque:
      "o mesmo 47.793 arredondado. A régua rejeita por nome '47 mil', '48 mil' e 'quase 48 mil' — arredondar " +
      "um número interno não o torna publicável. O agregado oficial é 51.000+ assinantes.",
  },
  {
    literal: "47,96",
    motivo: "agregado interno",
    porque:
      "percentual de adoção de clube (622/1.297) derivado da coleta velha de 16/Jun. `clube-arsenal.md` marca o " +
      "próprio valor como [VERIFICAR] e manda re-derivar sobre a base viva antes de qualquer uso.",
  },
  {
    literal: "128,14",
    motivo: "número morto",
    porque:
      "da família do 'R$128,37 líquido/no bolso', declarado morto: é receita média por assinante, nunca lucro. " +
      "Apresentar receita por assinante como dinheiro no bolso do dono é a confusão que matou o número.",
  },
  {
    literal: "R$128",
    motivo: "número morto",
    porque:
      "proibido quando usado como A MENSALIDADE do clube — é receita média por assinante, população diferente. " +
      "Continua válido como 'ticket médio / receita média por assinante' (ver ALLOWLIST). Se você está escrevendo " +
      "o preço de um plano, este não é o número.",
  },
  {
    literal: "12,1 meses",
    motivo: "veto do CEO",
    porque:
      "permanência média. Retenção, LTV, permanência e densidade são argumento INTERNO de fechamento e jamais " +
      "entram em peça pública (decisão do CEO de 14/Jul, registrada em `clube-arsenal.md`).",
  },
  {
    literal: "2,8x",
    motivo: "número morto",
    porque:
      "o 'assinante vale 2,8× mais que o avulso' deriva do R$540/ano de avulso, cuja conta real é R$40 × 8–9 " +
      "visitas = R$360. Com a conta certa o múltiplo muda, então o 2,8× não sobrevive à própria aritmética.",
  },
  {
    literal: "2,8×",
    motivo: "número morto",
    porque: "mesma afirmação do '2,8x', escrita com o sinal de multiplicação tipográfico. Mesma proibição.",
  },
  {
    literal: "R$540",
    motivo: "número morto",
    porque:
      "gasto anual do cliente avulso. A conta real é R$40 × 8–9 visitas = R$360; o R$540 vinha de uma premissa " +
      "de frequência que a base não sustenta. Proibido como gasto anual de avulso (ver ALLOWLIST para o mesmo " +
      "dígito com outro significado).",
  },
  {
    literal: "2,1 visitas",
    motivo: "número morto",
    porque:
      "frequência média do assinante, declarada morta em `clube-arsenal.md`. Foi publicada como prova de que o " +
      "clube 'não dá prejuízo' e não se sustenta na base viva.",
  },
  {
    literal: "15.892",
    motivo: "número morto",
    porque:
      "ponto de partida do arco Embu/Pirajussara (R$15.892 → R$31.690). O arco inteiro está morto: é editorial " +
      "não reconciliado. O case-âncora auditável no lugar dele é bb#13285 — barbearia de 4 cadeiras em Araxá/MG, " +
      "de R$9.249 para R$30.447/mês em 19 meses.",
  },
  {
    literal: "31.690",
    motivo: "número morto",
    porque:
      "ponto de chegada do mesmo arco Embu/Pirajussara, morto junto com ele. Use bb#13285 (R$30.447/mês em Araxá/MG).",
  },
  {
    literal: "R$1,95",
    motivo: "número morto",
    porque:
      "'prejuízo de R$1,95 por corte', da leva legada de LPs (família v8 / `data/lp-variants.ts`). Não pertence ao " +
      "conjunto oficial de divulgação e não tem case auditável por trás.",
  },
  {
    literal: "353 assinantes",
    motivo: "número morto",
    porque:
      "contagem de assinantes do arco Embu/Pirajussara, morto junto com o arco. O número de assinantes do " +
      "case-âncora vivo é 277 (bb#13285, barbearia de 4 cadeiras em Araxá/MG).",
  },
];

/**
 * ALLOWLIST — casos legítimos, por arquivo E por literal.
 *
 * É deliberadamente por literal, e não por arquivo: liberar `R$128` num artigo do blog não
 * libera `31.690` no mesmo artigo. Um número morto NOVO num arquivo já listado continua
 * falhando, que é o ponto.
 *
 * Duas famílias de motivo, e elas são bem diferentes:
 *
 *   `familiaNaoServida` — o arquivo é código morto arquivado. A rota não existe: a pasta tem
 *       `_page.tsx` (prefixo `_` = pasta privada do Next, que não vira rota) e nenhum
 *       `page.tsx`. Cada entrada declara a família, e o teste `família legada continua fora do
 *       ar` confere isso no disco. Se alguém reativar a família, a allowlist deixa de valer e
 *       o gate volta a acusar — a dispensa não pode ser esquecida ligada.
 *
 *   `usoLegitimo` — o mesmo dígito com outro significado, verificado contra a régua do OS.
 */
interface Dispensa {
  arquivo: string;
  literais: string[];
  motivo: string;
  /** Família de rota que precisa continuar não-servida para esta dispensa valer. */
  familiaNaoServida?: string;
}

const ALLOWLIST: Dispensa[] = [
  // ─── Código morto arquivado: LPs antigas que o Next não serve ──────────────────────────
  // Verificado em 19/Set/26 com o build de produção no ar: /v5, /v6, /v7, /v8, /v9, /v10 e
  // /v11 devolvem 404. Os números seguem escritos ali porque ninguém apagou as pastas; eles
  // não chegam a nenhum usuário. Apagar essas famílias é a correção de verdade — enquanto
  // isso não acontece, elas ficam dispensadas e vigiadas pelo teste de família não-servida.
  {
    arquivo: "app/v6/layout.tsx",
    literais: ["15.892", "31.690", "353 assinantes"],
    motivo: "metadata da LP v6, família não servida",
    familiaNaoServida: "v6",
  },
  {
    arquivo: "app/v7/_page.tsx",
    literais: ["15.892", "31.690", "353 assinantes"],
    motivo: "LP v7, família não servida",
    familiaNaoServida: "v7",
  },
  {
    arquivo: "app/v7/layout.tsx",
    literais: ["31.690", "353 assinantes"],
    motivo: "metadata da LP v7, família não servida",
    familiaNaoServida: "v7",
  },
  {
    arquivo: "app/v8/_page.tsx",
    literais: ["15.892", "31.690", "R$1,95", "353 assinantes"],
    motivo: "LP v8, família não servida",
    familiaNaoServida: "v8",
  },
  {
    arquivo: "app/v9/_page.tsx",
    literais: ["15.892", "31.690"],
    motivo: "LP v9, família não servida",
    familiaNaoServida: "v9",
  },
  {
    arquivo: "app/v10/_page.tsx",
    literais: ["353 assinantes"],
    motivo: "LP v10, família não servida",
    familiaNaoServida: "v10",
  },
  // Componentes que só existem para as LPs acima. Conferido em 19/Set/26: cada um destes é
  // importado exclusivamente pelo `_page.tsx` da família indicada — nenhuma página servida
  // chega neles. Se um deles for importado por uma página viva, o número morto passa a ser
  // publicado e a dispensa aqui vira um buraco; por isso a família fica declarada e vigiada.
  {
    arquivo: "components/sections/BenefitsGrid.tsx",
    literais: ["31.690", "353 assinantes"],
    motivo: "usado só por app/v5/_page.tsx",
    familiaNaoServida: "v5",
  },
  {
    arquivo: "components/sections/CaseStudy.tsx",
    literais: ["15.892", "31.690", "353 assinantes"],
    motivo: "usado só por app/v5/_page.tsx e app/v9/_page.tsx",
    familiaNaoServida: "v5",
  },
  {
    arquivo: "components/sections/FAQShortSection.tsx",
    literais: ["R$128", "2,8x", "R$540", "2,1 visitas", "31.690", "353 assinantes"],
    motivo: "usado só por app/v5/_page.tsx",
    familiaNaoServida: "v5",
  },
  {
    arquivo: "components/sections/HeroV5.tsx",
    literais: ["R$128", "15.892", "31.690", "353 assinantes"],
    motivo: "usado só por app/v5/_page.tsx",
    familiaNaoServida: "v5",
  },
  {
    arquivo: "components/sections/PainRecognition.tsx",
    literais: ["R$1,95"],
    motivo: "usado só por app/v5/_page.tsx",
    familiaNaoServida: "v5",
  },
  {
    arquivo: "components/sections/SocialProofBar.tsx",
    literais: ["15.892"],
    motivo: "usado só por app/v5/_page.tsx",
    familiaNaoServida: "v5",
  },
  {
    arquivo: "components/sections/Testimonials.tsx",
    literais: ["353 assinantes"],
    motivo: "usado só por app/v5/_page.tsx",
    familiaNaoServida: "v5",
  },
  {
    arquivo: "components/sections/FAQShortV11.tsx",
    literais: ["R$128", "2,8x", "R$540", "2,1 visitas", "31.690", "353 assinantes"],
    motivo: "usado só por app/v11/_page.tsx",
    familiaNaoServida: "v11",
  },
  {
    arquivo: "components/sections/TestimonialsV11.tsx",
    literais: ["353 assinantes"],
    motivo: "usado só por app/v11/_page.tsx",
    familiaNaoServida: "v11",
  },
  {
    arquivo: "data/lp-variants.ts",
    literais: ["R$128", "2,1 visitas", "15.892", "31.690", "R$1,95", "353 assinantes"],
    motivo: "catálogo de variantes da LP v6; lido só por app/v6/_page.tsx e pelos componentes da v6",
    familiaNaoServida: "v6",
  },

  // ─── Mesmo dígito, outro significado ───────────────────────────────────────────────────
  // A régua do OS proíbe `R$128/mês` USADO COMO "A MENSALIDADE" e diz, na mesma linha, por quê:
  // "é receita média por assinante — população diferente". Ou seja: o uso como ticket médio /
  // receita média por assinante é exatamente o uso CORRETO do número, e é esse o uso dos dois
  // artigos abaixo. Conferido frase a frase em 19/Set/26.
  {
    arquivo: "content/blog/precificar-clube-assinatura-barbearia.ts",
    literais: ["R$128"],
    motivo:
      "usa R$128 como ticket médio da base ('o ticket médio de assinatura da base em torno de R$128'), " +
      "que é o uso permitido — nunca como o preço de um plano",
  },
  {
    arquivo: "content/blog/inadimplencia-barbearia-como-cobrar.ts",
    literais: ["R$128"],
    motivo:
      "usa R$128 como ticket médio por cobrança de assinatura, não como mensalidade de plano",
  },
  {
    arquivo: "content/blog/gestao-financeira-barbearia.ts",
    literais: ["R$540"],
    motivo:
      "coincidência de dígitos, não a afirmação proibida: aqui R$540 é a COMISSÃO de um sábado " +
      "(30 cortes × R$18), não o gasto anual do cliente avulso",
  },
  // Material de podcast: o episódio foi gravado e publicado, e a descrição relata o que o
  // episódio diz. Mexer no texto não muda o áudio que já está no ar.
  // ATENÇÃO: descrição de episódio é copy editável, diferente de transcrição. A descrição do
  // episódio 12 carrega o arco Embu (R$15.892 → R$31.690), que está morto. Esta dispensa
  // existe para não travar o repositório, e não para dar o assunto por resolvido — reescrever
  // a descrição com o case-âncora vivo (bb#13285) e remover esta entrada é a correção certa.
  {
    arquivo: "content/podcast/index.ts",
    literais: ["15.892", "31.690"],
    motivo: "descrição de episódio já publicado do podcast (T1) — pendente de reescrita",
  },
];

/** Pastas que não são superfície do site e ficam fora da varredura. */
const IGNORAR = ["node_modules", ".next", "bestbarbers.webflow"];

const EXTENSOES = /\.(ts|tsx|js|jsx|mjs|css|md|mdx|json)$/;
const EH_TESTE = /\.test\.(ts|tsx|js|jsx|mjs)$/;

function arquivosDeCodigo(dir: string, saida: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    if (IGNORAR.includes(entrada)) continue;
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) arquivosDeCodigo(caminho, saida);
    // Arquivos de teste ficam fora: não são superfície pública, e este próprio gate precisa
    // escrever os 15 literais para poder procurá-los.
    else if (EXTENSOES.test(entrada) && !EH_TESTE.test(entrada)) saida.push(caminho);
  }
  return saida;
}

/**
 * Marca cada posição do arquivo que está dentro de comentário.
 *
 * Existe por um motivo concreto: a correção de 19/Set/26 documentou a si mesma. Dezenas de
 * arquivos hoje têm comentários do tipo "saiu daqui o 2,1 visitas/mês porque …". Sem isto, o
 * gate acusaria a própria explicação de por que o número saiu — e o caminho mais curto para
 * fazer o teste passar seria apagar a explicação, que é justamente o que ninguém deve fazer.
 *
 * O scanner reconhece string simples, dupla e template literal ANTES de reconhecer comentário.
 * Sem isso, o `//` de qualquer URL em string ("https://wa.me/…") engoliria o resto da linha e
 * o gate pararia de enxergar o que vem depois — um falso NEGATIVO, que num gate é pior que
 * um falso positivo: ele não incomoda ninguém e não protege nada.
 */
function mapaDeComentarios(src: string): Uint8Array {
  const dentro = new Uint8Array(src.length);
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      const aspas = c;
      i++;
      while (i < src.length && src[i] !== aspas) {
        if (src[i] === "\\") i++;
        i++;
      }
      i++;
    } else if (c === "/" && src[i + 1] === "/") {
      const quebra = src.indexOf("\n", i);
      const fim = quebra === -1 ? src.length : quebra;
      dentro.fill(1, i, fim);
      i = fim;
    } else if (c === "/" && src[i + 1] === "*") {
      const fecha = src.indexOf("*/", i + 2);
      const fim = fecha === -1 ? src.length : fecha + 2;
      dentro.fill(1, i, fim);
      i = fim;
    } else {
      i++;
    }
  }
  return dentro;
}

function dispensado(arquivoRelativo: string, literal: string): boolean {
  return ALLOWLIST.some((d) => d.arquivo === arquivoRelativo && d.literais.includes(literal));
}

function linhaDe(src: string, indice: number): number {
  let linha = 1;
  for (let i = 0; i < indice; i++) if (src[i] === "\n") linha++;
  return linha;
}

interface Achado {
  arquivo: string;
  linha: number;
  proibido: Proibido;
  trecho: string;
}

function varrer(): { achados: Achado[]; arquivosLidos: number } {
  const achados: Achado[] = [];
  const arquivos = arquivosDeCodigo(SRC);
  for (const caminho of arquivos) {
    const src = readFileSync(caminho, "utf8");
    const relativo = relative(SRC, caminho);
    let comentarios: Uint8Array | null = null;
    for (const proibido of PROIBIDOS) {
      if (dispensado(relativo, proibido.literal)) continue;
      let idx = src.indexOf(proibido.literal);
      if (idx === -1) continue;
      comentarios ??= mapaDeComentarios(src);
      while (idx !== -1) {
        if (!comentarios[idx]) {
          const linha = linhaDe(src, idx);
          achados.push({
            arquivo: relativo,
            linha,
            proibido,
            trecho: src.split("\n")[linha - 1].trim().slice(0, 120),
          });
        }
        idx = src.indexOf(proibido.literal, idx + proibido.literal.length);
      }
    }
  }
  return { achados, arquivosLidos: arquivos.length };
}

test("nenhum número morto, agregado interno ou número vetado em src/", () => {
  const { achados, arquivosLidos } = varrer();

  // Se a varredura parar de encontrar arquivos, ela passaria "verde" sem olhar nada.
  assert.ok(arquivosLidos > 200, `a varredura leu só ${arquivosLidos} arquivos — algo quebrou no caminho até src/`);

  if (achados.length > 0) {
    const relato = achados
      .map(
        (a) =>
          `\n  ✗ "${a.proibido.literal}"  —  ${a.arquivo}:${a.linha}\n` +
          `      linha: ${a.trecho}\n` +
          `      por quê está proibido (${a.proibido.motivo}): ${a.proibido.porque}`
      )
      .join("\n");
    assert.fail(
      `\n${achados.length} ocorrência(s) de número proibido em src/:\n${relato}\n\n` +
        `Como resolver: pegue o número vivo em ../bestbarbers-ai/knowledge/dominio/cases-clube.json\n` +
        `(cada caso tem um bb#ref para citar ao lado) ou em ../bestbarbers-ai/knowledge/marketing/\n` +
        `instagram-voz-do-time.md §9 (agregados oficiais: 1.200+ barbearias · 51.000+ assinantes ·\n` +
        `R$5M+/mês · 6M+ agendamentos/mês).\n\n` +
        `Se o seu uso for legítimo — o mesmo dígito com outro significado — acrescente uma entrada\n` +
        `à ALLOWLIST no topo deste arquivo, com o motivo escrito. Não troque a grafia do número e\n` +
        `não remova o literal da lista de proibidos: é a afirmação que está vetada, não os dígitos.\n`
    );
  }
});

/**
 * Guarda da própria allowlist: toda dispensa concedida a uma LP legada vale porque a rota não
 * existe. No dia em que alguém criar o `page.tsx` da família, a LP passa a ser publicada com o
 * número morto dentro e a dispensa vira um buraco silencioso. Este teste é o que impede isso.
 */
test("família legada continua fora do ar (senão a dispensa da allowlist não vale)", () => {
  const familias = [...new Set(ALLOWLIST.map((d) => d.familiaNaoServida).filter(Boolean))] as string[];
  assert.ok(familias.length > 0, "nenhuma família legada declarada — a allowlist mudou de forma?");

  for (const familia of familias) {
    const pasta = join(SRC, "app", familia);
    assert.ok(existsSync(pasta), `a pasta src/app/${familia} sumiu — remova as entradas dela da ALLOWLIST`);
    assert.ok(
      !existsSync(join(pasta, "page.tsx")) && !existsSync(join(pasta, "page.ts")),
      `src/app/${familia} voltou a ser servida (ganhou page.tsx), e os arquivos dessa família ainda carregam ` +
        `número morto. Limpe os números da família ou remova as entradas de /${familia} da ALLOWLIST deste gate.`
    );
  }
});

/**
 * Guarda contra buraco silencioso: um erro de caminho ou de filtro faria a varredura pular os
 * arquivos que mais importam e o gate passaria verde sem ter olhado o conteúdo público. Estes
 * são arquivos de conteúdo que alimentam rotas vivas — se algum deixar de ser lido, é bug do
 * gate, não sinal de que está tudo limpo.
 */
test("a varredura realmente alcança o conteúdo das rotas vivas", () => {
  const obrigatorios = [
    "content/home.ts",
    "content/clube.ts",
    "content/blog/precificar-clube-assinatura-barbearia.ts",
    "content/podcast/index.ts",
    "app/clube-de-assinaturas/page.tsx",
    "app/calculadora-prejuizo/_components/benchmarks.ts",
    "app/tabela-precificacao-clube/_components/benchmarks.ts",
    "app/v12/_components/TestimonialsV12.tsx",
  ];
  const lidos = new Set(arquivosDeCodigo(SRC).map((c) => relative(SRC, c)));
  for (const arquivo of obrigatorios) {
    assert.ok(lidos.has(arquivo), `a varredura não alcançou ${arquivo} — o gate está cego para esse conteúdo`);
  }
});

/**
 * Guarda da qualidade da allowlist: dispensa sem motivo escrito é dispensa que ninguém vai
 * conseguir auditar daqui a seis meses. E dispensa que aponta para arquivo que não existe mais
 * é lixo que dá a falsa impressão de cobertura.
 */
test("toda dispensa da allowlist tem motivo escrito e arquivo existente", () => {
  for (const d of ALLOWLIST) {
    assert.ok(existsSync(join(SRC, d.arquivo)), `a allowlist aponta para ${d.arquivo}, que não existe mais — remova a entrada`);
    assert.ok(d.literais.length > 0, `a dispensa de ${d.arquivo} não lista nenhum literal`);
    assert.ok(d.motivo.trim().length >= 20, `a dispensa de ${d.arquivo} não explica o motivo`);
    for (const literal of d.literais) {
      assert.ok(
        PROIBIDOS.some((p) => p.literal === literal),
        `a dispensa de ${d.arquivo} libera "${literal}", que não está na lista de proibidos — entrada obsoleta`
      );
    }
  }
});
