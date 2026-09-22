"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PC_MOVIMENTO,
  jaEstaNaTela,
  observarUmaVez,
  pcTokenMs,
  usePcMovimentoReduzido,
} from "./pc-motion";

/**
 * M2 — número que conta.
 *
 * Regra de aceite da arquitetura: **o SSR imprime o número FINAL**. O HTML que
 * sai do servidor já tem o valor certo, então sem JS o número está lá, e com
 * `prefers-reduced-motion` ele nunca pisca 0.
 *
 * A contagem só começa quando o elemento entra na tela E não estava visível na
 * primeira pintura — se já estava, o número fica como nasceu. Isso evita o
 * defeito clássico do contador hidratado: o valor certo aparece, some para 0 e
 * volta subindo, na cara de quem já tinha lido.
 *
 * Formatação feita à mão (ponto de milhar, vírgula decimal) de propósito:
 * `Intl.NumberFormat` pode divergir entre o Node do servidor e o navegador, e
 * divergência em número renderizado é erro de hidratação.
 */

export interface PcNumeroProps {
  valor: number;
  prefixo?: string;
  sufixo?: string;
  decimais?: number;
  className?: string;
}

function formatarPtBr(valor: number, decimais: number): string {
  const seguro = Number.isFinite(valor) ? valor : 0;
  const sinal = seguro < 0 ? "-" : "";
  const fixo = Math.abs(seguro).toFixed(decimais);
  const [inteiro, fracao] = fixo.split(".");
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sinal}${comMilhar}${fracao ? `,${fracao}` : ""}`;
}

export function PcNumero({ valor, prefixo, sufixo, decimais = 0, className }: PcNumeroProps) {
  const reduzido = usePcMovimentoReduzido();
  const [exibido, setExibido] = useState<number>(valor);
  const noRef = useRef<HTMLSpanElement | null>(null);
  const jaContouRef = useRef(false);

  const definirNo = useCallback((no: HTMLSpanElement | null) => {
    noRef.current = no;
  }, []);

  useEffect(() => {
    const no = noRef.current;
    if (!no) return undefined;

    // Movimento reduzido, já contou antes, ou já estava na tela: imprime e pronto.
    if (reduzido || jaContouRef.current || jaEstaNaTela(no)) {
      jaContouRef.current = true;
      setExibido(valor);
      return undefined;
    }

    if (typeof window === "undefined" || typeof window.requestAnimationFrame !== "function") {
      setExibido(valor);
      return undefined;
    }

    const duracao = pcTokenMs(no, "--pc-dur-conta", PC_MOVIMENTO.durConta);
    let quadro = 0;

    // Abaixo da dobra: começa em 0 sem ninguém ver, e sobe quando chegar a vez.
    setExibido(0);

    const pararDeObservar = observarUmaVez(no, () => {
      jaContouRef.current = true;

      if (duracao <= 1) {
        setExibido(valor);
        return;
      }

      const inicio = performance.now();
      const passo = (agora: number) => {
        const avanco = Math.min(1, (agora - inicio) / duracao);
        const suavizado = 1 - Math.pow(1 - avanco, 3); // easeOutCubic: chega e assenta
        if (avanco < 1) {
          setExibido(valor * suavizado);
          quadro = window.requestAnimationFrame(passo);
        } else {
          setExibido(valor);
        }
      };
      quadro = window.requestAnimationFrame(passo);
    }, {
      threshold: PC_MOVIMENTO.threshold,
      rootMargin: PC_MOVIMENTO.rootMargin,
    });

    return () => {
      pararDeObservar();
      if (quadro) window.cancelAnimationFrame(quadro);
    };
  }, [valor, reduzido]);

  return (
    <span ref={definirNo} className={cn("pc-numero", className)}>
      {prefixo}
      {formatarPtBr(exibido, decimais)}
      {sufixo}
    </span>
  );
}

export default PcNumero;
