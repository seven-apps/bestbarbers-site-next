"use client";

// Fonte: 02-plano.md §3.2 (a página do plano, braço do texto) e 05-contrato-site-os.md §2 (o horário vai ao contato).
// Aberta logo depois do contato (com o cadastro na sessão, mostra a escolha do horário) ou pelo link que o SDR manda.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Clock } from "lucide-react";
import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { empurrar } from "../_lib/eventos";
import { distancia, faixaDaMeta, faixaDeHoje, horariosDisponiveis, linhaDeLeitura, linhaDoCaminho, planoDaTrava, reais } from "../_lib/plano";
import { CHAVE_DA_SESSAO, LP_VERSION, anotacaoDoHorario, type CadastroDaSessao } from "../_lib/ploomes";
import type { ConteudoConsultoria, Horario, Respostas } from "../_lib/types";
import styles from "../consultoria.module.css";

interface Props {
  conteudo: ConteudoConsultoria;
  respostas: Respostas;
  nome: string;
}

type Estado = "carregando" | "escolher" | "gravando" | "feito" | "erro" | "sem_cadastro";

export function Plano({ conteudo, respostas, nome }: Props) {
  const t = conteudo.telas.pronto;
  const [cadastro, setCadastro] = useState<CadastroDaSessao | null>(null);
  const [outra, setOutra] = useState("");
  const [estado, setEstado] = useState<Estado>("carregando");
  const [escolhido, setEscolhido] = useState<Horario | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>(conteudo.horarios.filter((h) => h.id !== "hoje"));
  const { createInteractionRecord } = usePloomesAPI();
  const { trackNonCatalogEvent } = useMetaPixel();

  useEffect(() => {
    setHorarios(horariosDisponiveis(conteudo.horarios));
    try {
      const salvo = sessionStorage.getItem(CHAVE_DA_SESSAO);
      const lido = salvo ? (JSON.parse(salvo) as CadastroDaSessao & { outra?: string }) : null;
      if (lido?.contactId) {
        setCadastro(lido);
        setOutra(lido.outra ?? "");
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

  const r: Respostas = { ...respostas, ...(respostas.trava === "outra" && outra ? { outra } : {}) };
  const plano = planoDaTrava(conteudo, r);
  const hoje = faixaDeHoje(conteudo, r);
  const meta = faixaDaMeta(conteudo, r);
  const d = distancia(conteudo, r);
  const alavanca = plano.alavanca ? conteudo.planos.alavancas[plano.alavanca] : null;
  const leitura = linhaDeLeitura(conteudo, r);
  const caminho = linhaDoCaminho(conteudo, r);
  const titulo = nome ? t.titulo.replace("{nome}", nome) : "O seu plano";

  return (
    <main className={styles.pagina}>
      <div className={styles.coluna}>
        <header className={styles.topo}>
          <div className={styles.linha}>
            <Image src="/images/Logo-BestBarbers-branco_2.webp" alt="BestBarbers" width={200} height={41} className={styles.logo} priority />
          </div>
          <div className={styles.barra} aria-hidden="true"><span style={{ width: "100%" }} /></div>
        </header>

        <div className={styles.corpo}>
          <p className={styles.rotulo}>{t.rotulo}</p>
          <h1 tabIndex={-1}>{titulo}</h1>
          {caminho && <p className={styles.caminho}>{caminho}</p>}
          {leitura && <p className={styles.leitura}>{leitura}</p>}

          {(hoje || meta) && (
            <div className={styles.numeros}>
              {hoje && <span><small>Hoje</small>{hoje.texto}</span>}
              {hoje && meta && <span className={styles.seta} aria-hidden="true">→</span>}
              {meta && <span><small>Meta</small>{meta.texto}</span>}
            </div>
          )}

          {(d !== null || alavanca) && (
            <section className={styles.secao}>
              <h2>{t.distancia_titulo}</h2>
              {d !== null && <p className={styles.destaque}>Cerca de {reais(d)} a mais por mês <small>({t.distancia_meio})</small></p>}
              {alavanca && <p>{alavanca}</p>}
            </section>
          )}

          <section className={styles.secao}>
            <h2>{t.passo_titulo}</h2>
            <p className={styles.tituloPlano}>{plano.titulo}</p>
            <p>{plano.passo1}</p>
          </section>

          <section className={`${styles.secao} ${styles.horario}`}>
            <h2>{t.horario_titulo}</h2>
            {estado === "sem_cadastro" && <p>{t.sem_cadastro}</p>}
            {(estado === "escolher" || estado === "gravando") && <>
              <p>{t.horario_texto}</p>
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
              <p className={styles.confirmado} role="status">
                <Check aria-hidden="true" />
                {escolhido.id === "mensagem" ? t.horario_ok_mensagem : t.horario_ok.replace("{quando}", escolhido.quando)}
              </p>
            )}
            {estado === "erro" && <p className={styles.erro} role="alert">{t.horario_erro}</p>}
          </section>

          <p className={styles.miudo}><Link href="/consultoria">{t.refazer}</Link></p>
        </div>
      </div>
    </main>
  );
}
