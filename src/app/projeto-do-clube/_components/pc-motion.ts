"use client";

/**
 * PROJETO DO CLUBE — primitivos de movimento (B2).
 *
 * Decisão V5 da arquitetura: NENHUMA biblioteca de animação nesta família.
 * Todo o vocabulário é `transform` + `opacity`, feito por CSS, IntersectionObserver
 * e Web Animations API — que o navegador roda na thread de composição, de graça.
 * Importar `framer-motion` puxaria a biblioteca inteira para o bundle da rota.
 *
 * Duas garantias que valem para tudo que sair daqui:
 *   1. Falhou o observer, faltou a API, quebrou o JS → o conteúdo APARECE (V6).
 *   2. `prefers-reduced-motion: reduce` → estado final, nunca estado inicial.
 */

import { useSyncExternalStore } from "react";

/* ───────────────────────────────────────────────────────────────────────────
   Espelho dos tokens de `pc-tokens.css`, para o que é JS.
   Fallback, não fonte: quem puder ler do elemento deve usar `pcTokenMs()`,
   assim CSS e JS nunca divergem quando alguém mexer no token.
   ─────────────────────────────────────────────────────────────────────────── */

export const PC_MOVIMENTO = {
  dur1: 140,
  dur2: 260,
  dur3: 460,
  dur4: 700,
  durConta: 1500,
  stagger: 90,
  deslocamento: 18,
  easeSaida: "cubic-bezier(.22,.61,.36,1)",
  easeSuave: "cubic-bezier(.40,0,.20,1)",
  /** M1: threshold 0 — fração do ELEMENTO, e 0.3 mata seção alta em silêncio. */
  threshold: 0,
  rootMargin: "0px 0px -12% 0px",
} as const;

export const PC_QUERY_REDUZIDO = "(prefers-reduced-motion: reduce)";

/* ───────────────────────────────────────────────────────────────────────────
   prefers-reduced-motion — uma leitura, com listener de `change`, porque a
   pessoa pode trocar a preferência com a página aberta.
   ─────────────────────────────────────────────────────────────────────────── */

function consultaReduzido(): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  return window.matchMedia(PC_QUERY_REDUZIDO);
}

function assinarMovimento(aoMudar: () => void): () => void {
  const consulta = consultaReduzido();
  if (!consulta) return () => {};
  if (typeof consulta.addEventListener === "function") {
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }
  // Safari antigo: `addListener`/`removeListener` (depreciados, mas é o que existe lá).
  consulta.addListener(aoMudar);
  return () => consulta.removeListener(aoMudar);
}

function lerMovimento(): boolean {
  return consultaReduzido()?.matches ?? false;
}

/** No servidor assumimos movimento PERMITIDO: o HTML sai igual nos dois casos. */
function lerMovimentoNoServidor(): boolean {
  return false;
}

/**
 * `true` quando a pessoa pediu menos movimento. Reage à troca da preferência
 * sem recarregar a página.
 *
 * Quem usa: `PcNumero` (imprime o número), `PcMecanismo` (renderiza o estado
 * final), `PcRevelar` (não esconde nada).
 */
export function usePcMovimentoReduzido(): boolean {
  return useSyncExternalStore(assinarMovimento, lerMovimento, lerMovimentoNoServidor);
}

/** Leitura pontual, fora de componente (dentro de um handler, por exemplo). */
export function prefereMovimentoReduzido(): boolean {
  return lerMovimento();
}

/* ───────────────────────────────────────────────────────────────────────────
   Token de duração lido do próprio elemento — CSS continua sendo a fonte.
   ─────────────────────────────────────────────────────────────────────────── */

/** Lê `--pc-dur-4` (ou qualquer token de tempo) do elemento, em milissegundos. */
export function pcTokenMs(alvo: Element | null, nome: string, padrao: number): number {
  if (!alvo || typeof window === "undefined" || typeof window.getComputedStyle !== "function") {
    return padrao;
  }
  const bruto = window.getComputedStyle(alvo).getPropertyValue(nome).trim();
  if (!bruto) return padrao;
  if (bruto.endsWith("ms")) {
    const ms = Number.parseFloat(bruto);
    return Number.isFinite(ms) ? ms : padrao;
  }
  if (bruto.endsWith("s")) {
    const s = Number.parseFloat(bruto);
    return Number.isFinite(s) ? s * 1000 : padrao;
  }
  const n = Number.parseFloat(bruto);
  return Number.isFinite(n) ? n : padrao;
}

/* ───────────────────────────────────────────────────────────────────────────
   IntersectionObserver — uma vez só, e FAIL-OPEN.
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcObservarOpcoes {
  threshold?: number | number[];
  rootMargin?: string;
  /** `false` mantém o observer vivo (útil para o CTA fixo, que some e volta). */
  umaVez?: boolean;
}

/**
 * Observa `alvo` e chama `aoEntrar` quando ele aparece. Devolve a função de
 * limpeza — sempre segura de chamar, mesmo quando nada foi observado.
 *
 * FAIL-OPEN (1): sem `IntersectionObserver` no navegador, `aoEntrar` é chamado na
 * hora. É isso que impede conteúdo preso em `opacity: 0` num navegador velho.
 *
 * FAIL-OPEN (2), acrescentado em 19/Set/26 depois de MEDIR na rota real: com
 * `umaVez`, «já passou por cima» também conta como «apareceu».
 *
 * O defeito que isso conserta: o IntersectionObserver entrega no máximo UMA entrada
 * por alvo por callback, com o estado do momento da ENTREGA. Num rolar rápido — o
 * flick de polegar, que é como o dono de barbearia lê no celular — o elemento entra e
 * sai da tela dentro do mesmo quadro, e a entrega chega com `isIntersecting: false` e
 * o elemento já acima da janela. O bloco ficava preso em `opacity: .001` PARA SEMPRE,
 * porque a entrada é `once` e nunca mais haveria callback.
 *
 * Medido na `/projeto-do-clube/clube-manual`, 390×844, rolando a página inteira:
 * passo de 120 ms deixava 53 de 63 blocos invisíveis; passo de 150 ms deixava 1.
 * Ou seja: a página FUNCIONAVA ou não conforme a velocidade do dedo. Numa página de
 * tráfego pago, conteúdo invisível não é degradação — é o argumento inteiro sumindo
 * entre o anúncio e o formulário.
 *
 * `umaVez: false` (quem precisa saber entrar E sair, como um CTA que some e volta)
 * continua na intersecção estrita.
 */
export function observarUmaVez(
  alvo: Element | null,
  aoEntrar: (entrada: IntersectionObserverEntry | null) => void,
  opcoes: PcObservarOpcoes = {},
): () => void {
  if (!alvo) return () => {};

  const { threshold = PC_MOVIMENTO.threshold, rootMargin = PC_MOVIMENTO.rootMargin, umaVez = true } = opcoes;

  if (typeof window === "undefined" || typeof window.IntersectionObserver !== "function") {
    aoEntrar(null);
    return () => {};
  }

  // ── REDE DE SEGURANÇA (ver `registrarVarredura`) ────────────────────────────
  // O observer sozinho NÃO basta: com `threshold: 0`, um elemento que sai de «abaixo
  // da janela» (ratio 0) para «acima da janela» (ratio 0) dentro do mesmo quadro
  // nunca CRUZA o limiar, e o navegador pode não entregar callback nenhum. Medido:
  // flick de 16 ms por tela deixava 17 blocos presos, e nenhum deles voltaria mais,
  // porque a entrada é `once`. A varredura resolve pelo fato, não pelo evento.
  let jaChamou = false;
  const chamarUmaVez = (entrada: IntersectionObserverEntry | null) => {
    if (jaChamou) return;
    jaChamou = true;
    aoEntrar(entrada);
  };

  const pararVarredura = umaVez
    ? registrarVarredura(alvo, () => {
        chamarUmaVez(null);
        observador.disconnect();
        pararVarredura();
      })
    : () => {};

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        // «Passou por cima» = o elemento inteiro ficou ACIMA da janela. Só vale
        // quando a revelação é `once`: aí não existe estado a preservar, só o de
        // ter aparecido. `bottom <= 0` é a leitura literal disso, e nunca é
        // verdadeira para elemento que ainda vem abaixo da dobra.
        const passouPorCima = umaVez && entrada.boundingClientRect.bottom <= 0;
        if (!entrada.isIntersecting && !passouPorCima) continue;
        if (umaVez) {
          chamarUmaVez(entrada);
          observador.disconnect();
          pararVarredura();
        } else {
          aoEntrar(entrada);
        }
      }
    },
    { threshold, rootMargin },
  );

  observador.observe(alvo);
  return () => {
    observador.disconnect();
    pararVarredura();
  };
}

/* ───────────────────────────────────────────────────────────────────────────
   A VARREDURA — uma rede só, para todos os alvos `once` da página.
   ───────────────────────────────────────────────────────────────────────────
   Por que existe: ver o comentário em `observarUmaVez`. O IntersectionObserver é
   um observador de EVENTO (o cruzamento); a varredura olha o FATO (onde o elemento
   está agora). Quando o evento não acontece, o fato continua verdadeiro.

   Custo: UM listener de `scroll` passivo e um de `resize` para a página inteira,
   com throttle de quadro, e os dois se removem sozinhos quando o último alvo é
   revelado. Numa página longa isso é dezenas de vezes mais barato do que um
   listener por bloco — e ordens de grandeza mais barato do que o argumento da
   página sumir entre o anúncio e o formulário.
   ─────────────────────────────────────────────────────────────────────────── */

interface AlvoDeVarredura {
  alvo: Element;
  revelar: () => void;
}

const pendentes = new Set<AlvoDeVarredura>();
let quadroAgendado = false;
let escutando = false;

function varrer(): void {
  quadroAgendado = false;
  for (const item of Array.from(pendentes)) {
    const caixa = item.alvo.getBoundingClientRect();
    const altura = window.innerHeight || document.documentElement.clientHeight || 0;
    // Está na tela AGORA, ou já ficou para trás (rolagem rápida passou por cima).
    if (caixa.bottom <= 0 || (caixa.top < altura && caixa.bottom > 0)) {
      pendentes.delete(item);
      item.revelar();
    }
  }
  if (pendentes.size === 0) pararDeEscutar();
}

function agendarVarredura(): void {
  if (quadroAgendado) return;
  quadroAgendado = true;
  requestAnimationFrame(varrer);
}

function pararDeEscutar(): void {
  if (!escutando) return;
  escutando = false;
  window.removeEventListener("scroll", agendarVarredura);
  window.removeEventListener("resize", agendarVarredura);
}

function comecarAEscutar(): void {
  if (escutando) return;
  escutando = true;
  window.addEventListener("scroll", agendarVarredura, { passive: true });
  window.addEventListener("resize", agendarVarredura, { passive: true });
}

/** Põe `alvo` na varredura e devolve como tirá-lo. Sem janela, não faz nada. */
function registrarVarredura(alvo: Element, revelar: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const item: AlvoDeVarredura = { alvo, revelar };
  pendentes.add(item);
  comecarAEscutar();
  return () => {
    pendentes.delete(item);
    if (pendentes.size === 0) pararDeEscutar();
  };
}

/** `true` se o elemento já está dentro da janela agora (antes de qualquer observer). */
export function jaEstaNaTela(alvo: Element | null, folgaPx = 0): boolean {
  if (!alvo || typeof window === "undefined" || typeof alvo.getBoundingClientRect !== "function") {
    return false;
  }
  const caixa = alvo.getBoundingClientRect();
  const altura = window.innerHeight || document.documentElement.clientHeight || 0;
  const largura = window.innerWidth || document.documentElement.clientWidth || 0;
  return caixa.top < altura - folgaPx && caixa.bottom > 0 && caixa.left < largura && caixa.right > 0;
}

/* ───────────────────────────────────────────────────────────────────────────
   Web Animations API — a sequência do `PcMecanismo` (M3).
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcPassoAnim {
  alvo: Element;
  keyframes: Keyframe[];
  opcoes: KeyframeAnimationOptions;
}

function duracaoEmMs(valor: KeyframeAnimationOptions["duration"]): number {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : 0;
}

function atrasoEmMs(valor: KeyframeAnimationOptions["delay"]): number {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : 0;
}

function marcarWillChange(alvo: Element, animacao: Animation): void {
  const estilo = (alvo as HTMLElement).style;
  if (!estilo) return;
  estilo.willChange = "transform, opacity";
  const limpar = () => {
    estilo.willChange = "";
  };
  animacao.addEventListener("finish", limpar, { once: true });
  animacao.addEventListener("cancel", limpar, { once: true });
}

/**
 * Toca os passos EM SEQUÊNCIA: cada um começa quando o anterior termina, sem
 * `setTimeout` encadeado (o relógio é o do compositor, então a sequência
 * sobrevive a aba em segundo plano e a scroll pesado).
 *
 * O `delay` que vier em `opcoes` é somado ao acumulado — serve como respiro
 * entre passos. `fill: "both"` é o padrão, para o elemento segurar o estado
 * final quando a animação acaba.
 *
 * Devolve as `Animation` criadas: quem chamou pausa, retoma (botão «Pausar»),
 * `cancel()` na limpeza do efeito, ou usa `.finished` para encadear.
 */
export function animarSequencia(
  passos: PcPassoAnim[],
  opcoes: { reduzido?: boolean } = {},
): Animation[] {
  if (opcoes.reduzido) {
    aplicarEstadoFinal(passos);
    return [];
  }

  const animacoes: Animation[] = [];
  let acumulado = 0;

  for (const passo of passos) {
    const atrasoProprio = atrasoEmMs(passo.opcoes.delay);
    const duracao = duracaoEmMs(passo.opcoes.duration);

    if (typeof passo.alvo.animate !== "function") {
      acumulado += atrasoProprio + duracao;
      continue;
    }

    const animacao = passo.alvo.animate(passo.keyframes, {
      fill: "both",
      easing: PC_MOVIMENTO.easeSaida,
      ...passo.opcoes,
      delay: acumulado + atrasoProprio,
    });

    marcarWillChange(passo.alvo, animacao);
    animacoes.push(animacao);
    acumulado += atrasoProprio + duracao;
  }

  return animacoes;
}

/**
 * Pinta direto o ÚLTIMO keyframe de cada passo, sem movimento nenhum.
 * É o que roda com `prefers-reduced-motion: reduce`: a pessoa vê o resultado
 * do mecanismo, que é o que prova a promessa — só não vê a transição.
 */
export function aplicarEstadoFinal(passos: PcPassoAnim[]): void {
  for (const passo of passos) {
    const ultimo = passo.keyframes[passo.keyframes.length - 1];
    if (!ultimo) continue;

    if (typeof passo.alvo.animate === "function") {
      passo.alvo.animate([ultimo], { duration: 0, fill: "both" });
      continue;
    }

    const estilo = (passo.alvo as HTMLElement).style;
    if (!estilo) continue;
    for (const [chave, valor] of Object.entries(ultimo)) {
      if (chave === "offset" || chave === "easing" || chave === "composite") continue;
      if (valor === null || valor === undefined) continue;
      estilo.setProperty(chave.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), String(valor));
    }
  }
}

/** Cancela um lote de animações sem explodir se alguma já morreu. */
export function cancelarAnimacoes(animacoes: Animation[]): void {
  for (const animacao of animacoes) {
    try {
      animacao.cancel();
    } catch {
      /* a animação já tinha terminado ou sido descartada — nada a fazer */
    }
  }
}
