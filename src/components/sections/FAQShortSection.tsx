"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: ReactNode;
}

function H({ children }: { children: ReactNode }) {
  return <span className="text-[#ffaf02] font-bold">{children}</span>;
}

function W({ children }: { children: ReactNode }) {
  return <span className="text-white font-semibold">{children}</span>;
}

const faqItems: FAQItem[] = [
  {
    question: "Assinante vai vir todo dia e dar prejuizo?",
    answer: <>Essa e a objecao #1 — e os dados mostram o contrario. Media real de <H>51.000 assinantes ativos</H>: <H>2,1 visitas por mes</H>. Assinante nao vem todo dia. Ele paga todo mes. Resultado: <H>R$128/mes</H> por assinante vs <W>R$45/mes</W> do cliente avulso. <H>Quase 3x mais.</H></>,
  },
  {
    question: "Ja tentei outro sistema e nao funcionou.",
    answer: <><H>82 barbearias</H> que migraram de outros sistemas pra BestBarbers relataram a mesma coisa: suporte fraco e implementacao abandonada. Aqui voce tem <W>gerente dedicado via WhatsApp</W> do dia 1, migracao completa dos seus dados, e acompanhamento dos seus primeiros resultados. Nao e chatbot — e uma pessoa real.</>,
  },
  {
    question: "Meus clientes nao vao usar app.",
    answer: <><H>6 milhoes de agendamentos</H> acontecem todo mes pelo BestBarbers. Seus clientes ja usam app pra pedir comida, chamar transporte e pagar contas. Agendar corte de cabelo e mais simples que qualquer um desses. E mais: eles deixam de te mandar mensagem no WhatsApp — voce ganha <H>2h por dia</H> de volta.</>,
  },
  {
    question: "Assinatura e desconto — vou perder margem?",
    answer: <>Ao contrario. Assinante gasta <H>R$128/mes</H> (ticket medio real). Cliente avulso gasta R$540 por ANO — ou <W>R$45/mes</W>. Assinante vale <H>2,8x mais</H>. O clube nao e desconto — e previsibilidade. Voce sabe exatamente quanto entra antes de abrir a porta.</>,
  },
  {
    question: "Nao tenho investimento pra isso agora.",
    answer: <>Sem taxa de implantacao. <H>A partir de R$299/mes</H>. Com apenas <H>3 assinantes</H> no clube (3 x R$100 = R$300), o sistema ja se paga. Uma barbearia de 4 cadeiras chegou a <H>353 assinantes — R$31.690/mes</H>. O investimento se paga no primeiro mes.</>,
  },
  {
    question: "Funciona pra barbearia pequena?",
    answer: <>Funciona melhor pra pequenas. O caso de <H>4 cadeiras com R$31.690/mes</H> e de uma barbearia pequena. Thais opera <H>sozinha com 1 cadeira</H> e fatura R$12K/mes. Gestao organizada faz mais diferenca quando o time e enxuto — cada hora que voce para de agendar pelo WhatsApp vira hora cortando.</>,
  },
  {
    question: "O que ta incluso nos R$299/mes?",
    answer: <>Tudo: <W>app exclusivo</W> com sua marca nas lojas, <W>clube de assinaturas</W> com cobranca automatica, <W>agenda online</W>, <W>dashboard financeiro</W>, controle de comissoes, <W>NF-e integrada</W> e <W>gerente dedicado</W> via WhatsApp. Sem taxa de implantacao, sem fidelidade.</>,
  },
  {
    question: "O que e o diagnostico gratuito?",
    answer: <>Um especialista analisa sua barbearia e entrega via WhatsApp: quanto voce pode faturar com clube de assinaturas, como organizar sua agenda sem WhatsApp, e um plano de implementacao. <H>Sem cartao, sem compromisso — 100% gratuito.</H></>,
  },
  {
    question: "Ja uso outro sistema. Por que trocar?",
    answer: <><H>82 barbearias ja migraram</H> de outros sistemas pro BestBarbers. Diferencial: <W>app proprio</W> com sua marca na App Store, <W>clube de assinaturas integrado</W>, <W>NFS-e automatica</W>, <W>dashboard multi-unit</W>. Qual sistema oferece tudo isso junto? Migracao completa inclusa, sem perda de dados.</>,
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
            Ainda com duvida?
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            As objecoes mais comuns de donos de barbearia — respondidas com dados reais
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
