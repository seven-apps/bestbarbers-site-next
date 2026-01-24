"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  const activeBenefit = benefits[activeTab];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % benefits.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      id="growth-section"
      className="pt-16 md:pt-20 lg:pt-24 pb-4 md:pb-6 overflow-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="container-custom">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-bg2 mb-3">
            Tudo o que você precisa para{" "}
            <span className="text-white drop-shadow-sm">lucrar mais</span>
          </h2>
          <p className="text-base md:text-lg text-neutral-bg2 font-medium max-w-2xl mx-auto">
            Ferramentas completas para transformar sua barbearia em um negócio lucrativo
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10"
        >
          {benefits.map((benefit, index) => (
            <button
              key={benefit.id}
              onClick={() => {
                setActiveTab(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 10000);
              }}
              className={`flex items-center gap-2 px-5 py-3 md:px-6 md:py-3.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${activeTab === index
                ? "bg-black text-white shadow-xl"
                : "bg-white/90 text-neutral-bg2 hover:bg-white hover:shadow-lg"
                }`}
            >
              <benefit.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base">{benefit.title}</span>
            </button>
          ))}
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row min-h-[280px] md:min-h-[320px] lg:min-h-[360px] relative"
              >
                {/* Vertical divider line - desktop only */}
                <div className="hidden md:block absolute left-1/2 top-[10%] bottom-[10%] w-px bg-gray-200" />

                {/* Text Content */}
                <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${activeBenefit.accentColor}15` }}
                    >
                      <activeBenefit.icon
                        className="w-5 h-5 md:w-6 md:h-6"
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
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src={activeBenefit.src}
                      alt={activeBenefit.title}
                      width={400}
                      height={300}
                      className="w-full max-w-[350px] h-auto max-h-[280px] object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots with Progress */}
          <div className="flex justify-center gap-3 mt-6">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                className={`relative h-2 rounded-full transition-all duration-300 overflow-hidden ${activeTab === index
                  ? "w-12 bg-neutral-bg2/30"
                  : "w-2 bg-neutral-bg2/30 hover:bg-neutral-bg2/50"
                  }`}
              >
                {activeTab === index && (
                  <motion.div
                    className="absolute inset-0 bg-neutral-bg2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isPaused ? "100%" : "100%" }}
                    transition={{
                      duration: isPaused ? 0 : 5,
                      ease: "linear"
                    }}
                    key={`${activeTab}-${isPaused}`}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
