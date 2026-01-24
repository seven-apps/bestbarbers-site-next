"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/motion";
import { Users, Shield, Trophy } from "lucide-react";

export function TrustBar() {
  return (
    <section className="bg-gradient-to-r from-[#0f0f0f] via-[#141414] to-[#0f0f0f] py-4 md:py-5 overflow-hidden border-y border-white/5">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8 lg:gap-12"
        >
          {/* 1000+ barbearias */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#ffaf02]" />
            <p className="text-[10px] sm:text-[11px] md:text-sm font-bold text-white whitespace-nowrap">
              <CountUp end={1000} duration={2} suffix="+" className="text-[#ffaf02]" /> barbearias
            </p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-gray-700" />

          {/* 100% Seguro */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-emerald-400" />
            <span className="text-[10px] sm:text-[11px] md:text-sm font-bold text-white whitespace-nowrap">100% Seguro</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-gray-700" />

          {/* Melhor sistema */}
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#ffaf02]" />
            <span className="text-[10px] sm:text-[11px] md:text-sm font-bold text-white whitespace-nowrap">Melhor sistema do Brasil</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
