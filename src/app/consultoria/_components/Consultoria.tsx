"use client";

// Fonte: ficha aprovada da consultoria (04/Nov/26) + faturamento e meta (S21, 07/Nov/26); conteúdo em ../_data/consultoria-v2.json.
// No fim, a navegação é completa até /consultoria/plano: é o `page_view` dessa página que mede o fim no GA4.
// A/B do momento do contato (10/Nov/26): regra, braços e medição em ../_lib/ab.ts.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowLeftRight, ChevronLeft, FileText, Repeat, TrendingUp, UserPlus, Users } from "lucide-react";
import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { criarCardRecadastro } from "@/lib/recadastro";
import { temEquipe } from "@/lib/lead-score";
import {
  AB_CONTATO_ATIVO, COOKIE_AB_CONSULTORIA, DIAS_COOKIE, bracoDoVisitante, bracoForcado, eventoDaTela, eventoDoContato,
  sufixoDoBraco, type BracoContato,
} from "../_lib/ab";
import { mascaraTelefone, validarContato } from "../_lib/contato";
import { comTeto, empurrar, enviarCapi } from "../_lib/eventos";
import { escolher, objetivoDaUrl, perguntasDoFluxo, progresso, proximaTela, telaRespondida } from "../_lib/flow";
import { enderecoDoPlano, opcoesDaMeta } from "../_lib/plano";
import {
  CHAVE_DA_SESSAO, FECHO_CEDO, LP_VERSION, clubeDoCRM, dadosDoContato, enderecoParaTerminar, equipeDoCRM, faturamentoDoCRM,
  notaDoLead, quandoDoCRM, resumoDaFicha, resumoParcial, type CadastroDaSessao,
} from "../_lib/ploomes";
import type { PloomesContactData } from "@/hooks/usePloomesAPI";
import type { ConteudoConsultoria, Opcao, Respostas, Tela } from "../_lib/types";
import styles from "../consultoria.module.css";

const ICONES: Record<string, ReactNode> = {
  faturamento: <TrendingUp aria-hidden="true" />,
  assinatura: <Repeat aria-hidden="true" />,
  troca: <ArrowLeftRight aria-hidden="true" />,
  clientes: <UserPlus aria-hidden="true" />,
  equipe: <Users aria-hidden="true" />,
  nota: <FileText aria-hidden="true" />,
};

/** Pausa entre o toque e a próxima tela: a pessoa vê a opção marcada antes de a tela trocar. */
const PAUSA_MS = 220;

export function Consultoria(conteudo: ConteudoConsultoria) {
  const { telas } = conteudo;
  const [tela, setTela] = useState<Tela>("objetivo");
  const [historico, setHistorico] = useState<Tela[]>([]);
  const [r, setR] = useState<Respostas>({});
  const [veioDoAnuncio, setVeioDoAnuncio] = useState(false);
  const [contato, setContato] = useState({ name: "", whatsapp: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  /** null até o sorteio rodar no navegador (o servidor não sorteia: a página é a mesma até o contato). */
  const [braco, setBraco] = useState<BracoContato | null>(null);
  const [finalizando, setFinalizando] = useState(false);
  const avancando = useRef(false);
  const comecou = useRef(false);
  /** Braço cedo: o cadastro feito na tela de contato, para a conclusão gravar a ficha completa no mesmo contato. */
  const cadastroCedo = useRef<CadastroDaSessao | null>(null);
  const telasMedidas = useRef(new Set<string>());
  const corpo = useRef<HTMLDivElement>(null);
  const { submitLead, checkPhoneExists, buildAttribution, createInteractionRecord } = usePloomesAPI();
  const { trackLead, trackQualifiedLead, trackQualifiedLead60, trackNonCatalogEvent } = useMetaPixel();

  useEffect(() => {
    const objetivo = objetivoDaUrl(window.location.search, conteudo);
    if (objetivo) {
      setR({ objetivo });
      setTela("trava");
      setVeioDoAnuncio(true);
    }
  }, [conteudo]);

  useEffect(() => {
    const forcado = bracoForcado(new URLSearchParams(window.location.search).get("contato"));
    const salvo = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_AB_CONSULTORIA}=([^;]*)`))?.[1];
    const escolhido = forcado ?? bracoDoVisitante(salvo, Math.random());
    // O braço forçado (`?contato=`, QA e revisão) não grava cookie: a revisão não contamina o sorteio do aparelho.
    if (!forcado && AB_CONTATO_ATIVO && salvo !== escolhido) {
      document.cookie = `${COOKIE_AB_CONSULTORIA}=${escolhido}; max-age=${DIAS_COOKIE * 86400}; path=/; samesite=lax`;
    }
    setBraco(escolhido);
  }, []);

  useEffect(() => {
    corpo.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tela]);

  // Uma vez por tela e por visita, depois do sorteio: é o funil por pergunta que o pixel conta, por braço.
  useEffect(() => {
    if (!braco || tela === "pronto" || telasMedidas.current.has(tela)) return;
    telasMedidas.current.add(tela);
    empurrar("consultoria_tela", { tela, braco, lp_version: LP_VERSION });
    void trackNonCatalogEvent(eventoDaTela(tela, braco), { content_name: "Consultoria", lp_version: LP_VERSION });
  }, [tela, braco, trackNonCatalogEvent]);

  /** O 1º toque é o início medido: uma vez por visita. */
  function marcarInicio(primeira: string) {
    if (comecou.current) return;
    comecou.current = true;
    empurrar("consultoria_inicio", { lp_version: LP_VERSION, primeira_resposta: primeira });
    void trackNonCatalogEvent("ConsultoriaInicio", { content_name: "Consultoria", lp_version: LP_VERSION });
  }

  function irPara(proxima: Tela) {
    setHistorico((h) => [...h, tela]);
    setErros({});
    setTela(proxima);
  }

  function voltar() {
    if (!historico.length || avancando.current || enviando) return;
    setTela(historico[historico.length - 1]);
    setHistorico((h) => h.slice(0, -1));
    setErros({});
  }

  /** Um toque = uma escolha. A trava `avancando` impede que dois toques rápidos pulem duas telas. */
  function tocar(chave: keyof Respostas, valor: string) {
    if (avancando.current) return;
    marcarInicio(`${chave}:${valor}`);
    const novo = escolher(conteudo, r, chave, valor);
    setR(novo);
    if (!telaRespondida(tela, novo)) return;
    avancando.current = true;
    const atual = tela;
    window.setTimeout(() => {
      avancando.current = false;
      const proxima = proximaTela(conteudo, atual, novo, braco ?? "fim");
      // Braço cedo: depois do prazo não há tela de contato (ela já veio); é a hora de montar o plano.
      if (proxima === "pronto") {
        void finalizarCedo(novo);
        return;
      }
      setHistorico((h) => [...h, atual]);
      setTela(proxima);
    }, PAUSA_MS);
  }

  /**
   * Os eventos do Meta: Lead em todo envio válido (o conjunto da consultoria otimiza Lead), mais as medições da casa.
   * No braço cedo, Lead e equipe saem no contato e as notas (que dependem do prazo) saem na conclusão.
   */
  function dispararEventos(
    dados: PloomesContactData, respostas: Respostas, leadEventId: string,
    o: { lead: boolean; equipe: boolean; notas: boolean },
  ): Promise<void>[] {
    const nota = notaDoLead(respostas);
    // `content_name` fica o padrão do formulário ("BestBarbers Lead Form"): conversão personalizada que casa por ele não
    // perde a consultoria. Quem separa é o `lp_version`.
    const pixel = {
      lp_version: LP_VERSION,
      ...(dados.monthlyRevenue && { monthly_revenue: dados.monthlyRevenue }),
      ...(dados.employeeCount && { employee_count: dados.employeeCount }),
      ...(nota !== null && { lead_score: nota }),
    };
    const pessoa = { telefone: contato.whatsapp, nome: contato.name.trim() };
    const disparos: Promise<void>[] = [];
    if (o.lead) {
      disparos.push(trackLead(pixel, leadEventId));
      enviarCapi("Lead", leadEventId, pessoa);
    }
    if (o.notas && nota !== null && nota >= 30) {
      disparos.push(trackQualifiedLead(pixel, `${leadEventId}-q`));
      enviarCapi("QualifiedLead", `${leadEventId}-q`, pessoa);
    }
    if (o.notas && nota !== null && nota >= 60) {
      disparos.push(trackQualifiedLead60(pixel, `${leadEventId}-q60`));
      enviarCapi("QualifiedLead60", `${leadEventId}-q60`, pessoa);
    }
    if (o.equipe && dados.employeeCount && temEquipe(dados.employeeCount)) {
      disparos.push(trackNonCatalogEvent("LeadComEquipe", pixel, `${leadEventId}-eq`));
      enviarCapi("LeadComEquipe", `${leadEventId}-eq`, pessoa);
    }
    return disparos;
  }

  /**
   * Telefone conhecido → card novo na Qualificação para o contato que já existe (recadastro, o mesmo do formulário);
   * telefone novo → contato novo pela chave do site, e a automação abre o card na Qualificação (ADR-038).
   * Lança erro quando o Ploomes não grava.
   */
  async function cadastrar(dados: PloomesContactData, respostas: Respostas, leadEventId: string): Promise<CadastroDaSessao> {
    const existe = await checkPhoneExists(contato.whatsapp);
    if (existe) {
      const recadastro = await criarCardRecadastro({
        phone: contato.whatsapp,
        barbershopName: contato.name.trim(),
        atribuicao: buildAttribution(dados),
        faturamento: faturamentoDoCRM(respostas),
        colaboradores: equipeDoCRM(respostas),
        clube: clubeDoCRM(respostas),
        quando: quandoDoCRM(respostas),
      });
      if (!recadastro.ok) throw new Error(`recadastro: ${recadastro.motivo ?? "falhou"}`);
      return { contactId: recadastro.contactId ?? null, dealId: recadastro.dealId ?? null, leadEventId };
    }
    const { contactId } = await submitLead(dados);
    return { contactId, dealId: null, leadEventId };
  }

  /** A ficha completa no Ploomes, os eventos que faltam e a navegação até o plano. Os dois braços terminam aqui. */
  async function concluir(respostas: Respostas, cadastro: CadastroDaSessao, leadJaFoi: boolean) {
    const nome = contato.name.trim();
    const plano = enderecoDoPlano(respostas, nome);
    const dados = dadosDoContato({ nome, whatsapp: contato.whatsapp, respostas, conteudo, enderecoDoPlano: plano, leadEventId: cadastro.leadEventId });

    // A linha completa do contrato (com a distância, o prazo e o link do plano) não cabe nos 250 caracteres da descrição:
    // vai numa anotação no contato (e no card, no recadastro), que o SDR vê na linha do tempo.
    if (cadastro.contactId) {
      try {
        await comTeto(createInteractionRecord({ contactId: cadastro.contactId, dealId: cadastro.dealId, content: resumoDaFicha(conteudo, respostas, plano) }), 4000);
      } catch (erro) {
        console.error("[Consultoria] A anotação da ficha não foi gravada no Ploomes:", erro);
      }
    }

    const b = braco ?? "fim";
    const disparos = dispararEventos(dados, respostas, cadastro.leadEventId, { lead: !leadJaFoi, equipe: !leadJaFoi, notas: true });
    disparos.push(trackNonCatalogEvent(eventoDaTela("plano", b), { content_name: "Consultoria", lp_version: LP_VERSION }));
    empurrar("consultoria_tela", { tela: "plano", braco: b, lp_version: LP_VERSION });
    empurrar("consultoria_fim", {
      event_id: cadastro.leadEventId,
      lp_version: LP_VERSION,
      braco: b,
      objetivo: respostas.objetivo,
      trava: respostas.trava,
      faturamento: respostas.faturamento,
      meta: respostas.meta,
      prazo: respostas.prazo,
      lead_score: notaDoLead(respostas),
      recadastro: cadastro.dealId !== null,
    });

    try {
      sessionStorage.setItem(CHAVE_DA_SESSAO, JSON.stringify({ ...cadastro, outra: respostas.outra ?? "" }));
    } catch {
      // Sem a sessão, a página do plano abre sem o bloco do horário: o card já está criado.
    }
    await comTeto(Promise.all(disparos), 1500);
    const destino = new URL(plano);
    destino.searchParams.set("de", "ficha");
    window.location.assign(`${window.location.origin}${destino.pathname}${destino.search}`);
  }

  /** Braço cedo, depois da última pergunta: o contato já está no Ploomes; falta a ficha completa e o plano. */
  async function finalizarCedo(respostas: Respostas) {
    const cadastro = cadastroCedo.current;
    if (!cadastro) {
      // Não acontece no fluxo (o contato vem antes), mas sem cadastro o plano não sai: pede o contato, que conclui.
      setHistorico((h) => [...h, tela]);
      setTela("contato");
      return;
    }
    avancando.current = true;
    setFinalizando(true);
    await concluir(respostas, cadastro, true);
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    if (enviando) return;
    const encontrados = validarContato(contato);
    setErros(encontrados);
    setErroEnvio(null);
    if (Object.keys(encontrados).length) {
      requestAnimationFrame(() => corpo.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setEnviando(true);

    const b = braco ?? "fim";
    // Braço cedo com perguntas pela frente (o prazo é a última): grava o contato e segue. Sem nada pela frente, conclui.
    const antesDoPlano = b === "cedo" && !r.prazo;
    const nome = contato.name.trim();
    const iniciais = nome.split(/\s+/).map((n) => n[0]).join("").toLowerCase();
    const leadEventId = `${Date.now()}-${iniciais}${sufixoDoBraco(b)}`;
    const dados = dadosDoContato({
      nome, whatsapp: contato.whatsapp, respostas: r, conteudo, leadEventId,
      enderecoDoPlano: antesDoPlano ? "" : enderecoDoPlano(r, nome),
      fecho: antesDoPlano ? FECHO_CEDO : undefined,
    });

    let cadastro: CadastroDaSessao;
    try {
      cadastro = await cadastrar(dados, r, leadEventId);
    } catch (erro) {
      console.error("[Consultoria] O cadastro no Ploomes falhou:", erro);
      setErroEnvio((antesDoPlano ? telas.contato_cedo : telas.contato).erro);
      setEnviando(false);
      return;
    }
    empurrar("consultoria_contato", { braco: b, lp_version: LP_VERSION, event_id: leadEventId });
    void trackNonCatalogEvent(eventoDoContato(b), { content_name: "Consultoria", lp_version: LP_VERSION });

    if (!antesDoPlano) {
      await concluir(r, cadastro, false);
      return;
    }

    // Braço cedo: o card nasce agora, com a equipe (o número que decide o estudo do tráfego) e o que veio até aqui.
    // Se ele parar no meio, fica esta anotação, com o link para o SDR mandar e ele terminar.
    if (cadastro.contactId) {
      try {
        const terminar = enderecoParaTerminar(window.location.origin, r);
        await comTeto(createInteractionRecord({ contactId: cadastro.contactId, dealId: cadastro.dealId, content: resumoParcial(conteudo, r, terminar) }), 4000);
      } catch (erro) {
        console.error("[Consultoria] A anotação parcial não foi gravada no Ploomes:", erro);
      }
    }
    void Promise.all(dispararEventos(dados, r, leadEventId, { lead: true, equipe: true, notas: false }));
    cadastroCedo.current = cadastro;
    setEnviando(false);
    // Sem volta para antes do contato: o card já existe, e voltar mudaria respostas que ele já levou.
    setHistorico([]);
    setTela(proximaTela(conteudo, "contato", r, "cedo"));
  }

  function opcao(chave: keyof Respostas, item: Opcao, icone?: ReactNode, discreta = false) {
    const marcada = r[chave] === item.id;
    return (
      <button key={item.id} type="button" className={`${styles.opcao} ${discreta ? styles.discreta : ""}`}
        aria-pressed={marcada} onClick={() => tocar(chave, item.id)}>
        {icone}
        <span>{item.texto}</span>
        <span className={styles.marca} aria-hidden="true" />
      </button>
    );
  }

  const perguntas = perguntasDoFluxo(conteudo, r);
  const numero = perguntas.indexOf(tela) + 1;
  const passo = numero > 0 ? <p className={styles.passo}>Pergunta {numero} de {perguntas.length}</p> : null;
  const objetivo = conteudo.objetivos.find((o) => o.id === r.objetivo);
  const trava = r.objetivo ? conteudo.travas[r.objetivo] : undefined;
  // No braço cedo a tela de contato vem antes das últimas perguntas: o texto não promete o plano "na próxima tela".
  const textosContato = braco === "cedo" && !r.prazo ? telas.contato_cedo : telas.contato;

  return (
    <main className={styles.pagina}>
      <div className={styles.coluna}>
        <header className={styles.topo}>
          <div className={styles.linha}>
            <Image src="/images/Logo-BestBarbers-branco_2.webp" alt="BestBarbers" width={200} height={41} className={styles.logo} priority />
            {historico.length > 0 && !finalizando && (
              <button type="button" className={styles.voltar} onClick={voltar}><ChevronLeft aria-hidden="true" />Voltar</button>
            )}
          </div>
          <div className={styles.barra} role="progressbar" aria-label="Progresso" aria-valuemin={0} aria-valuemax={100}
            aria-valuenow={Math.round(progresso(conteudo, tela, r, braco ?? "fim") * 100)}>
            <span style={{ width: `${Math.max(progresso(conteudo, tela, r, braco ?? "fim"), 0.04) * 100}%` }} />
          </div>
        </header>

        <div ref={corpo} className={styles.corpo}>
          {tela === "objetivo" && <>
            <p className={styles.rotulo}>{telas.objetivo.rotulo}</p>
            <h1 tabIndex={-1}>{telas.objetivo.pergunta}</h1>
            <p className={styles.texto}>{telas.objetivo.texto}</p>
            <div className={styles.opcoes}>{conteudo.objetivos.map((o) => opcao("objetivo", o, ICONES[o.icone]))}</div>
          </>}

          {tela === "trava" && trava && <>
            {veioDoAnuncio && historico.length === 0 && objetivo && <p className={styles.selo}>{telas.objetivo.rotulo} · {objetivo.texto}</p>}
            {passo}
            <h1 tabIndex={-1}>{trava.pergunta}</h1>
            <div className={styles.opcoes}>{trava.opcoes.map((o) => opcao("trava", o, undefined, o.id === "outra"))}</div>
            {r.trava === "outra" && (
              <div className={styles.subpergunta}>
                <label htmlFor="consultoria-outra">{telas.outra.rotulo}</label>
                <textarea id="consultoria-outra" className={styles.campo} rows={3} maxLength={200}
                  placeholder={telas.outra.placeholder} value={r.outra ?? ""}
                  onChange={(e) => setR((atual) => ({ ...atual, outra: e.target.value }))} />
                <button type="button" className={styles.principal} onClick={() => irPara(proximaTela(conteudo, "trava", r, braco ?? "fim"))}>
                  {telas.outra.botao}
                </button>
              </div>
            )}
          </>}

          {tela === "quem" && <>
            {passo}
            <h1 tabIndex={-1}>{telas.quem.pergunta}</h1>
            <div className={styles.opcoes}>{conteudo.quem.map((o) => opcao("quem", o))}</div>
            {r.quem === "equipe" && (
              <div className={styles.subpergunta}>
                <p>{telas.quem.porte}</p>
                <div className={styles.par}>{conteudo.porte.map((o) => opcao("porte", o))}</div>
              </div>
            )}
          </>}

          {tela === "assinatura" && <>
            {passo}
            <h1 tabIndex={-1}>{telas.assinatura.pergunta}</h1>
            <div className={styles.opcoes}>{conteudo.assinatura.map((o) => opcao("assinatura", o))}</div>
          </>}

          {tela === "faturamento" && <>
            {passo}
            <h1 tabIndex={-1}>{telas.faturamento.pergunta}</h1>
            <p className={styles.texto}>{telas.faturamento.linha}</p>
            <div className={styles.opcoes}>{conteudo.faixas_hoje.map((o) => opcao("faturamento", o))}</div>
          </>}

          {tela === "meta" && <>
            {passo}
            <h1 tabIndex={-1}>{r.quem === "abrir" ? telas.meta.pergunta_abrir : telas.meta.pergunta}</h1>
            <p className={styles.texto}>{telas.meta.linha}</p>
            <div className={styles.opcoes}>{opcoesDaMeta(conteudo, r).map((o) => opcao("meta", o))}</div>
          </>}

          {tela === "prazo" && <>
            {passo}
            <h1 tabIndex={-1}>{telas.prazo.pergunta}</h1>
            <div className={styles.opcoes}>{conteudo.prazo.map((o) => opcao("prazo", o))}</div>
          </>}

          {tela === "contato" && <>
            <p className={styles.rotulo}>{textosContato.rotulo}</p>
            <h1 tabIndex={-1}>{textosContato.pergunta}</h1>
            <form className={styles.form} noValidate onSubmit={enviar}>
              <label htmlFor="consultoria-nome">{textosContato.nome}</label>
              <input id="consultoria-nome" name="name" autoComplete="given-name" placeholder={textosContato.nome_placeholder}
                value={contato.name} aria-invalid={Boolean(erros.nome)} aria-describedby={erros.nome ? "erro-nome" : undefined}
                onChange={(e) => setContato((c) => ({ ...c, name: e.target.value }))} />
              {erros.nome && <p id="erro-nome" className={styles.erro} role="alert">{erros.nome}</p>}
              <label htmlFor="consultoria-whatsapp">{textosContato.whatsapp}</label>
              <input id="consultoria-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national"
                placeholder={textosContato.whatsapp_placeholder} value={contato.whatsapp}
                aria-invalid={Boolean(erros.whatsapp)} aria-describedby={erros.whatsapp ? "erro-whatsapp" : undefined}
                onChange={(e) => setContato((c) => ({ ...c, whatsapp: mascaraTelefone(e.target.value) }))} />
              {erros.whatsapp && <p id="erro-whatsapp" className={styles.erro} role="alert">{erros.whatsapp}</p>}
              {erroEnvio && <p className={styles.erro} role="alert">{erroEnvio}</p>}
              <button type="submit" className={styles.principal} disabled={enviando} aria-busy={enviando}>
                {enviando ? textosContato.enviando : textosContato.botao}
              </button>
            </form>
            <p className={styles.miudo}>{textosContato.rodape}</p>
          </>}

          {finalizando && <p className={styles.miudo} role="status" aria-live="polite">{telas.contato.enviando}</p>}
        </div>
      </div>
    </main>
  );
}
