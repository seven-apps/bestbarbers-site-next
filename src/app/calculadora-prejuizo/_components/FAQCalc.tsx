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
    question: "Esse cálculo é o dado real da minha barbearia?",
    answer: (
      <>
        Não — é uma <H>projeção transparente</H>. Ela usa os números que você informou nos
        sliders e premissas de <H>cases reais da BestBarbers</H> (ticket médio de R$128/mês por
        assinante). Não temos acesso à sua base; ajuste os controles para refletir o seu cenário e
        veja como o resultado muda.
      </>
    ),
  },
  {
    question: "De onde vem o ticket de R$128/mês por assinante?",
    answer: (
      <>
        É a <H>estimativa baseada em cases reais</H> da BestBarbers, considerando a média de{" "}
        <H>51 mil assinantes ativos</H> distribuídos em <H>1.200 barbearias</H> na plataforma. O
        assinante visita em média <H>2,1 vezes por mês</H> — ou seja, ele não vem todo dia, mas paga
        todo mês. É isso que gera previsibilidade.
      </>
    ),
  },
  {
    question: "Faturamento dobrar é real ou promessa de marketing?",
    answer: (
      <>
        É um <H>case real anonimizado</H>: uma barbearia de 4 cadeiras saiu de{" "}
        <H>R$15.892/mês para R$31.690/mês</H> (cerca de 2x) ao estruturar o clube de assinaturas.
        É um exemplo validado, não uma garantia — o seu resultado depende do seu cenário, por isso a
        calculadora deixa tudo ajustável.
      </>
    ),
  },
  {
    question: "Por que 'prejuízo invisível'? Eu não estou perdendo dinheiro de verdade.",
    answer: (
      <>
        É um <H>custo de oportunidade</H>: o cliente que corta e some não volta de forma previsível,
        então a receita recorrente que ele geraria como assinante simplesmente não existe. Não some
        do caixa — mas nunca entra. Quanto menor a sua recorrência, maior esse valor que fica na mesa.
      </>
    ),
  },
  {
    question: "O assinante não vai vir todo dia e dar prejuízo?",
    answer: (
      <>
        Essa é a objeção nº1 — e os cases mostram o contrário. A média real é de{" "}
        <H>2,1 visitas por mês</H> por assinante. Ele paga <H>R$128/mês</H> e vem 2 vezes. Comparado
        ao cliente avulso, vale bem mais, com a vantagem da previsibilidade.
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
            Transparência total nos números.
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
