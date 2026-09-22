"use client";

/**
 * OS QUATRO BLOCOS DE TEXTO da ordem de §2.2 que não tinham arquivo:
 * `PcExemplo`, `PcConversaEntrega`, `PcCondicoes` e `PcPonte`.
 *
 * Estão juntos num arquivo só porque são a MESMA coisa três vezes — rótulo, título,
 * um parágrafo literal e, em dois deles, um link ou um botão. Quatro arquivos de vinte
 * linhas para repetir a mesma estrutura seria cerimônia, não arquitetura. Cada um
 * exporta o seu nome contratado, então o import continua sendo o de §2.4.
 *
 * NENHUM texto nasce aqui. Tudo entra por prop, e o consumidor (`PcPagina`) passa
 * `PC_BLOCOS` e a peça. Trocar copy aprovada é editar `pc-copy.ts`, nunca este arquivo.
 */

import type { ReactNode } from "react";
import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import { PcArtefato } from "./PcArtefato";
import type { PcArtefatoId } from "./pc.types";

/* ───────────────────────────────────────────────────────────────────────────
   Casca comum: rótulo + título + texto, com o movimento da família.
   ─────────────────────────────────────────────────────────────────────────── */

interface CascaProps {
  id?: string;
  rotulo: string;
  titulo: string;
  texto: string;
  fundo?: "carvao" | "papel" | "carvao-fundo";
  medida?: "padrao" | "texto" | "cheia";
  className?: string;
  children?: ReactNode;
}

function Casca({
  id,
  rotulo,
  titulo,
  texto,
  fundo = "papel",
  medida = "texto",
  className,
  children,
}: CascaProps) {
  return (
    <PcSecao id={id} fundo={fundo} medida={medida} className={className}>
      <PcRevelar>
        <p className="pc-rotulo">{rotulo}</p>
        <h2 className="pc-titulo pc-titulo--2">{titulo}</h2>
      </PcRevelar>
      <PcRevelar atraso={80}>
        {/* `texto` vazio é caso legítimo, não erro: o `PcPonte` suprime o parágrafo
            quando a ponte efetiva é «Como segue a conversa», porque o bloco
            `PcComoFunciona`, logo acima, já contou os mesmos quatro passos. Dizer a
            mesma coisa duas vezes na mesma rolagem não reforça — cansa. */}
        {texto ? <p className="pc-texto pc-texto--grande">{texto}</p> : null}
        {children}
      </PcRevelar>
    </PcSecao>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   PcExemplo — o exemplo operacional da PEÇA do anúncio (§2.2).
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcExemploProps {
  /** `peca.exemploTitulo` — literal do acervo. */
  titulo: string;
  /** `peca.exemploTexto` — literal do acervo. */
  texto: string;
  /** Quando a peça exige uma captura, ela entra aqui. Placeholder não trava. */
  artefatoId?: PcArtefatoId;
  id?: string;
  className?: string;
}

export function PcExemplo({
  titulo,
  texto,
  artefatoId,
  id = "pc-exemplo",
  className,
}: PcExemploProps) {
  return (
    <Casca
      id={id}
      rotulo="O seu caso"
      titulo={titulo}
      texto={texto}
      fundo="papel"
      medida={artefatoId ? "padrao" : "texto"}
      className={className}
    >
      {artefatoId ? (
        <div style={{ marginTop: 24, maxWidth: 560 }}>
          <PcArtefato id={artefatoId} />
        </div>
      ) : null}
    </Casca>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   PcConversaEntrega — o que a conversa entrega (literal do cap. 13).
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcConversaEntregaProps {
  titulo: string;
  texto: string;
  id?: string;
  className?: string;
}

export function PcConversaEntrega({
  titulo,
  texto,
  id = "pc-conversa",
  className,
}: PcConversaEntregaProps) {
  return (
    <Casca
      id={id}
      rotulo="A conversa"
      titulo={titulo}
      texto={texto}
      fundo="carvao"
      className={className}
    >
      {/*
        A ficha é construída NA REUNIÃO. O cap. 13 é explícito: «não é um diagnóstico
        automático liberado pelo cadastro». A frase abaixo existe para a página não
        deixar no ar a leitura de que preencher o formulário entrega um relatório.
      */}
      <p className="pc-texto pc-texto--suave" style={{ marginTop: 16 }}>
        A recomendação é construída na conversa com o time, não gerada pelo cadastro.
      </p>
    </Casca>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   PcCondicoes — investimento e condições, ABERTO, antes do formulário.
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcCondicoesProps {
  /** `PC_BLOCOS.condicoes.titulo`. */
  titulo: string;
  /** `PC_BLOCOS.condicoes.texto` — 100/100 ocorrências no acervo. */
  texto: string;
  /** Link para `/projeto-do-clube/condicoes`, já com a search colada (`pc-link`). */
  hrefCondicoes: string;
  aoAbrirCondicoes?: () => void;
  id?: string;
  className?: string;
}

export function PcCondicoes({
  titulo,
  texto,
  hrefCondicoes,
  aoAbrirCondicoes,
  id = "pc-condicoes",
  className,
}: PcCondicoesProps) {
  return (
    <Casca
      id={id}
      rotulo="Sem letra miúda"
      titulo={titulo}
      texto={texto}
      fundo="papel"
      className={className}
    >
      <p style={{ marginTop: 20 }}>
        <a
          className="pc-botao pc-botao--fantasma"
          href={hrefCondicoes}
          onClick={() => aoAbrirCondicoes?.()}
        >
          Ver todas as condições
        </a>
      </p>
    </Casca>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   PcPonte — UMA das três pontes, escolhida por `ponteEfetiva()` (guarda V9).
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcPonteProps {
  /** `PC_BLOCOS.pontes[ponteEfetiva(peca)].titulo`. */
  titulo: string;
  /** `PC_BLOCOS.pontes[ponteEfetiva(peca)].texto`. */
  texto: string;
  /** `peca.botaoContato` — «Quero conversar sobre meu clube». */
  rotuloBotao: string;
  aoPedirContato: () => void;
  id?: string;
  className?: string;
}

export function PcPonte({
  titulo,
  texto,
  rotuloBotao,
  aoPedirContato,
  id = "pc-ponte",
  className,
}: PcPonteProps) {
  return (
    <Casca
      id={id}
      rotulo="O próximo passo"
      titulo={titulo}
      texto={texto}
      fundo="carvao-fundo"
      className={className}
    >
      <p style={{ marginTop: 24 }}>
        <button type="button" className="pc-botao pc-botao--ouro pc-botao--g" onClick={aoPedirContato}>
          {rotuloBotao}
        </button>
      </p>
    </Casca>
  );
}
