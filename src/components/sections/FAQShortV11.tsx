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

// 5 objeções críticas pré-form (resto fica em "ver mais")
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
    answer: <><H>82 barbearias</H> que migraram pra BestBarbers relataram a mesma coisa: suporte fraco e implementação abandonada lá fora. Aqui você tem <W>gerente de contas dedicado</W> do dia 1, migração completa dos seus dados e acompanhamento dos primeiros resultados. Não é chatbot — é uma pessoa real.</>,
  },
  {
    question: "Funciona pra barbearia pequena?",
    answer: <>Funciona melhor pra pequenas. O caso de <H>4 cadeiras com R$31.690/mês</H> é de uma barbearia pequena. Thaís opera <H>sozinha com 1 cadeira</H> e fatura R$12K/mês. Gestão organizada faz mais diferença quando o time é enxuto — cada hora que você para de agendar pelo WhatsApp vira hora cortando.</>,
  },
];

// Ficam atrás de um "Ver mais dúvidas" colapsável
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
    answer: <>Desenvolvimento do <W>app próprio</W> com a sua marca, publicação na <W>App Store + Play Store</W>, configuração completa do clube de assinaturas, importação dos seus clientes e onboarding com <W>gerente de contas dedicado</W>. Tudo isso em até <H>30 dias</H> e <H>100% gratuito</H> — outros sistemas cobram R$ 3.000 a R$ 5.000 só pra começar.</>,
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

export function FAQShortV11() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const [showExtra, setShowExtra] = useState(false);

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

  const allItems = showExtra ? [...faqCritical, ...faqExtra] : faqCritical;

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
            Antes de você perguntar...
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            As 5 objeções mais comuns de donos de barbearia — respondidas com dados reais
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 px-5 md:px-8 shadow-2xl">
            {allItems.map((item, index) => (
              <FAQAccordionItem
                key={index}
                item={item}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
                index={index}
              />
            ))}
          </div>

          {!showExtra && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowExtra(true)}
                className="text-sm font-semibold text-[#ffaf02] hover:text-[#ffc233] transition-colors underline-offset-4 hover:underline"
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
