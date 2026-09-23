"use client";

/**
 * MEDIÇÃO DA FAMÍLIA — a tabela fechada de §2.5, e nada além dela.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * O QUE ESTE ARQUIVO NÃO FAZ
 * ────────────────────────────────────────────────────────────────────────────
 * Não dispara `Lead`, `QualifiedLead`, `QualifiedLead60` nem `LeadComEquipe`. Esses
 * são do `useLeadForm` — Pixel e CAPI com o MESMO `eventId`, para a Meta deduplicar.
 * Refazer qualquer um deles aqui dobraria a conta da conversão (já aconteceu com o
 * `trackCompleteRegistration`: inflou 50%, removido em 910a080). E na `/obrigado` não
 * nasce evento nenhum: quando aquela rota abre, a pessoa JÁ é lead.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * DOIS VERBOS, E A DIFERENÇA IMPORTA
 * ────────────────────────────────────────────────────────────────────────────
 * `ViewContent` é nome de CATÁLOGO da Meta → `trackCustomEvent` (`fbq('track')`).
 * Todo o resto é nome customizado → `trackNonCatalogEvent` (`fbq('trackCustom')` +
 * image pixel com o mesmo eventID). Mandar nome customizado por `fbq('track')` faz o
 * evento chegar torto; mandar nome de catálogo por `trackCustom` cria um evento
 * paralelo com o mesmo nome. Os dois erros são silenciosos.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * A GUARDA É UM `Set` DE MÓDULO, NUNCA UM `useRef`
 * ────────────────────────────────────────────────────────────────────────────
 * `useRef` morre a cada remontagem: o StrictMode do React 19 monta duas vezes em
 * desenvolvimento, e uma troca de situação no seletor remonta blocos. Com `useRef` o
 * `ViewContent` sairia duplicado — e ninguém veria, porque o número simplesmente
 * ficaria maior. O `Set` vive enquanto a aba viver, que é exatamente o escopo de «uma
 * vez por carga de página».
 */

import { useCallback, useMemo } from "react";
import { useMetaPixel } from "@/hooks";
import { paramsDaPaginaAtual, type ParamsPorta } from "@/lib/tracking/porta";
import type { PcPaginaConfig } from "./pc.types";

/** Os nomes como o Events Manager os vê. Mudar um aqui renomeia a série inteira. */
export const PC_EVENTOS = {
  viewContent: "ViewContent",
  situacaoEscolhida: "projeto_situacao_escolhida",
  demoAberta: "clube_demo_aberta",
  formIniciado: "projeto_form_iniciado",
  condicoesAbertas: "condicoes_abertas",
  /** `/clube/[peca]`: o bloco de prova da promessa entrou ≥50% na tela. Uma vez por carga. */
  provaVista: "clube_prova_vista",
  /** `/clube/[peca]`: clique no botão único do herói (o «Ver…» do anúncio). */
  heroiClique: "clube_heroi_clique",
  /** `/clube/app-proprio`: primeira mexida no simulador do app (cor, logo ou fundo). Uma vez por carga. */
  appSimulado: "clube_app_simulado",
} as const;

export type PcEvento = (typeof PC_EVENTOS)[keyof typeof PC_EVENTOS];

/** Onde o link de condições foi clicado: dentro da página ou na própria `/condicoes`. */
export type PcOndeCondicoes = "bloco" | "pagina";

/**
 * Quem já disparou, nesta carga. A chave leva a rota junto: navegar de
 * `/projeto-do-clube` para `/projeto-do-clube/condicoes` com `router.push` não
 * recarrega o módulo, e sem a rota na chave o `condicoes_abertas` da página de
 * condições seria engolido pelo do bloco.
 */
const jaDisparou = new Set<string>();

function umaVez(chave: string, disparar: () => void): void {
  if (jaDisparou.has(chave)) return;
  jaDisparou.add(chave);
  disparar();
}

export interface PcEventos {
  /** Uma vez por carga. Catálogo → `fbq('track')`. */
  viewContent: () => void;
  /** Cada troca no seletor. Não tem guarda: trocar duas vezes são dois fatos. */
  situacaoEscolhida: (de: string, para: string) => void;
  /** Abertura da demonstração. Leva o id do artefato — placeholder incluído. */
  demoAberta: (artefatoId?: string) => void;
  /** Passagem do passo 1 para o 2 do formulário. Uma vez por carga. */
  formIniciado: () => void;
  /** Clique em qualquer link de condições. Uma vez por `onde`, por carga. */
  condicoesAbertas: (onde: PcOndeCondicoes) => void;
  /** O bloco de prova ficou visível. Uma vez por carga. */
  provaVista: () => void;
  /** Clique no botão do herói. Sem guarda: dois cliques são dois fatos. */
  heroiClique: () => void;
  /** Primeira interação com o simulador do app. Uma vez por carga. */
  appSimulado: () => void;
}

/**
 * Os eventos desta página, já amarrados à `config` da rota.
 *
 * O objeto devolvido é memorizado: `ControlePagina` e `PcFormulario` o colocam em
 * array de dependência de `useEffect`, e um objeto novo a cada render os faria rodar
 * a cada render.
 */
export function usePcEventos(config: PcPaginaConfig): PcEventos {
  const { trackCustomEvent, trackNonCatalogEvent } = useMetaPixel();
  const { rota, situacao, peca, source, variante } = config;

  /**
   * As chaves que TODO evento desta família carrega. `porta`, `tema` e `pagina` vêm do
   * mapa da casa (`paramsDaPaginaAtual`), para o Events Manager ver sempre os mesmos
   * nomes de chave que os outros eventos do site. `situacao`, `peca` e `source` são o
   * que esta família acrescenta — e são a ÚNICA forma de separar as quatro entradas
   * no pixel, já que `bb_lp_version` colapsa as quatro em `projeto-do-clube`.
   */
  const base = useCallback(
    (): ParamsPorta => ({
      ...paramsDaPaginaAtual(),
      pagina: rota,
      situacao,
      peca: peca.id,
      source,
      ...(variante ? { variante } : {}),
    }),
    [rota, situacao, peca.id, source, variante],
  );

  const viewContent = useCallback(() => {
    umaVez(`${rota}:viewContent`, () => {
      void trackCustomEvent(PC_EVENTOS.viewContent, {
        ...base(),
        content_name: rota,
        content_category: "projeto-do-clube",
      });
    });
  }, [base, rota, trackCustomEvent]);

  const situacaoEscolhida = useCallback(
    (de: string, para: string) => {
      if (de === para) return;
      void trackNonCatalogEvent(PC_EVENTOS.situacaoEscolhida, { ...base(), de, para });
    },
    [base, trackNonCatalogEvent],
  );

  const demoAberta = useCallback(
    (artefatoId?: string) => {
      umaVez(`${rota}:demoAberta`, () => {
        void trackNonCatalogEvent(PC_EVENTOS.demoAberta, {
          ...base(),
          // Com o vídeo ainda em placeholder, o id do placeholder vai junto: no dia em
          // que a demonstração real entrar, a série histórica continua sem buraco.
          artefato: artefatoId ?? "",
        });
      });
    },
    [base, rota, trackNonCatalogEvent],
  );

  const formIniciado = useCallback(() => {
    umaVez(`${rota}:formIniciado`, () => {
      void trackNonCatalogEvent(PC_EVENTOS.formIniciado, { ...base(), passo: 2 });
    });
  }, [base, rota, trackNonCatalogEvent]);

  const condicoesAbertas = useCallback(
    (onde: PcOndeCondicoes) => {
      umaVez(`${rota}:condicoes:${onde}`, () => {
        void trackNonCatalogEvent(PC_EVENTOS.condicoesAbertas, {
          ...base(),
          onde,
          // Nesta família TODO link de condições está acima do formulário. A chave
          // existe porque é isso que interessa ler: quem foi ver o preço antes de pedir.
          antes_do_form: true,
        });
      });
    },
    [base, rota, trackNonCatalogEvent],
  );

  const provaVista = useCallback(() => {
    umaVez(`${rota}:provaVista`, () => {
      void trackNonCatalogEvent(PC_EVENTOS.provaVista, base());
    });
  }, [base, rota, trackNonCatalogEvent]);

  const heroiClique = useCallback(() => {
    void trackNonCatalogEvent(PC_EVENTOS.heroiClique, base());
  }, [base, trackNonCatalogEvent]);

  const appSimulado = useCallback(() => {
    umaVez(`${rota}:appSimulado`, () => {
      void trackNonCatalogEvent(PC_EVENTOS.appSimulado, base());
    });
  }, [base, rota, trackNonCatalogEvent]);

  return useMemo(
    () => ({ viewContent, situacaoEscolhida, demoAberta, formIniciado, condicoesAbertas, provaVista, heroiClique, appSimulado }),
    [viewContent, situacaoEscolhida, demoAberta, formIniciado, condicoesAbertas, provaVista, heroiClique, appSimulado],
  );
}
