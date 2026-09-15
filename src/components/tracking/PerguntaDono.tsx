"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { SS_KEY } from "@/hooks/useUtmParams";
import { portaDoLead } from "@/lib/tracking/porta";
import {
  ATRASO_MS,
  EVENTO_POR_RESPOSTA,
  deveMostrarPergunta,
  foiDispensada,
  gravarResposta,
  lerResposta,
  marcarDispensa,
  parametrosDaResposta,
  type RespostaDono,
} from "@/lib/pergunta-dono";

/** `utm_campaign` do snapshot que o useUtmParams guarda na sessão (navegação interna). */
function campanhaDaSessao(): string | null {
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return null;
    const snap = JSON.parse(raw) as { utm_campaign?: string | null };
    return snap.utm_campaign ?? null;
  } catch {
    return null;
  }
}

type Estado = "oculto" | "pergunta" | "obrigado";

/**
 * Pergunta única só para o tráfego do TOPO (regra em `lib/pergunta-dono.ts`).
 * Montado no layout raiz: em qualquer outra visita é inerte (não renderiza nada).
 * Cartão BRANCO centralizado sobre fundo escurecido (André, 15/Set/26: "centralizado,
 * fundo branco para destacar em meio às cores do site, instigar o clique rápido").
 * Tocar fora ou no X = fechar sem responder. z-95: o LeadFormModal (z-100) cobre.
 */
export function PerguntaDono() {
  const pathname = usePathname();
  const { trackNonCatalogEvent } = useMetaPixel();
  const [estado, setEstado] = useState<Estado>("oculto");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lerResposta(window.localStorage) || foiDispensada(window.sessionStorage)) return;
    if (!deveMostrarPergunta(window.location.search, campanhaDaSessao())) return;
    const t = window.setTimeout(() => setEstado("pergunta"), ATRASO_MS);
    return () => window.clearTimeout(t);
    // Decide UMA vez por carregamento: a condição vem da URL de entrada, não muda com o pathname.
  }, []);

  const responder = useCallback(
    (resposta: RespostaDono) => {
      const search = window.location.search;
      const caminho = pathname || window.location.pathname;
      const porta = portaDoLead(caminho, new URLSearchParams(search).get("utm_content"));
      const params = parametrosDaResposta(resposta, search, caminho, porta);
      gravarResposta(window.localStorage, resposta, Date.now());
      void trackNonCatalogEvent(EVENTO_POR_RESPOSTA[resposta], params);
      try {
        (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "pergunta_dono", ...params });
      } catch {
        /* GTM ausente */
      }
      setEstado("obrigado");
      window.setTimeout(() => setEstado("oculto"), 1400);
    },
    [pathname, trackNonCatalogEvent],
  );

  const dispensar = useCallback(() => {
    marcarDispensa(window.sessionStorage);
    setEstado("oculto");
  }, []);

  if (estado === "oculto") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pergunta-dono-titulo"
      className="fixed inset-0 z-[95] flex items-center justify-center px-5"
    >
      {/* Fundo escurecido: tocar fora = fechar sem responder (não insiste nesta sessão) */}
      <button type="button" aria-label="Fechar" onClick={dispensar} className="absolute inset-0 bg-black/70 backdrop-blur-[2px] animate-fade-in cursor-default" />
      <div className="relative w-full max-w-[340px] bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.55)] px-6 pt-7 pb-6 text-center animate-scale-in">
        {estado === "pergunta" ? (
          <>
            <button
              type="button"
              onClick={dispensar}
              aria-label="Fechar"
              className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4 text-[#121212]" />
            </button>
            <div className="text-[34px] leading-none mb-3" aria-hidden="true">👋</div>
            <h2 id="pergunta-dono-titulo" className="font-extrabold text-[#121212] text-[24px] leading-[30px] mb-2">
              Você é dono de barbearia?
            </h2>
            <p className="text-[#5a5a5a] text-[14px] leading-[20px] mb-5">Responda em 1 toque. Só isso.</p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => responder("sim")}
                className="w-full bg-[#ffaf02] text-[#121212] font-extrabold text-[16px] py-4 rounded-full hover:bg-[#e69f00] active:scale-[0.98] transition-all shadow-[0_6px_24px_rgba(255,175,2,0.45)]"
              >
                Sim, sou dono
              </button>
              <button
                type="button"
                onClick={() => responder("nao")}
                className="w-full bg-transparent border-2 border-[#e5e5e5] text-[#121212] font-semibold text-[15px] py-3.5 rounded-full hover:border-[#bdbdbd] active:scale-[0.98] transition-all"
              >
                Não sou
              </button>
            </div>
          </>
        ) : (
          <p className="text-[#121212] font-extrabold text-[20px] leading-[28px] py-3">Valeu! Boa leitura. 👊</p>
        )}
      </div>
    </div>
  );
}
