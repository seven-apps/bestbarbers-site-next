import { ArrowRight, Check, MoveRight, Sparkles, Repeat } from "lucide-react";
import { clubeContent } from "@/content/clube";

interface ForkClubeProps {
  onCriarClick: () => void;
  onMigrarClick: () => void;
}

/**
 * Seção-fork "Vai criar o clube — ou trazer um que já existe?"
 * Único componente sem espelho na homepage. Dois cards, mesmo modal,
 * originDescs distintos: [Site-Clube]BT-Criar e [Site-Clube]BT-Migracao.
 */
export function ForkClube({ onCriarClick, onMigrarClick }: ForkClubeProps) {
  const { fork } = clubeContent;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#121212] overflow-x-hidden">
      <div className="container-custom">
        {/* Título */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight text-white">
            {fork.title.main}
            <span style={{ color: "#ffaf02" }}>{fork.title.highlight}</span>
          </h2>
        </div>

        {/* Dois cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card CRIAR */}
          <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#ffaf02]/30 transition-colors duration-300">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#ffaf02]/10 border border-[#ffaf02]/20 text-[#ffaf02] text-[11px] md:text-xs font-bold uppercase tracking-widest mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              {fork.criar.kicker}
            </span>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              {fork.criar.title}
            </h3>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-5">
              {fork.criar.description}
            </p>

            <ul className="space-y-3 mb-8">
              {fork.criar.itens.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm md:text-[15px] leading-snug"
                >
                  <Check className="w-4 h-4 text-[#ffaf02] shrink-0 mt-0.5" />
                  <span className="text-gray-200">{item}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onCriarClick}
              className="mt-auto inline-flex items-center justify-center gap-2 bg-[#ffaf02] text-[#121212] font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              {fork.criar.cta}
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {/* Card MIGRAR */}
          <div className="flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#ffaf02]/30 transition-colors duration-300">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-[#ffaf02]/10 border border-[#ffaf02]/20 text-[#ffaf02] text-[11px] md:text-xs font-bold uppercase tracking-widest mb-5">
              <Repeat className="w-3.5 h-3.5" />
              {fork.migrar.kicker}
            </span>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              {fork.migrar.title}
            </h3>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-5">
              {fork.migrar.description}
            </p>

            {/* 4 pares antes → depois */}
            <ul className="space-y-3 mb-8">
              {fork.migrar.pares.map((par, index) => (
                <li
                  key={index}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-[15px] leading-snug"
                >
                  <span className="text-gray-500">{par.antes}</span>
                  <span className="inline-flex items-center gap-2 text-white font-semibold">
                    <MoveRight className="w-4 h-4 text-[#ffaf02] shrink-0" />
                    {par.depois}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={onMigrarClick}
              className="mt-auto inline-flex items-center justify-center gap-2 border-2 border-[#ffaf02] text-[#ffaf02] font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-[#ffaf02] hover:text-[#121212] hover:scale-[1.02] active:scale-[0.98]"
            >
              {fork.migrar.cta}
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
