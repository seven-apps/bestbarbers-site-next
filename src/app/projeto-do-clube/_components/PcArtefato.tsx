/**
 * ARTEFATO — a imagem de produto desta família, com placeholder que ocupa o lugar exato.
 *
 * Enquanto `PC_ARTEFATOS[id].status` for `"placeholder"`, desenha uma moldura tracejada
 * na proporção do arquivo final, com a palavra PLACEHOLDER e a descrição de produção.
 * Quando virar `"real"`, renderiza `next/image` com o `alt` já escrito. O layout não se
 * mexe na troca — é isso que torna a substituição um diff de uma linha.
 *
 * Não declara `"use client"` de propósito: não tem estado nem handler. Montado dentro de
 * um client component (PcHeroi) ele vai junto no bundle, e o que ele NÃO acrescenta é
 * JS de comportamento — que é o custo que importa em §4.3.
 */

import Image from "next/image";
import { PC_ARTEFATOS } from "./pc-artefatos";
import type { PcArtefatoId } from "./pc.types";
import estilos from "./PcArtefato.module.css";

export interface PcArtefatoProps {
  id: PcArtefatoId;
  /** UMA imagem prioritária por rota (§4.3): a do herói, e só ela. */
  prioridade?: boolean;
  /** `sizes` do next/image: quanto da viewport a imagem ocupa em cada largura. */
  tamanhos?: string;
  className?: string;
}

export function PcArtefato({
  id,
  prioridade = false,
  tamanhos = "(max-width: 900px) 100vw, 520px",
  className = "",
}: PcArtefatoProps) {
  const spec = PC_ARTEFATOS[id];

  // Id fora do registro é erro de programação, não estado de tempo de execução: some
  // da tela em vez de derrubar a página inteira na cara do visitante que veio do anúncio.
  if (!spec) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[projeto-do-clube] artefato desconhecido: "${id}" — confira pc-artefatos.ts`);
    }
    return null;
  }

  const proporcao = { aspectRatio: spec.proporcao };

  if (spec.status === "placeholder") {
    // Em produção a caixa «Placeholder» NÃO vai ao ar: medido em 23/Set/26, ela ocupava
    // metade da dobra do herói no desktop e a primeira tela depois dela no celular — para
    // quem veio do anúncio, é a página dizendo que não está pronta. Sem a imagem, o cartão
    // do herói fica com o cabeçalho e os três passos. Em desenvolvimento ela continua
    // visível, para ninguém esquecer que falta a captura real.
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        className={`${estilos.artefato} ${estilos.placeholder} ${className}`.trim()}
        style={proporcao}
        role="img"
        aria-label={spec.alt}
        data-pc-artefato={spec.id}
        data-pc-status="placeholder"
      >
        <span className={estilos.marca}>Placeholder</span>
        <p className={estilos.descricao}>{spec.descricao}</p>
      </div>
    );
  }

  return (
    <div
      className={`${estilos.artefato} ${estilos.real} ${className}`.trim()}
      style={proporcao}
      data-pc-artefato={spec.id}
      data-pc-status="real"
    >
      <Image
        src={spec.arquivoFinal}
        alt={spec.alt}
        fill
        sizes={tamanhos}
        className={estilos.imagem}
        priority={prioridade}
        fetchPriority={prioridade ? "high" : "auto"}
        loading={prioridade ? undefined : "lazy"}
      />
    </div>
  );
}

export default PcArtefato;
