"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLeadForm, useUtmParams } from "@/hooks";
import { hrefObrigado } from "@/lib/iscas";
import { ArrowRight, ShieldCheck, Users2, Gift } from "lucide-react";

// CLONE do form da /cadeira-cheia (src/app/cadeira-cheia/_components/GuiaForm.tsx).
// Por que clonar em vez de parametrizar: com DUAS iscas no ar o padrão ainda não está
// provado — o componente de lá tem título, origem, source e destino cravados na isca
// dele. Generalizar agora seria abstrair em cima de uma amostra de dois. Quando a
// terceira isca nascer e as três forem realmente iguais, aí vale extrair o componente
// único (o mapa em src/lib/iscas.ts já é o lugar natural dos dados).

// ORIGEM DEDICADA DO COORTE ----------------------------------------------------------
// PLACEHOLDER SEGURO, idêntico ao da /cadeira-cheia: reusa a origem "Tráfego Pago"
// (ads, 40210173) como default. Por que o default é a origem "ads" e não um ID novo:
//   1. A automação de Deal do Ploomes (pipe Qualificação 40043772) JÁ dispara para
//      essa origem — o lead do guia NÃO nasce como Contact órfão (invisível pro SDR).
//   2. Inventar um OriginId numérico que o Ploomes não conhece quebraria a automação.
// @devops / admin Ploomes: crie um OriginId DEDICADO para o coorte deste guia (p/ medir
// CPQ isolado por isca) e troque SÓ o número abaixo. Enquanto não existir, o coorte é
// filtrável pela descrição (DO_ZERO_ORIGIN_DESC), pelo source 'lp_guia_do_zero_a_assinatura'
// e pelo bb_lp_version 'do-zero-a-assinatura' (derivado do pathname em lead-attribution.ts).
const DO_ZERO_ORIGIN_ID = 40210173;
const DO_ZERO_ORIGIN_DESC = "LP Do Zero à Assinatura - Guia Clube";

// Campos alinhados ao form CANÔNICO (src/app/v12/_components/FormSectionV12.tsx),
// pra que useLeadForm calcule o MESMO lead_score de qualquer outra LP (fórmula em
// src/hooks/useLeadForm.ts). O que muda LP a LP é só a moldura visual/copy — os nomes
// de campo, as opções de faturamento/equipe e o cálculo em si são o padrão:
//   monthlyRevenue → Até R$2.000 -100 · R$2k-10k +20 · R$10k-30k +40 · Acima R$30k +40
//   interestedTool → Agenda e Controle Financeiro +10 · App+Clube+NFs +40
//   employeeCount  → Sou apenas eu +0 · 2 a 4 colaboradores +10 · 5+ colaboradores +20
// "Nome" é o nome da pessoa (ownerName); o nome da barbearia não é perguntado (mantém
// a fricção baixa do guia), então espelhamos ownerName → barbershopName no onChange.
const formFields = [
  { name: "ownerName", label: "Seu nome", placeholder: "Ex: João Silva", type: "text" },
  { name: "whatsapp", label: "Seu WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
  {
    // E-mail OPCIONAL e sem promessa de entrega: o guia é baixado na tela seguinte,
    // não enviado (ver src/app/obrigado/page.tsx). O rótulo antigo da /cadeira-cheia
    // ("pra receber o guia") prometia um envio que nunca acontece — aqui o campo diz o
    // que ele é: o segundo caminho de contato, o mesmo que a LGPD no rodapé autoriza.
    // OPCIONAL COM MOTIVO, não "opcional" seco: é o formato que mede 95,9% de
    // preenchimento na /cadeira-cheia — sem o motivo a taxa cai. Mesmo rótulo lá.
    name: "email",
    label: "Seu e-mail (opcional, pra gente falar com você depois)",
    placeholder: "Ex: joao@email.com",
    type: "email",
  },
  {
    // Maior driver do lead_score. Options IDÊNTICAS ao canônico (V12) — a string precisa
    // bater exatamente com o mapa em useLeadForm.ts, senão a faixa não pontua.
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
    // 2 a 4 +10 · 5+ +20). Só os LABELS falam em "cadeiras" — e aqui isso não é só
    // framing: "cadeiras que atendem hoje" é a linha A da Ficha da Cadeira Vaga, o
    // primeiro número que o guia manda o dono levantar. Não altera o score.
    name: "employeeCount",
    label: "Quantas cadeiras atendem hoje na sua barbearia?",
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
    // Segue o canônico (V12): options e label idênticos, pra pontuar +10/+40.
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

  // Atribuição de PARCEIRO/CANAL: quando o guia é distribuído por um influenciador
  // (ex: /do-zero-a-assinatura?source=algum-parceiro) o UTM VENCE — o lead nasce
  // creditado ao parceiro (originId/desc do originMap em useUtmParams). A origem
  // dedicada do guia (DO_ZERO_*) fica como fallback orgânico/direto. Guard de
  // hidratação: só resolve pós-mount, senão o SSR descasa a origem.
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
    // Identifica ESTA isca nos relatórios da BBAI. A /cadeira-cheia usa
    // 'lp_guia_reativacao'; aqui o nome espelha o id da isca (o mesmo que vai no
    // ?isca= da /obrigado, na chave `isca` dos eventos de pixel e no bb_lp_version
    // derivado do pathname) — uma string só pra cruzar Ploomes, pixel e rota.
    source: "lp_guia_do_zero_a_assinatura",
    originId: utmMapping.originId ?? DO_ZERO_ORIGIN_ID,
    originDesc: utmMapping.originDesc || DO_ZERO_ORIGIN_DESC,
    // Igual ao V12 e à /cadeira-cheia: exige faturamento no submit, senão quem pula o
    // campo pontuaria 0 na faixa (silencioso) e quebraria a comparabilidade do score.
    requireMonthlyRevenue: true,
    // O evento Lead (Pixel + CAPI) dispara AQUI dentro do hook, no submit, e é awaited
    // antes deste onSuccess. Por isso a /obrigado NÃO refaz Lead (evita double-count).
    // O destino sai do builder tipado (nunca string à mão), pra o tsc pegar id errado.
    onSuccess: () => router.push(hrefObrigado("do-zero-a-assinatura")),
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
          Baixe o guia Do Zero à <span style={{ color: "#ebad04" }}>Assinatura</span>
        </h2>
        <p
          className="text-center text-sm mb-6"
          style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}
        >
          Preencha e o download do PDF abre na tela seguinte.
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
                // "A caminho" seria promessa de envio: o guia abre na tela seguinte.
                <>✓ ABRINDO SEU GUIA...</>
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
