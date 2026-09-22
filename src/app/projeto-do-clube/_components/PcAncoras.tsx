"use client";

/**
 * PcAncoras — navegação interna leve do topo (bloco B4).
 *
 * Contrato (00-ARQUITETURA.md):
 *  - V6: nasce visível. Sem JS, cada âncora é um `<a href="#id">` que salta nativamente.
 *  - §9 (Medição): não altera a URL. O clique é interceptado e a rolagem é feita à mão,
 *    justamente para não empurrar `#id` na barra de endereço e não competir com a
 *    `search` que carrega a atribuição (`pc-link.ts`).
 *  - §4.4: com `prefers-reduced-motion`, a rolagem é instantânea, nunca suave.
 *
 * Âncora cujo destino não existe na página some depois do mount — link morto não vai ao ar.
 */

import { useEffect, useMemo, useState } from "react";
import { usePcMovimentoReduzido } from "./pc-motion";
import estilos from "./pc-topo.module.css";

export interface PcAncoraItem {
  /** Texto visível. Micro-string desta família — ver pendência de revisão editorial. */
  rotulo: string;
  /** `id` do bloco de destino, sem `#`. */
  alvoId: string;
}

/** Os dois destinos pedidos para o topo: entender antes, pedir contato depois. */
export const PC_ANCORAS_PADRAO: readonly PcAncoraItem[] = [
  { rotulo: "Ver como funciona", alvoId: "pc-como-funciona" },
  { rotulo: "Ir para o formulário", alvoId: "pc-formulario" },
];

/** Altura do cabeçalho fixo + folga, para o título do destino não ficar embaixo dele. */
function recuoDoCabecalho(): number {
  if (typeof document === "undefined") return 0;
  const cabecalho = document.querySelector<HTMLElement>("[data-pc-cabecalho]");
  return (cabecalho?.offsetHeight ?? 0) + 12;
}

/**
 * Rola até um bloco da página e devolve o foco do teclado para ele.
 * Exportada porque o herói e o CTA fixo usam exatamente a mesma rolagem.
 */
export function rolarAte(alvoId: string, suave = true): boolean {
  if (typeof document === "undefined") return false;
  const alvo = document.getElementById(alvoId);
  if (!alvo) return false;

  const topo = alvo.getBoundingClientRect().top + window.scrollY - recuoDoCabecalho();
  window.scrollTo({ top: Math.max(topo, 0), behavior: suave ? "smooth" : "auto" });

  // Acessibilidade: quem navega por teclado precisa continuar de onde a página parou.
  if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
  alvo.focus({ preventScroll: true });
  return true;
}

interface PcAncorasProps {
  itens?: readonly PcAncoraItem[];
  /** `escuro` sobre carvão (padrão), `claro` sobre papel. */
  tema?: "escuro" | "claro";
  /** Rótulo do `<nav>` para leitor de tela. */
  rotuloNavegacao?: string;
  /** Gancho de medição: B9 liga um evento aqui sem tocar neste arquivo. */
  aoNavegar?: (alvoId: string) => void;
  className?: string;
}

export function PcAncoras({
  itens = PC_ANCORAS_PADRAO,
  tema = "escuro",
  rotuloNavegacao = "Atalhos desta página",
  aoNavegar,
  className,
}: PcAncorasProps) {
  const movimentoReduzido = usePcMovimentoReduzido();
  // No servidor e na primeira pintura, todas aparecem (V6). Depois do mount,
  // some a que não tem destino na página.
  const [ausentes, setAusentes] = useState<string[]>([]);

  useEffect(() => {
    const semDestino = itens
      .filter((item) => !document.getElementById(item.alvoId))
      .map((item) => item.alvoId);
    setAusentes(semDestino);
  }, [itens]);

  const visiveis = useMemo(
    () => itens.filter((item) => !ausentes.includes(item.alvoId)),
    [itens, ausentes],
  );

  if (visiveis.length === 0) return null;

  const classe = [estilos.ancoras, tema === "claro" ? estilos.ancorasClaro : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav aria-label={rotuloNavegacao} className={classe}>
      {visiveis.map((item) => (
        <a
          key={item.alvoId}
          href={`#${item.alvoId}`}
          className={estilos.ancora}
          onClick={(evento) => {
            // Sem JS este `preventDefault` não roda e o salto nativo resolve.
            if (evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
            evento.preventDefault();
            const foi = rolarAte(item.alvoId, !movimentoReduzido);
            if (foi) aoNavegar?.(item.alvoId);
          }}
        >
          {item.rotulo}
          <span aria-hidden="true" className={estilos.ancoraSeta}>
            &#8595;
          </span>
        </a>
      ))}
    </nav>
  );
}
