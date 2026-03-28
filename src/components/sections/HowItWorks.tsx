"use client";

import { MessageCircle, Settings, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    number: "1",
    title: "Fale com a gente",
    description: "Retorno em minutos.",
    iconColor: "text-[#25D366]",
    iconBg: "bg-[#25D366]/15",
    gradient: "from-[#25D366]/10 to-transparent",
    border: "border-[#25D366]/15",
  },
  {
    icon: Settings,
    number: "2",
    title: "Configuramos tudo",
    description: "Gerente dedicado, 20 min.",
    iconColor: "text-[#ffaf02]",
    iconBg: "bg-[#ffaf02]/15",
    gradient: "from-[#ffaf02]/10 to-transparent",
    border: "border-[#ffaf02]/15",
  },
  {
    icon: TrendingUp,
    number: "3",
    title: "Comece a lucrar",
    description: "Receita todo mes.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    gradient: "from-emerald-500/10 to-transparent",
    border: "border-emerald-500/15",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#121212] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center text-base md:text-lg font-extrabold text-white mb-6">
          Como funciona
        </h2>

        {/* Mobile: horizontal 3-step compact row */}
        <div className="grid grid-cols-3 gap-2 md:hidden">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className={`bg-gradient-to-b ${step.gradient} border ${step.border} rounded-xl p-3 text-center`}>
                <div className={`w-10 h-10 ${step.iconBg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>
                <h3 className="text-white font-bold text-xs mb-0.5">{step.title}</h3>
                <p className="text-gray-500 text-[10px] leading-tight">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Desktop: wider cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`bg-gradient-to-b ${step.gradient} backdrop-blur-sm border ${step.border} rounded-2xl p-5 text-center animate-fade-in-up`}
                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              >
                <span className={`${step.iconColor} text-[10px] font-extrabold`}>
                  PASSO {step.number}
                </span>
                <div className={`w-12 h-12 ${step.iconBg} rounded-2xl flex items-center justify-center mx-auto my-3`}>
                  <Icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

        <p className="text-center text-gray-600 text-[10px] md:text-[11px] font-medium mt-4">
          Sem taxa de implantacao \u00b7 A partir de R$299/mes \u00b7 Cancela quando quiser
        </p>
      </div>
    </section>
  );
}
