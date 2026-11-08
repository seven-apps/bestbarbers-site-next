"use client";

// Fonte: o molde v5 do plano, aprovado pelo André em 08/Nov/26 ("s45 OK, ficou bem melhor"): a 1ª tela do celular
// traz as ações para amanhã (o que fazer, como e o que traz), e o detalhe vem rolando, na mesma página, com o material
// pronto para copiar. O horário da ligação, no fim, vai ao contato no Ploomes (05-contrato-site-os.md §2).
// Os casos: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/consultoria-v2/plano-de-acao/.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Clock } from "lucide-react";
import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { empurrar } from "../_lib/eventos";
import { chaveDoCaso, horariosDisponiveis, linkParaEquipe, montarPlano, type BlocoPronto } from "../_lib/plano";
import { CHAVE_DA_SESSAO, LP_VERSION, anotacaoDoHorario, type CadastroDaSessao } from "../_lib/ploomes";
import type { ConteudoConsultoria, Horario, Respostas } from "../_lib/types";
import styles from "../consultoria.module.css";
import p from "./plano.module.css";

interface Props {
  conteudo: ConteudoConsultoria;
  respostas: Respostas;
  nome: string;
}

type Estado = "carregando" | "escolher" | "gravando" | "feito" | "erro" | "sem_cadastro";
type Textos = ConteudoConsultoria["telas"]["pronto"];

export function Plano({ conteudo, respostas, nome }: Props) {
  const t = conteudo.telas.pronto;
  const [cadastro, setCadastro] = useState<CadastroDaSessao | null>(null);
  const [estado, setEstado] = useState<Estado>("carregando");
  const [escolhido, setEscolhido] = useState<Horario | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>(conteudo.horarios.filter((h) => h.id !== "hoje"));
  const [copiado, setCopiado] = useState<string | null>(null);
  const { createInteractionRecord } = usePloomesAPI();
  const { trackNonCatalogEvent } = useMetaPixel();
  const plano = useMemo(() => montarPlano(conteudo, respostas, nome), [conteudo, respostas, nome]);

  useEffect(() => {
    setHorarios(horariosDisponiveis(conteudo.horarios));
    try {
      const salvo = sessionStorage.getItem(CHAVE_DA_SESSAO);
      const lido = salvo ? (JSON.parse(salvo) as CadastroDaSessao) : null;
      if (lido?.contactId) {
        setCadastro(lido);
        setEstado("escolher");
        return;
      }
    } catch {
      // Sessão indisponível (aba anônima, bloqueio): segue sem o bloco do horário.
    }
    setEstado("sem_cadastro");
  }, [conteudo.horarios]);

  async function escolher(horario: Horario) {
    if (!cadastro?.contactId || estado === "gravando") return;
    setEscolhido(horario);
    setEstado("gravando");
    empurrar("consultoria_horario", { horario: horario.id, lp_version: LP_VERSION, event_id: cadastro.leadEventId });
    void trackNonCatalogEvent("ConsultoriaHorario", { content_name: "Consultoria", horario: horario.id, lp_version: LP_VERSION });
    try {
      await createInteractionRecord({ contactId: cadastro.contactId, dealId: cadastro.dealId, content: anotacaoDoHorario(horario) });
      setEstado("feito");
    } catch (erro) {
      console.error("[Consultoria] O horário não foi gravado no Ploomes:", erro);
      setEstado("erro");
    }
    try {
      sessionStorage.removeItem(CHAVE_DA_SESSAO);
    } catch {
      // nada a fazer
    }
  }

  function copiar(bloco: string, texto: string) {
    const feito = () => {
      setCopiado(bloco);
      setTimeout(() => setCopiado((atual) => (atual === bloco ? null : atual)), 1600);
    };
    empurrar("consultoria_copiar", { bloco, caso: chaveDoCaso(respostas), lp_version: LP_VERSION });
    try {
      navigator.clipboard.writeText(texto).then(feito, feito);
    } catch {
      feito();
    }
  }

  const ligacao = plano.ligacao;

  return (
    <main className={`${styles.pagina} ${p.plano}`}>
      <div className={styles.coluna}>
        <header className={p.topo}>
          <Image src="/images/Logo-BestBarbers-branco_2.webp" alt="BestBarbers" width={200} height={41} className={p.logo} priority />
          <div className={p.barra} aria-hidden="true"><span /></div>
        </header>

        <div className={p.corpo}>
          {/* ETAPA 1: a 1ª tela do celular */}
          <h1 tabIndex={-1}>{plano.titulo}</h1>
          <p className={p.sub}>{plano.subtitulo}</p>

          <div className={p.acoes}>
            {plano.acoes.map((a) => (
              <a key={a.id} className={p.acao} href={`#${a.id}`}>
                <h2><span className={p.num}>{a.num}</span>{a.titulo}</h2>
                <p className={p.como}>{a.como}</p>
                <p className={p.traz}><b aria-hidden="true">→</b><span>{a.traz}</span></p>
              </a>
            ))}
          </div>
          <p className={p.gancho}>{plano.gancho} <span aria-hidden="true">↓</span></p>

          {/* ETAPA 2: o detalhe de cada ação */}
          <div className={p.divisor}><span className={p.rotulo}>{plano.divisor}</span></div>

          {plano.blocos.map((b) => (
            <Bloco key={b.id} b={b} t={t} copiado={copiado} copiar={copiar} />
          ))}

          <section className={`${p.bloco} ${p.ligacao}`} id="ligacao">
            <p className={p.rotulo}>{ligacao?.rotulo ?? t.horario_rotulo}</p>
            <h3>{ligacao?.titulo ?? t.horario_titulo}</h3>
            {ligacao?.textos.map((x, i) => <p key={i}>{x}</p>)}
            {ligacao?.feito && (
              <ul className={p.feito}>{ligacao.feito.map((x, i) => <li key={i}>{x}</li>)}</ul>
            )}
            {ligacao?.no_bestbarbers && (
              <p className={p.linhaInfo}><strong>{t.no_bestbarbers}</strong> {ligacao.no_bestbarbers}</p>
            )}
            {ligacao?.depois.map((x, i) => <p key={`d${i}`}>{x}</p>)}

            {estado === "sem_cadastro" && <p>{t.sem_cadastro}</p>}
            {(estado === "escolher" || estado === "gravando") && <>
              <p>{ligacao?.chamada ?? t.horario_texto}</p>
              <div className={styles.opcoes}>
                {horarios.map((h) => (
                  <button key={h.id} type="button" className={styles.opcao} aria-pressed={escolhido?.id === h.id}
                    disabled={estado === "gravando"} onClick={() => escolher(h)}>
                    <Clock aria-hidden="true" />
                    <span>{h.texto}</span>
                    <span className={styles.marca} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </>}
            {estado === "feito" && escolhido && (
              <p className={p.confirmado} role="status">
                <Check aria-hidden="true" />
                {escolhido.id === "mensagem" ? t.horario_ok_mensagem : t.horario_ok.replace("{quando}", escolhido.quando)}
              </p>
            )}
            {estado === "erro" && <p className={p.erro} role="alert">{t.horario_erro}</p>}
          </section>

          {plano.fontes && (
            <p className={p.fontes}><strong>{plano.fontes.rotulo}</strong> {plano.fontes.texto}</p>
          )}
          <p className={styles.miudo}><Link href="/consultoria">{t.refazer}</Link></p>
        </div>
      </div>
    </main>
  );
}

function Bloco({ b, t, copiado, copiar }: {
  b: BlocoPronto;
  t: Textos;
  copiado: string | null;
  copiar: (bloco: string, texto: string) => void;
}) {
  return (
    <section className={p.bloco} id={b.id}>
      <p className={p.rotulo}>{b.num && <span className={p.num}>{b.num}</span>}{b.rotulo}</p>
      <h3>{b.titulo}</h3>
      {b.textos.map((x, i) => <p key={i}>{x}</p>)}
      {b.passos && (
        <ol className={p.passos}>{b.passos.map((x, i) => <li key={i}>{x}</li>)}</ol>
      )}
      {b.feito && (
        <ul className={p.feito}>{b.feito.map((x, i) => <li key={i}>{x}</li>)}</ul>
      )}
      {b.pronto && (
        <div className={p.pronto}>
          <p className={p.mini}>{b.pronto.rotulo}</p>
          <p className={p.texto}>{b.pronto.texto}</p>
          <div className={p.botoes}>
            <button type="button" className={p.btn} onClick={() => copiar(b.id, b.pronto!.texto)}>
              {copiado === b.id ? t.copiado : t.copiar}
            </button>
            {b.pronto.equipe && (
              <a className={`${p.btn} ${p.zap}`} href={linkParaEquipe(b.pronto.equipe, b.pronto.texto)} target="_blank" rel="noopener noreferrer">
                {t.mandar_equipe}
              </a>
            )}
          </div>
        </div>
      )}
      {b.no_bestbarbers && (
        <p className={p.linhaInfo}>
          <strong>{t.no_bestbarbers}</strong> {b.no_bestbarbers}
          {b.sem_sistema && <> <strong>{t.sem_sistema}</strong> {b.sem_sistema}</>}
        </p>
      )}
      {b.prova && (
        <div className={p.prova}>
          <p className={p.mini}>{b.prova.rotulo}</p>
          <p>{b.prova.texto}</p>
        </div>
      )}
      {b.medir && (
        <div className={p.medir}>
          <p className={p.mini}>{b.medir.rotulo}</p>
          {b.medir.meta && <p className={p.meta}>{b.medir.meta}</p>}
          {b.medir.textos.map((x, i) => <p key={i}>{x}</p>)}
        </div>
      )}
      {b.depois.map((x, i) => <p key={`d${i}`}>{x}</p>)}
    </section>
  );
}
