"use client";

import { LeadFormModal } from "@/components/sections/LeadFormModal";
import { ORIGEM_QUERO, TEMAS_QUERO, descricaoDoQuero, type ChaveTemaQuero } from "@/lib/quero-stories";

/** O formulário aberto na página não fecha: o `onClose` existe só porque o modal pede um. */
const SEM_FECHAR = () => {};

/**
 * O formulário do modal do app próprio, aberto na página (`inline`): mesmos campos, mesma ordem, mesmo envio
 * (`useLeadForm`) e mesma confirmação no botão. Só o título e o texto do botão mudam com o tema do story.
 * Origem: `?origin=` da URL vence; sem ele, 120004089 ("Instagram - Link da bio"), regra em `LeadFormModal`.
 */
export function FormularioQuero({ tema }: { tema: ChaveTemaQuero }) {
  const { titulo, botao } = TEMAS_QUERO[tema];
  return (
    <LeadFormModal
      inline
      isOpen
      onClose={SEM_FECHAR}
      originId={ORIGEM_QUERO}
      originDesc={descricaoDoQuero(tema)}
      titulo={titulo}
      textoBotao={botao}
    />
  );
}
