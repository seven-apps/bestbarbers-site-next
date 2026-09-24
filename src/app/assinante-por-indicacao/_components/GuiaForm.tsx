"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { useLeadForm, useUtmParams } from "@/hooks";
import { PerguntasQualificacao } from "@/components/forms/PerguntasQualificacao";
import { AvisoPrivacidade } from "@/components/forms/AvisoPrivacidade";
import { errosDeQualificacao } from "@/lib/qualificacao";
import { hrefObrigado } from "@/lib/iscas";
import { NUMEROS_OFICIAIS } from "@/lib/numeros-oficiais";
import { ArrowRight, FileText, Users2, Gift } from "lucide-react";

// CLONE do form da /do-zero-a-assinatura (que por sua vez clonou o da /cadeira-cheia).
// Por que clonar de novo em vez de extrair o componente único: o padrão continua com
// título, origem, source e destino cravados na isca de cada porta, e a decisão de
// generalizar é de quem tiver as três portas provadas lado a lado — não desta entrega,
// que replica um molde que converte pra não arriscar a taxa dele.

// ORIGEM DEDICADA DO COORTE ----------------------------------------------------------
// PLACEHOLDER SEGURO, idêntico ao da /cadeira-cheia e da /do-zero-a-assinatura: reusa a
// origem "Tráfego Pago" (ads, 40210173) como default. Por que o default é a origem "ads"
// e não um ID novo:
//   1. A automação de Deal do Ploomes (pipe Qualificação 40043772) JÁ dispara para
//      essa origem — o lead do guia NÃO nasce como Contact órfão (invisível pro SDR).
//   2. Inventar um OriginId numérico que o Ploomes não conhece quebraria a automação.
// @devops / admin Ploomes: crie um OriginId DEDICADO para o coorte deste guia (p/ medir
// CPQ isolado por isca) e troque SÓ o número abaixo. Enquanto não existir, o coorte é
// filtrável pela descrição (INDICACAO_ORIGIN_DESC), pelo source
// 'lp_guia_assinante_por_indicacao' e pelo bb_lp_version 'assinante-por-indicacao'
// (derivado do pathname em lead-attribution.ts).
const INDICACAO_ORIGIN_ID = 40210173;
const INDICACAO_ORIGIN_DESC = "LP Assinante por Indicação - Guia Indicação";

// A régua do score vive em `src/lib/lead-score.ts` (com teste) e as perguntas 5 a 8
// no `<PerguntasQualificacao>` — não há mais fórmula nem lista de opções copiada por
// LP. O que muda de porta para porta é só a moldura visual e a copy.
// Perguntas 1 a 4 — contato. As perguntas 5 a 8 (faturamento, sistema, clube e
// profissionais) vêm do <PerguntasQualificacao>, idêntico em todas as portas
// (André, 14/Set/26).
const formFields = [
  { name: "ownerName", label: "Seu nome", placeholder: "Ex: João Silva", type: "text" },
  { name: "whatsapp", label: "Seu WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
  // E-mail OPCIONAL e sem promessa de entrega: o guia é baixado na tela seguinte, não
  // enviado. OPCIONAL COM MOTIVO, não "opcional" seco — é o formato que mede 95,9% de
  // preenchimento aqui; sem o motivo a taxa cai.
  { name: "email", label: "Seu e-mail (opcional, pra gente falar com você depois)", placeholder: "Ex: joao@email.com", type: "email" },
  { name: "barbershopName", label: "Nome da sua barbearia", placeholder: "Ex: Barbearia do João", type: "text" },
];

export function GuiaForm() {
  const router = useRouter();

  // Atribuição de PARCEIRO/CANAL: quando o guia é distribuído por um influenciador
  // (ex: /assinante-por-indicacao?source=algum-parceiro) o UTM VENCE — o lead nasce
  // creditado ao parceiro (originId/desc do originMap em useUtmParams). A origem
  // dedicada do guia (INDICACAO_*) fica como fallback orgânico/direto. Guard de
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
    // Identifica ESTA isca nos relatórios da BBAI. O nome espelha o id da isca (o mesmo
    // que vai no ?isca= da /obrigado, na chave `isca` dos eventos de pixel e no
    // bb_lp_version derivado do pathname) — uma string só pra cruzar Ploomes, pixel e rota.
    source: "lp_guia_assinante_por_indicacao",
    originId: utmMapping.originId ?? INDICACAO_ORIGIN_ID,
    originDesc: utmMapping.originDesc || INDICACAO_ORIGIN_DESC,
    // Igual ao V12, à /cadeira-cheia e à /do-zero-a-assinatura: exige faturamento no
    // submit, senão quem pula o campo pontuaria 0 na faixa (silencioso) e quebraria a
    // comparabilidade do score. O evento Lead (Pixel + CAPI) dispara AQUI dentro do hook,
    // no submit, e é awaited antes deste onSuccess. Por isso a /obrigado NÃO refaz Lead.
    // O destino sai do builder tipado (nunca string à mão), pra o tsc pegar id errado.
    onSuccess: () => router.push(hrefObrigado("assinante-por-indicacao")),
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Não foi possível enviar agora. Confira os dados e tente de novo.");
    },
  });

  // Qual das quatro perguntas de qualificação está com erro (comparação EXATA pela
  // mensagem do hook, não mais por `includes("Faturamento")`).
  const erros = errosDeQualificacao(submitError);
  // Prefixo dos ids — mantém `label htmlFor` único se o formulário montar duas vezes.
  const idFormulario = useId();

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
          Baixe o guia Assinante <span style={{ color: "#ebad04" }}>por Indicação</span>
        </h2>
        <p
          className="text-center text-sm mb-6"
          style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}
        >
          Preencha e o download do PDF abre na tela seguinte.
        </p>

        {/* Trust badges */}
        <div className="flex justify-center gap-6 mb-6 w-full">
          {/*
            FATO de entrega, não "100% gratuito" com escudo (a regra veta ancorar objeção,
            e o "grátis" já está dito no badge da página). "7 páginas" é a contagem real do
            PDF entregue (data/iscas/ebooks.json → assinante-por-indicacao.pdf_paginas).
          */}
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" style={{ color: "#ebad04" }} />
            <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
              7 páginas · download na hora
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users2 className="w-4 h-4" style={{ color: "#ebad04" }} fill="currentColor" />
            <span className="text-xs font-medium" style={{ color: "#1e1e1e", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}>
              {NUMEROS_OFICIAIS.barbearias.texto} barbearias
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
              <label htmlFor={`${idFormulario}-${field.name}`} className="block font-semibold text-[13px] leading-[20px]" style={{ color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}>
                {field.label}
              </label>
              <input
                id={`${idFormulario}-${field.name}`}
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                required={field.name !== "email"}
                className="w-full rounded-xl px-4 py-3.5 font-medium text-[15px] transition-all duration-200 outline-none"
                style={{ background: "#f5f5f5", border: "1.5px solid #e0e0e0", color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#ebad04"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235,173,4,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          ))}

          {/* Perguntas 5 a 8 — as mesmas de todas as portas. */}
          <PerguntasQualificacao
            valores={formData}
            onChange={handleInputChange}
            erros={erros}
          />

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

          <AvisoPrivacidade />

        </form>
      </div>

      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, #ebad04, transparent)" }} />
    </div>
  );
}
