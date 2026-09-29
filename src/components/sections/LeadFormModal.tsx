"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useLeadForm } from "@/hooks";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { useUtmParams } from "@/hooks/useUtmParams";
import {
  CAMPOS_DE_CONTATO_PROGRESSIVO,
  ETAPA_DO_CAMPO,
  ETAPA_FINAL,
  ETAPA_INICIAL,
  MARCADOR_FORM,
  TEXTOS_DO_MODAL_PROGRESSIVO,
  contatoCompleto,
  eventoDoMarco,
  perguntasVisiveis,
  primeiroPendente,
  proximaEtapa,
  type BracoForm,
  type CampoForm,
  type Etapa,
  type MarcoForm,
} from "@/lib/form-progressivo";
import { PerguntasQualificacao } from "@/components/forms/PerguntasQualificacao";
import { AvisoPrivacidade } from "@/components/forms/AvisoPrivacidade";
import { errosDeQualificacao, MSG_CLUBE, MSG_FATURAMENTO, MSG_PROFISSIONAIS, MSG_SISTEMA } from "@/lib/qualificacao";
import { MSG_EMAIL_INVALIDO } from "@/lib/form-passo1";
import { X, ArrowRight, Shield } from "lucide-react";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Descrição de origem para tracking no Ploomes (ex: "[Site]BT-Header") */
  originDesc?: string;
  /** Origem padrão da página no Ploomes. Fallback ABAIXO de ?origin=/UTM e ACIMA do SITE_ORIGIN_ID global. */
  originId?: number;
  /**
   * Braço do TESTE de formulário (`lib/form-progressivo.ts`), sorteado pela página.
   * `atual` = este formulário como sempre foi, só que medido; `progressivo` = abre com três
   * campos e revela o resto conforme a pessoa preenche. Ausente = fora do teste: nada muda,
   * nada é medido (home, barra de navegação, tabela de precificação).
   */
  bracoTeste?: BracoForm | null;
}

/**
 * Aviso de cada campo no formulário progressivo. Aparece EMBAIXO do campo, e não na caixa do
 * topo: quem clicou no botão está no fim do formulário e não veria um aviso lá em cima.
 * As quatro perguntas usam as mensagens de `lib/qualificacao`, que o componente delas já pinta.
 */
const AVISO_DO_CAMPO: Record<CampoForm, string> = {
  ownerName: "Digite o nome do dono da barbearia",
  whatsapp: "Digite o WhatsApp com DDD",
  barbershopName: "Digite o nome da barbearia",
  email: MSG_EMAIL_INVALIDO,
  monthlyRevenue: MSG_FATURAMENTO,
  currentSystem: MSG_SISTEMA,
  clubStatus: MSG_CLUBE,
  employeeCount: MSG_PROFISSIONAIS,
};

/** De qual campo é o aviso na tela (`null` = erro geral, que vai na caixa do topo). */
function campoDoAviso(aviso: string | null | undefined): CampoForm | null {
  if (!aviso) return null;
  const campo = (Object.keys(AVISO_DO_CAMPO) as CampoForm[]).find((c) => AVISO_DO_CAMPO[c] === aviso);
  return campo ?? null;
}

// Perguntas 1 a 4 — contato. As 5 a 8 (faturamento, sistema, clube, profissionais)
// vêm do <PerguntasQualificacao>, igual em todas as portas (André, 14/Set/26).
// A ORDEM é a decidida: dono → WhatsApp → e-mail (opcional) → barbearia.
const formFields = [
  { name: "ownerName", label: "Nome do Dono", placeholder: "Ex: João Silva", type: "text" },
  { name: "whatsapp", label: "WhatsApp do Dono", placeholder: "(11) 99999-9999", type: "tel" },
  // E-mail OPCIONAL COM MOTIVO — o rótulo medido nas LPs (95,9% de preenchimento) e o
  // único campo sem `required`: vazio nunca pode barrar ninguém.
  { name: "email", label: "Seu e-mail (opcional, pra gente falar com você depois)", placeholder: "Ex: joao@email.com", type: "email" },
  { name: "barbershopName", label: "Nome da barbearia", placeholder: "Ex: Barbearia do João", type: "text" },
];

const SITE_ORIGIN_ID = 40210426;

export function LeadFormModal({ isOpen, onClose, originDesc, originId, bracoTeste }: LeadFormModalProps) {
  const emTeste = bracoTeste === "atual" || bracoTeste === "progressivo";
  const progressivo = bracoTeste === "progressivo";
  const { trackNonCatalogEvent } = useMetaPixel();

  // Marcos do funil DENTRO do modal (aberto → contato → enviado), iguais nos dois braços.
  // `contato` e `enviado` disparam uma vez por preenchimento; `aberto`, a cada abertura.
  const marcosDisparados = useRef<Set<MarcoForm>>(new Set());
  const marcar = useCallback(
    (marco: MarcoForm) => {
      if (!emTeste || !bracoTeste) return;
      if (marco !== "aberto") {
        if (marcosDisparados.current.has(marco)) return;
        marcosDisparados.current.add(marco);
      }
      void trackNonCatalogEvent(eventoDoMarco(marco, bracoTeste), {
        formulario: MARCADOR_FORM[bracoTeste],
        ...(originDesc && { secao: originDesc }),
      });
    },
    [emTeste, bracoTeste, originDesc, trackNonCatalogEvent],
  );

  // Prioriza UTM (ex: lead vindo do Meta com fbclid → "ads"/Tráfego Pago).
  // Fallback SITE_ORIGIN_ID só quando navegação é orgânica/direta (sem signal de ad).
  // Antes era hardcoded SITE_ORIGIN_ID — causava leads do Meta entrarem como "site"
  // no Ploomes e gerarem discrepância vs contagem do Meta Ads Manager.
  const { getUtmParams, getOriginMapping } = useUtmParams();
  const utmParams = getUtmParams();
  const utmMapping = getOriginMapping(utmParams);

  // Podcast (Spotify → /podcast?desc=1.3): a descrição dinâmica do snapshot
  // ("Assinatura do Zero - EP03 - ...") tem prioridade sobre o rótulo do botão,
  // senão o episódio se perderia em "[Site]BT-*". O rótulo entra como sufixo.
  const podcastDesc =
    utmParams.utm_source === "podcast" && utmMapping.originDesc
      ? [utmMapping.originDesc, originDesc].filter(Boolean).join(" | ")
      : null;

  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    handleInputChange,
    handleSubmit,
    setSubmitError,
    resetForm,
    isValidPhone,
  } = useLeadForm({
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
    },
    onSuccess: () => marcar("enviado"),
    marcadorEvento: emTeste && bracoTeste ? MARCADOR_FORM[bracoTeste] : undefined,
    // Prioridade: ?origin=/UTM (utmMapping) > origem padrão da página (prop) > fallback global do site.
    originId: utmMapping.originId ?? originId ?? SITE_ORIGIN_ID,
    originDesc: podcastDesc || originDesc || utmMapping.originDesc || "[Site]Modal",
  });

  const erros = errosDeQualificacao(submitError);

  // ── Formulário progressivo ─────────────────────────────────────────────────────────
  // A etapa é acompanhada nos DOIS braços: no `progressivo` ela decide o que aparece; no
  // `atual` ela só serve para o marco `contato` nascer pela mesma regra.
  const [etapa, setEtapa] = useState<Etapa>(ETAPA_INICIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const erroRef = useRef<HTMLDivElement>(null);
  const campoParaFocar = useRef<CampoForm | null>(null);
  const telefoneValido = isValidPhone();

  // Revela NA HORA: a primeira letra do nome da barbearia abre a etapa 2, e cada resposta
  // abre a pergunta seguinte. Sem pausa e sem depender de sair do campo (ajuste do André).
  // Os campos nascem ABAIXO de onde a pessoa digita, então nada se mexe embaixo do dedo.
  useEffect(() => {
    if (!progressivo) return;
    setEtapa((atual) => proximaEtapa(atual, formData));
  }, [progressivo, formData]);

  // Marco `contato`: os três campos válidos. Mesma regra nos dois braços, separada da revelação.
  const contatoOk = emTeste && contatoCompleto(formData, telefoneValido);
  useEffect(() => {
    if (contatoOk) marcar("contato");
  }, [contatoOk, marcar]);

  useEffect(() => {
    if (isOpen) marcar("aberto");
    // Só a abertura dispara: `marcar` muda de identidade com o originDesc e não pode recontar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const levarAte = useCallback((campo: CampoForm, focar: boolean): boolean => {
    const alvo = formRef.current?.querySelector<HTMLElement>(`[name="${campo}"]`);
    if (!alvo) return false;
    // Folga: o campo não encosta na borda do modal, e o rótulo dele entra junto.
    alvo.style.scrollMarginTop = "72px";
    alvo.style.scrollMarginBottom = "28px";
    alvo.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (focar) alvo.focus({ preventScroll: true });
    return true;
  }, []);

  // Campo novo na tela: rola o modal até ele. O foco só muda quando foi o BOTÃO que pediu —
  // quem está digitando não perde o teclado.
  useEffect(() => {
    if (!progressivo || etapa === ETAPA_INICIAL) return;
    const pedido = campoParaFocar.current;
    campoParaFocar.current = null;
    if (pedido) {
      levarAte(pedido, true);
      return;
    }
    // Última pergunta na tela: mostra o botão junto, para a pessoa ver que acabou.
    if (etapa === ETAPA_FINAL) {
      const botao = formRef.current?.querySelector<HTMLElement>('button[type="submit"]');
      if (botao) {
        botao.style.scrollMarginBottom = "28px";
        botao.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
    }
    const ultimoDaEtapa = (Object.keys(ETAPA_DO_CAMPO) as CampoForm[]).filter((c) => ETAPA_DO_CAMPO[c] === etapa).pop();
    if (ultimoDaEtapa) levarAte(ultimoDaEtapa, false);
  }, [progressivo, etapa, levarAte]);

  // Aviso no progressivo: o de campo leva a pessoa até o campo; o geral (servidor fora, por
  // exemplo) fica na caixa do topo, e o modal rola até ela.
  const campoComAviso = progressivo ? campoDoAviso(submitError) : null;
  useEffect(() => {
    if (!progressivo || !submitError) return;
    if (campoComAviso) levarAte(campoComAviso, true);
    else erroRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [progressivo, submitError, campoComAviso, levarAte]);

  const aoEnviar = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (!progressivo) return handleSubmit(e);
      // O formulário progressivo valida aqui (`noValidate` no <form>), na ordem da tela e
      // com as nossas palavras — o balão do navegador não sabe de campo que ainda vai aparecer.
      const pendente = primeiroPendente(formData, telefoneValido);
      if (!pendente) return handleSubmit(e);
      e.preventDefault();
      if (levarAte(pendente, true)) {
        // Campo que já está na tela e ficou para trás: avisa embaixo dele.
        setSubmitError(AVISO_DO_CAMPO[pendente]);
        return;
      }
      // Campo que a pessoa ainda não viu: aparece e ganha o foco, sem aviso de erro.
      campoParaFocar.current = pendente;
      setEtapa((atual) => (ETAPA_DO_CAMPO[pendente] > atual ? ETAPA_DO_CAMPO[pendente] : atual));
    },
    [progressivo, handleSubmit, formData, telefoneValido, levarAte, setSubmitError],
  );

  // Fecha modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset form quando fechar
  const handleClose = useCallback(() => {
    resetForm();
    setEtapa(ETAPA_INICIAL);
    marcosDisparados.current.clear();
    onClose();
  }, [resetForm, onClose]);

  // Clique no overlay fecha
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) handleClose();
    },
    [handleClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#121212] rounded-2xl md:rounded-3xl border border-gray-800/50 shadow-2xl animate-scale-in">
        {/* Botao fechar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="p-6 md:p-8">
          {/* Titulo */}
          {progressivo ? (
            <h2 className="font-extrabold text-[20px] leading-[28px] md:text-[26px] md:leading-[34px] text-white text-center text-balance mb-2 px-6 md:px-4">
              {TEXTOS_DO_MODAL_PROGRESSIVO.titulo.antes}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">
                {TEXTOS_DO_MODAL_PROGRESSIVO.titulo.destaque}
              </span>
              {TEXTOS_DO_MODAL_PROGRESSIVO.titulo.depois}
            </h2>
          ) : (
            <h2 className="font-extrabold text-[22px] leading-[30px] md:text-[28px] md:leading-[36px] text-white text-center mb-2">
              Tenha um{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">
                Aplicativo Próprio Personalizado
              </span>
              {" "}da sua barbearia!
            </h2>
          )}

          {/* Subtitulo */}
          <p className="text-gray-400 text-sm md:text-base text-center mb-6">
            Preencha o formulário abaixo e receba uma oferta exclusiva.
          </p>

          {/* Erro */}
          {submitError && !campoComAviso && (
            <div ref={erroRef} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5">
              <p className="text-red-400 text-sm font-medium text-center">{submitError}</p>
            </div>
          )}

          {/* Formulario */}
          <form ref={formRef} onSubmit={aoEnviar} noValidate={progressivo} className="space-y-4">
            {progressivo &&
              CAMPOS_DE_CONTATO_PROGRESSIVO.filter((field) => ETAPA_DO_CAMPO[field.name] <= etapa).map((field) => (
                <div
                  key={field.name}
                  className={`space-y-1.5 ${ETAPA_DO_CAMPO[field.name] > ETAPA_INICIAL ? "bb-revelar" : ""}`.trim()}
                >
                  <label htmlFor={`modal-${field.name}`} className="block font-semibold text-[13px] md:text-[14px] text-white/90">
                    {field.label}
                  </label>
                  <input
                    id={`modal-${field.name}`}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required={field.name !== "email"}
                    aria-invalid={campoComAviso === field.name || undefined}
                    aria-describedby={campoComAviso === field.name ? `modal-${field.name}-aviso` : undefined}
                    className={`w-full bg-[#1a1d25] border-2 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 font-medium text-[14px] md:text-[15px] focus:outline-none focus:border-[#ffaf02] focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all duration-300 ${
                      campoComAviso === field.name ? "border-red-400" : "border-[#2a2d35] hover:border-[#3a3d45]"
                    }`}
                  />
                  {campoComAviso === field.name && (
                    <p id={`modal-${field.name}-aviso`} className="text-xs font-medium text-red-400">
                      {submitError}
                    </p>
                  )}
                </div>
              ))}

            {!progressivo && formFields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label htmlFor={`modal-${field.name}`} className="block font-semibold text-[13px] md:text-[14px] text-white/90">
                  {field.label}
                </label>
                <input
                  id={`modal-${field.name}`}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  required={field.name !== "email"}
                  className="w-full bg-[#1a1d25] border-2 border-[#2a2d35] rounded-xl px-4 py-3.5 text-white placeholder-gray-500 font-medium text-[14px] md:text-[15px] focus:outline-none focus:border-[#ffaf02] focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all duration-300 hover:border-[#3a3d45]"
                />
              </div>
            ))}

            <PerguntasQualificacao
              variante="escuro"
              valores={formData}
              onChange={handleInputChange}
              erros={erros}
              quantas={progressivo ? perguntasVisiveis(etapa) : undefined}
              classeItem={progressivo ? "bb-revelar" : undefined}
            />

            {/* Botao submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full bg-[#ffaf02] text-[#121212] font-extrabold text-[14px] md:text-[15px] px-6 py-4 rounded-full hover:bg-[#e69f00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(255,175,2,0.3)] hover:shadow-[0_8px_30px_rgba(255,175,2,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                    ENVIANDO...
                  </>
                ) : submitted ? (
                  <>
                    ✓ RECEBEMOS SEU CONTATO!
                  </>
                ) : (
                  <>
                    {progressivo ? TEXTOS_DO_MODAL_PROGRESSIVO.botao : "QUERO UM APP PERSONALIZADO!"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <AvisoPrivacidade variante="escuro" />

            <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Seus dados estão seguros e não serão compartilhados
            </p>
          </form>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes bb-revelar {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bb-revelar {
          animation: bb-revelar 0.3s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bb-revelar { animation: none; }
        }
      `}</style>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
