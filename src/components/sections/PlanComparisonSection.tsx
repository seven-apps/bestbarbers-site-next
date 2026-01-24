"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown, Crown, Sparkles } from "lucide-react";
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
  defaultOpen?: boolean;
}

const featureGroups: FeatureGroup[] = [
  {
    title: "Aplicativo e Identidade",
    defaultOpen: true,
    features: [
      { name: "Aplicativo próprio personalizado (com sua marca)", premium: false, appExclusivo: true },
      { name: "Clientes acessam somente a sua barbearia", premium: false, appExclusivo: true },
      { name: "Publicado nas lojas (App Store e Play Store)", premium: false, appExclusivo: true },
      { name: "Push Notifications personalizadas", premium: false, appExclusivo: true },
    ],
  },
  {
    title: "Clube de Assinaturas",
    defaultOpen: true,
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
    title: "Emissão de Notas Fiscais",
    defaultOpen: true,
    features: [
      { name: "Emissão automática de Notas Fiscais", premium: false, appExclusivo: true },
      { name: "Histórico de notas fiscais emitidas", premium: false, appExclusivo: true },
      { name: "Exportação de notas fiscais em PDF e XML", premium: false, appExclusivo: true },
    ],
  },
  {
    title: "Agendamentos",
    defaultOpen: true,
    features: [
      { name: "Agendamento online 24h", premium: true, appExclusivo: true },
      { name: "Histórico de agendamentos e bloqueio de horários", premium: true, appExclusivo: true },
      { name: "Link de agendamento personalizado", premium: true, appExclusivo: true },
      { name: "Notificações e lembretes automáticos", premium: true, appExclusivo: true },
    ],
  },
  {
    title: "Gestão Financeira",
    defaultOpen: false,
    features: [
      { name: "Caixa diário e Extrato financeiro", premium: true, appExclusivo: true },
      { name: "Dashboard financeiro", premium: true, appExclusivo: true },
      { name: "Gestão de formas de pagamento", premium: true, appExclusivo: true },
    ],
  },
  {
    title: "Relatórios",
    defaultOpen: false,
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
    defaultOpen: false,
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
    defaultOpen: false,
    features: [
      { name: "Totem de Autoatendimento", premium: false, appExclusivo: "Opcional" },
      { name: "Gerente de contas exclusivo", premium: false, appExclusivo: true },
      { name: "Avaliações dos clientes", premium: true, appExclusivo: true },
      { name: "Anúncios e conteúdos", premium: false, appExclusivo: true },
      { name: "Suporte da equipe BestBarbers", premium: true, appExclusivo: true },
    ],
  },
];

function FeatureIndicator({ value, highlight = false }: { value: FeatureValue; highlight?: boolean }) {
  if (typeof value === "string") {
    return (
      <span className="text-xs md:text-sm font-semibold text-[#d4940a]">
        {value}
      </span>
    );
  }

  if (value) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, type: "spring" }}
        className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center ${highlight
          ? "bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
          : "bg-green-100"
          }`}
      >
        <Check className={`w-4 h-4 md:w-5 md:h-5 ${highlight ? "text-white" : "text-green-600"}`} />
      </motion.div>
    );
  }

  return (
    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-100 flex items-center justify-center">
      <X className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
    </div>
  );
}

function CollapsibleFeatureGroup({
  group,
  groupIndex,
  openGroups,
  toggleGroup
}: {
  group: FeatureGroup;
  groupIndex: number;
  openGroups: Set<number>;
  toggleGroup: (index: number) => void;
}) {
  const isOpen = openGroups.has(groupIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: groupIndex * 0.05 }}
    >
      {/* Group Header - Clickable */}
      <button
        onClick={() => toggleGroup(groupIndex)}
        className="w-full mb-3 md:mb-4 flex items-center justify-between group cursor-pointer"
      >
        <h4 className="text-sm md:text-base font-bold text-[#121212] uppercase tracking-wide group-hover:text-[#ffaf02] transition-colors">
          {group.title}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="p-1.5 rounded-full bg-gray-100 group-hover:bg-[#ffaf02]/20 transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-[#ffaf02]" />
        </motion.div>
      </button>

      {/* Features - Collapsible */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
              {/* Subtle highlight on App Exclusivo column */}
              <div className="absolute top-0 right-0 w-[70px] md:w-[120px] h-full bg-gradient-to-l from-[#ffaf02]/5 to-transparent pointer-events-none" />

              {group.features.map((feature, featureIndex) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: featureIndex * 0.03 }}
                  className={`grid grid-cols-[1fr_70px_70px] md:grid-cols-[1fr_100px_140px] gap-2 md:gap-4 items-center px-4 py-3 md:py-3.5 hover:bg-gray-50 transition-colors ${featureIndex !== group.features.length - 1
                    ? "border-b border-gray-100"
                    : ""
                    }`}
                >
                  <span className="text-xs md:text-sm text-gray-700 pr-2 leading-relaxed">
                    {feature.name}
                  </span>
                  <div className="flex justify-center">
                    <FeatureIndicator value={feature.premium} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureIndicator value={feature.appExclusivo} highlight={true} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PlanComparisonSection() {
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<number>>(() => {
    const defaultOpen = new Set<number>();
    featureGroups.forEach((group, index) => {
      if (group.defaultOpen) defaultOpen.add(index);
    });
    return defaultOpen;
  });
  const sectionRef = useRef<HTMLElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const toggleGroup = (index: number) => {
    setOpenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setOpenGroups(new Set(featureGroups.map((_, i) => i)));
  };

  const collapseAll = () => {
    setOpenGroups(new Set());
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !tableContainerRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const tableRect = tableContainerRef.current.getBoundingClientRect();

      const navbarHeight = 70;
      const shouldShow = tableRect.top < navbarHeight && sectionRect.bottom > 300;

      setShowFixedHeader(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Fixed Header - Desktop */}
      <div
        className={`hidden md:block fixed top-[70px] left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 ${showFixedHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto py-3">
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
              <div className="grid grid-cols-[1fr_100px_140px] gap-4 items-center">
                <div className="text-sm font-medium text-gray-500">
                  Funcionalidades
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <h3 className="text-sm font-bold text-gray-800">Básico</h3>
                  <p className="text-[10px] text-gray-500">Sistema padrão</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center relative">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-[#ffaf02] to-[#ffc233] rounded-full shadow-sm">
                    <span className="text-[9px] font-bold text-black whitespace-nowrap flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" />
                      RECOMENDADO
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#d4940a] whitespace-nowrap">App Exclusivo</h3>
                  <p className="text-[10px] text-gray-600">Experiência única</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Header - Mobile */}
      <div
        className={`md:hidden fixed top-[70px] left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 ${showFixedHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="px-4 py-3 pt-5">
          <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
            <div className="grid grid-cols-[1fr_70px_70px] gap-2 items-center">
              <div className="text-xs font-medium text-gray-500">
                Funcionalidades
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <h3 className="text-xs font-bold text-gray-800">Básico</h3>
              </div>
              <div className="flex flex-col items-center justify-center text-center relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-[#ffaf02] to-[#ffc233] rounded-full">
                  <span className="text-[9px] font-bold text-black flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" />
                    TOP
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#d4940a]">App Exclusivo</h3>
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
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212] text-[#ffaf02] text-xs md:text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4" />
            NOSSOS PLANOS
          </motion.span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] mb-3">
            Conheça nossos planos e funcionalidades
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            Planos que se encaixam na sua necessidade. Escolha o melhor para sua barbearia.
          </p>
        </motion.div>

        {/* Comparison Table Container */}
        <div ref={tableContainerRef} className="max-w-4xl mx-auto">
          {/* Table Header - Desktop */}
          <div className="hidden md:block mb-6">
            <div className="py-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-lg">
                <div className="grid grid-cols-[1fr_100px_140px] gap-4 items-center">
                  <div className="text-sm font-medium text-gray-500">
                    Funcionalidades
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-base font-bold text-gray-800">Básico</h3>
                    <p className="text-[11px] text-gray-500">Sistema padrão</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center relative">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-[#ffaf02] to-[#ffc233] rounded-full shadow-md"
                    >
                      <span className="text-[10px] font-bold text-black whitespace-nowrap flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        RECOMENDADO
                      </span>
                    </motion.div>
                    <h3 className="text-base font-bold text-[#d4940a] whitespace-nowrap">App Exclusivo</h3>
                    <p className="text-[11px] text-gray-600">Experiência única</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden mb-6">
            <div className="py-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md">
                <div className="grid grid-cols-[1fr_70px_70px] gap-2 items-center">
                  <div className="text-xs font-medium text-gray-500">
                    Funcionalidades
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-xs font-bold text-gray-800">Básico</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center relative">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-[#ffaf02] to-[#ffc233] rounded-full shadow-md"
                    >
                      <span className="text-[9px] font-bold text-black flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        TOP
                      </span>
                    </motion.div>
                    <h3 className="text-xs font-bold text-[#d4940a]">App Exclusivo</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expand/Collapse All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-end mb-4 gap-2"
          >
            <button
              onClick={expandAll}
              className="text-xs text-gray-500 hover:text-[#d4940a] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Expandir tudo
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="text-xs text-gray-500 hover:text-[#d4940a] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              Recolher tudo
            </button>
          </motion.div>

          {/* Feature Groups */}
          <div className="space-y-6 md:space-y-8">
            {featureGroups.map((group, groupIndex) => (
              <CollapsibleFeatureGroup
                key={group.title}
                group={group}
                groupIndex={groupIndex}
                openGroups={openGroups}
                toggleGroup={toggleGroup}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-600 mb-4">
              Pronto para transformar sua barbearia?
            </p>
            <motion.a
              href="#form-section"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#121212] to-[#2a2a2a] text-[#ffaf02] rounded-full text-sm font-bold shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-shadow"
            >
              <Crown className="w-5 h-5" />
              QUERO O APP EXCLUSIVO
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
