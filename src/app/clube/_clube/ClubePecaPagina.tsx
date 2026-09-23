/**
 * /clube/[peca] — A PÁGINA CURTA POR ANÚNCIO (Ondas 1, 1b e 2 do veredito de 23/Set/26:
 * bestbarbers-ai/docs/operacional/plano-v3-maquina-vendas/paginas-clube/00-VEREDITO-NOTA-10-2026-09-23.md).
 *
 * O que mudou em relação ao orquestrador da família (`PcPagina`), e por quê:
 *  - FORMULÁRIO NA 2ª/3ª TELA (era a ~11.800 px, ~14 telas): no celular o visitante vê em média
 *    45% da página (Contentsquare). A ordem é herói → prova → formulário → antes × depois → FAQ.
 *  - UMA CHAMADA na dobra, com o «Ver…» literal do anúncio, descendo para a PROVA (o anúncio
 *    promete mostrar; o formulário vem logo depois). Cabeçalho só com o logo.
 *  - A PROVA É DESTA PROMESSA: a tela do sistema em HTML, animada uma vez, com os 3 passos.
 *  - SERVER COMPONENT: só formulário, FAQ, CTA fixo, eventos e a animação hidratam.
 *  - Ouro é a única cor de ação (o verde fica para o «Pago» das telas); a luz de fundo do herói
 *    é a cor da cena da arte (`atmosfera`).
 *  - A/B do herói (`lib/ab-clube.ts`): `cena` põe a FOTO do anúncio no topo; `base` não.
 *
 * O que NÃO mudou: o formulário de 2 passos inteiro (score, porta, originId pelo UTM, eventos de
 * Lead do `useLeadForm`), o FAQ e o rodapé da família.
 */
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { CONTEUDO_CLUBE, ROTULO_CONTATO_CLUBE, configDaPaginaClube } from "@/content/clube-pecas";
import { caminhoCena } from "@/lib/ab-clube";
import { NUMEROS_OFICIAIS } from "@/lib/numeros-oficiais";
import type { SlugClube } from "@/lib/tracking/portas-clube";
import { PcFormulario, PC_FORMULARIO_ID } from "../../projeto-do-clube/_components/PcFormulario";
import { PcFaq } from "../../projeto-do-clube/_components/PcFaq";
import { PcChamadaFinal } from "../../projeto-do-clube/_components/PcChamadaFinal";
import { PcRodape } from "../../projeto-do-clube/_components/PcRodape";
import {
  PC_BLOCOS,
  PC_CLUB_STATUS_POR_SITUACAO,
  PC_FAQ_GERAL,
} from "../../projeto-do-clube/_components/pc-copy";
import { BotaoHeroi, CtaFixoClube, EventosPagina, ProvaAnimada } from "./Ilhas";
import { SimuladorApp } from "./SimuladorApp";
import { ID_HEROI, ID_PROVA } from "./ids";
import { Tela } from "./telas";
import s from "./clube.module.css";

const HREF_CONDICOES = "/projeto-do-clube/condicoes";
/** Pedido do André (23/Set): o botão fala do GANHO do dono, não da conversa. */
const ROTULO_CONTATO = ROTULO_CONTATO_CLUBE;
const FAQ_FORA = ["Vocês montam tudo por mim?", "Existe fidelidade ou garantia?"] as const;

/** Pinta de ouro os trechos que a arte pinta (literal; trecho ausente é ignorado). */
function comDestaque(titulo: string, trechos?: readonly string[]): ReactNode {
  const validos = (trechos ?? []).filter((t) => t && titulo.includes(t));
  if (!validos.length) return titulo;
  const re = new RegExp(`(${validos.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return titulo.split(re).map((parte, i) => (validos.includes(parte) ? <span key={i} className={s.ouro}>{parte}</span> : parte));
}

export function ClubePecaPagina({ slug, variante }: { slug: SlugClube; variante: "base" | "cena" }) {
  const conteudo = CONTEUDO_CLUBE[slug];
  const config = { ...configDaPaginaClube(slug), variante };
  const { peca } = config;
  const comCena = variante === "cena";

  return (
    <div className={s.pagina} style={{ "--atmosfera": conteudo.atmosfera } as CSSProperties}>
      {/* O braço do A/B, para o card do Ploomes (`lead-attribution.ts` lê esta meta). */}
      <meta name="bb-variante" content={variante} />

      <header className={s.cabecalho}>
        <Image src="/images/Logo-BestBarbers-branco_1.webp" alt="BestBarbers" width={132} height={30} loading="eager" />
      </header>

      <main>
        <section className={`${s.heroi} ${comCena ? s.heroiCena : ""}`} id={ID_HEROI}>
          {comCena ? (
            <figure className={s.cena}>
              <picture>
                <source media="(min-width: 900px)" type="image/avif" srcSet={caminhoCena(slug, "retrato", "avif")} />
                <source media="(min-width: 900px)" type="image/webp" srcSet={caminhoCena(slug, "retrato", "webp")} />
                <source type="image/avif" srcSet={caminhoCena(slug, "faixa", "avif")} />
                {/* <img> dentro de <picture>, e não next/image: o recorte muda por breakpoint (faixa × retrato). */}
                <img
                  src={caminhoCena(slug, "faixa", "webp")}
                  alt=""
                  width={800}
                  height={500}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
              <figcaption>Tela de exemplo. Marca e dados fictícios.</figcaption>
            </figure>
          ) : null}

          <div className={s.heroiTexto}>
            {/* Estático: o kicker literal da arte. Vídeo: o selo diz de onde a pessoa veio. */}
            <p className={s.selo}>{conteudo.anuncio.kicker ?? "Do vídeo que você viu"}</p>
            <h1 className={`pc-titulo pc-titulo--1 ${s.manchete}`}>{comDestaque(peca.titulo, peca.tituloDestaque)}</h1>
            <BotaoHeroi config={config} rotulo={peca.botaoPrincipal} alvoId={ID_PROVA} />
            <p className={s.apoio}>{peca.apoio}</p>
            <p className={s.confianca}>
              <b>{NUMEROS_OFICIAIS.barbearias.texto}</b> barbearias <span aria-hidden="true">·</span>{" "}
              <b>{NUMEROS_OFICIAIS.assinantes.texto}</b> assinantes ativos
            </p>
            <p className={s.preco}>
              A partir de R$299 ·{" "}
              <a className={s.linkToque} href={HREF_CONDICOES}>
                ver condições
              </a>
            </p>
          </div>
        </section>

        <section className={`pc-secao pc-secao--carvao-fundo ${s.prova}`} id={ID_PROVA}>
          <div className={s.provaGrade}>
            <div className={s.provaTela}>
              <ProvaAnimada config={config}>
                {conteudo.telaProva === "app-marca" ? (
                  <SimuladorApp config={config}>
                    <Tela id={conteudo.telaProva} />
                  </SimuladorApp>
                ) : (
                  <Tela id={conteudo.telaProva} />
                )}
              </ProvaAnimada>
              <p className={s.legenda}>Tela de exemplo. Marca e dados fictícios.</p>
            </div>
            <div>
              <p className="pc-rotulo">Na BestBarbers</p>
              <h2 className={`pc-titulo pc-titulo--2 ${s.provaTitulo}`}>{peca.exemploTitulo}</h2>
              <ol className={s.passos}>
                {conteudo.passos.map((p, i) => (
                  <li key={i}>
                    <span aria-hidden="true">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
              <a className={`pc-botao pc-botao--ouro pc-botao--bloco ${s.provaCta}`} href={`#${PC_FORMULARIO_ID}`}>
                {ROTULO_CONTATO}{"\u00a0"}↓
              </a>
            </div>
          </div>
        </section>

        <PcFormulario
          config={config}
          // Título curto e sem parágrafo de apoio (pedido do André, 23/Set): o formulário é a 3ª tela,
          // quem chegou aqui já leu a promessa e a prova — o texto longo só empurrava as perguntas.
          tituloSecao="Conte mais sobre a sua barbearia"
          apoioSecao=""
          ocultarTituloPasso1
          compacto
          rotuloContinuar="Continuar"
          clubStatusInicial={PC_CLUB_STATUS_POR_SITUACAO[peca.situacao]}
          situacao={peca.situacao}
          variante="curto"
        />

        <section className={`pc-secao pc-secao--carvao ${s.antesDepois}`}>
          <p className="pc-rotulo">Como fica o seu clube</p>
          <h2 className="pc-titulo pc-titulo--2">Hoje × com a BestBarbers</h2>
          <div className={s.pares}>
            {conteudo.antesDepois.map((par, i) => (
              <div key={i} className={s.par}>
                <p className={s.hoje}>
                  <small>Hoje</small>
                  {par.hoje}
                </p>
                <p className={s.com}>
                  <small>Com a BestBarbers</small>
                  {par.com}
                </p>
              </div>
            ))}
          </div>
        </section>

        <PcFaq
          destaque={{ pergunta: peca.faqPergunta, resposta: peca.faqResposta }}
          gerais={PC_FAQ_GERAL}
          situacao={peca.situacao}
          // Só a pergunta da promessa + as gerais que a situação pede (4 a 5 no total). O acervo
          // da família e duas gerais que não são objeção de quem vem do anúncio ficam de fora:
          // com elas eram 9 perguntas e 1.200 px no celular.
          limiteSituacao={0}
          excluir={FAQ_FORA}
          hrefCondicoes={HREF_CONDICOES}
        />

        <PcChamadaFinal
          titulo={peca.titulo}
          apoio="Conte como está o seu clube hoje. O time mostra a BestBarbers com as regras da sua barbearia e apresenta o investimento antes de qualquer compromisso."
          rotuloBotao={ROTULO_CONTATO}
          notaPreco={PC_BLOCOS.notaPreco}
          hrefCondicoes={HREF_CONDICOES}
          alvoFormularioId={PC_FORMULARIO_ID}
        />
      </main>

      <PcRodape hrefCondicoes={HREF_CONDICOES} alvoFormularioId={PC_FORMULARIO_ID} />
      <CtaFixoClube rotulo={ROTULO_CONTATO} />
      <EventosPagina config={config} />
    </div>
  );
}
