"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { EVENTO_CONVERSA_LUCAS, type ConversaComLucas as Conversa } from "@/lib/lead-nutricao";
import { TEXTOS_CONVERSA_LUCAS as TEXTOS } from "@/content/lucas-whatsapp";

/**
 * Celular, página comum: quanto esperar o WhatsApp abrir antes de mostrar o cartão de reserva. Se a página
 * continua na tela depois disso, o app não abriu (navegador que bloqueia, WhatsApp não instalado).
 */
const ESPERA_APP_MS = 1_500;

/**
 * Leva o lead < 60 ao WhatsApp do Lucas depois do formulário (ADR-035; regra em
 * `src/lib/lead-nutricao.ts`). Montado no layout raiz e inerte até o `useLeadForm` disparar o
 * evento — por isso sobrevive ao `router.push` das páginas que vão para a tela de obrigado.
 *
 * - Celular, página comum: abre o APP na hora (`whatsapp://`), com a mensagem pronta, sem cartão antes
 *   (pedido do André, 10/Out/26: o cartão de 2 s e a página do api.whatsapp.com atrasavam o lead). O
 *   cartão só aparece se o app não abrir em 1,5 s (com o botão pelo `wa.me`, que abre no toque) ou
 *   quando a pessoa volta do WhatsApp (para reabrir se não enviou).
 * - Computador: o cartão com o botão (`wa.me`).
 * - `soBotao` (a página entrega algo depois do formulário: tabela, guia): barra no rodapé,
 *   sem cobrir o que a pessoa acabou de destravar, e nunca abre sozinha. No celular, o botão abre o app.
 *
 * z-110: fica acima do LeadFormModal (z-100), que continua aberto depois do envio.
 */
export function ConversaComLucas() {
  const [conversa, setConversa] = useState<Conversa | null>(null);
  const [celular, setCelular] = useState(false);
  // O app foi chamado e o cartão espera: ou o app abre (a página some), ou ele aparece como reserva.
  const [esperandoApp, setEsperandoApp] = useState(false);
  // O app não abriu: a reserva usa o `wa.me`, porque o `whatsapp://` acabou de falhar neste navegador.
  const [appFalhou, setAppFalhou] = useState(false);

  useEffect(() => {
    const ouvir = (e: Event) => {
      const detalhe = (e as CustomEvent<Conversa>).detail;
      if (!detalhe?.link) return;
      // Celular = tela de toque sem mouse. É onde o WhatsApp é um app e abrir sozinho faz sentido.
      const ehCelular = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      setCelular(ehCelular);
      setAppFalhou(false);
      setConversa(detalhe);
      if (ehCelular && !detalhe.soBotao && detalhe.appLink) {
        setEsperandoApp(true);
        // Na hora, dentro do evento: quanto mais perto do toque em "enviar", mais o navegador aceita abrir o app.
        window.location.href = detalhe.appLink;
      }
    };
    window.addEventListener(EVENTO_CONVERSA_LUCAS, ouvir);
    return () => window.removeEventListener(EVENTO_CONVERSA_LUCAS, ouvir);
  }, []);

  useEffect(() => {
    if (!esperandoApp) return;
    const t = window.setTimeout(() => {
      if (document.visibilityState === "visible") {
        setAppFalhou(true);
        setEsperandoApp(false);
      }
    }, ESPERA_APP_MS);
    // O app abriu e a pessoa voltou para o site: o cartão fica, para reabrir se ela não enviou.
    const aoVoltar = () => {
      if (document.visibilityState === "visible") setEsperandoApp(false);
      else window.clearTimeout(t);
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [esperandoApp]);

  if (!conversa || esperandoApp) return null;

  const fechar = () => setConversa(null);
  // Celular: o app direto. Computador, ou app que já falhou neste navegador: o `wa.me` (abre no toque).
  const usaApp = celular && !appFalhou && !!conversa.appLink;
  const botao = (
    <a
      href={usaApp ? conversa.appLink : conversa.link}
      {...(usaApp ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      className="w-full whitespace-nowrap bg-[#25D366] text-white font-extrabold text-[16px] py-4 px-6 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    >
      <MessageCircle className="w-5 h-5" />
      {TEXTOS.botao}
    </a>
  );

  if (conversa.soBotao) {
    // Celular: texto e fechar em cima, botão inteiro embaixo. Computador: tudo numa linha.
    return (
      <div
        role="region"
        aria-label={TEXTOS.titulo}
        className="fixed inset-x-0 bottom-0 z-[110] bg-white border-t border-black/10 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] animate-fade-in"
      >
        <div className="mx-auto max-w-[640px] grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_auto] items-center gap-x-3 gap-y-2.5">
          <p className="text-[#121212] text-[14px] leading-[20px]">
            <strong>{TEXTOS.titulo}</strong> {TEXTOS.convite}
          </p>
          <div className="order-3 col-span-2 md:order-none md:col-span-1">{botao}</div>
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4 text-[#121212]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversa-lucas-titulo"
      className="fixed inset-0 z-[110] flex items-center justify-center px-5"
    >
      <button type="button" aria-label="Fechar" onClick={fechar} className="absolute inset-0 bg-black/70 backdrop-blur-[2px] animate-fade-in cursor-default" />
      <div className="relative w-full max-w-[360px] bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.55)] px-6 pt-7 pb-6 text-center animate-scale-in">
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 text-[#121212]" />
        </button>
        <h2 id="conversa-lucas-titulo" className="font-extrabold text-[#121212] text-[24px] leading-[30px] mb-2">
          {TEXTOS.titulo}
        </h2>
        <p className="text-[#5a5a5a] text-[15px] leading-[21px] mb-5">
          {TEXTOS.convite}
        </p>
        {botao}
      </div>
    </div>
  );
}
