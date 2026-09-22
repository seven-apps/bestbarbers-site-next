/**
 * Objecoes — o meio da página, onde o dono decide se confia.
 *
 * CONTRATO DE COPY (§9 do 00-ARQUITETURA.md): toda RESPOSTA visível aqui é texto
 * LITERAL da biblioteca aprovada (`biblioteca-copy/LANDING-PAGES.md`). A peça de
 * origem viaja em `fonte` e sai no DOM como `data-pc-fonte`, para o gate de
 * aceite conferir a procedência sem abrir o código.
 *
 * O único texto NOVO deste arquivo são as cinco frases na voz do dono
 * («Minha equipe não vai querer.»), os rótulos e o título da seção — micro-copy
 * nova, do mesmo estatuto da pendência P11: o comercial revisa, a troca é de
 * uma linha.
 *
 * GUARDAS
 * - V10 / P1: nenhuma resposta sobre fidelidade, garantia ou prazo de
 *   cancelamento. «E se eu quiser sair» é respondida pelo literal de condições
 *   (100/100 do acervo): elas chegam por escrito ANTES do agendamento.
 * - Zero promessa de resultado ou de prazo · zero feature inexistente · zero
 *   nome de cliente, parceiro ou concorrente.
 *
 * MOVIMENTO: só M1 (PcRevelar, stagger de 90 ms com teto de 4) e M5 (transform
 * no hover, CSS puro). Nada nasce invisível — quem esconde é o JS, depois.
 */

import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import type { PcSituacao } from "./pc.types";

interface PcObjecaoPar {
  /** Pergunta literal da peça de origem. */
  pergunta: string;
  /** Resposta literal da peça de origem. */
  resposta: string;
  /** Id da peça na biblioteca (L###) ou o bloco comum de origem. */
  fonte: string;
}

interface PcObjecaoItem {
  id: string;
  /** Rótulo temático — micro-copy nova (P11). */
  rotulo: string;
  /** A objeção nas palavras do dono — micro-copy nova (P11). */
  frase: string;
  principal: PcObjecaoPar;
  /** Segunda camada, só onde ela muda a decisão. */
  apoio?: PcObjecaoPar;
}

/** As cinco objeções reais, cada uma com a resposta honesta do acervo. */
const PC_OBJECOES: PcObjecaoItem[] = [
  {
    id: "equipe",
    rotulo: "A equipe",
    frase: "Minha equipe não vai querer.",
    principal: {
      pergunta: "Vocês convencem minha equipe por mim?",
      resposta:
        "Não é essa a promessa. Podemos avaliar e demonstrar o produto; a gestão da equipe continua com a barbearia.",
      fonte: "L058",
    },
    apoio: {
      pergunta: "A equipe aprende só de receber o acesso?",
      resposta:
        "Não devemos contar com isso. A preparação e as responsabilidades precisam ser combinadas antes da mudança.",
      fonte: "L017",
    },
  },
  {
    id: "cliente",
    rotulo: "O cliente",
    frase: "Meu cliente não vai assinar.",
    principal: {
      pergunta: "Vocês dizem quantos assinantes eu vou conseguir?",
      resposta:
        "Não. O resultado depende também de procura, oferta e execução. Podemos avaliar o produto e a preparação necessária.",
      fonte: "L048",
    },
    apoio: {
      pergunta: "Todo assinante significa receita a mais?",
      resposta:
        "Não. Parte da mensalidade pode substituir pagamentos anteriores. O resultado depende dessa comparação e do uso do plano.",
      fonte: "L042",
    },
  },
  {
    id: "tentativa",
    rotulo: "A tentativa anterior",
    frase: "Já tentei e não deu certo.",
    principal: {
      pergunta: "Trocar o sistema garante que a próxima tentativa dará certo?",
      resposta:
        "Não. Primeiro precisamos entender a causa e o que precisa mudar. Pode ser necessário rever a oferta ou adiar o clube.",
      fonte: "L071",
    },
    apoio: {
      pergunta: "Meu histórico ruim impede uma avaliação?",
      resposta:
        "Não. Ele ajuda a entender a necessidade. O importante é não presumir que o mesmo caminho dará um resultado diferente sem mudanças reais.",
      fonte: "L080",
    },
  },
  {
    id: "refazer",
    rotulo: "A mudança",
    frase: "Vou ter que refazer tudo.",
    principal: {
      pergunta: "Preciso mudar tudo de uma vez?",
      resposta:
        "O caminho depende da análise técnica e operacional. A sequência e as responsabilidades devem ser combinadas antes da implantação.",
      fonte: "L009",
    },
    apoio: {
      pergunta: "Os cartões dos clientes são transferidos?",
      resposta:
        "Não conte com isso sem confirmação técnica. Uma nova adesão pode ser necessária e deve entrar no planejamento.",
      fonte: "L011",
    },
  },
  {
    id: "saida",
    rotulo: "Contrato e saída",
    frase: "E se eu quiser sair?",
    principal: {
      // V10 / P1: prazo, multa e condição de saída NÃO são respondidos em página
      // pública sem comercial e financeiro — foi esse tipo de improviso que
      // colocou promessa de ausência de fidelidade no ar na /v12. O literal de
      // condições diz o que é verdade hoje: elas chegam por escrito antes do
      // agendamento.
      pergunta: "Quando eu fico sabendo do contrato e do cancelamento?",
      resposta:
        "Mensalidade, taxas, recebimento, contrato e condições de cancelamento são apresentados antes do agendamento.",
      fonte: "bloco-condicoes",
    },
    apoio: {
      pergunta: "Existe obrigação de fechar na reunião?",
      resposta:
        "Não. A decisão depende da proposta e do aceite. Não há ultimato comercial criado por esta página.",
      fonte: "L079",
    },
  },
];

/**
 * Ordem por situação: a objeção que pesa mais naquela porta abre o bloco.
 * Só reordena — nenhum texto muda entre as rotas.
 */
const PC_ORDEM_OBJECOES: Record<PcSituacao, string[]> = {
  geral: ["equipe", "cliente", "tentativa", "refazer", "saida"],
  manual: ["refazer", "equipe", "cliente", "tentativa", "saida"],
  migracao: ["refazer", "tentativa", "equipe", "cliente", "saida"],
  abertura: ["cliente", "equipe", "refazer", "tentativa", "saida"],
};

function objecoesOrdenadas(situacao: PcSituacao): PcObjecaoItem[] {
  const ordem = PC_ORDEM_OBJECOES[situacao] ?? PC_ORDEM_OBJECOES.geral;
  return ordem
    .map((id) => PC_OBJECOES.find((objecao) => objecao.id === id))
    .filter((objecao): objecao is PcObjecaoItem => Boolean(objecao));
}

export interface PcObjecoesProps {
  situacao?: PcSituacao;
  id?: string;
  className?: string;
}

export function PcObjecoes({
  situacao = "geral",
  id = "pc-objecoes",
  className,
}: PcObjecoesProps) {
  const itens = objecoesOrdenadas(situacao);

  return (
    <PcSecao id={id} fundo="carvao" className={className}>
      <PcRevelar className="group">
        <p className="pc-rotulo">Perguntas difíceis</p>
        <h2 className="pc-titulo pc-titulo--2 mt-3">
          As dúvidas que costumam travar a decisão
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
        <p className="pc-texto mt-5">
          Abaixo está a mesma resposta que o time dá na conversa. Nenhuma delas
          promete resultado.
        </p>
      </PcRevelar>

      <ul className="pc-lista mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {itens.map((item, i) => (
          <PcRevelar
            key={item.id}
            como="li"
            atraso={Math.min(i, 3) * 90}
            className="h-full"
          >
            <article
              data-pc-fonte={item.principal.fonte}
              className="pc-cartao flex h-full flex-col transition-transform hover:-translate-y-px"
              style={{ transitionDuration: "var(--pc-dur-1)" }}
            >
              <p className="pc-rotulo" style={{ color: "var(--pc-luz-3)" }}>
                {item.rotulo}
              </p>

              {/* Micro-copy nova (P11): a objeção nas palavras do dono. */}
              <h3
                className="pc-titulo pc-titulo--3 mt-3"
                style={{ color: "var(--pc-ouro)" }}
              >
                “{item.frase}”
              </h3>

              <p className="pc-texto mt-5" style={{ color: "var(--pc-luz)" }}>
                {item.principal.pergunta}
              </p>
              <p className="pc-texto mt-2">{item.principal.resposta}</p>

              {item.apoio ? (
                <div
                  className="mt-6 pt-5"
                  data-pc-fonte={item.apoio.fonte}
                  style={{ borderTop: "1px solid var(--pc-linha-carvao)" }}
                >
                  <p className="pc-texto pc-texto--suave">
                    <strong style={{ color: "var(--pc-luz-2)" }}>
                      {item.apoio.pergunta}
                    </strong>{" "}
                    {item.apoio.resposta}
                  </p>
                </div>
              ) : null}
            </article>
          </PcRevelar>
        ))}
      </ul>
    </PcSecao>
  );
}

/**
 * As perguntas que ESTE bloco já responde. O `PcFaq` recebe a lista em `excluir` para
 * a mesma resposta não sair duas vezes na mesma página (L011 e L042 estão nos dois
 * bancos). Exportar a lista em vez de repetir as strings no orquestrador é o que
 * garante que ela continue correta quando alguém editar uma objeção.
 */
export const PC_OBJECOES_PERGUNTAS: readonly string[] = PC_OBJECOES.flatMap((item) =>
  item.apoio ? [item.principal.pergunta, item.apoio.pergunta] : [item.principal.pergunta],
);

export { PcObjecoes as Objecoes };
