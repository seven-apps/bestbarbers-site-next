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

function W({ children }: { children: ReactNode }) {
  return <span style={{ color: "#ffffff", fontWeight: 600 }}>{children}</span>;
}

const faqCritical: FAQItem[] = [
  {
    question: "Assinante vai vir todo dia e dar prejuízo?",
    answer: <>Essa é a objeção #1 — e os dados mostram o contrário. Média real de <H>51.000 assinantes ativos</H>: <H>2,1 visitas por mês</H>. Assinante não vem todo dia. Ele paga todo mês. Resultado: <H>R$128/mês</H> por assinante vs <W>R$45/mês</W> do cliente avulso. <H>Quase 3x mais.</H></>,
  },
  {
    question: "Não tenho investimento pra isso agora.",
    answer: <>Sem taxa de implantação. <H>A partir de R$299/mês</H>. Com apenas <H>3 assinantes</H> no clube, o sistema já se paga. Uma barbearia de 4 cadeiras chegou a <H>353 assinantes — R$31.690/mês</H>. O investimento se paga no primeiro mês.</>,
  },
  {
    question: "Meus clientes não vão usar app.",
    answer: <><H>6 milhões de agendamentos</H> acontecem todo mês pelo BestBarbers. Seus clientes já usam app pra pedir comida, chamar transporte e pagar contas. Agendar corte é mais simples que qualquer um desses. E mais: eles deixam de te mandar mensagem no WhatsApp — você ganha <H>2h por dia</H> de volta.</>,
  },
  {
    question: "Já tentei outro sistema e não funcionou.",
    answer: <><H>82 barbearias</H> que migraram pra BestBarbers relataram a mesma coisa: suporte fraco e implementação abandonada. Aqui você tem <W>gerente de contas dedicado</W> do dia 1, migração completa dos seus dados e acompanhamento dos primeiros resultados. Não é chatbot — é uma pessoa real.</>,
  },
  {
    question: "Funciona pra barbearia pequena?",
    answer: <>Funciona melhor pra pequenas. O caso de <H>4 cadeiras com R$31.690/mês</H> é de uma barbearia pequena. Thaís opera <H>sozinha com 1 cadeira</H> e fatura R$12K/mês. Gestão organizada faz mais diferença quando o time é enxuto — cada hora que você para de agendar pelo WhatsApp vira hora cortando.</>,
  },
];

const faqExtra: FAQItem[] = [
  {
    question: "Assinatura é desconto — vou perder margem?",
    answer: <>Ao contrário. Assinante gasta <H>R$128/mês</H> (ticket médio real). Cliente avulso gasta R$540 por ANO — ou <W>R$45/mês</W>. Assinante vale <H>2,8x mais</H>. O clube não é desconto — é previsibilidade. Você sabe exatamente quanto entra antes de abrir a porta.</>,
  },
  {
    question: "O que está incluso nos R$299/mês?",
    answer: <>Tudo: <W>app próprio</W> com a sua marca na App Store + Play, <W>clube de assinaturas</W> com cobrança automática, <W>agenda online</W>, <W>dashboard financeiro</W>, controle de comissões, <W>NFS-e integrada</W> e <W>gerente de contas dedicado</W>. Sem taxa de implantação, sem fidelidade.</>,
  },
  {
    question: "O que está incluso na oferta de implantação gratuita?",
    answer: <>Desenvolvimento do <W>app próprio</W> com a sua marca, publicação na <W>App Store + Play Store</W>, configuração completa do clube de assinaturas, importação dos seus clientes e onboarding com <W>gerente de contas dedicado</W>. Tudo isso em até <H>30 dias</H> e <H>100% gratuito</H> — outros sistemas cobram R$3.000 a R$5.000 só pra começar.</>,
  },
  {
    question: "Já uso outro sistema. Por que trocar?",
    answer: <><H>82 barbearias já migraram</H> de outros sistemas pro BestBarbers. Diferencial: <W>app próprio</W> com a sua marca na App Store, <W>clube de assinaturas integrado</W>, <W>NFS-e automática</W>, <W>dashboard multi-unidade</W>. Qual sistema oferece tudo isso junto? Migração completa inclusa, sem perda de dados.</>,
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
      className="animate-fade-in mb-3 md:mb-4"
      style={{
        animationDelay: `${index * 0.05}s`,
      }}
    >
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
          style={{
            color: isOpen ? "#ebad04" : "#ffffff",
            fontFamily: "var(--font-montserrat)",
          }}
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

export function FAQShortV12() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const [showExtra, setShowExtra] = useState(false);

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const allItems = showExtra ? [...faqCritical, ...faqExtra] : faqCritical;

  return (
    <section
      className="py-16 md:py-24 relative"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container-custom">
        {/* Header — copy editorial centralizado */}
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
            Dúvidas Frequentes
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
            Já sabemos o que você vai perguntar.
          </h2>
          <p
            className="text-sm md:text-base mt-4 max-w-xl mx-auto"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", opacity: 0.9 }}
          >
            As 5 objeções mais comuns de donos de barbearia — respondidas com dados reais.
          </p>
        </div>

        {/* FAQ — accordion centralizado */}
        <div
          className="max-w-3xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >

          {allItems.map((item, index) => (
            <FAQAccordionItem
              key={index}
              item={item}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
              index={index}
            />
          ))}

          {!showExtra && (
            <div className="pt-6">
              <button
                onClick={() => setShowExtra(true)}
                className="text-sm font-semibold transition-colors"
                style={{
                  color: "#ebad04",
                  fontFamily: "var(--font-montserrat)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                Ver mais 4 dúvidas
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
