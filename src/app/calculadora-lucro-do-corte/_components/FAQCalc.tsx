"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: ReactNode;
}

function H({ children }: { children: ReactNode }) {
  return <span style={{ color: "#ebad04", fontWeight: 700 }}>{children}</span>;
}

const faqItems: FAQItem[] = [
  {
    question: "Como a calculadora chega no lucro por corte?",
    answer: (
      <>
        A conta é direta e 100% sua: <H>custo real do corte = produto + comissão + fatia do
        custo fixo</H>. O <H>lucro por corte</H> é o preço que você cobra menos esse custo real.
        Nenhum número é inventado — tudo sai dos sliders que você mesmo ajusta.
      </>
    ),
  },
  {
    question: "O que é essa 'fatia do custo fixo' em cada corte?",
    answer: (
      <>
        Aluguel, luz, água e internet você paga mesmo com a cadeira vazia. A calculadora pega
        esse <H>custo fixo do mês</H> e divide pelo número de atendimentos — assim cada corte
        carrega o pedaço dele. Quanto mais cortes no mês, mais diluído fica esse custo em cada um.
      </>
    ),
  },
  {
    question: "Por que meu corte pode dar prejuízo mesmo com a cadeira cheia?",
    answer: (
      <>
        Porque <H>faturamento não é lucro</H>. Se o preço não cobre produto + comissão + a fatia
        do fixo, cada corte sai no vermelho — e no fim do mês você está pagando pra trabalhar sem
        perceber. Normalmente o erro está no <H>preço baixo</H>, na <H>comissão alta demais</H> ou
        no custo fixo pesado para o volume de atendimentos.
      </>
    ),
  },
  {
    question: "Como eu faço esse número melhorar?",
    answer: (
      <>
        Três alavancas: <H>ajustar o preço</H>, <H>rever a comissão</H> e <H>encher a agenda</H>
        {" "}para diluir o custo fixo. Mais de <H>1.200 barbearias</H> usam a BestBarbers para
        organizar preço, comissão e gestão — e um especialista pode montar esse plano com você.
      </>
    ),
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
    <div className="animate-fade-in mb-3 md:mb-4" style={{ animationDelay: `${index * 0.05}s` }}>
      <button
        onClick={onToggle}
        className="w-full px-5 py-5 md:py-6 flex items-start justify-between text-left gap-4 group transition-all rounded-2xl border"
        style={{
          background: isOpen ? "rgba(255,255,255,0.03)" : "transparent",
          borderColor: isOpen ? "rgba(235,173,4,0.2)" : "rgba(255,255,255,0.06)",
        }}
      >
        <span
          className="text-[15px] md:text-base font-bold leading-tight transition-colors"
          style={{ color: isOpen ? "#ebad04" : "#ffffff", fontFamily: "var(--font-montserrat)" }}
        >
          {item.question}
        </span>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-[-4px] transition-all duration-300"
          style={{
            background: isOpen ? "rgba(235,173,4,0.1)" : "rgba(255,255,255,0.05)",
            transform: isOpen ? "rotate(180deg)" : "none",
          }}
        >
          <ChevronDownCircle
            className="w-5 h-5 transition-colors"
            style={{ color: isOpen ? "#ebad04" : "#ffffff" }}
            fill="currentColor"
          />
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? "500px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div className="px-5 pb-6 md:pb-8 pt-2">
          <p
            className="text-[14px] md:text-[15px] leading-relaxed"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", opacity: 0.8 }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQCalc() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  return (
    <section className="py-16 md:py-24 relative" style={{ background: "#0a0a0a" }}>
      <div className="container-custom">
        <div className="mb-10 md:mb-14 animate-fade-in-up text-center">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] mb-5 border mx-auto"
            style={{
              background: "rgba(235,173,4,0.1)",
              color: "#ebad04",
              borderColor: "rgba(235,173,4,0.2)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            Dúvidas sobre a calculadora
          </span>

          <h2
            className="leading-tight max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 700, fontSize: "clamp(26px, 4vw, 42px)", color: "#ffffff" }}
          >
            A conta é sua, e a gente mostra tudo.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
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
    </section>
  );
}
