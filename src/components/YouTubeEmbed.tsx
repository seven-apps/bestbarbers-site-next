"use client";

import { useState, useCallback } from "react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = useCallback(() => setIsPlaying(true), []);

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={handlePlay}
      className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black group cursor-pointer"
      aria-label={`Reproduzir: ${title}`}
    >
      {/* Thumbnail */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#ffaf02] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg
            className="w-7 h-7 md:w-9 md:h-9 text-[#121212] ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
