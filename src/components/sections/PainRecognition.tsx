"use client";

import { MessageSquare, DollarSign, Lock } from "lucide-react";

const painCards = [
  {
    icon: MessageSquare,
    quote: '"Tem horario?" "15h pode?" "Nao da." "Deixa pra la."',
    stat: "2 horas por dia no WhatsApp. 30 clientes perdidos por mes.",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
  },
  {
    icon: DollarSign,
    quote: '"Agenda lotada mas nunca sobra dinheiro."',
    stat: "-R$1,95 por corte. R$58 perdidos. Por dia.",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/20",
  },
  {
    icon: Lock,
    quote: '"Ultima vez que tirei ferias? Nao lembro."',
    stat: "Se voce parar, sua barbearia para?",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
  },
];

export function PainRecognition() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#0a0a0a]">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
            <p className="text-sm md:text-base text-gray-400 font-medium">
              Se voce se identificou com alguma dessas frases...
            </p>
          </div>

          {/* Pain Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8 md:mb-10">
            {painCards.map((card, index) => (
              <div
                key={index}
                className={`relative ${card.bgColor} ${card.borderColor} border rounded-2xl p-5 md:p-6 animate-fade-in-up`}
                style={{ animationDelay: `${0.1 + index * 0.15}s` }}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>

                {/* Quote */}
                <p className="text-white font-bold text-sm md:text-[15px] leading-relaxed mb-3 italic">
                  {card.quote}
                </p>

                {/* Stat */}
                <p className={`text-xs md:text-sm font-semibold ${card.color}`}>
                  {card.stat}
                </p>
              </div>
            ))}
          </div>

          {/* Resolution */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-white font-bold text-base md:text-lg">
              <span className="text-[#ffaf02]">1.200+ donos de barbearia</span> resolveram isso com BestBarbers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
