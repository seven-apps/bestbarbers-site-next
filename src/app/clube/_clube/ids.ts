/**
 * Ids de seção da página `/clube/[peca]`. Módulo neutro (sem "use client") de propósito: uma
 * constante exportada de um módulo client chega ao server component como REFERÊNCIA de cliente,
 * não como string — o `id` do herói sairia errado e o CTA fixo voltaria a aparecer na dobra.
 */
export const ID_HEROI = "clube-inicio";
export const ID_PROVA = "clube-prova";
