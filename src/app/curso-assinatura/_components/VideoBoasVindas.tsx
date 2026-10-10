"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { TEXTOS_VITRINE, VIDEO_BOAS_VINDAS } from "@/content/curso-assinatura";
import { COR } from "./Primitivos";

/**
 * Boas-vindas no herói da vitrine: a capa do YouTube com o play. O player (youtube-nocookie, o
 * mesmo host da área do aluno) só carrega no clique, para não pesar a abertura da página.
 */
export function VideoBoasVindas() {
  const [tocando, setTocando] = useState(false);
  const { youtubeId, duracao } = VIDEO_BOAS_VINDAS;
  const rotulo = TEXTOS_VITRINE.heroi.video;

  if (tocando) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
          title={rotulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTocando(true)}
      aria-label={`${rotulo}, ${duracao}`}
      className="group relative block w-full aspect-video overflow-hidden rounded-xl bg-[#121212] cursor-pointer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" aria-hidden />
      <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
        <span
          className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
          style={{ backgroundColor: COR.amarelo, color: COR.escuro }}
        >
          <Play className="w-6 h-6 md:w-7 md:h-7 ml-0.5" fill="currentColor" />
        </span>
      </span>
      <span
        className="absolute left-3 bottom-3 rounded-full bg-black/75 px-3 py-1 text-[12px] font-bold text-white"
        aria-hidden
      >
        {rotulo} · {duracao}
      </span>
    </button>
  );
}
