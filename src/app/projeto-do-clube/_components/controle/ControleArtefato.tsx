/**
 * ARTEFATO DO CONTROLE — placeholder desenhado enquanto a imagem não existe.
 *
 * Ordem do André: «se para produzir a página você precisa de uma imagem do sistema,
 * cria com um placeholder e depois a gente substitui». Então nada nesta página trava
 * por falta de captura — o bloco ocupa a proporção EXATA do arquivo final, para que a
 * troca não mexa no layout nem no orçamento de peso.
 *
 * Substituir: põe o `.webp` em `/public/images/projeto-clube/<id>.webp` e troca
 * `status: "placeholder"` → `"real"` em `controle-artefatos.ts`. Uma linha.
 *
 * Não declara `"use client"`: não tem estado nem evento próprio. Como o orquestrador da
 * página é client component, este módulo acaba no bundle do cliente junto com ele — o
 * que ele NÃO acrescenta é JS de comportamento, e é esse o custo que importa aqui.
 */

import Image from "next/image";
import { CONTROLE_ARTEFATOS } from "./controle-artefatos";
import estilos from "./controle.module.css";

interface ControleArtefatoProps {
  id: string;
  /** Só a imagem do herói recebe `true` — §4.3 permite UMA imagem prioritária por rota. */
  prioridade?: boolean;
  /** `sizes` do next/image: quanto da viewport a imagem ocupa em cada largura. */
  tamanhos?: string;
  className?: string;
}

export function ControleArtefato({
  id,
  prioridade = false,
  tamanhos = "(max-width: 900px) 100vw, 520px",
  className = "",
}: ControleArtefatoProps) {
  const spec = CONTROLE_ARTEFATOS[id];

  // Id fora do registro é erro de programação, não estado de tempo de execução:
  // some da tela em vez de derrubar a página inteira para o visitante.
  if (!spec) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[controle] artefato desconhecido: "${id}" — confira controle-artefatos.ts`);
    }
    return null;
  }

  const proporcao = { aspectRatio: spec.proporcao };

  if (spec.status === "placeholder") {
    return (
      <div
        className={`${estilos.artefato} ${estilos.artefatoPlaceholder} ${className}`}
        style={proporcao}
        role="img"
        aria-label={spec.alt}
      >
        <span className={estilos.artefatoMarca}>Placeholder</span>
        <p className={estilos.artefatoDescricao}>{spec.descricao}</p>
      </div>
    );
  }

  return (
    <div className={`${estilos.artefato} ${estilos.artefatoReal} ${className}`} style={proporcao}>
      <Image
        src={spec.arquivoFinal}
        alt={spec.alt}
        fill
        sizes={tamanhos}
        className={estilos.artefatoImagem}
        style={{ objectFit: "cover" }}
        priority={prioridade}
        fetchPriority={prioridade ? "high" : "auto"}
        loading={prioridade ? undefined : "lazy"}
      />
    </div>
  );
}
