"use client";

import {
  PODCAST_SHOW_NAME,
  spotifyEpisodeShareUrl,
  spotifyShowUrl,
  type PodcastEpisode,
} from "@/content/podcast";
import { SpotifyGlyph } from "@/components/podcast/SpotifyGlyph";

/**
 * Os links da /podcast para o Spotify — e o pixel que os torna mensuráveis.
 *
 * POR QUE ESTE ARQUIVO EXISTE (decisão do André, 01/Set/2026): a página tinha um
 * player embutido e a escuta acontecia aqui dentro. Duas medições mataram esse
 * desenho: (1) play pelo embed NÃO conta no painel do Spotify — 163s de escuta real
 * não moveram plays, streams nem listeners, porque o embed fala com endpoints
 * "unauth" mesmo com o usuário logado; (2) autoplay ao abrir a página é impossível
 * em todos os navegadores para tráfego frio. Somado ao comportamento do lead —
 * ninguém para para ouvir 13 minutos no instante em que clica num anúncio — o
 * destino certo é o Spotify: lá ele salva, segue, ouve depois e entra no algoritmo
 * da própria conta. A página deixou de ser sala de escuta e virou VITRINE.
 *
 * E POR QUE A PÁGINA CONTINUA NO MEIO DO CAMINHO: o pixel da Meta só marca quem
 * passa pelo NOSSO domínio. A célula de mídia do podcast é de semeadura — existe
 * para marcar gente barata e alimentar o retargeting depois. Anúncio apontado
 * direto para o Spotify não marca ninguém. Esta página é a estação de marcação.
 *
 * ENTREGA DO EVENTO — o ponto que decide se a campanha enxerga alguma coisa:
 * todo link daqui abre em ABA NOVA (`target="_blank"`). Não é estética: numa
 * navegação que troca de página o documento é descarregado e a requisição do
 * `fbq()` pode ser cortada no meio; com aba nova o documento atual continua vivo e
 * o pixel termina de enviar sozinho. É por isso que não há `sendBeacon` aqui — ele
 * seria o remendo para o caso que estamos evitando, e exigiria remontar a URL do
 * `/tr` do Facebook à mão, sem dedup com o SDK (risco de contar duas vezes).
 *
 * NOMES DOS EVENTOS: `PlayEpisode` morreu junto com o player e NÃO é reaproveitado
 * — misturar "tocou aqui dentro" com "saiu para o Spotify" na mesma série apagaria
 * a fronteira entre os dois períodos no gerenciador. Os eventos novos são
 * `OpenEpisodeSpotify` (episódio) e `OpenShowSpotify` (programa).
 */

/** Clique num episódio → Spotify. Um evento por clique, sem deduplicação. */
export const EVENT_OPEN_EPISODE = "OpenEpisodeSpotify";
/** Clique no programa (seguir/abrir o show) → Spotify. */
export const EVENT_OPEN_SHOW = "OpenShowSpotify";

/**
 * Onde o clique nasceu. Serve para separar, no gerenciador, o CTA do hero (decisão
 * de "vou começar") do clique na lista (decisão de "quero ESTE assunto").
 */
type Placement = "hero" | "lista" | "fecho";

function trackOpenEpisode(episode: PodcastEpisode, placement: Placement) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("trackCustom", EVENT_OPEN_EPISODE, {
      episode: episode.number,
      content_name: `EP${String(episode.number).padStart(2, "0")} - ${episode.title}`,
      content_category: "podcast",
      placement,
    });
  } catch {
    // Pixel bloqueado (ad-blocker) nunca pode impedir o clique de abrir o Spotify.
  }
}

function trackOpenShow(placement: Placement) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("trackCustom", EVENT_OPEN_SHOW, {
      content_name: PODCAST_SHOW_NAME,
      content_category: "podcast",
      placement,
    });
  } catch {
    // idem: o pixel é passageiro, não motorista.
  }
}

/* ------------------------------------------------------------------ */
/*  Episódio                                                           */
/* ------------------------------------------------------------------ */

/**
 * O link que cobre a LINHA INTEIRA do episódio na listagem.
 *
 * Ele é uma camada absoluta por cima do cartão, não um `<a>` embrulhando o
 * conteúdo: dentro da linha ainda existe o botão "Ler mais", e botão dentro de link
 * é HTML inválido (e um alvo que rouba o toque). Assim a área clicável é o cartão
 * todo — o alvo mais generoso possível no celular — e o "Ler mais" continua
 * funcionando por cima, num plano acima.
 *
 * O anel de foco é `ring-inset` no próprio link: como ele ocupa o cartão inteiro,
 * o anel desenha em volta da linha, e o teclado enxerga exatamente o que o dedo
 * acerta.
 */
export function EpisodeRowLink({ episode }: { episode: PodcastEpisode }) {
  return (
    <a
      href={spotifyEpisodeShareUrl(episode)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackOpenEpisode(episode, "lista")}
      className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ffaf02]"
    >
      <span className="sr-only">
        Ouvir no Spotify o episódio {episode.number}: {episode.title}
      </span>
    </a>
  );
}

/**
 * CTA do hero. Antes era o botão de play do episódio 1; agora abre o episódio 1 no
 * Spotify — mesma promessa ("comece por aqui"), destino honesto.
 */
export function FirstEpisodeCta({ episode }: { episode: PodcastEpisode }) {
  return (
    <div>
      <a
        href={spotifyEpisodeShareUrl(episode)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackOpenEpisode(episode, "hero")}
        aria-label={`Ouvir no Spotify o episódio ${episode.number}: ${episode.title}`}
        className="inline-flex min-h-11 items-center gap-3 rounded-full bg-[#ffaf02] px-5 py-3 text-sm font-bold text-[#121212] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {/* Preto, não verde: o guia da marca do Spotify aceita o ícone monocromático
            preto sobre fundo claro, e o verde sobre o amarelo da BestBarbers vibra. */}
        <SpotifyGlyph className="h-5 w-5 shrink-0 text-[#121212]" />
        <span aria-hidden>Começar pelo episódio 1</span>
      </a>

      {/* O destino, escrito. Este é o primeiro alvo que o tráfego frio toca e o
          único sinal de para onde ele leva era o glifo MONOCROMÁTICO preto sobre
          amarelo — a forma de menor reconhecimento da marca do Spotify. O
          aria-label já avisava; quem enxerga não era avisado.

          Fica FORA do botão porque dentro dele o rótulo completo quebrava em duas
          linhas no 390 (medido: 64px de altura, "…1 no / Spotify"). E diz também a
          aba nova — a única parte do contrato que a pessoa descobria só depois de
          tocar. `aria-hidden` porque o aria-label do link já carrega o destino: o
          leitor de tela não precisa ouvir duas vezes. */}
      <p aria-hidden className="mt-2 text-xs text-gray-500">
        Abre no Spotify, em uma aba nova.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Programa                                                           */
/* ------------------------------------------------------------------ */

/** Selo do hero — em um segundo a pessoa sabe onde o podcast mora. */
export function ShowBadgeLink() {
  return (
    <a
      href={spotifyShowUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackOpenShow("hero")}
      aria-label={`Abrir o ${PODCAST_SHOW_NAME} no Spotify`}
      className="mt-5 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition-colors duration-200 hover:border-[#1DB954]/60 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] motion-reduce:transition-none"
    >
      <SpotifyGlyph className="h-5 w-5 shrink-0 text-[#1DB954]" />
      <span aria-hidden>Ouça no Spotify</span>
    </a>
  );
}

/** Fecho da página: quem prefere o aplicativo sai daqui direto para o programa. */
export function ShowFollowLink() {
  return (
    <a
      href={spotifyShowUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackOpenShow("fecho")}
      aria-label={`Seguir o ${PODCAST_SHOW_NAME} no Spotify`}
      className="inline-flex min-h-11 items-center gap-2.5 text-sm font-bold text-white transition-colors duration-200 hover:text-[#1DB954] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1DB954] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] motion-reduce:transition-none"
    >
      <SpotifyGlyph className="h-6 w-6 shrink-0 text-[#1DB954]" />
      <span aria-hidden>Seguir o {PODCAST_SHOW_NAME} no Spotify</span>
    </a>
  );
}
