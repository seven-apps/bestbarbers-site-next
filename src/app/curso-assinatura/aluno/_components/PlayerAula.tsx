"use client";

import { useEffect, useRef, useState } from "react";
import { Clapperboard, TriangleAlert } from "lucide-react";
import { TEXTOS_AREA, type Aula } from "@/content/curso-assinatura";
import { chaveAssistido, chavePosicao, gravar, ler } from "@/lib/curso-api";
import {
  esperaParaRepetir,
  fracaoAssistida,
  lerIntervalos,
  marcosParaEnviar,
  posicaoParaRetomar,
  registrarTique,
  segundosDaDuracao,
  serializarIntervalos,
  type Acompanhamento,
  type Marco,
} from "@/lib/curso";

// ─── O mínimo da IFrame API do YouTube que a área usa ─────────────────────────────────────

interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
interface YTEvento {
  data: number;
}
interface YTNamespace {
  Player: new (
    elemento: HTMLElement,
    opcoes: {
      host?: string;
      videoId: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, number | string>;
      events?: { onReady?: () => void; onStateChange?: (e: YTEvento) => void; onError?: (e: YTEvento) => void };
    },
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let promessaDaApi: Promise<YTNamespace> | null = null;

/** Carrega `iframe_api` uma vez por página (sem apagar quem já ouvia o `onYouTubeIframeAPIReady`). */
function carregarApiDoYouTube(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (promessaDaApi) return promessaDaApi;
  promessaDaApi = new Promise<YTNamespace>((pronto, falhou) => {
    const anterior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      anterior?.();
      if (window.YT) pronto(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      promessaDaApi = null;
      falhou(new Error("iframe_api"));
    };
    document.head.appendChild(script);
  });
  return promessaDaApi;
}

function armazenamento(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Player da aula (contrato §9): IFrame API pelo youtube-nocookie, `rel: 0`, `playsinline: 1`.
 *
 * A cada 1 s tocando, conta o trecho entre os dois tiques se o avanço ficar entre 0 e 2,5 s
 * (`registrarTique`): busca não conta, e pular para o fim não conclui a aula. Os trechos e a última
 * posição ficam no aparelho, então quem para no meio e volta depois retoma de onde estava e não
 * precisa assistir tudo de novo numa visita só para chegar a 90%. Cada marco sai uma vez por
 * carregamento; falhou por rede, tenta de novo com espera crescente (o servidor é idempotente).
 *
 * Nenhum marco se perde por queda de rede: a nova tentativa tem relógio próprio (não espera o
 * próximo tique, que não vem com o vídeo pausado ou no fim), e ao abrir a aula o player reenvia o
 * que os trechos guardados no aparelho já alcançaram e o OS ainda não tem (ex.: o 90 da aula 3,
 * que é sinal de compra, falhou no fim do vídeo e a pessoa fechou a aba). A fração usa só a
 * duração que o player informa: a da constante é estimativa e podia concluir a aula sem ela ter
 * sido assistida (medido em 06/Out/26: `getDuration()` às vezes devolve 0 no `onReady`).
 */
export function PlayerAula({
  aula,
  codigo,
  marcoServidor,
  enviarMarco,
}: {
  aula: Aula;
  codigo: string;
  marcoServidor: Marco | null;
  /** `true` = não precisa tentar de novo (aceito, ou recusado de vez). */
  enviarMarco: (marco: Marco) => Promise<boolean>;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const [erro, setErro] = useState(false);
  const marcoRef = useRef(marcoServidor);
  const enviarRef = useRef(enviarMarco);
  useEffect(() => {
    marcoRef.current = marcoServidor;
    enviarRef.current = enviarMarco;
  }, [marcoServidor, enviarMarco]);

  useEffect(() => {
    if (!aula.youtubeId || !caixa.current) return;
    setErro(false);
    const container = caixa.current;
    const storage = armazenamento();
    const chaveTrechos = chaveAssistido(codigo, aula.numero);
    const chaveLugar = chavePosicao(codigo, aula.numero);

    let vivo = true;
    let player: YTPlayer | null = null;
    let relogio: number | undefined;
    let retentativa: number | undefined;
    let esperaDuracao: number | undefined;
    let acompanhamento: Acompanhamento = { intervalos: lerIntervalos(ler(storage, chaveTrechos)), ultimoTempo: null };
    // Trecho guardado = houve play numa visita anterior (o 0 daquela visita pode ter falhado).
    let deuPlay = acompanhamento.intervalos.length > 0;
    let terminouVideo = false;
    const enviados = new Set<Marco>();
    const enviando = new Set<Marco>();
    const espera = new Map<Marco, { tentativas: number; ate: number }>();

    /**
     * Repete os marcos pendentes quando a espera mais curta acabar, com o vídeo tocando ou não.
     * Só agenda espera FUTURA de marco fora do ar: nunca vira laço apertado.
     */
    const agendarRetentativa = () => {
      if (retentativa !== undefined) window.clearTimeout(retentativa);
      retentativa = undefined;
      if (!vivo) return;
      const agora = Date.now();
      const futuras = [...espera.entries()].filter(([m, e]) => !enviando.has(m) && e.ate > agora).map(([, e]) => e.ate);
      if (!futuras.length) return;
      retentativa = window.setTimeout(() => {
        retentativa = undefined;
        if (vivo) avaliar();
      }, Math.min(...futuras) - agora + 50);
    };

    const avaliar = () => {
      if (!player) return;
      const fracao = fracaoAssistida(acompanhamento.intervalos, player.getDuration());
      const agora = Date.now();
      const pendentes = marcosParaEnviar({ fracao, deuPlay, terminouVideo, enviados, doServidor: marcoRef.current });
      // Marco que o OS já cobriu (um maior foi gravado) não precisa mais de nova tentativa.
      for (const m of [...espera.keys()]) if (!pendentes.includes(m)) espera.delete(m);
      agendarRetentativa();
      for (const marco of pendentes) {
        if (enviando.has(marco) || (espera.get(marco)?.ate ?? 0) > agora) continue;
        enviando.add(marco);
        void enviarRef.current(marco).then((resolvido) => {
          enviando.delete(marco);
          if (resolvido) {
            enviados.add(marco);
            espera.delete(marco);
            return;
          }
          const tentativas = (espera.get(marco)?.tentativas ?? 0) + 1;
          espera.set(marco, { tentativas, ate: Date.now() + esperaParaRepetir(tentativas) });
          agendarRetentativa();
        });
      }
    };

    const tique = () => {
      if (!player) return;
      const tempo = player.getCurrentTime();
      acompanhamento = registrarTique(acompanhamento, tempo);
      gravar(storage, chaveTrechos, serializarIntervalos(acompanhamento.intervalos));
      gravar(storage, chaveLugar, String(Math.floor(tempo)));
      avaliar();
    };

    const parar = () => {
      if (relogio !== undefined) window.clearInterval(relogio);
      relogio = undefined;
    };

    carregarApiDoYouTube()
      .then((YT) => {
        if (!vivo) return;
        // O YouTube troca o elemento pelo iframe: ele ganha um filho só dele, fora do React.
        const alvo = document.createElement("div");
        alvo.className = "absolute inset-0 w-full h-full";
        container.appendChild(alvo);
        const guardado = Number(ler(storage, chaveLugar));
        const inicio = posicaoParaRetomar(Number.isFinite(guardado) && guardado > 0 ? guardado : null, segundosDaDuracao(aula.duracao));
        player = new YT.Player(alvo, {
          host: "https://www.youtube-nocookie.com",
          videoId: aula.youtubeId,
          width: "100%",
          height: "100%",
          playerVars: { rel: 0, playsinline: 1, modestbranding: 1, ...(inicio ? { start: inicio } : {}) },
          events: {
            // Reenvia o que os trechos guardados já alcançaram e o OS ainda não tem. O player pode
            // não saber a duração no onReady: confere de novo a cada 1 s, por até 15 s.
            onReady: () => {
              let vezes = 0;
              const conferir = () => {
                if (!vivo || !player) return;
                avaliar();
                if (player.getDuration() > 0 || ++vezes >= 15) return;
                esperaDuracao = window.setTimeout(conferir, 1_000);
              };
              conferir();
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) {
                deuPlay = true;
                if (relogio === undefined) relogio = window.setInterval(tique, 1_000);
                avaliar();
                return;
              }
              // Pausa, carregamento ou fim: o trecho até aqui ainda conta.
              tique();
              parar();
              if (e.data === YT.PlayerState.ENDED) {
                terminouVideo = true;
                gravar(storage, chaveLugar, "0");
                avaliar();
              }
            },
            onError: () => {
              if (vivo) setErro(true);
            },
          },
        });
      })
      .catch(() => {
        if (vivo) setErro(true);
      });

    return () => {
      vivo = false;
      parar();
      if (retentativa !== undefined) window.clearTimeout(retentativa);
      if (esperaDuracao !== undefined) window.clearTimeout(esperaDuracao);
      try {
        player?.destroy();
      } catch {
        /* o iframe já saiu */
      }
      container.replaceChildren();
    };
  }, [aula.numero, aula.youtubeId, aula.duracao, codigo]);

  if (!aula.youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#161616] border border-white/10 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <Clapperboard className="w-8 h-8 text-[#ffaf02]" />
        <p className="text-[15px] md:text-base font-semibold text-white/85">{TEXTOS_AREA.aula.semVideo(aula.numero)}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <div ref={caixa} className="absolute inset-0" />
      {erro ? (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center bg-[#161616]">
          <TriangleAlert className="w-7 h-7 text-[#ffaf02]" />
          <p className="text-[15px] font-semibold text-white/85">{TEXTOS_AREA.aula.videoComErro}</p>
        </div>
      ) : null}
    </div>
  );
}
