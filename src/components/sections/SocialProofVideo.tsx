"use client";

import { useState } from "react";
import { Play, Star, Quote } from "lucide-react";
import type { Testimonial } from "@/data/lp-variants";

interface SocialProofVideoProps {
  videoUrl?: string;
  testimonials: Testimonial[];
}

export function SocialProofVideo({ videoUrl, testimonials }: SocialProofVideoProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="bg-[#0a0a0a] py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-4">
        {/* Video facade */}
        {videoUrl && (
          <div className="mb-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#151515] border border-white/5 max-w-3xl mx-auto shadow-[0_0_80px_rgba(255,175,2,0.06)]">
              {!videoLoaded ? (
                <button
                  type="button"
                  onClick={() => setVideoLoaded(true)}
                  className="absolute inset-0 flex flex-col items-center justify-center group"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[#ffaf02] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,175,2,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_80px_rgba(255,175,2,0.4)] transition-all duration-300">
                    <Play className="w-7 h-7 md:w-8 md:h-8 text-black ml-1" />
                  </div>
                  <span className="mt-3 text-white/40 text-xs font-medium">
                    Assistir depoimento
                  </span>
                </button>
              ) : (
                <iframe
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Depoimento BestBarbers"
                />
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffaf02]/10 border border-[#ffaf02]/20 rounded-full text-[#ffaf02] text-[11px] font-bold mb-3">
            <Star className="w-3 h-3" />
            RESULTADOS REAIS
          </span>
          <h2 className="text-lg md:text-xl font-extrabold text-white">
            O que donos de barbearia dizem
          </h2>
        </div>

        {/* Testimonials — V5 styling: gradient cards, staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-5 hover:border-[#ffaf02]/20 hover:shadow-[0_0_30px_rgba(255,175,2,0.06)] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.15}s` }}
            >
              <Quote className="w-5 h-5 text-[#ffaf02]/30 mb-2" />
              <p className="text-white/90 text-sm font-medium italic leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-gray-800/30 pt-3">
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-gray-500 text-[11px] mt-0.5">{t.detail}</p>
                <span className="inline-block mt-2 px-2.5 py-1 bg-[#ffaf02]/10 rounded-full text-[#ffaf02] text-[11px] font-bold">
                  {t.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Consolidated stats — V5 styling: larger, golden */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-white/5">
          {[
            { value: "1.200+", label: "barbearias" },
            { value: "51K+", label: "assinantes" },
            { value: "R$5M+", label: "processado/mes" },
            { value: "5.0 \u2605", label: "App Store" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="text-[#ffaf02] font-extrabold text-2xl md:text-3xl">
                {stat.value}
              </div>
              <div className="text-gray-500 text-[11px] font-medium mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
