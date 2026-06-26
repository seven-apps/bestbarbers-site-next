"use client";

import { useEffect } from "react";
import { SS_KEY, type UtmParams } from "@/hooks/useUtmParams";
import { podcastOriginDesc } from "@/content/podcast";

/**
 * Atribuição dos links do Spotify (/podcast?desc=1.3).
 *
 * Grava o snapshot de UTM em sessionStorage com source=podcast e a descrição
 * decodificada ("Assinatura do Zero - EP03 - ..."), e limpa o ?desc da URL.
 * Com a URL limpa, useUtmParams restaura o snapshot em QUALQUER página — o
 * visitante pode navegar pelo site inteiro e a conversão continua atribuída
 * à origem "Site - Podcast" no Ploomes.
 *
 * Last-touch intencional: sobrescreve snapshot anterior (ex: clique em ad
 * dias antes na mesma sessão) — quem chega por este link veio do podcast.
 */
export function PodcastAttribution() {
  useEffect(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const snapshot: UtmParams = {
        utm_source: "podcast",
        utm_desc: podcastOriginDesc(search.get("desc")),
        utm_inf: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
        fbclid: null,
        fbclidFresh: null,
        gclid: null,
      };
      sessionStorage.setItem(SS_KEY, JSON.stringify(snapshot));

      if (search.has("desc")) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    } catch {
      // sessionStorage indisponível (privacy mode) — lead cai no fallback "site"
    }
  }, []);

  return null;
}
