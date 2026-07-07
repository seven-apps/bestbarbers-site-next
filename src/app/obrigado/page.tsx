"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel, useWhatsAppRedirect } from "@/hooks";
import { Download, CheckCircle2, Eye, ArrowRight } from "lucide-react";

const AMBER = "#ebad04";
const PDF_URL = "/guia-cadeira-cheia.pdf";

export default function ObrigadoPage() {
  const { trackCustomEvent } = useMetaPixel();
  const { generateWhatsAppLink } = useWhatsAppRedirect();

  // NÃO refaz o evento Lead aqui: o Lead (Pixel + CAPI) já dispara no submit dentro do
  // useLeadForm e é awaited antes do redirect pra esta página. Refazer criaria um 2º
  // Lead com eventId diferente → double-count (o bug documentado no v12/layout.tsx).
  // Aqui disparamos só ViewContent (visibilidade do fundo de funil / página de obrigado).
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "Obrigado - Guia Cadeira Cheia",
      content_category: "thank_you",
    });
  }, [trackCustomEvent]);

  const consultorLink = generateWhatsAppLink(
    "Olá!%20Baixei%20o%20guia%20Cadeira%20Cheia%20e%20quero%20ver%20como%20o%20app%20me%20mostra%20quem%20sumiu."
  );

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
              <span style={{ color: AMBER }}>Cadeira Cheia</span> está a caminho.
            </h1>

            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-4">
              Ele já está a caminho do seu WhatsApp e e-mail — dá uma olhada (se não achar, confere o spam).
              Comece por <strong className="text-white">&ldquo;enxergar quem sumiu&rdquo;</strong>: é o passo de
              resultado mais rápido.
            </p>

            {/* Download on-page */}
            <div className="mt-8 mb-6">
              <a
                href={PDF_URL}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCustomEvent("GuiaDownload", { content_name: "Guia Cadeira Cheia PDF" })}
                className="inline-flex items-center gap-3 text-[#1e1e1e] font-extrabold text-[15px] md:text-[16px] px-8 py-5 rounded-full transition-all duration-300 active:scale-[0.98]"
                style={{ background: `linear-gradient(135deg, #f5c842, ${AMBER})`, boxShadow: "0 4px 20px rgba(235,173,4,0.35)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Download className="w-5 h-5" />
                Baixar o guia agora
              </a>
              <p className="text-white/40 text-xs mt-3 flex items-center justify-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                PDF · abre em nova aba
              </p>
            </div>

            {/* CTA consultor */}
            <div className="mt-10 pt-8 border-t border-white/8">
              <p className="text-white/65 text-sm md:text-base leading-relaxed mb-5 max-w-xl mx-auto">
                Quer ver como o app te mostra quem sumiu e chama todo mundo de volta com 1 clique — grátis e sem
                limite? Um consultor da BestBarbers te mostra numa conversa rápida de 15 min, sem compromisso.
              </p>
              <a
                href={consultorLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCustomEvent("ConsultorClick", { content_name: "Obrigado - Falar com consultor" })}
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
