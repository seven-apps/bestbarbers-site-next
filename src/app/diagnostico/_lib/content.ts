// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json.
import source from "../_data/diagnostico-v1.json";
import type { DiagnosticContent, Screens } from "./types.ts";
import { removeInternalNotes } from "./plano.ts";

/** Projeção no servidor: reserva, fontes e notas internas não chegam ao componente cliente. */
export function getPublicContent(): DiagnosticContent {
  const screens = Object.fromEntries(source.telas.map((screen) => [screen.id, screen])) as unknown as Screens;
  return {
    screens: { ...screens, fim_outra_coisa: { ...screens.fim_outra_coisa, texto: removeInternalNotes(screens.fim_outra_coisa.texto) } },
    problems: source.problemas.map((problem) => ({
      id: problem.id,
      mapa: problem.mapa,
      tema: problem.tema,
      opcao: problem.opcao,
      perguntas: problem.perguntas,
      calculos: problem.calculos,
      plano: problem.plano,
      bestbarbers: { texto: problem.bestbarbers.texto },
      prova: problem.prova ? { texto: problem.prova.texto } : null,
      material: problem.material ? { texto: problem.material.texto, link: problem.material.link } : null,
    })),
  };
}
