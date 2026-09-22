/**
 * MÓDULOS — o que entra no sistema.
 *
 * Sete módulos, e os sete existem: cada um tem página publicada no site
 * (`provaEm` em `controle-copy.ts`). Nenhuma linha aqui é promessa de roadmap.
 * NFS-e entra porque é feature real do produto; DRE e contabilidade prescritiva
 * NÃO entram, porque não são.
 *
 * O bloco também diz, com todas as letras, que o que faz parte do contrato depende
 * dos módulos contratados — é a mesma verdade do bloco de condições, dita no lugar
 * onde a pessoa está formando a expectativa.
 *
 * Movimento M1: o stagger reinicia a cada linha da grade (nunca mais de 3 encadeados),
 * para a quarta linha não entrar meio segundo depois da primeira.
 */

import { PcRevelar } from "../PcRevelar";
import {
  CONTROLE_MODULOS,
  CONTROLE_MODULOS_APOIO,
  CONTROLE_MODULOS_TITULO,
} from "./controle-copy";
import estilos from "./controle.module.css";

export function ControleModulos() {
  return (
    <section
      id="controle-modulos"
      style={{
        background: "var(--pc-carvao)",
        paddingBlock: "var(--pc-secao-y)",
        paddingInline: "var(--pc-secao-x)",
      }}
    >
      <div className={estilos.envelope}>
        <PcRevelar className={estilos.secaoCabecalho}>
          <span className={estilos.sobretitulo}>O produto</span>
          <h2 className={estilos.secaoTitulo}>{CONTROLE_MODULOS_TITULO}</h2>
          <p className={estilos.secaoApoio}>{CONTROLE_MODULOS_APOIO}</p>
        </PcRevelar>

        <div className={estilos.modulosGrade}>
          {CONTROLE_MODULOS.map((modulo, i) => (
            <PcRevelar
              key={modulo.id}
              atraso={(i % 3) * 90}
              className={estilos.moduloCartao}
            >
              <span className={estilos.moduloIndice}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={estilos.moduloNome}>{modulo.nome}</h3>
              <p className={estilos.moduloTexto}>{modulo.texto}</p>
            </PcRevelar>
          ))}
        </div>
      </div>
    </section>
  );
}
