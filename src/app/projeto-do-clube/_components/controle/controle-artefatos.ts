/**
 * ARTEFATOS DO CONTROLE — agora um PONTEIRO para o registro único da família.
 *
 * Antes (19/Set, manhã) este arquivo tinha cópia própria das especificações, e três ids
 * (`clube-cobranca`, `clube-extrato-comissao`, `nfse-emitida`) existiam nos DOIS
 * registros, com o MESMO `arquivoFinal` e dois `status` independentes. Isso é uma
 * armadilha e não um detalhe: no dia em que a captura chegasse, quem trocasse
 * `"placeholder"` → `"real"` num lugar deixaria o outro para trás, e um braço do teste
 * subiria com imagem e o outro sem — a comparação pararia de medir MENSAGEM.
 *
 * Decisão do integrador: um registro só (`../pc-artefatos.ts`), que já carrega os ids
 * do produto inteiro (agenda, financeiro, totem) além dos do clube. Este arquivo mantém
 * os nomes que o controle importa, para nenhum componente dele precisar mudar.
 *
 * SUBSTITUIR UM PLACEHOLDER continua sendo um diff de uma linha — e agora numa
 * linha só: `../pc-artefatos.ts`, `status: "placeholder"` → `"real"`.
 */

import {
  PC_ARTEFATOS,
  pcArtefatosPendentes,
  type PcArtefatoSpec,
  type PcArtefatoStatus,
} from "../pc-artefatos";

export type ControleArtefatoStatus = PcArtefatoStatus;
export type ControleArtefatoSpec = PcArtefatoSpec;

/** O mesmo registro da família. Referência, não cópia. */
export const CONTROLE_ARTEFATOS: Record<string, ControleArtefatoSpec> = PC_ARTEFATOS;

export type ControleArtefatoId = keyof typeof CONTROLE_ARTEFATOS;

/** Quantos ainda faltam — usado só em desenvolvimento, para o grep achar rápido. */
export function controleArtefatosPendentes(): string[] {
  return pcArtefatosPendentes();
}
