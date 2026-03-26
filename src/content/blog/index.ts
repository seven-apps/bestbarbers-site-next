import type { BlogArticle } from "./types";
import { nfse2026 } from "./nfse-2026";
import { melhorSistema2026 } from "./melhor-sistema-2026";
import { barbeariaPorAssinatura } from "./barbearia-por-assinatura";
import { comoReduzirFaltas } from "./como-reduzir-faltas";
import { comoCalcularComissao } from "./como-calcular-comissao";

export const articles: BlogArticle[] = [
  nfse2026,
  melhorSistema2026,
  barbeariaPorAssinatura,
  comoReduzirFaltas,
  comoCalcularComissao,
];

export type { BlogArticle } from "./types";
