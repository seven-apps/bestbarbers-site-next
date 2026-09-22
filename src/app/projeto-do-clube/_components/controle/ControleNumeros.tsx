/**
 * NÚMEROS DA PLATAFORMA — os quatro oficiais (1.200+ barbearias · 51K+ assinantes ·
 * R$5M+ processados/mês · 6M+ agendamentos/mês).
 *
 * Movimento M2: `PcNumero` conta na entrada. O SSR imprime o número FINAL e, com
 * `prefers-reduced-motion`, o contador nem monta — nunca pisca zero.
 *
 * A ressalva abaixo dos cartões é parte da peça, não rodapé decorativo: o acervo
 * proíbe transferir resultado de terceiro para quem lê. Número da plataforma diz o
 * tamanho da operação contratada; não promete faturamento a ninguém.
 */

import { PcNumero } from "../PcNumero";
import { PcRevelar } from "../PcRevelar";
import { CONTROLE_NUMEROS, CONTROLE_NUMEROS_RESSALVA } from "./controle-copy";
import estilos from "./controle.module.css";

export function ControleNumeros() {
  return (
    <section
      className={estilos.numeros}
      style={{ paddingBlock: "var(--pc-secao-y)", paddingInline: "var(--pc-secao-x)" }}
    >
      <div className={estilos.envelope}>
        <div className={estilos.numerosGrade}>
          {CONTROLE_NUMEROS.map((n, i) => (
            <PcRevelar key={n.rotulo} atraso={i * 90} className={estilos.numeroCartao}>
              <span className={estilos.numeroValor}>
                <PcNumero valor={n.valor} prefixo={n.prefixo} sufixo={n.sufixo} />
              </span>
              <span className={estilos.numeroTraco} aria-hidden="true" />
              <p className={estilos.numeroRotulo}>{n.rotulo}</p>
              <p className={estilos.numeroApoio}>{n.apoio}</p>
            </PcRevelar>
          ))}
        </div>

        <p className={estilos.numerosRessalva}>{CONTROLE_NUMEROS_RESSALVA}</p>
      </div>
    </section>
  );
}
