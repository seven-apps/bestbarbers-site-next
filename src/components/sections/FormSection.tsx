"use client";

import { useLeadForm } from "@/hooks";
import { ArrowRight, Sparkles, Shield, Clock, Users } from "lucide-react";

interface FormSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  /** ID de origem customizado para o Ploomes - sobrescreve o mapeamento de UTM */
  originId?: number;
  /** Descrição de origem customizada para o Ploomes - sobrescreve o mapeamento de UTM */
  originDesc?: string;
  /** Source identifier para tracking (ex: lp_v4) */
  source?: string;
}

const formFields = [
  { name: "barbershopName", label: "Nome da Barbearia", placeholder: "Digite o nome da sua barbearia", type: "text" },
  { name: "ownerName", label: "Nome do Dono", placeholder: "Digite o nome do dono da barbearia", type: "text" },
  { name: "email", label: "E-mail do Dono", placeholder: "Digite seu melhor e-mail", type: "email" },
  { name: "whatsapp", label: "WhatsApp do Dono", placeholder: "Celular - whatsapp do dono da barbearia", type: "tel" },
  { name: "monthlyRevenue", label: "Qual o faturamento médio da sua barbearia?", placeholder: "Selecione", type: "select", options: [
    { value: "", label: "Selecione" },
    { value: "Até R$ 2.000", label: "Até R$ 2.000" },
    { value: "R$ 2.000 a R$ 10.000", label: "R$ 2.000 a R$ 10.000" },
    { value: "De R$ 10.000 a R$ 30.000", label: "De R$ 10.000 a R$ 30.000" },
    { value: "Acima de R$ 30.000", label: "Acima de R$ 30.000" },
  ] },
  { name: "interestedTool", label: "Qual ferramenta mais te interessa hoje?", placeholder: "Selecione", type: "select", options: [
    { value: "", label: "Selecione" },
    { value: "Agenda e Controle Financeiro", label: "Agenda e Controle Financeiro" },
    { value: "Meu Próprio App + Clube de Assinaturas e emissão de NFs", label: "Meu Próprio App + Clube de Assinaturas e emissão de NFs" },
  ] },
  { name: "employeeCount", label: "Quantos profissionais trabalham na sua barbearia?", placeholder: "Selecione", type: "select", options: [
    { value: "", label: "Selecione" },
    { value: "Sou apenas eu", label: "Sou apenas eu" },
    { value: "2 a 4 colaboradores", label: "2 a 4 colaboradores" },
    { value: "5 ou mais colaboradores", label: "5 ou mais colaboradores" },
  ] },
];

const trustBadges = [
  { icon: Shield, text: "Dados seguros" },
  { icon: Clock, text: "Resposta em 24h" },
  { icon: Users, text: "+1000 barbearias" },
];

export function FormSection({
  title = "Garanta já sua oferta exclusiva para ter o app da sua barbearia",
  description = "Você pode continuar no improviso, ou pode dar o próximo passo e ter seu app, sua marca e sua receita recorrente.\n\nO BestBarbers faz isso rápido, simples e sem custo absurdo.",
  ctaText = "GARANTIR MEU DIAGNÓSTICO DE GESTÃO",
  originId,
  originDesc,
  source,
}: FormSectionProps) {
  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    handleInputChange,
    handleSubmit,
  } = useLeadForm({
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    },
    originId,
    originDesc,
    source,
  });

  return (
    <section
      id="form-section"
      className="relative px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Background decorations estilo V12 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #ebad04 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-mode-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Badge estilo V12 */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <span 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[#ebad04] text-xs font-bold border border-[#ebad04]/30 uppercase tracking-widest"
            style={{ background: "rgba(235,173,4,0.1)", fontFamily: "var(--font-montserrat)" }}
          >
            <Sparkles className="w-4 h-4" fill="currentColor" />
            Oferta por tempo limitado
          </span>
        </div>

        {/* Title estilo V12 */}
        <h2 
          className="tracking-tight text-white mb-8 text-center animate-fade-in-up"
          style={{ 
            fontFamily: "var(--font-vollkorn)", 
            fontSize: "clamp(28px, 6vw, 44px)", 
            fontWeight: 800,
            lineHeight: 1.1
          }}
        >
          {title.split("oferta exclusiva").map((part, i) =>
            i === 0 ? (
              <span key={i}>
                {part}
                <span style={{ color: "#ebad04" }}>oferta exclusiva</span>
              </span>
            ) : (
              part
            )
          )}
        </h2>

        {/* Description estilo V12 */}
        <p 
          className="font-medium text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] text-white/60 mb-10 text-center whitespace-pre-line max-w-xl mx-auto animate-fade-in-up" 
          style={{ animationDelay: '0.2s', fontFamily: "var(--font-montserrat)" }}
        >
          {description}
        </p>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 md:gap-10 mb-10 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white/40 animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <badge.icon className="w-4 h-4 text-[#ebad04]" fill="currentColor" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-montserrat)" }}>{badge.text}</span>
            </div>
          ))}
        </div>


        {/* Error display */}
        {submitError && (
          <div 
            className="rounded-xl p-4 mb-8 animate-scale-in border"
            style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)" }}
          >
            <p className="text-red-400 text-sm font-medium text-center">{submitError}</p>
          </div>
        )}

        {/* Form Card estilo V12 Bento-ish */}
        <div 
          className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl animate-fade-in-up" 
          style={{ animationDelay: '0.35s', backdropFilter: "blur(20px)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field, index) => (
              <div
                key={field.name}
                className="space-y-2 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <label 
                  className="block font-bold text-[11px] md:text-xs uppercase tracking-widest text-white/50"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white font-medium text-[15px] transition-all duration-300 outline-none appearance-none cursor-pointer hover:border-white/20 focus:border-[#ebad04]/50 focus:bg-white/[0.05]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
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
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 font-medium text-[15px] transition-all duration-300 outline-none hover:border-white/20 focus:border-[#ebad04]/50 focus:bg-white/[0.05]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  />
                )}
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className={`rounded-full ${!isSubmitting && !submitted ? 'animate-pulse-glow-green' : ''}`}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || submitted}
                  className="w-full text-white font-extrabold text-[15px] md:text-[16px] px-6 py-5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ 
                    background: "linear-gradient(135deg, #029912, #02ab15)",
                    boxShadow: "0 8px 30px rgba(2,171,21,0.4)",
                    fontFamily: "var(--font-montserrat)"
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ENVIANDO...
                    </>
                  ) : submitted ? (
                    <>
                      REDIRECIONANDO...
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      {ctaText}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Brand Signature estilo V12 */}
            <div className="text-center mt-8">
               <span 
                 className="text-xl md:text-2xl font-bold tracking-tighter"
                 style={{ 
                   color: "#ebad04", 
                   fontFamily: "var(--font-vollkorn)",
                   textShadow: "0 2px 10px rgba(235,173,4,0.1)"
                 }}
               >
                 BestBarbers
               </span>
            </div>

            <p 
              className="text-center text-white/30 text-[10px] uppercase tracking-widest mt-4 flex items-center justify-center gap-2 animate-fade-in" 
              style={{ animationDelay: '0.8s', fontFamily: "var(--font-montserrat)" }}
            >
              <Shield className="w-3 h-3" fill="currentColor" />
              Dados 100% Protegidos
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(2,171,21,0); }
          50% { box-shadow: 0 0 0 12px rgba(2,171,21,0.2); }
        }
        .animate-pulse-glow-green {
          animation: pulse-glow-green 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
