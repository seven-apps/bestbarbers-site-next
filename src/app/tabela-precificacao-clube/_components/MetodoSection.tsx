"use client";

import { Scale, Sparkles, CalendarClock } from "lucide-react";
import type { ComponentType } from "react";

interface Passo {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  titulo: string;
  texto: string;
}

const PASSOS: Passo[] = [
  {
    icon: Scale,
    titulo: "1. A Regra dos 2 Cortes",
    texto:
      "O teto da mensalidade é o valor de 2 cortes avulsos. Acima disso, só assina quem já corta 4 vezes por mês — você vende pouco e todo assinante usa muito. É a receita clássica do clube que não para em pé.",
  },
  {
    icon: Sparkles,
    titulo: "2. O preço \"uau\"",
    texto:
      "Quem sustenta o clube é o cliente que corta a cada 20 ou 30 dias. Ele só entra quando olha o preço e pensa: \"se eu usar duas vezes, já valeu\". Por isso o lançamento fica um pouco abaixo do teto — e o cliente que usa pouco compensa o que usa muito.",
  },
  {
    icon: CalendarClock,
    titulo: "3. O preço acompanha a agenda",
    texto:
      "Sobrando horário, cobre o preço mais convidativo da faixa: a prioridade é encher a agenda. Clube lotado e avulso sem vaga? Aí você sobe o preço — reajuste suave de uns R$10, ou mais forte quando não cabe mais gente.",
  },
];

export function MetodoSection() {
  return (
    <section className="py-14 md:py-20 relative" style={{ background: "#0a0a0a" }}>
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12 animate-fade-in-up">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] mb-5 border"
              style={{
                background: "rgba(235,173,4,0.1)",
                color: "#ebad04",
                borderColor: "rgba(235,173,4,0.2)",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              O método por trás da tabela
            </span>
            <h2
              className="leading-tight max-w-2xl mx-auto"
              style={{
                fontFamily: "var(--font-vollkorn)",
                fontWeight: 700,
                fontSize: "clamp(26px, 4vw, 42px)",
                color: "#ffffff",
              }}
            >
              O clube não morre por causa do sistema. Morre pelo preço.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {PASSOS.map((passo, index) => {
              const Icon = passo.icon;
              return (
                <div
                  key={passo.titulo}
                  className="rounded-2xl p-6 md:p-7 animate-fade-in-up"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    animationDelay: `${0.1 + index * 0.08}s`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(235,173,4,0.12)",
                      border: "1px solid rgba(235,173,4,0.3)",
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#ebad04" }} />
                  </div>
                  <h3
                    className="mb-2 leading-snug"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#ffffff",
                    }}
                  >
                    {passo.titulo}
                  </h3>
                  <p
                    className="text-[13.5px] md:text-[14px] leading-relaxed"
                    style={{ color: "#ffffff", opacity: 0.72, fontFamily: "var(--font-montserrat)" }}
                  >
                    {passo.texto}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
