"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui/cta-button";
import { Sparkles, Star } from "lucide-react";

interface HeroV5Props {
  onCtaClick?: () => void;
}

export function HeroV11({ onCtaClick }: HeroV5Props) {
  return (
    <section
      className="relative pt-20 md:pt-24 lg:pt-28 pb-10 md:pb-14 lg:pb-20 flex justify-center items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffaf02 0%, #ffbe33 55%, #ffaf02 100%)",
      }}
    >
      {/* Padrão sutil */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Glows de profundidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/15 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-white/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-black/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* COLUNA 1 — Texto + CTA */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Top badge — SUPER OFERTA em 2 linhas */}
            <div className="mb-4 md:mb-5 animate-scale-in" style={{ animationDelay: "0.05s" }}>
              <div className="inline-flex flex-col items-center gap-0.5 px-5 py-2 bg-black/90 rounded-2xl text-white shadow-lg backdrop-blur-sm">
                <span className="inline-flex items-center gap-1.5 text-[#ffaf02] font-extrabold text-[12px] md:text-[14px] uppercase tracking-[0.15em]">
                  <Sparkles className="w-3.5 h-3.5" />
                  SUPER OFERTA IMPERDÍVEL
                </span>
              </div>
            </div>

            {/* Headline — punch máximo, highlight em chip preto+amarelo */}
            <h1
              className="font-extrabold leading-[1.05] tracking-tight text-[#0a0a0a] mb-3 md:mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.12s" }}
            >
              <span className="block text-[34px] sm:text-[34px] md:text-[42px] lg:text-[48px] xl:text-[56px]">App Próprio Personalizado</span>
              <span className="block text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] xl:text-[38px] mt-1">da sua barbearia</span>

              <span
                className="inline-block mt-3 md:mt-4 px-6 py-2 md:px-7 md:py-2.5 rounded-xl shadow-md text-[30px] sm:text-[30px] md:text-[36px] lg:text-[42px]"
                style={{ backgroundColor: "#0a0a0a", color: "#ffaf02" }}
              >
                100% GRATUITO
              </span>
              <span className="block text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] mt-3 md:mt-4 font-bold">Sem taxa de implantação</span>
            </h1>

            {/* Sub — clareza */}
            <p
              className="text-[15px] md:text-[17px] lg:text-[18px] font-semibold leading-relaxed text-[#0a0a0a]/85 max-w-xl mb-4 animate-fade-in-up"
              style={{ animationDelay: "0.22s" }}
            >
              Você só paga a mensalidade do sistema — a partir de R$299/mês
            </p>

            {/* MOBILE — Mockup compacto integrado com floating cards */}
            <div className="lg:hidden w-full mb-5 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="relative max-w-[420px] sm:max-w-[480px] mx-auto -mt-10">
                <Image
                  src="/images/lp-v5-app-dashboard-mockup.png"
                  alt="App próprio + dashboard BestBarbers"
                  width={480}
                  height={388}
                  sizes="(max-width: 640px) 420px, 480px"
                  className="w-full h-auto drop-shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                  priority
                  fetchPriority="high"
                />

                {/* Floating proof — 5★ (canto superior direito, sobre o topo do macbook) */}
                <div className="absolute top-10 right-2 bg-white rounded-xl shadow-2xl px-2.5 py-1.5 flex items-center gap-1.5 hero-float-a z-20">
                  <div className="flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-[#ffaf02] text-[#ffaf02]" />
                    ))}
                  </div>
                  <span className="text-[11px] font-extrabold text-[#0a0a0a]">5.0</span>
                </div>

                {/* Floating proof — ECONOMIA (parte inferior do iPhone, mais pra baixo) */}
                <div className="absolute bottom-[1%] left-2 bg-[#ffaf02] rounded-xl shadow-2xl px-3 py-2 flex items-center gap-2 hero-float-b ring-2 ring-black/90 z-20">
                  <span className="text-[#0a0a0a] font-extrabold text-base">−</span>
                  <div className="leading-tight">
                    <p className="text-[9px] text-[#0a0a0a]/80 font-extrabold uppercase tracking-wide">Você economiza</p>
                    <p className="text-[13px] text-[#0a0a0a] font-extrabold">R$ 3.000</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA principal */}
            <div className="animate-fade-in-up w-full sm:w-auto" style={{ animationDelay: "0.4s" }}>
              <div className="rounded-full animate-pulse-glow w-full sm:w-auto">
                <CTAButton
                  onClick={onCtaClick}
                  variant="secondary"
                  size="lg"
                  icon={true}
                  className="w-full sm:w-auto !shadow-[0_10px_44px_rgba(2,171,21,0.55)] hover:!shadow-[0_14px_54px_rgba(2,171,21,0.65)]"
                >
                  QUERO MEU APP PRÓPRIO
                </CTAButton>
              </div>
            </div>

          </div>

          {/* COLUNA 2 — Mockup desktop com floating cards */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            <div className="relative w-full max-w-[520px]">
              <Image
                src="/images/lp-v5-app-dashboard-mockup.png"
                alt="App próprio + dashboard financeiro BestBarbers"
                width={560}
                height={460}
                sizes="(max-width: 1024px) 0px, 520px"
                className="w-full h-auto drop-shadow-[0_25px_60px_rgba(0,0,0,0.3)]"
                priority
                fetchPriority="high"
              />

              {/* Floating: 5 estrelas */}
              <div className="absolute -top-4 -right-2 bg-white rounded-2xl shadow-2xl px-4 py-2.5 flex items-center gap-2 hero-float-a">
                <div className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#ffaf02] text-[#ffaf02]" />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">App Store</p>
                  <p className="text-sm text-[#0a0a0a] font-extrabold">5.0 ★</p>
                </div>
              </div>

              {/* Floating: ECONOMIA da oferta (alto contraste) */}
              <div className="absolute top-1/3 -left-6 bg-[#ffaf02] rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 hero-float-b ring-2 ring-black">
                <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-[#ffaf02] font-extrabold text-xl">−</span>
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-[#0a0a0a]/80 font-extrabold uppercase tracking-wide">Você economiza</p>
                  <p className="text-lg text-[#0a0a0a] font-extrabold">R$ 3.000,00</p>
                  <p className="text-[10px] text-[#0a0a0a]/70 font-bold">taxa de implantação zerada</p>
                </div>
              </div>

              {/* Floating: assinantes counter */}
              <div className="absolute bottom-4 -right-4 bg-white rounded-2xl shadow-2xl px-4 py-3 hero-float-a">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Assinantes ativos</p>
                <p className="text-2xl text-[#0a0a0a] font-extrabold">353</p>
                <p className="text-[10px] text-emerald-600 font-bold">↑ +12 esta semana</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations locais */}
      <style jsx>{`
        @keyframes hero-float-a {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes hero-float-b {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(8px); }
        }
        :global(.hero-float-a) {
          animation: hero-float-a 4s ease-in-out infinite;
        }
        :global(.hero-float-b) {
          animation: hero-float-b 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
