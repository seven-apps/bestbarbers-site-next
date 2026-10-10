/**
 * CURSO DE ASSINATURA — o cliente das rotas do OS (`/api/curso/*`), o link pessoal guardado no
 * aparelho e os links que a área monta.
 *
 * Contrato: `02-contrato-tecnico.md` §2.3, §3, §4 e §12 (bestbarbers-ai). Regras que valem aqui:
 *   - o token vai SEMPRE no cabeçalho `Authorization: Bearer`, nunca na URL de uma chamada;
 *   - nenhuma função lança: devolve `ok` ou o motivo, e a tela decide o que mostrar;
 *   - a inscrição repete com a MESMA `chave` (o OS devolve o mesmo aluno com token novo).
 *
 * Sem React e sem `@/`: o `node --test` carrega direto. `fetch` e `localStorage` entram por
 * parâmetro nos testes; na tela, os do navegador.
 */

import type { CadastroConcluido } from "./cadastro-concluido.ts";
import type { LeadAttributionFields } from "./lead-attribution.ts";
import { baseDoOS } from "./recadastro.ts";
import { numeroValidoDoLucas } from "./lead-nutricao.ts";
import { CAMINHO_AREA, type NumeroAula } from "../content/curso-assinatura.ts";
import {
  lerEstadoAluno,
  tokenComFormato,
  type Derivados,
  type EstadoAluno,
  type FichasPorAula,
  type Marco,
} from "./curso.ts";

// ─── O que fica guardado no aparelho (§2.3 e §3) ────────────────────────────────────────────

export const CHAVE_TOKEN = "bb_curso_token";
export const CHAVE_INSCRICAO_PENDENTE = "bb_curso_inscricao_pendente";
/** O aviso "Seu acesso está liberado" já foi visto (guarda o código do aluno). */
export const CHAVE_BOAS_VINDAS = "bb_curso_boas_vindas";
/** Trechos já assistidos e última posição de cada aula, para retomar e não perder a fração. */
export const chaveAssistido = (codigo: string, aula: NumeroAula) => `bb_curso_assistido_${codigo}_${aula}`;
export const chavePosicao = (codigo: string, aula: NumeroAula) => `bb_curso_posicao_${codigo}_${aula}`;

type Leitura = Pick<Storage, "getItem"> | null | undefined;
type Escrita = Pick<Storage, "setItem" | "removeItem"> | null | undefined;

/** O `localStorage` pode não existir ou lançar (aba anônima, bloqueio): nunca derruba a tela. */
export function ler(storage: Leitura, chave: string): string | null {
  try {
    return storage?.getItem(chave) ?? null;
  } catch {
    return null;
  }
}
export function gravar(storage: Escrita, chave: string, valor: string): void {
  try {
    storage?.setItem(chave, valor);
  } catch {
    /* sem armazenamento: a área continua funcionando nesta visita */
  }
}
export function apagar(storage: Escrita, chave: string): void {
  try {
    storage?.removeItem(chave);
  } catch {
    /* idem */
  }
}

export function lerTokenGuardado(storage: Leitura): string | null {
  const t = ler(storage, CHAVE_TOKEN);
  return tokenComFormato(t) ? t : null;
}
export function guardarToken(storage: Escrita, token: string): void {
  if (tokenComFormato(token)) gravar(storage, CHAVE_TOKEN, token);
}
export function apagarToken(storage: Escrita): void {
  apagar(storage, CHAVE_TOKEN);
}

// ─── Links (§3 e §12) ───────────────────────────────────────────────────────────────────────

/**
 * Link da área com o token no FRAGMENTO (`#t=`): o fragmento não vai ao servidor nem ao
 * `Referer`. `origem` vazia = caminho relativo (para `window.location.assign`).
 */
export function linkDaArea(
  token: string,
  extras: { aula?: NumeroAula; abrir?: "plano" | "sinal" } = {},
  origem = "",
): string {
  const partes = [`t=${encodeURIComponent(token)}`];
  if (extras.aula) partes.push(`aula=${extras.aula}`);
  if (extras.abrir) partes.push(`abrir=${extras.abrir}`);
  return `${origem}${CAMINHO_AREA}#${partes.join("&")}`;
}

/** Código do aluno: 6 caracteres do alfabeto Crockford (sem I, L, O, U). Não é credencial. */
export const FORMATO_CODIGO = /^[0-9A-HJKMNP-TV-Z]{6}$/;

/**
 * Bônus do WhatsApp do Lucas (§12). A mensagem termina SEMPRE em `(aluno <codigo>)`: o texto
 * antes pode mudar, o sufixo não (o Lucas lê com `/\(aluno ([0-9A-HJKMNP-TV-Z]{6})\)\s*$/`).
 * Número do Lucas vazio ou fora do formato, ou código estranho = `""` (o botão não aparece).
 */
export function linkBonusLucas(numero: string, mensagem: string, codigo: string): string {
  const destino = numeroValidoDoLucas(numero);
  if (!destino || !FORMATO_CODIGO.test(codigo)) return "";
  return `https://wa.me/${destino}?text=${encodeURIComponent(`${mensagem.trim()} (aluno ${codigo})`)}`;
}

/** "Pedir o link no WhatsApp" da tela de link inválido: sem código, o Lucas acha pelo telefone. */
export function linkLucasSemCodigo(numero: string, mensagem: string): string {
  const destino = numeroValidoDoLucas(numero);
  return destino ? `https://wa.me/${destino}?text=${encodeURIComponent(mensagem.trim())}` : "";
}

// ─── Inscrição (§2.3) ───────────────────────────────────────────────────────────────────────

/** A allowlist `bb_*` de `camposDoCardSchema.atribuicao` no OS, com os mesmos tamanhos. */
const LIMITES_ATRIBUICAO: Readonly<Record<keyof LeadAttributionFields, number>> = {
  bb_campaign_id: 120,
  bb_campaign_name: 200,
  bb_adset_id: 120,
  bb_ad_id: 200,
  bb_lp_version: 40,
  bb_wave: 80,
  bb_audience_type: 120,
  bb_utm_source: 120,
  bb_utm_medium: 120,
  bb_utm_campaign: 200,
  bb_utm_content: 200,
  bb_utm_term: 200,
  bb_fbclid: 400,
  bb_gclid: 400,
  bb_lead_event_id: 120,
};

export interface CorpoInscricao {
  chave: string;
  nome: string;
  barbearia?: string;
  telefone: string;
  email?: string;
  nota: number | null;
  clube?: string;
  caminho: CadastroConcluido["caminho"];
  dealId?: number;
  contactId?: number;
  atribuicao: {
    originId?: number;
    originDesc?: string;
    leadEventId?: string;
    campos: LeadAttributionFields;
  };
}

const corta = (texto: string, max: number) => texto.slice(0, max);
const inteiroPositivo = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0;

/**
 * O corpo do `POST /api/curso/inscricao`. O OS valida com `.strict()` (chave desconhecida ou
 * texto longo demais = 400), então aqui só entra o que o contrato aceita, no tamanho que ele
 * aceita. Nada é decidido pela nota: ela vai só como leitura.
 */
export function corpoDaInscricao(cadastro: CadastroConcluido, chave: string): CorpoInscricao {
  const campos: LeadAttributionFields = {};
  for (const [nome, max] of Object.entries(LIMITES_ATRIBUICAO) as Array<[keyof LeadAttributionFields, number]>) {
    const valor = cadastro.atribuicao.fields[nome];
    if (typeof valor === "string" && valor) campos[nome] = corta(valor, max);
  }
  const leadEventId = cadastro.atribuicao.fields.bb_lead_event_id;
  const email = cadastro.email && cadastro.email.length <= 200 ? cadastro.email : undefined;
  const nota =
    typeof cadastro.nota === "number" && Number.isFinite(cadastro.nota)
      ? Math.max(-1000, Math.min(1000, Math.trunc(cadastro.nota)))
      : null;
  return {
    chave,
    nome: corta(cadastro.nome, 120),
    ...(cadastro.barbearia ? { barbearia: corta(cadastro.barbearia, 200) } : {}),
    telefone: corta(cadastro.telefone, 30),
    ...(email ? { email } : {}),
    nota,
    ...(cadastro.clube ? { clube: corta(cadastro.clube, 200) } : {}),
    caminho: cadastro.caminho,
    ...(inteiroPositivo(cadastro.dealId) ? { dealId: cadastro.dealId } : {}),
    ...(inteiroPositivo(cadastro.contactId) ? { contactId: cadastro.contactId } : {}),
    atribuicao: {
      ...(inteiroPositivo(cadastro.atribuicao.originId) ? { originId: cadastro.atribuicao.originId } : {}),
      ...(cadastro.atribuicao.originDesc ? { originDesc: corta(cadastro.atribuicao.originDesc, 500) } : {}),
      ...(leadEventId ? { leadEventId: corta(leadEventId, 120) } : {}),
      campos,
    },
  };
}

type FonteAleatoria = { getRandomValues<T extends Uint8Array>(a: T): T; randomUUID?: () => string };

/**
 * UUID v4 por envio (§2.3). Só o navegador e o OS conhecem. `crypto.randomUUID` não existe em
 * Safari anterior ao 15.4 nem fora de contexto seguro: aí monta o v4 com `getRandomValues`, em vez
 * de lançar depois do cadastro feito (a tela ficaria presa em "Liberando o seu acesso…").
 */
export function novaChave(fonte: FonteAleatoria = globalThis.crypto): string {
  if (typeof fonte.randomUUID === "function") return fonte.randomUUID();
  const b = fonte.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; // versão 4
  b[8] = (b[8] & 0x3f) | 0x80; // variante RFC 4122
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export type ResultadoInscricao =
  | { ok: true; codigo: string; token: string }
  | {
      ok: false;
      motivo: "corpo_invalido" | "limite" | "indisponivel" | "rede" | "resposta_inesperada";
      /** Vale repetir na próxima visita (o corpo fica guardado no aparelho). 400 não vale. */
      guardarPendente: boolean;
    };

export interface OpcoesDeRede {
  fetch?: typeof fetch;
  timeoutMs?: number;
  base?: string;
}

async function chamar(
  caminho: string,
  init: RequestInit & { token?: string },
  opcoes: OpcoesDeRede,
): Promise<{ status: number; corpo: unknown } | { status: 0; corpo: null; erro: string }> {
  const fazerFetch = opcoes.fetch ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opcoes.timeoutMs ?? 10_000);
  const { token, headers, ...resto } = init;
  try {
    const res = await fazerFetch(`${opcoes.base ?? baseDoOS()}${caminho}`, {
      ...resto,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        ...(resto.body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string> | undefined),
      },
    });
    let corpo: unknown = null;
    try {
      corpo = await res.json();
    } catch {
      corpo = null;
    }
    return { status: res.status, corpo };
  } catch (err) {
    return { status: 0, corpo: null, erro: err instanceof Error ? err.name : "erro" };
  } finally {
    clearTimeout(timeout);
  }
}

/** Uma tentativa de inscrição: 201 com código e token válidos, ou o motivo. */
async function tentarInscricao(corpo: CorpoInscricao, opcoes: OpcoesDeRede): Promise<ResultadoInscricao> {
  const r = await chamar("/api/curso/inscricao", { method: "POST", body: JSON.stringify(corpo) }, { timeoutMs: 8_000, ...opcoes });
  if (r.status === 201) {
    const dados = r.corpo as { status?: unknown; codigo?: unknown; token?: unknown } | null;
    if (dados?.status === "inscrito" && typeof dados.codigo === "string" && tokenComFormato(dados.token)) {
      return { ok: true, codigo: dados.codigo, token: dados.token };
    }
    return { ok: false, motivo: "resposta_inesperada", guardarPendente: true };
  }
  if (r.status === 400) return { ok: false, motivo: "corpo_invalido", guardarPendente: false };
  if (r.status === 429) return { ok: false, motivo: "limite", guardarPendente: true };
  if (r.status === 0) return { ok: false, motivo: "rede", guardarPendente: true };
  return { ok: false, motivo: "indisponivel", guardarPendente: true };
}

/**
 * Inscrição com repetição (§2.3): timeout de 8 s e mais 2 tentativas, depois de 1 s e de 3 s,
 * sempre com a MESMA chave. Repete só o que pode dar certo na hora (rede, 5xx, resposta
 * estranha); 400 e 429 param na primeira.
 */
export async function inscreverNoCurso(
  corpo: CorpoInscricao,
  opcoes: OpcoesDeRede & { esperas?: ReadonlyArray<number>; esperar?: (ms: number) => Promise<void> } = {},
): Promise<ResultadoInscricao> {
  const esperas = opcoes.esperas ?? [1_000, 3_000];
  const esperar = opcoes.esperar ?? ((ms: number) => new Promise<void>((ok) => setTimeout(ok, ms)));
  let resultado = await tentarInscricao(corpo, opcoes);
  for (const ms of esperas) {
    if (resultado.ok || resultado.motivo === "corpo_invalido" || resultado.motivo === "limite") break;
    await esperar(ms);
    resultado = await tentarInscricao(corpo, opcoes);
  }
  return resultado;
}

export function guardarInscricaoPendente(storage: Escrita, corpo: CorpoInscricao): void {
  gravar(storage, CHAVE_INSCRICAO_PENDENTE, JSON.stringify(corpo));
}
export function lerInscricaoPendente(storage: Leitura): CorpoInscricao | null {
  const texto = ler(storage, CHAVE_INSCRICAO_PENDENTE);
  if (!texto) return null;
  try {
    const corpo = JSON.parse(texto) as CorpoInscricao;
    return typeof corpo?.chave === "string" && typeof corpo.telefone === "string" ? corpo : null;
  } catch {
    return null;
  }
}
export function apagarInscricaoPendente(storage: Escrita): void {
  apagar(storage, CHAVE_INSCRICAO_PENDENTE);
}

// ─── Rotas da área (§4) ─────────────────────────────────────────────────────────────────────

export type MotivoFalha = "token_invalido" | "invalido" | "limite" | "rede" | "servidor";

export type Resultado<T> = { ok: true; dados: T } | { ok: false; motivo: MotivoFalha; campos?: string[] };

function falha(status: number, corpo: unknown): { ok: false; motivo: MotivoFalha; campos?: string[] } {
  if (status === 401) return { ok: false, motivo: "token_invalido" };
  if (status === 400 || status === 413) {
    const campos = (corpo as { campos?: unknown } | null)?.campos;
    return { ok: false, motivo: "invalido", ...(Array.isArray(campos) ? { campos: campos.filter((c) => typeof c === "string") } : {}) };
  }
  if (status === 429) return { ok: false, motivo: "limite" };
  if (status === 0) return { ok: false, motivo: "rede" };
  return { ok: false, motivo: "servidor" };
}

/** `GET /api/curso/aluno`. 401 (inexistente, revogado ou malformado) = `token_invalido`. */
export async function lerAluno(token: string, opcoes: OpcoesDeRede = {}): Promise<Resultado<EstadoAluno>> {
  if (!tokenComFormato(token)) return { ok: false, motivo: "token_invalido" };
  const r = await chamar("/api/curso/aluno", { method: "GET", token }, opcoes);
  if (r.status !== 200) return falha(r.status, r.corpo);
  const estado = lerEstadoAluno(r.corpo);
  return estado ? { ok: true, dados: estado } : { ok: false, motivo: "servidor" };
}

/**
 * `POST /api/curso/aluno/progresso`. Idempotente no servidor: repetir não muda nada.
 *
 * Sai com `keepalive` (o marco do fim do vídeo chega mesmo se a pessoa fechar a aba). Navegador
 * que recusa `keepalive` com preflight de CORS (o `Authorization` exige preflight) lança
 * `TypeError` na hora: aí repete uma vez sem `keepalive`, para o progresso nunca depender disso.
 * Medido em 06/Out/26: o Chrome 153 aceita; Safari e Firefox não foram medidos.
 */
export async function registrarProgresso(
  token: string,
  aula: NumeroAula,
  marco: Marco,
  opcoes: OpcoesDeRede = {},
): Promise<Resultado<{ marco: number; aulasConcluidas: number }>> {
  const corpo = JSON.stringify({ aula, marco });
  let r = await chamar("/api/curso/aluno/progresso", { method: "POST", token, body: corpo, keepalive: true }, opcoes);
  if (r.status === 0 && "erro" in r && r.erro === "TypeError") {
    r = await chamar("/api/curso/aluno/progresso", { method: "POST", token, body: corpo }, opcoes);
  }
  if (r.status !== 200) return falha(r.status, r.corpo);
  const d = r.corpo as { marco?: unknown; aulasConcluidas?: unknown } | null;
  return { ok: true, dados: { marco: Number(d?.marco ?? marco), aulasConcluidas: Number(d?.aulasConcluidas ?? 0) } };
}

/** `POST /api/curso/aluno/ficha`. Substitui a ficha daquela aula inteira. */
export async function salvarFicha<N extends NumeroAula>(
  token: string,
  aula: N,
  respostas: FichasPorAula[N],
  opcoes: OpcoesDeRede = {},
): Promise<Resultado<{ derivados: Derivados }>> {
  const r = await chamar("/api/curso/aluno/ficha", { method: "POST", token, body: JSON.stringify({ aula, respostas }) }, opcoes);
  if (r.status !== 200) return falha(r.status, r.corpo);
  const derivados = (r.corpo as { derivados?: unknown } | null)?.derivados;
  return { ok: true, dados: { derivados: (derivados && typeof derivados === "object" ? derivados : {}) as Derivados } };
}

/**
 * `POST /api/curso/aluno/sinal`. O navegador só manda `quero_isso` (o servidor cria os outros
 * tipos). `dataQuerComecar` ausente = "ainda não sei a data".
 */
export async function registrarSinal(
  token: string,
  input: { aula: NumeroAula; dataQuerComecar?: string | null },
  opcoes: OpcoesDeRede = {},
): Promise<Resultado<{ status: "registrado" | "ja_registrado" }>> {
  const corpo = { tipo: "quero_isso", aula: input.aula, ...(input.dataQuerComecar ? { dataQuerComecar: input.dataQuerComecar } : {}) };
  const r = await chamar("/api/curso/aluno/sinal", { method: "POST", token, body: JSON.stringify(corpo) }, opcoes);
  if (r.status !== 200) return falha(r.status, r.corpo);
  const status = (r.corpo as { status?: unknown } | null)?.status === "ja_registrado" ? "ja_registrado" : "registrado";
  return { ok: true, dados: { status } };
}

/**
 * `POST /api/curso/link`. O OS responde 202 exista ou não o cadastro (a tela diz "se houver um
 * cadastro…"), então o único resultado que muda a tela é a falha de rede ou de limite.
 */
export async function pedirLink(
  quem: { email: string } | { telefone: string },
  opcoes: OpcoesDeRede = {},
): Promise<Resultado<null>> {
  const r = await chamar("/api/curso/link", { method: "POST", body: JSON.stringify(quem) }, opcoes);
  if (r.status === 202 || r.status === 200) return { ok: true, dados: null };
  return falha(r.status, r.corpo);
}
