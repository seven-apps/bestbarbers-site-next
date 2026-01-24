"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type FeatureValue = boolean | string;

interface Feature {
  name: string;
  premium: FeatureValue;
  appExclusivo: FeatureValue;
}

interface FeatureGroup {
  title: string;
  features: Feature[];
}

const featureGroups: FeatureGroup[] = [
  {
    title: "Aplicativo e Identidade",
    features: [
      { name: "Aplicativo próprio personalizado (com sua marca)", premium: false, appExclusivo: true },
      { name: "Clientes acessam somente a sua barbearia", premium: false, appExclusivo: true },
      { name: "Publicado nas lojas (App Store e Play Store)", premium: false, appExclusivo: true },
      { name: "Push Notifications personalizadas", premium: false, appExclusivo: true },
    ],
  },
  {
    title: "Clube de Assinaturas",
    features: [
      { name: "Cadastro de planos limitados e ilimitados", premium: false, appExclusivo: true },
      { name: "Gestão de assinantes extrato de recebimentos", premium: false, appExclusivo: true },
      { name: "Bloqueios de agendamentos para clientes inadimplentes", premium: false, appExclusivo: true },
      { name: "LTV das assinaturas e Gestão de chargeback (30% da receita)", premium: false, appExclusivo: true },
      { name: "100% integrado sem precisar acessar outras plataformas", premium: false, appExclusivo: true },
      { name: "Notificações de lembretes de pagamento para clientes", premium: false, appExclusivo: true },
      { name: "Todas as funcionalidades do sistema são integradas com o aplicativo", premium: false, appExclusivo: true },
    ],
  },
  {
    title: "Agendamentos",
    features: [
      { name: "Agendamento online 24h", premium: true, appExclusivo: true },
      { name: "Histórico de agendamentos e bloqueio de horários", premium: true, appExclusivo: true },
      { name: "Link de agendamento personalizado", premium: true, appExclusivo: true },
      { name: "Notificações e lembretes automáticos", premium: true, appExclusivo: true },
    ],
  },
  {
    title: "Emissão de Notas Fiscais",
    features: [
      { name: "Emissão automática de Notas Fiscais", premium: false, appExclusivo: true },
      { name: "Histórico de notas fiscais emitidas", premium: false, appExclusivo: true },
      { name: "Exportação de notas fiscais em PDF e XML", premium: false, appExclusivo: true },
    ],
  },
  {
    title: "Gestão Financeira",
    features: [
      { name: "Caixa diário e Extrato financeiro", premium: true, appExclusivo: true },
      { name: "Dashboard financeiro", premium: true, appExclusivo: true },
      { name: "Gestão de formas de pagamento", premium: true, appExclusivo: true },
    ],
  },
  {
    title: "Relatórios",
    features: [
      { name: "Comissões dos barbeiros", premium: true, appExclusivo: true },
      { name: "Taxa de ocupação", premium: true, appExclusivo: true },
      { name: "Ticket médio de vendas e assinaturas", premium: false, appExclusivo: true },
      { name: "Frequência de clientes assinantes", premium: false, appExclusivo: true },
      { name: "Clientes assinantes vs avulsos", premium: false, appExclusivo: true },
      { name: "Vendas de Produtos e serviços", premium: true, appExclusivo: true },
      { name: "Aniversariantes", premium: true, appExclusivo: true },
    ],
  },
  {
    title: "Cadastros e Gestão",
    features: [
      { name: "Número ilimitado de barbeiros", premium: true, appExclusivo: true },
      { name: "Cadastro de clientes", premium: true, appExclusivo: true },
      { name: "Cadastro de serviços e pacotes", premium: true, appExclusivo: true },
      { name: "Cadastro de produtos e gestão de estoque", premium: true, appExclusivo: true },
      { name: "Gestão de múltiplas unidades", premium: true, appExclusivo: true },
    ],
  },
  {
    title: "Extras +",
    features: [
      { name: "Totem de Autoatendimento", premium: false, appExclusivo: "Opcional" },
      { name: "Gerente de contas exclusivo", premium: false, appExclusivo: true },
      { name: "Avaliações dos clientes", premium: true, appExclusivo: true },
      { name: "Anúncios e conteúdos", premium: false, appExclusivo: true },
      { name: "Suporte da equipe BestBarbers", premium: true, appExclusivo: true },
    ],
  },
];

function FeatureIndicator({ value }: { value: FeatureValue }) {
  if (typeof value === "string") {
    return (
      <span className="text-xs md:text-sm font-medium text-[#ffaf02]">
        {value}
      </span>
    );
  }

  if (value) {
    return (
      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-green-500/20 flex items-center justify-center">
        <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
      </div>
    );
  }

  return (
    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-500/20 flex items-center justify-center">
      <X className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
    </div>
  );
}

export function PlanComparisonSection() {
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !tableContainerRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const tableRect = tableContainerRef.current.getBoundingClientRect();

      // Show fixed header when table starts going above navbar
      // and section bottom is still visible
      const navbarHeight = 70;
      const shouldShow = tableRect.top < navbarHeight && sectionRect.bottom > 300;

      setShowFixedHeader(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 lg:py-24 bg-[#121212]">
      {/* Fixed Header - Desktop */}
      <div
        className={`hidden md:block fixed top-[70px] left-0 right-0 z-50 bg-[#121212] transition-all duration-300 ${showFixedHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto py-3">
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800/50 p-4 shadow-lg">
              <div className="grid grid-cols-[1fr_120px_120px] gap-4 items-center">
                <div className="text-sm font-medium text-gray-400">
                  Funcionalidades
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="text-base font-bold text-white">Básico</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Sistema padrão</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#ffaf02] rounded-full">
                    <span className="text-[10px] font-bold text-black whitespace-nowrap">RECOMENDADO</span>
                  </div>
                  <h3 className="text-base font-bold text-[#ffaf02]">App Exclusivo</h3>
                  <p className="text-[11px] text-gray-300 mt-0.5">Experiência única</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Header - Mobile */}
      <div
        className={`md:hidden fixed top-[70px] left-0 right-0 z-50 bg-[#121212] transition-all duration-300 ${showFixedHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="px-4 py-3 pt-5">
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800/50 p-3 shadow-lg">
            <div className="grid grid-cols-[1fr_70px_70px] gap-2 items-center">
              <div className="text-xs font-medium text-gray-400">
                Funcionalidades
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <h3 className="text-xs font-bold text-white">Básico</h3>
              </div>
              <div className="flex flex-col items-center justify-center text-center relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#ffaf02] rounded-full">
                  <span className="text-[8px] font-bold text-black">TOP</span>
                </div>
                <h3 className="text-xs font-bold text-[#ffaf02]">App Exclusivo</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4">
            NOSSOS PLANOS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Conheça nossos planos e funcionalidades
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            Planos que se encaixam na sua necessidade. Escolha o melhor para sua barbearia.
          </p>
        </motion.div>

        {/* Comparison Table Container */}
        <div ref={tableContainerRef} className="max-w-4xl mx-auto">
          {/* Table Header - Desktop (Original) */}
          <div className="hidden md:block mb-6">
            <div className="py-3">
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800/50 p-4">
                <div className="grid grid-cols-[1fr_120px_120px] gap-4 items-center">
                  <div className="text-sm font-medium text-gray-400">
                    Funcionalidades
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-base font-bold text-white">Básico</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Sistema padrão</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center relative">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#ffaf02] rounded-full">
                      <span className="text-[10px] font-bold text-black whitespace-nowrap">RECOMENDADO</span>
                    </div>
                    <h3 className="text-base font-bold text-[#ffaf02]">App Exclusivo</h3>
                    <p className="text-[11px] text-gray-300 mt-0.5">Experiência única</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header (Original) */}
          <div className="md:hidden mb-6">
            <div className="py-3">
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800/50 p-3">
                <div className="grid grid-cols-[1fr_70px_70px] gap-2 items-center">
                  <div className="text-xs font-medium text-gray-400">
                    Funcionalidades
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-xs font-bold text-white">Básico</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center relative">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#ffaf02] rounded-full">
                      <span className="text-[8px] font-bold text-black">TOP</span>
                    </div>
                    <h3 className="text-xs font-bold text-[#ffaf02]">App Exclusivo</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Groups */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="space-y-6 md:space-y-8">
              {featureGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: groupIndex * 0.05 }}
                >
                  {/* Group Title */}
                  <div className="mb-3 md:mb-4">
                    <h4 className="text-sm md:text-base font-bold text-[#ffaf02] uppercase tracking-wide">
                      {group.title}
                    </h4>
                  </div>

                  {/* Features */}
                  <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800/50">
                    {group.features.map((feature, featureIndex) => (
                      <div
                        key={feature.name}
                        className={`grid grid-cols-[1fr_70px_70px] md:grid-cols-[1fr_120px_120px] gap-2 md:gap-4 items-center px-4 py-2 ${featureIndex !== group.features.length - 1
                          ? "border-b border-gray-800/50"
                          : ""
                          }`}
                      >
                        <span className="text-xs md:text-sm text-gray-300 pr-2">
                          {feature.name}
                        </span>
                        <div className="flex justify-center">
                          <FeatureIndicator value={feature.premium} />
                        </div>
                        <div className="flex justify-center">
                          <FeatureIndicator value={feature.appExclusivo} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
