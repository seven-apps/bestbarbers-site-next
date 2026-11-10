// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/consultoria-v2/05-contrato-site-os.md
// (o que o site grava e o que a ficha do SDR lê). Os valores do CRM são os do formulário v3 (src/lib/lead-score.ts),
// para o placar de vendas e a nota do lead lerem a ficha como leem hoje. Rota: ADR-038, todo lead do site na Qualificação.
import { calcularScoreV3, type EquipeV3, type Quando, type SituacaoClube } from "../../../lib/lead-score.ts";
import type { PloomesContactData } from "../../../hooks/usePloomesAPI";
import { distanciaNoCard, faixaDaMeta, faixaDeHoje } from "./plano.ts";
import type { ConteudoConsultoria, Horario, Respostas } from "./types.ts";

/** Ligado em 07/Nov/26 com o GO do André ("bora lançar o diagnóstico sem o vídeo"). */
export const ENVIO_PLOOMES_ATIVO = true;
/** O braço do teste: na v1 no ar só existe o texto; o vídeo entra como `consultoria-v2-video`. */
export const BRACO = "texto";
export const LP_VERSION = `consultoria-v2-${BRACO}`;

/** Equipe nas faixas que o placar de vendas entende (`perfil-comprador.ts`, no bestbarbers-ai). */
export function equipeDoCRM(r: Respostas): EquipeV3 | undefined {
  if (r.quem === "solo") return "Sou apenas eu";
  if (r.quem === "equipe" && r.porte === "2a4") return "2 a 4 colaboradores";
  if (r.quem === "equipe" && r.porte === "5+") return "5 ou mais colaboradores";
  // "Vou abrir" e "sou barbeiro" não têm equipe declarada: o campo fica vazio, nunca inventado.
  return undefined;
}

export function clubeDoCRM(r: Respostas): SituacaoClube | undefined {
  if (r.assinatura === "mao") return "Já tenho o clube, mas gerencio manualmente";
  if (r.assinatura === "sistema") return "Já tenho o clube, integrado no meu sistema de gestão";
  if (r.assinatura === "nao") {
    return r.objetivo === "assinatura"
      ? "Ainda não tenho, mas tenho muito interesse em implementar"
      : "Ainda não tenho, mas quero entender melhor como funciona";
  }
  return undefined;
}

export function quandoDoCRM(r: Respostas): Quando | undefined {
  if (r.prazo === "mes") return "Este mês";
  if (r.prazo === "tres") return "Nos próximos 3 meses";
  if (r.prazo === "entender") return "Só estou conhecendo";
  return undefined;
}

/** As 7 faixas da ficha juntadas nas 4 do formulário v2 (`FormSectionV11.tsx`), no mesmo campo de faturamento. */
export const FATURAMENTO_DO_CRM: Record<string, string> = {
  ate2: "Até R$ 2.000",
  "2a5": "R$ 2.000 a R$ 10.000",
  "5a10": "R$ 2.000 a R$ 10.000",
  "10a20": "De R$ 10.000 a R$ 30.000",
  "20a30": "De R$ 10.000 a R$ 30.000",
  "30a60": "Acima de R$ 30.000",
  "60+": "Acima de R$ 30.000",
};

export function faturamentoDoCRM(r: Respostas): string | undefined {
  return r.faturamento ? FATURAMENTO_DO_CRM[r.faturamento] : undefined;
}

export function notaDoLead(r: Respostas): number | null {
  return calcularScoreV3({ quando: quandoDoCRM(r), equipe: equipeDoCRM(r) });
}

/** O texto livre perde `·`, `[`, `]` e as quebras de linha, e fica em até 200 caracteres (contrato §1). */
export function limparTextoLivre(texto: string): string {
  return texto.replace(/[·\[\]"]/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
}

function texto(lista: { id: string; texto: string }[] | undefined, id?: string) {
  return lista?.find((item) => item.id === id)?.texto ?? "";
}

/**
 * A ficha em uma linha, para a Descrição da Campanha (a automação copia para o campo 120001193 do card).
 * Formato do contrato: `[Consultoria] Chave: valor · Chave: valor`; parte sem resposta sai inteira.
 */
export function resumoDaFicha(conteudo: ConteudoConsultoria, r: Respostas, enderecoDoPlano: string): string {
  const trava = r.trava === "outra"
    ? (r.outra?.trim() ? `Outra coisa: "${limparTextoLivre(r.outra)}"` : "Outra coisa")
    : texto(r.objetivo ? conteudo.travas[r.objetivo]?.opcoes : undefined, r.trava);
  const quem = texto(conteudo.quem, r.quem);
  const porte = r.porte ? texto(conteudo.porte, r.porte) : "";
  const partes: Array<[string, string | undefined | null]> = [
    ["Objetivo", texto(conteudo.objetivos, r.objetivo)],
    ["Trava", trava],
    ["Quem", quem && porte ? `${quem} (${porte})` : quem],
    ["Assinatura", r.quem === "barbeiro" ? "" : texto(conteudo.assinatura, r.assinatura)],
    ["Faturamento", faixaDeHoje(conteudo, r)?.texto],
    ["Meta", faixaDaMeta(conteudo, r)?.texto],
    ["Distância", distanciaNoCard(conteudo, r)],
    ["Prazo", texto(conteudo.prazo, r.prazo)],
    ["Braço", BRACO],
    ["Plano", enderecoDoPlano],
  ];
  return `[Consultoria] ${partes.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ")}`;
}

/** O campo de texto do Ploomes guarda até 250 caracteres e corta o resto em silêncio (medido no card 1203299999, 07/Nov/26). */
export const LIMITE_DO_CAMPO = 250;

/**
 * A versão curta para a Descrição da Campanha: só o que o SDR precisa ver no card e cabe no campo. Entra logo depois
 * de `[SCORE]`/`[QUANDO]`, antes da atribuição (que pode ser cortada: os campos bb_* guardam a atribuição inteira).
 * A linha completa do contrato vai numa anotação no contato (`resumoDaFicha`).
 */
export function resumoCurto(conteudo: ConteudoConsultoria, r: Respostas, fecho = "Plano nas anotações"): string {
  const trava = r.trava === "outra"
    ? (r.outra?.trim() ? `Outra coisa: "${limparTextoLivre(r.outra).slice(0, 60)}"` : "Outra coisa")
    : texto(r.objetivo ? conteudo.travas[r.objetivo]?.opcoes : undefined, r.trava);
  const partes: Array<[string, string | undefined]> = [
    ["Trava", trava],
    ["Faturamento", faixaDeHoje(conteudo, r)?.texto],
    ["Meta", faixaDaMeta(conteudo, r)?.texto],
  ];
  return `[Consultoria] ${partes.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ")} · ${fecho}`;
}

/** O fecho da descrição no braço cedo: o card nasce antes do plano, e as respostas chegam depois, nas anotações. */
export const FECHO_CEDO = "Respostas nas anotações";

/**
 * A anotação do braço cedo, gravada junto com o contato: o que ele respondeu até ali, a situação e o link para
 * terminar. Se ele terminar, a anotação completa (`resumoDaFicha`) entra depois e é a que a ficha do SDR lê (a ficha
 * pega a anotação `[Consultoria] Objetivo:` mais nova). Se não terminar, esta é a que fica.
 */
export function resumoParcial(conteudo: ConteudoConsultoria, r: Respostas, enderecoParaTerminar: string): string {
  const linha = resumoDaFicha(conteudo, r, "");
  return `${linha} · Situação: deixou o contato antes do plano · Terminar: ${enderecoParaTerminar}`;
}

/** O link que o SDR manda para quem parou no meio: a consultoria de novo, com o objetivo que ele já escolheu. */
export function enderecoParaTerminar(origem: string, r: Respostas): string {
  const url = new URL("/consultoria", origem);
  if (r.objetivo) url.searchParams.set("objetivo", r.objetivo);
  return url.toString();
}

/**
 * O contato no formato do formulário de hoje (`usePloomesAPI`): o nome digitado é o nome do contato (a ficha não
 * pergunta a barbearia), a linha da consultoria vai no fim da descrição e o `bb_lp_version` é o da consultoria.
 */
export function dadosDoContato(input: {
  nome: string;
  whatsapp: string;
  respostas: Respostas;
  conteudo: ConteudoConsultoria;
  enderecoDoPlano: string;
  leadEventId: string;
  /** O fim da descrição curta; no braço cedo, `FECHO_CEDO`. */
  fecho?: string;
}): PloomesContactData {
  const { respostas: r } = input;
  const nome = input.nome.trim();
  const nota = notaDoLead(r);
  return {
    barbershopName: nome,
    ownerName: nome,
    whatsapp: input.whatsapp,
    monthlyRevenue: faturamentoDoCRM(r),
    employeeCount: equipeDoCRM(r) ?? "",
    clubStatus: clubeDoCRM(r),
    startWhen: quandoDoCRM(r),
    leadScore: nota ?? undefined,
    leadEventId: input.leadEventId,
    descricaoExtra: resumoCurto(input.conteudo, r, input.fecho),
    lpVersion: LP_VERSION,
  };
}

/** A anotação do horário no contato (contrato §2). */
export function anotacaoDoHorario(horario: Horario): string {
  return `[Consultoria] Horário escolhido: ${horario.quando}`;
}

/** O que a página do plano guarda na sessão para gravar o horário no contato certo. */
export interface CadastroDaSessao {
  contactId: number | null;
  dealId: number | null;
  leadEventId: string;
}

export const CHAVE_DA_SESSAO = "bb:consultoria:cadastro";
