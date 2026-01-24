"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/motion";
import { Users, Shield, Trophy } from "lucide-react";

export function TrustBar() {
  return (
    <section className="bg-[#121212] py-3 md:py-4 overflow-hidden">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3 md:gap-8 lg:gap-12"
        >
          {/* 1000+ barbearias */}
          <div className="flex items-center gap-1 md:gap-2">
            <Users className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#ffaf02]" />
            <p className="text-[10px] md:text-sm font-bold text-white whitespace-nowrap">
              <CountUp end={1000} duration={2} suffix="+" className="text-[#ffaf02]" /> barbearias
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-3 md:h-4 bg-gray-600" />

          {/* 100% Seguro */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <Shield className="w-3.5 h-3.5 md:w-5 md:h-5 text-blue-400" />
            <span className="text-[10px] md:text-sm font-bold text-white whitespace-nowrap">100% Seguro</span>
          </div>

          {/* Divider */}
          <div className="w-px h-3 md:h-4 bg-gray-600" />

          {/* Melhor sistema */}
          <div className="flex items-center gap-1 md:gap-1.5">
            <Trophy className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#ffaf02]" />
            <span className="text-[10px] md:text-sm font-bold text-white whitespace-nowrap">Melhor sistema do Brasil</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
