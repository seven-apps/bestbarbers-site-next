/**
 * FORMULÁRIO PROGRESSIVO do modal de cadastro — pedido do André em 28/Set/26.
 *
 * O formulário é UM só, sem "passo 1 / passo 2": abre com três campos e os outros aparecem
 * à medida que a pessoa preenche. Nada some depois de aparecer.
 *
 *   etapa 1 (abre)            nome do dono · WhatsApp do dono · nome da barbearia
 *   etapa 2 (os 3 preenchidos) e-mail + faturamento, JUNTOS
 *   etapa 3 (faturamento)     sistema
 *   etapa 4 (sistema)         clube
 *   etapa 5 (clube)           profissionais
 *
 * POR QUE O E-MAIL ENTRA JUNTO COM O FATURAMENTO: o e-mail é opcional na validação
 * (`validarEmailOpcional`, vazio nunca barra). Se ele aparecesse sozinho e o próximo campo
 * dependesse dele, quem não quer informar e-mail ficaria preso — o opcional viraria
 * obrigatório sem ninguém decidir isso.
 *
 * É um TESTE por cookie (regra do André de 24/Set/26: hipótese de página se testa no site):
 * metade vê o formulário atual, intocado (`atual`), metade vê o progressivo. O braço NÃO vai
 * no `bb_lp_version`: o placar do ciclo lê o sufixo `-longa` e o e-mail por anúncio usa o
 * valor como chave. Ele vai como marcador no fim do `bb_lead_event_id` (campo técnico do
 * card, que já carrega marcador no teste de reativação) e no NOME dos eventos do pixel.
 *
 * Módulo puro: roda no cliente e no `node --test`.
 */

export const COOKIE_AB_FORM = "bb_ab_form";
export const DIAS_COOKIE_AB_FORM = 30;
/** `?form=atual|progressivo` força o braço (QA e revisão do André). */
export const PARAM_FORM = "form";

export const BRACOS_FORM = ["atual", "progressivo"] as const;
export type BracoForm = (typeof BRACOS_FORM)[number];

/** Os braços que o sorteio distribui HOJE. Mudar aqui é mudar o teste. */
export const BRACOS_FORM_NO_SORTEIO: readonly BracoForm[] = ["atual", "progressivo"];

export function ehBracoForm(valor: unknown): valor is BracoForm {
  return typeof valor === "string" && (BRACOS_FORM as readonly string[]).includes(valor);
}

/** Braço do visitante: o do cookie, se ainda estiver em sorteio; senão sorteia (0 ≤ sorteio < 1). */
export function bracoDoForm(cookie: string | undefined | null, sorteio: number): BracoForm {
  if (ehBracoForm(cookie) && BRACOS_FORM_NO_SORTEIO.includes(cookie)) return cookie;
  const n = BRACOS_FORM_NO_SORTEIO.length;
  const i = Math.min(n - 1, Math.max(0, Math.floor(sorteio * n)));
  return BRACOS_FORM_NO_SORTEIO[i];
}

export function bracoFormForcado(valor: string | null | undefined): BracoForm | undefined {
  return ehBracoForm(valor) ? valor : undefined;
}

/** Lê um cookie de uma string `document.cookie`. */
export function lerCookie(cookies: string, nome: string): string | undefined {
  const par = cookies.split(/;\s*/).find((c) => c.startsWith(nome + "="));
  return par ? decodeURIComponent(par.slice(nome.length + 1)) : undefined;
}

// ── Marcador no card ─────────────────────────────────────────────────────────────────

/** Marcador que vai no fim do `bb_lead_event_id`. Tem `_`, que iniciais de nome não têm. */
export const MARCADOR_FORM: Record<BracoForm, string> = {
  atual: "form_ctrl",
  progressivo: "form_prog",
};

/** Lê o braço de volta de um `bb_lead_event_id` (`<timestamp>-<iniciais>-form_prog`). */
export function bracoDoMarcador(leadEventId: string | null | undefined): BracoForm | null {
  const m = (leadEventId ?? "").match(/-(form_ctrl|form_prog)$/);
  if (!m) return null;
  return m[1] === "form_prog" ? "progressivo" : "atual";
}

// ── Eventos do pixel ─────────────────────────────────────────────────────────────────

/**
 * Os três marcos do funil DENTRO do modal. O braço vai no NOME do evento, e não num
 * parâmetro, porque a contagem por nome é o que a API de estatísticas do pixel devolve;
 * parâmetro customizado não tem leitura por API.
 * Os dois braços emitem os MESMOS três marcos, pela mesma regra — senão a diferença
 * observada seria do instrumento, não do formulário.
 */
export type MarcoForm = "aberto" | "contato" | "enviado";

const NOME_MARCO: Record<MarcoForm, string> = {
  aberto: "FormAberto",
  contato: "FormContato",
  enviado: "FormEnviado",
};
const SUFIXO_BRACO: Record<BracoForm, string> = { atual: "Ctrl", progressivo: "Prog" };

export function eventoDoMarco(marco: MarcoForm, braco: BracoForm): string {
  return NOME_MARCO[marco] + SUFIXO_BRACO[braco];
}

// ── Regra de revelação ───────────────────────────────────────────────────────────────

export interface ValoresForm {
  ownerName: string;
  whatsapp: string;
  barbershopName: string;
  email: string;
  monthlyRevenue: string;
  currentSystem: string;
  clubStatus: string;
  employeeCount: string;
}

export type CampoForm = keyof ValoresForm;

export const ETAPA_INICIAL = 1;
export const ETAPA_FINAL = 5;
export type Etapa = 1 | 2 | 3 | 4 | 5;

/** Texto curto não libera nada: uma letra não é nome. */
const MIN_LETRAS = 2;
const preenchido = (v: string | undefined) => (v ?? "").trim().length >= MIN_LETRAS;
const escolhido = (v: string | undefined) => (v ?? "").trim().length > 0;

/** Os três campos de contato da primeira tela estão preenchidos? */
export function contatoCompleto(v: ValoresForm, telefoneValido: boolean): boolean {
  return preenchido(v.ownerName) && telefoneValido && preenchido(v.barbershopName);
}

/** Até que etapa os DADOS já liberam. Não olha o e-mail: opcional nunca é portão. */
export function etapaLiberada(v: ValoresForm, telefoneValido: boolean): Etapa {
  if (!contatoCompleto(v, telefoneValido)) return 1;
  if (!escolhido(v.monthlyRevenue)) return 2;
  if (!escolhido(v.currentSystem)) return 3;
  if (!escolhido(v.clubStatus)) return 4;
  return 5;
}

/** A etapa na tela só cresce: campo que apareceu não some, mesmo se um anterior for apagado. */
export function proximaEtapa(atual: Etapa, v: ValoresForm, telefoneValido: boolean): Etapa {
  const liberada = etapaLiberada(v, telefoneValido);
  return liberada > atual ? liberada : atual;
}

/** Em que etapa cada campo aparece. */
export const ETAPA_DO_CAMPO: Record<CampoForm, Etapa> = {
  ownerName: 1,
  whatsapp: 1,
  barbershopName: 1,
  email: 2,
  monthlyRevenue: 2,
  currentSystem: 3,
  clubStatus: 4,
  employeeCount: 5,
};

/** Quantas das quatro perguntas de qualificação estão na tela em cada etapa. */
export function perguntasVisiveis(etapa: Etapa): number {
  return Math.max(0, etapa - 1);
}

/** Ordem de leitura do formulário progressivo, de cima para baixo. */
export const ORDEM_DOS_CAMPOS: readonly CampoForm[] = [
  "ownerName",
  "whatsapp",
  "barbershopName",
  "email",
  "monthlyRevenue",
  "currentSystem",
  "clubStatus",
  "employeeCount",
];

/**
 * O primeiro campo OBRIGATÓRIO que ainda falta, na ordem da tela. É para onde o botão leva
 * quem clica antes da hora: revela e foca, em vez de acusar erro de campo que a pessoa
 * nunca viu. `null` = pode enviar.
 */
export function primeiroPendente(v: ValoresForm, telefoneValido: boolean): CampoForm | null {
  if (!preenchido(v.ownerName)) return "ownerName";
  if (!telefoneValido) return "whatsapp";
  if (!preenchido(v.barbershopName)) return "barbershopName";
  if (!escolhido(v.monthlyRevenue)) return "monthlyRevenue";
  if (!escolhido(v.currentSystem)) return "currentSystem";
  if (!escolhido(v.clubStatus)) return "clubStatus";
  if (!escolhido(v.employeeCount)) return "employeeCount";
  return null;
}

// ── Rótulos do braço progressivo (texto do André, 28/Set/26) ─────────────────────────

export const CAMPOS_DE_CONTATO_PROGRESSIVO = [
  { name: "ownerName", label: "Nome do dono da barbearia", placeholder: "Ex: João Silva", type: "text", autoComplete: "name" },
  { name: "whatsapp", label: "WhatsApp do dono da barbearia", placeholder: "(11) 99999-9999", type: "tel", autoComplete: "tel-national" },
  { name: "barbershopName", label: "Nome da barbearia", placeholder: "Ex: Barbearia do João", type: "text", autoComplete: "organization" },
  { name: "email", label: "Seu e-mail", placeholder: "Ex: joao@email.com", type: "email", autoComplete: "email" },
] as const satisfies readonly { name: CampoForm; label: string; placeholder: string; type: string; autoComplete: string }[];
