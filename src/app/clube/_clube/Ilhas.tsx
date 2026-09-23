"use client";

/**
 * As ÚNICAS partes interativas da página `/clube/[peca]` que não são o formulário, o FAQ e o
 * rodapé da família. Todo o resto (herói, prova, antes × depois) é server component — é isso que
 * tira JS do caminho do primeiro carregamento no Android do navegador do Instagram (Onda 1b).
 */
import { useEffect, type ReactNode } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { usePcEventos } from "../../projeto-do-clube/_components/pc-eventos";
import { PcCtaFixo } from "../../projeto-do-clube/_components/PcCtaFixo";
import { PC_FORMULARIO_ID } from "../../projeto-do-clube/_components/PcFormulario";
import type { PcPaginaConfig } from "../../projeto-do-clube/_components/pc.types";
import { TelaAnimada } from "./TelaAnimada";
import { ID_HEROI } from "./ids";

function rolarAte(id: string) {
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
}

/**
 * ViewContent (uma vez) + Web Vitals de campo → dataLayer (GTM). Sem isto não há como medir o
 * LCP/INP no navegador do Instagram: o CrUX não coleta de WebView e as páginas são `noindex`.
 */
export function EventosPagina({ config }: { config: PcPaginaConfig }) {
  const eventos = usePcEventos(config);
  useEffect(() => {
    eventos.viewContent();
  }, [eventos]);

  useReportWebVitals((m) => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: "web_vitals",
      metrica: m.name,
      valor: Math.round(m.name === "CLS" ? m.value * 1000 : m.value),
      nota: m.rating,
      pagina: config.rota,
      variante: config.variante ?? "base",
      navegador_app: /Instagram|FBAN|FBAV/i.test(navigator.userAgent) ? "instagram" : "outro",
    });
  });
  return null;
}

/** O botão único do herói: repete o «Ver…» do anúncio e desce para a PROVA (não para o formulário). */
export function BotaoHeroi({ config, rotulo, alvoId }: { config: PcPaginaConfig; rotulo: string; alvoId: string }) {
  const eventos = usePcEventos(config);
  return (
    <button
      type="button"
      className="pc-botao pc-botao--acao pc-botao--g pc-botao--bloco"
      onClick={() => {
        eventos.heroiClique();
        rolarAte(alvoId);
      }}
    >
      {rotulo}
      {"\u00a0"}↓
    </button>
  );
}

/** A tela animada da prova, com o `clube_prova_vista` no momento em que ela entra na tela. */
export function ProvaAnimada({ config, children }: { config: PcPaginaConfig; children: ReactNode }) {
  const eventos = usePcEventos(config);
  return <TelaAnimada aoVer={eventos.provaVista}>{children}</TelaAnimada>;
}

/** CTA fixo do rodapé: leva ao formulário e some quando ele está na tela (regra da família). */
export function CtaFixoClube({ rotulo }: { rotulo: string }) {
  // Gatilho = o herói (`clube-inicio`): enquanto ele está na tela, o CTA fixo não aparece — senão
  // são duas chamadas amarelas na dobra e o fixo cobre o botão do herói no braço `cena`.
  return <PcCtaFixo rotulo={rotulo} alvoId={PC_FORMULARIO_ID} gatilhoId={ID_HEROI} aoClicar={() => rolarAte(PC_FORMULARIO_ID)} />;
}
