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
 * A pergunta 7 é em CARTÕES, não em `<select>`: duas das cinco opções começam com a
 * mesma frase ("Já tenho o clube de assinaturas...") e a diferença mora no fim
 * ("integrado com o meu sistema" × "mas gerencio manualmente"). Num `<select>` de
 * celular o texto é truncado justamente no fim — a pessoa escolheria no escuro.
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
  fundoSelecionado: string;
  erro: string;
  fundoOpcao: string;
}> = {
  claro: {
    rotulo: "#1e1e1e",
    ajuda: "rgba(30,30,30,0.6)",
    fundo: "#f5f5f5",
    borda: "#e0e0e0",
    texto: "#1e1e1e",
    fundoSelecionado: "rgba(235,173,4,0.12)",
    erro: "#dc2626",
    fundoOpcao: "#ffffff",
  },
  escuro: {
    rotulo: "rgba(255,255,255,0.9)",
    ajuda: "rgba(255,255,255,0.45)",
    fundo: "rgba(255,255,255,0.04)",
    borda: "rgba(255,255,255,0.14)",
    texto: "#ffffff",
    fundoSelecionado: "rgba(235,173,4,0.16)",
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
   * Cartão da 7 devolve ao formulário um evento com a MESMA forma de um `<select>`
   * (`target.name` / `target.value`), para nenhum chamador precisar de um segundo
   * caminho de escrita no estado.
   */
  const aoMarcarClube = (e: ChangeEvent<HTMLInputElement>) => onChange(e);

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

  const clubeComErro = Boolean(erros.clubStatus);
  const idClube = `${prefixo}-clubStatus`;

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

      {/* Pergunta 7 — CARTÕES. Ver o porquê no cabeçalho do arquivo. */}
      <fieldset
        className="space-y-1.5 border-0 p-0 m-0"
        aria-invalid={clubeComErro || undefined}
        aria-describedby={clubeComErro ? `${idClube}-erro` : undefined}
      >
        <legend className="block font-semibold text-[13px] leading-[20px] mb-1.5" style={estiloRotulo}>
          Como está o clube de assinatura na sua barbearia hoje?
        </legend>
        <div className="grid grid-cols-1 gap-2">
          {CLUBE_OPCOES.map((opcao) => {
            const marcada = valores.clubStatus === opcao;
            return (
              <label
                key={opcao}
                className="flex items-start gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
                style={{
                  background: marcada ? tema.fundoSelecionado : tema.fundo,
                  border: `1.5px solid ${marcada ? DOURADO : clubeComErro ? tema.erro : tema.borda}`,
                  color: tema.texto,
                  fontFamily: FONTE,
                }}
              >
                <input
                  type="radio"
                  name="clubStatus"
                  value={opcao}
                  checked={marcada}
                  onChange={aoMarcarClube}
                  required
                  className="mt-0.5 shrink-0 w-4 h-4 cursor-pointer"
                  style={{ accentColor: DOURADO }}
                />
                <span className="font-medium text-[14px] leading-[20px]">{opcao}</span>
              </label>
            );
          })}
        </div>
        {clubeComErro && (
          <p id={`${idClube}-erro`} className="text-xs font-medium" style={{ color: tema.erro, fontFamily: FONTE }}>
            {MSG_CLUBE}
          </p>
        )}
      </fieldset>

      {campoSelecao({
        campo: "employeeCount",
        rotulo: "Quantos profissionais trabalham na sua barbearia?",
        ajuda: "Conte você também.",
        opcoes: PROFISSIONAIS_OPCOES,
        mensagemErro: MSG_PROFISSIONAIS,
        temErro: Boolean(erros.employeeCount),
      })}
    </div>
  );
}
