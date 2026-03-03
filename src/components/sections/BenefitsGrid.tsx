"use client";

import { Smartphone, RefreshCcw, BarChart3, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Smartphone,
    title: "App Próprio na App Store",
    description: "Sua marca, seus clientes, sem concorrentes. Um aplicativo exclusivo publicado com o nome da sua barbearia.",
  },
  {
    icon: RefreshCcw,
    title: "Clube de Assinaturas",
    description: "Receita recorrente e previsível todo mês. Seus clientes pagam automaticamente e você fideliza com facilidade.",
  },
  {
    icon: BarChart3,
    title: "Gestão Inteligente",
    description: "Dashboard com as métricas que importam. Controle financeiro, comissões e relatórios em tempo real.",
  },
  {
    icon: Headphones,
    title: "Suporte Dedicado",
    description: "Time real que resolve, não robôs. Gerente de contas exclusivo para te ajudar a crescer.",
  },
];

export function BenefitsGrid() {
  return (
    <section className="py-14 md:py-20 lg:py-24 bg-[#121212]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Por que barbearias escolhem o{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">BestBarbers</span>
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto">
            Tudo que você precisa para transformar faturamento em lucro real
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
              <p className="text-sm md:text-[15px] text-gray-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
