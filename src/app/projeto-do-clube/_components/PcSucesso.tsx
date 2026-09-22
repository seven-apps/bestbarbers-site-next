"use client";

/**
 * SUCESSO — o estado do pedido aceito, DENTRO da página.
 *
 * Três regras que este componente existe para cumprir:
 *
 * 1. **Zero evento de pixel.** `Lead`, `QualifiedLead`, `QualifiedLead60` (e o
 *    `LeadComEquipe` que está entrando) são disparados pelo `useLeadForm`, uma
 *    vez, com `eventId` pareado entre Pixel e CAPI. Refazer qualquer um aqui
 *    duplicaria a série — foi exatamente assim que o `trackCompleteRegistration`
 *    inflou a leitura em 50% antes de ser removido (910a080). Este componente
 *    pinta; não mede.
 *
 * 2. **Só aparece depois do aceite gravado.** Ele é renderizado quando o
 *    `submitted` do hook vira `true`, e o hook só faz isso depois que o contato
 *    (ou o card de recadastro) entrou no Ploomes. Cap. 13, literal: «Nunca
 *    mostrar sucesso apenas porque o botão foi pressionado.»
 *
 * 3. **Sem prazo.** O cap. 13 manda mostrar a janela de atendimento real,
 *    obtida da operação, e proíbe prazo fictício. Enquanto a operação não
 *    entregar essa janela, a confirmação diz o que vem a seguir — não quando.
 *
 * Ele é uma ponte, não um destino: o `onSuccess` do formulário navega para
 * `/projeto-do-clube/obrigado`. Este bloco cobre a latência dessa navegação (e
 * segura a confirmação de pé se ela falhar), para ninguém ficar olhando um
 * botão desabilitado sem saber se o pedido foi.
 */

import { useEffect, useRef } from "react";
import estilos from "./PcFormulario.module.css";

/** Cap. 13, seção «Depois de enviar: confirmação não é agendamento». */
const TITULO_PADRAO = "Recebemos seu pedido. Vamos olhar seu clube juntos.";
const APOIO_PADRAO =
  "O próximo passo é confirmar sua situação e apresentar as condições da implantação.";

export interface PcSucessoProps {
  titulo?: string;
  apoio?: string;
  /** Linha discreta de transição. `null` some com ela. */
  nota?: string | null;
  className?: string;
}

export function PcSucesso({
  titulo = TITULO_PADRAO,
  apoio = APOIO_PADRAO,
  nota = "Abrindo a confirmação…",
  className = "",
}: PcSucessoProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // O foco vai para o bloco assim que ele entra: o campo que a pessoa acabou de
  // usar deixou de existir, e sem isto o foco do teclado volta para o começo do
  // documento. `role="status"` + `aria-live="polite"` fazem o leitor de tela
  // anunciar a confirmação sem cortar o que ele estiver lendo.
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className={`${estilos.sucesso} ${className}`}
    >
      <span className={estilos.sucessoSelo} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            className={estilos.sucessoRisco}
            d="M5 12.5 10 17.5 19 7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h3 className={estilos.sucessoTitulo}>{titulo}</h3>
      <p className={estilos.sucessoApoio}>{apoio}</p>
      {nota && <p className={estilos.sucessoNota}>{nota}</p>}
    </div>
  );
}
