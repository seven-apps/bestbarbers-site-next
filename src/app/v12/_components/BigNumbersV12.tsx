"use client";

import { CountUp } from "@/components/ui/motion";

const numbers = [
  { value: 1200, prefix: "+", suffix: "", label: "Barbearias", sub: "ativas hoje" },
  { value: 51, prefix: "+", suffix: "K", label: "Assinantes", sub: "pagando todo mês" },
  { value: 5, prefix: "R$", suffix: "M+", label: "Processados", sub: "todo mês" },
  { value: 6, prefix: "", suffix: "M+", label: "Agendamentos", sub: "todo mês" },
];

export function BigNumbersV12() {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Glow central horizontal */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "900px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(235,173,4,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="container-custom relative z-10">
        {/* Números em massa tipográfica — layout editorial */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
          {numbers.map((n, idx) => (
            <div
              key={n.label}
              className="flex flex-col items-center text-center py-8 md:py-10 px-4 md:px-6 animate-fade-in-up relative"
              style={{
                animationDelay: `${0.05 + idx * 0.1}s`,
              }}
            >
              {/* Número massivo — elemento gráfico principal */}
              <div
                className="leading-none mb-2 tracking-tight"
                style={{
                  fontFamily: "var(--font-vollkorn)",
                  fontWeight: 800,
                  fontSize: "clamp(48px, 8vw, 80px)",
                  color: "#ebad04",
                }}
              >
                {n.prefix}
                <CountUp end={n.value} duration={2} />
                {n.suffix}
              </div>

              {/* Label em linha dourada fina acima */}
              <div
                className="w-8 h-0.5 mb-2 rounded-full"
                style={{ background: "rgba(235,173,4,0.4)" }}
              />

              <p
                className="font-extrabold text-sm md:text-base leading-tight mb-1"
                style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
              >
                {n.label}
              </p>
              <p
                className="text-[11px] md:text-xs font-medium"
                style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", opacity: 0.7 }}
              >
                {n.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Legenda unificada */}
        <div
          className="text-center mt-10 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <p
            className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", opacity: 0.6 }}
          >
            tratados com sistema BestBarbers · A maior plataforma de barbearia do Brasil
          </p>
        </div>
      </div>
    </section>
  );
}
