// Fonte: protótipo aprovado da consultoria (04/Nov/26). Os valores gravados no CRM são os do formulário v3
// (src/lib/lead-score.ts), para a rota da ADR-037 e o placar de vendas lerem a ficha como leem hoje.
import {
  PLOOMES_CONTACT_FIELDS,
  PLOOMES_CONTACT_INT_FIELDS,
  PLOOMES_CONTACT_OPTION_FIELDS,
  PLOOMES_LEGACY_FIELDS,
  PLOOMES_OPCOES_CLUBE,
  PLOOMES_OPCOES_QUANDO,
} from "../../../lib/ploomes-fields.ts";
import { calcularScoreV3, type EquipeV3, type Quando, type SituacaoClube } from "../../../lib/lead-score.ts";
import { corpoDaNutricao, vaiAoLucas, type ContatoDoSite } from "../../../lib/lead-nutricao.ts";
import type { LeadAttribution } from "../../../lib/lead-attribution";
import type { ConteudoConsultoria, Respostas } from "./types.ts";

/** Desligado até o João alinhar a origem, a rota (Lucas × SDR) e o recadastro. Ligar exige teste novo. */
export const ENVIO_PLOOMES_ATIVO = false;
export const LP_VERSION = "consultoria-v1";

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

function texto(lista: { id: string; texto: string }[] | undefined, id?: string) {
  return lista?.find((item) => item.id === id)?.texto ?? "";
}

/** A ficha em uma linha, para a descrição da campanha: é o que o Lucas e o SDR leem no card. */
export function resumoDaFicha(conteudo: ConteudoConsultoria, r: Respostas): string {
  const partes = [
    `Objetivo: ${texto(conteudo.objetivos, r.objetivo)}`,
    `Trava: ${texto(r.objetivo ? conteudo.travas[r.objetivo]?.opcoes : undefined, r.trava)}`,
    `Quem: ${texto(conteudo.quem, r.quem)}${r.porte ? ` (${texto(conteudo.porte, r.porte)})` : ""}`,
    ...(r.assinatura ? [`Assinatura: ${texto(conteudo.assinatura, r.assinatura)}`] : []),
    `Prazo: ${texto(conteudo.prazo, r.prazo)}`,
  ];
  return `[Consultoria] ${partes.join(" · ")}`;
}

export interface ContatoDigitado {
  name: string;
  whatsapp: string;
}

/** Contato no formato do formulário de hoje (`ContatoDoSite`), sem importar os hooks que fazem requisições. */
export function montarContato(input: {
  contato: ContatoDigitado;
  respostas: Respostas;
  conteudo: ConteudoConsultoria;
  originId?: number | null;
}): ContatoDoSite {
  const { contato, respostas: r, conteudo } = input;
  const equipe = equipeDoCRM(r);
  const clube = clubeDoCRM(r);
  const quando = quandoDoCRM(r);
  const nota = calcularScoreV3({ quando, equipe });
  return {
    Name: contato.name.trim(),
    OriginId: input.originId ?? null,
    Phones: [{ PhoneNumber: contato.whatsapp.replace(/\D/g, ""), TypeId: 2, CountryId: 0 }],
    OtherProperties: [
      { FieldKey: PLOOMES_LEGACY_FIELDS.ownerName, StringValue: contato.name.trim() },
      { FieldKey: PLOOMES_CONTACT_FIELDS.bb_lp_version, StringValue: LP_VERSION },
      { FieldKey: PLOOMES_LEGACY_FIELDS.campaignDescStr, StringValue: resumoDaFicha(conteudo, r) },
      ...(equipe ? [{ FieldKey: PLOOMES_LEGACY_FIELDS.employeeCount, StringValue: equipe }] : []),
      ...(clube ? [{ FieldKey: PLOOMES_CONTACT_OPTION_FIELDS.bb_clube, IntegerValue: PLOOMES_OPCOES_CLUBE[clube] }] : []),
      ...(quando ? [{ FieldKey: PLOOMES_CONTACT_OPTION_FIELDS.bb_quando, IntegerValue: PLOOMES_OPCOES_QUANDO[quando] }] : []),
      ...(nota !== null ? [{ FieldKey: PLOOMES_CONTACT_INT_FIELDS.bb_lead_score, IntegerValue: nota }] : []),
    ],
  };
}

/** Quem atende: "Este mês" vai ao SDR; o resto, ao Lucas (mesma regra do formulário v3, `vaiAoLucas`). */
export function rotaDoLead(r: Respostas): "lucas" | "sdr" {
  const quando = quandoDoCRM(r);
  return vaiAoLucas({ quando, nota: calcularScoreV3({ quando, equipe: equipeDoCRM(r) }) }) ? "lucas" : "sdr";
}

/** Corpo da rota da Nutrição do OS, com os mesmos campos do card que o formulário de hoje manda. */
export function montarCorpoNutricao(contato: ContatoDoSite, r: Respostas, atribuicao: LeadAttribution) {
  const equipe = equipeDoCRM(r);
  const quando = quandoDoCRM(r);
  return corpoDaNutricao({
    contato,
    atribuicao,
    nota: calcularScoreV3({ quando, equipe }) ?? 0,
    colaboradores: equipe,
    clube: clubeDoCRM(r),
    quando,
  });
}

let pendente: ContatoDoSite | null = null;

export function contatoPendente() {
  return pendente;
}

export function guardarLocalmente(contato: ContatoDoSite) {
  if (ENVIO_PLOOMES_ATIVO) throw new Error("O envio depende da origem, da rota e do recadastro alinhados com o João.");
  pendente = contato;
  if (process.env.NODE_ENV === "development") {
    console.info("[Consultoria] Envio desligado; contato guardado apenas em memória.", contato);
  }
}
