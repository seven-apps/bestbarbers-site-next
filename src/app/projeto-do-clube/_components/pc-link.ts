"use client";

/**
 * NAVEGAÇÃO INTERNA DA FAMÍLIA — a query inteira viaja junto, sempre.
 *
 * POR QUE ISTO EXISTE. Quem chega do anúncio traz `utm_*`, `publico`, `adset_id`,
 * `ad_id`, `fbclid` e companhia na URL. Um `<Link href="/projeto-do-clube/condicoes">`
 * seco joga tudo fora: a pessoa vai ver as condições, volta, preenche — e o lead chega
 * ao Ploomes SEM campanha. Já aconteceu na casa («Forms VS Whats», nov/2025: 357 leads
 * sem campanha). O `useUtmParams` guarda um snapshot em `sessionStorage`, o que reduz o
 * estrago, mas não é desculpa para perder o parâmetro na URL: o `eventSourceUrl` da
 * CAPI e as regras de conversão personalizada da Meta leem a URL, não o storage.
 *
 * Então: TODA navegação interna desta família passa por aqui.
 *
 * DOIS FORMATOS, de propósito:
 *  - `pcHrefCom(search, path)` — função pura. Use quando você já tem a search (num
 *    handler, num efeito, no `onSuccess` do formulário).
 *  - `usePcHref(path)` — hook. Use no RENDER, quando o href precisa estar no atributo.
 *
 * HIDRATAÇÃO. O servidor não tem `window.location.search`. Se o hook devolvesse o path
 * com query já na primeira pintura, o HTML do servidor e o do cliente divergiriam e o
 * React reclamaria do atributo `href`. Por isso o hook devolve o CAMINHO LIMPO no SSR e
 * na primeira pintura, e só depois do mount acrescenta a query — mesmo padrão do resto
 * da casa (`mounted` + `useMemo`). O link funciona nos dois momentos; o que muda é só a
 * atribuição colada, e o clique real sempre acontece depois do mount.
 *
 * `useSearchParams` NÃO é usado aqui: no App Router ele força a rota para renderização
 * dinâmica e exige `<Suspense>` em volta, o que transformaria o fallback na primeira
 * pintura do herói e contrariaria V6 (a dobra nasce pintada, sem esqueleto).
 */

import { useEffect, useMemo, useState } from "react";

/**
 * Cola uma query string inteira num caminho interno.
 *
 * - `search` aceita com ou sem `?`, vazia, ou `"?"` sozinho.
 * - `path` pode já ter query (`/x?a=1`) — aí as duas se juntam com `&`, e o que já
 *   estava no path vence, porque foi escrito por nós.
 * - Hash (`#pc-formulario`) é preservado e continua no fim, onde o navegador o espera.
 * - Nunca devolve `undefined`: link quebrado numa página de tráfego pago é lead perdido.
 */
export function pcHrefCom(search: string, path: string): string {
  const query = (search ?? "").replace(/^\?/, "").trim();
  if (!query) return path;

  const [semHash, hash = ""] = path.split("#");
  const sufixoHash = hash ? `#${hash}` : "";
  const juntor = semHash.includes("?") ? "&" : "?";

  return `${semHash}${juntor}${query}${sufixoHash}`;
}

/**
 * O mesmo, lendo a URL viva. Estável na hidratação (ver cabeçalho).
 *
 * O efeito não tem dependência de rota de propósito: nesta família a query só muda
 * quando a pessoa chega, e nenhuma navegação interna a reescreve — justamente porque
 * todas passam por aqui.
 */
export function usePcHref(path: string): string {
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setBusca(window.location.search);
  }, []);

  return useMemo(() => pcHrefCom(busca, path), [busca, path]);
}

/**
 * A search viva, para quem precisa dela mais de uma vez no mesmo componente (o
 * `PcObrigado` e a `/condicoes` montam três ou quatro links). Mesma garantia de
 * hidratação: string vazia no servidor e na primeira pintura.
 */
export function usePcBusca(): string {
  const [busca, setBusca] = useState("");

  useEffect(() => {
    setBusca(window.location.search);
  }, []);

  return busca;
}
