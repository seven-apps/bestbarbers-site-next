"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownCircle } from "lucide-react";
import { REAIS, CASE, MERCADO } from "./benchmarks";
import { brl } from "./calc";

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
        Não — é uma <H>projeção transparente</H>. Ela combina os números que você informou nos
        sliders com um <H>dado real</H> da base BestBarbers: o ticket médio de assinante de{" "}
        <H>{brl(REAIS.ticketAssinatura)}/mês</H> (R$128,14, jun/2026). Não temos acesso à sua base;
        ajuste os controles para refletir o seu cenário e veja como o resultado muda.
      </>
    ),
  },
  {
    question: "De onde vem o ticket de R$128/mês por assinante?",
    answer: (
      <>
        É um <H>dado real</H> da base BestBarbers, verificado em jun/2026: R$128,14 de ticket médio
        mensal por assinante. Hoje são <H>{REAIS.assinantesAtivos.toLocaleString("pt-BR")} assinantes
        ativos</H> em <H>{REAIS.barbeariasAtivas.toLocaleString("pt-BR")} barbearias</H> ({REAIS.percentualComClube}%
        já com clube). As barbearias com clube têm em média <H>~{REAIS.assinantesMediaPorClube} assinantes
        ativos</H> — já são mais de <H>{brl(REAIS.movimentadoClube)}</H> movimentados em assinaturas na plataforma.
      </>
    ),
  },
  {
    question: "Faturamento dobrar é real ou promessa de marketing?",
    answer: (
      <>
        É um <H>case real anonimizado</H> (Pirajussara): uma barbearia de 4 cadeiras saiu de{" "}
        <H>{brl(CASE.antes)}/mês para {brl(CASE.depois)}/mês</H> (cerca de 2x) ao estruturar o clube
        de assinaturas. É um exemplo validado, não uma garantia — o seu resultado depende do seu
        cenário, por isso a calculadora deixa tudo ajustável.
      </>
    ),
  },
  {
    question: "Por que 'prejuízo invisível'? Eu não estou perdendo dinheiro de verdade.",
    answer: (
      <>
        É um <H>custo de oportunidade</H>: o cliente que corta e some não volta de forma previsível,
        então a receita recorrente que ele geraria como assinante simplesmente não existe. Não some
        do caixa — mas nunca entra. Como afirmação de mercado, estima-se que cada corte sem recorrência
        deixa cerca de{" "}
        <H>
          {MERCADO.prejuizoPorCorte.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
          })}{" "}
          na mesa
        </H>
        . Quanto menor a sua recorrência, maior esse valor acumulado.
      </>
    ),
  },
  {
    question: "O assinante não vai vir todo dia e dar prejuízo?",
    answer: (
      <>
        Essa é a objeção nº1 — e os números reais mostram o contrário. Na base BestBarbers, o
        assinante permanece em média <H>~{REAIS.retencaoMeses} meses</H> pagando{" "}
        <H>{brl(REAIS.ticketAssinatura)}/mês</H>. O valor do clube não está em ele vir mais — está na
        previsibilidade: você sabe quanto entra antes de abrir a porta.
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
