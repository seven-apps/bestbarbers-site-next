"use client";

import { useEffect, useRef, useState } from "react";
import { brl } from "./calc";

interface AnimatedMoneyProps {
  /** Valor alvo em reais. */
  value: number;
  /** Duração da animação em ms. Default 700. */
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Contador animado de valores em R$ (pt-BR), no espírito do CountUp de ui/motion
 * mas com formatação de moeda e re-animação a cada mudança do alvo — necessário
 * porque o resultado da calculadora muda ao vivo conforme o usuário move os sliders.
 */
export function AnimatedMoney({
  value,
  duration = 700,
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
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
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
      {brl(display)}
    </span>
  );
}
