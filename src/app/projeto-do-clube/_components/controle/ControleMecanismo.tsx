"use client";

/**
 * MECANISMO DO PRODUTO — a demonstração animada do controle (movimento M3).
 *
 * O que ela mostra: o caminho real do dinheiro dentro do sistema, em quatro passos —
 * o cliente marca → o atendimento entra no caixa com a comissão → a assinatura é
 * cobrada no cartão → a nota de serviço é emitida. É o mecanismo do produto, não uma
 * vitrine de habilidade de quem construiu a página.
 *
 * Como ela é feita, e por quê:
 * - **Web Animations API pelo `animarSequencia` da família**, não biblioteca de animação.
 *   `framer-motion` puxaria a biblioteca inteira para o bundle da rota por causa de uma
 *   sequência de quatro passos. O atraso de cada passo vai explícito em `opcoes.delay`.
 * - **`IntersectionObserver` com `WeakSet` de módulo**: dispara uma vez por elemento,
 *   sobrevive a re-render e não vaza referência.
 * - **Nasce no estado final.** As camadas e os passos são renderizados VISÍVEIS; quem
 *   os esconde é a animação (`fill: "both"` aplica o keyframe inicial só depois que o
 *   JS assume). Sem JS, a pessoa vê o último quadro e lê os quatro passos.
 * - **`prefers-reduced-motion`**: nenhuma animação é criada. O bloco fica no estado
 *   final, com os quatro passos legíveis.
 * - Só `opacity` e `transform` animam. Nada de `width`, `height`, `top`, `left`.
 *
 * Controles: «Ver de novo» e «Pausar» — requisito de aceite do movimento M3. Toque no
 * palco também repete (é como a pessoa interage no celular).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { animarSequencia, usePcMovimentoReduzido } from "../pc-motion";
import { ControleArtefato } from "./ControleArtefato";
import { CONTROLE_MECANISMO } from "./controle-copy";
import estilos from "./controle.module.css";

/** Artefato de cada passo. Todos placeholder hoje — a troca é um diff de uma linha. */
const CAMADAS = [
  // TODO(asset): produto-agenda-dia — agenda do dia por profissional
  { artefatoId: "produto-agenda-dia", proporcao: "4/3" },
  // TODO(asset): clube-extrato-comissao — extrato de comissão por profissional
  { artefatoId: "clube-extrato-comissao", proporcao: "4/3" },
  // TODO(asset): clube-cobranca — cobrança de um assinante no clube
  { artefatoId: "clube-cobranca", proporcao: "4/3" },
  // TODO(asset): nfse-emitida — nota de serviço emitida a partir do atendimento
  { artefatoId: "nfse-emitida", proporcao: "4/3" },
];

/**
 * Guarda anti-repetição no escopo do MÓDULO (não `useRef`): o observer roda uma vez
 * por elemento, mesmo que o React remonte o componente.
 */
const jaRodou = new WeakSet<Element>();

/** Duração de cada passo — espelha `--pc-dur-4` (700ms) do token. */
const DURACAO_PASSO = 700;

interface ControleMecanismoProps {
  /**
   * Chamado quando a demonstração entra em cena — vira o evento `clube_demo_aberta`.
   * Dispara mesmo com movimento reduzido: o que se mede é «a pessoa chegou ao
   * mecanismo», não «a animação rodou».
   */
  aoRodar?: () => void;
}

export function ControleMecanismo({ aoRodar }: ControleMecanismoProps) {
  const movimentoReduzido = usePcMovimentoReduzido();
  const palcoRef = useRef<HTMLDivElement | null>(null);
  const camadasRef = useRef<Array<HTMLDivElement | null>>([]);
  const passosRef = useRef<Array<HTMLLIElement | null>>([]);
  const animacoesRef = useRef<Animation[]>([]);
  const [pausado, setPausado] = useState(false);
  const [podeControlar, setPodeControlar] = useState(false);

  /**
   * Espelho do movimento reduzido em ref. O `IntersectionObserver` é assíncrono: sem o
   * ref, o callback leria o valor do render em que o observer foi criado — e
   * `usePcMovimentoReduzido` só conhece a preferência depois do mount. O ref é sempre
   * o valor de agora.
   */
  const reduzidoRef = useRef(movimentoReduzido);
  reduzidoRef.current = movimentoReduzido;

  /** Monta a sequência. Devolve `false` quando não há o que animar. */
  const montarSequencia = useCallback((): boolean => {
    if (reduzidoRef.current) return false;
    if (typeof Element === "undefined" || typeof Element.prototype.animate !== "function") {
      return false;
    }

    animacoesRef.current.forEach((a) => a.cancel());

    const opcoesDoPasso = (i: number): KeyframeAnimationOptions => ({
      duration: DURACAO_PASSO,
      delay: i * DURACAO_PASSO,
      fill: "both",
      easing: "cubic-bezier(.22,.61,.36,1)",
    });

    const passos: Array<{
      alvo: Element;
      keyframes: Keyframe[];
      opcoes: KeyframeAnimationOptions;
    }> = [];

    CAMADAS.forEach((_, i) => {
      const camada = camadasRef.current[i];
      if (camada) {
        passos.push({
          alvo: camada,
          keyframes: [
            { opacity: 0, transform: "translateY(14px) scale(0.985)" },
            { opacity: 1, transform: "none" },
          ],
          opcoes: opcoesDoPasso(i),
        });
      }

      const passo = passosRef.current[i];
      if (passo) {
        passos.push({
          alvo: passo,
          keyframes: [
            { opacity: 0.45, transform: "none" },
            { opacity: 1, transform: "translateX(4px)" },
          ],
          opcoes: opcoesDoPasso(i),
        });
      }
    });

    if (passos.length === 0) return false;

    animacoesRef.current = animarSequencia(passos);
    return animacoesRef.current.length > 0;
  }, []);

  // Dispara quando o bloco entra na tela. `threshold: 0` — o threshold é fração do
  // ELEMENTO, e um bloco mais alto que a viewport nunca chegaria a 0.3.
  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          if (jaRodou.has(entrada.target)) return;
          jaRodou.add(entrada.target);
          aoRodar?.();
          if (montarSequencia()) setPodeControlar(true);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(palco);
    return () => observer.disconnect();
  }, [aoRodar, montarSequencia]);

  // Cancela o que ficou rodando ao desmontar — animação órfã é vazamento.
  // A leitura do ref acontece DENTRO do cleanup de propósito: no momento da limpeza é
  // que se sabe quais animações existem (copiar o array no mount cancelaria um array vazio).
  useEffect(() => {
    return () => {
      animacoesRef.current.forEach((a) => a.cancel());
      animacoesRef.current = [];
    };
  }, []);

  // Preferência ligada com a página aberta: leva tudo ao quadro final em vez de deixar
  // a sequência correndo às costas de quem acabou de pedir para nada se mexer.
  useEffect(() => {
    if (!movimentoReduzido) return;
    animacoesRef.current.forEach((a) => a.finish());
    setPodeControlar(false);
    setPausado(false);
  }, [movimentoReduzido]);

  const repetir = useCallback(() => {
    if (reduzidoRef.current) return;
    if (animacoesRef.current.length === 0 && !montarSequencia()) return;
    animacoesRef.current.forEach((a) => {
      a.currentTime = 0;
      a.play();
    });
    setPausado(false);
    setPodeControlar(true);
  }, [montarSequencia]);

  const alternarPausa = useCallback(() => {
    setPausado((estavaPausado) => {
      animacoesRef.current.forEach((a) => (estavaPausado ? a.play() : a.pause()));
      return !estavaPausado;
    });
  }, []);

  return (
    <section
      id="controle-mecanismo"
      style={{
        background: "var(--pc-carvao-fundo)",
        paddingBlock: "var(--pc-secao-y)",
        paddingInline: "var(--pc-secao-x)",
      }}
    >
      <div className={estilos.envelope}>
        <div className={estilos.secaoCabecalho}>
          <span className={estilos.sobretitulo}>Como funciona</span>
          <h2 className={estilos.secaoTitulo}>{CONTROLE_MECANISMO.titulo}</h2>
          <p className={estilos.secaoApoio}>{CONTROLE_MECANISMO.apoio}</p>
        </div>

        <div className={estilos.mecanismoGrade}>
          {/* Palco: as quatro telas empilhadas na mesma célula da grade. A camada de
              cima é a do último passo — por isso só existem fade-ins, sem cross-fade. */}
          {/* O toque no palco repete a sequência — é o gesto do celular (M3). O caminho
              de teclado e de leitor de tela é o botão «Ver de novo», abaixo: nenhuma
              informação depende deste clique. */}
          <div ref={palcoRef} className={estilos.mecanismoPalco} onClick={repetir}>
            <div className={estilos.mecanismoCamadas} style={{ aspectRatio: "4/3" }}>
              {CAMADAS.map((camada, i) => (
                <div
                  key={camada.artefatoId}
                  ref={(el) => {
                    camadasRef.current[i] = el;
                  }}
                  className={estilos.mecanismoCamada}
                  style={{ zIndex: i + 1 }}
                >
                  <ControleArtefato
                    id={camada.artefatoId}
                    tamanhos="(max-width: 960px) 92vw, 480px"
                  />
                </div>
              ))}
            </div>
            <p className={estilos.mecanismoLegenda}>{CONTROLE_MECANISMO.legenda}</p>
          </div>

          <div>
            <ol className={estilos.mecanismoPassos}>
              {CONTROLE_MECANISMO.passos.map((passo, i) => (
                <li
                  key={passo.rotulo}
                  ref={(el) => {
                    passosRef.current[i] = el;
                  }}
                  className={estilos.passo}
                >
                  <span className={estilos.passoRotulo}>{passo.rotulo}</span>
                  <p className={estilos.passoTexto}>{passo.texto}</p>
                </li>
              ))}
            </ol>

            {podeControlar && !movimentoReduzido && (
              <div className={estilos.mecanismoControles}>
                <button type="button" className={estilos.botaoGhost} onClick={repetir}>
                  {CONTROLE_MECANISMO.botaoRepetir}
                </button>
                <button type="button" className={estilos.botaoGhost} onClick={alternarPausa}>
                  {pausado ? CONTROLE_MECANISMO.botaoRetomar : CONTROLE_MECANISMO.botaoPausar}
                </button>
              </div>
            )}

            <p className={estilos.mecanismoRessalva}>{CONTROLE_MECANISMO.ressalva}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
