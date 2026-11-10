// A/B do momento do contato na consultoria (GO do André, 10/Nov/26: "go nas mudanças na consultoria").
// Medido em 08–09/Nov/26 (bestbarbers-ai, daily-log 2026-11-10 09:32): 21 visitas pagas → 9 começaram → 2 deixaram o
// contato; 7 de 9 que começaram saíram antes da tela de contato. Hipótese: pedir o contato cedo segura quem sai no meio.
//
//   fim  (controle) — o fluxo de hoje: as perguntas todas, depois nome e WhatsApp, depois o plano.
//   cedo            — nome e WhatsApp logo depois da pergunta de equipe ("quem"); as outras perguntas vêm depois.
//
// Por que depois do "quem", e não da 1ª resposta: o card nasce com o que o contato tem no envio (a automação do
// Ploomes copia os campos uma vez), e a equipe é o número que decide o estudo do tráfego. Antes do "quem", todo card
// do braço cedo nasceria sem equipe.
//
// Sem React, para os testes. O braço vai no fim do `leadEventId` (`-cons_fim` / `-cons_cedo`), que o Ploomes guarda
// em `bb_lead_event_id`: é o mesmo padrão do teste de formulário da /clube (`-form_ctrl` / `-form_prog`). No pixel, o
// braço vai no NOME do evento, porque a API de estatísticas do pixel conta por nome, não por parâmetro.
import type { Tela } from "./types.ts";

export type BracoContato = "fim" | "cedo";

/** Desligar o sorteio volta todo mundo ao controle sem deploy de código novo (só esta linha). */
export const AB_CONTATO_ATIVO = true;
/** Fração de visitantes no braço cedo. */
export const FRACAO_CEDO = 0.5;
export const COOKIE_AB_CONSULTORIA = "bb_ab_consultoria";
export const DIAS_COOKIE = 30;

function ehBraco(valor: string | null | undefined): valor is BracoContato {
  return valor === "fim" || valor === "cedo";
}

/** `?contato=cedo|fim` força o braço (QA e revisão do André). */
export function bracoForcado(parametro: string | null | undefined): BracoContato | undefined {
  return ehBraco(parametro) ? parametro : undefined;
}

/** O mesmo visitante vê sempre o mesmo braço (cookie); sem cookie válido, sorteia. */
export function bracoDoVisitante(cookie: string | null | undefined, aleatorio: number, ativo = AB_CONTATO_ATIVO): BracoContato {
  if (!ativo) return "fim";
  if (ehBraco(cookie)) return cookie;
  return aleatorio < FRACAO_CEDO ? "cedo" : "fim";
}

/** Sufixo do `leadEventId`: o leitor separa os cards por ele. */
export function sufixoDoBraco(braco: BracoContato): string {
  return `-cons_${braco}`;
}

/** O braço de um `bb_lead_event_id` (o leitor do bestbarbers-ai usa a mesma regra). */
export function bracoDoEventId(eventId: string | null | undefined): BracoContato | undefined {
  const m = (eventId ?? "").match(/-cons_(fim|cedo)$/);
  return m ? (m[1] as BracoContato) : undefined;
}

/** As telas que o pixel conta, por braço. "plano" é a chegada ao plano (o fim). */
export type TelaMedida = Exclude<Tela, "pronto"> | "plano";
export const TELAS_MEDIDAS: readonly TelaMedida[] = [
  "objetivo", "trava", "quem", "assinatura", "faturamento", "meta", "prazo", "contato", "plano",
];

/** Evento do pixel quando a tela aparece. A Meta aceita nome de evento custom com até 40 caracteres. */
export function eventoDaTela(tela: TelaMedida, braco: BracoContato): string {
  return `ConsultoriaTela_${tela}_${braco}`;
}

/** Evento do pixel quando o contato é enviado com sucesso (nome e WhatsApp gravados no Ploomes). */
export function eventoDoContato(braco: BracoContato): string {
  return `ConsultoriaContato_${braco}`;
}
