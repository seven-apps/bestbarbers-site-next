/**
 * Fronteira — o bloco de honestidade: o que a implantação exige do dono, o que
 * não migra automaticamente e o que a BestBarbers não promete.
 *
 * ESTE BLOCO É VANTAGEM COMPETITIVA, NÃO FRAQUEZA. Todo mundo publica o que o
 * produto faz; quase ninguém publica onde ele para. Quem lê isto antes da
 * conversa chega sabendo o que vai ter de fazer — e é esse lead que fecha.
 * Por isso ele nasce sobre PAPEL (§3 da arquitetura): é o documento que o dono
 * confere, não o argumento que a marca grita.
 *
 * Todo texto das três colunas e do rodapé é LITERAL da biblioteca aprovada
 * (peça em `fonte` e em `data-pc-fonte`). Novos são apenas o título, o apoio e
 * os três rótulos de coluna — micro-copy nova, estatuto P11.
 *
 * GUARDAS: nenhuma resposta de fidelidade, garantia ou prazo de cancelamento
 * (V10 / P1) · nenhuma promessa de prazo de resultado · nenhuma feature
 * inexistente · nenhum nome de cliente, parceiro ou concorrente.
 *
 * MOVIMENTO: M1 (uma entrada por coluna, stagger de 90 ms) e M5. As réguas
 * nascem desenhadas; só encolhem depois que o JS assume.
 */

import { PcSecao } from "./PcSecao";
import { PcRevelar } from "./PcRevelar";
import { filtrarPerguntas } from "../_lib/perguntas";

interface PcFronteiraItem {
  pergunta: string;
  resposta: string;
  fonte: string;
}

interface PcFronteiraColuna {
  id: string;
  ordem: string;
  /** Rótulo da coluna — micro-copy nova (P11). */
  titulo: string;
  itens: PcFronteiraItem[];
}

const PC_FRONTEIRA: PcFronteiraColuna[] = [
  {
    id: "depende-de-voce",
    ordem: "01",
    titulo: "O que depende de você",
    itens: [
      {
        pergunta: "Vocês fazem tudo sem minha participação?",
        resposta:
          "Não. Sua equipe precisa fornecer informações, tomar decisões e participar da preparação. As responsabilidades são combinadas na proposta.",
        fonte: "L074",
      },
      {
        pergunta: "Meu cliente terá de descobrir tudo sozinho?",
        resposta:
          "A barbearia precisa preparar orientação para quem tiver dúvidas. Conheça o fluxo e combine as responsabilidades antes de começar.",
        fonte: "L064",
      },
      {
        pergunta: "Meus clientes atuais entram automaticamente?",
        resposta:
          "Não. A adesão e a autorização precisam ser feitas conforme o processo confirmado para o seu caso.",
        fonte: "L002",
      },
    ],
  },
  {
    id: "nao-migra",
    ordem: "02",
    titulo: "O que não migra automaticamente",
    itens: [
      {
        pergunta: "A minha regra será mantida exatamente igual?",
        resposta:
          "Isso precisa ser confirmado na demonstração. Qualquer adaptação necessária deve aparecer antes da contratação.",
        fonte: "L013",
      },
      {
        pergunta: "Toda regra é possível na BestBarbers?",
        resposta:
          "Não. Precisamos mostrar o funcionamento para o seu caso e explicar as limitações antes da proposta.",
        fonte: "L016",
      },
      {
        pergunta: "Posso manter as datas atuais?",
        resposta:
          "O funcionamento precisa ser confirmado para sua regra. Não prometa uma mudança aos clientes antes dessa verificação.",
        fonte: "L003",
      },
      {
        pergunta: "Se faltar uma função, vocês prometem desenvolver?",
        resposta:
          "Não há essa promessa nesta oferta. Uma possibilidade futura não deve ser tratada como recurso contratado sem acordo específico.",
        fonte: "L088",
      },
    ],
  },
  {
    id: "nao-prometemos",
    ordem: "03",
    titulo: "O que a BestBarbers não promete",
    itens: [
      {
        pergunta: "Vocês garantem faturamento com o clube?",
        resposta:
          "Não. O resultado depende de demanda, oferta, custos e execução, além do uso do produto.",
        fonte: "L073",
      },
      {
        pergunta: "O sistema impede o cliente de cancelar?",
        resposta:
          "Não é essa a proposta. Regras, atendimento e condições precisam ser respeitados; não há garantia de retenção.",
        fonte: "L066",
      },
      {
        pergunta: "Vocês administram meu clube por mim?",
        resposta:
          "A oferta proposta é produto e implantação assistida com serviço. A rotina diária e as decisões da barbearia permanecem com seus responsáveis.",
        fonte: "L027",
      },
      {
        pergunta: "A implantação inclui toda a gestão de pessoas?",
        resposta:
          "Não. O serviço precisa separar orientação do produto e responsabilidades da barbearia.",
        fonte: "L055",
      },
    ],
  },
];

/** Fecho literal: o que o time faz com isso, e o que você leva para a conversa. */
const PC_FRONTEIRA_FECHO: PcFronteiraItem[] = [
  {
    pergunta: "Quem confirma o prazo para começar?",
    resposta:
      "O time confere as informações, as decisões pendentes e as dependências do projeto antes de combinar o cronograma.",
    fonte: "L098",
  },
  {
    pergunta: "O que devo trazer para essa conversa?",
    resposta:
      "Sua regra atual ou ideia de plano, a dúvida principal e quem participa da decisão. Não envie senhas, cartões ou listas pessoais de clientes.",
    fonte: "L100",
  },
];

/** Cartão sobre papel: a sombra pesada (`--pc-sombra-3`) é para papel sobre
 *  carvão; aqui a seção JÁ é papel, então a elevação é a leve. */
const CARTAO_NO_PAPEL = {
  background: "var(--pc-papel-alto)",
  border: "1px solid var(--pc-linha-papel)",
  boxShadow: "var(--pc-sombra-1)",
} as const;

export interface PcFronteiraProps {
  id?: string;
  className?: string;
}

export function PcFronteira({ id = "pc-fronteira", className }: PcFronteiraProps) {
  return (
    <PcSecao id={id} fundo="papel" className={className}>
      <PcRevelar className="group">
        <p className="pc-rotulo">A fronteira do que você contrata</p>
        <h2 className="pc-titulo pc-titulo--2 mt-3">
          Onde termina o produto e começa o seu trabalho
        </h2>
        <span
          aria-hidden="true"
          className="mt-5 block h-px w-24 origin-left scale-x-100 transition-transform group-data-[pc-revelar=pronto]:scale-x-0 group-data-[pc-revelar=visivel]:scale-x-100"
          style={{
            background: "var(--pc-ouro-escuro)",
            transitionDuration: "var(--pc-dur-4)",
            transitionTimingFunction: "var(--pc-ease-saida)",
          }}
        />
        <p className="pc-texto mt-5">
          A implantação tem dois lados. Este é o lado que depende de você — e o
          que a BestBarbers não promete. Está escrito aqui para você chegar na
          conversa sabendo, não para descobrir depois.
        </p>
      </PcRevelar>

      <ul className="pc-lista mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PC_FRONTEIRA.map((coluna, i) => (
          <PcRevelar
            key={coluna.id}
            como="li"
            atraso={Math.min(i, 3) * 90}
            className="group h-full"
          >
            <div
              className="pc-cartao flex h-full flex-col transition-transform hover:-translate-y-px"
              style={{ ...CARTAO_NO_PAPEL, transitionDuration: "var(--pc-dur-1)" }}
            >
              <div className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="pc-tabular pc-titulo pc-titulo--3"
                  style={{ color: "var(--pc-ouro-escuro)" }}
                >
                  {coluna.ordem}
                </span>
                <h3 className="pc-titulo pc-titulo--3">{coluna.titulo}</h3>
              </div>

              <span
                aria-hidden="true"
                className="mt-5 block h-px w-full origin-left scale-x-100 transition-transform group-data-[pc-revelar=pronto]:scale-x-0 group-data-[pc-revelar=visivel]:scale-x-100"
                style={{
                  background: "var(--pc-linha-papel)",
                  transitionDuration: "var(--pc-dur-4)",
                  transitionTimingFunction: "var(--pc-ease-saida)",
                }}
              />

              <ul className="pc-lista mt-5 grid grid-cols-1 gap-5">
                {/* MESMO filtro do FAQ (19/Set): sem ele esta coluna publicava o
                    literal L027 afirmando «implantação assistida», serviço que o
                    próprio `_lib/perguntas.ts` declara não aprovado e que o FAQ já
                    substituía. A guarda precisa alcançar todo consumidor do acervo. */}
                {filtrarPerguntas(coluna.itens).map((item) => (
                  <li key={item.fonte} data-pc-fonte={item.fonte}>
                    <p className="pc-texto" style={{ color: "var(--pc-tinta)" }}>
                      <strong>{item.pergunta}</strong>
                    </p>
                    <p className="pc-texto mt-2">{item.resposta}</p>
                  </li>
                ))}
              </ul>
            </div>
          </PcRevelar>
        ))}
      </ul>

      <PcRevelar atraso={180}>
        <div
          className="pc-cartao mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
          style={{
            background: "var(--pc-papel-fundo)",
            border: "1px solid var(--pc-linha-papel)",
          }}
        >
          {PC_FRONTEIRA_FECHO.map((item) => (
            <div key={item.fonte} data-pc-fonte={item.fonte}>
              <p className="pc-texto" style={{ color: "var(--pc-tinta)" }}>
                <strong>{item.pergunta}</strong>
              </p>
              <p className="pc-texto mt-2">{item.resposta}</p>
            </div>
          ))}
        </div>
      </PcRevelar>
    </PcSecao>
  );
}

export { PcFronteira as Fronteira };
