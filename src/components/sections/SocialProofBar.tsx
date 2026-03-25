"use client";

import { CountUp } from "@/components/ui/motion";
import { Users, TrendingUp, Headphones } from "lucide-react";

export function SocialProofBar() {
  return (
    <section className="bg-gradient-to-r from-[#0f0f0f] via-[#141414] to-[#0f0f0f] py-4 md:py-5 overflow-hidden border-y border-white/5">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8 lg:gap-12 animate-fade-in">
          {/* Case real */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#ffaf02]" />
            <p className="text-[10px] sm:text-[11px] md:text-sm font-bold text-white whitespace-nowrap">
              <CountUp end={353} duration={2} className="text-[#ffaf02]" /> assinantes = R$31.690/mes
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-gray-700" />

          {/* Implementação rápida */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-400" />
            <span className="text-[10px] sm:text-[11px] md:text-sm font-bold text-white whitespace-nowrap">App pronto em 5 dias</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-gray-700" />

          {/* Suporte real */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#ffaf02]" />
            <span className="text-[10px] sm:text-[11px] md:text-sm font-bold text-white whitespace-nowrap">Gerente dedicado via WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  );
}
