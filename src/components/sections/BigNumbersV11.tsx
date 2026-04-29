"use client";

import { CountUp } from "@/components/ui/motion";

const numbers = [
  { value: 1200, prefix: "+", suffix: "", label: "Barbearias", sub: "ativas hoje" },
  { value: 51, prefix: "+", suffix: "K", label: "Assinantes", sub: "pagando todo mês" },
  { value: 5, prefix: "R$", suffix: "M+", label: "Processados", sub: "todo mês" },
  { value: 6, prefix: "", suffix: "M+", label: "Agendamentos", sub: "todo mês" },
];

export function BigNumbersV11() {
  return (
    <section className="relative bg-gradient-to-b from-[#0d0d0d] via-[#121212] to-[#0d0d0d] py-12 md:py-16 lg:py-20 overflow-hidden border-y border-white/5">
      {/* Glow ambiente */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#ffaf02]/[0.05] blur-[140px] rounded-full" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-8 md:mb-10 animate-fade-in-up">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-bold text-[#ffaf02] mb-2">
            Os números do BestBarbers
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white">
            A maior plataforma de barbearia <span className="text-[#ffaf02]">do Brasil</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {numbers.map((n, idx) => (
            <div
              key={n.label}
              className="relative bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] border border-[#ffaf02]/15 rounded-2xl p-5 md:p-6 lg:p-7 text-center hover:border-[#ffaf02]/40 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              <div className="text-[32px] md:text-[44px] lg:text-[52px] font-extrabold text-[#ffaf02] leading-none mb-2 tracking-tight">
                {n.prefix}
                <CountUp end={n.value} duration={2} />
                {n.suffix}
              </div>
              <p className="text-white font-extrabold text-sm md:text-base leading-tight mb-1">
                {n.label}
              </p>
              <p className="text-gray-500 text-[11px] md:text-xs font-medium">
                {n.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-10 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffaf02]/10 rounded-full border border-[#ffaf02]/20">
            <span className="text-[#ffaf02] font-extrabold text-sm md:text-base">★★★★★</span>
            <span className="text-gray-400 font-medium text-xs md:text-sm">App Store + Google Play</span>
          </div>
        </div>
      </div>
    </section>
  );
}
