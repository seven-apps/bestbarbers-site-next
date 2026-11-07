// Fonte: src/app/consultoria/_data/consultoria-v2.json.
import source from "../_data/consultoria-v2.json";
import type { ConteudoConsultoria } from "./types.ts";

/** Projeção no servidor: status, fontes e notas internas não chegam ao componente cliente. */
export function conteudoPublico(): ConteudoConsultoria {
  const travas = Object.fromEntries(
    Object.entries(source.travas).filter(([chave]) => chave !== "fonte"),
  ) as ConteudoConsultoria["travas"];
  return {
    telas: source.telas,
    objetivos: source.objetivos,
    travas,
    quem: source.quem,
    porte: source.porte,
    assinatura: source.assinatura,
    faixas_hoje: source.faixas_hoje,
    faixas_meta: source.faixas_meta,
    prazo: source.prazo,
    horarios: source.horarios,
    planos: {
      alavancas: source.planos.alavancas,
      por_trava: source.planos.por_trava as ConteudoConsultoria["planos"]["por_trava"],
    },
  };
}
