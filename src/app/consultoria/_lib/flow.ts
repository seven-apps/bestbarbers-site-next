// Fonte: protótipo aprovado da consultoria (04/Nov/26). Regras do fluxo, sem React, para os testes.
import type { ConteudoConsultoria, Respostas, Tela } from "./types.ts";

/** As perguntas de toque, na ordem. Contato e "pronto" não contam no "Pergunta X de Y". */
export const PERGUNTAS: readonly Tela[] = ["objetivo", "trava", "quem", "assinatura", "prazo"];
export const ORDEM: readonly Tela[] = [...PERGUNTAS, "contato", "pronto"];

/** `?objetivo=<id>` do anúncio ou do story: só vale um id que existe. Os outros parâmetros ficam na URL. */
export function objetivoDaUrl(search: string, conteudo: Pick<ConteudoConsultoria, "objetivos">): string | undefined {
  const id = new URLSearchParams(search).get("objetivo");
  return conteudo.objetivos.some((objetivo) => objetivo.id === id) ? id! : undefined;
}

/** A resposta da assinatura que a trava já entrega (ex.: "cobrar cada assinante na mão" → "mao"). */
export function assinaturaImplicita(conteudo: Pick<ConteudoConsultoria, "travas">, r: Respostas): string | undefined {
  if (!r.objetivo || !r.trava) return undefined;
  return conteudo.travas[r.objetivo]?.opcoes.find((opcao) => opcao.id === r.trava)?.assinatura_implicita;
}

/** A pergunta da assinatura sai quando a trava já responde ou quando quem responde não é o dono. */
export function pulaAssinatura(conteudo: Pick<ConteudoConsultoria, "travas">, r: Respostas): boolean {
  return Boolean(assinaturaImplicita(conteudo, r)) || r.quem === "barbeiro";
}

export function perguntasDoFluxo(conteudo: Pick<ConteudoConsultoria, "travas">, r: Respostas): Tela[] {
  return PERGUNTAS.filter((tela) => !(tela === "assinatura" && pulaAssinatura(conteudo, r)));
}

/** A tela está respondida? "Dono, com equipe" só fecha com o número de profissionais. */
export function telaRespondida(tela: Tela, r: Respostas): boolean {
  if (tela === "objetivo") return Boolean(r.objetivo);
  if (tela === "trava") return Boolean(r.trava);
  if (tela === "quem") return Boolean(r.quem) && (r.quem !== "equipe" || Boolean(r.porte));
  if (tela === "assinatura") return Boolean(r.assinatura);
  if (tela === "prazo") return Boolean(r.prazo);
  return true;
}

export function proximaTela(conteudo: Pick<ConteudoConsultoria, "travas">, atual: Tela, r: Respostas): Tela {
  let indice = ORDEM.indexOf(atual) + 1;
  if (ORDEM[indice] === "assinatura" && pulaAssinatura(conteudo, r)) indice++;
  return ORDEM[Math.min(indice, ORDEM.length - 1)];
}

/**
 * Aplica uma escolha e limpa o que deixou de valer: trocar o objetivo apaga a trava; sair de
 * "Dono, com equipe" apaga o porte; a assinatura implícita da trava entra sozinha; o barbeiro
 * não responde assinatura.
 */
export function escolher(conteudo: Pick<ConteudoConsultoria, "travas">, r: Respostas, chave: keyof Respostas, valor: string): Respostas {
  const novo: Respostas = { ...r, [chave]: valor };
  if (chave === "objetivo" && r.objetivo !== valor) delete novo.trava;
  if (chave === "quem" && valor !== "equipe") delete novo.porte;
  const implicitaAntes = assinaturaImplicita(conteudo, r);
  const implicita = assinaturaImplicita(conteudo, novo);
  if (implicita) novo.assinatura = implicita;
  else if (implicitaAntes && chave !== "assinatura") delete novo.assinatura;
  if (novo.quem === "barbeiro") delete novo.assinatura;
  return novo;
}

/** Fração da barra de progresso (0 a 1). */
export function progresso(conteudo: Pick<ConteudoConsultoria, "travas">, tela: Tela, r: Respostas): number {
  if (tela === "pronto") return 1;
  const perguntas = perguntasDoFluxo(conteudo, r);
  if (tela === "contato") return perguntas.length / (perguntas.length + 1);
  return Math.max(perguntas.indexOf(tela), 0) / (perguntas.length + 1);
}
