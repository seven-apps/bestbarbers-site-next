"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Download, MessageCircle, Users } from "lucide-react";
import { ISCAS } from "@/lib/iscas";
import { pcHrefCom } from "./pc-link";
import { PcRevelar } from "./PcRevelar";
import { PcRodape } from "./PcRodape";
import { PcSecao } from "./PcSecao";

/**
 * PcObrigado — a confirmação de `/projeto-do-clube/obrigado`.
 *
 * Dono: B8. Renderizada pelo `obrigado/page.tsx` (B1), que é quem carrega o
 * `metadata` e o `noindex` do layout.
 *
 * ┌─ MEDIÇÃO: ESTA PÁGINA NÃO DISPARA NENHUM EVENTO DE CONVERSÃO ──────────────┐
 * │ O `useLeadForm` já disparou `Lead`, `QualifiedLead`, `QualifiedLead60` (e   │
 * │ `LeadComEquipe`) no Pixel E na CAPI com o MESMO `eventId`, e o `await`      │
 * │ acontece ANTES do `router.push` que trouxe a pessoa para cá. Refazer        │
 * │ qualquer um deles aqui cria um segundo evento com `eventId` diferente — a   │
 * │ Meta não deduplica e a conversão dobra. É exatamente o bug que o            │
 * │ `trackCompleteRegistration` da /v12 produziu (inflou ~50%, removido em      │
 * │ 910a080). §2.5 da arquitetura: «/obrigado — só `PageView`», que o layout    │
 * │ raiz já dispara sozinho. Nem `ViewContent`, nem evento de clique.           │
 * │ Se um dia alguém quiser medir o download do guia AQUI, é decisão de B9 +    │
 * │ André, sai por `trackNonCatalogEvent` e nunca por nome de catálogo.         │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─ O QUE ESTA PÁGINA PROMETE — e por que só isso ────────────────────────────┐
 * │ A /obrigado antiga do site dizia «está a caminho do seu WhatsApp e e-mail»  │
 * │ sem nenhum executor desses canais — a pessoa esperava mensagem que nunca    │
 * │ chegava. Aqui cada linha tem quem cumpra:                                   │
 * │  · «o pedido está registrado» → o card no Ploomes, criado pelo hook, com as │
 * │    quatro respostas de qualificação e o `bb_lead_score`;                    │
 * │  · «quem fala com você é o time comercial, pelo WhatsApp» → é o canal real  │
 * │    do primeiro contato do funil pago;                                       │
 * │  · «você recebe o investimento completo antes de combinar horário» → é a    │
 * │    regra comercial literal (bloco 100/100 do acervo + cap. 13).             │
 * │ E, principalmente, NÃO existe promessa de PRAZO. O cap. 13 manda «mostrar   │
 * │ janela de atendimento real, obtida da operação; sem prazo fictício» — essa  │
 * │ janela não está medida e o primeiro toque não é garantido (a cadência       │
 * │ automática TC01–TC09 parou em 08/Set/26 e a operação voltou ao contato      │
 * │ manual). Prometer «em X minutos» aqui seria inventar. Por isso o botão do   │
 * │ WhatsApp é o herói da página: o caminho que DEPENDE de nós não tem prazo    │
 * │ confirmado; o que depende do dono abre agora. Quando o comercial fechar a   │
 * │ janela de atendimento real, ela entra abaixo do botão — e só então.         │
 * └────────────────────────────────────────────────────────────────────────────┘
 */

/**
 * Número comercial da BestBarbers. Mesmo de `useWhatsAppRedirect.ts:11`.
 *
 * Está repetido aqui de propósito: o hook monta a URL por um `messageMap` de
 * `utm_source` que cita nomes de parceiros — dois deles BANIDOS. Chamar o hook
 * nesta família colocaria um nome banido na mensagem sempre que o anúncio
 * chegasse com o `utm_source` errado (§5.1, regra 7). Aqui a mensagem é uma só,
 * escrita à mão, sem nome de ninguém.
 */
const PC_WHATSAPP_NUMERO = "5531990613861";

const PC_WHATSAPP_MENSAGEM =
  "Olá! Acabei de pedir contato pela página do Projeto do Clube e quero conversar sobre o clube de assinatura da minha barbearia.";

const PC_WHATSAPP_HREF = `https://wa.me/${PC_WHATSAPP_NUMERO}?text=${encodeURIComponent(
  PC_WHATSAPP_MENSAGEM,
)}`;

/** O guia é arquivo REAL em /public — não é promessa de envio, é download na tela. */
const PC_GUIA = ISCAS["do-zero-a-assinatura"];

interface PcPasso {
  titulo: string;
  texto: string;
}

/**
 * Os três passos são o que acontece DE VERDADE depois do envio, na ordem.
 * Nenhum deles carrega prazo, e o terceiro é a regra comercial literal.
 */
const PC_PASSOS: PcPasso[] = [
  {
    titulo: "Seu pedido está registrado",
    texto:
      "O que você respondeu sobre faturamento, sistema atual, situação do clube e tamanho da equipe foi junto com o pedido. O time começa a conversa já sabendo disso — você não conta tudo de novo.",
  },
  {
    titulo: "Quem fala com você é o time comercial, pelo WhatsApp",
    texto:
      "É o mesmo número do botão desta página. Nesta tela não marcamos horário: a agenda entra depois, quando fizer sentido avançar.",
  },
  {
    titulo: "Antes de combinar horário, você recebe o investimento completo",
    texto:
      "Mensalidade, taxas, recebimento, contrato e condições de cancelamento são apresentados antes do agendamento.",
  },
];

/** O que ter à mão. São números e regras do dono — nada de dado sensível. */
const PC_LEVAR: string[] = [
  "Quantos clientes você atende hoje e quantos já pagam algum plano",
  "Os planos que vende (ou pretende vender): preço, o que inclui e quantos usos por mês",
  "Como a comissão é calculada hoje na sua barbearia",
  "O sistema que você usa hoje e o que precisa sair de lá",
  "A data em que você quer o clube rodando",
];

/**
 * Lê a query da URL depois do mount.
 *
 * Por que não `usePcHref`/`useSearchParams`: no App Router o `useSearchParams`
 * obriga um `<Suspense>` em volta, e o fallback desse Suspense é a primeira
 * pintura — página de confirmação abrindo em «Carregando...» contraria V6 (o
 * conteúdo nasce visível). Lendo no efeito, o HTML sai completo do servidor com
 * o caminho limpo e a query entra na hidratação. `pcHrefCom` continua sendo o
 * único lugar que sabe colar a query (§2.4).
 */
function useBuscaAtual(): string {
  const [busca, setBusca] = useState("");
  useEffect(() => setBusca(window.location.search), []);
  return busca;
}

export function PcObrigado() {
  const busca = useBuscaAtual();
  const hrefCondicoes = pcHrefCom(busca, "/projeto-do-clube/condicoes");

  return (
    <>
      <header className="pc-obg-topo">
        <div className="pc-medida flex items-center justify-between gap-[var(--pc-e-4)]">
          <Image
            src="/images/Logo-BestBarbers-branco_1.webp"
            alt="BestBarbers"
            width={200}
            height={50}
            priority
            className="h-auto w-[116px] md:w-[132px]"
          />
          <span className="pc-selo pc-selo--acao">Pedido enviado</span>
        </div>
      </header>

      {/* ACIMA DA DOBRA: nasce pintado, sem PcRevelar (V6 / §4.1). */}
      <PcSecao fundo="carvao">
        {/* PcSecao já entrega o miolo em `.pc-medida`; este div só agrupa. */}
        <div>
          <h1 className="pc-titulo pc-titulo--1" style={{ maxWidth: "18ch" }}>
            Recebemos seu pedido.{" "}
            <span style={{ color: "var(--pc-ouro)" }}>Vamos olhar seu clube juntos.</span>
          </h1>

          <p className="pc-subtitulo" style={{ marginTop: "var(--pc-e-5)" }}>
            O próximo passo é confirmar sua situação e apresentar as condições da implantação.
          </p>

          {/* `id` é o destino da âncora «Falar com o time» do PcRodape: nesta rota
              não existe `#pc-formulario`, e âncora que não acha o alvo é botão morto
              na página que a pessoa vê logo depois de converter. */}
          <div
            id="pc-obg-contato"
            className="flex flex-col items-start gap-[var(--pc-e-3)]"
            style={{ marginTop: "var(--pc-e-7)" }}
          >
            <a
              className="pc-botao pc-botao--acao pc-botao--g"
              href={PC_WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} aria-hidden="true" />
              Conversar com o time
            </a>
            <p className="pc-texto pc-texto--suave" style={{ fontSize: "var(--pc-t-rotulo)" }}>
              Abre a conversa no WhatsApp comercial da BestBarbers.
            </p>
          </div>
        </div>
      </PcSecao>

      <PcSecao id="pc-obg-agora" fundo="papel">
        {/* PcSecao já entrega o miolo em `.pc-medida`; este div só agrupa. */}
        <div>
          <PcRevelar>
            <p className="pc-rotulo">O que acontece agora</p>
            <h2 className="pc-titulo pc-titulo--2" style={{ marginTop: "var(--pc-e-3)" }}>
              Três coisas, nesta ordem
            </h2>
          </PcRevelar>

          <ol
            className="pc-lista flex flex-col gap-[var(--pc-e-5)]"
            style={{ marginTop: "var(--pc-e-6)" }}
          >
            {PC_PASSOS.map((passo, i) => (
              <PcRevelar key={passo.titulo} como="li" atraso={i * 90}>
                <div className="flex items-start gap-[var(--pc-e-4)]">
                  <span className="pc-obg-num pc-tabular" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="pc-titulo pc-titulo--3">{passo.titulo}</h3>
                    <p className="pc-texto" style={{ marginTop: "var(--pc-e-2)" }}>
                      {passo.texto}
                    </p>
                    {i === PC_PASSOS.length - 1 && (
                      <a
                        className="pc-botao pc-botao--link"
                        href={hrefCondicoes}
                        style={{ marginTop: "var(--pc-e-3)" }}
                      >
                        Ver as condições agora
                        <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </PcRevelar>
            ))}
          </ol>

          {/*
            A honestidade que falta na maioria das páginas de obrigado: dizer o que
            NÃO está prometido. A primeira frase é literal do cap. 13; a segunda
            explica por que não há relógio nesta tela — e devolve o controle para
            quem quiser começar agora.
          */}
          <PcRevelar>
            <div className="pc-cartao pc-cartao--contorno" style={{ marginTop: "var(--pc-e-7)" }}>
              <p className="pc-texto" style={{ maxWidth: "none" }}>
                Clique no WhatsApp, mensagem recebida e reunião confirmada são fatos separados.{" "}
                <strong style={{ color: "var(--pc-tinta)" }}>
                  Por isso não colocamos um prazo nesta tela.
                </strong>{" "}
                Se você não quiser esperar, quem abre a conversa é você — e o botão desta página
                faz isso agora.
              </p>
            </div>
          </PcRevelar>
        </div>
      </PcSecao>

      <PcSecao fundo="carvao-fundo">
        {/* PcSecao já entrega o miolo em `.pc-medida`; este div só agrupa. */}
        <div>
          <PcRevelar>
            <p className="pc-rotulo">Enquanto isso</p>
            <h2 className="pc-titulo pc-titulo--2" style={{ marginTop: "var(--pc-e-3)" }}>
              Dá para adiantar sozinho
            </h2>
          </PcRevelar>

          <div
            className="grid grid-cols-1 gap-[var(--pc-e-5)] md:grid-cols-2"
            style={{ marginTop: "var(--pc-e-6)" }}
          >
            <PcRevelar como="div">
              <div className="pc-cartao pc-cartao--carvao h-full">
                <h3 className="pc-titulo pc-titulo--3">Como chegar pronto na conversa</h3>
                <ul
                  className="pc-lista flex flex-col gap-[var(--pc-e-3)]"
                  style={{ marginTop: "var(--pc-e-4)" }}
                >
                  {PC_LEVAR.map((item) => (
                    <li key={item} className="pc-texto flex items-start gap-[var(--pc-e-3)]">
                      <span className="pc-obg-marca" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p
                  className="pc-texto pc-texto--suave"
                  style={{ marginTop: "var(--pc-e-4)", fontSize: "var(--pc-t-rotulo)" }}
                >
                  São números e regras suas. Senha, cartão e lista com o nome dos seus clientes não
                  entram nessa conversa.
                </p>
              </div>
            </PcRevelar>

            <div className="flex flex-col gap-[var(--pc-e-5)]">
              <PcRevelar como="div" atraso={90}>
                <div className="pc-cartao pc-cartao--carvao">
                  <div className="flex items-center gap-[var(--pc-e-3)]">
                    <Users size={20} aria-hidden="true" style={{ color: "var(--pc-ouro)" }} />
                    <h3 className="pc-titulo pc-titulo--3">Chame quem decide junto</h3>
                  </div>
                  <p className="pc-texto" style={{ marginTop: "var(--pc-e-3)" }}>
                    Se o clube não é decisão só sua — sócio, gerente da loja, quem cuida do
                    financeiro —, traga essa pessoa para a mesma conversa. Sai mais rápido do que
                    repetir tudo depois.
                  </p>
                </div>
              </PcRevelar>

              <PcRevelar como="div" atraso={180}>
                <div className="pc-cartao pc-cartao--carvao">
                  <div className="flex items-center gap-[var(--pc-e-3)]">
                    <Download size={20} aria-hidden="true" style={{ color: "var(--pc-ouro)" }} />
                    <h3 className="pc-titulo pc-titulo--3">Guia {PC_GUIA.titulo}</h3>
                  </div>
                  <p className="pc-texto" style={{ marginTop: "var(--pc-e-3)" }}>
                    Como montar o clube do começo: preço dos planos, dias de utilização, cobrança e
                    os erros que derrubam a assinatura. É material de estudo, não proposta
                    comercial.
                  </p>
                  <p className="pc-texto pc-texto--suave" style={{ marginTop: "var(--pc-e-3)" }}>
                    {PC_GUIA.subtitulo}
                  </p>
                  <a
                    className="pc-botao pc-botao--ouro"
                    href={PC_GUIA.pdf}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: "var(--pc-e-4)" }}
                  >
                    Baixar o guia em PDF
                  </a>
                  <p
                    className="pc-texto pc-texto--suave"
                    style={{ marginTop: "var(--pc-e-2)", fontSize: "var(--pc-t-micro)" }}
                  >
                    PDF · abre em nova aba
                  </p>
                </div>
              </PcRevelar>
            </div>
          </div>
        </div>
      </PcSecao>

      <PcRodape hrefCondicoes={hrefCondicoes} alvoFormularioId="pc-obg-contato" />

      <style jsx>{`
        .pc-obg-topo {
          padding: var(--pc-e-4) var(--pc-secao-x);
          background: var(--pc-carvao);
          border-bottom: 1px solid var(--pc-linha-carvao);
        }
        .pc-obg-num {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: var(--pc-r-pill);
          background: var(--pc-ouro-lavado);
          border: 1px solid rgba(138, 93, 0, 0.28);
          color: var(--pc-ouro-escuro);
          font-size: var(--pc-t-rotulo);
          font-weight: var(--pc-peso-titulo);
          line-height: 1;
        }
        .pc-obg-marca {
          flex: 0 0 auto;
          width: 6px;
          height: 6px;
          margin-top: 0.62em;
          border-radius: var(--pc-r-pill);
          background: var(--pc-ouro);
        }
      `}</style>
    </>
  );
}
