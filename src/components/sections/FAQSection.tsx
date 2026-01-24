"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-800/50 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-4 md:py-5 flex items-center justify-between text-left gap-4 group"
      >
        <span className="text-sm md:text-base font-medium text-white group-hover:text-[#ffaf02] transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#ffaf02] transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 md:pb-5 text-sm text-gray-400 leading-relaxed pr-8">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<string>("App Próprio");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

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

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#121212]">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4">
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Perguntas frequentes
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            Tire suas dúvidas sobre as funcionalidades do BestBarbers
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpenItems(new Set([0]));
              }}
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#ffaf02] text-black"
                  : "bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] border border-gray-800"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 px-5 md:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {filteredItems.map((item, index) => (
                  <FAQAccordionItem
                    key={`${activeCategory}-${index}`}
                    item={item}
                    isOpen={openItems.has(index)}
                    onToggle={() => toggleItem(index)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10 md:mt-14"
        >
          <p className="text-sm text-gray-400 mb-4">
            Ainda tem dúvidas? Fale com nosso time!
          </p>
          <a
            href="https://wa.me/5531990657164?text=Olá!%20Gostaria%20de%20tirar%20algumas%20dúvidas%20sobre%20o%20BestBarbers!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full text-sm font-bold hover:bg-[#20BD5A] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Falar com especialista
          </a>
        </motion.div>
      </div>
    </section>
  );
}
