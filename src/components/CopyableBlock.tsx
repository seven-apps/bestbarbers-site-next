"use client";

import { useState } from "react";

/**
 * Bloco de template pronto-pra-copiar (mensagens/scripts dos "kits" da cadência de e-mail).
 * Caixa com rótulo, o texto copiável e um botão "Copiar" que dá feedback visual.
 */
export function CopyableBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: seleção manual (clipboard bloqueado)
      setCopied(false);
    }
  };

  return (
    <div className="my-5 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#121212]">
        <span className="text-xs font-semibold text-[#ffaf02] uppercase tracking-wide">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copiar texto"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#ffaf02] text-[#121212] text-xs font-bold px-3 py-1.5 transition-all hover:bg-[#e69f00] active:scale-[0.97]"
        >
          {copied ? "✓ Copiado!" : "Copiar"}
        </button>
      </div>
      <p className="px-4 py-4 text-gray-800 text-sm leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
