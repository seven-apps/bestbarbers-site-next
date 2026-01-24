"use client";

import { useLeadForm } from "@/hooks";
import { ArrowRight, Sparkles, Shield, Clock, Users } from "lucide-react";

interface FormSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
}

const formFields = [
  { name: "barbershopName", label: "Nome da Barbearia", placeholder: "Digite o nome da sua barbearia", type: "text" },
  { name: "ownerName", label: "Nome do Dono da barbearia", placeholder: "Digite o nome do dono da barbearia", type: "text" },
  { name: "whatsapp", label: "WhatsApp do Dono da barbearia", placeholder: "Celular - whatsapp do dono da barbearia", type: "tel" },
  { name: "monthlyRevenue", label: "Faturamento médio mensal (R$)", placeholder: "Quanto sua barbearia fatura por mês", type: "text" },
  { name: "employeeCount", label: "Número de colaboradores", placeholder: "Quantos colaboradores tem na barbearia", type: "number" },
];

const trustBadges = [
  { icon: Shield, text: "Dados seguros" },
  { icon: Clock, text: "Resposta em 24h" },
  { icon: Users, text: "+1000 barbearias" },
];

export function FormSection({
  title = "Garanta já sua oferta exclusiva para ter o app da sua barbearia",
  description = "Você pode continuar no improviso, ou pode dar o próximo passo e ter seu app, sua marca e sua receita recorrente.\n\nO BestBarbers faz isso rápido, simples e sem custo absurdo.",
  ctaText = "GARANTIR MINHA OFERTA",
}: FormSectionProps) {
  const {
    formData,
    isSubmitting,
    submitError,
    handleInputChange,
    handleSubmit,
  } = useLeadForm({
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    },
  });

  return (
    <section
      id="form-section"
      className="relative bg-[#121212] px-6 py-14 md:px-12 md:py-20 lg:px-24 lg:py-28 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffaf02]/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#ffaf02]/8 rounded-full blur-[100px]" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,175,2,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,175,2,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ffaf02]/15 to-[#ffc233]/15 rounded-full text-[#ffaf02] text-sm font-bold border border-[#ffaf02]/30 animate-glow-pulse">
            <Sparkles className="w-4 h-4" />
            Oferta por tempo limitado
          </span>
        </div>

        {/* Title */}
        <h2 className="font-extrabold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] lg:text-[44px] lg:leading-[52px] tracking-tight text-white mb-6 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {title.split("oferta exclusiva").map((part, i) =>
            i === 0 ? (
              <span key={i}>
                {part}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">oferta exclusiva</span>
              </span>
            ) : (
              part
            )
          )}
        </h2>

        {/* Description */}
        <p className="font-medium text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] text-gray-300 mb-8 text-center whitespace-pre-line max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {description}
        </p>

        {/* Trust Badges */}
        <div className="flex justify-center gap-4 md:gap-8 mb-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-gray-400 animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <badge.icon className="w-4 h-4 text-[#ffaf02]" />
              <span className="text-xs font-medium">{badge.text}</span>
            </div>
          ))}
        </div>


        {/* Error display */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm animate-scale-in">
            <p className="text-red-400 text-sm font-medium text-center">{submitError}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 p-6 md:p-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {formFields.map((field, index) => (
              <div
                key={field.name}
                className="space-y-2 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <label className="block font-semibold text-[13px] md:text-[14px] leading-[20px] text-white/90">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl px-5 py-4 text-white placeholder-gray-500 font-medium text-[15px] leading-[20px] focus:outline-none focus:border-[#ffaf02] focus:bg-[#12141a] focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] focus:scale-[1.01] transition-all duration-300 hover:border-[#3a3d45]"
                />
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              {/* Pulse wrapper with CSS animation */}
              <div className={`rounded-full ${!isSubmitting ? 'animate-pulse-glow-gold' : ''}`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#ffaf02] to-[#ffc233] text-[#121212] font-extrabold text-[15px] md:text-[16px] leading-[24px] px-6 py-5 rounded-full hover:from-[#e69f00] hover:to-[#ffaf02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_8px_40px_rgba(255,175,2,0.35)] hover:shadow-[0_12px_50px_rgba(255,175,2,0.45)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                      ENVIANDO...
                    </>
                  ) : (
                    <>
                      {ctaText}
                      <span className="animate-bounce-x">
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust text */}
            <p className="text-center text-gray-500 text-xs mt-4 flex items-center justify-center gap-1.5 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Shield className="w-3.5 h-3.5" />
              Seus dados estão seguros e não serão compartilhados
            </p>
          </form>
        </div>
      </div>
      
      {/* CSS animations for form-specific effects */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,175,2,0.2); }
          50% { box-shadow: 0 0 40px rgba(255,175,2,0.3); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        @keyframes pulse-glow-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,175,2,0); }
          50% { box-shadow: 0 0 0 12px rgba(255,175,2,0.15); }
        }
        .animate-pulse-glow-gold {
          animation: pulse-glow-gold 2s ease-in-out infinite;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
