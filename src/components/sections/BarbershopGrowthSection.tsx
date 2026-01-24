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
    highlight: "Inovação que impressiona e reduz custos",
    subtitle: "O totem agiliza check-in e pagamento, organiza fluxo e profissionaliza a experiência.",
    description: "Menos tempo resolvendo rotina, mais tempo atendendo.",
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

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Resume after 10 seconds
    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
      setProgressKey(prev => prev + 1);
    }, 10000);
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % benefits.length);
      setProgressKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Cleanup timeout on unmount
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
      className="pt-16 md:pt-20 lg:pt-24 pb-4 md:pb-6 overflow-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-10 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-bg2 mb-3">
            Tudo o que você precisa para{" "}
            <span className="text-white drop-shadow-sm">lucrar mais</span>
          </h2>
          <p className="text-base md:text-lg text-neutral-bg2 font-medium max-w-2xl mx-auto">
            Ferramentas completas para transformar sua barbearia em um negócio lucrativo
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {benefits.map((benefit, index) => (
            <button
              key={benefit.id}
              onClick={() => handleTabClick(index)}
              className={`flex items-center gap-2 px-5 py-3 md:px-6 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${activeTab === index
                ? "bg-black text-white shadow-xl"
                : "bg-white/90 text-neutral-bg2 hover:bg-white hover:shadow-lg"
                }`}
            >
              <benefit.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base">{benefit.title}</span>
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div
          className="max-w-5xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setProgressKey(prev => prev + 1);
          }}
        >
          <div className="bg-white h-[470px] md:h-auto lg:h-auto rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden">
            {/* Content with CSS transitions instead of AnimatePresence */}
            <div className="flex flex-col md:flex-row min-h-[280px] md:min-h-[320px] lg:min-h-[360px] relative">
              {/* Vertical divider line - desktop only */}
              <div className="hidden md:block absolute left-1/2 top-[10%] bottom-[10%] w-px bg-gray-200" />

              {/* Text Content */}
              <div className="flex-1 p-6 md:p-8 lg:p-10 pb-0 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: `${activeBenefit.accentColor}15` }}
                  >
                    <activeBenefit.icon
                      className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-300"
                      style={{ color: activeBenefit.accentColor }}
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-black">
                    {activeBenefit.title}
                  </h3>
                </div>

                <h4
                  className="text-xl md:text-2xl lg:text-3xl font-bold mb-3"
                  style={{ color: "#ffaf02" }}
                >
                  {activeBenefit.highlight}
                </h4>

                <p className="text-black font-medium text-sm md:text-base mb-2">
                  {activeBenefit.subtitle}
                </p>

                <p className="text-gray-500 text-sm">
                  {activeBenefit.description}
                </p>
              </div>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 min-h-[200px] md:min-h-full !bg-[#FFFFFF]">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={activeBenefit.src}
                    alt={activeBenefit.title}
                    width={400}
                    height={300}
                    className="w-full max-w-[350px] h-[180px] md:h-auto lg:h-auto max-h-[250px] object-contain transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots with Progress - CSS animation */}
          <div className="flex justify-center gap-3 mt-6">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`relative h-2 rounded-full transition-all duration-300 overflow-hidden ${activeTab === index
                  ? "w-12 bg-neutral-bg2/30"
                  : "w-2 bg-neutral-bg2/30 hover:bg-neutral-bg2/50"
                  }`}
              >
                {activeTab === index && (
                  <div
                    key={progressKey}
                    className="absolute inset-0 bg-neutral-bg2 rounded-full"
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

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
