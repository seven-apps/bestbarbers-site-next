"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui/cta-button";

interface HeroV12Props {
  onCtaClick?: () => void;
}

export function HeroV12({ onCtaClick }: HeroV12Props) {
  return (
    <section
      className="pt-32 pb-12 md:py-40 relative overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grain texture overlay — assinatura visual da marca */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.02,
          mixBlendMode: "overlay",
        }}
      />

      {/* Bokeh / Glow Effects — Apenas na parte superior de forma discreta */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow Principal Superior */}
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] md:w-[100%] max-w-[800px] h-[400px] rounded-full opacity-[0.06] md:opacity-[0.08] animate-pulse"
          style={{
            background: "radial-gradient(ellipse, #ebad04 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDuration: "12s",
          }}
        />
        {/* Glow Secundário Superior Esquerdo */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] rounded-full opacity-[0.04] md:opacity-[0.05] animate-pulse"
          style={{
            background: "radial-gradient(circle, #ebad04 0%, transparent 70%)",
            filter: "blur(80px)",
            animationDelay: "2s",
            animationDuration: "15s",
          }}
        />
        {/* Glow Secundário Superior Direito */}
        <div
          className="absolute top-[-5%] right-[-10%] w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full opacity-[0.04] md:opacity-[0.05] animate-pulse"
          style={{
            background: "radial-gradient(circle, #ebad04 0%, transparent 70%)",
            filter: "blur(80px)",
            animationDelay: "5s",
            animationDuration: "14s",
          }}
        />
      </div>

      <div className="container-custom relative z-10 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-14 items-center max-w-6xl mx-auto">

          {/* COLUNA 1 — Texto + CTA */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Badge de oferta — urgência imediata */}
            <div className="mb-5 md:mb-6 animate-scale-in" style={{ animationDelay: "0.05s" }}>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: "rgba(235,173,4,0.12)",
                  borderColor: "rgba(235,173,4,0.35)",
                }}
              >
                <span
                  className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#ebad04", fontFamily: "var(--font-montserrat)" }}
                >
                  Oferta Limitada — Implantação 100% gratuita
                </span>
              </div>
            </div>

            {/* Headline principal — tipografia Vollkorn editorial */}
            <h1
              className="leading-[1.0] tracking-tight text-white mb-5 md:mb-6 animate-fade-in-up"
              style={{
                fontFamily: "var(--font-vollkorn)",
                animationDelay: "0.1s",
              }}
            >
              <span
                className="block"
                style={{ fontSize: "clamp(40px, 8vw, 68px)", fontWeight: 800 }}
              >
                Seu app.
              </span>
              <span
                className="block"
                style={{ fontSize: "clamp(40px, 8vw, 68px)", fontWeight: 800 }}
              >
                Sua marca.
              </span>
              <span
                className="block mt-3 md:mt-4"
                style={{
                  fontSize: "clamp(32px, 6vw, 52px)",
                  fontWeight: 700,
                  color: "#ebad04",
                }}
              >
                Zero de implantação.
              </span>
            </h1>

            {/* Sub — copy objetiva e persuasiva */}
            <p
              className="text-[15px] md:text-[17px] leading-relaxed mb-2 animate-fade-in-up max-w-lg"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 500,
                animationDelay: "0.2s",
              }}
            >
              A maior plataforma de barbearia do Brasil cria seu app do zero.
              Você só paga a mensalidade.
            </p>
            <p
              className="text-[13px] md:text-[14px] mb-6 md:mb-8 animate-fade-in-up"
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                animationDelay: "0.25s",
              }}
            >
              Outros sistemas cobram R$3.000 a R$5.000 só pra começar.
            </p>

            {/* MOBILE — mockup antes do CTA */}
            <div
              className="lg:hidden w-full mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.28s" }}
            >
              <div className="relative max-w-[400px] sm:max-w-[460px] mx-auto">
                <Image
                  src="/images/lp-v5-app-dashboard-mockup.png"
                  alt="App próprio BestBarbers com dashboard financeiro"
                  width={460}
                  height={372}
                  sizes="(max-width: 640px) 400px, 460px"
                  className="w-full h-auto"
                  style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))" }}
                  priority
                  fetchPriority="high"
                />

                {/* Floating: economia */}
                <div
                  className="absolute bottom-[6%] left-1 rounded-xl px-3 py-2 flex items-center gap-2 hero-float-b z-20"
                  style={{
                    background: "#ebad04",
                    border: "2px solid #0a0a0a",
                    boxShadow: "0 8px 24px rgba(235,173,4,0.35)",
                  }}
                >
                  <div className="leading-tight">
                    <p
                      className="text-[9px] font-bold uppercase tracking-wide"
                      style={{ color: "rgba(30,30,30,0.7)", fontFamily: "var(--font-montserrat)" }}
                    >
                      Você economiza
                    </p>
                    <p
                      className="text-[14px] font-extrabold"
                      style={{ color: "#0a0a0a", fontFamily: "var(--font-vollkorn)" }}
                    >
                      R$ 3.000
                    </p>
                  </div>
                </div>

                {/* Floating: assinantes */}
                <div
                  className="absolute top-8 right-0 rounded-xl px-3 py-2 hero-float-a z-20"
                  style={{
                    background: "#fafafa",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                  }}
                >
                  <p
                    className="text-[9px] font-bold uppercase tracking-wide"
                    style={{ color: "#0a0a0a", fontFamily: "var(--font-montserrat)", opacity: 0.6 }}
                  >
                    Barbearias cadastradas
                  </p>
                  <p
                    className="text-[20px] font-extrabold leading-tight"
                    style={{ color: "#0a0a0a", fontFamily: "var(--font-vollkorn)" }}
                  >
                    353
                  </p>
                  <p
                    className="text-[9px] font-semibold"
                    style={{ color: "#16a34a", fontFamily: "var(--font-montserrat)" }}
                  >
                    ↑ +12 esta semana
                  </p>
                </div>
              </div>
            </div>

            {/* CTA principal */}
            <div
              className="animate-fade-in-up w-full sm:w-auto"
              style={{ animationDelay: "0.35s" }}
            >
              <CTAButton
                onClick={onCtaClick}
                variant="secondary"
                size="lg"
                icon={true}
                className="w-full sm:w-auto !text-[15px] !py-5 !px-10"
              >
                QUERO MEU APP AGORA
              </CTAButton>
              <p
                className="mt-3 text-[12px] text-center lg:text-left"
                style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", fontWeight: 500, opacity: 0.7 }}
              >
                A partir de R$299/mês · Sem fidelidade · Cancele quando quiser
              </p>
            </div>
          </div>

          {/* COLUNA 2 — Mockup desktop */}
          <div
            className="hidden lg:flex justify-center items-end animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative w-full max-w-[520px]">
              <Image
                src="/images/lp-v5-app-dashboard-mockup.png"
                alt="App próprio + dashboard financeiro BestBarbers"
                width={560}
                height={460}
                sizes="520px"
                className="w-full h-auto"
                style={{ filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.55))" }}
                priority
                fetchPriority="high"
              />

              {/* Floating: economia */}
              <div
                className="absolute top-1/3 -left-6 rounded-2xl px-4 py-3 flex items-center gap-3 hero-float-b"
                style={{
                  background: "#ebad04",
                  border: "2px solid #0a0a0a",
                  boxShadow: "0 12px 40px rgba(235,173,4,0.35)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "#0a0a0a" }}
                >
                  <span
                    className="font-extrabold text-xl"
                    style={{ color: "#ebad04", fontFamily: "var(--font-vollkorn)" }}
                  >
                    −
                  </span>
                </div>
                <div className="leading-tight">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: "rgba(30,30,30,0.7)", fontFamily: "var(--font-montserrat)" }}
                  >
                    Você economiza
                  </p>
                  <p
                    className="text-lg font-extrabold"
                    style={{ color: "#0a0a0a", fontFamily: "var(--font-vollkorn)" }}
                  >
                    R$ 3.000,00
                  </p>
                  <p
                    className="text-[10px] font-semibold"
                    style={{ color: "rgba(30,30,30,0.6)", fontFamily: "var(--font-montserrat)" }}
                  >
                    taxa de implantação zerada
                  </p>
                </div>
              </div>

              {/* Floating: assinantes */}
              <div
                className="absolute bottom-6 -right-4 rounded-2xl px-4 py-3 hero-float-a"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: "#0a0a0a", fontFamily: "var(--font-montserrat)", opacity: 0.6 }}
                >
                  Assinantes ativos
                </p>
                <p
                  className="text-2xl font-extrabold leading-tight"
                  style={{ color: "#0a0a0a", fontFamily: "var(--font-vollkorn)" }}
                >
                  353
                </p>
                <p
                  className="text-[10px] font-semibold"
                  style={{ color: "#16a34a", fontFamily: "var(--font-montserrat)" }}
                >
                  ↑ +12 esta semana
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divisor diagonal para próxima seção */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 md:h-16 pointer-events-none z-10"
        style={{
          background: "#0a0a0a",
          clipPath: "polygon(0 60%, 100% 0%, 100% 100%, 0% 100%)",
        }}
      />

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
