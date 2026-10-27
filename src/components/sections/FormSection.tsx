"use client";

import { useLeadForm } from "@/hooks";
import { PerguntasQualificacao } from "@/components/forms/PerguntasQualificacao";
import { AvisoPrivacidade } from "@/components/forms/AvisoPrivacidade";
import { errosDeQualificacao } from "@/lib/qualificacao";
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
  /** Texto do botão depois do envio (o cupom do parceiro diz "cupom guardado"). */
  ctaEnviado?: string;
}

// Perguntas 1 a 4 — contato. As 5 a 8 vêm do <PerguntasQualificacao> (formulário
// único, André 14/Set/26). Ordem decidida: dono → WhatsApp → e-mail → barbearia.
const formFields = [
  { name: "ownerName", label: "Seu nome", placeholder: "João Silva", type: "text", autoComplete: "name" },
  { name: "whatsapp", label: "Seu WhatsApp com DDD", placeholder: "(11) 99999-9999", type: "tel", autoComplete: "tel-national" },
  { name: "barbershopName", label: "Nome da barbearia", placeholder: "Barbearia do João", type: "text", autoComplete: "organization" },
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
  ctaEnviado = "✓ RECEBEMOS SEU CONTATO!",
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

  const erros = errosDeQualificacao(submitError);

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
          className="bg-white border border-black/5 rounded-[2rem] overflow-hidden shadow-2xl animate-fade-in-up"
          style={{ animationDelay: '0.35s' }}
        >
          {/* Cartão branco (André, 27/Out/26): o mesmo das outras páginas, com a faixa dourada no topo. */}
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />
          <div className="p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-3">
            {formFields.map((field, index) => (
              <div
                key={field.name}
                className="space-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.05}s` }}
              >
                <label
                  htmlFor={`form-section-${field.name}`}
                  className="block font-semibold text-[13px] leading-[20px] text-[#1e1e1e]"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {field.label}
                </label>
                <input
                  id={`form-section-${field.name}`}
                  type={field.type}
                  name={field.name}
                autoComplete={field.autoComplete}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  required={field.name !== "email"}
                  className="w-full bg-[#f5f5f5] border-[1.5px] border-[#e0e0e0] rounded-xl px-4 py-3 text-[#1e1e1e] placeholder-[#1e1e1e]/40 font-medium text-[15px] transition-all duration-300 outline-none hover:border-[#cfcfcf] focus:border-[#ebad04]"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                />
              </div>
            ))}

            <PerguntasQualificacao
              variante="claro"
              valores={formData}
              onChange={handleInputChange}
              erros={erros}
              className="space-y-3"
            />

            {/* Submit Button */}
            <div className="pt-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
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
                      {ctaEnviado}
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

            <AvisoPrivacidade variante="claro" />

          </form>
          </div>
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
