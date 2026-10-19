"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { ArrowRight, MailCheck } from "lucide-react";
import { useLeadForm, useUtmParams } from "@/hooks";
import type { CadastroConcluido } from "@/hooks";
import { PerguntasQualificacao } from "@/components/forms/PerguntasQualificacao";
import { AvisoPrivacidade } from "@/components/forms/AvisoPrivacidade";
import { errosDeQualificacao } from "@/lib/qualificacao";
import {
  EMAIL_OBRIGATORIO_NO_CURSO,
  ORIGEM_DESC_CURSO,
  ORIGEM_PLOOMES_CURSO,
  origemDoCadastroNoCurso,
  SOURCE_CURSO,
  TEXTOS_VITRINE,
} from "@/content/curso-assinatura";
import {
  apagarInscricaoPendente,
  corpoDaInscricao,
  guardarInscricaoPendente,
  guardarToken,
  inscreverNoCurso,
  linkDaArea,
  novaChave,
  type CorpoInscricao,
} from "@/lib/curso-api";
import { COR, TituloSecao } from "./Primitivos";
import { SeloGratis } from "./FaixaGratis";

const T = TEXTOS_VITRINE.formulario;

// Perguntas 1 a 4 (contato), na ordem decidida em todas as portas: dono → WhatsApp → e-mail →
// barbearia. As 5 a 8 vêm do <PerguntasQualificacao>, iguais em todo o site.
const CAMPOS = [
  { name: "ownerName", ...T.campos.nome, type: "text", autoComplete: "name" },
  { name: "whatsapp", ...T.campos.whatsapp, type: "tel", autoComplete: "tel" },
  { name: "email", ...T.campos.email, type: "email", autoComplete: "email" },
  { name: "barbershopName", ...T.campos.barbearia, type: "text", autoComplete: "organization" },
] as const;

type Fase = "formulario" | "inscrevendo" | "falhou";

/** O `localStorage` pode lançar só de ser lido (cookies bloqueados no Safari e no Chrome). */
function armazenamento(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * O formulário de hoje (useLeadForm, `lucasSoBotao: true`) e, no sucesso, a inscrição no curso
 * (contrato §2): `POST /api/curso/inscricao` com repetição e, com o token, a área do aluno por
 * navegação COMPLETA (`location.assign`). Nunca `router.push`: a área não carrega GTM nem pixel, e
 * numa navegação do lado do cliente os scripts desta página continuariam vivos lendo a URL.
 */
export function FormularioCurso() {
  const { getUtmParams, getOriginMapping } = useUtmParams();
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  // A origem é sempre a do curso, com ou sem anúncio (`origemDoCadastroNoCurso`); só o link de
  // parceiro mantém a dele. A descrição segue a UTM. Só depois de montar, como nos outros
  // formulários (o servidor não conhece a URL do anúncio).
  const origem = useMemo(() => {
    if (!montado) return { originId: null, originDesc: null };
    const utm = getUtmParams();
    return { originId: origemDoCadastroNoCurso(utm.origin), originDesc: getOriginMapping(utm).originDesc };
  }, [montado, getOriginMapping, getUtmParams]);

  const [fase, setFase] = useState<Fase>("formulario");

  const aposCadastro = useCallback(async (cadastro: CadastroConcluido) => {
    setFase("inscrevendo");
    const storage = armazenamento();
    let corpo: CorpoInscricao | null = null;
    try {
      corpo = corpoDaInscricao(cadastro, novaChave());
      const resultado = await inscreverNoCurso(corpo);
      if (resultado.ok) {
        guardarToken(storage, resultado.token);
        apagarInscricaoPendente(storage);
        window.location.assign(linkDaArea(resultado.token));
        return;
      }
      // O cadastro no Ploomes já foi feito; o curso não pode se perder. O que pode dar certo depois
      // fica guardado para a próxima visita (e a reconciliação do OS cobre o resto).
      console.warn(`[Curso] a inscrição falhou (${resultado.motivo}); o acesso segue por e-mail.`);
      if (resultado.guardarPendente) guardarInscricaoPendente(storage, corpo);
    } catch (err) {
      // Nada aqui pode prender a tela em "Liberando o seu acesso…" depois do cadastro feito.
      console.warn(`[Curso] a inscrição falhou (${err instanceof Error ? err.name : "erro"}); o acesso segue por e-mail.`);
      if (corpo) guardarInscricaoPendente(storage, corpo);
    }
    setFase("falhou");
  }, []);

  const { formData, isSubmitting, submitted, submitError, isDedupChecking, handleInputChange, handleSubmit } = useLeadForm({
    source: SOURCE_CURSO,
    originId: origem.originId ?? ORIGEM_PLOOMES_CURSO,
    originDesc: origem.originDesc || ORIGEM_DESC_CURSO,
    // A área do aluno é a entrega: o lead < 60 ganha só o botão do Lucas, nunca sai da página sozinho.
    lucasSoBotao: true,
    emailObrigatorio: EMAIL_OBRIGATORIO_NO_CURSO,
    onSuccess: (cadastro) => void aposCadastro(cadastro),
    onError: (error) => console.error("Erro ao enviar formulário:", error),
  });

  const erros = errosDeQualificacao(submitError);
  const idFormulario = useId();
  const ocupado = isSubmitting || fase === "inscrevendo" || (submitted && fase !== "falhou");

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />
      <div className="px-5 md:px-9 py-8 md:py-10 flex flex-col gap-5">
        <SeloGratis>{T.selo}</SeloGratis>
        <TituloSecao titulo={T.titulo} destaque={T.destaque} />
        <p className="text-center text-[14px] md:text-[15px] text-[#4a4a4a]">{T.frase}</p>

        {fase === "falhou" ? (
          <div role="status" className="rounded-2xl border border-[#ffaf02]/50 bg-[#fff8e6] p-5 flex items-start gap-3">
            <MailCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: COR.dourado }} />
            <p className="text-[15px] font-semibold leading-snug" style={{ color: COR.texto }}>
              {T.falhaInscricao}
            </p>
          </div>
        ) : null}

        {submitError && !erros.monthlyRevenue && !erros.currentSystem && !erros.clubStatus && !erros.employeeCount ? (
          <div role="alert" className="rounded-xl p-4 border bg-red-50 border-red-200">
            <p className="text-sm font-medium text-center text-red-600">{submitError}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4 w-full" noValidate={false}>
          {CAMPOS.map((campo) => (
            <div key={campo.name} className="space-y-1.5">
              <label htmlFor={`${idFormulario}-${campo.name}`} className="block font-semibold text-[13px] leading-[20px]" style={{ color: COR.texto }}>
                {campo.rotulo}
              </label>
              <input
                id={`${idFormulario}-${campo.name}`}
                type={campo.type}
                name={campo.name}
                autoComplete={campo.autoComplete}
                inputMode={campo.type === "tel" ? "tel" : campo.type === "email" ? "email" : undefined}
                value={formData[campo.name]}
                onChange={handleInputChange}
                placeholder={campo.exemplo}
                required={campo.name !== "email" || EMAIL_OBRIGATORIO_NO_CURSO}
                disabled={ocupado || fase === "falhou"}
                className="w-full rounded-xl px-4 py-3.5 font-medium text-[16px] outline-none border-[1.5px] border-[#e0e0e0] bg-[#f5f5f5] text-[#1e1e1e] focus:border-[#ebad04] focus:shadow-[0_0_0_3px_rgba(235,173,4,0.15)] transition-all disabled:opacity-60"
              />
            </div>
          ))}

          <PerguntasQualificacao valores={formData} onChange={handleInputChange} erros={erros} />

          <div className="pt-2">
            <button
              type="submit"
              disabled={ocupado || fase === "falhou" || isDedupChecking}
              className="w-full min-h-[56px] px-6 py-4 rounded-full font-extrabold text-[15px] md:text-[16px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,175,2,0.35)]"
              style={{ backgroundColor: COR.amarelo, color: COR.escuro }}
            >
              {ocupado ? (
                <>
                  <span className="w-5 h-5 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
                  {T.enviando}
                </>
              ) : isDedupChecking ? (
                <>
                  <span className="w-5 h-5 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
                  VALIDANDO...
                </>
              ) : (
                <>
                  {T.botao}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <AvisoPrivacidade />
        </form>
      </div>
    </div>
  );
}
