import { ArrowRight, Check, X } from "lucide-react";
import { clubeContent } from "@/content/clube";

interface ComparativoClubeProps {
  onCtaClick: () => void;
}

/**
 * Seção 2 da página /clube — a GRANDE PROMESSA em contraste dramático.
 * Estrutura promessa → dor → solução (brief do André, 28/Ago):
 * título-promessa imponente; card SEM com a dor escancarada (X vermelhos,
 * VOC real do FDO); card COM como herói com número-herói literal do
 * cases-clube.json (bb#16402) e CTA de desejo.
 * originDesc: [Site-Clube]BT-Comparativo.
 */
export function ComparativoClube({ onCtaClick }: ComparativoClubeProps) {
  const { comparativo } = clubeContent;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#121212] overflow-x-hidden">
      <div className="container-custom">
        {/* Promessa */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#ffaf02]/10 border border-[#ffaf02]/20 text-[#ffaf02] text-[11px] md:text-xs font-bold uppercase tracking-widest mb-5">
            {comparativo.kicker}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
            {comparativo.title.main}
            <span style={{ color: "#ffaf02" }}>
              {comparativo.title.highlight}
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mt-4">
            {comparativo.sub}
          </p>
        </div>

        {/* Dor × Solução */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[10fr_11fr] gap-6 md:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Selo VS central (desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-[#121212] border-2 border-[#ffaf02] items-center justify-center shadow-[0_0_30px_rgba(255,175,2,0.35)]">
            <span className="text-[#ffaf02] font-extrabold text-base tracking-wide">
              VS
            </span>
          </div>

          {/* Card SEM CLUBE — a dor escancarada */}
          <div className="flex flex-col bg-[#1a1416] border border-red-500/20 rounded-3xl p-6 md:p-8">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[11px] md:text-xs font-bold uppercase tracking-widest mb-5">
              {comparativo.sem.badge}
            </span>

            <h3 className="text-2xl md:text-[28px] font-extrabold text-gray-200 leading-tight mb-6">
              {comparativo.sem.title}
            </h3>

            <ul className="space-y-4">
              {comparativo.sem.itens.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm md:text-[15px] leading-snug text-gray-400"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500/15 shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-400" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <blockquote className="mt-auto pt-6">
              <p className="border-l-2 border-red-500/50 pl-4 text-base md:text-lg italic text-gray-300 leading-snug">
                {comparativo.sem.voc}
              </p>
              <p className="pl-4 mt-2 text-xs text-gray-500">
                {comparativo.sem.vocLabel}
              </p>
            </blockquote>
          </div>

          {/* Card COM CLUBE — a solução que brilha */}
          <div className="flex flex-col rounded-3xl p-6 md:p-8 border-2 border-[#ffaf02] bg-gradient-to-b from-[#ffaf02]/[0.10] to-white/[0.03] shadow-[0_0_60px_rgba(255,175,2,0.16)]">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#ffaf02] text-[#121212] text-[11px] md:text-xs font-extrabold uppercase tracking-widest mb-5">
              {comparativo.com.badge}
            </span>

            <h3 className="text-2xl md:text-[28px] font-extrabold text-white leading-tight mb-5">
              {comparativo.com.title}
            </h3>

            {/* Número-herói */}
            <div className="mb-2">
              <p className="font-extrabold leading-none tracking-tight">
                <span
                  className="text-5xl md:text-6xl text-[#ffaf02]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {comparativo.com.heroNumero}
                </span>
                <span className="text-lg md:text-xl text-white/90 ml-2">
                  {comparativo.com.heroSufixo}
                </span>
              </p>
            </div>
            <p className="text-sm md:text-[15px] text-gray-300 leading-relaxed border-b border-white/10 pb-5 mb-5">
              {comparativo.com.heroDerivacao}
            </p>

            <ul className="space-y-3.5 mb-7">
              {comparativo.com.itens.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm md:text-[15px] leading-snug text-white"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ffaf02]/20 shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#ffaf02]" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onCtaClick}
              className="mt-auto inline-flex items-center justify-center min-h-[44px] gap-2 bg-[#ffaf02] text-[#121212] font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_14px_rgba(255,175,2,0.4)]"
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
