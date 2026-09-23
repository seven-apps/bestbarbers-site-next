"use client";

/**
 * PASSO 1 — CONTEXTO (perguntas 5 a 8).
 *
 * A ordem é invertida em relação às LPs antigas de propósito (V7 do contrato de
 * arquitetura): contexto primeiro, contato depois. Duas razões, as duas medidas:
 *
 * 1. A situação do clube chega PRÉ-PREENCHIDA pela rota ou pelo seletor. Se o
 *    contato viesse antes, a pessoa preencheria nome e telefone para só então
 *    descobrir que a página já sabia a resposta da pergunta 7 — e o campo
 *    pré-preenchido perde a função de continuar a conversa que o anúncio abriu.
 * 2. O telefone fica no passo 2, em SEGUNDO lugar: o dedup de background do
 *    `useLeadForm` roda enquanto a pessoa preenche e-mail e barbearia, e chega
 *    pronto no clique. Telefone no passo 1 deixaria o dedup esfriar.
 *
 * Este componente NÃO tem estado. As quatro respostas vivem no `useLeadForm`,
 * via `<PerguntasQualificacao>`, que é a fonte única dos quatro `<select>` em
 * todas as portas da casa. Nenhum `<select>` próprio nasce aqui — opção que
 * existe na tela sem existir na régua de `lead-score.ts` é score que deixa de
 * comparar.
 *
 * As três perguntas que ANULAM o score quando faltam (faturamento, clube e
 * profissionais — `lead-score.ts:105`) são obrigatórias aqui, com as MESMAS
 * mensagens que o submit usaria, vindas de `@/lib/qualificacao`.
 */

import { useEffect, useRef, type ChangeEvent } from "react";
import {
  PerguntasQualificacao,
  type ValoresQualificacao,
} from "@/components/forms/PerguntasQualificacao";
import type { ErrosQualificacao } from "@/lib/qualificacao";
import estilos from "./PcFormulario.module.css";

/**
 * Micro-string criada aqui por ausência de copy aprovada (mesma natureza da
 * pendência P11 do contrato): o comercial revisa, a troca é de uma linha.
 */
const NOTA_SITUACAO_PREENCHIDA =
  "Já marcamos a situação que você escolheu. Se não for bem assim, é só trocar.";

export interface PcPassoContextoProps {
  /** As quatro respostas, direto do `formData` do `useLeadForm`. */
  valores: ValoresQualificacao;
  /** O `handleInputChange` do hook — ele continua o único dono do estado. */
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  /** Qual das quatro está com erro, derivado do `submitError` por comparação exata. */
  erros: ErrosQualificacao;
  /** Situação vinda da rota ou do seletor — usada só para explicar o pré-preenchimento. */
  clubStatusInicial: string;
  aoContinuar: () => void;
  /** Id do `<h3>` do passo — o `<form>` aponta o `aria-labelledby` para ele. */
  tituloId: string;
  /** Erro que não pertence a nenhum dos quatro campos (backend fora, por exemplo). */
  erroGeral?: string | null;
  /** Rótulo do botão. Literal do cap. 13; existe como prop só para o comercial trocar sem PR. */
  rotuloBotao?: string;
  /**
   * Título do passo. Vem de `PC_ROTULO_CONTEXTO[situacao]` — quem chega de um
   * anúncio de pré-abertura não pode ser recebido com «Como está seu clube
   * hoje?», porque ele ainda não tem clube. O padrão mantém o texto de antes
   * para qualquer consumidor que não passe a situação.
   */
  titulo?: string;
  /** Some da tela, fica para leitor de tela e como alvo do foco (`sr-only`). */
  tituloOculto?: boolean;
  /** True quando o passo entrou por troca (e não na primeira pintura): só aí anima. */
  animar?: boolean;
}

export function PcPassoContexto({
  valores,
  onChange,
  erros,
  clubStatusInicial,
  aoContinuar,
  tituloId,
  erroGeral = null,
  rotuloBotao = "Continuar para pedir contato",
  titulo = "Como está seu clube hoje?",
  tituloOculto = false,
  animar = false,
}: PcPassoContextoProps) {
  const tituloRef = useRef<HTMLHeadingElement | null>(null);

  // Foco no título ao VOLTAR para este passo. Leitor de tela anuncia o passo
  // novo e o teclado não cai no fim da página. Programático: `:focus-visible`
  // não dispara, então nenhum anel aparece para quem usa mouse.
  useEffect(() => {
    if (animar) tituloRef.current?.focus();
  }, [animar]);

  const temAlgumErroDeCampo =
    Boolean(erros.monthlyRevenue) ||
    Boolean(erros.currentSystem) ||
    Boolean(erros.clubStatus) ||
    Boolean(erros.employeeCount);

  // A situação só é "herdada" enquanto ninguém a trocou. Depois da troca a nota
  // sai da tela — ela explica o pré-preenchimento, não decora o campo.
  const situacaoHerdada =
    Boolean(clubStatusInicial) && valores.clubStatus === clubStatusInicial;

  return (
    <div className={`${estilos.passo} ${animar ? estilos.passoEntraAtras : ""}`}>
      <h3 id={tituloId} ref={tituloRef} tabIndex={-1} className={tituloOculto ? "sr-only" : estilos.passoTitulo}>
        {titulo}
      </h3>

      {situacaoHerdada && <p className={estilos.notaSituacao}>{NOTA_SITUACAO_PREENCHIDA}</p>}

      <PerguntasQualificacao
        valores={valores}
        onChange={onChange}
        erros={erros}
        variante="claro"
        className={estilos.campos}
      />

      {/*
        Erro que não é de campo (backend fora). Os erros das quatro perguntas
        aparecem SOB cada `<select>`, dentro do `<PerguntasQualificacao>` — erro
        no topo do cartão some atrás da navbar fixa no mobile.
      */}
      {erroGeral && !temAlgumErroDeCampo && (
        <div className={estilos.erroGeral} role="alert">
          <p className={estilos.erroGeralTexto}>{erroGeral}</p>
        </div>
      )}

      <div className={estilos.acoes}>
        {/*
          `type="button"`: este botão AVANÇA, não envia. A tecla Enter dentro do
          passo 1 também avança — quem trata isso é o `onSubmit` do `<form>` no
          `PcFormulario`, que desvia para cá enquanto o passo for 1. Sem esse
          desvio, o Enter dispararia o submit de um formulário sem contato.
        */}
        <button type="button" onClick={aoContinuar} className={estilos.botaoAcao}>
          {rotuloBotao}
        </button>
      </div>

      {/*
        Cap. 13, literal: «Preencher contexto não cria pedido comercial nem
        dispara contato.» É a promessa que sustenta pedir as quatro perguntas
        antes do telefone.
      */}
      <p className={estilos.microcopy}>
        Preencher contexto não cria pedido comercial nem dispara contato.
      </p>
    </div>
  );
}
