"use client";

import { CountUp } from "@/components/ui/motion";
import { Users, Shield, Trophy } from "lucide-react";

export function TrustBar() {
  return (
    <section 
      className="py-6 md:py-8 overflow-hidden border-b border-white/5"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container-custom">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 lg:gap-24 opacity-80 animate-fade-in">
          {/* 1000+ barbearias */}
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-[#ebad04]" />
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/70">
              <CountUp end={1000} duration={2} suffix="+" className="text-[#ebad04]" /> BARBEARIAS ATIVAS
            </p>
          </div>

          {/* 100% Seguro */}
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-[#ebad04]" />
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/70">100% SEGURO & PRIVADO</span>
          </div>

          {/* Melhor sistema */}
          <div className="flex items-center gap-3">
            <Trophy className="w-4 h-4 text-[#ebad04]" />
            <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/70">LÍDER NACIONAL EM GESTÃO</span>
          </div>
        </div>
      </div>
    </section>
  );
}
