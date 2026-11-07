"use client";

// Fonte: ficha aprovada da consultoria (04/Nov/26) + faturamento e meta (S21, 07/Nov/26); conteúdo em ../_data/consultoria-v2.json.
// No fim, a navegação é completa até /consultoria/plano: é o `page_view` dessa página que mede o fim no GA4.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowLeftRight, ChevronLeft, FileText, Repeat, TrendingUp, UserPlus, Users } from "lucide-react";
import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { criarCardRecadastro } from "@/lib/recadastro";
import { temEquipe } from "@/lib/lead-score";
import { mascaraTelefone, validarContato } from "../_lib/contato";
import { comTeto, empurrar, enviarCapi } from "../_lib/eventos";
import { escolher, objetivoDaUrl, perguntasDoFluxo, progresso, proximaTela, telaRespondida } from "../_lib/flow";
import { enderecoDoPlano, opcoesDaMeta } from "../_lib/plano";
import {
  CHAVE_DA_SESSAO, LP_VERSION, clubeDoCRM, dadosDoContato, equipeDoCRM, faturamentoDoCRM, notaDoLead, quandoDoCRM,
  type CadastroDaSessao,
} from "../_lib/ploomes";
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
  const avancando = useRef(false);
  const comecou = useRef(false);
  const corpo = useRef<HTMLDivElement>(null);
  const { submitLead, checkPhoneExists, buildAttribution } = usePloomesAPI();
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
    corpo.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tela]);

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
      setHistorico((h) => [...h, atual]);
      setTela(proximaTela(conteudo, atual, novo));
    }, PAUSA_MS);
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

    const nome = contato.name.trim();
    const iniciais = nome.split(/\s+/).map((n) => n[0]).join("").toLowerCase();
    const leadEventId = `${Date.now()}-${iniciais}`;
    const plano = enderecoDoPlano(r, nome);
    const dados = dadosDoContato({ nome, whatsapp: contato.whatsapp, respostas: r, conteudo, enderecoDoPlano: plano, leadEventId });

    // Telefone conhecido → card novo na Qualificação para o contato que já existe (recadastro, o mesmo do formulário);
    // telefone novo → contato novo pela chave do site, e a automação abre o card na Qualificação (ADR-038).
    let cadastro: CadastroDaSessao | null = null;
    try {
      const existe = await checkPhoneExists(contato.whatsapp);
      if (existe) {
        const recadastro = await criarCardRecadastro({
          phone: contato.whatsapp,
          barbershopName: nome,
          atribuicao: buildAttribution(dados),
          faturamento: faturamentoDoCRM(r),
          colaboradores: equipeDoCRM(r),
          clube: clubeDoCRM(r),
          quando: quandoDoCRM(r),
        });
        if (!recadastro.ok) throw new Error(`recadastro: ${recadastro.motivo ?? "falhou"}`);
        cadastro = { contactId: recadastro.contactId ?? null, dealId: recadastro.dealId ?? null, leadEventId };
      } else {
        const { contactId } = await submitLead(dados);
        cadastro = { contactId, dealId: null, leadEventId };
      }
    } catch (erro) {
      console.error("[Consultoria] O cadastro no Ploomes falhou:", erro);
      setErroEnvio(telas.contato.erro);
      setEnviando(false);
      return;
    }

    // Meta: Lead em todo envio válido (o conjunto da consultoria otimiza Lead), mais as medições da casa.
    const nota = notaDoLead(r);
    // `content_name` fica o padrão do formulário ("BestBarbers Lead Form"): conversão personalizada que casa por ele não
    // perde a consultoria. Quem separa é o `lp_version`.
    const pixel = {
      lp_version: LP_VERSION,
      ...(dados.monthlyRevenue && { monthly_revenue: dados.monthlyRevenue }),
      ...(dados.employeeCount && { employee_count: dados.employeeCount }),
      ...(nota !== null && { lead_score: nota }),
    };
    const pessoa = { telefone: contato.whatsapp, nome };
    const disparos: Promise<void>[] = [trackLead(pixel, leadEventId)];
    enviarCapi("Lead", leadEventId, pessoa);
    if (nota !== null && nota >= 30) {
      disparos.push(trackQualifiedLead(pixel, `${leadEventId}-q`));
      enviarCapi("QualifiedLead", `${leadEventId}-q`, pessoa);
    }
    if (nota !== null && nota >= 60) {
      disparos.push(trackQualifiedLead60(pixel, `${leadEventId}-q60`));
      enviarCapi("QualifiedLead60", `${leadEventId}-q60`, pessoa);
    }
    if (dados.employeeCount && temEquipe(dados.employeeCount)) {
      disparos.push(trackNonCatalogEvent("LeadComEquipe", pixel, `${leadEventId}-eq`));
      enviarCapi("LeadComEquipe", `${leadEventId}-eq`, pessoa);
    }
    empurrar("consultoria_fim", {
      event_id: leadEventId,
      lp_version: LP_VERSION,
      objetivo: r.objetivo,
      trava: r.trava,
      faturamento: r.faturamento,
      meta: r.meta,
      prazo: r.prazo,
      lead_score: nota,
      recadastro: cadastro.dealId !== null,
    });

    try {
      sessionStorage.setItem(CHAVE_DA_SESSAO, JSON.stringify({ ...cadastro, outra: r.outra ?? "" }));
    } catch {
      // Sem a sessão, a página do plano abre sem o bloco do horário: o card já está criado.
    }
    await comTeto(Promise.all(disparos), 1500);
    const destino = new URL(plano);
    destino.searchParams.set("de", "ficha");
    window.location.assign(`${window.location.origin}${destino.pathname}${destino.search}`);
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

  return (
    <main className={styles.pagina}>
      <div className={styles.coluna}>
        <header className={styles.topo}>
          <div className={styles.linha}>
            <Image src="/images/Logo-BestBarbers-branco_2.webp" alt="BestBarbers" width={200} height={41} className={styles.logo} priority />
            {historico.length > 0 && (
              <button type="button" className={styles.voltar} onClick={voltar}><ChevronLeft aria-hidden="true" />Voltar</button>
            )}
          </div>
          <div className={styles.barra} role="progressbar" aria-label="Progresso" aria-valuemin={0} aria-valuemax={100}
            aria-valuenow={Math.round(progresso(conteudo, tela, r) * 100)}>
            <span style={{ width: `${Math.max(progresso(conteudo, tela, r), 0.04) * 100}%` }} />
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
                <button type="button" className={styles.principal} onClick={() => irPara(proximaTela(conteudo, "trava", r))}>
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
            <p className={styles.rotulo}>{telas.contato.rotulo}</p>
            <h1 tabIndex={-1}>{telas.contato.pergunta}</h1>
            <form className={styles.form} noValidate onSubmit={enviar}>
              <label htmlFor="consultoria-nome">{telas.contato.nome}</label>
              <input id="consultoria-nome" name="name" autoComplete="given-name" placeholder={telas.contato.nome_placeholder}
                value={contato.name} aria-invalid={Boolean(erros.nome)} aria-describedby={erros.nome ? "erro-nome" : undefined}
                onChange={(e) => setContato((c) => ({ ...c, name: e.target.value }))} />
              {erros.nome && <p id="erro-nome" className={styles.erro} role="alert">{erros.nome}</p>}
              <label htmlFor="consultoria-whatsapp">{telas.contato.whatsapp}</label>
              <input id="consultoria-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national"
                placeholder={telas.contato.whatsapp_placeholder} value={contato.whatsapp}
                aria-invalid={Boolean(erros.whatsapp)} aria-describedby={erros.whatsapp ? "erro-whatsapp" : undefined}
                onChange={(e) => setContato((c) => ({ ...c, whatsapp: mascaraTelefone(e.target.value) }))} />
              {erros.whatsapp && <p id="erro-whatsapp" className={styles.erro} role="alert">{erros.whatsapp}</p>}
              {erroEnvio && <p className={styles.erro} role="alert">{erroEnvio}</p>}
              <button type="submit" className={styles.principal} disabled={enviando} aria-busy={enviando}>
                {enviando ? telas.contato.enviando : telas.contato.botao}
              </button>
            </form>
            <p className={styles.miudo}>{telas.contato.rodape}</p>
          </>}
        </div>
      </div>
    </main>
  );
}
