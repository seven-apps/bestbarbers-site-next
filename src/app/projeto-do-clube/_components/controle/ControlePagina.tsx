"use client";

/**
 * ORQUESTRADOR DO CONTROLE.
 *
 * O controle é o braço de comparação: a oferta ATUAL da BestBarbers («o produto»),
 * saneada, medida com o MESMO formulário, o MESMO rastreio e a MESMA qualidade de
 * construção do «projeto do clube». Se ele perder por ser feio ou por converter com
 * outro formulário, a leitura não vale nada — então tudo que não é a MENSAGEM é
 * deliberadamente idêntico:
 *
 * - Mesmo cabeçalho (`PcCabecalho`) e mesmo rodapé (`PcRodape`).
 * - Mesmo formulário (`PcFormulario` → `useLeadForm`): pixel, CAPI, score, dedup,
 *   card no Ploomes. Nenhum campo a mais, nenhum a menos.
 * - Mesmo vocabulário de movimento (`PcRevelar`, `PcNumero`, WAAPI).
 * - Mesma posição do formulário na página (depois das condições, antes do FAQ). Na
 *   /v12 o formulário vem logo após o herói; manter aquela posição aqui misturaria
 *   duas variáveis — mensagem E lugar do pedido — na mesma leitura.
 * - Mesmos eventos de §2.5 da arquitetura, com os mesmos nomes e parâmetros.
 *
 * O que muda de propósito: `source` (`lp_controle_produto`) e o `originDesc`
 * (`[Projeto-Clube]Controle-Produto`) — é por eles que a leitura separa este braço.
 */

import { useCallback, useEffect } from "react";
import { PcCabecalho } from "../PcCabecalho";
import { PcCtaFixo } from "../PcCtaFixo";
import { PcFormulario } from "../PcFormulario";
import { PcRodape } from "../PcRodape";
import { usePcMovimentoReduzido } from "../pc-motion";
import { usePcEventos } from "../pc-eventos";
import { usePcHref } from "../pc-link";
import { ControleCondicoes } from "./ControleCondicoes";
import { ControleFaq } from "./ControleFaq";
import { ControleHeroi } from "./ControleHeroi";
import { ControleMecanismo } from "./ControleMecanismo";
import { ControleModulos } from "./ControleModulos";
import { ControleNumeros } from "./ControleNumeros";
import { ControlePonte } from "./ControlePonte";
import {
  CONTROLE_CONFIG,
  CONTROLE_CTA_FIXO,
  CONTROLE_FORMULARIO,
} from "./controle-copy";

/** Âncora do formulário — é o id que o `PcFormulario` da família já usa. */
const ID_FORMULARIO = "pc-formulario";

export function ControlePagina() {
  const eventos = usePcEventos(CONTROLE_CONFIG);
  const hrefCondicoes = usePcHref("/projeto-do-clube/condicoes");
  const movimentoReduzido = usePcMovimentoReduzido();

  // ViewContent, uma vez por carga. A guarda anti-repetição mora num `Set` de módulo
  // dentro do `usePcEventos` — por isso este efeito pode rodar de novo sem duplicar.
  useEffect(() => {
    eventos.viewContent();
  }, [eventos]);

  const irParaFormulario = useCallback(() => {
    if (typeof document === "undefined") return;
    document.getElementById(ID_FORMULARIO)?.scrollIntoView({
      behavior: movimentoReduzido ? "auto" : "smooth",
      block: "start",
    });
  }, [movimentoReduzido]);

  // `condicoes_abertas` com `antes_do_form: true` — todo link de condições desta página
  // está acima do formulário, e essa é justamente a informação que interessa medir.
  const registrarCondicoes = useCallback(() => {
    eventos.condicoesAbertas("bloco");
  }, [eventos]);

  const registrarDemonstracao = useCallback(() => {
    eventos.demoAberta("produto-agenda-dia");
  }, [eventos]);

  return (
    <>
      <PcCabecalho aoPedirContato={irParaFormulario} hrefCondicoes={hrefCondicoes} />

      <main>
        <ControleHeroi
          hrefCondicoes={hrefCondicoes}
          aoPedirContato={irParaFormulario}
          aoVerCondicoes={registrarCondicoes}
        />

        <ControleNumeros />

        <ControleModulos />

        <ControleMecanismo aoRodar={registrarDemonstracao} />

        <ControleCondicoes
          hrefCondicoes={hrefCondicoes}
          aoAbrirCondicoes={registrarCondicoes}
        />

        <ControlePonte aoPedirContato={irParaFormulario} />

        <PcFormulario
          config={CONTROLE_CONFIG}
          tituloSecao={CONTROLE_FORMULARIO.titulo}
          apoioSecao={CONTROLE_FORMULARIO.apoio}
          clubStatusInicial={CONTROLE_FORMULARIO.clubStatusInicial}
        />

        <ControleFaq />
      </main>

      <PcRodape hrefCondicoes={hrefCondicoes} />

      <PcCtaFixo
        rotulo={CONTROLE_CTA_FIXO}
        alvoId={ID_FORMULARIO}
        aoClicar={irParaFormulario}
      />
    </>
  );
}
