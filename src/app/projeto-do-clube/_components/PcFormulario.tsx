"use client";

/**
 * FORMULÁRIO DO PROJETO DO CLUBE — o único ponto de conversão da família.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * O QUE ESTE ARQUIVO **NÃO** FAZ (e ninguém deve reintroduzir)
 * ────────────────────────────────────────────────────────────────────────────
 * Ele não valida as oito perguntas, não mascara telefone, não faz dedup, não
 * calcula score, não cria contato nem card no Ploomes, não lê `_fbp`/`_fbc`,
 * não empurra `dataLayer` e NÃO dispara `Lead`, `QualifiedLead`,
 * `QualifiedLead60` nem `LeadComEquipe`. Tudo isso é do `useLeadForm`
 * (`src/hooks/useLeadForm.ts`), que dispara Pixel e CAPI com o MESMO `eventId`
 * para a Meta deduplicar. Formulário próprio nesta página seria regressão
 * garantida em seis frentes de uma vez (V8 do contrato).
 *
 * Aqui mora só o que é da PÁGINA: os dois passos, a transição entre eles, o
 * foco, o texto variável por peça e a ponte para a confirmação.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * AS TRÊS PERGUNTAS QUE NÃO PODEM SER OPCIONAIS
 * ────────────────────────────────────────────────────────────────────────────
 * `calcularScoreV2` devolve `null` — não zero — quando falta faturamento, clube
 * ou profissionais (`lead-score.ts`, guarda do `if (!faturamento || !clube ||
 * !profissionais) return null`). Score nulo vai para o CRM como campo VAZIO, o
 * `QualifiedLead` não dispara, e a célula que otimiza por corte de qualidade
 * deixa de ver o lead. Por isso o passo 1 é um portão: sem as quatro respostas
 * ninguém chega no passo do telefone. As mensagens de validação são as MESMAS
 * de `@/lib/qualificacao` que o submit usaria — a tela e o hook nunca falam
 * coisas diferentes sobre o mesmo campo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ORIGEM DO PLOOMES — nunca um número cru
 * ────────────────────────────────────────────────────────────────────────────
 * No tráfego pago quem resolve a origem é o `useUtmParams`: `utm_source=meta`
 * está nos aliases e o sinal da Meta (`publico`, `adset_id`, `ad_id`,
 * `utm_medium=paid`, `fbclid`) também resolve sozinho. O fallback abaixo só
 * pega em visita direta — e é uma origem que EXISTE no CRM, nunca `null` e
 * nunca uma origem nova (origem nova apaga o funil de 11 leitores que têm
 * 40210173 escrito na mão).
 *
 * A leitura da URL só acontece depois do mount: `getUtmParams` toca `window` e
 * `sessionStorage`, e lê-la no servidor quebraria a hidratação.
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useLeadForm, useUtmParams } from "@/hooks";
import { AvisoPrivacidade } from "@/components/forms/AvisoPrivacidade";
import { CLUBE_OPCOES } from "@/lib/lead-score";
import {
  MSG_CLUBE,
  MSG_FATURAMENTO,
  MSG_PROFISSIONAIS,
  MSG_SISTEMA,
  errosDeQualificacao,
} from "@/lib/qualificacao";
import { usePcEventos } from "./pc-eventos";
import { pcHrefCom } from "./pc-link";
import { PC_BLOCOS, PC_ROTULO_CONTEXTO } from "./pc-copy";
import type { PcFormVariante, PcPaginaConfig, PcSituacao } from "./pc.types";
import { PcPassoContexto } from "./PcPassoContexto";
import { PcPassoContato } from "./PcPassoContato";
import { PcSucesso } from "./PcSucesso";
import estilos from "./PcFormulario.module.css";

/** Origem de visita direta — «Site do BestBarbers». O pago vence este fallback. */
const PC_ORIGEM_DIRETA = 40210426;

/** Âncora do bloco: `PcCtaFixo` observa este id para sumir quando ele entra na tela. */
export const PC_FORMULARIO_ID = "pc-formulario";

/**
 * Quantos formulários estão montados agora. V8 é «um formulário só por página»:
 * dois `useLeadForm` na mesma tela são dois estados, dois dedups e dois caminhos
 * de envio competindo. O aviso é de desenvolvimento e NUNCA derruba a página do
 * visitante — quebrar a conversão para punir um erro de composição seria trocar
 * um problema por outro pior.
 */
const instanciasMontadas = new Set<string>();

export interface PcFormularioProps {
  config: PcPaginaConfig;
  /** «Conte o que você quer organizar» — literal da biblioteca. */
  tituloSecao: string;
  /** Apoio da peça: variante padrão ou curta. */
  apoioSecao: string;
  /** String literal de `CLUBE_OPCOES`, vinda da rota ou do seletor de situação. */
  clubStatusInicial: string;
  /**
   * Situação de quem lê. Muda SÓ o título do passo 1 (`PC_ROTULO_CONTEXTO`);
   * os quatro campos e a validação são idênticos nas quatro situações, porque
   * são eles que alimentam o score.
   */
  situacao?: PcSituacao;
  /** `curto` só muda a densidade do cartão; campos e validação são idênticos. */
  variante?: PcFormVariante;
  /**
   * Esconde da TELA o título do passo 1 («Como está seu clube hoje?») — ele continua para leitor
   * de tela e como alvo do foco na troca de passo. Usado em `/clube/[peca]`, onde o título da
   * seção já diz o que o passo pede.
   */
  ocultarTituloPasso1?: boolean;
  /**
   * Espaçamentos enxutos (seção, cartão, barra de passo, perguntas, botão). Os campos mantêm
   * 44 px de área de toque. Usado em `/clube/[peca]`, a pedido do André (23/Set).
   */
  compacto?: boolean;
  /** Rótulo do botão do passo 1. Ausente = o padrão do `PcPassoContexto` («Continuar para pedir contato»). */
  rotuloContinuar?: string;
  /** Só o bloco principal usa `pc-formulario`. Uma variante no topo pede outro id. */
  id?: string;
  className?: string;
}

export function PcFormulario({
  config,
  tituloSecao,
  apoioSecao,
  clubStatusInicial,
  situacao = "geral",
  variante = "padrao",
  ocultarTituloPasso1 = false,
  compacto = false,
  rotuloContinuar,
  id = PC_FORMULARIO_ID,
  className = "",
}: PcFormularioProps) {
  const router = useRouter();
  const idForm = useId();
  const eventos = usePcEventos(config);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [passo, setPasso] = useState<1 | 2>(1);
  /**
   * Falso na primeira pintura: o formulário NÃO anima ao abrir (M4) e nada
   * nasce com `opacity: 0` (V6). Vira verdadeiro na primeira troca de passo e
   * aí passa a valer também o foco programático no título.
   */
  const [animar, setAnimar] = useState(false);
  /** `projeto_form_iniciado` uma vez por preenchimento: «Voltar» + «Continuar» não é avanço novo. */
  const formIniciadoRef = useRef(false);

  const { getUtmParams, getOriginMapping } = useUtmParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const utm = useMemo(
    () => (mounted ? getOriginMapping(getUtmParams()) : { originId: null, originDesc: null }),
    [mounted, getOriginMapping, getUtmParams],
  );

  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    isDedupChecking,
    handleInputChange,
    handleSubmit,
    setSubmitError,
  } = useLeadForm({
    source: config.source,
    originId: utm.originId ?? PC_ORIGEM_DIRETA,
    originDesc: utm.originDesc ?? `[Projeto-Clube]${config.rotulo}`,
    // `redirectToWhatsApp` fica FALSO (padrão): o `messageMap` do redirect cita
    // nomes de parceiros, dois deles banidos. O destino é a confirmação própria.
    onSuccess: () => {
      // A search inteira viaja junto — sem ela o A/B perde a célula do lead na
      // confirmação e qualquer leitura por conjunto passa a medir outra coisa.
      router.push(pcHrefCom(window.location.search, "/projeto-do-clube/obrigado"));
    },
    onError: (e) => console.error("Falha ao enviar o formulário:", e),
  });

  // Aviso de composição — só em desenvolvimento (ver `instanciasMontadas`).
  useEffect(() => {
    instanciasMontadas.add(idForm);
    if (process.env.NODE_ENV !== "production" && instanciasMontadas.size > 1) {
      console.error(
        "[projeto-do-clube] Há mais de um PcFormulario montado na mesma página. " +
          "V8 do contrato: um formulário só. Dois estados de envio na mesma tela " +
          "significam dois dedups e dois caminhos de submit competindo.",
      );
    }
    return () => {
      instanciasMontadas.delete(idForm);
    };
  }, [idForm]);

  /**
   * A situação vinda da rota/seletor entra como resposta da pergunta 7, e entra
   * pelo `handleInputChange` do hook — ele continua o dono único do estado.
   *
   * DUAS GUARDAS. As duas custam lead quando faltam, e as duas falham em silêncio:
   *
   * 1. SÓ ENTRA O QUE EXISTE NA RÉGUA. `calcularScoreV2` devolve `null` quando a
   *    resposta do clube não está em `CLUBE_OPCOES` (`lead-score.ts:147`) — e
   *    score nulo é campo VAZIO no CRM, `QualifiedLead`/`QualifiedLead60` que não
   *    disparam e, numa célula com corte, o próprio `Lead` suprimido
   *    (`useLeadForm.ts:261-263`). Como este valor é escrito por CÓDIGO (rota ou
   *    seletor) e não escolhido na tela, um literal fora da tabela passaria sem
   *    ninguém ver: o `<select>` renderizaria vazio, a validação passaria (o
   *    estado é truthy) e o lead entraria sem nota. Fora da tabela, ignoramos: a
   *    pessoa responde na tela e o score sobrevive.
   *
   * 2. TROCA DE SITUAÇÃO REAPLICA. O seletor da entrada geral não navega (V2):
   *    ele só troca esta prop. Uma guarda de "só se estiver vazio" prenderia para
   *    sempre a PRIMEIRA situação — quem olhasse duas opções antes de preencher
   *    mandaria ao CRM a resposta errada da pergunta que mais pesa no score.
   *    Reaplicamos quando a prop MUDA, e nunca por cima do que a pessoa escolheu
   *    com a mão: `aplicadoRef` guarda o último valor que NÓS escrevemos, então
   *    campo diferente dele significa que quem respondeu foi ela.
   */
  const aplicadoRef = useRef<string | null>(null);
  useEffect(() => {
    if (!clubStatusInicial) return;
    if (!(CLUBE_OPCOES as readonly string[]).includes(clubStatusInicial)) {
      if (process.env.NODE_ENV !== "production") {
        console.error(
          `[projeto-do-clube] clubStatusInicial fora de CLUBE_OPCOES: "${clubStatusInicial}". ` +
            "Pré-preenchimento ignorado — com ele o lead entraria sem score (lead-score.ts:147).",
        );
      }
      return;
    }
    if (clubStatusInicial === aplicadoRef.current) return;
    // Resposta dada na tela vence o pré-preenchimento.
    if (formData.clubStatus && formData.clubStatus !== aplicadoRef.current) return;
    aplicadoRef.current = clubStatusInicial;
    handleInputChange({
      target: { name: "clubStatus", value: clubStatusInicial },
    } as ChangeEvent<HTMLSelectElement>);
  }, [clubStatusInicial, formData.clubStatus, handleInputChange]);

  const erros = errosDeQualificacao(submitError);

  /**
   * Passo 1 → 2. Valida as quatro de contexto com as MESMAS mensagens do submit
   * (comparação exata em `errosDeQualificacao` pinta o campo certo).
   */
  const continuar = useCallback(() => {
    if (!formData.monthlyRevenue) {
      setSubmitError(MSG_FATURAMENTO);
      return;
    }
    if (!formData.currentSystem) {
      setSubmitError(MSG_SISTEMA);
      return;
    }
    if (!formData.clubStatus) {
      setSubmitError(MSG_CLUBE);
      return;
    }
    if (!formData.employeeCount) {
      setSubmitError(MSG_PROFISSIONAIS);
      return;
    }
    setSubmitError(null);
    setAnimar(true);
    setPasso(2);
    if (!formIniciadoRef.current) {
      formIniciadoRef.current = true;
      eventos.formIniciado();
    }
  }, [
    formData.monthlyRevenue,
    formData.currentSystem,
    formData.clubStatus,
    formData.employeeCount,
    setSubmitError,
    eventos,
  ]);

  const voltar = useCallback(() => {
    setSubmitError(null);
    setAnimar(true);
    setPasso(1);
  }, [setSubmitError]);

  /**
   * Erro de qualificação no passo 1: leva o foco ao `<select>` culpado. Os ids
   * dos quatro campos são gerados dentro do `<PerguntasQualificacao>`, então a
   * busca é pelo estado (`aria-invalid`) e não por id — isso não acopla este
   * bloco à implementação de lá.
   */
  useEffect(() => {
    if (passo !== 1 || !submitError) return;
    const alvo = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    alvo?.focus();
  }, [passo, submitError]);

  /**
   * Rede de segurança: se o submit for recusado por uma das quatro perguntas de
   * CONTEXTO, a pessoa volta para o passo onde o campo existe. Sem isto ela
   * leria «Faturamento médio é obrigatório» numa tela que só tem nome, telefone
   * e-mail e barbearia — que é exatamente o defeito que o e-mail do passo 1 da
   * /v12 produziu antes de ganhar validação no lugar certo (`lib/form-passo1`).
   */
  useEffect(() => {
    if (passo !== 2 || !submitError) return;
    const ehDeContexto =
      submitError === MSG_FATURAMENTO ||
      submitError === MSG_SISTEMA ||
      submitError === MSG_CLUBE ||
      submitError === MSG_PROFISSIONAIS;
    if (!ehDeContexto) return;
    setAnimar(true);
    setPasso(1);
  }, [passo, submitError]);

  /**
   * Enter dentro do passo 1 AVANÇA, não envia. Sem este desvio, a tecla Enter
   * num `<select>` dispararia o submit de um formulário sem nome e sem telefone
   * — a pessoa veria o erro de um campo que ainda nem apareceu na tela.
   */
  const aoEnviarFormulario = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (passo === 1) {
        continuar();
        return;
      }
      void handleSubmit(e);
    },
    [passo, continuar, handleSubmit],
  );

  const curto = variante === "curto";
  const tituloSecaoId = `${idForm}-titulo`;
  const tituloPassoId = `${idForm}-passo`;

  return (
    <section
      id={id}
      className={`pc-papel ${estilos.secao} ${compacto ? estilos.compacto : ""} ${className}`}
      aria-labelledby={tituloSecaoId}
    >
      <div className={`${estilos.cartao} ${curto ? estilos.cartaoCurto : ""}`}>
        <div className={estilos.faixa} aria-hidden="true" />

        <div className={curto ? estilos.corpoCurto : estilos.corpo}>
          <h2 id={tituloSecaoId} className={estilos.titulo}>
            {tituloSecao}
          </h2>
          {apoioSecao ? <p className={estilos.apoio}>{apoioSecao}</p> : null}

          {submitted ? (
            <PcSucesso />
          ) : (
            <>
              <div className={estilos.progresso}>
                <span className={estilos.progressoRotulo}>Passo {passo} de 2</span>
                {/* O trilho é decoração: o texto acima já carrega o estado. */}
                <span className={estilos.progressoTrilho} aria-hidden="true">
                  <span
                    className={estilos.progressoBarra}
                    style={{ width: passo === 1 ? "50%" : "100%" }}
                  />
                </span>
              </div>

              <form
                ref={formRef}
                onSubmit={aoEnviarFormulario}
                aria-labelledby={tituloPassoId}
                /*
                  `noValidate`: as mensagens do navegador competiriam com as da
                  casa — outra redação, outra ordem e um balão que some sozinho.
                  Quem valida é o `useLeadForm`, com a mensagem que o
                  `errosDeQualificacao` sabe mapear de volta para o campo.
                */
                noValidate
              >
                {passo === 1 ? (
                  <PcPassoContexto
                    valores={formData}
                    onChange={handleInputChange}
                    erros={erros}
                    clubStatusInicial={clubStatusInicial}
                    aoContinuar={continuar}
                    tituloId={tituloPassoId}
                    titulo={PC_ROTULO_CONTEXTO[situacao]}
                    tituloOculto={ocultarTituloPasso1}
                    {...(rotuloContinuar ? { rotuloBotao: rotuloContinuar } : {})}
                    erroGeral={submitError}
                    animar={animar}
                  />
                ) : (
                  <PcPassoContato
                    formData={formData}
                    onChange={handleInputChange}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitted={submitted}
                    isDedupChecking={isDedupChecking}
                    submitError={submitError}
                    rotuloBotao={config.peca.botaoContato}
                    aoVoltar={voltar}
                    idPrefixo={idForm}
                    tituloId={tituloPassoId}
                    animar={animar}
                  />
                )}

                {/*
                  A microcopy do envio só aparece no passo do envio — no passo 1
                  ela seria falsa (o passo 1 não pede contato, e o próprio passo
                  diz isso com todas as letras).

                  O aviso de privacidade aparece nos DOIS passos, porque o passo 1
                  já coleta resposta e o link da política tem de estar à vista onde
                  o dado é pedido. Mas no passo 1 ele vai em `somenteLink`: a frase
                  «Ao enviar, você autoriza a BestBarbers a falar com você» ficava a
                  poucos pixels de «Preencher contexto não cria pedido comercial nem
                  dispara contato» (PcPassoContexto), e no passo 1 não existe
                  «enviar» — o botão é «Continuar para pedir contato». A autorização
                  fica onde o envio existe.
                */}
                {passo === 2 && <p className={estilos.microcopy}>{PC_BLOCOS.microcopyEnvio}</p>}
                <AvisoPrivacidade variante="claro" somenteLink={passo === 1} />
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
