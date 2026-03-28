"use client";

import Image from "next/image";
import type { LPMetric } from "@/data/lp-variants";

interface ProofStripProps {
  metrics: LPMetric[];
}

const logos = [
  "/images/Barber-Style.webp",
  "/images/Sr-Barbearia.webp",
  "/images/Premium.webp",
  "/images/Black-House.webp",
  "/images/James.webp",
  "/images/Ferrari.webp",
];

export function ProofStrip({ metrics }: ProofStripProps) {
  return (
    <section className="bg-gradient-to-r from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border-y border-white/5 py-4 md:py-5">
      <div className="max-w-6xl mx-auto px-4">
        {/* Mobile: 2x2 grid. Desktop: flex row with dividers + logos */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {metrics.map((m, i) => (
            <div key={i} className="text-center">
              <span className="text-[#ffaf02] font-extrabold text-base block">
                {m.value}
              </span>
              <span className="text-gray-500 text-[10px] font-medium">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop: horizontal row */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
          {metrics.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-5 bg-white/10" />}
              <div className="flex items-baseline gap-1.5">
                <span className="text-[#ffaf02] font-extrabold text-base lg:text-lg">
                  {m.value}
                </span>
                <span className="text-gray-500 text-xs font-medium">
                  {m.label}
                </span>
              </div>
            </div>
          ))}

          <div className="w-px h-5 bg-white/10" />

          <div className="flex items-center gap-2">
            {logos.map((logo, i) => (
              <Image
                key={i}
                src={logo}
                alt=""
                width={24}
                height={24}
                className="rounded-full object-cover opacity-40"
                loading="lazy"
              />
            ))}
            <span className="text-gray-600 text-[10px] font-bold">
              +1.200
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
