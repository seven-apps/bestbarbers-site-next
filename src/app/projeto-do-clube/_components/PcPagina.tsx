"use client";

/**
 * O ORQUESTRADOR — a única coisa que sabe a ordem da página.
 *
 * Nove construtores fizeram os blocos; aqui eles viram UMA página. O que este arquivo
 * decide, e por quê:
 *
 * 1. ORDEM — a de §2.2, com os quatro blocos editoriais (comparativo, objeções,
 *    fronteira, números) encaixados onde o argumento pede: primeiro o mecanismo
 *    (o que é), depois a comparação (por que muda), então as objeções e a fronteira
 *    honesta (o que NÃO é), os números, as condições abertas e só então o pedido.
 *    A página promete no herói e cumpre ANTES de pedir — é o contrato editorial do
 *    cap. 13, não gosto pessoal.
 *
 * 2. SITUAÇÃO EM ESTADO — o seletor troca a copy e o pré-preenchimento da pergunta 7
 *    do formulário, e NÃO navega (V2). Rota com situação declarada não mostra seletor:
 *    a pessoa já disse de onde vem quando clicou no anúncio.
 *
 * 3. UM FORMULÁRIO SÓ (V8). `PcFormularioTopo` existe e é a alternativa documentada,
 *    mas os dois na mesma tela são dois `useLeadForm`, dois dedups de telefone e dois
 *    caminhos de envio competindo.
 *
 * 4. PONTE PELA GUARDA V9. A ponte vem de `ponteEfetiva(peca)`, nunca de `peca.ponte`:
 *    enquanto a demonstração for placeholder, nenhuma rota promete «veja primeiro».
 *
 * 5. A BARRA DE CONFIANÇA DO HERÓI FICA DESLIGADA. Ela publica os MESMOS quatro
 *    números oficiais do bloco `PcNumeros` (1.200+ · 51.000+ · R$5 mi+ · 6 mi+). Os
 *    dois na mesma página é o mesmo fato duas vezes — e a versão do `PcNumeros` é a
 *    que vem com as ressalvas que tornam o número honesto (L093, L076). Religar é
 *    trocar `false` por `true` numa linha.
 *
 * 6. DOIS BLOCOS PRONTOS FICAM FORA DA MONTAGEM PADRÃO — ver `PC_BLOCOS_EXTRAS`.
 *    Não foram apagados e não é desprezo pelo trabalho: é o resultado de MEDIR a
 *    página montada no navegador, e a conta está escrita lá embaixo.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { PcCabecalho } from "./PcCabecalho";
import { PcHeroi } from "./PcHeroi";
import { PcSeletorSituacao } from "./PcSeletorSituacao";
import { PcDemonstracao } from "./Demonstracao";
import { PcMecanismo } from "./Mecanismo";
import { PcComoFunciona } from "./ComoFunciona";
import { PcComparativo } from "./Comparativo";
import { PcObjecoes, PC_OBJECOES_PERGUNTAS } from "./Objecoes";
import { PcFronteira } from "./Fronteira";
import { PcNumeros } from "./Numeros";
import { PcExemplo, PcConversaEntrega, PcCondicoes, PcPonte } from "./PcBlocosTexto";
import { PcFormulario, PC_FORMULARIO_ID } from "./PcFormulario";
import { PcFaq } from "./PcFaq";
import { PcChamadaFinal } from "./PcChamadaFinal";
import { PcRodape } from "./PcRodape";
import { PcCtaFixo } from "./PcCtaFixo";

import { usePcEventos } from "./pc-eventos";
import { usePcHref } from "./pc-link";
import { usePcMovimentoReduzido } from "./pc-motion";
import {
  PC_ABERTURAS,
  PC_BLOCOS,
  PC_CLUB_STATUS_POR_SITUACAO,
  PC_FAQ_GERAL,
  PC_SELETOR,
  blocoDoFormulario,
  comoSegueDaSituacao,
  ponteEfetiva,
} from "./pc-copy";
import type { PcPaginaConfig, PcSituacao } from "./pc.types";

/**
 * OS DOIS BLOCOS QUE FICARAM FORA DA MONTAGEM PADRÃO — e a medição que decidiu.
 *
 * A página montada com TUDO deu, medida no navegador em 390×844:
 *
 *     pc-inicio        1.453     pc-conversa        530
 *     pc-demonstracao  1.817     pc-objecoes      2.640
 *     pc-mecanismo     4.191     pc-fronteira     3.210
 *     pc-exemplo         458     pc-numeros       1.362
 *     pc-como-funciona   814     pc-condicoes       437
 *     pc-comparativo   2.219     pc-ponte           240
 *                               pc-formulario    1.272
 *                               pc-perguntas     1.251
 *                               pc-chamada-final   714
 *     ────────────────────────────────────────────────
 *     TOTAL 23.209 px — e o FORMULÁRIO começava em ~19.000 px.
 *
 * Vinte e duas telas de celular antes do pedido. O CTA fixo ameniza, não resolve:
 * o que a página pedia era que o dono lesse um compêndio para pedir uma conversa.
 *
 * As duas retiradas atacam REPETIÇÃO, não conteúdo:
 *
 *  - `mecanismo` (4.191 px) — a página mostrava o produto TRÊS vezes antes do
 *    formulário: a moldura do herói (o mecanismo em 3 passos), a `PcDemonstracao`
 *    (mock animado da tela) e o `PcMecanismo` (6 figuras em CSS das mesmas telas).
 *    Duas já é generoso. A `PcDemonstracao` fica porque é ela que o botão do herói
 *    promete e é ela que o evento `clube_demo_aberta` mede.
 *
 *  - `fronteira` (3.210 px) — «o que a BestBarbers não promete». O conteúdo é bom e
 *    é o que separa esta página da /v12, mas ele já aparece DUAS vezes: nas objeções
 *    («Vocês dizem quantos assinantes eu vou conseguir?», «Vocês convencem minha
 *    equipe por mim?») e no FAQ geral («Vocês garantem faturamento ou adesão dos
 *    meus clientes?»). Nenhuma ressalva se perde ao tirar o bloco.
 *
 * Resultado medido depois: ~15.800 px, formulário em ~11.700 px.
 *
 * NADA FOI APAGADO. Os dois componentes continuam no repositório, testados e
 * compilando. Religar qualquer um é trocar `false` por `true` aqui — e é decisão do
 * André, não minha: eu meço e recomendo, ele decide o que a página diz.
 */
const PC_BLOCOS_EXTRAS = {
  /** 6 figuras em CSS do mecanismo do produto, passo a passo. */
  mecanismo: false,
  /** Comparação «como é hoje» × «com a BestBarbers», 5 linhas do acervo. */
  comparativo: true,
  /** As 5 objeções na voz do dono. É o bloco que mais destrava decisão. */
  objecoes: true,
  /** «Onde termina o produto e começa o seu trabalho», 3 colunas. */
  fronteira: false,
  /** Os 4 números oficiais, com as ressalvas L093 e L076. */
  numeros: true,
} as const;

export interface PcPaginaProps {
  config: PcPaginaConfig;
}

export function PcPagina({ config }: PcPaginaProps) {
  const { situacao: situacaoDaRota, peca } = config;

  const eventos = usePcEventos(config);
  const hrefCondicoes = usePcHref("/projeto-do-clube/condicoes");
  const movimentoReduzido = usePcMovimentoReduzido();

  /**
   * A situação VISÍVEL. Começa na da rota e só muda pelo seletor — que existe apenas
   * na entrada geral. Nada aqui reescreve a URL: a rota é o que o anúncio prometeu e
   * é o predicado que a regra de conversão personalizada da Meta lê (§1.2).
   */
  const [situacao, setSituacao] = useState<PcSituacao>(situacaoDaRota);
  const mostraSeletor = situacaoDaRota === "geral";

  // ViewContent, uma vez por carga. A guarda anti-repetição é um `Set` de módulo
  // dentro do `usePcEventos`, então este efeito pode rodar de novo sem duplicar.
  useEffect(() => {
    eventos.viewContent();
  }, [eventos]);

  // O selo do herói: o kicker do anúncio, quando a página declara um (/clube/[peca]) e a
  // situação ainda é a da rota — se a pessoa trocou no seletor, vale o texto da situação.
  const abertura =
    config.identificacao && situacao === situacaoDaRota
      ? { ...PC_ABERTURAS[situacao], identificacao: config.identificacao }
      : PC_ABERTURAS[situacao];
  const ponte = ponteEfetiva(peca);
  const blocoForm = blocoDoFormulario(peca);

  /**
   * Pré-preenchimento da pergunta 7. Se a pessoa clicou no seletor, vale a escolha
   * DELA; senão, vale a da rota (vazia na entrada geral — ninguém responde por ela).
   */
  const clubStatusInicial = useMemo(() => {
    const doSeletor = PC_SELETOR.find((o) => o.valor === situacao)?.clubStatus;
    return situacao === situacaoDaRota
      ? PC_CLUB_STATUS_POR_SITUACAO[situacaoDaRota]
      : (doSeletor ?? "");
  }, [situacao, situacaoDaRota]);

  const irParaFormulario = useCallback(() => {
    if (typeof document === "undefined") return;
    document.getElementById(PC_FORMULARIO_ID)?.scrollIntoView({
      behavior: movimentoReduzido ? "auto" : "smooth",
      block: "start",
    });
  }, [movimentoReduzido]);

  const irParaDemonstracao = useCallback(() => {
    eventos.demoAberta(peca.artefatoExigido ?? "clube-cobranca");
    if (typeof document === "undefined") return;
    document.getElementById("pc-demonstracao")?.scrollIntoView({
      behavior: movimentoReduzido ? "auto" : "smooth",
      block: "start",
    });
  }, [eventos, movimentoReduzido, peca.artefatoExigido]);

  const escolherSituacao = useCallback(
    (nova: PcSituacao) => {
      eventos.situacaoEscolhida(situacao, nova);
      setSituacao(nova);
    },
    [eventos, situacao],
  );

  const abrirCondicoesNoBloco = useCallback(() => {
    eventos.condicoesAbertas("bloco");
  }, [eventos]);

  return (
    <>
      <PcCabecalho
        aoPedirContato={irParaFormulario}
        hrefCondicoes={hrefCondicoes}
        aoAbrirCondicoes={abrirCondicoesNoBloco}
      />

      <main>
        <PcHeroi
          abertura={abertura}
          peca={peca}
          situacao={situacao}
          artefato={config.artefatoHeroi}
          notaPreco={PC_BLOCOS.notaPreco}
          hrefCondicoes={hrefCondicoes}
          aoPedirContato={irParaFormulario}
          aoVerDemonstracao={irParaDemonstracao}
          aoAbrirCondicoes={abrirCondicoesNoBloco}
          // Ver nota 5 do cabeçalho: os mesmos quatro números vivem no `PcNumeros`.
          mostrarBarraConfianca={false}
        />

        {mostraSeletor ? (
          <PcSeletorSituacao situacaoAtiva={situacao} aoEscolher={escolherSituacao} />
        ) : null}

        <PcDemonstracao
          titulo={PC_BLOCOS.demonstracao.titulo}
          resumo={PC_BLOCOS.demonstracao.texto}
          botao={PC_BLOCOS.demonstracao.botao}
          aoAbrir={(artefatoId) => eventos.demoAberta(artefatoId)}
        />

        {PC_BLOCOS_EXTRAS.mecanismo ? (
          <PcMecanismo aoTocar={() => eventos.demoAberta("clube-cobranca")} />
        ) : null}

        <PcExemplo titulo={peca.exemploTitulo} texto={peca.exemploTexto} />

        <PcComoFunciona
          titulo={PC_BLOCOS.comoFunciona.titulo}
          passos={PC_BLOCOS.comoFunciona.passos}
          hrefDetalhe={hrefCondicoes}
          aoVerDetalhe={abrirCondicoesNoBloco}
        />

        {PC_BLOCOS_EXTRAS.comparativo ? <PcComparativo situacao={situacao} /> : null}

        <PcConversaEntrega
          titulo={PC_BLOCOS.conversaEntrega.titulo}
          texto={PC_BLOCOS.conversaEntrega.texto}
        />

        {PC_BLOCOS_EXTRAS.objecoes ? <PcObjecoes situacao={situacao} /> : null}

        {PC_BLOCOS_EXTRAS.fronteira ? <PcFronteira /> : null}

        {PC_BLOCOS_EXTRAS.numeros ? <PcNumeros /> : null}

        <PcCondicoes
          titulo={PC_BLOCOS.condicoes.titulo}
          texto={PC_BLOCOS.condicoes.texto}
          hrefCondicoes={hrefCondicoes}
          aoAbrirCondicoes={abrirCondicoesNoBloco}
        />

        <PcPonte
          titulo={PC_BLOCOS.pontes[ponte].titulo}
          // Quando a ponte é «Como segue a conversa», o parágrafo repetiria os quatro
          // passos que o `PcComoFunciona` acabou de contar. Aí sobra só o pedido.
          texto={ponte === "como_segue" ? "" : PC_BLOCOS.pontes[ponte].texto}
          rotuloBotao={peca.botaoContato}
          aoPedirContato={irParaFormulario}
        />

        <PcFormulario
          config={config}
          tituloSecao={blocoForm.titulo}
          apoioSecao={blocoForm.texto}
          clubStatusInicial={clubStatusInicial}
          situacao={situacao}
          variante={peca.formularioVariante}
        />

        <PcFaq
          destaque={{ pergunta: peca.faqPergunta, resposta: peca.faqResposta }}
          gerais={PC_FAQ_GERAL}
          situacao={situacao}
          // O bloco de objeções já responde parte do acervo (L011 e L042 estão nos
          // dois bancos). Sem esta lista, a mesma resposta sairia duas vezes.
          excluir={PC_OBJECOES_PERGUNTAS}
          hrefCondicoes={hrefCondicoes}
          aoAbrirCondicoes={abrirCondicoesNoBloco}
        />

        <PcChamadaFinal
          titulo={abertura.titulo}
          // A ponte «como segue» abre contando o que a pessoa traz para a
          // conversa, e isso muda com a situação: quem ainda vai abrir não tem
          // um clube para contar «como está». As outras duas pontes não
          // pressupõem operação nenhuma e seguem literais.
          apoio={
            ponte === "como_segue" ? comoSegueDaSituacao(situacao) : PC_BLOCOS.pontes[ponte].texto
          }
          rotuloBotao={peca.botaoContato}
          notaPreco={PC_BLOCOS.notaPreco}
          hrefCondicoes={hrefCondicoes}
          alvoFormularioId={PC_FORMULARIO_ID}
          aoPedirContato={irParaFormulario}
          aoAbrirCondicoes={abrirCondicoesNoBloco}
        />
      </main>

      <PcRodape
        hrefCondicoes={hrefCondicoes}
        alvoFormularioId={PC_FORMULARIO_ID}
        aoPedirContato={irParaFormulario}
        aoAbrirCondicoes={abrirCondicoesNoBloco}
      />

      <PcCtaFixo
        rotulo={peca.botaoContato}
        alvoId={PC_FORMULARIO_ID}
        aoClicar={irParaFormulario}
      />
    </>
  );
}

export default PcPagina;
