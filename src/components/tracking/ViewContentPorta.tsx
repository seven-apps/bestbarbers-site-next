"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { paramsDaPaginaAtual, portaDaPagina } from "@/lib/tracking/porta";

/**
 * Páginas já disparadas neste carregamento — o componente pode ser remontado pelo
 * App Router (Suspense/params) e um `useRef` novo não seguraria nada. Mesmo padrão
 * do `viewContentDisparado` da /obrigado.
 */
const disparado = new Set<string>();

interface Props {
  /** Nome do conteúdo no Events Manager (ex.: "Blog - Como calcular comissão"). */
  contentName: string;
  contentCategory?: string;
}

/**
 * ViewContent com `porta` para páginas SERVER (blog, feature pages) que não têm
 * `useMetaPixel` no corpo. Só dispara se o pathname estiver em `PORTA_POR_PAGINA`
 * — em página sem porta ele é inerte, então pode ser montado num template sem ruído.
 * Não use em página que já dispara o próprio ViewContent (tabela, calculadoras,
 * iscas, /clube): lá a porta entra como parâmetro no evento existente.
 */
export function ViewContentPorta({ contentName, contentCategory = "conteudo_porta" }: Props) {
  const pathname = usePathname();
  const { trackCustomEvent } = useMetaPixel();

  useEffect(() => {
    if (!pathname || !portaDaPagina(pathname) || disparado.has(pathname)) return;
    disparado.add(pathname);
    void trackCustomEvent("ViewContent", {
      content_name: contentName,
      content_category: contentCategory,
      ...paramsDaPaginaAtual(),
    });
  }, [pathname, contentName, contentCategory, trackCustomEvent]);

  return null;
}
