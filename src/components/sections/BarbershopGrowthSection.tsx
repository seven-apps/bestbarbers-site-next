"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { Repeat, Smartphone, MonitorSmartphone, FileText } from "lucide-react";

const benefits = [
  {
    id: "assinaturas",
    title: "Clube de assinaturas",
    highlight: "Receita recorrente, todos os meses",
    subtitle: "Transforme clientes em assinantes e traga previsibilidade para o caixa da sua barbearia.",
    description: "Menos sazonalidade e mais estabilidade financeira",
    src: "/images/gerenciamento-de-assinaturas_1.webp",
    icon: Repeat,
    accentColor: "#02ab15",
  },
  {
    id: "app",
    title: "App próprio",
    highlight: "Experiência única para seus clientes",
    subtitle: "Faça o cliente voltar sem depender de promoções e ofertas.",
    description: "Retenção, relacionamento e mais faturamento com quem você já atende.",
    src: "/images/Passo-a-passo-mockup-hoonigans_1.webp",
    icon: Smartphone,
    accentColor: "#3b82f6",
  },
  {
    id: "totem",
    title: "Totem",
    highlight: "Tecnologia, autonomia e redução de custos",
    subtitle: "O totem agiliza check-in, pagamento e eleva a experiência do seu cliente.",
    description: "Menos tempo resolvendo rotina, mais tempo para atender seu cliente melhor.",
    src: "/images/totem.png",
    icon: MonitorSmartphone,
    accentColor: "#8b5cf6",
  },
  {
    id: "financeiro",
    title: "Financeiro",
    highlight: "Gestão eficiente e livre de burocracias",
    subtitle: "Enxergue o financeiro com clareza para aumentar seu lucro.",
    description: "Notas fiscais automáticas e relatórios para decisões estratégicas.",
    src: "/images/Nota-fiscal_1.webp",
    icon: FileText,
    accentColor: "#f59e0b",
  },
];

export function BarbershopGrowthSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const activeBenefit = benefits[activeTab];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
    setIsPaused(true);
    setProgressKey(prev => prev + 1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      setProgressKey(prev => prev + 1);
    }, 10000);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % benefits.length);
      setProgressKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      id="growth-section"
      className="py-20 md:py-32 overflow-hidden border-b border-white/5"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container-custom">
        {/* Section Title estilo V12 */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 
            className="leading-[1.1] tracking-tight text-white mb-4"
            style={{ fontFamily: "var(--font-vollkorn)", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800 }}
          >
            Tudo o que você precisa para{" "}
            <span className="text-[#ebad04]">lucrar mais</span>
          </h2>
          <p 
            className="text-base md:text-lg text-white/60 font-medium max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Ferramentas completas para transformar sua barbearia em um negócio altamente lucrativo.
          </p>
        </div>

        {/* Tabs Navigation estilo V12 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {benefits.map((benefit, index) => (
            <button
              key={benefit.id}
              onClick={() => handleTabClick(index)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-500 border ${activeTab === index
                ? "bg-[#ebad04] text-[#0a0a0a] border-[#ebad04] shadow-[0_0_20px_rgba(235,173,4,0.3)]"
                : "bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.08] hover:text-white"
                }`}
              style={{ fontFamily: "var(--font-montserrat)", textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              <benefit.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === index ? "text-[#0a0a0a]" : "text-[#ebad04]"}`} />
              <span className="text-[11px] md:text-xs">{benefit.title}</span>
            </button>
          ))}
        </div>

        {/* Content Card estilo Bento V12 */}
        <div
          className="max-w-6xl mx-auto animate-fade-in-up relative"
          style={{ animationDelay: '0.2s' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setProgressKey(prev => prev + 1);
          }}
        >
          {/* Glow Effect behind Bento */}
          <div className="absolute -inset-10 bg-[#ebad04]/5 rounded-full blur-[120px] pointer-events-none" />

          <div 
            className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden relative z-10"
            style={{ backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col lg:flex-row min-h-[400px]">
              
              {/* Text Content */}
              <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border border-[#ebad04]/20"
                    style={{ background: "rgba(235,173,4,0.1)" }}
                  >
                    <activeBenefit.icon
                      className="w-6 h-6 text-[#ebad04]"
                    />
                  </div>
                  <h3 
                    className="text-lg md:text-xl font-bold text-white uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {activeBenefit.title}
                  </h3>
                </div>

                <h4
                  className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight"
                  style={{ color: "#ebad04", fontFamily: "var(--font-vollkorn)" }}
                >
                  {activeBenefit.highlight}
                </h4>

                <p 
                  className="text-white font-medium text-base md:text-lg mb-4 leading-relaxed"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {activeBenefit.subtitle}
                </p>

                <p 
                  className="text-white/50 text-sm md:text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {activeBenefit.description}
                </p>
              </div>

              {/* Image with background style */}
              <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white/[0.01] border-l border-white/5">
                <div className="relative w-full max-w-sm lg:max-w-md">
                  <Image
                    src={activeBenefit.src}
                    alt={activeBenefit.title}
                    width={450}
                    height={350}
                    className="w-full h-auto object-contain transition-all duration-700 ease-out"
                    style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.5))" }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots estilo V12 */}
          <div className="flex justify-center gap-4 mt-10">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`relative h-1 rounded-full transition-all duration-500 overflow-hidden ${activeTab === index
                  ? "w-16 bg-white/10"
                  : "w-4 bg-white/10 hover:bg-white/20"
                  }`}
              >
                {activeTab === index && (
                  <div
                    key={progressKey}
                    className="absolute inset-0 bg-[#ebad04] rounded-full shadow-[0_0_10px_#ebad04]"
                    style={{
                      animation: isPaused ? 'none' : 'progress-fill 5s linear forwards',
                      width: isPaused ? '100%' : undefined,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
