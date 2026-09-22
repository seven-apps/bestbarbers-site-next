"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMetaPixel } from "@/hooks";
import { PC_BLOCOS } from "./pc-copy";
import { pcHrefCom } from "./pc-link";
import { PcRevelar } from "./PcRevelar";
import { PcRodape } from "./PcRodape";
import { PcSecao } from "./PcSecao";

/**
 * PcCondicoesPagina — `/projeto-do-clube/condicoes`.
 *
 * Dono: B8. Renderizada pelo `condicoes/page.tsx` (B1).
 *
 * ┌─ POR QUE ESTA PÁGINA EXISTE ───────────────────────────────────────────────┐
 * │ Cap. 13: «mostrar perguntas difíceis ANTES do formulário, com link para     │
 * │ detalhes. Não esconder recebimento, módulos ou contrato atrás do cadastro». │
 * │ Por isso ela é aberta, sem formulário e sem gate — e por isso ela é linkada │
 * │ do herói, do bloco de condições, do rodapé e da confirmação.                │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ A REGRA QUE GOVERNA CADA LINHA ───────────────────────────────────────────┐
 * │ Só entra aqui fato aprovado. Onde o comercial/financeiro ainda não fechou   │
 * │ a regra, o tópico mostra a POSTURA aprovada («é apresentado na proposta,    │
 * │ antes do agendamento») e o espaço fica marcado em `pendente` — nunca um     │
 * │ número inventado, nunca «sem fidelidade», nunca «cancele quando quiser».    │
 * │                                                                            │
 * │ Isto não é excesso de zelo: a auditoria V5 encontrou contrato falado de 12  │
 * │ meses com multa de 20%, site divergente e a condição omitida em 38 de 45    │
 * │ reuniões. Publicar uma regra que o contrato não confirma é o erro que já    │
 * │ está no ar na /v12 — a página que esta família existe para não repetir.     │
 * │                                                                            │
 * │ Números que EXISTEM mas são de uso interno até o financeiro assinar (taxa   │
 * │ do meio de pagamento, prazo de recebimento, preço por módulo) NÃO aparecem  │
 * │ aqui em nenhuma forma. A única expressão de preço pública é «a partir de    │
 * │ R$299», sempre ao lado do bloco literal de condições.                       │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

/**
 * Nome do evento no Events Manager, conforme §2.5.
 *
 * Literal de propósito: `PC_EVENTOS` é de B9 e a CHAVE dele não está no contrato
 * (só a string do evento está). Importar a chave errada quebraria a compilação da
 * família inteira; a string errada quebraria a série em silêncio, que é pior.
 * Quando `pc-eventos.ts` estiver no lugar, o integrador troca esta constante por
 * `PC_EVENTOS.condicoesAbertas` — é uma linha, e o nome do evento não muda.
 */
const PC_EVENTO_CONDICOES_ABERTAS = "condicoes_abertas";

/**
 * Guarda de disparo em `Set` de MÓDULO, não em `useRef` (§2.5).
 * Ref novo nasce junto com instância nova — em remount (Suspense, StrictMode em
 * dev, troca de rota client-side) ele não segura nada e o evento sai duas vezes.
 */
const condicoesAbertasDisparado = new Set<string>();

const PC_ROTA = "/projeto-do-clube/condicoes";

interface PcTopicoCondicao {
  rotulo: string;
  titulo: string;
  /** Parágrafos com fato ou postura APROVADOS. */
  corpo: string[];
  /**
   * O espaço marcado: a regra existe, mas o texto factual ainda não foi liberado.
   * Renderiza a postura, nunca o número. Registrado em §8 (P1, P2, P8).
   */
  pendente?: string;
}

const PC_TOPICOS: PcTopicoCondicao[] = [
  {
    rotulo: "Módulos",
    titulo: "O que existe no produto e o que entra na sua contratação",
    corpo: [
      "A BestBarbers é o sistema que roda a barbearia, e estes módulos já existem no produto: agenda e agendamento online, clube de assinatura com cobrança recorrente no cartão, comissão por profissional, financeiro, nota fiscal de serviço (NFS-e), aplicativo próprio da barbearia e totem de autoatendimento.",
      "Recursos e módulos dependem da contratação. O preço inicial não significa que tudo esteja incluído.",
    ],
    pendente:
      "Quais módulos entram no seu caso e quanto custa cada um são apresentados na proposta, antes do agendamento.",
  },
  {
    rotulo: "Assistência",
    titulo: "Implantação e acompanhamento",
    corpo: [
      "A implantação, quando contratada, segue as entregas e responsabilidades descritas na proposta.",
      "A proposta informa o que a BestBarbers faz, o que a sua equipe precisa fazer e quais entregas dependem de validação. Depois da contratação, a assistência segue esse escopo e os responsáveis definidos ali.",
    ],
  },
  {
    rotulo: "Responsabilidades",
    titulo: "O que depende de você",
    corpo: [
      "A regra do seu clube é sua: quais planos existem, quanto custam, o que incluem e quantos usos cada um dá por mês. O sistema executa a regra que você cadastrar — ele não decide a sua política de uso.",
      "A assinatura e suas condições precisam ser compreendidas e autorizadas pelo cliente.",
      "Se já existe um clube rodando em outro sistema, a BestBarbers importa os planos e as datas de vencimento dos seus assinantes, e cada cliente autoriza a assinatura uma vez no aplicativo para seguir no mesmo plano. A avaliação identifica os acordos que precisam de mudança e as pendências da passagem, em vez de uma promessa genérica de facilidade.",
    ],
  },
  {
    rotulo: "Cobrança",
    titulo: "Como o assinante paga",
    corpo: [
      "O clube cobra a mensalidade do assinante de forma recorrente no cartão.",
      "A cobrança recorrente não elimina todo atraso: pagamentos podem falhar. O sistema mostra a pendência; o que fazer depois dela é decisão da sua barbearia.",
    ],
    pendente:
      "As taxas do meio de pagamento são apresentadas na proposta, antes do agendamento.",
  },
  {
    rotulo: "Recebimento",
    titulo: "Quando o dinheiro entra",
    corpo: [
      "O recebimento segue as condições efetivas do meio de pagamento contratado. O time apresenta esse funcionamento e avalia o impacto no caixa; não prometemos antecipação como regra geral.",
    ],
    pendente:
      "O prazo e o evento que inicia a contagem são apresentados na proposta, antes do agendamento.",
  },
  {
    rotulo: "Contrato",
    titulo: "Vigência e cancelamento",
    corpo: [
      "Mensalidade, taxas, recebimento, contrato e condições de cancelamento são apresentados antes do agendamento. As condições vigentes ficam explícitas na proposta e no contrato, antes da contratação.",
    ],
    pendente:
      "A regra de vigência e a de cancelamento não estão publicadas nesta página. Peça o texto ao time antes de assinar e confira se o que foi combinado na conversa está no documento: condição que não está escrita no contrato não vale por ter sido dita.",
  },
  {
    rotulo: "O pedido",
    titulo: "O que o pedido de contato é — e o que não é",
    corpo: [
      "Ao enviar o formulário, você pede contato comercial. Não contrata o serviço, não confirma um horário e não autoriza cobrança nenhuma.",
      "Ele inicia uma avaliação comercial. Contratação, implantação e condições dependem de uma proposta aceita.",
      "E ele não é garantia de resultado: o projeto ajuda a definir e implantar a operação, mas faturamento e adesão dependem também da sua oferta, da execução e da decisão dos seus clientes.",
    ],
  },
];

/**
 * Lê a query da URL depois do mount — mesmo motivo do `PcObrigado`: `useSearchParams`
 * obrigaria um `<Suspense>` cujo fallback vira a primeira pintura, contra V6.
 * `pcHrefCom` continua sendo quem cola a query (§2.4).
 */
function useBuscaAtual(): string {
  const [busca, setBusca] = useState("");
  useEffect(() => setBusca(window.location.search), []);
  return busca;
}

export function PcCondicoesPagina() {
  const busca = useBuscaAtual();
  const { trackNonCatalogEvent } = useMetaPixel();

  const hrefEntrada = pcHrefCom(busca, "/projeto-do-clube");
  const hrefFormulario = `${hrefEntrada}#pc-formulario`;

  useEffect(() => {
    if (condicoesAbertasDisparado.has(PC_ROTA)) return;
    condicoesAbertasDisparado.add(PC_ROTA);

    // `antes_do_form` separa quem lê as condições ANTES de pedir contato de quem
    // chega aqui pela confirmação (já pediu). Sem essa distinção o parâmetro
    // mediria as duas coisas somadas e não responderia nenhuma das duas.
    const veioDaConfirmacao = document.referrer.includes("/projeto-do-clube/obrigado");

    void trackNonCatalogEvent(PC_EVENTO_CONDICOES_ABERTAS, {
      pagina: PC_ROTA,
      onde: "pagina",
      antes_do_form: !veioDaConfirmacao,
    });
  }, [trackNonCatalogEvent]);

  return (
    <>
      <header className="pc-cond-topo">
        <div className="pc-medida flex items-center justify-between gap-[var(--pc-e-4)]">
          <Image
            src="/images/Logo-BestBarbers-branco_1.webp"
            alt="BestBarbers"
            width={200}
            height={50}
            priority
            className="h-auto w-[116px] md:w-[132px]"
          />
          <a className="pc-botao pc-botao--link" href={hrefEntrada}>
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar para o projeto
          </a>
        </div>
      </header>

      {/* ACIMA DA DOBRA: nasce pintado, sem PcRevelar (V6 / §4.1). */}
      <PcSecao fundo="carvao">
        {/* PcSecao já entrega o miolo em `.pc-medida`; este div só agrupa. */}
        <div>
          <p className="pc-rotulo">Condições</p>
          <h1 className="pc-titulo pc-titulo--1" style={{ marginTop: "var(--pc-e-3)" }}>
            Entenda o que está incluído na sua contratação.
          </h1>
          <p className="pc-subtitulo" style={{ marginTop: "var(--pc-e-5)" }}>
            Esta página reúne os fatos comerciais que o time apresenta antes de combinar qualquer
            conversa. Ela fica aberta: você não precisa deixar seus dados para ler.
          </p>
        </div>
      </PcSecao>

      {/* INVESTIMENTO — o bloco literal de 100/100 peças do acervo, vindo de pc-copy
          (B3) para que esta página e o bloco dentro das entradas digam o MESMO texto,
          palavra por palavra. Nada aqui é reescrito. */}
      <PcSecao id="pc-cond-investimento" fundo="papel">
        {/* PcSecao já entrega o miolo em `.pc-medida`; este div só agrupa. */}
        <div>
          <div className="pc-cartao pc-cartao--papel">
            <h2 className="pc-titulo pc-titulo--2">{PC_BLOCOS.condicoes.titulo}</h2>
            <p className="pc-cond-preco" style={{ marginTop: "var(--pc-e-4)" }}>
              A partir de R$299
            </p>
            <p className="pc-texto pc-texto--grande" style={{ marginTop: "var(--pc-e-4)" }}>
              {PC_BLOCOS.condicoes.texto}
            </p>
          </div>
        </div>
      </PcSecao>

      <PcSecao fundo="papel">
        {/* PcSecao já entrega o miolo em `.pc-medida`; este div só agrupa. */}
        <div>
          <ol className="pc-lista flex flex-col gap-[var(--pc-e-8)]">
            {PC_TOPICOS.map((topico, i) => (
              <PcRevelar key={topico.rotulo} como="li" atraso={Math.min(i, 3) * 90}>
                <p className="pc-rotulo">{topico.rotulo}</p>
                <h2 className="pc-titulo pc-titulo--2" style={{ marginTop: "var(--pc-e-3)" }}>
                  {topico.titulo}
                </h2>
                <div
                  className="flex flex-col gap-[var(--pc-e-4)]"
                  style={{ marginTop: "var(--pc-e-4)" }}
                >
                  {topico.corpo.map((paragrafo) => (
                    <p key={paragrafo.slice(0, 40)} className="pc-texto">
                      {paragrafo}
                    </p>
                  ))}
                </div>

                {topico.pendente && (
                  <p className="pc-cond-pendente pc-texto pc-texto--suave">{topico.pendente}</p>
                )}
              </PcRevelar>
            ))}
          </ol>
        </div>
      </PcSecao>

      {/* Fecho: a ponte literal «Como segue a conversa» e a volta para o pedido.
          Nenhum formulário aqui — quem quiser pedir contato volta para a entrada,
          onde mora o formulário de verdade (§5.1: um formulário só, em um lugar só). */}
      {/* `id` é o destino da âncora «Falar com o time» do PcRodape: esta rota não
          tem `#pc-formulario` (e não pode ter — o formulário mora na entrada). */}
      <PcSecao id="pc-cond-fecho" fundo="carvao-fundo">
        {/* PcSecao já entrega o miolo em `.pc-medida`; este div só agrupa. */}
        <div>
          <PcRevelar>
            <h2 className="pc-titulo pc-titulo--2">Como segue a conversa</h2>
            <p className="pc-texto pc-texto--grande" style={{ marginTop: "var(--pc-e-4)" }}>
              Você conta como está seu clube e o que quer resolver. O time confirma a necessidade e
              apresenta o investimento completo antes de combinar a demonstração. A implantação,
              quando contratada, segue as entregas e responsabilidades descritas na proposta.
            </p>
            <a
              className="pc-botao pc-botao--acao pc-botao--g"
              href={hrefFormulario}
              style={{ marginTop: "var(--pc-e-6)" }}
            >
              Voltar e pedir contato
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </PcRevelar>
        </div>
      </PcSecao>

      <PcRodape hrefCondicoes={pcHrefCom(busca, PC_ROTA)} alvoFormularioId="pc-cond-fecho" />

      <style jsx>{`
        .pc-cond-topo {
          padding: var(--pc-e-4) var(--pc-secao-x);
          background: var(--pc-carvao);
          border-bottom: 1px solid var(--pc-linha-carvao);
        }
        .pc-cond-preco {
          margin: 0;
          font-size: var(--pc-t-h1);
          font-weight: var(--pc-peso-titulo);
          line-height: var(--pc-lh-curta);
          letter-spacing: var(--pc-track-h1);
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum" 1;
          color: var(--pc-ouro-escuro);
        }
        /* O espaço marcado: barra dourada à esquerda para o olho achar o que ainda
           não está publicado, sem parecer aviso de erro. */
        .pc-cond-pendente {
          margin-top: var(--pc-e-5);
          padding-left: var(--pc-e-4);
          border-left: 2px solid var(--pc-ouro);
          font-size: var(--pc-t-rotulo);
        }
      `}</style>
    </>
  );
}
