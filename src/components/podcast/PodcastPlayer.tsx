"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type PodcastEpisode } from "@/content/podcast";
import { SEASON_COVER } from "@/content/podcast/temporada";

/**
 * UM player do Spotify para a página inteira, morando numa BARRA FIXA no rodapé.
 *
 * DESENHO: existe um único `<iframe>` do Spotify, criado uma vez pela IFrame API
 * (`createController`) e reaproveitado para sempre. Trocar de episódio é
 * `loadUri()` no MESMO nó — medido: o nó do DOM é o mesmo antes e depois, só o
 * `src` muda. Três consequências, e as três são exatamente o que a página precisa:
 *
 *  1. "clicou em outro episódio, o anterior para" sai DE GRAÇA. Não é um listener
 *     que pode falhar — é que não existe um segundo player para continuar tocando.
 *  2. A página carrega 1 embed em vez de 12. Cada embed do Spotify custa ~11 KB de
 *     HTML + ~1,7 MB de JS dentro do próprio iframe; 12 deles matariam o LCP do
 *     tráfego frio no 4G, que era a razão da fachada de botão que existia aqui antes.
 *  3. O player não pode ANDAR pela lista: re-parentar o iframe dispara `ready` de
 *     novo, ou seja, recarrega e perde a posição do áudio. Por isso ele tem um lugar
 *     só no DOM — esta barra — e nunca troca de pai.
 *
 * POR QUE A BARRA E NÃO UM CARTÃO (mudança de 01/Set/2026): o player morava dentro
 * do cartão "COMECE POR AQUI", no hero, e só virava barra quando o cartão saía da
 * tela. Esse cartão foi removido a pedido do André — a listagem dos 12 episódios
 * agora vem logo depois do hero, sem nada no meio. O player passou a nascer já como
 * barra, escondida abaixo da dobra até a primeira escolha, e sobe quando a pessoa
 * toca em qualquer episódio. É o padrão do aplicativo do Spotify: a lista é a tela,
 * o player é a faixa. De quebra some o "buraco" de 152px que o slot deixava no
 * cartão depois de o player docar.
 *
 * ESPAÇO DE ROLAGEM (defeito medido no celular): uma barra `fixed` sem reserva de
 * rolagem cobre uma linha inteira da lista — em 390×844 a barra come 13,6% da tela,
 * e um toque no botão daquela linha morre no iframe em vez de chegar ao botão. A
 * reserva é `padding-bottom` no `body`, MEDIDA da barra com ResizeObserver e
 * re-medida quando a altura muda. A versão anterior media uma vez só, no commit em
 * que a barra aparecia, e cravava 199px para uma barra de 115px.
 *
 * UM CLIQUE, COM REDE DE SEGURANÇA: o comando de play é disparado DENTRO da pilha
 * de execução do clique (ver `toggle`). Isso não é detalhe de estilo — é a condição
 * para o navegador aceitar. O Chrome trata a permissão como PEGAJOSA por documento
 * de topo e a delega ao iframe pelo `allow="autoplay"` que a própria API põe no
 * iframe que cria (medido em 01/Set: o atributo vem com `autoplay`; ainda assim
 * `ensureAutoplayAllowed` confere e completa, porque o atributo é de terceiro); o
 * Safari, principalmente no iOS, historicamente exige o gesto na MESMA pilha de
 * chamada. Por isso o caminho normal não tem `await` nem `setTimeout` entre o
 * clique e o `play()` — quando o player já está montado (que é o caso, porque ele
 * monta sozinho no idle), o comando sai direto.
 *
 * MEDIDO em 01/Set/2026, Chrome desktop: um clique real na linha do EP 08 começou a
 * tocar sem nenhum segundo toque. Isso NÃO vira promessa para Safari iOS, que não
 * foi testado — vira a explicação de por que o caminho é síncrono.
 *
 * A rede de segurança continua: se 4 segundos depois do comando o `playback_update`
 * ainda não tiver mostrado posição andando, a página convida a tocar no ▶ do player
 * — que já está montado, visível na barra e com o episódio CERTO carregado. Melhor
 * caso 1 clique, pior caso 2, nunca pior do que era antes. ATENÇÃO ao ler esse aviso
 * como métrica: ele não distingue "barrado" de "lento" — na mesma medição de 01/Set
 * um começo que funcionou demorou mais de 4 segundos e o aviso apareceu no caminho,
 * sumindo sozinho quando o áudio andou. Por isso o texto do aviso pergunta em vez
 * de afirmar que o navegador bloqueou.
 *
 * CUSTO ASSUMIDO: o player monta sozinho (no idle, depois da primeira pintura) em
 * vez de esperar clique — é o que garante o play em UM toque. O preço é o cookie de
 * terceiro do Spotify para quem só passa pela página. Duas mitigações ficaram no
 * código: a montagem espera o navegador ficar ocioso (não disputa com o LCP) e é
 * PULADA em conexão magra (`saveData` ou 2g) — nesses casos o primeiro toque monta
 * e manda tocar, e a barra mostra "carregando" enquanto o iframe nasce.
 */

/* ------------------------------------------------------------------ */
/*  Superfície da IFrame API do Spotify (tipada só no que usamos)      */
/* ------------------------------------------------------------------ */

interface SpotifyPlaybackData {
  isPaused: boolean;
  isBuffering: boolean;
  duration: number;
  position: number;
  /** URI do que está de fato no player. Não está no tutorial oficial, mas vem no payload. */
  playingURI?: string;
}

interface SpotifyEmbedEvent {
  data?: SpotifyPlaybackData;
}

interface SpotifyEmbedController {
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  loadUri(uri: string, preferVideo?: boolean, startAt?: number): void;
  destroy(): void;
  addListener(
    event: "ready" | "playback_update" | "error",
    handler: (event: SpotifyEmbedEvent) => void
  ): void;
}

interface SpotifyIframeApi {
  createController(
    target: HTMLElement,
    options: { uri?: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

const IFRAME_API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

/**
 * Altura do embed na barra. 80px é a forma compacta do embed do Spotify (capa,
 * título, ▶ e a linha do tempo) — medida: renderiza inteira nessa altura. Agora é
 * uma constante só: o player nasce e morre como barra, nunca mais muda de altura.
 */
const PLAYER_HEIGHT = 80;

/** Quanto esperamos o áudio realmente andar antes de pedir confirmação manual. */
const PLAY_WATCHDOG_MS = 4000;

/**
 * O loader do Spotify avisa no console se for inicializado duas vezes, e o callback
 * global precisa existir ANTES do script carregar. Promise de módulo resolve os dois:
 * um script só, uma inicialização só, mesmo com o efeito rodando duas vezes no
 * StrictMode do dev.
 */
let apiPromise: Promise<SpotifyIframeApi> | null = null;

function loadSpotifyIframeApi(): Promise<SpotifyIframeApi> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<SpotifyIframeApi>((resolve, reject) => {
    const previous = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api) => {
      previous?.(api);
      resolve(api);
    };

    const script = document.createElement("script");
    script.src = IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => {
      // Zera a promessa para que uma falha de rede passageira possa ser tentada
      // de novo no próximo clique, em vez de travar a página para sempre.
      apiPromise = null;
      reject(new Error("Não foi possível carregar a IFrame API do Spotify."));
    };
    document.head.appendChild(script);
  });

  return apiPromise;
}

/**
 * O `allow` do iframe é escrito pela API do Spotify, não por nós — e sem `autoplay`
 * ali dentro a permissão do documento de topo NÃO é delegada, e o play em um toque
 * morre. Medido em 01/Set/2026: a API já entrega
 * `autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture`.
 * Esta função não conserta um defeito conhecido — ela impede que uma mudança do
 * lado do Spotify quebre o play sem ninguém perceber.
 */
function ensureAutoplayAllowed(iframe: HTMLIFrameElement) {
  const allow = iframe.getAttribute("allow") ?? "";
  if (/(^|;)\s*autoplay\b/.test(allow)) return;
  iframe.setAttribute("allow", allow ? `autoplay; ${allow}` : "autoplay");
}

/* ------------------------------------------------------------------ */
/*  Contexto                                                           */
/* ------------------------------------------------------------------ */

interface PodcastPlayerValue {
  episodes: PodcastEpisode[];
  /** ID do episódio que está NO player (tocando ou pausado). */
  activeEpisodeId: string | null;
  isPlaying: boolean;
  isBuffering: boolean;
  /** true quando o comando de play saiu mas o áudio não andou — pede toque no ▶ nativo. */
  needsManualPlay: boolean;
  /** true quando o embed do Spotify não pôde ser carregado (bloqueador, rede). */
  hasFailed: boolean;
  isPlayerMounted: boolean;
  /** true a partir do primeiro episódio que a pessoa escolheu — antes disso nada é destacado. */
  hasStarted: boolean;
  toggle: (episode: PodcastEpisode) => void;
  dismissPlayer: () => void;
}

const PodcastPlayerContext = createContext<PodcastPlayerValue | null>(null);

export function usePodcastPlayer(): PodcastPlayerValue {
  const value = useContext(PodcastPlayerContext);
  if (!value) {
    throw new Error(
      "usePodcastPlayer precisa estar dentro de <PodcastPlayerProvider>."
    );
  }
  return value;
}

/* ------------------------------------------------------------------ */
/*  Pixel — consumo, não clique                                        */
/* ------------------------------------------------------------------ */

/**
 * PlayEpisode dispara quando o áudio ANDA de verdade (posição > 0 com o player
 * despausado), não no clique. Duas razões: um clique barrado pela política de
 * autoplay não é escuta, e o Spotify desaconselha inflar "starts" em embed. Uma vez
 * por episódio por carregamento de página — resume depois de pausa não conta de novo.
 */
function trackPlayEpisode(episode: PodcastEpisode) {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("trackCustom", "PlayEpisode", {
      episode: episode.number,
      content_name: `EP${String(episode.number).padStart(2, "0")} - ${episode.title}`,
      content_category: "podcast",
    });
  } catch {
    // Pixel bloqueado (ad-blocker) não pode derrubar a reprodução.
  }
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

interface ProviderProps {
  episodes: PodcastEpisode[];
  children: React.ReactNode;
}

export function PodcastPlayerProvider({ episodes, children }: ProviderProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const mountingRef = useRef<Promise<SpotifyEmbedController | null> | null>(null);

  const episodesRef = useRef(episodes);
  episodesRef.current = episodes;

  const activeIdRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const positionRef = useRef(0);
  const watchdogRef = useRef<number | null>(null);
  const trackedRef = useRef<Set<string>>(new Set());
  /** Espelho de `needsManualPlay`: o clique precisa ler o valor de agora, não o do último render. */
  const needsManualPlayRef = useRef(false);
  /**
   * true entre "mandamos tocar" e "o áudio andou de verdade". É a janela exata em
   * que o autoplay barrado se manifesta — e enquanto ela está aberta, um evento
   * "pausado, posição 0" vindo do embed é SINTOMA do bloqueio, não uma pausa da
   * pessoa. Sem essa distinção o embed desarma a rede de segurança sozinho, porque
   * ele emite justamente esse evento quando termina de carregar.
   */
  const awaitingStartRef = useRef(false);

  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isPlayerMounted, setIsPlayerMounted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  /** Estado e espelho andam juntos: a tela lê o state, o clique lê o ref. */
  const setNeedsManual = useCallback((value: boolean) => {
    needsManualPlayRef.current = value;
    setNeedsManualPlay(value);
  }, []);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  const armWatchdog = useCallback(() => {
    clearWatchdog();
    setNeedsManual(false);
    watchdogRef.current = window.setTimeout(
      () => setNeedsManual(true),
      PLAY_WATCHDOG_MS
    );
  }, [clearWatchdog, setNeedsManual]);

  /**
   * Estado do React vem do player, não do nosso otimismo: `playback_update` é a
   * única fonte de "está tocando". Se a pessoa mexer no ▶/⏸ de dentro do iframe, a
   * lista acompanha. `playingURI` também corrige o episódio ativo se ele divergir.
   */
  const handlePlaybackUpdate = useCallback(
    (event: SpotifyEmbedEvent) => {
      const data = event?.data;
      if (!data) return;

      if (data.playingURI) {
        const id = data.playingURI.split(":").pop() ?? null;
        if (
          id &&
          id !== activeIdRef.current &&
          episodesRef.current.some((ep) => ep.spotifyId === id)
        ) {
          activeIdRef.current = id;
          setActiveEpisodeId(id);
        }
      }

      const playing = !data.isPaused;
      positionRef.current = data.position ?? 0;
      isPlayingRef.current = playing;
      setIsPlaying(playing);
      setIsBuffering(Boolean(data.isBuffering) && positionRef.current === 0);

      if (!playing) {
        // Pausa DEPOIS de o áudio ter andado é decisão da pessoa: desarma o aviso.
        // Pausa enquanto ainda esperamos o começo é o contrário — é a cara do
        // autoplay barrado, e o embed emite exatamente isso ao terminar de
        // carregar. Desarmar aqui mataria a rede de segurança antes de ela servir.
        if (!awaitingStartRef.current) {
          clearWatchdog();
          setNeedsManual(false);
        }
        return;
      }

      if (positionRef.current > 0) {
        awaitingStartRef.current = false;
        clearWatchdog();
        setNeedsManual(false);
        setHasStarted(true);

        const id = activeIdRef.current;
        if (id && !trackedRef.current.has(id)) {
          const episode = episodesRef.current.find((ep) => ep.spotifyId === id);
          if (episode) {
            trackedRef.current.add(id);
            trackPlayEpisode(episode);
          }
        }
      }
    },
    [clearWatchdog, setNeedsManual]
  );

  /**
   * Cria o controller UMA vez. O nó alvo é sacrificial de propósito: a API faz
   * `parentElement.replaceChild(iframe, target)` — ela DESTRÓI o elemento que
   * recebe. Por isso ele nasce por `document.createElement` dentro de um host que o
   * React renderiza sempre vazio; o React nunca reconcilia o que existe lá dentro.
   */
  const ensureController = useCallback(
    (spotifyId: string): Promise<SpotifyEmbedController | null> => {
      if (controllerRef.current) return Promise.resolve(controllerRef.current);
      if (mountingRef.current) return mountingRef.current;

      const host = hostRef.current;
      if (!host) return Promise.resolve(null);

      mountingRef.current = loadSpotifyIframeApi()
        .then(
          (api) =>
            new Promise<SpotifyEmbedController | null>((resolve) => {
              const target = document.createElement("div");
              host.appendChild(target);

              api.createController(
                target,
                {
                  uri: `spotify:episode:${spotifyId}`,
                  width: "100%",
                  height: PLAYER_HEIGHT,
                },
                (controller) => {
                  controllerRef.current = controller;
                  activeIdRef.current = spotifyId;
                  setActiveEpisodeId(spotifyId);
                  setIsPlayerMounted(true);
                  controller.addListener("playback_update", handlePlaybackUpdate);
                  resolve(controller);
                }
              );
            })
        )
        .catch(() => {
          mountingRef.current = null;
          setHasFailed(true);
          return null;
        });

      return mountingRef.current;
    },
    [handlePlaybackUpdate]
  );

  /**
   * O comando em si — SÍNCRONO de propósito. Nada aqui pode virar `await` nem
   * `setTimeout`: as duas coisas tiram o comando da pilha de execução do clique, e
   * é essa pilha que o navegador olha para decidir se o áudio pode começar sozinho.
   */
  const command = useCallback(
    (episode: PodcastEpisode, controller: SpotifyEmbedController) => {
      setHasFailed(false);
      setIsDismissed(false);
      setHasStarted(true);

      // "Está tocando" só vale quando o áudio está de fato andando. Se o watchdog
      // já pediu confirmação manual, o player está PARADO apesar do estado
      // otimista — e o clique da pessoa é para tocar de novo, nunca para pausar.
      const reallyPlaying = isPlayingRef.current && !needsManualPlayRef.current;

      if (activeIdRef.current === episode.spotifyId) {
        if (reallyPlaying) {
          awaitingStartRef.current = false;
          controller.pause();
          clearWatchdog();
          setNeedsManual(false);
          return;
        }
        awaitingStartRef.current = true;
        // `resume()` só depois que o episódio já andou; do zero é `play()`.
        if (positionRef.current > 0) controller.resume();
        else controller.play();
        armWatchdog();
        return;
      }

      // Episódio DIFERENTE. Nunca confiar no dedup interno da API: no fonte do
      // Spotify `currentUri` é inicializado como "" e nunca recebe valor, então o
      // guard de "mesmo URI" lá é código morto — quem tem que rotear somos nós.
      activeIdRef.current = episode.spotifyId;
      positionRef.current = 0;
      isPlayingRef.current = true;
      awaitingStartRef.current = true;
      setActiveEpisodeId(episode.spotifyId);
      setIsPlaying(true);
      setIsBuffering(true);

      // `play()` logo depois entra na fila interna e é despachado quando o novo
      // iframe fica pronto — a API suporta esse par de propósito.
      controller.loadUri(`spotify:episode:${episode.spotifyId}`);
      controller.play();
      armWatchdog();
    },
    [armWatchdog, clearWatchdog, setNeedsManual]
  );

  const toggle = useCallback(
    (episode: PodcastEpisode) => {
      // CAMINHO NORMAL: o player já está montado (ele monta sozinho no idle, antes
      // de qualquer clique), então o comando sai DENTRO da pilha do clique — sem
      // `await`, sem promessa no meio. É a única forma de o gesto continuar valendo
      // no Safari, onde a permissão de tocar é verificada na pilha de chamada e não
      // por uma janela de tempo como no Chrome.
      const ready = controllerRef.current;
      if (ready) {
        command(episode, ready);
        return;
      }

      // Só quando o player AINDA não montou (conexão magra, ou clique antes de o
      // navegador ficar ocioso) é que existe espera — e aí não há como evitar: o
      // iframe precisa nascer antes de receber ordem. Neste caminho a barra sobe
      // mostrando "carregando", e o segundo toque, no ▶ do próprio player, é
      // esperado.
      setHasStarted(true);
      setIsDismissed(false);
      void ensureController(episode.spotifyId).then((controller) => {
        if (controller) command(episode, controller);
      });
    },
    [command, ensureController]
  );

  const dismissPlayer = useCallback(() => {
    awaitingStartRef.current = false;
    controllerRef.current?.pause();
    clearWatchdog();
    setNeedsManual(false);
    setIsDismissed(true);
  }, [clearWatchdog, setNeedsManual]);

  /* Montagem automática, sem disputar com o LCP e sem castigar conexão magra. */
  useEffect(() => {
    const first = episodes[0];
    if (!first) return;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (/(^|-)2g$/.test(connection?.effectiveType ?? "")) return;

    let cancelled = false;
    const run = () => {
      if (!cancelled) void ensureController(first.spotifyId);
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (win.requestIdleCallback) {
      const handle = win.requestIdleCallback(run, { timeout: 2500 });
      return () => {
        cancelled = true;
        win.cancelIdleCallback?.(handle);
      };
    }

    const timer = window.setTimeout(run, 1200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [episodes, ensureController]);

  /** A barra só existe depois da primeira escolha — e some se a pessoa fechar. */
  const isBarVisible = hasStarted && !isDismissed;

  /* Altura e atributos do iframe: quem cria é a API do Spotify, então conferimos. */
  useEffect(() => {
    const iframe = hostRef.current?.querySelector("iframe");
    if (!iframe) return;
    iframe.style.height = `${PLAYER_HEIGHT}px`;
    ensureAutoplayAllowed(iframe);
    // O iframe é criado pela API do Spotify, então o `title` não passa por nós.
    // Um iframe sem título é um quadro anônimo para quem navega por leitor de tela;
    // só preenchemos se a API não tiver posto nada.
    if (!iframe.title) iframe.title = "Player do BestBarbers Podcast no Spotify";
  }, [isPlayerMounted]);

  /**
   * Reserva de rolagem sob a barra fixa — MEDIDA, e re-medida quando a altura muda
   * (o aviso de confirmação entra e sai, o iframe assenta depois do commit). Sem
   * isto a barra come uma linha inteira da lista no celular e o toque no botão
   * daquela linha morre no iframe.
   */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || !isBarVisible) return;

    const previous = document.body.style.paddingBottom;
    const apply = () => {
      document.body.style.paddingBottom = `${bar.offsetHeight + 12}px`;
    };
    apply();

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(apply);
      observer.observe(bar);
    }

    return () => {
      observer?.disconnect();
      document.body.style.paddingBottom = previous;
    };
  }, [isBarVisible]);

  useEffect(
    () => () => {
      if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
      controllerRef.current?.destroy();
      controllerRef.current = null;
      mountingRef.current = null;
      document.body.style.paddingBottom = "";
    },
    []
  );

  const activeEpisode = useMemo(
    () => episodes.find((ep) => ep.spotifyId === activeEpisodeId) ?? null,
    [episodes, activeEpisodeId]
  );

  const value = useMemo<PodcastPlayerValue>(
    () => ({
      episodes,
      activeEpisodeId,
      isPlaying,
      isBuffering,
      needsManualPlay,
      hasFailed,
      isPlayerMounted,
      hasStarted,
      toggle,
      dismissPlayer,
    }),
    [
      episodes,
      activeEpisodeId,
      isPlaying,
      isBuffering,
      needsManualPlay,
      hasFailed,
      isPlayerMounted,
      hasStarted,
      toggle,
      dismissPlayer,
    ]
  );

  // "Tocando agora" só quando o áudio está andando. Enquanto o aviso de
  // confirmação estiver na tela o player está parado — dizer o contrário na mesma
  // barra que pede o toque no ▶ seria contradizer a própria instrução.
  const isAudible = isPlaying && !needsManualPlay;

  return (
    <PodcastPlayerContext.Provider value={value}>
      <PlayerStyles />
      {/* Leitor de tela acompanha a troca de episódio sem precisar procurar o player. */}
      <p className="sr-only" aria-live="polite">
        {activeEpisode && isAudible
          ? `Tocando: episódio ${activeEpisode.number}, ${activeEpisode.title}`
          : ""}
      </p>

      {children}

      {/* ---------------------------------------------------------------- */}
      {/*  A BARRA — único lugar do iframe no DOM, da primeira pintura ao   */}
      {/*  fim da página. Antes da primeira escolha ela fica abaixo da      */}
      {/*  dobra (translate-y-full): o iframe existe e carrega, mas não     */}
      {/*  ocupa tela nem recebe toque.                                      */}
      {/* ---------------------------------------------------------------- */}
      <div
        ref={barRef}
        aria-label="Player do podcast"
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0c0c0c]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_36px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isBarVisible
            ? "translate-y-0"
            : "pointer-events-none translate-y-full"
        }`}
      >
        {/* ALTURA É ORÇAMENTO DE TELA: a barra come 12% de um celular de 844px.
            Por isso o botão de fechar fica AO LADO do embed, não numa faixa
            própria em cima dele — a faixa custava mais 50px de altura só para
            repetir "Tocando agora", que o próprio embed já mostra. Quem anuncia
            a troca de episódio para leitor de tela é a região `aria-live` lá em
            cima, não um texto aqui. */}
        <div className="mx-auto w-full max-w-3xl px-3 py-2.5 md:px-6">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              {/* O React renderiza este nó SEMPRE vazio: quem manda no conteúdo é a API. */}
              <div
                ref={hostRef}
                className="overflow-hidden rounded-xl [&>iframe]:block [&>iframe]:w-full"
              />

              {!isPlayerMounted && !hasFailed && (
                <div className="flex items-center gap-3 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SEASON_COVER.src}
                    alt=""
                    width={SEASON_COVER.width}
                    height={SEASON_COVER.height}
                    className="h-11 w-11 shrink-0 rounded-md object-cover"
                  />
                  <p className="flex min-w-0 items-center gap-2 text-xs leading-snug text-gray-300">
                    {isAudible && <NowPlayingBars className="h-3 shrink-0 text-[#ffaf02]" />}
                    <span>
                      Carregando o player do Spotify
                      {activeEpisode ? ` — episódio ${activeEpisode.number}` : ""}…
                    </span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={dismissPlayer}
              tabIndex={isBarVisible ? undefined : -1}
              aria-label="Fechar o player"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] motion-reduce:transition-none"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {hasFailed && (
            <p className="pt-2 text-xs leading-snug text-gray-400">
              O player do Spotify não carregou aqui (pode ser um bloqueador de
              rastreadores). Use o link{" "}
              <span className="text-gray-300">Ouvir no Spotify</span> de qualquer
              episódio da lista.
            </p>
          )}

          {needsManualPlay && (
            // O aviso NÃO afirma que o navegador bloqueou: medido em 01/Set, um
            // clique que funcionou levou mais de 4 segundos para o áudio andar, e
            // o aviso apareceu no meio do caminho. O watchdog não distingue
            // "barrado" de "lento", então o texto só pode dizer o que é verdade
            // nos dois casos — e a instrução é a mesma de qualquer jeito.
            <p className="pt-1 text-xs leading-snug text-gray-400">
              Ainda não começou? Toque no ▶ do player nesta barra.
            </p>
          )}
        </div>
      </div>
    </PodcastPlayerContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Ícones e indicador de "tocando agora"                              */
/* ------------------------------------------------------------------ */

/**
 * As barrinhas do equalizador só se mexem para quem não pediu menos movimento —
 * com `prefers-reduced-motion: reduce` elas ficam paradas em alturas diferentes e
 * continuam legíveis como indicador.
 */
function PlayerStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
.bb-eq{display:flex;align-items:flex-end;gap:2px;height:14px}
.bb-eq i{display:block;width:3px;height:100%;border-radius:1px;background:currentColor;transform-origin:bottom;transform:scaleY(.45)}
.bb-eq i:nth-child(2){transform:scaleY(.9)}
.bb-eq i:nth-child(3){transform:scaleY(.6)}
@media (prefers-reduced-motion: no-preference){
  .bb-eq i{animation:bb-eq 900ms ease-in-out infinite}
  .bb-eq i:nth-child(2){animation-delay:180ms}
  .bb-eq i:nth-child(3){animation-delay:360ms}
}
@keyframes bb-eq{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
`,
      }}
    />
  );
}

export function NowPlayingBars({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`bb-eq ${className}`}>
      <i />
      <i />
      <i />
    </span>
  );
}

export function PlayGlyph({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function PauseGlyph({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  "Comece por aqui" — o que sobrou do cartão removido                */
/* ------------------------------------------------------------------ */

/**
 * O cartão "COMECE POR AQUI" saiu do hero (ele empurrava a listagem para 2,5 telas
 * de rolagem no celular). A função dele — dizer por onde começar e deixar começar
 * em um toque — coube num botão só, que continua mandando no mesmo player único.
 */
export function PlayFirstEpisodeButton({
  episode,
}: {
  episode: PodcastEpisode;
}) {
  const { toggle, activeEpisodeId, isPlaying, needsManualPlay, hasStarted } =
    usePodcastPlayer();

  const isThisPlaying =
    hasStarted &&
    activeEpisodeId === episode.spotifyId &&
    isPlaying &&
    !needsManualPlay;

  return (
    <button
      type="button"
      onClick={() => toggle(episode)}
      aria-label={
        isThisPlaying
          ? `Pausar o episódio ${episode.number} — ${episode.title}`
          : `Tocar o episódio ${episode.number} — ${episode.title}`
      }
      className="inline-flex min-h-11 items-center gap-3 rounded-full bg-[#ffaf02] px-5 py-3 text-sm font-bold text-[#121212] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffaf02] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] motion-reduce:transition-none motion-reduce:hover:scale-100"
    >
      {isThisPlaying ? (
        <PauseGlyph className="h-4 w-4 shrink-0" />
      ) : (
        <PlayGlyph className="h-4 w-4 shrink-0" />
      )}
      <span>
        {isThisPlaying ? "Pausar" : "Começar pelo episódio 1"}
      </span>
    </button>
  );
}
