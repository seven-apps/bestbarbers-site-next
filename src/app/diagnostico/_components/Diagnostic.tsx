"use client";

// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json.
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { DiagnosticContent, DraftAnswers, Problem } from "../_lib/types";
import { getAdjacentStep, getFlowSteps, readDirectProblem } from "../_lib/flow";
import { fillText } from "../_lib/plano";
import { buildPayload, keepPayloadLocally } from "../_lib/ploomes";
import { parseAnswers, validateAnswers, validateContact } from "../_lib/validation";
import { NumberQuestion } from "./NumberQuestion";
import { Plan } from "./Plan";
import styles from "../diagnostico.module.css";

export function Diagnostic({ screens, problems }: DiagnosticContent) {
  const [step, setStep] = useState(0);
  const [momentId, setMomentId] = useState("");
  const [themeId, setThemeId] = useState("");
  const [problemId, setProblemId] = useState("");
  const [directProblem, setDirectProblem] = useState<Problem>();
  const [otherText, setOtherText] = useState("");
  const [drafts, setDrafts] = useState<DraftAnswers>({});
  const [selections, setSelections] = useState<Record<string, number | undefined>>({});
  const [contact, setContact] = useState({ name: "", whatsapp: "", instagram: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const container = useRef<HTMLDivElement>(null);
  const theme = screens.tema.opcoes.find((item) => directProblem ? item.problemas.includes(directProblem.id) : item.id === themeId);
  const moment = screens.momento.opcoes.find((item) => item.id === momentId);
  const problem = directProblem ?? problems.find((item) => item.id === problemId);
  const isOther = problemId === "other";
  const other = screens.problema.outra_coisa;
  const steps = getFlowSteps(Boolean(directProblem), isOther);
  const progress = steps.indexOf(step) / (steps.length - 1) * 100;

  useEffect(() => {
    setDirectProblem(readDirectProblem(window.location.search, problems));
  }, [problems]);

  useEffect(() => {
    container.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);

  function goTo(next: number) {
    setErrors({});
    setStep(next);
  }

  function showErrors(nextErrors: Record<string, string>) {
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => container.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')?.focus());
      return true;
    }
    return false;
  }

  function chooseProblem(id: string) {
    if (problemId !== id) {
      setDrafts({});
      setSelections({});
    }
    setProblemId(id);
    if (id !== "other") goTo(4);
  }

  function submitNumbers(event: FormEvent) {
    event.preventDefault();
    if (problem && !showErrors(validateAnswers(problem.perguntas, drafts))) goTo(5);
  }

  function submitContact(event: FormEvent) {
    event.preventDefault();
    if (showErrors(validateContact(contact)) || !theme || !moment) return;
    keepPayloadLocally(buildPayload({ contact, moment: moment.momento, theme: theme.texto, problem,
      answers: parseAnswers(drafts), otherText, otherLabel: other.opcao }));
    goTo(6);
  }

  const title = step === 0 ? screens.abertura.titulo : step === 1 ? screens.momento.pergunta
    : step === 2 ? screens.tema.pergunta : step === 3 ? theme?.pergunta
    : step === 4 ? screens.numeros.titulo : step === 5 ? screens.contato.titulo
    : fillText(screens.fim_outra_coisa.titulo, { nome: contact.name.trim() });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>BestBarbers<span aria-hidden="true">.</span></span>
        <div className={styles.navigation}>
          <button type="button" className={styles.back} disabled={step === 0}
            onClick={() => goTo(getAdjacentStep(steps, step, -1))} aria-label="Voltar">←</button>
          <div className={styles.progress} role="progressbar" aria-label="Progresso" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>
      <div ref={container} className={`${styles.card} ${step === 0 ? styles.opening : ""}`}>
        {step === 4 && directProblem && <p className={styles.eyebrow}>{directProblem.opcao}</p>}
        {!(step === 6 && problem) && <h1 id="diagnostic-title" tabIndex={-1}>{title}</h1>}
        {step === 0 && <><p className={styles.intro}>{screens.abertura.texto}</p><button className={styles.primary} onClick={() => goTo(1)}>{screens.abertura.botao}<span aria-hidden="true">→</span></button></>}
        {step === 1 && <div className={styles.options}>{screens.momento.opcoes.map((option) => <button key={option.id} className={styles.option} aria-pressed={momentId === option.id} onClick={() => { setMomentId(option.id); goTo(getAdjacentStep(steps, step, 1)); }}>{option.texto}<span aria-hidden="true">→</span></button>)}</div>}
        {step === 2 && <div className={styles.options}>{screens.tema.opcoes.map((option) => <button key={option.id} className={styles.option} aria-pressed={themeId === option.id} onClick={() => {
          if (themeId !== option.id) { setProblemId(""); setDrafts({}); setSelections({}); }
          setThemeId(option.id); goTo(3);
        }}><span><strong>{option.texto}</strong><small>{option.descricao}</small></span><span aria-hidden="true">→</span></button>)}</div>}
        {step === 3 && theme && <>
          <div className={styles.options}>{theme.problemas.map((id) => {
            const option = problems.find((item) => item.id === id)!;
            return <button key={id} className={styles.option} aria-pressed={problemId === id} onClick={() => chooseProblem(id)}>{option.opcao}<span aria-hidden="true">→</span></button>;
          })}<button className={styles.option} aria-pressed={isOther} onClick={() => chooseProblem("other")}>{other.opcao}<span aria-hidden="true">{isOther ? "↓" : "+"}</span></button></div>
          {isOther && <form className={styles.form} noValidate onSubmit={(event) => { event.preventDefault(); if (!showErrors(otherText.trim() ? {} : { other: "Conta com as suas palavras." })) goTo(5); }}>
            <label className={styles.field} htmlFor="other-text">{other.campo}<textarea id="other-text" value={otherText} placeholder={other.placeholder} required={other.obrigatorio} rows={4} aria-invalid={Boolean(errors.other)} aria-describedby={errors.other ? "other-error" : undefined} onChange={(event) => setOtherText(event.target.value)} /></label>
            {errors.other && <p id="other-error" className={styles.error} role="alert">{errors.other}</p>}
            <button className={styles.primary} type="submit">{screens.numeros.botao}<span aria-hidden="true">→</span></button>
          </form>}
        </>}
        {step === 4 && problem && <><p className={styles.intro}>{screens.numeros.texto}</p><form className={styles.form} onSubmit={submitNumbers} noValidate>
          {problem.perguntas.map((question) => <NumberQuestion key={question.var} question={question} questions={problem.perguntas} drafts={drafts} selected={selections[question.var]} error={errors[question.var]}
            onChange={(value, option) => { setDrafts((current) => ({ ...current, [question.var]: value })); setSelections((current) => ({ ...current, [question.var]: option })); }} />)}
          <button className={styles.primary} type="submit">{screens.numeros.botao}<span aria-hidden="true">→</span></button>
        </form></>}
        {step === 5 && <><p className={styles.intro}>{screens.contato.texto}</p><form className={styles.form} noValidate onSubmit={submitContact}>
          {screens.contato.campos.map((field) => {
            const key = field.var === "nome" ? "name" : field.var === "whatsapp" ? "whatsapp" : "instagram";
            return <div key={field.var}><label className={styles.field} htmlFor={`contact-${key}`}>{field.rotulo}
              <input id={`contact-${key}`} name={key} type={key === "whatsapp" ? "tel" : "text"} inputMode={key === "whatsapp" ? "tel" : "text"} autoComplete={key === "name" ? "name" : key === "whatsapp" ? "tel-national" : "off"} required={field.obrigatorio}
                value={contact[key]} aria-invalid={Boolean(errors[field.var])} aria-describedby={errors[field.var] ? `error-${key}` : undefined}
                onChange={(event) => setContact((current) => ({ ...current, [key]: event.target.value }))} />
            </label>{errors[field.var] && <p id={`error-${key}`} className={styles.error} role="alert">{errors[field.var]}</p>}</div>;
          })}<button className={styles.primary} type="submit">{screens.contato.botao}<span aria-hidden="true">→</span></button>
        </form></>}
        {step === 6 && problem && <Plan problem={problem} answers={parseAnswers(drafts)} name={contact.name.trim()} screen={screens.plano} />}
        {step === 6 && isOther && <p className={styles.intro}>{screens.fim_outra_coisa.texto}</p>}
      </div>
    </main>
  );
}
