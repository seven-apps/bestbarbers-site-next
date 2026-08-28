import { ArrowRight, Check, Minus } from "lucide-react";
import { clubeContent } from "@/content/clube";

interface ComparativoClubeProps {
  onCtaClick: () => void;
}

/**
 * Seção 2 da página /clube — comparativo "rodar COM clube × rodar SEM clube".
 * A promessa de resultado logo após o hero: o card SEM é o contraste sóbrio
 * (sem número de medo), o card COM é o herói com o desejo e o case.
 * Mesma estética da seção-fork original (dois cards dark).
 * originDesc: [Site-Clube]BT-Comparativo.
 */
export function ComparativoClube({ onCtaClick }: ComparativoClubeProps) {
  const { comparativo } = clubeContent;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#121212] overflow-x-hidden">
      <div className="container-custom">
        {/* Título */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white">
            {comparativo.title.main}
            <span style={{ color: "#ffaf02" }}>{comparativo.title.highlight}</span>
          </h2>
        </div>

        {/* Dois cards: SEM (contraste sóbrio) × COM (herói) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card SEM CLUBE */}
          <div className="flex flex-col bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[11px] md:text-xs font-bold uppercase tracking-widest mb-5">
              {comparativo.sem.badge}
            </span>

            <h3 className="text-xl md:text-2xl font-bold text-gray-300 mb-5">
              {comparativo.sem.title}
            </h3>

            <ul className="space-y-3.5">
              {comparativo.sem.itens.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm md:text-[15px] leading-snug text-gray-500"
                >
                  <Minus className="w-4 h-4 shrink-0 mt-0.5 text-gray-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card COM CLUBE (herói) */}
          <div className="flex flex-col bg-white/[0.04] border border-[#ffaf02]/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(255,175,2,0.10)]">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#ffaf02]/10 border border-[#ffaf02]/20 text-[#ffaf02] text-[11px] md:text-xs font-bold uppercase tracking-widest mb-5">
              {comparativo.com.badge}
            </span>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-5">
              {comparativo.com.title}
            </h3>

            <ul className="space-y-3.5 mb-6">
              {comparativo.com.itens.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-sm md:text-[15px] leading-snug text-gray-200"
                >
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#ffaf02]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm md:text-[15px] leading-relaxed text-gray-300 border-t border-white/10 pt-4 mb-7">
              {comparativo.com.caseLinha}
            </p>

            <button
              onClick={onCtaClick}
              className="mt-auto inline-flex items-center justify-center min-h-[44px] gap-2 bg-[#ffaf02] text-[#121212] font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              {comparativo.com.cta}
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
