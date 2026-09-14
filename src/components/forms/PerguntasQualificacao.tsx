"use client";

/**
 * PERGUNTAS 5 a 8 do formulário — faturamento · sistema atual · clube · profissionais.
 *
 * Fonte ÚNICA das quatro perguntas em TODAS as portas (decisão do André, 14/Set/26:
 * o formulário é igual em todo lugar). Antes cada LP carregava a sua cópia dos
 * `<select>`, e as opções derivavam umas das outras até o score deixar de comparar.
 * As opções vêm de `@/lib/lead-score` — o MESMO módulo que pontua —, então uma opção
 * nova nunca pode existir na tela sem existir na régua.
 *
 * As quatro perguntas usam o MESMO seletor (André, 14/Set/26: "quero a pergunta do clube
 * igual os demais seletores"). A versão anterior trazia a 7 em cartões de rádio e foi
 * reprovada por ele. Ressalva que fica registrada: duas opções da 7 começam com a mesma
 * frase ("Já tenho o clube de assinaturas…") e a diferença mora no fim — num `<select>`
 * estreito o fim é o que some. Se isso aparecer na prática, a saída é encurtar o RÓTULO
 * mantendo o valor gravado, nunca voltar ao cartão sem ele pedir.
 *
 * Emite eventos de mudança nativos (`name`/`value`), então o `handleInputChange` do
 * `useLeadForm` continua sendo o único dono do estado.
 */

import { useId, type ChangeEvent, type CSSProperties } from "react";
import {
  CLUBE_OPCOES,
  FATURAMENTO_OPCOES,
  PROFISSIONAIS_OPCOES,
  SISTEMA_OPCOES,
} from "@/lib/lead-score";
import {
  MSG_CLUBE,
  MSG_FATURAMENTO,
  MSG_PROFISSIONAIS,
  MSG_SISTEMA,
  type ErrosQualificacao,
} from "@/lib/qualificacao";

export interface ValoresQualificacao {
  monthlyRevenue: string;
  currentSystem: string;
  clubStatus: string;
  employeeCount: string;
}

/** Cartão branco das LPs (v12, guias, calculadoras) × cartão escuro (modal, /v4, /parceiros). */
export type VarianteQualificacao = "claro" | "escuro";

export interface PerguntasQualificacaoProps {
  valores: ValoresQualificacao;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  erros?: ErrosQualificacao;
  variante?: VarianteQualificacao;
  /** Classe do contêiner — os formulários usam para herdar o espaçamento do `<form>`. */
  className?: string;
}

const TEMA: Record<VarianteQualificacao, {
  rotulo: string;
  ajuda: string;
  fundo: string;
  borda: string;
  texto: string;
  erro: string;
  fundoOpcao: string;
}> = {
  claro: {
    rotulo: "#1e1e1e",
    ajuda: "rgba(30,30,30,0.6)",
    fundo: "#f5f5f5",
    borda: "#e0e0e0",
    texto: "#1e1e1e",
    erro: "#dc2626",
    fundoOpcao: "#ffffff",
  },
  escuro: {
    rotulo: "rgba(255,255,255,0.9)",
    ajuda: "rgba(255,255,255,0.45)",
    fundo: "rgba(255,255,255,0.04)",
    borda: "rgba(255,255,255,0.14)",
    texto: "#ffffff",
    erro: "#f87171",
    fundoOpcao: "#1a1d25",
  },
};

const DOURADO = "#ebad04";
const FONTE = "var(--font-montserrat)";

export function PerguntasQualificacao({
  valores,
  onChange,
  erros = {},
  variante = "claro",
  className = "space-y-4",
}: PerguntasQualificacaoProps) {
  const tema = TEMA[variante];
  const prefixo = useId();

  const estiloRotulo: CSSProperties = {
    color: tema.rotulo,
    fontFamily: FONTE,
  };
  const estiloAjuda: CSSProperties = {
    color: tema.ajuda,
    fontFamily: FONTE,
  };

  const estiloCampo = (temErro: boolean): CSSProperties => ({
    background: tema.fundo,
    border: `1.5px solid ${temErro ? tema.erro : tema.borda}`,
    color: tema.texto,
    fontFamily: FONTE,
  });

  /**
   * FUNÇÃO, não componente: declarar um componente dentro do render faria o React
   * ver um tipo novo a cada tecla digitada e remontar o `<select>`, perdendo o foco.
   * Chamada direta devolve o mesmo elemento sem trocar a identidade da árvore.
   */
  const campoSelecao = ({
    campo,
    rotulo,
    ajuda,
    opcoes,
    mensagemErro,
    temErro,
  }: {
    campo: keyof ValoresQualificacao;
    rotulo: string;
    ajuda?: string;
    opcoes: readonly string[];
    mensagemErro: string;
    temErro: boolean;
  }) => {
    const id = `${prefixo}-${campo}`;
    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block font-semibold text-[13px] leading-[20px]" style={estiloRotulo}>
          {rotulo}
        </label>
        {ajuda && (
          <p className="text-[12px] leading-[16px]" style={estiloAjuda}>
            {ajuda}
          </p>
        )}
        <select
          id={id}
          name={campo}
          value={valores[campo]}
          onChange={onChange}
          required
          aria-invalid={temErro || undefined}
          aria-describedby={temErro ? `${id}-erro` : undefined}
          className="w-full rounded-xl px-4 py-3.5 font-medium text-[15px] transition-all duration-200 appearance-none cursor-pointer outline-none"
          style={estiloCampo(temErro)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = DOURADO;
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235,173,4,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = temErro ? tema.erro : tema.borda;
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value="" disabled style={{ background: tema.fundoOpcao, color: tema.texto }}>
            Selecione
          </option>
          {opcoes.map((opcao) => (
            <option key={opcao} value={opcao} style={{ background: tema.fundoOpcao, color: tema.texto }}>
              {opcao}
            </option>
          ))}
        </select>
        {temErro && (
          <p id={`${id}-erro`} className="text-xs font-medium" style={{ color: tema.erro, fontFamily: FONTE }}>
            {mensagemErro}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {campoSelecao({
        campo: "monthlyRevenue",
        rotulo: "Qual o faturamento médio da sua barbearia?",
        ajuda: "Por mês, somando todos os profissionais",
        opcoes: FATURAMENTO_OPCOES,
        mensagemErro: MSG_FATURAMENTO,
        temErro: Boolean(erros.monthlyRevenue),
      })}

      {campoSelecao({
        campo: "currentSystem",
        rotulo: "Você já utiliza algum sistema para a sua barbearia hoje?",
        opcoes: SISTEMA_OPCOES,
        mensagemErro: MSG_SISTEMA,
        temErro: Boolean(erros.currentSystem),
      })}

      {campoSelecao({
        campo: "clubStatus",
        rotulo: "Como está o clube de assinatura na sua barbearia hoje?",
        opcoes: CLUBE_OPCOES,
        mensagemErro: MSG_CLUBE,
        temErro: Boolean(erros.clubStatus),
      })}

      {campoSelecao({
        campo: "employeeCount",
        rotulo: "Quantos profissionais trabalham na sua barbearia?",
        opcoes: PROFISSIONAIS_OPCOES,
        mensagemErro: MSG_PROFISSIONAIS,
        temErro: Boolean(erros.employeeCount),
      })}
    </div>
  );
}
