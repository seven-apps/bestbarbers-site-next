"use client";

/**
 * VARIANTE CURTA DO FORMULÁRIO — o mesmo bloco, mais acima e mais compacto.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * LEIA ANTES DE USAR
 * ────────────────────────────────────────────────────────────────────────────
 * A ordem de blocos do contrato (§2.2) NÃO tem formulário acima da dobra: a
 * página promete no herói, cumpre a promessa (demonstração, exemplo, mecanismo,
 * condições) e só então pede. Este arquivo existe porque a peça carrega
 * `formularioVariante: "curto"` e porque o teste pode querer subir o pedido sem
 * reescrever nada — não porque a composição padrão o use.
 *
 * Ele é uma variante de POSIÇÃO E DENSIDADE, nunca um segundo formulário.
 * Subir o pedido significa MOVER o bloco, não duplicá-lo: dois `useLeadForm` na
 * mesma tela são dois estados, dois dedups de telefone e dois caminhos de envio
 * competindo (V8). Quem montar os dois recebe um `console.error` em
 * desenvolvimento — e, no ar, o visitante vê dois formulários que não sabem um
 * do outro.
 *
 * Por isso o `id` padrão é o MESMO (`pc-formulario`): todo botão da página, o
 * CTA fixo do mobile e o `IntersectionObserver` que o esconde apontam para essa
 * âncora. Se esta variante é a que está na tela, é ela que tem de atender pelo
 * nome. Passe `id` diferente só se souber exatamente por quê.
 *
 * O que muda em relação ao bloco padrão: o cartão é mais estreito, o respiro é
 * menor e o texto de apoio é o curto da peça. Campos, ordem, validação, eventos
 * e destino são IDÊNTICOS — é a mesma função de conversão, e comparar duas
 * posições só é honesto se o resto for igual.
 */

import { PcFormulario, PC_FORMULARIO_ID, type PcFormularioProps } from "./PcFormulario";

export type PcFormularioTopoProps = Omit<PcFormularioProps, "variante">;

export function PcFormularioTopo({ id = PC_FORMULARIO_ID, ...resto }: PcFormularioTopoProps) {
  return <PcFormulario {...resto} id={id} variante="curto" />;
}
