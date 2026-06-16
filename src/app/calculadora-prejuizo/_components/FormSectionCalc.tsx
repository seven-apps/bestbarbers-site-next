"use client";

import { useLeadForm, useUtmParams } from "@/hooks";
import { ArrowRight, ShieldCheck, Users2, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const formFields = [
  { name: "ownerName", label: "Nome do Dono", placeholder: "Ex: João Silva", type: "text" },
  { name: "barbershopName", label: "Nome da barbearia", placeholder: "Ex: Barbearia do João", type: "text" },
  { name: "whatsapp", label: "WhatsApp do Dono", placeholder: "(11) 99999-9999", type: "tel" },
  {
    name: "monthlyRevenue",
    label: "Qual o faturamento médio da sua barbearia?",
    placeholder: "Selecione",
    type: "select",
    options: [
      { value: "", label: "Selecione" },
      { value: "Até R$ 2.000", label: "Até R$ 2.000" },
      { value: "R$ 2.000 a R$ 10.000", label: "R$ 2.000 a R$ 10.000" },
      { value: "De R$ 10.000 a R$ 30.000", label: "De R$ 10.000 a R$ 30.000" },
      { value: "Acima de R$ 30.000", label: "Acima de R$ 30.000" },
    ],
  },
  {
    name: "interestedTool",
    label: "Qual ferramenta mais te interessa hoje?",
    placeholder: "Selecione",
    type: "select",
    options: [
      { value: "", label: "Selecione" },
      { value: "Agenda e Controle Financeiro", label: "Agenda e Controle Financeiro" },
      { value: "Meu Próprio App + Clube de Assinaturas e emissão de NFs", label: "Meu Próprio App + Clube de Assinaturas e emissão de NFs" },
    ],
  },
  {
    name: "employeeCount",
    label: "Quantos profissionais trabalham na sua barbearia?",
    placeholder: "Selecione",
    type: "select",
    options: [
      { value: "", label: "Selecione" },
      { value: "Sou apenas eu", label: "Sou apenas eu" },
      { value: "2 a 4 colaboradores", label: "2 a 4 colaboradores" },
      { value: "5 ou mais colaboradores", label: "5 ou mais colaboradores" },
    ],
  },
];

function getFormHeading(utmContent: string | null) {
  const content = utmContent?.toLowerCase() || "";
  // Message-match com o ângulo do anúncio (continuidade criativo → calculadora → form).
  if (content.includes("prejuizo") || content.includes("perde") || content.includes("perdendo"))
    return { lead: "Quero parar de", highlight: "perder esse dinheiro" };
  if (content.includes("recorrencia") || content.includes("netflix") || content.includes("recorrente"))
    return { lead: "Quero faturamento recorrente", highlight: "todo mês no automático" };
  if (content.includes("clube") || content.includes("assinatura"))
    return { lead: "Quero montar", highlight: "meu clube de assinaturas" };
  if (content.includes("case") || content.includes("2x") || content.includes("dobrar"))
    return { lead: "Quero o resultado", highlight: "que essas barbearias tiveram" };
  return { lead: "Quero recuperar", highlight: "o que estou deixando na mesa" };
}

export function FormSectionCalc() {
  const { getUtmParams } = useUtmParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const utmContent = useMemo(
    () => (mounted ? getUtmParams().utm_content : null),
    [mounted, getUtmParams]
  );
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
    source: "calculadora_prejuizo",
    requireMonthlyRevenue: true,
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    },
  });

  const monthlyRevenueError = !!submitError && submitError.includes("Faturamento");

  // Multi-step: passo 1 = contato (baixa fricção), passo 2 = qualificação (lead_score).
  const [step, setStep] = useState(1);
  const STEP1_FIELDS = ["ownerName", "whatsapp"];
  const visibleFields = formFields.filter(
    (f) => STEP1_FIELDS.includes(f.name) === (step === 1)
  );
  const canAdvanceToStep2 =
    formData.ownerName.trim() !== "" && formData.whatsapp.trim() !== "";
  const goToStep2 = () => {
    if (canAdvanceToStep2) setStep(2);
  };

  return (
    <section
      id="form-section"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Bokeh sutil */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #ebad04 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div
        className="relative mx-4 md:mx-auto max-w-lg rounded-3xl overflow-hidden"
        style={{ background: "#ffffff", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
      >
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }}
        />

        <div className="px-6 md:px-10 py-10 md:py-12 flex flex-col items-center">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-in-up">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold"
              style={{
                background: "rgba(235,173,4,0.1)",
                borderColor: "rgba(235,173,4,0.4)",
                color: "#b38900",
                fontFamily: "var(--font-montserrat)",
              }}
            >
              <TrendingUp className="w-4 h-4" />
              SEU PLANO DE RECUPERAÇÃO
            </span>
          </div>

          {/* Título — message-match */}
          <h2
            className="text-center mb-3 leading-tight animate-fade-in-up"
            style={{
              fontFamily: "var(--font-vollkorn)",
              fontWeight: 800,
              fontSize: "clamp(24px, 4vw, 38px)",
              color: "#1e1e1e",
              animationDelay: "0.1s",
            }}
          >
            {heading.lead} <span style={{ color: "#ebad04" }}>{heading.highlight}</span>
          </h2>

          <p
            className="text-center text-[14px] mb-7 max-w-sm animate-fade-in-up"
            style={{
              color: "#6b6b6b",
              fontFamily: "var(--font-montserrat)",
              animationDelay: "0.15s",
            }}
          >
            Deixe seu contato e um especialista monta com você um plano para transformar
            essa perda em faturamento recorrente.
          </p>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 mb-8 animate-fade-in-up w-full" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
              <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
                Diagnóstico gratuito
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users2 className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
              <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
                1.200+ barbearias
              </span>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div
              className="w-full rounded-xl p-4 mb-6 animate-scale-in border"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" }}
            >
              <p className="text-sm font-medium text-center" style={{ color: "#dc2626", fontFamily: "var(--font-montserrat)" }}>
                {submitError}
              </p>
            </div>
          )}

          {/* Progresso */}
          <div className="flex items-center justify-center gap-2 mb-5 w-full">
            <span className="h-1.5 rounded-full transition-all duration-300" style={{ width: 28, background: "#ebad04" }} />
            <span className="h-1.5 rounded-full transition-all duration-300" style={{ width: 28, background: step === 2 ? "#ebad04" : "#e0e0e0" }} />
            <span className="text-xs font-semibold ml-1" style={{ color: "#1e1e1e", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}>
              Passo {step} de 2
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {visibleFields.map((field, index) => (
              <div
                key={field.name}
                className="space-y-1.5 animate-fade-in-up"
                style={{ animationDelay: `${0.25 + index * 0.05}s` }}
              >
                <label
                  className="block font-semibold text-[13px] leading-[20px]"
                  style={{ color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}
                >
                  {field.label}
                </label>
                {field.type === "select" ? (
                  (() => {
                    const fieldHasError = field.name === "monthlyRevenue" && monthlyRevenueError;
                    return (
                      <>
                        <select
                          name={field.name}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleInputChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                          required
                          className="w-full rounded-xl px-4 py-3.5 font-medium text-[15px] transition-all duration-200 appearance-none cursor-pointer outline-none"
                          style={{
                            background: "#f5f5f5",
                            border: `1.5px solid ${fieldHasError ? "#dc2626" : "#e0e0e0"}`,
                            color: "#1e1e1e",
                            fontFamily: "var(--font-montserrat)",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "#ebad04"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235,173,4,0.15)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = fieldHasError ? "#dc2626" : "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {fieldHasError && (
                          <p className="text-xs font-medium" style={{ color: "#dc2626", fontFamily: "var(--font-montserrat)" }}>
                            Selecione o faturamento médio para continuar
                          </p>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full rounded-xl px-4 py-3.5 font-medium text-[15px] transition-all duration-200 outline-none"
                    style={{
                      background: "#f5f5f5",
                      border: "1.5px solid #e0e0e0",
                      color: "#1e1e1e",
                      fontFamily: "var(--font-montserrat)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#ebad04"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235,173,4,0.15)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                )}
              </div>
            ))}

            {/* Submit */}
            <div className="pt-3 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
              <button
                type="button"
                onClick={step === 1 ? goToStep2 : handleSubmit}
                disabled={step === 1 ? !canAdvanceToStep2 : (isSubmitting || submitted || isDedupChecking)}
                className="w-full text-white font-extrabold text-[15px] md:text-[16px] px-6 py-5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #029912, #02ab15)",
                  boxShadow: "0 4px 14px 0 rgba(2,171,21,0.39)",
                  fontFamily: "var(--font-montserrat)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(2,171,21,0.23)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(2,171,21,0.39)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {step === 1 ? (
                  <>
                    CONTINUAR
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ENVIANDO...
                  </>
                ) : submitted ? (
                  <>✓ RECEBEMOS SEU CONTATO!</>
                ) : isDedupChecking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    VALIDANDO...
                  </>
                ) : (
                  <>
                    QUERO MEU PLANO DE RECUPERAÇÃO
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full mt-3 text-center text-[13px] font-medium underline"
                  style={{ color: "#1e1e1e", opacity: 0.5, fontFamily: "var(--font-montserrat)" }}
                >
                  ← Voltar
                </button>
              )}
            </div>

            {/* Brand */}
            <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: "0.75s" }}>
              <span
                className="text-lg md:text-xl font-bold tracking-tighter"
                style={{ color: "#ebad04", fontFamily: "var(--font-vollkorn)", textShadow: "0 2px 10px rgba(235,173,4,0.1)" }}
              >
                BestBarbers
              </span>
            </div>

            <p
              className="text-center text-[10px] uppercase tracking-wider mt-2 flex items-center justify-center gap-1.5 animate-fade-in opacity-60"
              style={{ color: "#1e1e1e", opacity: 0.6, fontFamily: "var(--font-montserrat)", animationDelay: "0.8s" }}
            >
              <ShieldCheck className="w-3 h-3" fill="currentColor" />
              Seus dados estão seguros
            </p>
          </form>
        </div>

        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, #ebad04, transparent)" }} />
      </div>
    </section>
  );
}
