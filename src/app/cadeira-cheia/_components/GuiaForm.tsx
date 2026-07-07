"use client";

import { useRouter } from "next/navigation";
import { useLeadForm } from "@/hooks";
import { ArrowRight, ShieldCheck, Users2, Gift } from "lucide-react";

// ORIGEM DEDICADA DO COORTE (ver needsHumanReview) ----------------------------------
// PLACEHOLDER SEGURO: reusa a origem "Tráfego Pago" (ads, 40210173) como default.
// Por quê o default é a origem "ads" e não um ID novo inventado:
//   1. A automação de Deal do Ploomes (pipe Qualificação 40043772) JÁ dispara para
//      essa origem — então o lead do guia NÃO nasce como Contact órfão (invisível pro
//      SDR), que é exatamente o risco que o brief §5.5 manda validar.
//   2. Inventar um OriginId numérico que o Ploomes não conhece quebraria a automação.
// @devops / admin Ploomes: crie um OriginId DEDICADO para o coorte do guia (p/ medir
// CPQ isolado) e troque SÓ o número abaixo. Enquanto não existir, o coorte continua
// filtrável pela descrição (CADEIRA_CHEIA_ORIGIN_DESC) e pelo source 'lp_guia_reativacao'.
const CADEIRA_CHEIA_ORIGIN_ID = 40210173;
const CADEIRA_CHEIA_ORIGIN_DESC = "LP Cadeira Cheia - Guia Reativação";

// Campos alinhados ao form CANÔNICO (src/app/v12/_components/FormSectionV12.tsx),
// pra que useLeadForm calcule o MESMO lead_score de qualquer outra LP (ver fórmula
// em src/hooks/useLeadForm.ts:210-238). O que muda LP a LP é só a moldura visual/copy
// — os nomes de campo, opções de faturamento/equipe e o cálculo em si são o padrão:
//   Faturamento  → Até R$2.000 -100 · R$2k-10k +20 · R$10k-30k +40 · Acima R$30k +40
//   interestedTool → Agenda e Controle Financeiro +10 · App+Clube+NFs +40
//   employeeCount  → Sou apenas eu +0 · 2 a 4 colaboradores +10 · 5+ colaboradores +20
// "Nome" é o nome da pessoa (ownerName); o nome da barbearia não é perguntado (mantém
// a fricção baixa do guia), então espelhamos ownerName → barbershopName no onChange
// (o hook exige barbershopName e o Ploomes usa como Contact.Name). Isso NÃO afeta o
// score: barbershopName não entra na fórmula em nenhuma LP.
const formFields = [
  { name: "ownerName", label: "Seu nome", placeholder: "Ex: João Silva", type: "text" },
  { name: "whatsapp", label: "Seu WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
  // E-mail: canal de ENTREGA do guia ("recebe no WhatsApp e no e-mail", copy da LP) —
  // não existe no form canônico (V12) porque lá não há um ativo a entregar por e-mail.
  // Mantido aqui por ser especificidade do produto do guia, não do cálculo de score
  // (email não entra na fórmula em nenhuma LP). Opcional, como em todo form do hook.
  { name: "email", label: "Seu e-mail (pra receber o guia)", placeholder: "Ex: joao@email.com", type: "email" },
  {
    // Maior driver do lead_score. Options IDÊNTICAS ao canônico (V12) — string precisa
    // bater exatamente com o mapa em useLeadForm.ts, senão a faixa de faturamento não
    // pontua. Campo ausente no GuiaForm original; era o gap que descalibrava o score.
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
    // Porte da barbearia. Os VALUES são os do canônico (score: Sou apenas eu +0 ·
    // 2 a 4 +10 · 5+ +20) — já batiam no GuiaForm original. Só os LABELS falam em
    // "cadeiras" (framing do tema "Cadeira Cheia"); não altera o score.
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
  {
    // Substitui o antigo "já usa sistema de agendamento?" (options que não casavam com
    // NENHUMA faixa do score — contribuição sempre 0, por design, mas incompatível com
    // o padrão). Segue o canônico (V12): options e label idênticos, pra pontuar +10/+40.
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
];

export function GuiaForm() {
  const router = useRouter();

  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    isDedupChecking,
    handleInputChange,
    handleSubmit,
  } = useLeadForm({
    source: "lp_guia_reativacao",
    originId: CADEIRA_CHEIA_ORIGIN_ID,
    originDesc: CADEIRA_CHEIA_ORIGIN_DESC,
    // Igual ao V12: exige faturamento no submit. Sem isso, quem pula o campo pontuaria
    // 0 na faixa de faturamento (silencioso) em vez de ficar de fora do padrão por opção
    // — quebraria a comparabilidade do lead_score entre esta LP e as demais.
    requireMonthlyRevenue: true,
    // O evento Lead (Pixel + CAPI) dispara AQUI dentro do hook, no submit, e é awaited
    // antes deste onSuccess. Por isso o /obrigado NÃO refaz Lead (evita double-count —
    // o mesmo bug que o comentário do v12/layout.tsx documenta).
    onSuccess: () => router.push("/obrigado"),
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Não foi possível enviar agora. Confira os dados e tente de novo.");
    },
  });

  // Estado de erro do campo de faturamento (mesmo padrão do V12: validação no submit).
  const monthlyRevenueError = !!submitError && submitError.includes("Faturamento");

  // Espelha o nome da pessoa no nome da barbearia (campo exigido pelo hook, não
  // perguntado no form pra manter a fricção baixa).
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    handleInputChange(e);
    if (e.target.name === "ownerName") {
      handleInputChange({
        target: { name: "barbershopName", value: e.target.value },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div
      className="relative w-full max-w-md rounded-3xl overflow-hidden"
      style={{ background: "#ffffff", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
    >
      {/* Faixa dourada superior */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />

      <div className="px-6 md:px-8 py-8 md:py-10 flex flex-col items-center">
        {/* Selo GUIA GRÁTIS */}
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
            <Gift className="w-4 h-4" fill="currentColor" />
            Guia grátis
          </span>
        </div>

        <h2
          className="text-center mb-2 leading-tight"
          style={{
            fontFamily: "var(--font-vollkorn)",
            fontWeight: 800,
            fontSize: "clamp(22px, 3.5vw, 30px)",
            color: "#1e1e1e",
          }}
        >
          Baixe o guia <span style={{ color: "#ebad04" }}>Cadeira Cheia</span>
        </h2>
        <p
          className="text-center text-sm mb-6"
          style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}
        >
          Preencha e receba o passo a passo no seu WhatsApp e e-mail.
        </p>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mb-6 w-full">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
            <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
              100% gratuito
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users2 className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
            <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
              +1.200 barbearias
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
              ) : submitted ? (
                <>✓ GUIA A CAMINHO!</>
              ) : isDedupChecking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  VALIDANDO...
                </>
              ) : (
                <>
                  Receber o guia grátis
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
