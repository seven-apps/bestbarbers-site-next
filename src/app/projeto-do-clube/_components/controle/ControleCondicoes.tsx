/**
 * INVESTIMENTO E CONDIÇÕES — bloco de preço.
 *
 * O texto é LITERAL da biblioteca de copy aprovada (seção «Investimento e condições»,
 * idêntica nas 100 peças do acervo). Não reescrever: é ele que autoriza dizer «a partir
 * de R$299» em página pública, porque diz na mesma frase o que o valor não cobre.
 *
 * O que NÃO está aqui, e por quê:
 * - «Sem fidelidade» e «cancele quando quiser»: condição comercial não confirmada.
 *   O texto literal já cita contrato e condições de cancelamento como assunto
 *   apresentado ANTES do agendamento — que é a verdade que o comercial sustenta hoje.
 * - «Implantação 100% gratuita» e «zero de implantação»: condição de oferta que o
 *   comercial precisa confirmar por escrito antes de voltar a uma página.
 * - Comparação de preço com «outros sistemas»: o número que está no ar (R$3.000 a
 *   R$5.000) não tem fonte auditável.
 *
 * Sobre papel, de propósito: o bloco de dinheiro é o documento que o dono confere.
 */

import { PcRevelar } from "../PcRevelar";
import { CONTROLE_CONDICOES } from "./controle-copy";
import estilos from "./controle.module.css";

interface ControleCondicoesProps {
  hrefCondicoes: string;
  aoAbrirCondicoes: () => void;
}

export function ControleCondicoes({ hrefCondicoes, aoAbrirCondicoes }: ControleCondicoesProps) {
  return (
    <section
      id="controle-condicoes"
      className="pc-papel"
      style={{ paddingBlock: "var(--pc-secao-y)", paddingInline: "var(--pc-secao-x)" }}
    >
      <div className={estilos.envelope}>
        <PcRevelar className={estilos.condicoesCartao}>
          <h2 className={estilos.condicoesTitulo}>{CONTROLE_CONDICOES.titulo}</h2>
          <p className={estilos.condicoesTexto}>{CONTROLE_CONDICOES.texto}</p>
          <a href={hrefCondicoes} className={estilos.condicoesLink} onClick={aoAbrirCondicoes}>
            {CONTROLE_CONDICOES.link}
          </a>
        </PcRevelar>
      </div>
    </section>
  );
}
