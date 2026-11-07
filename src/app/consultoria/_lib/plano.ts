// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/consultoria-v2/02-plano.md §3.2
// ("a distância e o passo 1") e 05-contrato-site-os.md (a distância é conta do site, que é o único dono dela).
import type { ConteudoConsultoria, Faixa, Horario, PlanoDaTrava, Respostas } from "./types.ts";

export const URL_DO_SITE = "https://www.bestbarbers.app";
export const CAMINHO_DO_PLANO = "/consultoria/plano";

type ComFaixas = Pick<ConteudoConsultoria, "faixas_hoje" | "faixas_meta">;

export function faixaDeHoje(conteudo: ComFaixas, r: Respostas): Faixa | undefined {
  return conteudo.faixas_hoje.find((f) => f.id === r.faturamento);
}

export function faixaDaMeta(conteudo: ComFaixas, r: Respostas): Faixa | undefined {
  return conteudo.faixas_meta.find((f) => f.id === r.meta);
}

/**
 * As opções da meta: só as faixas acima da de hoje, no máximo 4 (02-plano.md §3.1, item 5).
 * Quem vai abrir (sem faturamento de hoje) vê as 5 primeiras.
 */
export function opcoesDaMeta(conteudo: ComFaixas, r: Respostas): Faixa[] {
  const hoje = faixaDeHoje(conteudo, r);
  if (!hoje) return conteudo.faixas_meta.slice(0, 5);
  const piso = hoje.max ?? hoje.min;
  return conteudo.faixas_meta.filter((f) => f.min >= piso).slice(0, 4);
}

/** O meio da faixa; faixa aberta não tem meio. */
export function meioDaFaixa(faixa: Faixa): number | null {
  return faixa.max === null ? null : (faixa.min + faixa.max) / 2;
}

/** Arredonda para R$ 1 mil abaixo de R$ 20 mil e para R$ 5 mil a partir daí ("cerca de"). */
function arredondar(valor: number): number {
  const passo = valor < 20000 ? 1000 : 5000;
  return Math.max(passo, Math.round(valor / passo) * passo);
}

/**
 * A distância por mês, pelo meio das faixas. Só existe com as duas faixas fechadas e a meta acima de hoje.
 * Devolve o valor em reais (arredondado) ou `null`.
 */
export function distancia(conteudo: ComFaixas, r: Respostas): number | null {
  const hoje = faixaDeHoje(conteudo, r);
  const meta = faixaDaMeta(conteudo, r);
  if (!hoje || !meta) return null;
  const a = meioDaFaixa(hoje);
  const b = meioDaFaixa(meta);
  if (a === null || b === null || b <= a) return null;
  return arredondar(b - a);
}

export function reais(valor: number): string {
  return `R$ ${(valor / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} mil`;
}

/** "cerca de +R$ 25 mil por mês" — a forma que vai à linha do card (05-contrato-site-os.md §1). */
export function distanciaNoCard(conteudo: ComFaixas, r: Respostas): string | null {
  const d = distancia(conteudo, r);
  return d === null ? null : `cerca de +${reais(d)} por mês`;
}

export function planoDaTrava(conteudo: Pick<ConteudoConsultoria, "planos">, r: Respostas): PlanoDaTrava {
  return conteudo.planos.por_trava[r.trava ?? ""] ?? conteudo.planos.por_trava.outra;
}

export function textoDaTrava(conteudo: Pick<ConteudoConsultoria, "travas">, r: Respostas): string | undefined {
  if (!r.objetivo || !r.trava) return undefined;
  return conteudo.travas[r.objetivo]?.opcoes.find((o) => o.id === r.trava)?.texto;
}

/** "2 a 4 barbeiros · assinatura cobrada na mão ou no Pix · quer resolver este mês": a prova de que lemos. */
export function linhaDeLeitura(conteudo: ConteudoConsultoria, r: Respostas): string {
  const partes: string[] = [];
  if (r.quem === "equipe" && r.porte) partes.push(`${conteudo.porte.find((p) => p.id === r.porte)?.texto} barbeiros`);
  else if (r.quem === "solo") partes.push("você atende sozinho");
  else if (r.quem === "abrir") partes.push("barbearia para abrir");
  else if (r.quem === "barbeiro") partes.push("barbeiro, não dono");
  const assinatura = conteudo.assinatura.find((a) => a.id === r.assinatura);
  if (assinatura && r.quem !== "barbeiro") partes.push(`assinatura: ${assinatura.resumo}`);
  if (r.prazo === "mes") partes.push("quer resolver este mês");
  else if (r.prazo === "tres") partes.push("quer resolver nos próximos 3 meses");
  else if (r.prazo === "entender") partes.push("quer entender primeiro");
  return partes.join(" · ");
}

/** O subtítulo: "De R$ 10 a 20 mil para R$ 30 a 60 mil por mês, começando por: …". */
export function linhaDoCaminho(conteudo: ConteudoConsultoria, r: Respostas): string {
  const hoje = faixaDeHoje(conteudo, r);
  const meta = faixaDaMeta(conteudo, r);
  const trava = r.trava === "outra" ? (r.outra?.trim() || "o que você contou") : textoDaTrava(conteudo, r);
  const comeco = trava ? `, começando por: “${trava}”` : "";
  if (hoje && meta) return `De ${minuscula(hoje.texto)} para ${minuscula(meta.texto)} por mês${comeco}.`;
  if (meta) return `Chegar a ${minuscula(meta.texto)} por mês${comeco}.`;
  return trava ? `Começando por: “${trava}”.` : "";
}

/** "Até R$ 2 mil" → "até R$ 2 mil"; "R$ 10 a 20 mil" fica como está. */
function minuscula(texto: string): string {
  if (/^R\$/.test(texto)) return texto;
  return texto.charAt(0).toLowerCase() + texto.slice(1);
}

/** As respostas que viajam no endereço do plano (o SDR manda o mesmo link no 1º toque). O texto livre não viaja. */
const CHAVES_DA_URL: ReadonlyArray<[keyof Respostas, string]> = [
  ["objetivo", "o"], ["trava", "t"], ["quem", "q"], ["porte", "p"], ["assinatura", "a"],
  ["faturamento", "f"], ["meta", "m"], ["prazo", "z"],
];

export function enderecoDoPlano(r: Respostas, nome: string, base: string = URL_DO_SITE): string {
  const params = new URLSearchParams();
  const primeiro = nome.trim().split(/\s+/)[0];
  if (primeiro) params.set("n", primeiro.slice(0, 40));
  for (const [chave, curta] of CHAVES_DA_URL) {
    const valor = r[chave];
    if (valor) params.set(curta, valor);
  }
  return `${base}${CAMINHO_DO_PLANO}?${params.toString()}`;
}

/** Lê o endereço do plano. Só aceita ids que existem no conteúdo: o resto é ignorado. */
export function respostasDoEndereco(
  conteudo: ConteudoConsultoria,
  params: Record<string, string | string[] | undefined>,
): { respostas: Respostas; nome: string } {
  const lido = (k: string) => {
    const v = params[k];
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
  };
  const existe = (lista: { id: string }[], id?: string) => (id && lista.some((o) => o.id === id) ? id : undefined);
  const objetivo = existe(conteudo.objetivos, lido("o"));
  const respostas: Respostas = {
    objetivo,
    trava: objetivo ? existe(conteudo.travas[objetivo]?.opcoes ?? [], lido("t")) : undefined,
    quem: existe(conteudo.quem, lido("q")),
    porte: existe(conteudo.porte, lido("p")),
    assinatura: existe(conteudo.assinatura, lido("a")),
    faturamento: existe(conteudo.faixas_hoje, lido("f")),
    meta: existe(conteudo.faixas_meta, lido("m")),
    prazo: existe(conteudo.prazo, lido("z")),
  };
  for (const chave of Object.keys(respostas) as (keyof Respostas)[]) if (!respostas[chave]) delete respostas[chave];
  const nome = (lido("n") ?? "").replace(/[^\p{L}\p{M}' -]/gu, "").trim().slice(0, 40);
  return { respostas, nome };
}

/**
 * Os horários que fazem sentido agora (hora de Brasília): "hoje, até as 18h" só aparece em dia útil antes das 17h.
 * `agora` entra por parâmetro para o teste.
 */
export function horariosDisponiveis(horarios: Horario[], agora: Date = new Date()): Horario[] {
  const brasilia = new Date(agora.getTime() - 3 * 60 * 60 * 1000);
  const dia = brasilia.getUTCDay();
  const hora = brasilia.getUTCHours();
  const hojeVale = dia >= 1 && dia <= 5 && hora < 17;
  return horarios.filter((h) => h.id !== "hoje" || hojeVale);
}
