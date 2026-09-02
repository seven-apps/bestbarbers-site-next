"use client";

import { useEffect, useMemo, useState } from "react";
import { useLeadForm, useUtmParams } from "@/hooks";
import { ArrowRight, ShieldCheck, Users2, Ticket, CheckCircle2 } from "lucide-react";

// Origem DEDICADA do evento (criada 02/Set/26 via scripts/ploomes/cadastrar-lead.ts
// no repo bestbarbers-ai): todo lead desta LP nasce identificado no Ploomes.
// UTM vence quando presente (padrão GuiaForm) — mas "email" não existe no originMap,
// então o tráfego do e-mail da campanha cai aqui mesmo.
const EVENTO_ORIGIN_ID = 120004072; // "Evento - Dezembro Lotado"
const EVENTO_ORIGIN_DESC = "LP Dezembro Lotado - 25 vagas app";

// Campos CANÔNICOS (mesmos nomes/values do V12 → useLeadForm calcula o mesmo
// lead_score de qualquer outra LP). Ver o racional completo no GuiaForm da
// cadeira-cheia — aqui só muda a moldura/copy.
const formFields = [
  { name: "ownerName", label: "Seu nome", placeholder: "Ex: João Silva", type: "text" },
  { name: "barbershopName", label: "Nome da sua barbearia", placeholder: "Ex: Barbearia do João", type: "text" },
  { name: "whatsapp", label: "Seu WhatsApp", placeholder: "(31) 99999-9999", type: "tel" },
  { name: "email", label: "Seu e-mail (opcional, pra gente falar com você depois)", placeholder: "Ex: joao@email.com", type: "email" },
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
    name: "employeeCount",
    label: "Quantas cadeiras tem sua barbearia?",
    placeholder: "Selecione",
    type: "select",
    options: [
      { value: "", label: "Selecione" },
      { value: "Sou apenas eu", label: "1 cadeira (sou eu)" },
      { value: "2 a 4 colaboradores", label: "2 a 4 cadeiras" },
      { value: "5 ou mais colaboradores", label: "5 ou mais cadeiras" },
    ],
  },
];

export function EventoForm() {
  // Padrão GuiaForm: UTM vence, origem do evento é o fallback; guard de hidratação.
  const { getUtmParams, getOriginMapping } = useUtmParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const utmMapping = useMemo(
    () => (mounted ? getOriginMapping(getUtmParams()) : { originId: null, originDesc: null }),
    [mounted, getOriginMapping, getUtmParams]
  );

  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    isDedupChecking,
    handleInputChange,
    handleSubmit,
  } = useLeadForm({
    source: "lp_evento_dezlotado",
    originId: utmMapping.originId ?? EVENTO_ORIGIN_ID,
    originDesc: utmMapping.originDesc || EVENTO_ORIGIN_DESC,
    requireMonthlyRevenue: true,
    // Sucesso INLINE (sem redirect): a /obrigado fala de download de guia — aqui a
    // promessa é outra (vaga na lista) e a confirmação precisa dizer exatamente o
    // que acontece: time chama no WhatsApp + fechamento é no evento.
    onSuccess: () => {},
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
    },
  });

  const monthlyRevenueError = !!submitError && submitError.includes("Faturamento");

  // O form pergunta a ferramenta de interesse? Não — a LP É sobre o app personalizado.
  // O hook aceita interestedTool via formData; fixamos o value canônico que pontua +40
  // no lead score (é literalmente o interesse declarado por quem pede esta vaga).
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleInputChange(e);
  };
  useEffect(() => {
    if (!mounted) return;
    handleInputChange({
      target: { name: "interestedTool", value: "Meu Próprio App + Clube de Assinaturas e emissão de NFs" },
    } as React.ChangeEvent<HTMLInputElement>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (submitted) {
    return (
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: "#ffffff", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
      >
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />
        <div className="px-6 md:px-8 py-10 flex flex-col items-center text-center">
          <CheckCircle2 className="w-12 h-12 mb-4" style={{ color: "#02ab15" }} />
          <h2
            className="mb-3 leading-tight"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(20px, 3vw, 26px)", color: "#1e1e1e" }}
          >
            Você está na lista!
          </h2>
          <p className="text-sm mb-2" style={{ color: "#1e1e1e", opacity: 0.75, fontFamily: "var(--font-montserrat)" }}>
            Nosso time confirma a sua vaga pelo WhatsApp. No domingo (06/09), passe no
            estande da BestBarbers — a gratuidade do desenvolvimento vale para quem
            fechar durante o evento.
          </p>
          <p className="text-xs mt-3" style={{ color: "#1e1e1e", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}>
            Vagas limitadas a 25, por ordem de chegada.
          </p>
        </div>
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, #ebad04, transparent)" }} />
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-md rounded-3xl overflow-hidden"
      style={{ background: "#ffffff", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
    >
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />

      <div className="px-6 md:px-8 py-8 md:py-10 flex flex-col items-center">
        <div className="flex justify-center mb-5">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide"
            style={{
              background: "rgba(235,173,4,0.12)",
              borderColor: "rgba(235,173,4,0.4)",
              color: "#b38900",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            <Ticket className="w-4 h-4" />
            Condição do evento
          </span>
        </div>

        <h2
          className="text-center mb-2 leading-tight"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(22px, 3.5vw, 28px)", color: "#1e1e1e" }}
        >
          Garanta a <span style={{ color: "#ebad04" }}>sua vaga</span>
        </h2>
        <p className="text-center text-sm mb-6" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
          Preencha e entre na lista das 25 — a gratuidade do desenvolvimento vale
          fechando durante o evento.
        </p>

        <div className="flex justify-center gap-6 mb-6 w-full">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
            <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
              Ordem de chegada
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users2 className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
            <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
              +1.300 barbearias
            </span>
          </div>
        </div>

        {submitError && (
          <div className="w-full rounded-xl p-4 mb-5 border" style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" }}>
            <p className="text-sm font-medium text-center" style={{ color: "#dc2626", fontFamily: "var(--font-montserrat)" }}>
              {submitError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {formFields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="block font-semibold text-[13px] leading-[20px]" style={{ color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}>
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
                        onChange={onChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                        required
                        className="w-full rounded-xl px-4 py-3.5 font-medium text-[15px] transition-all duration-200 appearance-none cursor-pointer outline-none"
                        style={{ background: "#f5f5f5", border: `1.5px solid ${fieldHasError ? "#dc2626" : "#e0e0e0"}`, color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}
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
                  onChange={onChange}
                  placeholder={field.placeholder}
                  required={field.name !== "email"}
                  className="w-full rounded-xl px-4 py-3.5 font-medium text-[15px] transition-all duration-200 outline-none"
                  style={{ background: "#f5f5f5", border: "1.5px solid #e0e0e0", color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#ebad04"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235,173,4,0.15)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; }}
                />
              )}
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || submitted || isDedupChecking}
              className="w-full text-white font-extrabold text-[15px] md:text-[16px] px-6 py-5 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #029912, #02ab15)", boxShadow: "0 4px 14px 0 rgba(2,171,21,0.39)", fontFamily: "var(--font-montserrat)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ENVIANDO...
                </>
              ) : isDedupChecking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  VALIDANDO...
                </>
              ) : (
                <>
                  Garantir minha vaga
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <p
            className="text-center text-[10px] uppercase tracking-wider mt-2 flex items-center justify-center gap-1.5"
            style={{ color: "#1e1e1e", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}
          >
            <ShieldCheck className="w-3 h-3" fill="currentColor" />
            Seus dados estão seguros
          </p>
        </form>
      </div>

      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, #ebad04, transparent)" }} />
    </div>
  );
}
