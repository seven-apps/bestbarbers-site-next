"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  PC_MOVIMENTO,
  jaEstaNaTela,
  observarUmaVez,
  usePcMovimentoReduzido,
} from "./pc-motion";

/**
 * M1 — entrada de seção. O ÚNICO jeito de revelar bloco nesta família.
 *
 * O contrato (V6): o conteúdo NASCE VISÍVEL. No HTML do servidor este componente
 * não escreve atributo nenhum, então sem JS — ou com o JS quebrado, lento, ou
 * bloqueado — a página aparece inteira. O esconder só acontece depois que o
 * JavaScript assume, e só para o que ainda está fora da tela.
 *
 * Três portas de saída que impedem conteúdo preso em `opacity: 0`:
 *   1. `prefers-reduced-motion: reduce` → nunca esconde (e reaparece na hora se
 *      a pessoa ligar a preferência com a página já aberta).
 *   2. Elemento JÁ visível na primeira pintura → nunca esconde. Sem piscada de
 *      «aparece, some, volta» no que está na dobra.
 *   3. Sem `IntersectionObserver` no navegador → `observarUmaVez` revela na hora.
 *
 * Stagger: passe `atraso` crescente (`i * 90`). Teto de QUATRO itens encadeados
 * — o quinto começa a parecer carregamento, não entrada.
 */

type PcEstadoRevelar = "livre" | "pronto" | "visivel";

export interface PcRevelarProps {
  children: ReactNode;
  /** Atraso em milissegundos. Vira `--pc-atraso`, lido pelo CSS. */
  atraso?: number;
  como?: "div" | "section" | "li";
  className?: string;
}

export function PcRevelar({ children, atraso = 0, como = "div", className }: PcRevelarProps) {
  const reduzido = usePcMovimentoReduzido();
  const [estado, setEstado] = useState<PcEstadoRevelar>("livre");
  const noRef = useRef<HTMLElement | null>(null);
  const jaReveladoRef = useRef(false);

  const definirNo = useCallback((no: HTMLElement | null) => {
    noRef.current = no;
  }, []);

  useEffect(() => {
    const no = noRef.current;
    if (!no) return undefined;

    // Porta 1 — preferência de movimento reduzido, inclusive ligada depois.
    if (reduzido) {
      setEstado("livre");
      return undefined;
    }

    // Já apareceu uma vez: nunca esconder de novo (a entrada é `once`).
    if (jaReveladoRef.current) return undefined;

    // Porta 2 — o elemento já estava pintado na tela. Deixa como está.
    if (jaEstaNaTela(no)) {
      jaReveladoRef.current = true;
      return undefined;
    }

    setEstado("pronto");

    // Porta 3 — `observarUmaVez` é fail-open: sem observer, revela na hora.
    return observarUmaVez(no, () => {
      jaReveladoRef.current = true;
      setEstado("visivel");
    }, {
      threshold: PC_MOVIMENTO.threshold,
      rootMargin: PC_MOVIMENTO.rootMargin,
    });
  }, [reduzido]);

  const Tag = como as "div";
  const estilo = atraso ? ({ "--pc-atraso": `${atraso}ms` } as CSSProperties) : undefined;

  return (
    <Tag
      ref={definirNo}
      className={cn(className)}
      style={estilo}
      data-pc-revelar={estado === "livre" ? undefined : estado}
    >
      {children}
    </Tag>
  );
}

export default PcRevelar;
