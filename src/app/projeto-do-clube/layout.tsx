/**
 * CASCA DAS SETE ROTAS de `/projeto-do-clube`. É o primeiro arquivo da família, não
 * o último: sem ele nada da página funciona, e duas coisas quebram em silêncio.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 1. `robots: noindex, nofollow` — MEDIDO, não suposto
 * ────────────────────────────────────────────────────────────────────────────
 * `src/app/robots.ts` faz `allow: "/"` e só proíbe `/api/`, `/_next/`, `/admin/` e
 * `/private/`. `src/app/sitemap.ts` é allow-list explícita e não inclui estas rotas —
 * mas sitemap não impede indexação, só deixa de sugerir. Ou seja: a ÚNICA trava real
 * é este `metadata.robots`. Sem ele, sete páginas de produto entram no índice
 * competindo com `/sistema-para-barbearia` e companhia, e uma delas (`/condicoes`)
 * publica condições comerciais ainda marcadas como pendentes.
 *
 * Por isso ele vive AQUI e em nenhum `page.tsx` (§2.4): sete declarações são sete
 * chances de alguém esquecer uma. Uma só, na casca, cobre as sete por herança.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * 2. O import do CSS e o `<div className="pc">`
 * ────────────────────────────────────────────────────────────────────────────
 * Todo token (`--pc-*`) e toda classe (`.pc-titulo`, `.pc-botao`, `.pc-secao`) vivem
 * sob o escopo `.pc` — é o que impede o sistema visual desta família de vazar para o
 * resto do site e o resto do site de vazar para cá. Este é o único lugar que importa
 * `pc-tokens.css` e o único que abre esse escopo.
 *
 * Detalhe que não é detalhe: as três portas de segurança do `<PcRevelar>` são as
 * regras `.pc [data-pc-revelar]` desse arquivo. Sem o escopo, elas não existem — e
 * conteúdo que deveria aparecer ao rolar pode ficar invisível para sempre.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * O que este arquivo NÃO faz
 * ────────────────────────────────────────────────────────────────────────────
 * Não é server/client boundary novo, não dispara evento e não lê `searchParams`. O
 * `PageView` continua sendo do layout raiz. Nenhuma origem do Ploomes é resolvida
 * aqui — quem resolve é o `useUtmParams`, dentro do formulário (§1.5).
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./_components/pc-tokens.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
  // As sete rotas herdam o canonical "/" do layout raiz se ninguém cancelar. Cada
  // `page.tsx` já faz `alternates: { canonical: null }`; esta linha é a rede embaixo.
  alternates: { canonical: null },
};

export default function ProjetoDoClubeLayout({ children }: { children: ReactNode }) {
  return <div className="pc">{children}</div>;
}
