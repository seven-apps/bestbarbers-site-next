// Fonte: src/app/consultoria/_data/consultoria-v1.json.
import source from "../_data/consultoria-v1.json";
import type { ConteudoConsultoria } from "./types.ts";

/** Projeção no servidor: status, fontes e notas internas não chegam ao componente cliente. */
export function conteudoPublico(): ConteudoConsultoria {
  const { exemplo } = source.telas;
  const travas = Object.fromEntries(
    Object.entries(source.travas).filter(([chave]) => chave !== "fonte"),
  ) as ConteudoConsultoria["travas"];
  return {
    telas: { ...source.telas, exemplo: { rotulo: exemplo.rotulo, mensagens: exemplo.mensagens, rodape: exemplo.rodape } },
    mensagem_whatsapp: source.mensagem_whatsapp,
    objetivos: source.objetivos,
    travas,
    quem: source.quem,
    porte: source.porte,
    assinatura: source.assinatura,
    prazo: source.prazo,
  };
}
