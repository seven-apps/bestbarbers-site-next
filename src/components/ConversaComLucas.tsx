"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { EVENTO_CONVERSA_LUCAS, type ConversaComLucas as Conversa } from "@/lib/lead-nutricao";
import { TEXTOS_CONVERSA_LUCAS as TEXTOS } from "@/content/lucas-whatsapp";

/** Tempo para o lead ler "cadastro feito" antes de o celular abrir o WhatsApp. */
const ATRASO_ABRIR_MS = 2_000;

/**
 * Leva o lead < 60 ao WhatsApp do Lucas depois do formulário (ADR-035; regra em
 * `src/lib/lead-nutricao.ts`). Montado no layout raiz e inerte até o `useLeadForm` disparar o
 * evento — por isso sobrevive ao `router.push` das páginas que vão para a tela de obrigado.
 *
 * - Celular, página comum: cartão no centro e o WhatsApp abre sozinho em ~2 s.
 * - Computador: o mesmo cartão, só com o botão.
 * - `soBotao` (a página entrega algo depois do formulário: tabela, guia): barra no rodapé,
 *   sem cobrir o que a pessoa acabou de destravar, e nunca abre sozinha.
 *
 * z-110: fica acima do LeadFormModal (z-100), que continua aberto depois do envio.
 */
export function ConversaComLucas() {
  const [conversa, setConversa] = useState<Conversa | null>(null);
  const [abreSozinho, setAbreSozinho] = useState(false);

  useEffect(() => {
    const ouvir = (e: Event) => {
      const detalhe = (e as CustomEvent<Conversa>).detail;
      if (!detalhe?.link) return;
      // Celular = tela de toque sem mouse. É onde o WhatsApp é um app e abrir sozinho faz sentido.
      const celular = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      setAbreSozinho(celular && !detalhe.soBotao);
      setConversa(detalhe);
    };
    window.addEventListener(EVENTO_CONVERSA_LUCAS, ouvir);
    return () => window.removeEventListener(EVENTO_CONVERSA_LUCAS, ouvir);
  }, []);

  useEffect(() => {
    if (!conversa || !abreSozinho) return;
    const t = window.setTimeout(() => {
      window.location.href = conversa.link;
    }, ATRASO_ABRIR_MS);
    // Fechar o cartão cancela a abertura.
    return () => window.clearTimeout(t);
  }, [conversa, abreSozinho]);

  if (!conversa) return null;

  const fechar = () => setConversa(null);
  const botao = (
    <a
      href={conversa.link}
      target="_blank"
      rel="noopener noreferrer"
      // Quem tocou antes dos 2 s já foi: a abertura automática não pode abrir de novo.
      onClick={() => setAbreSozinho(false)}
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
          {abreSozinho ? TEXTOS.abrindo : TEXTOS.convite}
        </p>
        {botao}
      </div>
    </div>
  );
}
