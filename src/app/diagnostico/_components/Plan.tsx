import type { Answers, Problem, Screens } from "../_lib/types";
import { buildPlan, fillText } from "../_lib/plano";
import styles from "../diagnostico.module.css";

export function Plan({ problem, answers, name, screen }: { problem: Problem; answers: Answers; name: string; screen: Screens["plano"] }) {
  const plan = buildPlan(problem, answers);
  const labels = screen.rotulos;
  return (
    <article className={styles.plan}>
      <p className={styles.eyebrow}>{fillText(labels.cabecalho, { nome: name })}</p>
      {screen.estrutura.map((section) => {
        switch (section) {
          case "titulo": return <h1 key={section} id="diagnostic-title" tabIndex={-1}>{plan.title}</h1>;
          case "os_seus_numeros": return <section key={section} className={styles.numbers}>
            <h2>{labels.os_seus_numeros}</h2>
            <dl>{plan.numbers.map((number) => <div key={number.label}><dt>{number.label.charAt(0).toLocaleUpperCase("pt-BR") + number.label.slice(1).replace(/ %$/, "")}</dt><dd>{number.value}</dd></div>)}</dl>
          </section>;
          case "passos": return <section key={section}><h2>{labels.passos}</h2><ol className={styles.steps}>{plan.steps.map((step, index) => <li key={index}>{step}</li>)}</ol></section>;
          case "onde_o_bestbarbers_entra": return <section key={section} className={styles.product}><h2>{labels.onde_o_bestbarbers_entra}</h2><p>{plan.bestbarbers}</p></section>;
          case "prova": return plan.proof && <section key={section}><h2>{labels.prova}</h2><p>{plan.proof}</p></section>;
          case "material": return plan.material && <p key={section}><a className={styles.material} href={plan.material.link}>{plan.material.text}</a></p>;
          case "retorno": return <p key={section} className={styles.returnText}>{screen.retorno}</p>;
          default: return null;
        }
      })}
    </article>
  );
}
