/**
 * FAQ DO CONTROLE — sete perguntas, todas respondíveis com o que a casa sustenta hoje.
 *
 * O que foi TIRADO do FAQ que está no ar na /v12, e por quê:
 * - A pergunta de fidelidade/garantia/cancelamento não entra (V10 e pendência P1 da
 *   arquitetura): sem comercial e financeiro confirmarem por escrito, publicar resposta
 *   aqui repete exatamente o erro que está no ar.
 * - Saíram os números sem fonte auditável (ticket do assinante, visitas por mês, «82
 *   barbearias migraram», «o investimento se paga no primeiro mês») e os casos de
 *   terceiros com valor e prazo — o acervo proíbe transferir resultado de terceiro.
 * - Saiu a única referência nominal a pessoa (uma resposta citava uma parceira pelo
 *   primeiro nome).
 * - Saiu «em até 30 dias»: promessa de prazo.
 *
 * `<details>`/`<summary>` nativo, de propósito: abre e fecha SEM JAVASCRIPT, responde ao
 * teclado de graça e o navegador já expõe o estado para leitor de tela. Com o JS fora
 * do ar a página continua respondendo as sete perguntas — que é o requisito V6. Não há
 * `useState`, `onClick` nem `aria-expanded` mantido à mão: o acordeão não custa uma
 * linha de JS de comportamento (o módulo entra no bundle porque o orquestrador da
 * página é client component, mas não acrescenta interação a ele).
 *
 * Movimento: a resposta entra com `opacity`+`translateY` (animação de altura é proibida
 * pelo contrato) e a duração sai do token, que colapsa sozinho com `prefers-reduced-motion`.
 */

import { PcRevelar } from "../PcRevelar";
import { CONTROLE_FAQ, CONTROLE_FAQ_TITULO } from "./controle-copy";
import estilos from "./controle.module.css";

export function ControleFaq() {
  return (
    <section
      id="controle-faq"
      style={{
        background: "var(--pc-carvao-fundo)",
        paddingBlock: "var(--pc-secao-y)",
        paddingInline: "var(--pc-secao-x)",
      }}
    >
      <div className={estilos.envelope}>
        <PcRevelar className={`${estilos.secaoCabecalho} ${estilos.secaoCabecalhoCentro}`}>
          <span className={estilos.sobretitulo}>Antes de pedir contato</span>
          <h2 className={estilos.secaoTitulo}>{CONTROLE_FAQ_TITULO}</h2>
        </PcRevelar>

        <div className={estilos.faqLista}>
          {CONTROLE_FAQ.map((item, i) => (
            <PcRevelar key={item.pergunta} atraso={(i % 3) * 90}>
              {/* A primeira nasce aberta: é a pergunta de preço, a que mais chega. */}
              <details className={estilos.faqItem} open={i === 0}>
                <summary className={estilos.faqPergunta}>
                  <span>{item.pergunta}</span>
                  <svg
                    className={estilos.faqSeta}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <p className={estilos.faqResposta}>{item.resposta}</p>
              </details>
            </PcRevelar>
          ))}
        </div>
      </div>
    </section>
  );
}
