"use client";

import { useLeadForm, useUtmParams } from "@/hooks";
import { ArrowRight, ShieldCheck, Users2, Clock } from "lucide-react";
import { MSG_EMAIL_INVALIDO, trackAvancoPasso2, validarEmailOpcional } from "@/lib/form-passo1";
import { useEffect, useMemo, useRef, useState } from "react";

const formFields = [
  { name: "ownerName", label: "Nome do Dono", placeholder: "Ex: João Silva", type: "text" },
  { name: "barbershopName", label: "Nome da barbearia", placeholder: "Ex: Barbearia do João", type: "text" },
  { name: "whatsapp", label: "WhatsApp do Dono", placeholder: "(11) 99999-9999", type: "tel" },
  // E-MAIL: houve uma IDA e uma VOLTA. Quem ler isto daqui a seis meses precisa das duas.
  //
  // REMOVIDO (OP400, 15/Jun/26): fricção pura — o canal de contato é o WhatsApp e o campo
  // era OBRIGATÓRIO, com regex que bloqueava o envio por erro de digitação. Perdia-se lead
  // inteiro por um "@gmail.con". A remoção atacava o leak visita→lead, e a nota de julho
  // ("não reintroduzir e-mail na V12") existia por causa desse regex barrando o envio.
  //
  // REPOSTO (01/Set/26): o que volta é OPCIONAL, não o campo de junho. Vazio passa direto
  // (o gate canAdvanceToStep2 exige só ownerName e whatsapp; o `required` do input é
  // negado para "email") e endereço torto só AVISA, sem prender ninguém — a razão da
  // remoção deixa de existir. O que forçou a revisão: a família precificação, sem o campo,
  // capturava e-mail em apenas 8,6% dos leads. Rótulo é opcional COM MOTIVO (gabarito
  // cadeira-cheia, 95,9% de preenchimento) e não promete entrega por e-mail — não existe
  // executor para lead do Ploomes. Vai para o campo NATIVO Email do Contact.
  //
  // Fica no PASSO 1 (ver STEP1_FIELDS): é a única tela por onde 100% de quem envia passa.
  // Régua de reversão: trackAvancoPasso2 mede passo 1 → passo 2; queda de conclusão
  // reabre o leak e o campo sai de novo.
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
  // Message-match OP400 (15/Jun): utm_content = ad.name dos criativos atuais.
  // Espelha o ângulo do anúncio na headline do form (continuidade criativo→LP).
  // Recorrência / Netflix / lift de assinatura
  if (content.includes("recorrencia") || content.includes("netflix") || content.includes("58k") || content.includes("40k") || content.includes("2mi") || content.includes("1mi"))
    return { lead: "Quero faturamento recorrente", highlight: "todo mês no automático" };
  // ROI / "o clube se paga"
  if (content.includes("roi") || content.includes("vs-"))
    return { lead: "Quero que o clube", highlight: "se pague sozinho" };
  // Case concreto (depoimento / número real)
  if (content.includes("case") || content.includes("depo") || content.includes("353") || content.includes("david") || content.includes("spazio") || content.includes("elchef"))
    return { lead: "Quero o resultado", highlight: "que essas barbearias tiveram" };
  // NFS-e / fiscal
  if (content.includes("nfse") || content.includes("nfs") || content.includes("fiscal"))
    return { lead: "Quero app, clube e NFS-e", highlight: "num lugar só" };
  // Legados (mantidos por compatibilidade)
  if (content.includes("kaiq") || content.includes("bairro") || content.includes("maior") || content.includes("growth"))
    return { lead: "Quero o app que vai me transformar", highlight: "na maior do meu bairro" };
  if (content.includes("math") || content.includes("r34k") || content.includes("dinheiro") || content.includes("receber"))
    return { lead: "Quero faturar todo mês", highlight: "no automático" };
  if (content.includes("gestao") || content.includes("sistema") || content.includes("operacao"))
    return { lead: "Quero meu app + dashboard", highlight: "num lugar só" };
  return { lead: "Quero meu app próprio", highlight: "com a minha marca" };
}

export function FormSectionV12() {
  const { getUtmParams } = useUtmParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const utmContent = useMemo(() => (mounted ? getUtmParams().utm_content : null), [mounted, getUtmParams]);
  const heading = useMemo(() => getFormHeading(utmContent), [utmContent]);

  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    isDedupChecking,
    handleInputChange,
    handleSubmit,
    setSubmitError,
  } = useLeadForm({
    source: "lp_v12",
    requireMonthlyRevenue: true,
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    },
  });

  // Estado de erro do campo de faturamento (validação no submit handler)
  const monthlyRevenueError = !!submitError && submitError.includes("Faturamento");
  // Estado de erro do campo de e-mail. O aviso dele NÃO pode morar no topo do cartão:
  // o bloco de erro geral nasce acima do "Passo 1 de 2" e, no mobile, fica atrás da
  // navbar fixa enquanto a pessoa está rolada até o botão — resultado medido: clica em
  // CONTINUAR e a tela não muda nada. Um campo opcional que trava sem avisar é a versão
  // silenciosa do leak que motivou a remoção de junho. O aviso vai EMBAIXO do input,
  // igual ao do faturamento, e o input recebe o foco (leva a tela até ele sozinho).
  const emailError = !!submitError && submitError === MSG_EMAIL_INVALIDO;

  // Multi-step (OP400 16/Jun): passo 1 = contato (baixa fricção → micro-commitment),
  // passo 2 = qualificação (faturamento/colaboradores alimentam o lead_score).
  // Reduz a fricção percebida (3 campos, não 7 — e 1 dos 3 é opcional) sem perder a
  // qualificação.
  const [step, setStep] = useState(1);
  const STEP1_FIELDS = ["ownerName", "whatsapp", "email"];
  const visibleFields = formFields.filter((f) => STEP1_FIELDS.includes(f.name) === (step === 1));
  // Gate do passo 1 INTOCADO: só nome e WhatsApp. É isto que mantém o e-mail
  // opcional de verdade — entrar no gate seria repor o campo obrigatório de junho.
  const canAdvanceToStep2 = formData.ownerName.trim() !== "" && formData.whatsapp.trim() !== "";
  // Avanço já medido nesta sessão de preenchimento — o "← Voltar" e um segundo
  // CONTINUAR não são um avanço novo, e contá-los duas vezes estragaria a régua.
  const avancoMedido = useRef(false);
  // Referência do input de e-mail: quando o formato está torto, o foco vai para ele.
  // No mobile o botão CONTINUAR fica abaixo da dobra, então a pessoa clica já rolada —
  // o foco traz o campo (e o aviso embaixo dele) de volta para a tela sozinho.
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const goToStep2 = () => {
    if (!canAdvanceToStep2) return;
    // O campo de e-mail vive AQUI, no passo 1. Validar só no submit (passo 2) fazia a
    // pessoa ver "E-mail deve ser válido" numa tela sem o campo. Vazio continua
    // passando: o campo é opcional e não é isto que o avisa.
    const erroEmail = validarEmailOpcional(formData.email);
    if (erroEmail) {
      setSubmitError(erroEmail);
      emailInputRef.current?.focus();
      // O onFocus do input roda ANTES do re-render com o erro, então ele ainda pinta o
      // halo dourado de campo normal. Sobrescreve na hora para vermelho (a borda o
      // re-render do React já corrige sozinho, pois ela vem do style).
      if (emailInputRef.current) {
        emailInputRef.current.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.15)";
      }
      return;
    }
    setSubmitError(null);
    if (!avancoMedido.current) {
      avancoMedido.current = true;
      trackAvancoPasso2({
        lpVersion: "lp_v12",
        emailPreenchido: formData.email.trim() !== "",
      });
    }
    setStep(2);
  };

  return (
    <section
      id="form-section"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Bokeh Background sutil */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #ebad04 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #ebad04 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>
      {/* Bloco principal — fundo branco com destaques dourados */}
      <div
        className="relative mx-4 md:mx-auto max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: "#ffffff",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Faixa dourada superior */}
        <div
          className="h-1.5 w-full"
          style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }}
        />

        <div className="px-6 md:px-10 py-10 md:py-12 flex flex-col items-center">
          {/* Badge urgência */}
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
              <Clock className="w-4 h-4" fill="currentColor" />
              ÚLTIMAS VAGAS DISPONÍVEIS
            </span>
          </div>

          {/* Título */}
          <h2
            className="text-center mb-2 leading-tight animate-fade-in-up"
            style={{
              fontFamily: "var(--font-vollkorn)",
              fontWeight: 800,
              fontSize: "clamp(24px, 4vw, 38px)",
              color: "#1e1e1e",
              animationDelay: "0.1s",
            }}
          >
            {heading.lead}{" "}
            <span style={{ color: "#ebad04" }}>{heading.highlight}</span>
          </h2>

          {/* ROI framing */}
          <div
            className="flex items-center justify-center gap-2 mb-8 mt-3 animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "#1e1e1e", opacity: 0.8, fontFamily: "var(--font-montserrat)" }}
            >
              Taxa de implantação:
            </span>
            <span
              className="text-sm font-extrabold line-through"
              style={{ color: "#9ca3af" }}
            >
              R$ 3.000
            </span>
            <span
              className="text-sm font-extrabold px-2 py-0.5 rounded"
              style={{ background: "#ebad04", color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}
            >
              R$ 0
            </span>
          </div>

          {/* Trust badges */}
          <div
            className="flex justify-center gap-6 mb-8 animate-fade-in-up w-full"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
              <span
                className="text-xs font-medium"
                style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}
              >
                Sem taxa de implantação
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users2 className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
              <span
                className="text-xs font-medium"
                style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}
              >
                1.200+ barbearias
              </span>
            </div>
          </div>

          {/* Error display — geral. O erro de e-mail sai daqui quando o campo está na
              tela (passo 1): ele é mostrado embaixo do próprio input, onde a pessoa
              está olhando. Se por algum caminho ele aparecer no passo 2, sem o campo
              na tela, este bloco continua sendo o lugar dele. */}
          {submitError && !(emailError && step === 1) && (
            <div
              className="w-full rounded-xl p-4 mb-6 animate-scale-in border"
              style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.3)" }}
            >
              <p
                className="text-sm font-medium text-center"
                style={{ color: "#dc2626", fontFamily: "var(--font-montserrat)" }}
              >
                {submitError}
              </p>
            </div>
          )}

          {/* Indicador de progresso multi-step */}
          <div className="flex items-center justify-center gap-2 mb-5 w-full">
            <span className="h-1.5 rounded-full transition-all duration-300" style={{ width: 28, background: "#ebad04" }} />
            <span className="h-1.5 rounded-full transition-all duration-300" style={{ width: 28, background: step === 2 ? "#ebad04" : "#e0e0e0" }} />
            <span className="text-xs font-semibold ml-1" style={{ color: "#1e1e1e", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}>
              Passo {step} de 2
            </span>
          </div>

          {/* Form fields */}
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
                          <p
                            className="text-xs font-medium"
                            style={{ color: "#dc2626", fontFamily: "var(--font-montserrat)" }}
                          >
                            Selecione o faturamento médio para continuar
                          </p>
                        )}
                      </>
                    );
                  })()
                ) : (
                  (() => {
                    const fieldHasError = field.name === "email" && emailError;
                    return (
                      <>
                        <input
                          type={field.type}
                          name={field.name}
                          ref={field.name === "email" ? emailInputRef : undefined}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          // E-mail é o único campo opcional: deixar em branco NUNCA pode barrar
                          // o envio (useLeadForm só valida o formato quando há algo digitado).
                          required={field.name !== "email"}
                          aria-invalid={fieldHasError || undefined}
                          className="w-full rounded-xl px-4 py-3.5 font-medium text-[15px] transition-all duration-200 outline-none"
                          style={{
                            background: "#f5f5f5",
                            border: `1.5px solid ${fieldHasError ? "#dc2626" : "#e0e0e0"}`,
                            color: "#1e1e1e",
                            fontFamily: "var(--font-montserrat)",
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = fieldHasError ? "#dc2626" : "#ebad04"; e.currentTarget.style.boxShadow = `0 0 0 3px ${fieldHasError ? "rgba(220,38,38,0.15)" : "rgba(235,173,4,0.15)"}`; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = fieldHasError ? "#dc2626" : "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                        {fieldHasError && (
                          <p
                            className="text-xs font-medium"
                            style={{ color: "#dc2626", fontFamily: "var(--font-montserrat)" }}
                          >
                            {submitError}
                          </p>
                        )}
                      </>
                    );
                  })()
                )}
              </div>
            ))}

            {/* Mensalidade badge */}
            <div className="flex justify-center py-1">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border"
                style={{
                  background: "rgba(235,173,4,0.1)",
                  borderColor: "rgba(235,173,4,0.3)",
                  color: "#b38900",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                Mensalidade a partir de R$299/mês
              </span>
            </div>

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
                  <>
                    ✓ RECEBEMOS SEU CONTATO!
                  </>
                ) : isDedupChecking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    VALIDANDO...
                  </>
                ) : (
                  <>
                    QUERO VER QUANTO POSSO FATURAR
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

            {/* Brand Signature */}
            <div 
              className="text-center mt-6 animate-fade-in" 
              style={{ animationDelay: "0.75s" }}
            >
              <span 
                className="text-lg md:text-xl font-bold tracking-tighter"
                style={{ 
                  color: "#ebad04", 
                  fontFamily: "var(--font-vollkorn)",
                  textShadow: "0 2px 10px rgba(235,173,4,0.1)"
                }}
              >
                BestBarbers
              </span>
            </div>

            {/* Trust text */}
            <p
              className="text-center text-[10px] uppercase tracking-wider mt-2 flex items-center justify-center gap-1.5 animate-fade-in opacity-60"
              style={{ color: "#1e1e1e", opacity: 0.6, fontFamily: "var(--font-montserrat)", animationDelay: "0.8s" }}
            >
              <ShieldCheck className="w-3 h-3" fill="currentColor" />
              Seus dados estão seguros
            </p>
          </form>
        </div>

        {/* Faixa dourada inferior */}
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, transparent, #ebad04, transparent)" }}
        />
      </div>
    </section>
  );
}
