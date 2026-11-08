// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/consultoria-v2/02-plano.md §3.2
// ("a distância e o passo 1") e 05-contrato-site-os.md (a distância é conta do site, que é o único dono dela).
import type { AcaoV5, BlocoV5, ConteudoConsultoria, Faixa, Horario, PlanoDaTrava, Respostas, Texto } from "./types.ts";

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

/** A chave do caso completo: "<trava>:<quem>" (ex.: "p19:equipe"). */
export function chaveDoCaso(r: Respostas): string {
  return `${r.trava ?? ""}:${r.quem ?? ""}`;
}

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** O mês de Brasília, de 1 a 12. `agora` entra por parâmetro para o teste. */
export function mesDeBrasilia(agora: Date = new Date()): number {
  return new Date(agora.getTime() - 3 * 60 * 60 * 1000).getUTCMonth() + 1;
}

/** Troca {mes-1}, {mes}, {mes+1} e {mes+2} pelo nome do mês ({Mes…} sai com maiúscula). */
export function comMeses(texto: string, mes: number): string {
  return texto.replace(/\{(mes|Mes)([+-]\d)?\}/g, (_, forma: string, desvio?: string) => {
    const nome = MESES[(((mes - 1 + Number(desvio ?? 0)) % 12) + 12) % 12];
    return forma === "Mes" ? nome.charAt(0).toUpperCase() + nome.slice(1) : nome;
  });
}

export interface BlocoPronto extends Omit<BlocoV5, "textos" | "depois"> {
  /** O número da ação que o bloco detalha (o bloco de apoio não tem). */
  num?: number;
  textos: string[];
  depois: string[];
}

/** O plano pronto para a página: a 1ª tela (título, subtítulo, ações) e o detalhe, já com os meses e a época. */
export interface PlanoPronto {
  /** true = caso completo do molde v5; false = 1 ação a partir do plano da trava. */
  completo: boolean;
  titulo: string;
  subtitulo: string;
  acoes: (AcaoV5 & { num: number })[];
  gancho: string;
  divisor: string;
  blocos: BlocoPronto[];
  ligacao: (BlocoPronto & { chamada: string }) | null;
  fontes: { rotulo: string; texto: string } | null;
}

function textosDoMes(textos: Texto[] | undefined, mes: number): string[] {
  return (textos ?? []).flatMap((t) => (typeof t === "string" ? [t] : t.meses.includes(mes) ? [t.texto] : []));
}

function prontoDoBloco(b: BlocoV5, mes: number, num?: number): BlocoPronto {
  return { ...b, num, textos: textosDoMes(b.textos, mes), depois: textosDoMes(b.depois, mes) };
}

/** Aplica a troca dos meses em todo texto do plano. */
function trocarMeses<T>(valor: T, mes: number): T {
  if (typeof valor === "string") return comMeses(valor, mes) as T;
  if (Array.isArray(valor)) return valor.map((v) => trocarMeses(v, mes)) as T;
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, trocarMeses(v, mes)])) as T;
  }
  return valor;
}

/** "{nome}, 3 coisas para amanhã" — "1 coisa" quando é uma só, e sem o nome quando ele não veio. */
function tituloDoPlano(t: ConteudoConsultoria["telas"]["pronto"], nome: string, quantas: number): string {
  const q = quantas === 1 ? t.uma : t.varias.replace("{n}", String(quantas));
  if (nome) return t.titulo.replace("{nome}", nome).replace("{quantas}", q);
  const sem = t.titulo_sem_nome.replace("{quantas}", q);
  return sem.charAt(0).toUpperCase() + sem.slice(1);
}

/**
 * O plano da página (molde v5, aprovado em 08/Nov/26): o caso completo quando existe para a trava × quem;
 * senão, 1 ação no mesmo visual, a partir do plano da trava (S46). `agora` entra por parâmetro para o teste.
 */
export function montarPlano(conteudo: ConteudoConsultoria, r: Respostas, nome: string, agora: Date = new Date()): PlanoPronto {
  const t = conteudo.telas.pronto;
  const mes = mesDeBrasilia(agora);
  const caso = conteudo.planos.v5[chaveDoCaso(r)];

  if (!caso) {
    const plano = planoDaTrava(conteudo, r);
    return trocarMeses({
      completo: false,
      titulo: tituloDoPlano(t, nome, 1),
      subtitulo: plano.titulo,
      acoes: [{ id: "passo", num: 1, ...plano.acao }],
      gancho: t.gancho,
      divisor: t.divisor_uma,
      blocos: [{
        id: "passo", num: 1, rotulo: t.rotulo_uma, titulo: plano.acao.titulo, textos: [plano.passo1], pronto: plano.pronto,
        prova: plano.prova, depois: [],
      }],
      ligacao: null,
      fontes: null,
    }, mes);
  }

  const foraDaEpoca = caso.epoca && !caso.epoca.meses.includes(mes) ? caso.epoca : null;
  const c = foraDaEpoca ? trocarTrechos(caso, foraDaEpoca.trocas) : caso;
  const acoes = c.acoes.filter((a) => a.id !== foraDaEpoca?.acao).map((a, i) => ({ ...a, num: i + 1 }));
  const numeroDaAcao = new Map(acoes.map((a) => [a.id, a.num]));
  const blocos = c.blocos.filter((b) => b.id !== foraDaEpoca?.acao).map((b) => prontoDoBloco(b, mes, numeroDaAcao.get(b.id)));

  return trocarMeses({
    completo: true,
    titulo: tituloDoPlano(t, nome, acoes.length),
    subtitulo: c.subtitulo,
    acoes,
    gancho: c.gancho,
    divisor: c.divisor,
    blocos,
    ligacao: { ...prontoDoBloco(c.ligacao, mes), chamada: c.ligacao.chamada },
    fontes: c.fontes,
  }, mes);
}

/** Troca cada trecho (de → para) em todo texto do caso (fora da época). */
function trocarTrechos<T>(valor: T, trocas: { de: string; para: string }[]): T {
  if (typeof valor === "string") return trocas.reduce((s, { de, para }) => s.split(de).join(para), valor as string) as T;
  if (Array.isArray(valor)) return valor.map((v) => trocarTrechos(v, trocas)) as T;
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, trocarTrechos(v, trocas)])) as T;
  }
  return valor;
}

/** O link do WhatsApp para mandar à equipe o aviso de um material pronto. */
export function linkParaEquipe(aviso: string, texto: string): string {
  return `https://wa.me/?text=${encodeURIComponent(aviso.replace("{texto}", texto))}`;
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
