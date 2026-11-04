"use client";

// Fonte: protótipo aprovado da consultoria on-line gratuita (04/Nov/26); conteúdo em ../_data/consultoria-v1.json.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Check, ChevronLeft, FileText, MessageCircle, Repeat, TrendingUp, UserPlus, Users } from "lucide-react";
import { validateContact } from "../../diagnostico/_lib/validation";
import { escolher, objetivoDaUrl, perguntasDoFluxo, progresso, proximaTela, pulaAssinatura, telaRespondida } from "../_lib/flow";
import { guardarLocalmente, montarContato } from "../_lib/ploomes";
import { linkDaConsultoria } from "../_lib/whatsapp";
import type { ConteudoConsultoria, Opcao, Respostas, Tela } from "../_lib/types";
import styles from "../consultoria.module.css";

const ICONES: Record<string, ReactNode> = {
  faturamento: <TrendingUp aria-hidden="true" />,
  assinatura: <Repeat aria-hidden="true" />,
  clientes: <UserPlus aria-hidden="true" />,
  equipe: <Users aria-hidden="true" />,
  nota: <FileText aria-hidden="true" />,
};

/** Pausa entre o toque e a próxima tela: a pessoa vê a opção marcada antes de a tela trocar. */
const PAUSA_MS = 220;

function mascaraTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** "**negrito**" na primeira linha vira <strong>; o resto quebra linha como no WhatsApp. */

export function Consultoria(conteudo: ConteudoConsultoria) {
  const { telas } = conteudo;
  const [tela, setTela] = useState<Tela>("objetivo");
  const [historico, setHistorico] = useState<Tela[]>([]);
  const [r, setR] = useState<Respostas>({});
  const [veioDoAnuncio, setVeioDoAnuncio] = useState(false);
  const [contato, setContato] = useState({ name: "", whatsapp: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const avancando = useRef(false);
  const corpo = useRef<HTMLDivElement>(null);

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
    corpo.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tela]);

  function irPara(proxima: Tela) {
    setHistorico((h) => [...h, tela]);
    setErros({});
    setTela(proxima);
  }

  function voltar() {
    if (!historico.length || avancando.current) return;
    setTela(historico[historico.length - 1]);
    setHistorico((h) => h.slice(0, -1));
    setErros({});
  }

  /** Um toque = uma escolha. A trava `avancando` impede que dois toques rápidos pulem duas telas. */
  function tocar(chave: keyof Respostas, valor: string) {
    if (avancando.current) return;
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

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const encontrados = validateContact({ ...contato, instagram: "" });
    setErros(encontrados);
    if (Object.keys(encontrados).length) {
      requestAnimationFrame(() => corpo.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    guardarLocalmente(montarContato({ contato, respostas: r, conteudo }));
    irPara("pronto");
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
  const nome = contato.name.trim().split(/\s+/)[0] || "";
  const link = linkDaConsultoria(conteudo.mensagem_whatsapp, null);
  const resumo = [
    objetivo?.texto,
    trava?.opcoes.find((o) => o.id === r.trava)?.texto,
    r.quem ? `${conteudo.quem.find((o) => o.id === r.quem)?.texto}${r.porte ? ` · ${conteudo.porte.find((o) => o.id === r.porte)?.texto}` : ""}` : "",
    r.assinatura && !pulaAssinatura(conteudo, r) ? `Assinatura: ${conteudo.assinatura.find((o) => o.id === r.assinatura)?.resumo}` : "",
    conteudo.prazo.find((o) => o.id === r.prazo)?.texto,
  ].filter(Boolean);

  return (
    <main className={styles.pagina}>
      <div className={styles.coluna}>
        <header className={styles.topo}>
          <div className={styles.linha}>
            <Image src="/images/Logo-BestBarbers-branco_2.webp" alt="BestBarbers" width={200} height={41} className={styles.logo} priority />
            {historico.length > 0 && tela !== "pronto" && (
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
              <input id="consultoria-nome" name="name" autoComplete="name" placeholder={telas.contato.nome_placeholder}
                value={contato.name} aria-invalid={Boolean(erros.nome)} aria-describedby={erros.nome ? "erro-nome" : undefined}
                onChange={(e) => setContato((c) => ({ ...c, name: e.target.value }))} />
              {erros.nome && <p id="erro-nome" className={styles.erro} role="alert">{erros.nome}</p>}
              <label htmlFor="consultoria-whatsapp">{telas.contato.whatsapp}</label>
              <input id="consultoria-whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national"
                placeholder={telas.contato.whatsapp_placeholder} value={contato.whatsapp}
                aria-invalid={Boolean(erros.whatsapp)} aria-describedby={erros.whatsapp ? "erro-whatsapp" : undefined}
                onChange={(e) => setContato((c) => ({ ...c, whatsapp: mascaraTelefone(e.target.value) }))} />
              {erros.whatsapp && <p id="erro-whatsapp" className={styles.erro} role="alert">{erros.whatsapp}</p>}
              <button type="submit" className={styles.principal}>{telas.contato.botao}</button>
            </form>
            <p className={styles.miudo}>{telas.contato.rodape}</p>
          </>}

          {tela === "pronto" && <>
            <div className={styles.ok}><Check aria-hidden="true" /></div>
            <h1 tabIndex={-1}>{telas.pronto.titulo.replace("{nome}", nome)}</h1>
            <ul className={styles.resumo}>{resumo.map((item) => <li key={item}>{item}</li>)}</ul>
            {link && <a className={styles.whatsapp} href={link} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />{telas.pronto.botao}</a>}
            <p className={styles.miudo}>{telas.pronto.rodape}</p>
          </>}
        </div>
      </div>
    </main>
  );
}
