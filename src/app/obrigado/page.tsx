"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel, useWhatsAppRedirect } from "@/hooks";
import { Download, CheckCircle2, Eye, ArrowRight } from "lucide-react";
import { ISCAS, ISCA_PADRAO, ehIscaId, partesDoTitulo } from "@/lib/iscas";

const AMBER = "#ebad04";

/**
 * Põe em negrito o trecho entre aspas curvas (“ ”) do subtítulo — é o "por onde
 * começar" de cada isca. Mantém a ênfase visual sem precisar de HTML no mapa.
 */
function destacarAspas(texto: string): ReactNode[] {
  return texto.split(/(“[^”]*”)/g).map((parte, i) =>
    parte.startsWith("“") ? (
      <strong key={i} className="text-white">
        {parte}
      </strong>
    ) : (
      <span key={i}>{parte}</span>
    )
  );
}

function ObrigadoContent() {
  const { trackCustomEvent } = useMetaPixel();
  const { generateWhatsAppLink } = useWhatsAppRedirect();
  const searchParams = useSearchParams();

  // Qual guia esta página está entregando. Sem `?isca=` (ou com id desconhecido)
  // cai no padrão — links antigos de /obrigado seguem mostrando o Cadeira Cheia.
  const paramIsca = searchParams.get("isca");
  const iscaId = paramIsca && ehIscaId(paramIsca) ? paramIsca : ISCA_PADRAO;
  const isca = ISCAS[iscaId];
  const { antes, destaque, depois } = partesDoTitulo(isca);

  // NÃO refaz o evento Lead aqui: o Lead (Pixel + CAPI) já dispara no submit dentro do
  // useLeadForm e é awaited antes do redirect pra esta página. Refazer criaria um 2º
  // Lead com eventId diferente → double-count (o bug documentado no v12/layout.tsx).
  // Aqui disparamos só ViewContent (visibilidade do fundo de funil / página de obrigado).
  // O título da aba também é ajustado aqui: a página é noindex, então não vale o custo
  // de virar rota dinâmica só pra ter generateMetadata por isca.
  useEffect(() => {
    document.title = `Seu guia ${isca.titulo} está aqui | BestBarbers`;
    trackCustomEvent("ViewContent", {
      content_name: `Obrigado - ${isca.pixelId}`,
      content_category: "thank_you",
      isca: iscaId,
    });
  }, [trackCustomEvent, isca.titulo, isca.pixelId, iscaId]);

  const consultorLink = generateWhatsAppLink(isca.whatsapp);

  return (
    <main
      className="min-h-screen flex flex-col overflow-x-hidden max-w-[100vw] w-full"
      style={{ background: "#0a0a0a", fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <Navbar withoutCta />

      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] rounded-full opacity-[0.07]"
            style={{ background: `radial-gradient(circle, ${AMBER} 0%, transparent 70%)`, filter: "blur(120px)" }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-7"
              style={{ background: "rgba(2,171,21,0.14)" }}
            >
              <CheckCircle2 className="w-9 h-9" style={{ color: "#02ab15" }} />
            </div>

            <h1
              className="text-white leading-tight mb-5"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(28px, 5vw, 46px)" }}
            >
              Pronto! Seu guia{" "}
              {antes}
              <span style={{ color: AMBER }}>{destaque}</span>
              {depois} está aqui.
            </h1>

            {/*
              O download NA PÁGINA é a entrega — não existe envio por WhatsApp nem por
              e-mail (nenhum executor desses canais foi construído). Falar aqui em "está
              a caminho do seu WhatsApp e e-mail" era promessa falsa: a pessoa esperava
              uma mensagem que nunca chegaria. O texto abaixo descreve o que de fato
              acontece, e o botão é o herói da página.

              E descreve pela AFIRMATIVA. A versão anterior deste parágrafo dizia "não
              mandamos cópia por WhatsApp nem por e-mail": os dois forms já avisam que o
              download abre na tela seguinte, então o leitor chega aqui SEM esperar
              mensagem nenhuma — e negar um envio que ele não esperava planta a ideia de
              que algo foi retido ([[feedback_copy_nao_ancorar_objecao]]). A urgência vem
              de onde o arquivo está, não de onde ele não vai chegar.
            */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
              A entrega é aqui mesmo, nesta página:{" "}
              <strong className="text-white">baixe o PDF no botão abaixo</strong> e o arquivo
              fica salvo no seu celular ou no computador. Esta é a sua cópia — baixe agora,
              enquanto está com a página aberta.
            </p>

            {/* Download on-page — o herói da página */}
            <div className="mb-8">
              <a
                href={isca.pdf}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCustomEvent("GuiaDownload", {
                    content_name: `${isca.pixelId} PDF`,
                    isca: iscaId,
                  })
                }
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto text-[#1e1e1e] font-extrabold text-[16px] md:text-[19px] px-10 py-6 rounded-full transition-all duration-300 active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, #f5c842, ${AMBER})`, boxShadow: "0 8px 34px rgba(235,173,4,0.45)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Download className="w-6 h-6" />
                Baixar o guia agora
              </a>
              <p className="text-white/40 text-xs mt-3 flex items-center justify-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                PDF · abre em nova aba
              </p>
            </div>

            {/* Por onde começar a leitura — varia por isca */}
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              {destacarAspas(isca.subtitulo)}
            </p>

            {/* CTA consultor */}
            <div className="mt-10 pt-8 border-t border-white/8">
              <p className="text-white/65 text-sm md:text-base leading-relaxed mb-5 max-w-xl mx-auto">
                {isca.consultor}
              </p>
              <a
                href={consultorLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCustomEvent("ConsultorClick", {
                    content_name: `Obrigado - Falar com consultor - ${isca.pixelId}`,
                    isca: iscaId,
                  })
                }
                className="inline-flex items-center gap-2.5 text-white font-bold text-[14px] md:text-[15px] px-7 py-4 rounded-full transition-all duration-300 active:scale-[0.98] border"
                style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(235,173,4,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                Falar com um consultor
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterSimple />
    </main>
  );
}

export default function ObrigadoPage() {
  // useSearchParams exige <Suspense> no Next 15 / React 19 — sem isso o build quebra
  // no prerender desta rota. Mesmo padrão que já roda em produção em /parceiros.
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
          <div className="animate-pulse text-lg text-white/60">Carregando...</div>
        </div>
      }
    >
      <ObrigadoContent />
    </Suspense>
  );
}
