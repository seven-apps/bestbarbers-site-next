/**
 * Numeros — os números verificáveis da BestBarbers, com contador animado (M2).
 *
 * PROCEDÊNCIA (regra desta tarefa: só entra número confirmado no `knowledge/`).
 * Os quatro agregados abaixo são os NÚMEROS PÚBLICOS OFICIAIS da marca, escritos
 * em três lugares independentes do repositório de conhecimento:
 *
 *   knowledge/dominio/competitors-intel.md:45
 *     «Escala real e verificável (números oficiais da marca): 1.200+ barbearias,
 *      51.000+ assinantes, R$5M+/mês, 6M+ agendamentos/mês»
 *   knowledge/marketing/instagram-voz-do-time.md:253
 *     «Zero número fabricado. Agregados só os oficiais: 1.200+ barbearias ·
 *      51.000+ assinantes · R$5M+/mês · 6M+ agendamentos/mês»
 *   knowledge/marketing/stories-instagram-playbook.md:15 e :199
 *     «Números públicos = 1.200+ barbearias · 51.000+ assinantes · R$5M+/mês ·
 *      6M+ agendamentos»
 *
 * A fonte de cada item sai no DOM (`data-pc-fonte`) para conferência.
 *
 * O QUE NÃO ENTROU, DE PROPÓSITO:
 * - retenção, LTV, permanência e densidade de uso — `dominio/cases-clube.json`
 *   marca os quatro como INTERNOS, «NUNCA peça pública»;
 * - receita de barbearia (mediana, all-time) — a biblioteca de copy proíbe
 *   transferir resultado financeiro de terceiro para a BestBarbers, e um número
 *   desses ao lado de um formulário é lido como promessa;
 * - qualquer número que eu não tenha achado escrito no `knowledge/`.
 *
 * GUARDAS: nenhum número por barbearia · nenhum resultado de terceiro · nenhum
 * nome de cliente, parceiro ou concorrente · nenhuma promessa de prazo. O
 * rodapé literal existe para o bloco de prova não ser lido como previsão.
 *
 * MOVIMENTO: M2 (PcNumero conta ao entrar na tela; o SSR imprime o número final
 * e, sob `prefers-reduced-motion`, ele nunca pisca 0) e M1 (stagger de 90 ms).
 */

import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import { PcNumero } from "./PcNumero";
import { NUMEROS_OFICIAIS, type NumeroOficialId } from "@/lib/numeros-oficiais";

function doOficial(id: NumeroOficialId) {
  const { valor, rotulo, fonte } = NUMEROS_OFICIAIS[id];
  return { valor, rotulo, fonte };
}

interface PcNumeroVerificado {
  id: string;
  valor: number;
  prefixo?: string;
  sufixo?: string;
  /** O que o número conta, em uma linha. */
  rotulo: string;
  /** Onde ele está confirmado. */
  fonte: string;
}

/**
 * Valor, rótulo e fonte vêm de `@/lib/numeros-oficiais` — a MESMA fonte que as
 * páginas `/clube/[peca]` usam. Aqui só se escolhe a ordem e a moldura do contador.
 */
const PC_NUMEROS: PcNumeroVerificado[] = [
  { id: "barbearias", sufixo: "+", ...doOficial("barbearias") },
  { id: "assinantes", sufixo: "+", ...doOficial("assinantes") },
  { id: "processado", prefixo: "R$ ", sufixo: " mi+", ...doOficial("processado") },
  { id: "agendamentos", sufixo: " mi+", ...doOficial("agendamentos") },
];

/** Rodapé literal da biblioteca aprovada: o que estes números NÃO dizem. */
const PC_NUMEROS_RESSALVAS: { texto: string; fonte: string }[] = [
  {
    // L073 («Vocês garantem faturamento com o clube?») fica com o Fronteira: o
    // mesmo literal duas vezes na mesma página é repetição, não reforço.
    texto:
      "Toda mudança mostrada foi causada pelo sistema? Não podemos presumir isso. O contexto e outras ações precisam ser considerados antes de atribuir um resultado.",
    fonte: "L093",
  },
  {
    texto:
      "Casos precisam de contexto e evidência; resultados de outra operação não são uma previsão para a sua.",
    fonte: "L076",
  },
];

export interface PcNumerosProps {
  id?: string;
  className?: string;
}

export function PcNumeros({ id = "pc-numeros", className }: PcNumerosProps) {
  return (
    <PcSecao id={id} fundo="carvao-fundo" className={className}>
      <PcRevelar className="group">
        <p className="pc-rotulo">Números agregados da plataforma</p>
        <h2 className="pc-titulo pc-titulo--2 mt-3">
          O tamanho da operação que você vai contratar
        </h2>
        <span
          aria-hidden="true"
          className="mt-5 block h-px w-24 origin-left scale-x-100 transition-transform group-data-[pc-revelar=pronto]:scale-x-0 group-data-[pc-revelar=visivel]:scale-x-100"
          style={{
            background: "var(--pc-ouro)",
            transitionDuration: "var(--pc-dur-4)",
            transitionTimingFunction: "var(--pc-ease-saida)",
          }}
        />
      </PcRevelar>

      <ul className="pc-lista mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PC_NUMEROS.map((numero, i) => (
          <PcRevelar
            key={numero.id}
            como="li"
            atraso={Math.min(i, 3) * 90}
            className="group h-full"
          >
            <div
              data-pc-fonte={numero.fonte}
              className="pc-cartao flex h-full flex-col transition-transform hover:-translate-y-px"
              style={{ transitionDuration: "var(--pc-dur-1)" }}
            >
              {/* A cor do número vem por herança: PcNumero só aceita className. */}
              <div style={{ color: "var(--pc-ouro)" }}>
                <PcNumero
                  valor={numero.valor}
                  prefixo={numero.prefixo}
                  sufixo={numero.sufixo}
                />
              </div>

              <span
                aria-hidden="true"
                className="mt-4 block h-px w-full origin-left scale-x-100 transition-transform group-data-[pc-revelar=pronto]:scale-x-0 group-data-[pc-revelar=visivel]:scale-x-100"
                style={{
                  background: "var(--pc-linha-carvao)",
                  transitionDuration: "var(--pc-dur-4)",
                  transitionTimingFunction: "var(--pc-ease-saida)",
                }}
              />

              <p className="pc-texto mt-4">{numero.rotulo}</p>
            </div>
          </PcRevelar>
        ))}
      </ul>

      <PcRevelar atraso={180}>
        <div className="pc-cartao mt-6">
          <p className="pc-texto" style={{ color: "var(--pc-luz)" }}>
            São agregados da plataforma inteira, informados pela BestBarbers, e
            são pisos: “mais de”. Não são média por barbearia nem projeção para a
            sua.
          </p>
          <ul className="pc-lista mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {PC_NUMEROS_RESSALVAS.map((ressalva) => (
              <li
                key={ressalva.fonte}
                data-pc-fonte={ressalva.fonte}
                className="pc-texto pc-texto--suave"
              >
                {ressalva.texto}
              </li>
            ))}
          </ul>
        </div>
      </PcRevelar>
    </PcSecao>
  );
}

export { PcNumeros as Numeros };
