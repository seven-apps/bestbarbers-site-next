"use client";

import { useState, useCallback } from "react";

interface SpotifyEmbedProps {
  /** ID do episódio no Spotify (verificado em src/content/podcast). */
  spotifyId: string;
  /** Título real do episódio — vira o rótulo acessível do player. */
  title: string;
  /** Rótulo do botão antes de montar o iframe. */
  label?: string;
  /** true = player com destaque (hero). */
  featured?: boolean;
}

/**
 * Player do Spotify em fachada (mesmo padrão do YouTubeEmbed): o iframe só é
 * montado depois do clique. Dois motivos: 12 iframes de uma vez matam o LCP do
 * tráfego frio no 4G, e o embed do Spotify grava cookie de terceiro assim que
 * carrega — sem clique, não carrega.
 */
export function SpotifyEmbed({
  spotifyId,
  title,
  label = "Ouvir episódio",
  featured = false,
}: SpotifyEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = useCallback(() => setIsPlaying(true), []);

  if (isPlaying) {
    return (
      <div className="w-full overflow-hidden rounded-xl bg-black/40">
        <iframe
          src={`https://open.spotify.com/embed/episode/${spotifyId}`}
          title={`Player do Spotify: ${title}`}
          height={featured ? 232 : 152}
          className="w-full block border-0"
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={`Ouvir: ${title}`}
      className={`group inline-flex items-center gap-3 rounded-full font-bold text-[#121212] bg-[#ffaf02] transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)] ${
        featured ? "px-8 py-4 text-sm md:text-base" : "px-5 py-3 text-xs md:text-sm"
      }`}
    >
      <span
        aria-hidden
        className={`flex items-center justify-center rounded-full bg-[#121212] ${
          featured ? "w-8 h-8" : "w-6 h-6"
        }`}
      >
        <svg
          className={`text-[#ffaf02] ml-0.5 ${featured ? "w-4 h-4" : "w-3 h-3"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      {label}
    </button>
  );
}
