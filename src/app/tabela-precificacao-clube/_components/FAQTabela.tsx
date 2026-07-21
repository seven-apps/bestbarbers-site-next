"use client";

import { useState, type ReactNode } from "react";
import { ChevronDownCircle } from "lucide-react";
import { METODO, REAIS } from "./benchmarks";
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
    question: "Por que o teto é 2 cortes, e não 3?",
    answer: (
      <>
        Porque quem paga o valor de 3 cortes é só o cliente que <H>já corta 4 vezes por mês</H> — e
        aí você tem dois problemas juntos: pouca gente entra e todo mundo que entra usa muito. O
        clube que escala é o que o cliente de 20 ou 30 em 30 dias olha e pensa{" "}
        <H>&ldquo;se eu usar duas vezes, já valeu&rdquo;</H>. É ele quem sustenta a recorrência.
      </>
    ),
  },
  {
    question: "O plano ilimitado não vai me quebrar?",
    answer: (
      <>
        Essa é a objeção nº1 — e a resposta prática é não. Como <H>referência de mercado</H>, o
        assinante volta de {METODO.frequenciaMin} a {METODO.frequenciaMax} vezes por mês: cabelo não
        cresce mais rápido porque o cliente assinou. Quem usa pouco compensa quem usa muito, e cada
        visita é uma chance a mais de vender um produto, uma barba ou uma hidratação no balcão.
      </>
    ),
  },
  {
    question: "Meu barbeiro não vai ganhar menos na assinatura?",
    answer: (
      <>
        Olhando o minuto isolado de um corte, o valor é menor. Mas a conta certa é o{" "}
        <H>mês, não o minuto</H>: com o clube a agenda enche, o barbeiro atende mais e a comissão
        mensal dele sobe. O risco real é outro — <H>preço chutado para baixo</H>, que espreme a
        comissão e faz a equipe jogar contra o clube. Por isso a tabela mostra o ganho do barbeiro
        junto com o preço, na mesma tela.
      </>
    ),
  },
  {
    question: "Quando devo aumentar o preço do clube?",
    answer: (
      <>
        Quando os dois lados da agenda lotarem: a carteira de assinantes por barbeiro no teto{" "}
        (<H>referência do método: {METODO.assinantesPorBarbeiroMin} a {METODO.assinantesPorBarbeiroMax} por
        barbeiro</H>) e o avulso sem horário. O reajuste suave é de uns <H>R$10</H> na mensalidade;
        se está transbordando, cabe um reajuste maior. Enquanto sobrar horário, a prioridade é
        encher a agenda — não subir o preço.
      </>
    ),
  },
  {
    question: "Esse preço recomendado é uma regra fixa?",
    answer: (
      <>
        Não — é um <H>ponto de partida transparente</H> pela Regra dos 2 Cortes, ajustado pela sua
        agenda. A decisão final é sua; o papel da tabela é você não chutar. E um aviso de quem vê
        isso todo dia: preço certo com <H>cobrança manual</H> também mata o clube — a recorrência
        só funciona com cobrança automática no cartão, renovando sem você correr atrás.
      </>
    ),
  },
  {
    question: "De onde vêm esses números?",
    answer: (
      <>
        O cálculo usa <H>só os números que você informou</H> nos controles — não temos acesso à sua
        base. As referências de frequência e de carteira por barbeiro são de mercado, do método
        aplicado por barbearias por assinatura há anos, e estão rotuladas na página. A prova de que
        o modelo funciona é real e verificada: <H>{REAIS.assinantesAtivos.toLocaleString("pt-BR")} assinantes
        ativos</H> em <H>{REAIS.barbeariasAtivas.toLocaleString("pt-BR")} barbearias</H> na plataforma
        ({REAIS.percentualComClube}% já com clube), com mais de <H>{brl(REAIS.movimentadoClube)}</H>{" "}
        movimentados em assinaturas.
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

export function FAQTabela() {
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
            Dúvidas sobre o preço do clube
          </span>

          <h2
            className="leading-tight max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-vollkorn)",
              fontWeight: 700,
              fontSize: "clamp(26px, 4vw, 42px)",
              color: "#ffffff",
            }}
          >
            As perguntas que todo dono faz antes de cravar o preço.
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
