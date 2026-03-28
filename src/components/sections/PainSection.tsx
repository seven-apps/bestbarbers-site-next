"use client";

import { DollarSign, Clock, Lock } from "lucide-react";
import type { PainCard } from "@/data/lp-variants";

interface PainSectionProps {
  cards: PainCard[];
  transition: string;
}

const iconMap = { money: DollarSign, clock: Clock, lock: Lock };

const colorMap = {
  red: {
    text: "text-red-400",
    iconBg: "bg-red-500/15",
    cardBg: "bg-gradient-to-br from-red-500/8 to-red-900/5",
    border: "border-red-500/15",
    glow: "hover:shadow-[0_0_40px_rgba(239,68,68,0.08)]",
  },
  blue: {
    text: "text-blue-400",
    iconBg: "bg-blue-500/15",
    cardBg: "bg-gradient-to-br from-blue-500/8 to-blue-900/5",
    border: "border-blue-500/15",
    glow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]",
  },
  amber: {
    text: "text-amber-400",
    iconBg: "bg-amber-500/15",
    cardBg: "bg-gradient-to-br from-amber-500/8 to-amber-900/5",
    border: "border-amber-500/15",
    glow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]",
  },
};

export function PainSection({ cards, transition }: PainSectionProps) {
  return (
    <section className="bg-[#0a0a0a] py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cards.map((card, i) => {
            const Icon = iconMap[card.icon];
            const c = colorMap[card.color];
            return (
              <div
                key={i}
                className={`${c.cardBg} backdrop-blur-sm border ${c.border} rounded-2xl p-5 ${c.glow} transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <p className="text-white/90 text-[13px] md:text-sm font-medium leading-relaxed mb-3">
                  {card.scene}
                </p>
                <p className={`${c.text} text-xs font-bold`}>
                  {card.stat}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-8 text-sm md:text-base font-bold animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <span className="text-[#ffaf02]">{transition.split(".")[0]}.</span>
          <span className="text-white/60">{transition.substring(transition.indexOf(".") + 1)}</span>
        </p>
      </div>
    </section>
  );
}
