import { ArrowRight, Repeat } from "lucide-react";
import { clubeContent } from "@/content/clube";

interface MigracaoBandaClubeProps {
  onCtaClick: () => void;
}

/**
 * Faixa compacta do migrador — herdeira da antiga seção-fork.
 * Posicionada após os depoimentos (o migrador já viu prova) e antes do
 * passo a passo (que trata a migração como pauta da primeira conversa).
 * originDesc: [Site-Clube]BT-Migracao.
 */
export function MigracaoBandaClube({ onCtaClick }: MigracaoBandaClubeProps) {
  const { migracaoBanda } = clubeContent;

  return (
    <section className="py-12 md:py-16 bg-[#121212] overflow-x-hidden">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffaf02]/10 border border-[#ffaf02]/20 text-[#ffaf02] text-[11px] md:text-xs font-bold uppercase tracking-widest mb-4">
              <Repeat className="w-3.5 h-3.5" />
              {migracaoBanda.kicker}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              {migracaoBanda.title}
            </h3>
            <p className="text-sm md:text-[15px] leading-relaxed text-gray-400">
              {migracaoBanda.linha}
            </p>
          </div>
          <button
            onClick={onCtaClick}
            className="shrink-0 inline-flex items-center justify-center min-h-[44px] gap-2 border-2 border-[#ffaf02] text-[#ffaf02] font-bold text-sm px-6 py-4 rounded-2xl transition-all duration-300 hover:bg-[#ffaf02] hover:text-[#121212] hover:scale-[1.02] active:scale-[0.98]"
          >
            {migracaoBanda.cta}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}
