/**
 * CUPOM DO PARCEIRO — outubro/26 (campanha "Stories dos parceiros influenciadores").
 *
 * Decisão do André (reunião do marketing, 14/Out/26): o parceiro posta nos stories o cupom com o nome dele
 * (SELETTO200, JORGIN200…) = R$200 de desconto na 1ª mensalidade, só até 31/Out. A página do parceiro
 * (/parceiros) entra no "modo cupom" quando o link traz um cupom válido: barra verde, topo com o cupom, o
 * cadastro logo depois do topo e o cupom gravado no card do Ploomes (descrição e campo de campanha).
 *
 * Por que uma LISTA FECHADA e não "qualquer ?cupom=": o desconto é real e o closer aplica o que o card diz.
 * Um cupom digitado à mão na URL (ou de outro parceiro, ou vencido) cai na página normal, sem desconto.
 * Os códigos e a lista dos 22 vieram do André em 15/Out/26; a origem de cada um foi conferida ao vivo no
 * Ploomes no mesmo dia (todas existem). A foto do Isaac Arts entrou no herói em 15/Out/26 (recorte enviado pelo André).
 */

export interface CupomParceiro {
  /** O código que o parceiro divulga, em maiúsculas. */
  codigo: string;
  /** O slug do parceiro no site (?source=) — é o que troca a foto do herói. */
  slug: string;
  /** Como o parceiro aparece na página ("Cupom do João Seletto"). */
  parceiro: string;
  /** A origem do parceiro no Ploomes (?origin=) — é o que credita o lead e a comissão. */
  originId: number;
  /** Nome legível para a Descrição da Campanha (?odesc=), o mesmo do gerador de links do dashboard. */
  odesc: string;
  /** "da" para parceira; o padrão é "do" ("o cupom do João Seletto", "o cupom da Thaís D'Antunes"). */
  artigo?: "do" | "da";
}

export const CUPOM_VALOR = 200;
/** Fim do dia 31/Out em Brasília. Depois disso a página volta ao normal sozinha. */
export const CUPOM_VALIDO_ATE = "2026-10-31T23:59:59-03:00";
export const CUPOM_VALIDO_ATE_TEXTO = "31/Out";
/** Vai para `bb_campaign_name` do card: separa os stories do cupom dos outros leads do mesmo parceiro. */
export const CUPOM_CAMPANHA = "stories-cupom-out26";

export const CUPONS_PARCEIROS: ReadonlyArray<CupomParceiro> = [
  { codigo: "SELETTO200", slug: "joao-seletto", parceiro: "João Seletto", originId: 40214765, odesc: "João Seletto" },
  { codigo: "JORGIN200", slug: "jorgin", parceiro: "Jorgin", originId: 120001454, odesc: "Jorgin" },
  { codigo: "SANTIAGO200", slug: "santiago", parceiro: "Santiago", originId: 120000842, odesc: "Santiago" },
  { codigo: "GUAPO200", slug: "rafael-guapo", parceiro: "Rafael Guapo", originId: 120003783, odesc: "Rafael Guapo" },
  { codigo: "ARAUJO200", slug: "araujo-salviano", parceiro: "Araújo Salviano", originId: 120001037, odesc: "Araújo Salviano" },
  { codigo: "VITTOR200", slug: "vittor-pallace", parceiro: "Vittor Manoel", originId: 120004061, odesc: "Vittor Manoel (Pallace Barbearia)" },
  { codigo: "IGOR200", slug: "igor-bezerra", parceiro: "Igor Bezerra", originId: 120001060, odesc: "Igor Bezerra" },
  { codigo: "ESTEVAO200", slug: "bruno-estevao", parceiro: "Bruno Estêvão", originId: 120001038, odesc: "Bruno Estêvão" },
  { codigo: "THECHAMPS200", slug: "david-champs", parceiro: "David Champs", originId: 120001224, odesc: "David Champs" },
  { codigo: "GORDOVISK200", slug: "gabriel-gordovisk", parceiro: "Gabriel Gordovisk", originId: 120000841, odesc: "Gabriel Gordovisk" },
  { codigo: "GTREIS200", slug: "gabriel-reis", parceiro: "Gabriel Reis", originId: 120003825, odesc: "Gabriel Reis (Reis Barbearia)" },
  { codigo: "GLADS200", slug: "gladstone", parceiro: "Gladstone", originId: 120001225, odesc: "Gladstone" },
  { codigo: "DANIELS200", slug: "henrique-daniels", parceiro: "Henrique Daniels", originId: 120000378, odesc: "Henrique Daniels" },
  { codigo: "OTTONI200", slug: "ottoni", parceiro: "Ottoni", originId: 120003647, odesc: "Ottoni" },
  { codigo: "ARTS200", slug: "isaac-arts", parceiro: "Isaac Arts", originId: 120000462, odesc: "Isaac Arts" },
  { codigo: "KAIQUE200", slug: "kaique-alves", parceiro: "Kaique Alves", originId: 120001128, odesc: "Kaique Alves" },
  { codigo: "KALEO200", slug: "kaleo", parceiro: "Kaleo", originId: 120000944, odesc: "Kaleo" },
  { codigo: "MAURILIO200", slug: "maurilio-sr-bigode", parceiro: "Maurilio", originId: 120000869, odesc: "Maurilio (Sr. Bigode)" },
  { codigo: "MAURO200", slug: "mauro-elegance", parceiro: "Mauro", originId: 120003786, odesc: "Mauro (Elegance Barbearia)" },
  { codigo: "THAIS200", slug: "thais-dantunes", parceiro: "Thaís D'Antunes", originId: 40215957, odesc: "Thais D'Antunes", artigo: "da" },
  { codigo: "LUCAS200", slug: "lucas-start", parceiro: "Lucas Alexandre", originId: 120004062, odesc: "Lucas Alexandre (Start Barbearia)" },
  { codigo: "AUX200", slug: "jefferson-aux", parceiro: "Jefferson Xavier", originId: 120004060, odesc: "Jefferson Xavier (AUX Barbearia)" },
];

/** O cupom pelo código (sem diferenciar maiúsculas), só dentro da validade. */
export function acharCupom(codigo: string | null | undefined, agora: Date = new Date()): CupomParceiro | null {
  const c = String(codigo ?? "").trim().toUpperCase();
  if (!c || agora.getTime() > Date.parse(CUPOM_VALIDO_ATE)) return null;
  return CUPONS_PARCEIROS.find((x) => x.codigo === c) ?? null;
}

/**
 * O cupom que vale nesta visita: o código da URL, válido e do MESMO parceiro do `source` (quando a URL traz
 * `source`). O cupom de um parceiro no link de outro não vale: a comissão e a foto seriam de pessoas diferentes.
 */
export function cupomDaUrl(p: { cupom?: string | null; source?: string | null }, agora: Date = new Date()): CupomParceiro | null {
  const c = acharCupom(p.cupom, agora);
  if (!c) return null;
  const source = String(p.source ?? "").trim().toLowerCase();
  return !source || source === c.slug ? c : null;
}

/** O link completo da página do parceiro em modo cupom (para onde o link curto /cupom/<código> leva). */
export function caminhoDoCupom(c: CupomParceiro): string {
  const q = new URLSearchParams({ source: c.slug, origin: String(c.originId), odesc: c.odesc, cupom: c.codigo });
  return `/parceiros?${q.toString()}`;
}

/** "do João Seletto" / "da Thaís D'Antunes". */
export function doParceiro(c: CupomParceiro): string {
  return `${c.artigo ?? "do"} ${c.parceiro}`;
}

/** A mensagem pronta do WhatsApp do Lucas para quem chegou pelo cupom (lead com nota abaixo de 60). */
export function mensagemLucasDoCupom(c: CupomParceiro): string {
  return `Oi! Vim pelo cupom ${c.codigo}, ${doParceiro(c)}. Quero entender como funciona o BestBarbers na minha barbearia.`;
}
