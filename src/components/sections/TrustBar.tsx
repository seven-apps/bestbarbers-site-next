"use client";

import { CountUp } from "@/components/ui/motion";
import { Users, CreditCard, CalendarCheck } from "lucide-react";

/**
 * Três provas macro, todas do conjunto oficial de divulgação
 * (knowledge/marketing/instagram-voz-do-time.md §9 — "Agregados só os oficiais:
 * 1.200+ barbearias · 51.000+ assinantes · R$5M+/mês · 6M+ agendamentos/mês").
 *
 * Saíram daqui: "1.000+ BARBEARIAS ATIVAS" (número sem fonte, que ainda contradizia
 * o 1.200+ exibido na mesma home), "100% SEGURO & PRIVADO" e "LÍDER NACIONAL EM
 * GESTÃO" — absoluto e superlativo sem lastro nenhum.
 */

export function TrustBar() {
  return (
    <section 
      className="py-6 md:py-8 overflow-hidden border-b border-white/5"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 lg:gap-24 opacity-80 animate-fade-in">
          {/* 1.200+ barbearias — agregado oficial */}
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-[#ebad04]" fill="currentColor" />
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/70">
              <CountUp end={1200} duration={2} suffix="+" className="text-[#ebad04]" /> BARBEARIAS ATIVAS
            </p>
          </div>

          {/* 51 mil+ assinantes — agregado oficial */}
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-[#ebad04]" fill="currentColor" />
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/70">51 MIL+ ASSINANTES ATIVOS</span>
          </div>

          {/* 6 mi+ agendamentos/mês — agregado oficial */}
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-4 h-4 text-[#ebad04]" fill="currentColor" />
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/70">6 MI+ AGENDAMENTOS/MÊS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
