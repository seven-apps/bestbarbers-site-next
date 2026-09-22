/**
 * PROJETO DO CLUBE — tipos compartilhados da família.
 *
 * Dono: B2. É a forma do conteúdo; o TEXTO vive em `pc-copy.ts` e `pc-pecas.ts` (B3).
 * Nada aqui importa React, toca `window` ou tem efeito colateral: este módulo é
 * consumido tanto por server component (page.tsx, PcSecao) quanto por client.
 *
 * `isolatedModules` está ligado no tsconfig: importe os tipos com `import type`.
 */

/** As quatro entradas da família. `geral` é a porta sem situação declarada. */
export type PcSituacao = "geral" | "manual" | "migracao" | "abertura";

/** As três pontes possíveis entre o argumento e o pedido de contato. */
export type PcPonteId = "como_segue" | "veja_primeiro" | "use_material";

/** Variante do texto de apoio acima do formulário. */
export type PcFormVariante = "padrao" | "curto";

/** Id de peça do acervo (L001…L098). Sempre validado contra PC_PECAS antes de usar. */
export type PcPecaId = `L${string}`;

/** Chave de `PC_ARTEFATOS` (registro de B5). */
export type PcArtefatoId = string;

/** Uma composição por anúncio: os 4 campos variáveis + a escolha de ponte. */
export interface PcPeca {
  id: PcPecaId;
  conceito: string;
  situacao: PcSituacao;
  etapa: "Topo" | "Meio" | "Fundo";
  titulo: string;
  apoio: string;
  botaoPrincipal: string;
  exemploTitulo: string;
  exemploTexto: string;
  faqPergunta: string;
  faqResposta: string;
  /** A ponte ESCRITA no acervo. Nunca consumir direto: passe por `ponteEfetiva()`. */
  ponte: PcPonteId;
  formularioVariante: PcFormVariante;
  /** «Quero conversar sobre meu clube» — rótulo do botão final do formulário. */
  botaoContato: string;
  /** Artefato que a promessa desta peça exige. Se for placeholder, a ponte cai (V9). */
  artefatoExigido: PcArtefatoId | null;
}

/** Abertura do template por situação (cap. 13). */
export interface PcAbertura {
  identificacao: string;
  titulo: string;
  apoio: string;
  botao: string;
  linkSecundario: string;
  exemplo: string;
}

/** Tudo que a rota entrega ao orquestrador. */
export interface PcPaginaConfig {
  situacao: PcSituacao;
  /** "/projeto-do-clube/migracao" */
  rota: string;
  /** "lp_projeto_migracao" — o `source` do dataLayer e do useLeadForm. */
  source: string;
  /** "Migracao" — entra no `originDesc` de visita direta. */
  rotulo: string;
  peca: PcPeca;
}

/** Par pergunta/resposta do FAQ (o destacado da peça e os gerais). */
export interface PcFaqItem {
  pergunta: string;
  resposta: string;
  /**
   * Situações em que a pergunta faz sentido. AUSENTE = vale para todas, que é o
   * caso da maioria — só marque quando a pergunta ficar sem sentido para algum
   * público. Quem aplica é `montarFaq` (`_lib/perguntas.ts`).
   *
   * Existe porque as gerais entravam nas quatro situações sem filtro: «Já
   * preciso ter um clube?» aparecia para quem já tem, e «Posso migrar do meu
   * sistema atual?» ocupava um acordeão em `/migracao`, a página que existe
   * inteira para responder isso.
   */
  situacoes?: readonly PcSituacao[];
}

/**
 * Uma opção do seletor de situação. `clubStatus` é a string LITERAL de
 * `CLUBE_OPCOES` que pré-preenche a pergunta 7 do formulário (§5.1).
 */
export interface PcOpcaoSeletor {
  valor: PcSituacao;
  rotulo: string;
  clubStatus: string;
}

/* ───────────────────────────────────────────────────────────────────────────
   Helpers de tipo — sem texto, sem dado de negócio.
   ─────────────────────────────────────────────────────────────────────────── */

/** Ordem canônica das situações. Usada por seletor, testes e validação de rota. */
export const PC_SITUACOES = ["geral", "manual", "migracao", "abertura"] as const;

/** Guarda de runtime: o valor veio de fora (rota, param, storage) e pode ser lixo. */
export function ehPcSituacao(valor: unknown): valor is PcSituacao {
  return typeof valor === "string" && (PC_SITUACOES as readonly string[]).includes(valor);
}
