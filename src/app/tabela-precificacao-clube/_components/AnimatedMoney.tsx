"use client";

import { useEffect, useRef, useState } from "react";
import { brl } from "./calc";

interface AnimatedMoneyProps {
  /** Valor alvo em reais. */
  value: number;
  /** Duração da animação em ms. Default 700. */
  duration?: number;
  /** Formatação do valor exibido. Default: R$ sem centavos. */
  format?: (n: number) => string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Contador animado de valores em R$ (pt-BR) — mesmo padrão da
 * calculadora-prejuizo, com `format` opcional porque aqui os preços
 * recomendados carregam centavos (",90").
 */
export function AnimatedMoney({
  value,
  duration = 700,
  format = brl,
  className,
  style,
}: AnimatedMoneyProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = from + (to - from) * eased;
      setDisplay(progress < 1 ? current : to);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      fromRef.current = value;
    };
  }, [value, duration]);

  return (
    <span className={className} style={style}>
      {format(display)}
    </span>
  );
}
