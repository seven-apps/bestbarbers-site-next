"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownCircle } from "lucide-react";
import { PUBLICOS, PREMISSAS, CASE } from "./benchmarks";

/** Premissa da projeção — valor do plano de clube. Nunca apresentar como dado da base. */
const PREMISSA_PLANO = PREMISSAS.planoClubeMes;
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
        sliders com uma <H>premissa nossa</H>: um plano de clube de{" "}
        <H>{brl(PREMISSA_PLANO)}/mês</H>. Não temos acesso à sua base; ajuste os controles para
        refletir o seu cenário e veja como o resultado muda.
      </>
    ),
  },
  {
    question: "De onde vem o valor de plano usado na conta?",
    answer: (
      <>
        É uma <H>premissa</H>, não um dado da sua barbearia: a conta usa um plano de clube de{" "}
        <H>{brl(PREMISSA_PLANO)}/mês</H>, que é uma faixa comum de mensalidade em barbearia.
        Se o seu plano custar mais ou menos que isso, o resultado sobe ou desce na mesma
        proporção. A escala por trás da plataforma é de mais de{" "}
        <H>{PUBLICOS.assinantesAtivos.toLocaleString("pt-BR")} assinantes ativos</H> em mais de{" "}
        <H>{PUBLICOS.barbeariasAtivas.toLocaleString("pt-BR")} barbearias</H>.
      </>
    ),
  },
  {
    question: "Esse tamanho de resultado é real ou promessa de marketing?",
    answer: (
      <>
        É um <H>case real anonimizado</H> do banco da plataforma: uma barbearia de {CASE.cadeiras}{" "}
        cadeiras em {CASE.cidade} saiu de {CASE.assinantesAntes} para {CASE.assinantesDepois}{" "}
        assinantes em {CASE.janelaMeses} meses, e a receita de clube dela foi de{" "}
        <H>{brl(CASE.antes)}/mês para {brl(CASE.depois)}/mês</H>. É um caso medido, não uma
        garantia — o seu resultado depende do seu cenário, por isso a calculadora deixa tudo
        ajustável.
      </>
    ),
  },
  {
    question: "Por que 'prejuízo invisível'? Eu não estou perdendo dinheiro de verdade.",
    answer: (
      <>
        É um <H>custo de oportunidade</H>: o cliente que corta e some não volta de forma previsível,
        então a receita recorrente que ele geraria como assinante simplesmente não existe. Não some
        do caixa — mas nunca entra. A conta acima é justamente essa diferença:{" "}
        <H>o que os seus clientes sem recorrência pagariam se fossem assinantes</H>, menos o que
        eles pagam hoje. Quanto menor a sua recorrência, maior esse valor acumulado.
      </>
    ),
  },
  {
    question: "O assinante não vai vir todo dia e dar prejuízo?",
    answer: (
      <>
        Quem define o teto é você, antes de vender o plano. Cada plano tem regra — por{" "}
        <H>créditos</H> (o assinante usa o número de serviços que contratou) ou por{" "}
        <H>dias de uso</H> — e o sistema controla sozinho o que já foi consumido no período. O valor
        do clube não está em ele vir mais: está na previsibilidade de saber quanto entra antes de
        abrir a porta.
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
