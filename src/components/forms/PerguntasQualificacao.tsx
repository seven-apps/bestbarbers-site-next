"use client";

/**
 * PERGUNTAS DE QUALIFICAÇÃO do formulário — equipe · quando quer implementar (formulário v3, 27/Out/26).
 *
 * Porta do lead v3 (André e João, 27/Out/26; bestbarbers-ai/docs/operacional/porta-do-lead-v3-plano.md): o
 * formulário fica com nome, WhatsApp, barbearia e estas DUAS perguntas de 1 toque. Faturamento, sistema e clube
 * saíram (o SDR e o Lucas perguntam na conversa). O "quando" decide a rota: "Este mês" vai direto ao SDR; o resto
 * vai ao WhatsApp do Lucas.
 *
 * Fonte ÚNICA das perguntas em TODAS as portas (decisão de 14/Set/26 que continua valendo: o formulário é igual em
 * todo lugar). As opções vêm de `@/lib/lead-score` — o MESMO módulo que pontua.
 *
 * Cada opção é um `<input type="radio">` de verdade com o rótulo pintado de botão: o `onChange` nativo entrega
 * `name`/`value`, então o `handleInputChange` do `useLeadForm` continua sendo o único dono do estado, e o teclado e
 * o leitor de tela funcionam sem código a mais.
 */

import { useId, type ChangeEvent, type CSSProperties } from "react";
import { EQUIPE_OPCOES_V3, QUANDO_NA_TELA, ROTULOS_EQUIPE_V3, ROTULOS_QUANDO } from "@/lib/lead-score";
import { MSG_EQUIPE, MSG_QUANDO, type ErrosQualificacao } from "@/lib/qualificacao";

export interface ValoresQualificacao {
  employeeCount: string;
  startWhen: string;
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
  /** Quantas das perguntas mostrar, na ordem fixa (equipe → quando). Sem a prop saem as duas. */
  quantas?: number;
  /** Classe de cada pergunta — o formulário progressivo usa para animar a entrada. */
  classeItem?: string;
}

const TEMA: Record<VarianteQualificacao, {
  rotulo: string;
  fundo: string;
  borda: string;
  texto: string;
  erro: string;
  fundoAtivo: string;
  textoAtivo: string;
}> = {
  claro: {
    rotulo: "#1e1e1e",
    fundo: "#f5f5f5",
    borda: "#e0e0e0",
    texto: "#1e1e1e",
    erro: "#dc2626",
    fundoAtivo: "#1e1e1e",
    textoAtivo: "#ffffff",
  },
  escuro: {
    rotulo: "rgba(255,255,255,0.9)",
    fundo: "rgba(255,255,255,0.04)",
    borda: "rgba(255,255,255,0.14)",
    texto: "#ffffff",
    erro: "#f87171",
    fundoAtivo: "#ebad04",
    textoAtivo: "#1a1d25",
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
  quantas = 2,
  classeItem = "",
}: PerguntasQualificacaoProps) {
  const tema = TEMA[variante];
  const prefixo = useId();

  /** FUNÇÃO, não componente: declarar componente dentro do render remontaria os inputs a cada tecla. */
  const grupo = ({
    campo,
    rotulo,
    opcoes,
    rotuloDaOpcao,
    mensagemErro,
    temErro,
    colunas,
  }: {
    campo: keyof ValoresQualificacao;
    rotulo: string;
    opcoes: readonly string[];
    rotuloDaOpcao?: (opcao: string) => string;
    mensagemErro: string;
    temErro: boolean;
    /** 1 = LISTA (uma opção por linha, com a bolinha à esquerda): para rótulos longos, que no celular quebrariam em 3 linhas. */
    colunas: number;
  }) => {
    const lista = colunas === 1;
    const id = `${prefixo}-${campo}`;
    return (
      <fieldset
        key={campo}
        className={`space-y-2 ${classeItem}`.trim()}
        aria-invalid={temErro || undefined}
        aria-describedby={temErro ? `${id}-erro` : undefined}
      >
        <legend className="block font-semibold text-[13px] leading-[20px] mb-2" style={{ color: tema.rotulo, fontFamily: FONTE }}>
          {rotulo}
        </legend>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }}>
          {opcoes.map((opcao) => {
            const ativo = valores[campo] === opcao;
            const estilo: CSSProperties = {
              background: ativo ? tema.fundoAtivo : tema.fundo,
              color: ativo ? tema.textoAtivo : tema.texto,
              border: `1.5px solid ${ativo ? tema.fundoAtivo : temErro ? tema.erro : tema.borda}`,
              fontFamily: FONTE,
            };
            return (
              <label
                key={opcao}
                className={
                  lista
                    ? "flex items-center gap-3 text-left rounded-xl px-4 py-3.5 font-semibold text-[15px] leading-[20px] cursor-pointer transition-all duration-200 select-none focus-within:outline-none"
                    : "flex items-center justify-center text-center rounded-xl px-2 py-3 font-semibold text-[14px] leading-[18px] cursor-pointer transition-all duration-200 select-none focus-within:outline-none"
                }
                style={estilo}
                onFocusCapture={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${DOURADO}33`; }}
                onBlurCapture={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                <input
                  type="radio"
                  name={campo}
                  value={opcao}
                  checked={ativo}
                  onChange={onChange}
                  required
                  className="sr-only"
                />
                {lista && (
                  <span
                    aria-hidden="true"
                    className="flex-none rounded-full flex items-center justify-center"
                    style={{
                      width: 18,
                      height: 18,
                      border: `2px solid ${ativo ? tema.textoAtivo : tema.borda}`,
                    }}
                  >
                    {ativo && <span className="rounded-full" style={{ width: 8, height: 8, background: tema.textoAtivo }} />}
                  </span>
                )}
                <span className="min-w-0">{rotuloDaOpcao ? rotuloDaOpcao(opcao) : opcao}</span>
              </label>
            );
          })}
        </div>
        {temErro && (
          <p id={`${id}-erro`} className="text-xs font-medium" style={{ color: tema.erro, fontFamily: FONTE }}>
            {mensagemErro}
          </p>
        )}
      </fieldset>
    );
  };

  // Nenhuma pergunta na tela = nenhum contêiner (um `<div>` vazio ainda ocuparia o espaçamento do `<form>`).
  if (quantas <= 0) return null;

  const perguntas = [
    grupo({
      campo: "employeeCount",
      rotulo: "Quantas pessoas trabalham na sua barbearia?",
      opcoes: EQUIPE_OPCOES_V3,
      rotuloDaOpcao: (o) => ROTULOS_EQUIPE_V3[o as keyof typeof ROTULOS_EQUIPE_V3] ?? o,
      mensagemErro: MSG_EQUIPE,
      temErro: Boolean(erros.employeeCount),
      colunas: 3,
    }),
    grupo({
      campo: "startWhen",
      rotulo: "Quando você quer implementar a BestBarbers na sua barbearia?",
      opcoes: QUANDO_NA_TELA,
      rotuloDaOpcao: (o) => ROTULOS_QUANDO[o as keyof typeof ROTULOS_QUANDO] ?? o,
      mensagemErro: MSG_QUANDO,
      temErro: Boolean(erros.startWhen),
      colunas: 1,
    }),
  ];

  return <div className={className}>{perguntas.slice(0, quantas)}</div>;
}
