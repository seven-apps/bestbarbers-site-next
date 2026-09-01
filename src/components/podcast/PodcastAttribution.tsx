"use client";

import { useEffect } from "react";
import { SS_KEY, type UtmParams } from "@/hooks/useUtmParams";
import { podcastOriginDesc } from "@/content/podcast";

/**
 * Atribuição da rota /podcast — decide QUEM levou o crédito por esta visita.
 *
 * A rota tem duas entradas com donos diferentes:
 *
 * 1) Quem vem DO Spotify (link da descrição do episódio, /podcast?desc=1.3 ou
 *    /podcast puro): grava o snapshot com source=podcast e a descrição decodificada
 *    ("Assinatura do Zero - EP03 - ..."), e limpa o ?desc da URL. Com a URL limpa,
 *    useUtmParams restaura o snapshot em QUALQUER página — o visitante navega o site
 *    inteiro e a conversão continua na origem "Site - Podcast" no Ploomes.
 *
 * 2) Quem vem de ANÚNCIO para esta página (a campanha de atenção manda tráfego frio
 *    PARA o podcast): a URL chega com fbclid/UTM/publico. Aqui o podcast NÃO pode
 *    assinar a visita — se assinasse, o lead entraria como "Site - Podcast" sem
 *    utm_campaign, utm_content, publico nem creativeId, e a esteira de tráfego perderia
 *    o CPL por criativo. Neste caso persistimos os próprios parâmetros da URL, em
 *    first-touch (só se ainda não houver snapshot), replicando useUtmParams — necessário
 *    porque esta página não monta formulário, então nada mais chamaria o hook aqui.
 *
 * Regra em uma linha: sinal de anúncio na URL vence o podcast; URL sem sinal é podcast.
 */

/** Mesma lista de sinais de `hasSignal` em useUtmParams (first-touch de campanha). */
function readAdSignals(search: URLSearchParams) {
  const utmSource = search.get("utm_source");
  const legacySource = search.get("source");
  const origin = search.get("origin");
  const fbclid = search.get("fbclid");
  const gclid = search.get("gclid");
  const utmCampaign = search.get("utm_campaign");
  const publico = search.get("publico");

  const hasAdSignal = !!(
    utmSource ||
    legacySource ||
    origin ||
    fbclid ||
    gclid ||
    utmCampaign ||
    publico
  );

  return { utmSource, legacySource, origin, fbclid, gclid, utmCampaign, publico, hasAdSignal };
}

export function PodcastAttribution() {
  useEffect(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const signals = readAdSignals(search);

      if (signals.hasAdSignal) {
        // Entrada 2 — anúncio. First-touch: não sobrescreve snapshot existente.
        if (sessionStorage.getItem(SS_KEY)) return;

        const paid: UtmParams = {
          utm_source: signals.utmSource || signals.legacySource,
          utm_desc: search.get("desc"),
          utm_inf: search.get("inf"),
          utm_medium: search.get("utm_medium"),
          utm_campaign: signals.utmCampaign,
          utm_content: search.get("utm_content"),
          utm_term: search.get("utm_term"),
          publico: signals.publico,
          origin: signals.origin,
          odesc: search.get("odesc"),
          fbclid: signals.fbclid,
          fbclidFresh: signals.fbclid,
          gclid: signals.gclid,
        };
        sessionStorage.setItem(SS_KEY, JSON.stringify(paid));
        // URL preservada de propósito: buildLeadAttribution lê a URL viva.
        return;
      }

      // Entrada 1 — Spotify. Last-touch intencional: quem chega por este link
      // veio do podcast, mesmo que tenha clicado num ad dias antes na sessão.
      const snapshot: UtmParams = {
        utm_source: "podcast",
        utm_desc: podcastOriginDesc(search.get("desc")),
        utm_inf: null,
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
        publico: null,
        origin: null,
        odesc: null,
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
