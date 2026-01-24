"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  // App Próprio
  {
    category: "App Próprio",
    question: "O que é o App Próprio personalizado?",
    answer: "É um aplicativo exclusivo da sua barbearia, publicado na App Store e Play Store com o nome e a identidade visual do seu negócio. Seus clientes baixam o app da sua barbearia e acessam apenas os serviços do seu estabelecimento, sem ver concorrentes.",
  },
  {
    category: "App Próprio",
    question: "Quanto tempo leva para ter meu App Próprio publicado nas lojas?",
    answer: "Após a assinatura do contrato e envio das informações necessárias (logo, cores, dados do negócio), o processo de desenvolvimento e publicação leva em média 15 a 30 dias úteis, dependendo da aprovação das lojas (Apple e Google).",
  },
  {
    category: "App Próprio",
    question: "Posso enviar notificações personalizadas para meus clientes?",
    answer: "Sim! Com o App Próprio você pode enviar push notifications personalizadas diretamente para o celular dos seus clientes. Ideal para avisar sobre promoções, lembrar de agendamentos, comunicar novidades ou reativar clientes inativos.",
  },
  // Clube de Assinaturas
  {
    category: "Clube de Assinaturas",
    question: "Como funciona o Clube de Assinaturas?",
    answer: "O Clube de Assinaturas permite que você crie planos recorrentes (mensais, quinzenais, semanais) para seus clientes. Eles pagam automaticamente e têm direito a um número determinado de serviços por período. Isso gera receita previsível e fideliza o cliente.",
  },
  {
    category: "Clube de Assinaturas",
    question: "Posso criar diferentes tipos de planos de assinatura?",
    answer: "Sim! Você pode criar planos limitados (ex: 4 cortes por mês) ou ilimitados (cortes ilimitados por mês). Também pode incluir diferentes serviços em cada plano e definir preços diferenciados.",
  },
  {
    category: "Clube de Assinaturas",
    question: "O que acontece quando um cliente assinante está inadimplente?",
    answer: "O sistema bloqueia automaticamente o agendamento de clientes inadimplentes e envia notificações de lembrete de pagamento. Você também pode acompanhar relatórios de inadimplência e chargeback.",
  },
  {
    category: "Clube de Assinaturas",
    question: "Como recebo os pagamentos das assinaturas?",
    answer: "Os pagamentos são processados automaticamente e o valor é creditado na sua conta. Você pode acompanhar o extrato de recebimentos, faturas previstas e fazer saques diretamente pelo sistema.",
  },
  // Notas Fiscais
  {
    category: "Notas Fiscais",
    question: "Como funciona a emissão automática de Notas Fiscais?",
    answer: "O sistema emite automaticamente a nota fiscal de serviço (NFS-e) após cada atendimento ou pagamento. Você configura os dados fiscais uma vez e o sistema cuida do resto.",
  },
  {
    category: "Notas Fiscais",
    question: "Preciso ter CNPJ para emitir notas fiscais pelo sistema?",
    answer: "Sim, é necessário ter CNPJ e estar cadastrado na prefeitura da sua cidade para emissão de NFS-e. Nosso time pode ajudar você a configurar a integração com o sistema da sua prefeitura.",
  },
  {
    category: "Notas Fiscais",
    question: "Posso exportar as notas fiscais emitidas?",
    answer: "Sim! Você pode exportar todas as notas fiscais em formato PDF e XML, além de ter acesso ao histórico completo de notas emitidas para controle contábil.",
  },
  // Agendamentos
  {
    category: "Agendamentos",
    question: "Como funciona o agendamento online?",
    answer: "Seus clientes podem agendar serviços 24 horas por dia, 7 dias por semana, diretamente pelo aplicativo ou pelo link personalizado da sua barbearia. Eles escolhem o profissional, serviço, data e horário disponíveis.",
  },
  {
    category: "Agendamentos",
    question: "Os clientes recebem lembretes dos agendamentos?",
    answer: "Sim! O sistema envia automaticamente notificações e lembretes de agendamento para os clientes, reduzindo faltas e no-shows. Você pode configurar quando e quantos lembretes enviar.",
  },
  {
    category: "Agendamentos",
    question: "Posso bloquear horários específicos na agenda?",
    answer: "Sim! Você pode bloquear horários para folgas, reuniões, ou qualquer outro compromisso. Também pode configurar os horários de funcionamento de cada profissional individualmente.",
  },
  // Gestão Financeira
  {
    category: "Gestão Financeira",
    question: "Quais formas de pagamento o sistema aceita?",
    answer: "O sistema aceita pagamento em dinheiro, cartão de crédito/débito (presencial ou online), Pix, e pagamentos recorrentes para assinaturas. Tudo é registrado automaticamente no controle financeiro.",
  },
  {
    category: "Gestão Financeira",
    question: "Como funciona a gestão de comissões dos barbeiros?",
    answer: "Você configura a porcentagem ou valor fixo de comissão para cada serviço e profissional. O sistema calcula automaticamente quanto cada barbeiro tem a receber e gera relatórios detalhados.",
  },
  // Totem
  {
    category: "Totem",
    question: "O que é o Totem de Autoatendimento?",
    answer: "É um equipamento físico (tablet em suporte) que fica na sua barbearia permitindo que o cliente faça check-in, adicione produtos à comanda, efetue pagamento e agende o próximo atendimento de forma autônoma.",
  },
  {
    category: "Totem",
    question: "Preciso comprar o Totem separadamente?",
    answer: "O Totem é um adicional opcional ao plano App Exclusivo. Você pode adquiri-lo para modernizar o atendimento da sua barbearia e reduzir filas no caixa.",
  },
  // Geral
  {
    category: "Geral",
    question: "Quantos barbeiros posso cadastrar no sistema?",
    answer: "Não há limite! Tanto no plano Básico quanto no App Exclusivo, você pode cadastrar quantos barbeiros e profissionais precisar, sem custos adicionais por usuário.",
  },
  {
    category: "Geral",
    question: "O sistema funciona em múltiplas unidades?",
    answer: "Sim! Se você tem mais de uma barbearia, pode gerenciar todas as unidades em um único painel, com relatórios consolidados ou separados por unidade.",
  },
  {
    category: "Geral",
    question: "Tem suporte se eu tiver dúvidas?",
    answer: "Sim! Oferecemos suporte por WhatsApp e e-mail para todos os clientes. No plano App Exclusivo, você ainda conta com um gerente de contas exclusivo para te ajudar.",
  },
];

// Get unique categories
const categories = Array.from(new Set(faqItems.map(item => item.category)));

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index
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
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#ffaf02]/20 rotate-180" : "bg-white/5 group-hover:bg-white/10"
            }`}
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? "text-[#ffaf02]" : "text-gray-400 group-hover:text-[#ffaf02]"
            }`} />
        </div>
      </button>
      {/* CSS-based collapse animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="pb-5 md:pb-6 text-sm md:text-[15px] text-gray-400 leading-relaxed pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("App Próprio");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);

  const filteredItems = faqItems.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Handle scroll gradient visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftGradient(scrollLeft > 10);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
            Tire suas dúvidas sobre as funcionalidades do BestBarbers
          </p>
        </div>

        {/* Category Tabs - Horizontal scroll on mobile */}
        <div className="relative mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Left gradient fade */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none transition-opacity duration-300 md:hidden ${showLeftGradient ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Right gradient fade */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none transition-opacity duration-300 md:hidden ${showRightGradient ? "opacity-100" : "opacity-0"
              }`}
          />

          {/* Tabs container */}
          <div
            ref={tabsRef}
            className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2 md:pb-0 px-1 -mx-1 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpenItems(new Set([0]));
                }}
                className={`flex-shrink-0 px-4 py-2.5 md:px-5 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fade-in ${activeCategory === category
                    ? "bg-gradient-to-r from-[#ffaf02] to-[#ffc233] text-black shadow-[0_4px_20px_rgba(255,175,2,0.3)]"
                    : "bg-[#1a1a1a]/80 backdrop-blur-sm text-gray-300 hover:bg-[#252525] border border-gray-800/50 hover:border-gray-700"
                  }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Glassmorphism card */}
          <div className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 px-5 md:px-8 shadow-2xl">
            <div key={activeCategory} className="animate-fade-in">
              {filteredItems.map((item, index) => (
                <FAQAccordionItem
                  key={`${activeCategory}-${index}`}
                  item={item}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
