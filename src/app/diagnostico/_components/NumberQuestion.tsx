"use client";

import type { DraftAnswers, Question } from "../_lib/types";
import styles from "../diagnostico.module.css";

interface Props {
  question: Question;
  questions: Question[];
  drafts: DraftAnswers;
  selected?: number;
  error?: string;
  onChange: (value: string | null, option?: number) => void;
}

export function NumberQuestion({ question, questions, drafts, selected, error, onChange }: Props) {
  const value = drafts[question.var];
  const inputId = `number-${question.var}`;
  const isCustom = question.opcoes?.[selected ?? -1]?.valor === "livre";
  const showInput = !question.opcoes || isCustom;
  const reference = questions.find((item) => item.var === question.max_var);
  const referenceValue = question.max_var ? drafts[question.max_var] : undefined;
  const maximum = typeof referenceValue === "string" && referenceValue.trim() !== ""
    ? Math.min(question.max ?? Infinity, Number(referenceValue.replace(",", "."))) : question.max;
  const descriptionIds = [question.ajuda && `${inputId}-help`, reference && `${inputId}-limit`, error && `${inputId}-error`].filter(Boolean).join(" ");

  return (
    <fieldset className={styles.question} aria-describedby={descriptionIds || undefined}>
      <legend>{question.texto}</legend>
      {question.opcoes && (
        <div className={styles.choices}>
          {question.opcoes.map((option, index) => (
            <button key={index} type="button" className={styles.chip} aria-pressed={selected === index}
              onClick={() => onChange(option.valor === "livre" ? "" : option.valor === null ? null : String(option.valor), index)}>
              {option.texto}
            </button>
          ))}
        </div>
      )}
      {showInput && (
        <div className={styles.numberRow}>
          <label className={styles.numberInput}>
            {(question.tipo === "reais" || question.tipo === "reais_centavos") && <span aria-hidden="true">R$</span>}
            <input id={inputId} aria-label={question.texto} type="number"
              inputMode={question.tipo === "reais_centavos" ? "decimal" : "numeric"}
              min={question.min} max={maximum} step={question.tipo === "reais_centavos" ? "0.01" : "1"}
              value={value ?? ""} required={value !== null} aria-invalid={Boolean(error)}
              aria-describedby={descriptionIds || undefined}
              onChange={(event) => onChange(event.target.value, selected)} />
            {question.tipo === "percentual" && <span aria-hidden="true">%</span>}
          </label>
          {question.aceita_nao_sei && (
            <button type="button" className={styles.chip} aria-pressed={value === null}
              onClick={() => onChange(value === null ? "" : null)}>não sei</button>
          )}
        </div>
      )}
      {question.ajuda && <p id={`${inputId}-help`} className={styles.help}>{question.ajuda}</p>}
      {reference && <p id={`${inputId}-limit`} className={styles.help}>O valor não pode passar de {reference.rotulo}{referenceValue ? ` (${Number(referenceValue).toLocaleString("pt-BR")})` : ""}.</p>}
      {error && <p id={`${inputId}-error`} role="alert" className={styles.error}>{error}</p>}
    </fieldset>
  );
}
