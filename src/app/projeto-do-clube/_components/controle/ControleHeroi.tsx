/**
 * HERÓI DO CONTROLE — acima da dobra.
 *
 * NASCE PINTADO: nenhum `PcRevelar` aqui (V6/§4.1 — nada acima da dobra depende de JS
 * para aparecer). O único movimento é o flutuar ambiental do artefato (M6) e o
 * `:hover` dos botões (M5) — os dois em CSS, zero JS por elemento.
 *
 * O que ele NÃO tem, e por quê:
 * - Nenhum selo de urgência («oferta limitada», «por tempo limitado»): urgência
 *   inventada é proibição escrita do acervo, e não havia prazo real por trás dela.
 * - Nenhuma linha «sem fidelidade · cancele quando quiser»: condição comercial não
 *   confirmada, hoje no ar na /v12 (HeroV12.tsx:231).
 * - Nenhum superlativo de mercado: sem fonte auditável, vira afirmação sem âncora.
 */

import { ControleArtefato } from "./ControleArtefato";
import {
  CONTROLE_NOTA_PRECO,
  CONTROLE_PECA,
  CONTROLE_SOBRETITULO,
} from "./controle-copy";
import estilos from "./controle.module.css";

interface ControleHeroiProps {
  hrefCondicoes: string;
  aoPedirContato: () => void;
  aoVerCondicoes: () => void;
}

export function ControleHeroi({
  hrefCondicoes,
  aoPedirContato,
  aoVerCondicoes,
}: ControleHeroiProps) {
  return (
    <section
      className={estilos.heroi}
      style={{
        paddingBlock: "calc(var(--pc-secao-y) + var(--pc-e-8)) var(--pc-secao-y)",
        paddingInline: "var(--pc-secao-x)",
      }}
    >
      <div className={`${estilos.envelope} ${estilos.heroiGrade}`}>
        <div className={estilos.heroiTexto}>
          <span className={estilos.sobretitulo}>{CONTROLE_SOBRETITULO}</span>

          <h1 className={estilos.heroiTitulo}>
            Seu app, com a <span className={estilos.heroiTituloMarca}>sua marca</span>. E o
            sistema que roda a barbearia por trás dele.
          </h1>

          <p className={estilos.heroiApoio}>{CONTROLE_PECA.apoio}</p>

          <div className={estilos.heroiAcoes}>
            <button type="button" className={estilos.botaoAcao} onClick={aoPedirContato}>
              {CONTROLE_PECA.botaoPrincipal}
            </button>
            <a
              href={hrefCondicoes}
              className={estilos.botaoSecundario}
              onClick={aoVerCondicoes}
            >
              Ver investimento e condições
            </a>
          </div>

          <p className={estilos.notaPreco}>
            {CONTROLE_NOTA_PRECO}{" "}
            <a href={hrefCondicoes} className={estilos.notaPrecoLink} onClick={aoVerCondicoes}>
              Ver a página de condições
            </a>
            .
          </p>
        </div>

        <div className={estilos.heroiArte}>
          {/* M6 — loop ambiental de 4s, a ÚNICA animação em laço desta dobra (o teto é 2).
              `animate-float` é classe de `globals.css` e já morre sozinha sob
              `prefers-reduced-motion` (globals.css:287).
              TODO(asset): produto-app-marca — app com marca fictícia na tela de agendamento */}
          <div className={`${estilos.heroiArteFlutua} animate-float`}>
            <ControleArtefato
              id="produto-app-marca"
              prioridade
              tamanhos="(max-width: 900px) 78vw, 340px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
