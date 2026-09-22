"use client";

/**
 * PROJETO DO CLUBE — rodapé da família (B8).
 *
 * Cap. 13: «Rodapé: identificação da empresa, privacidade e condições.»
 *
 * A REGRA QUE DESENHOU ESTE RODAPÉ: nenhum link tira o lead da página antes de
 * ele converter. Na prática:
 *
 *   · a marca NÃO é link (o rodapé do site leva para a home; aqui isso seria uma
 *     saída da campanha no lugar mais barato de sair);
 *   · privacidade e termos abrem em aba nova (`target="_blank"`), o mesmo padrão
 *     do `AvisoPrivacidade` — a página continua aberta atrás;
 *   · condições é rota da própria família e leva a search inteira junto
 *     (`hrefCondicoes` vem de `pc-link`);
 *   · não há Instagram, WhatsApp, blog, menu do site nem «conheça a BestBarbers».
 *
 * CONTATO. O canal de contato desta página é o formulário dela — por isso a ação
 * do rodapé é uma âncora de volta ao `#pc-formulario`, e não um `mailto:`, que
 * abriria o cliente de e-mail e levaria a pessoa embora. O endereço aparece como
 * TEXTO (não link), porque identificação é obrigação e é o mesmo endereço já
 * publicado na Política de Privacidade — nada novo foi inventado aqui.
 *
 * O MESMO rodapé serve `/condicoes` e `/obrigado`, que não têm formulário. Por
 * isso a âncora de contato só nasce quando o alvo existe DE VERDADE na página
 * (consulta no `document` depois do mount): botão morto é pior do que botão
 * ausente. O resto do rodapé — marca, contato, links e direitos — não depende de
 * JS nenhum e aparece igual com o script fora do ar (V6).
 *
 * As micro-strings deste arquivo (rótulos dos links e direitos) são criação de
 * construção por ausência de copy aprovada — §8/P11 registra a revisão.
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROTA_POLITICA_PRIVACIDADE } from "@/components/forms/AvisoPrivacidade";
import { PcRevelar } from "./PcRevelar";
import estilos from "./pc-fundo.module.css";

/** Publicado na Política de Privacidade do próprio site — fato, não invenção. */
const CONTATO_PUBLICO = "help@bestbarbers.app";

const ROTA_TERMOS = "/termos-de-uso";

export interface PcRodapeProps {
  /** Link para `/projeto-do-clube/condicoes`, com a search colada (`pc-link`). */
  hrefCondicoes: string;
  /** Id da seção do formulário — o destino da âncora de contato. */
  alvoFormularioId?: string;
  aoPedirContato?: () => void;
  aoAbrirCondicoes?: () => void;
}

export function PcRodape({
  hrefCondicoes,
  alvoFormularioId = "pc-formulario",
  aoPedirContato,
  aoAbrirCondicoes,
}: PcRodapeProps) {
  // A âncora de contato só existe onde o formulário existe. `/condicoes` e
  // `/obrigado` usam este mesmo rodapé e não têm `#pc-formulario`.
  const [temFormulario, setTemFormulario] = useState(false);
  useEffect(() => {
    setTemFormulario(document.getElementById(alvoFormularioId) !== null);
  }, [alvoFormularioId]);

  return (
    <footer className={estilos.rodape}>
      <PcRevelar className={estilos.rodapeInterno}>
        <div className={estilos.rodapeTopo}>
          <div className={estilos.rodapeMarca}>
            {/* A marca não é link: sair daqui para a home é sair da campanha. */}
            <Image
              src="/images/Logo-BestBarbers-branco_1.webp"
              alt="BestBarbers"
              width={264}
              height={66}
              className={estilos.rodapeLogo}
              loading="lazy"
              sizes="132px"
            />
            <p className={estilos.rodapeContato}>Contato: {CONTATO_PUBLICO}</p>
          </div>

          <div className={estilos.rodapeAcoes}>
            {temFormulario ? (
              <a
                href={`#${alvoFormularioId}`}
                className={estilos.rodapeChamada}
                onClick={aoPedirContato}
              >
                Falar com o time
              </a>
            ) : null}

            <ul className={estilos.rodapeLinks}>
              <li>
                <Link
                  href={hrefCondicoes}
                  className={estilos.rodapeLink}
                  onClick={aoAbrirCondicoes}
                >
                  Investimento e condições
                </Link>
              </li>
              <li>
                <Link
                  href={ROTA_POLITICA_PRIVACIDADE}
                  className={estilos.rodapeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href={ROTA_TERMOS}
                  className={estilos.rodapeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={estilos.rodapeBase}>
          <p className={estilos.rodapeDireitos}>
            © {new Date().getFullYear()} BestBarbers · Todos os direitos reservados
          </p>
        </div>
      </PcRevelar>
    </footer>
  );
}
