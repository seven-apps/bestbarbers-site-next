/**
 * AS 11 PÁGINAS POR ANÚNCIO de `/clube/[peca]` — slug, porta e lugar na campanha.
 *
 * Plano: bestbarbers-ai/docs/operacional/plano-v3-maquina-vendas/
 * 36-ARQUITETURA-TOPO-MEIO-E-PAGINAS-2026-09-23.md (§1.4, §2.2 e §4). Nome dos
 * anúncios estáticos: criativos-funil-clube/06-OITO-ESTATICOS-TEXTO-FINAL (a raiz do
 * nome é o slug: `ESTATICO-RETENTATIVA-TOPO` ↔ `/clube/retentativa`).
 *
 * POR QUE ESTE ARQUIVO É SEPARADO DO CONTEÚDO (`src/content/clube-pecas.ts`)
 * `porta.ts` importa este módulo, e `porta.ts` está em todo formulário do site
 * (`useLeadForm` → `portaDoLead`). Se a porta morasse junto da copy, as onze páginas
 * de texto iriam no bundle de cada LP. Aqui fica só o que o PIXEL precisa; o texto
 * fica em `content/`. Os dois são amarrados pelo tipo `SlugClube`: o `tsc` recusa
 * slug com porta e sem página, ou com página e sem porta.
 *
 * SLUG = raiz do nome do criativo. É o que torna o rastreio automático: o mesmo
 * slug está na URL do anúncio, em `bb_lp_version` (`clube-<slug>`) e no parâmetro
 * `peca` (`clube/<slug>`) dos eventos.
 *
 * A PORTA É DECLARADA, NUNCA INFERIDA. `porta: null` é uma declaração também: a
 * página não diz de que situação o dono vem, e por isso não recebe porta — a mesma
 * regra do `/clube` e do `/projeto-do-clube/controle` (página genérica não recebe
 * porta, para não contaminar os públicos por momento). P2 e P3 têm que nascer com
 * a porta certa: é dela que sai o público de remarketing de cada situação.
 *
 * FORA DE PROPÓSITO: a peça de precificação. Ela vai para
 * `/tabela-precificacao-clube-gated`, o único destino do funil com conversão
 * provada (decisão do André, 23/Set/26 — cap. 36 §4.4). Não criar página para ela.
 *
 * Módulo puro: sem React, sem `window`. O import de `Porta` é só de tipo (apagado
 * na execução), então não há ciclo com `porta.ts`.
 */

import type { Porta } from "./porta.ts";

export interface PortaDaPecaClube {
  /** `null` = página genérica, sem porta (ver cabeçalho). */
  porta: Porta | null;
  /** Por que esta porta — a frase do anúncio ou a decisão que a sustenta. */
  porque: string;
  etapa: "Topo" | "Meio";
  /** Conjunto de anúncios que aponta para esta página (cap. 36 §1.4 e §2.2). */
  conjunto: string;
  formato: "estatico" | "video";
}

export const PORTAS_CLUBE = {
  // ── TOPO · BB-TOPO-DONO-SET26 — 6 conjuntos × 1 criativo (cap. 36 §1.4)
  "plano-com-regra": {
    porta: 1,
    porque:
      "COPY 3 do André («medo do ilimitado») fala com quem ainda não montou o clube — foi a leitura dele mesmo ao escrevê-la (cap. 36 §5.3).",
    etapa: "Topo",
    conjunto: "BB-TOPO-DONO-SET26",
    formato: "estatico",
  },
  "cobranca-automatica": {
    porta: null,
    porque: "Anúncio 5 fala com qualquer dono que cobra assinatura; não declara situação.",
    etapa: "Topo",
    conjunto: "BB-TOPO-DONO-SET26",
    formato: "estatico",
  },
  "mes-que-comeca-pago": {
    porta: null,
    porque: "t3 («Virou o mês. Você ainda precisa ficar cobrando o cliente manualmente?») mira quem já tem clube e cobra na mão, mas é TOPO: o topo é anterior à porta (06-OITO-ESTATICOS) e quem separa é o modal.",
    etapa: "Topo",
    conjunto: "BB-TOPO-DONO-SET26",
    formato: "estatico",
  },
  retentativa: {
    porta: null,
    porque:
      "t4 filtra MATURIDADE (só reconhece quem já cobra no cartão), não situação: o dono pode estar em outro sistema ou num link de pagamento. Declarar P3 aqui pintaria de «migração» quem não disse que migra.",
    etapa: "Topo",
    conjunto: "BB-TOPO-DONO-SET26",
    formato: "estatico",
  },
  "parceiro-astro": {
    porta: null,
    porque: "Vídeo de parceiro sobre cobrança em geral; não declara situação.",
    etapa: "Topo",
    conjunto: "BB-TOPO-DONO-SET26",
    formato: "video",
  },
  "app-proprio": {
    porta: null,
    porque: "Vídeo sobre app com a marca da barbearia; não declara situação do clube.",
    etapa: "Topo",
    conjunto: "BB-TOPO-DONO-SET26",
    formato: "video",
  },

  // ── MEIO · BB-MEIO-CLUBE-SET26 (cap. 36 §2.2)
  "sem-caderno": {
    porta: 2,
    porque: "COPY 4 do André: «gerenciar as assinaturas manualmente» = já tem clube e roda na mão.",
    etapa: "Meio",
    conjunto: "AMPLO-P2-M3-COBRANCA-MANUAL",
    formato: "estatico",
  },
  "um-sistema-so": {
    porta: 3,
    porque: "COPY 7 do André: «agenda em um sistema e cobrança em outro» = já tem clube em outro sistema.",
    etapa: "Meio",
    conjunto: "AMPLO-P3-M4-MIGRACAO",
    formato: "estatico",
  },
  "bloqueio-na-agenda": {
    porta: 3,
    porque: "m4: «continua marcando horário no seu sistema» = já tem clube em outro sistema.",
    etapa: "Meio",
    conjunto: "AMPLO-P3-M4-MIGRACAO",
    formato: "estatico",
  },
  "parceiro-seletto": {
    porta: null,
    porque:
      "Remarketing quente: os vídeos de parceiro falam de assinatura em geral, não de situação (cap. 36 §2.2).",
    etapa: "Meio",
    conjunto: "REMARKETING-QUENTE",
    formato: "video",
  },
  "parceiro-guapo": {
    porta: null,
    porque:
      "Remarketing quente: os vídeos de parceiro falam de assinatura em geral, não de situação (cap. 36 §2.2).",
    etapa: "Meio",
    conjunto: "REMARKETING-QUENTE",
    formato: "video",
  },
} as const satisfies Record<string, PortaDaPecaClube>;

export type SlugClube = keyof typeof PORTAS_CLUBE;

export const SLUGS_CLUBE = Object.keys(PORTAS_CLUBE) as SlugClube[];

export function ehSlugClube(valor: string): valor is SlugClube {
  return Object.prototype.hasOwnProperty.call(PORTAS_CLUBE, valor);
}

/** `"/clube/sem-caderno"` → `"sem-caderno"`; qualquer outra rota → null. Espera pathname já normalizado. */
export function slugClubeDoCaminho(pathname: string): SlugClube | null {
  const m = pathname.match(/^\/clube\/([a-z0-9-]+)$/);
  return m && ehSlugClube(m[1]) ? m[1] : null;
}
