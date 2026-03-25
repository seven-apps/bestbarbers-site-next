"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "O que é a análise gratuita?",
    answer: "Um especialista analisa sua barbearia e entrega em até 24h via WhatsApp: (1) quanto você pode faturar com clube de assinaturas, (2) como organizar sua agenda sem WhatsApp, (3) plano de implementação com timeline. Sem cartão, sem compromisso — 100% gratuito.",
  },
  {
    question: "Preciso pagar algo para começar?",
    answer: "Não! O diagnóstico é 100% gratuito. Você só investe se decidir avançar com o BestBarbers após conhecer o plano personalizado para a sua barbearia.",
  },
  {
    question: "Quanto tempo leva para ter resultados?",
    answer: "Nossos clientes costumam ver os primeiros resultados entre 30 e 60 dias após a implementação. Barbearias que ativam o clube de assinaturas conseguem receita recorrente logo no primeiro mês.",
  },
  {
    question: "Funciona para barbearia pequena?",
    answer: "Funciona melhor para pequenas. A Pirajussara tem 4 cadeiras e fatura R$31.690/mês com clube. Gestão organizada faz mais diferença quando o time é enxuto — cada hora que você para de agendar pelo WhatsApp vira hora cortando.",
  },
  {
    question: "Quanto custa o BestBarbers?",
    answer: "R$0 de implantação (antes era R$2.400). A mensalidade do plano App Exclusivo é R$299/mês com tudo incluso: app próprio, clube de assinaturas automático, dashboard financeiro, NF-e e suporte dedicado. Sem fidelidade — cancela quando quiser.",
  },
  {
    question: "É mais barato que antes?",
    answer: "Sim! R$1.200 mais barato no primeiro ano. Antes: R$2.400 (taxa) + 12 × R$199 = R$4.788/ano. Agora: R$0 (taxa) + 12 × R$299 = R$3.588/ano. Economia de 25%.",
  },
  {
    question: "O clube se paga?",
    answer: "Com apenas 3 assinantes de R$100, você já cobre o custo do sistema (3 × R$100 = R$300 > R$299). A Pirajussara, barbearia de 4 cadeiras em Embu das Artes, tem 353 assinantes e fatura R$31.690/mês só com clube.",
  },
  {
    question: "Como funciona o App Próprio?",
    answer: "É um aplicativo exclusivo da sua barbearia, publicado na App Store e Play Store com o nome e a identidade visual do seu negócio. Seus clientes baixam o app da sua barbearia e acessam apenas os serviços do seu estabelecimento, sem ver concorrentes.",
  },
];

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className="border-b border-gray-800/30 last:border-b-0 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <button
        onClick={onToggle}
        className="w-full py-5 md:py-6 flex items-center justify-between text-left gap-4 group"
      >
        <span className="text-sm md:text-base font-medium text-white group-hover:text-[#ffaf02] transition-colors leading-relaxed">
          {item.question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-[#ffaf02]/20 rotate-180" : "bg-white/5 group-hover:bg-white/10"
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-colors ${
              isOpen ? "text-[#ffaf02]" : "text-gray-400 group-hover:text-[#ffaf02]"
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pb-5 md:pb-6 text-sm md:text-[15px] text-gray-400 leading-relaxed pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQShortSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#121212]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
            <HelpCircle className="w-4 h-4" />
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Perguntas frequentes
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            As respostas para as dúvidas mais comuns sobre o diagnóstico
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 px-5 md:px-8 shadow-2xl">
            {faqItems.map((item, index) => (
              <FAQAccordionItem
                key={index}
                item={item}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
