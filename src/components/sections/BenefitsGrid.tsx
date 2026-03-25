"use client";

import { TrendingUp, MessageSquareOff, Eye, Headphones } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Faturamento previsivel todo mes",
    description: "Clube de assinaturas com cobranca automatica. Seus clientes pagam no automatico — voce sabe exatamente quanto entra antes de abrir a porta.",
    stat: "353 assinantes = R$31.690/mes",
  },
  {
    icon: MessageSquareOff,
    title: "Zero tempo no WhatsApp",
    description: "Agenda online com confirmacao automatica. Seus clientes marcam sozinhos, recebem lembrete e voce para de perder 2h por dia respondendo mensagem.",
    stat: "6M de agendamentos por mes",
  },
  {
    icon: Eye,
    title: "Veja seu lucro real em tempo real",
    description: "Dashboard financeiro com comissoes, ticket medio e margem por servico. Descubra em 5 minutos se voce esta lucrando ou pagando pra trabalhar.",
    stat: "Controle de cada centavo",
  },
  {
    icon: Headphones,
    title: "Gerente dedicado do dia 1",
    description: "Nao e chatbot. E uma pessoa real via WhatsApp que monta seu clube, migra seus dados e acompanha seus primeiros resultados.",
    stat: "Onboarding completo incluso",
  },
];

export function BenefitsGrid() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-[#121212]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            O que muda na sua barbearia com o{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">BestBarbers</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            Resultados reais de 1.200+ barbearias que ja usam
          </p>
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-[#1a1a1a]/80 to-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 md:p-8 hover:border-[#ffaf02]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,175,2,0.08)] animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#ffaf02]/10 flex items-center justify-center mb-4 group-hover:bg-[#ffaf02]/20 transition-colors duration-300">
                <benefit.icon className="w-6 h-6 text-[#ffaf02]" />
              </div>

              {/* Content */}
              <h3 className="text-lg md:text-xl font-extrabold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm md:text-[15px] text-gray-400 leading-relaxed mb-3">
                {benefit.description}
              </p>
              <span className="inline-block text-xs font-bold text-[#ffaf02] bg-[#ffaf02]/10 px-3 py-1 rounded-full">
                {benefit.stat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
