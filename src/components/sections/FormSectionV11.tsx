"use client";

import { useLeadForm, useUtmParams } from "@/hooks";
import { ArrowRight, Sparkles, Shield, Clock, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const formFields = [
  { name: "ownerName", label: "Seu nome", placeholder: "Ex: João Silva", type: "text" },
  { name: "barbershopName", label: "Nome da barbearia", placeholder: "Ex: Barbearia do João", type: "text" },
  { name: "whatsapp", label: "WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
  { name: "employeeCount", label: "Quantas cadeiras?", placeholder: "Ex: 4", type: "number" },
  { name: "monthlyRevenue", label: "Faturamento mensal", placeholder: "Selecione", type: "select", options: [
    { value: "", label: "Selecione" },
    { value: "ate_5k", label: "Até R$ 5 mil" },
    { value: "5_10k", label: "R$ 5 mil a R$ 10 mil" },
    { value: "10_20k", label: "R$ 10 mil a R$ 20 mil" },
    { value: "20_50k", label: "R$ 20 mil a R$ 50 mil" },
    { value: "50k_mais", label: "Acima de R$ 50 mil" },
  ] },
];

const trustBadges = [
  { icon: Shield, text: "Sem taxa de implantação" },
  { icon: Users, text: "1.200+ barbearias" },
];

/** Header copy alinhado ao ângulo do anúncio (utm_content) — pivot OFERTA */
function getFormHeading(utmContent: string | null) {
  const content = utmContent?.toLowerCase() || "";

  if (content.includes("kaiq") || content.includes("bairro") || content.includes("maior") || content.includes("growth")) {
    return { lead: "Quero o app que vai me transformar", highlight: "na maior do meu bairro" };
  }
  if (content.includes("math") || content.includes("r34k") || content.includes("ops") || content.includes("dinheiro") || content.includes("receber")) {
    return { lead: "Quero faturar todo mês", highlight: "no automático" };
  }
  if (content.includes("gestao") || content.includes("sistema") || content.includes("quesist") || content.includes("operacao")) {
    return { lead: "Quero meu app + dashboard", highlight: "num lugar só" };
  }
  if (content.includes("ferias") || content.includes("prisao")) {
    return { lead: "Quero minha barbearia rodando", highlight: "sem mim" };
  }
  return { lead: "Quero meu app próprio", highlight: "com a minha marca" };
}

export function FormSectionV11() {
  const { getUtmParams } = useUtmParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const utmContent = useMemo(() => mounted ? getUtmParams().utm_content : null, [mounted, getUtmParams]);
  const heading = useMemo(() => getFormHeading(utmContent), [utmContent]);

  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    isDedupChecking,
    handleInputChange,
    handleSubmit,
  } = useLeadForm({
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    },
    // originId/originDesc now derived from UTM params by useLeadForm
    // Previously hardcoded: originId: 40210173 — broke attribution for non-paid sources
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
            App próprio 100% GRATUITO
          </span>
        </div>

        {/* Title */}
        <h2 className="font-extrabold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] lg:text-[44px] lg:leading-[52px] tracking-tight text-white mb-6 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {heading.lead}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">{heading.highlight}</span>
        </h2>


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

        {/* ROI Framing Banner */}
        <div className="bg-gradient-to-r from-[#ffaf02]/10 to-[#ffc233]/10 border border-[#ffaf02]/30 rounded-2xl p-5 mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffaf02]/20 rounded-full">
              <Shield className="w-3.5 h-3.5 text-[#ffaf02]" />
              <span className="text-[#ffaf02] text-xs font-bold uppercase">Você economiza R$ 3.000</span>
            </div>
            <div className="text-white font-extrabold text-lg md:text-xl">
              Antes <s className="text-gray-500 font-bold">R$ 3.000</s> · Hoje <span className="text-[#ffaf02]">R$ 0</span>
            </div>
            <div className="text-gray-300 text-sm font-medium">
              Implantação 100% gratuita. Mensalidade a partir de R$ 299/mês.
            </div>
            <div className="text-[#ffaf02] font-bold text-sm">
              Outros sistemas cobram de R$ 3.000 a R$ 5.000 para fazer seu app
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 p-6 md:p-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field, index) => (
              <div
                key={field.name}
                className="space-y-2 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <label className="block font-semibold text-[13px] md:text-[14px] leading-[20px] text-white/90">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                    required
                    className="w-full bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl px-5 py-4 text-white font-medium text-[15px] leading-[20px] focus:outline-none focus:border-[#ffaf02] focus:bg-[#12141a] focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all duration-300 hover:border-[#3a3d45] appearance-none cursor-pointer"
                  >
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl px-5 py-4 text-white placeholder-gray-500 font-medium text-[15px] leading-[20px] focus:outline-none focus:border-[#ffaf02] focus:bg-[#12141a] focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] focus:scale-[1.01] transition-all duration-300 hover:border-[#3a3d45]"
                  />
                )}
              </div>
            ))}

            {/* Zero implantation badge */}
            <div className="flex justify-center py-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#ffaf02]/15 rounded-full text-[#ffaf02] text-xs font-bold border border-[#ffaf02]/30">
Mensalidades a partir de R$299/mês
              </span>
            </div>

            {/* Submit Button */}
            <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className={`rounded-full ${!isSubmitting && !submitted ? 'animate-pulse-glow-gold' : ''}`}>
                <button
                  type="submit"
                  disabled={isSubmitting || submitted || isDedupChecking}
                  className="w-full bg-gradient-to-r from-[#029912] to-[#02ab15] text-white font-extrabold text-[14px] md:text-[16px] leading-[24px] px-6 py-5 rounded-full hover:from-[#029912] hover:to-[#02ab15] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_8px_40px_rgba(2,171,21,0.5)] hover:shadow-[0_12px_50px_rgba(2,171,21,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                      ENVIANDO...
                    </>
                  ) : submitted ? (
                    <>
                      REDIRECIONANDO...
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : isDedupChecking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      VALIDANDO...
                    </>
                  ) : (
                    <>
                      QUERO MEU APP PRÓPRIO
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

      {/* CSS animations */}
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
