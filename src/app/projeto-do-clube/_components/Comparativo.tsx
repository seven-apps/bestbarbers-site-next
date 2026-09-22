/**
 * Comparativo — o que acontece na situação de quem lê e o que acontece com a
 * BestBarbers.
 *
 * REGRA DESTE BLOCO: o comparativo é entre DOIS PROCESSOS, nunca entre dois
 * produtos. Nenhum concorrente é citado — nem pelo nome, nem por apelido, nem
 * por descrição que o identifique. Em `migracao` isso é o que decide a redação:
 * a coluna da esquerda fala do TRABALHO DA TROCA (exportar, reconciliar,
 * reautorizar), nunca de defeito do sistema que a pessoa usa hoje. Dizer «o
 * outro é ruim» seria comparar produtos, que é justamente o que este bloco
 * proíbe — e o dono que escolheu aquele sistema se sentiria corrigido.
 *
 * A coluna «com a BestBarbers» é texto LITERAL da biblioteca aprovada (peça em
 * `fonte` e em `data-pc-fonte`) e por isso NÃO varia por situação: a mesma
 * capacidade de produto respondendo a quatro pontos de partida diferentes. O que
 * varia é a coluna da esquerda — micro-copy nova, estatuto P11, derivada das
 * chamadas aprovadas (L008, L003, L002, L054, L005).
 *
 * Por que variar: a versão anterior era uma constante única, e quem chegava de
 * `migracao` (já tem sistema) lia que resolve o «já pagou?» no caderno, enquanto
 * quem chegava de `abertura` (não abriu ainda) lia sobre «cada assinante, a cada
 * ciclo». O título dizia «hoje» para os quatro. Personalizar o herói e deixar o
 * miolo numa situação só é o que fazia a página perder quem ela tinha atraído.
 *
 * O rodapé é literal e existe de propósito: o bloco termina dizendo o que a
 * cobrança recorrente NÃO resolve. Sem isso, comparativo vira promessa.
 *
 * MOVIMENTO: M1 (PcRevelar, stagger com teto de 4) e M5. A seta entre as colunas
 * nasce desenhada e só encolhe depois que o JS assume — sem JS, ela está lá.
 */

import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import type { PcSituacao } from "./pc.types";

interface PcLinhaComparativo {
  id: string;
  tema: string;
  /** O ponto de partida de quem lê — micro-copy nova (P11), varia por situação. */
  hoje: string;
  /** Texto literal da biblioteca. Igual nas quatro situações. */
  com: string;
  fonte: string;
}

/** A coluna direita e os temas: o que não muda entre as situações. */
const PC_COMPARATIVO_BASE: readonly { id: string; tema: string; com: string; fonte: string }[] = [
  {
    id: "cobranca",
    tema: "A cobrança",
    com: "Na BestBarbers, o cliente autoriza a assinatura no cartão e você acompanha a cobrança recorrente pelo sistema.",
    fonte: "L008",
  },
  {
    id: "datas",
    tema: "As datas",
    com: "A cobrança segue o plano. Você acompanha o que aconteceu.",
    fonte: "L003",
  },
  {
    id: "conferencia",
    tema: "A conferência",
    com: "Veja a cobrança recorrente no cartão da BestBarbers: adesão autorizada, acompanhamento dos pagamentos e orientação para tratar pendências.",
    fonte: "L002",
  },
  {
    id: "comissao",
    tema: "A comissão",
    com: "O produto oferece cálculo de comissão de assinatura. A demonstração deve confirmar como sua regra pode ser aplicada e quais conferências continuam necessárias.",
    fonte: "L054",
  },
  {
    id: "balcao",
    tema: "O balcão",
    com: "Veja na BestBarbers onde consultar o pagamento e como identificar uma pendência.",
    fonte: "L005",
  },
];

/**
 * A coluna da esquerda, por situação. Uma entrada por id de `PC_COMPARATIVO_BASE`
 * — o `Record` obriga quem acrescentar uma linha a escrever as quatro, em vez de
 * deixar três situações caírem num texto que não é delas.
 */
type PcTemaComparativo = "cobranca" | "datas" | "conferencia" | "comissao" | "balcao";

const PC_COMPARATIVO_ESQUERDA: Record<PcSituacao, Record<PcTemaComparativo, string>> = {
  // Quem ainda não se classificou: a rotina manual, que é o denominador comum.
  geral: {
    cobranca: "Uma mensagem de cobrança para cada assinante, a cada ciclo.",
    datas: "Vencimentos espalhados pelo mês, guardados na sua lista de lembretes.",
    conferencia: "O “já pagou?” resolvido no caderno, no print do comprovante ou na memória.",
    comissao: "Uma planilha paralela, refeita do zero a cada fechamento.",
    balcao: "A equipe interrompe o atendimento para perguntar ao dono.",
  },
  // Tem clube e controla na mão: a rotina que ele reconhece sem precisar traduzir.
  manual: {
    cobranca: "Uma mensagem de cobrança para cada assinante, a cada ciclo.",
    datas: "Vencimentos espalhados pelo mês, guardados na sua lista de lembretes.",
    conferencia: "O “já pagou?” resolvido no caderno, no print do comprovante ou na memória.",
    comissao: "Uma planilha paralela, refeita do zero a cada fechamento.",
    balcao: "A equipe interrompe o atendimento para perguntar ao dono.",
  },
  // Já tem sistema: o custo é a TROCA, não o dia a dia. Nada aqui julga a
  // ferramenta atual — descreve o trabalho que qualquer migração dá.
  migracao: {
    cobranca:
      "Trocar de sistema significa pedir de novo a autorização de cobrança de cada assinante.",
    datas:
      "Cada assinante tem o seu dia de vencimento, e a mudança precisa preservar esse calendário.",
    conferencia:
      "O histórico de quem pagou o quê precisa ser exportado e reconciliado antes do primeiro ciclo novo.",
    comissao: "A regra de comissão já configurada precisa ser redesenhada na mudança.",
    balcao: "A equipe já sabe onde consultar hoje, e a troca recomeça esse aprendizado.",
  },
  // Vai abrir: não há assinante, fechamento nem equipe no balcão. Há decisões
  // que precisam estar tomadas antes de existir o primeiro plano vendido.
  abertura: {
    cobranca: "Decidir como o cliente vai pagar o plano todo mês, antes de anunciar a primeira assinatura.",
    datas: "Definir em que dia cada plano vence, antes de existir o primeiro assinante.",
    conferencia:
      "Combinar quem confere o pagamento, e onde essa conferência acontece, antes da primeira cobrança.",
    comissao: "Definir quanto da assinatura remunera o profissional, antes de fechar o primeiro mês.",
    balcao: "Decidir o que a equipe responde quando um cliente perguntar do plano no balcão.",
  },
};

/** Rótulo da coluna da esquerda: quem ainda vai abrir não tem um «hoje». */
const PC_ROTULO_ESQUERDA: Record<PcSituacao, string> = {
  geral: "Hoje",
  manual: "Hoje",
  migracao: "Na troca",
  abertura: "Antes de abrir",
};

/** Título da seção. O antigo dizia «hoje» para as quatro situações. */
const PC_TITULO_COMPARATIVO: Record<PcSituacao, string> = {
  geral: "Como o clube roda hoje. Como ele roda na BestBarbers.",
  manual: "Como o clube roda hoje. Como ele roda na BestBarbers.",
  migracao: "O que a troca de sistema pede. Como o clube roda na BestBarbers.",
  abertura: "O que decidir antes de abrir. Como o clube roda na BestBarbers.",
};

/**
 * Rótulo do rodapé de ressalvas. O TEXTO das ressalvas é literal aprovado
 * (L008, L005) e não muda — muda só o nome do que não se resolve: quem vai
 * abrir não está trocando nada, está começando.
 */
const PC_ROTULO_RESSALVAS: Record<PcSituacao, string> = {
  geral: "O que a troca não resolve",
  manual: "O que a troca não resolve",
  migracao: "O que a troca não resolve",
  abertura: "O que o sistema não resolve",
};

/** Junta a coluna fixa com a coluna da situação, na ordem dos temas. */
function linhasDaSituacao(situacao: PcSituacao): PcLinhaComparativo[] {
  const esquerda = PC_COMPARATIVO_ESQUERDA[situacao];
  return PC_COMPARATIVO_BASE.map((base) => ({
    ...base,
    hoje: esquerda[base.id as PcTemaComparativo],
  }));
}

/** Rodapé literal: o que a troca não resolve. */
const PC_COMPARATIVO_RESSALVAS: { texto: string; fonte: string }[] = [
  {
    texto:
      "A cobrança recorrente reduz a dependência de um novo pedido manual a cada ciclo; pagamentos recusados continuam exigindo tratamento.",
    fonte: "L008",
  },
  {
    texto:
      "O sistema decide todas as exceções sozinho? Não. As regras disponíveis e as decisões humanas precisam ficar claras para sua equipe.",
    fonte: "L005",
  },
];

export interface PcComparativoProps {
  situacao?: PcSituacao;
  id?: string;
  className?: string;
}

export function PcComparativo({
  situacao = "geral",
  id = "pc-comparativo",
  className,
}: PcComparativoProps) {
  const rotuloEsquerda = PC_ROTULO_ESQUERDA[situacao];
  const linhas = linhasDaSituacao(situacao);

  return (
    <PcSecao id={id} fundo="carvao-fundo" className={className}>
      <PcRevelar className="group">
        <p className="pc-rotulo">Dois processos, lado a lado</p>
        <h2 className="pc-titulo pc-titulo--2 mt-3">{PC_TITULO_COMPARATIVO[situacao]}</h2>
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

      <ul className="pc-lista mt-10 grid grid-cols-1 gap-4">
        {linhas.map((linha, i) => (
          <PcRevelar
            key={linha.id}
            como="li"
            atraso={Math.min(i, 3) * 90}
            className="group"
          >
            <div
              data-pc-fonte={linha.fonte}
              className="grid grid-cols-1 items-stretch gap-px overflow-hidden md:grid-cols-[1fr_auto_1fr]"
              style={{
                background: "var(--pc-linha-carvao)",
                border: "1px solid var(--pc-linha-carvao)",
                borderRadius: "var(--pc-r-3)",
              }}
            >
              {/* HOJE — o trabalho na mão, em tom apagado de propósito. */}
              <div
                className="flex flex-col justify-center p-6 sm:p-7"
                style={{ background: "var(--pc-carvao)" }}
              >
                <p className="pc-rotulo" style={{ color: "var(--pc-luz-3)" }}>
                  {rotuloEsquerda} · {linha.tema}
                </p>
                <p className="pc-texto mt-3">{linha.hoje}</p>
              </div>

              {/* A passagem de um processo para o outro. */}
              <div
                className="hidden items-center justify-center px-4 md:flex"
                style={{ background: "var(--pc-carvao)" }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 16"
                  className="h-4 w-6 origin-left scale-x-100 transition-transform group-data-[pc-revelar=pronto]:scale-x-0 group-data-[pc-revelar=visivel]:scale-x-100"
                  style={{
                    transitionDuration: "var(--pc-dur-4)",
                    transitionTimingFunction: "var(--pc-ease-saida)",
                  }}
                >
                  <path
                    d="M0 8h20M15 2l6 6-6 6"
                    fill="none"
                    stroke="var(--pc-ouro)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* COM A BESTBARBERS — sobre papel, o documento que o dono confere.
                  `pc-papel` faz `pc-rotulo` e `pc-texto` virarem tinta sozinhos. */}
              <div
                className="pc-papel flex flex-col justify-center p-6 sm:p-7"
                style={{ background: "var(--pc-papel-alto)" }}
              >
                <p className="pc-rotulo">Com a BestBarbers</p>
                <p className="pc-texto mt-3">{linha.com}</p>
              </div>
            </div>
          </PcRevelar>
        ))}
      </ul>

      <PcRevelar atraso={180}>
        <div className="pc-cartao mt-6">
          <p className="pc-rotulo" style={{ color: "var(--pc-luz-3)" }}>
            {PC_ROTULO_RESSALVAS[situacao]}
          </p>
          <ul className="pc-lista mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {PC_COMPARATIVO_RESSALVAS.map((ressalva) => (
              <li
                key={ressalva.fonte}
                data-pc-fonte={ressalva.fonte}
                className="pc-texto"
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

export { PcComparativo as Comparativo };
