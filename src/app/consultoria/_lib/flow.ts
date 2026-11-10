// Fonte: ficha aprovada da consultoria (04/Nov/26) + faturamento e meta (S21, 07/Nov/26). Regras do fluxo, sem React, para os testes.
import type { BracoContato } from "./ab.ts";
import type { ConteudoConsultoria, Respostas, Tela } from "./types.ts";

/** As perguntas de toque, na ordem. Contato e "pronto" não contam no "Pergunta X de Y". */
export const PERGUNTAS: readonly Tela[] = ["objetivo", "trava", "quem", "assinatura", "faturamento", "meta", "prazo"];
/** Braço "fim" (controle, o fluxo de 07/Nov/26): o contato depois de todas as perguntas. */
export const ORDEM: readonly Tela[] = [...PERGUNTAS, "contato", "pronto"];
/** Braço "cedo" (A/B de 10/Nov/26, regra em ./ab.ts): o contato logo depois da pergunta de equipe. */
export const ORDEM_CEDO: readonly Tela[] = ["objetivo", "trava", "quem", "contato", "assinatura", "faturamento", "meta", "prazo", "pronto"];

export function ordemDoBraco(braco: BracoContato = "fim"): readonly Tela[] {
  return braco === "cedo" ? ORDEM_CEDO : ORDEM;
}

type ComTravas = Pick<ConteudoConsultoria, "travas">;

/** `?objetivo=<id>` do anúncio ou do story: só vale um id que existe. Os outros parâmetros ficam na URL. */
export function objetivoDaUrl(search: string, conteudo: Pick<ConteudoConsultoria, "objetivos">): string | undefined {
  const id = new URLSearchParams(search).get("objetivo");
  return conteudo.objetivos.some((objetivo) => objetivo.id === id) ? id! : undefined;
}

/** A resposta da assinatura que a trava já entrega (ex.: "cobrar cada assinante na mão" → "mao"). */
export function assinaturaImplicita(conteudo: ComTravas, r: Respostas): string | undefined {
  if (!r.objetivo || !r.trava) return undefined;
  return conteudo.travas[r.objetivo]?.opcoes.find((opcao) => opcao.id === r.trava)?.assinatura_implicita;
}

/** A pergunta da assinatura sai quando a trava já responde ou quando quem responde não é o dono. */
export function pulaAssinatura(conteudo: ComTravas, r: Respostas): boolean {
  return Boolean(assinaturaImplicita(conteudo, r)) || r.quem === "barbeiro";
}

/** Quem pula o faturamento de hoje: o barbeiro que não é dono e quem ainda vai abrir (02-plano.md §3.1, item 5). */
export function pulaFaturamento(r: Respostas): boolean {
  return r.quem === "barbeiro" || r.quem === "abrir";
}

/** Quem pula a meta: só o barbeiro que não é dono. */
export function pulaMeta(r: Respostas): boolean {
  return r.quem === "barbeiro";
}

function pula(conteudo: ComTravas, tela: Tela, r: Respostas): boolean {
  if (tela === "assinatura") return pulaAssinatura(conteudo, r);
  if (tela === "faturamento") return pulaFaturamento(r);
  if (tela === "meta") return pulaMeta(r);
  return false;
}

export function perguntasDoFluxo(conteudo: ComTravas, r: Respostas): Tela[] {
  return PERGUNTAS.filter((tela) => !pula(conteudo, tela, r));
}

/** A tela está respondida? "Dono, com equipe" só fecha com o número de profissionais; "Outra coisa" fecha no botão. */
export function telaRespondida(tela: Tela, r: Respostas): boolean {
  if (tela === "objetivo") return Boolean(r.objetivo);
  if (tela === "trava") return Boolean(r.trava) && r.trava !== "outra";
  if (tela === "quem") return Boolean(r.quem) && (r.quem !== "equipe" || Boolean(r.porte));
  if (tela === "assinatura") return Boolean(r.assinatura);
  if (tela === "faturamento") return Boolean(r.faturamento);
  if (tela === "meta") return Boolean(r.meta);
  if (tela === "prazo") return Boolean(r.prazo);
  return true;
}

/** A tela seguinte no braço. No braço "cedo", depois do prazo vem "pronto": é a hora de montar o plano e sair. */
export function proximaTela(conteudo: ComTravas, atual: Tela, r: Respostas, braco: BracoContato = "fim"): Tela {
  const ordem = ordemDoBraco(braco);
  let indice = ordem.indexOf(atual) + 1;
  while (indice < ordem.length - 1 && pula(conteudo, ordem[indice], r)) indice++;
  return ordem[Math.min(indice, ordem.length - 1)];
}

/**
 * Aplica uma escolha e limpa o que deixou de valer: trocar o objetivo apaga a trava; sair de
 * "Dono, com equipe" apaga o porte; a assinatura implícita da trava entra sozinha; o barbeiro
 * não responde assinatura, faturamento nem meta; quem vai abrir não tem faturamento de hoje;
 * trocar o faturamento ou o "quem" apaga a meta (as opções da meta dependem deles).
 */
export function escolher(conteudo: ComTravas, r: Respostas, chave: keyof Respostas, valor: string): Respostas {
  const novo: Respostas = { ...r, [chave]: valor };
  if (chave === "objetivo" && r.objetivo !== valor) {
    delete novo.trava;
    delete novo.outra;
  }
  if (chave === "trava" && valor !== "outra") delete novo.outra;
  if (chave === "quem" && valor !== "equipe") delete novo.porte;
  if (chave === "faturamento" && r.faturamento !== valor) delete novo.meta;
  if (chave === "quem" && r.quem !== valor) delete novo.meta;
  const implicitaAntes = assinaturaImplicita(conteudo, r);
  const implicita = assinaturaImplicita(conteudo, novo);
  if (implicita) novo.assinatura = implicita;
  else if (implicitaAntes && chave !== "assinatura") delete novo.assinatura;
  if (novo.quem === "barbeiro") {
    delete novo.assinatura;
    delete novo.faturamento;
    delete novo.meta;
  }
  if (novo.quem === "abrir") delete novo.faturamento;
  return novo;
}

/** Fração da barra de progresso (0 a 1): a posição da tela entre as perguntas que valem e o contato, no braço. */
export function progresso(conteudo: ComTravas, tela: Tela, r: Respostas, braco: BracoContato = "fim"): number {
  if (tela === "pronto") return 1;
  const sequencia = ordemDoBraco(braco).filter((t) => t !== "pronto" && !pula(conteudo, t, r));
  return Math.max(sequencia.indexOf(tela), 0) / sequencia.length;
}
