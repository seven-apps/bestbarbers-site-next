import type { BlogArticle } from "./types";
import { nfse2026 } from "./nfse-2026";
import { melhorSistema2026 } from "./melhor-sistema-2026";
import { barbeariaPorAssinatura } from "./barbearia-por-assinatura";
import { comoReduzirFaltas } from "./como-reduzir-faltas";
import { comoCalcularComissao } from "./como-calcular-comissao";
import { barbeariaPilotoAutomatico } from "./barbearia-piloto-automatico";
import { clubeAssinaturaBarbearia } from "./clube-assinatura-barbearia";
import { precificarClubeAssinatura } from "./precificar-clube-assinatura-barbearia";
import { onboardingAssinante } from "./onboarding-assinante-clube-barbearia";
import { gestaoFinanceira } from "./gestao-financeira-barbearia";
import { inadimplenciaBarbearia } from "./inadimplencia-barbearia-como-cobrar";
import { case290Assinantes } from "./case-barbearia-290-assinantes-clube";
import { comissaoBarbeiroQuantoPagar } from "./quanto-pagar-comissao-barbeiro";

export const articles: BlogArticle[] = [
  nfse2026,
  melhorSistema2026,
  barbeariaPorAssinatura,
  comoReduzirFaltas,
  comoCalcularComissao,
  barbeariaPilotoAutomatico,
  clubeAssinaturaBarbearia,
  precificarClubeAssinatura,
  onboardingAssinante,
  gestaoFinanceira,
  inadimplenciaBarbearia,
  case290Assinantes,
  comissaoBarbeiroQuantoPagar,
];

export type { BlogArticle } from "./types";
