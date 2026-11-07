"use client";

import { useEffect } from "react";
import { abPaginaDaJanela } from "@/lib/ab-pagina";

/**
 * Chegada pelo endereço fixo `/ir/<teste>` (`lib/ab-pagina.ts`): avisa o GTM qual braço a pessoa está vendo, com
 * o evento `ab_pagina` e o parâmetro `ab_pagina` (o mesmo rótulo do `bb_lp_version` do card e do pixel). É o
 * denominador do teste por braço; o GA4 também vê o braço no `page_location` (`?bb_ab=`), sem configuração.
 * Fora do teste não faz nada.
 */
export function AbPaginaDataLayer() {
  useEffect(() => {
    const abPagina = abPaginaDaJanela();
    if (!abPagina) return;
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "ab_pagina", ab_pagina: abPagina });
  }, []);
  return null;
}
