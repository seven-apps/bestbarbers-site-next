"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, CircleDot, ClipboardCheck, LayoutList, RotateCw } from "lucide-react";
import {
  AULAS,
  CAMINHO_AREA,
  NOME_DO_CURSO,
  TEXTOS_AREA,
  TEXTOS_FICHA,
  type NumeroAula,
} from "@/content/curso-assinatura";
import {
  CHAVE_BOAS_VINDAS,
  apagarInscricaoPendente,
  apagarToken,
  gravar,
  guardarToken,
  inscreverNoCurso,
  ler,
  lerAluno,
  lerInscricaoPendente,
  lerTokenGuardado,
  registrarProgresso,
  registrarSinal,
  salvarFicha,
} from "@/lib/curso-api";
import {
  comMarco,
  contagens,
  fichaRespondida,
  lerFragmento,
  mostrarBoasVindas,
  proximaDepois,
  selosDaAula,
  semRegredir,
  telaInicial,
  tokensParaTentar,
  type EstadoAluno,
  type Marco,
  type Tela,
} from "@/lib/curso";
import { rotuloDaAula, ThumbAula } from "../../_components/Primitivos";
import { PlayerAula } from "./PlayerAula";
import { FichaAula, TabelaEmbutida, type SalvarFicha } from "./FichaAula";
import { BonusWhatsApp, CaixaSinalAula6, JanelaSinal, textoDoBotaoSinal, type EnviarSinal } from "./Sinal";
import { PlanoMontado } from "./PlanoMontado";
import { LinkInvalido } from "./LinkInvalido";

const A = TEXTOS_AREA;

type Fase = "carregando" | "erro" | "sem_link" | "pronto";

function armazenamento(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function Logo() {
  return <Image src="/images/Logo-BestBarbers-branco_1.webp" alt="BestBarbers" width={140} height={32} className="w-[104px] md:w-[124px] h-auto" priority />;
}

function Topo({ estado, abrirPlano }: { estado: EstadoAluno | null; abrirPlano: () => void }) {
  const c = estado ? contagens(estado) : null;
  return (
    <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-3 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Logo />
          <span className="hidden sm:inline text-[13px] font-bold text-white/70 truncate">{NOME_DO_CURSO}</span>
        </div>
        {estado ? (
          <button
            type="button"
            onClick={abrirPlano}
            className="shrink-0 inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-full text-[12px] font-extrabold bg-[#ffaf02] text-[#121212]"
          >
            <LayoutList className="w-4 h-4" />
            {A.topo.verPlano}
          </button>
        ) : null}
      </div>
      {c ? (
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 pb-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] md:text-[13px] font-semibold text-white/80">
            <span>{A.topo.assistidas(c.assistidas)}</span>
            <span aria-hidden className="text-white/30">·</span>
            <span>{A.topo.fichas(c.fichas)}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={6} aria-valuenow={c.assistidas}>
            <div className="h-full rounded-full bg-[#ffaf02] transition-all" style={{ width: `${(c.assistidas / 6) * 100}%` }} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ListaAulas({ estado, atual, abrir }: { estado: EstadoAluno; atual: Tela; abrir: (aula: NumeroAula) => void }) {
  return (
    <nav aria-label={A.lista.titulo} className="rounded-3xl border border-white/10 bg-white/[0.03] p-3 md:p-4">
      <h2 className="px-2 pb-2 text-[13px] font-bold uppercase tracking-wide text-white/60">{A.lista.titulo}</h2>
      <ol className="space-y-1.5">
        {AULAS.map((aula) => {
          const dados = estado.aulas[aula.numero - 1];
          const selos = selosDaAula(dados);
          const ativa = atual.tipo === "aula" && atual.aula === aula.numero;
          return (
            <li key={aula.numero}>
              <button
                type="button"
                onClick={() => abrir(aula.numero)}
                aria-current={ativa ? "true" : undefined}
                className={`w-full text-left rounded-2xl px-3 py-3 flex items-start gap-3 transition-colors ${ativa ? "bg-[#ffaf02]/15 border border-[#ffaf02]/40" : "hover:bg-white/5 border border-transparent"}`}
              >
                <span
                  className={`mt-0.5 w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[12px] font-black ${selos.assistida ? "bg-[#ffaf02] text-[#121212]" : "bg-white/10 text-white"}`}
                >
                  {selos.assistida ? <CheckCircle2 className="w-4 h-4" /> : aula.numero}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-bold text-white/55">{rotuloDaAula(aula, A.lista.item)}</span>
                  <span className="block text-[14px] font-semibold text-white leading-snug">{aula.titulo}</span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    {selos.assistida ? <Selo icone={<CheckCircle2 className="w-3 h-3" />}>{A.selos.assistida}</Selo> : null}
                    {selos.emAndamento ? <Selo icone={<CircleDot className="w-3 h-3" />}>{A.selos.emAndamento}</Selo> : null}
                    {selos.fichaRespondida ? <Selo icone={<ClipboardCheck className="w-3 h-3" />}>{A.selos.fichaRespondida}</Selo> : null}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Selo({ children, icone }: { children: string; icone: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold bg-white/10 text-white/80">
      {icone}
      {children}
    </span>
  );
}

/**
 * A área do aluno (`/curso-assinatura/aluno`, bloco B da estrutura): abre só com o link pessoal.
 *
 * Ordem ao abrir (contrato §3): lê `#t=`, `aula` e `abrir`; guarda o token no aparelho; apaga o
 * fragmento da barra de endereço; confere no OS (`GET /api/curso/aluno`). Se o token novo não valer
 * e houver outro guardado, tenta o guardado. Nenhum dos dois = tela de link inválido. Sem token e
 * com uma inscrição que falhou guardada no aparelho, repete a inscrição primeiro.
 */
export function AreaDoAluno() {
  const [fase, setFase] = useState<Fase>("carregando");
  const [estado, setEstado] = useState<EstadoAluno | null>(null);
  const [tela, setTela] = useState<Tela>({ tipo: "aula", aula: 1 });
  const [janela, setJanela] = useState<{ aula: NumeroAula; jaConfirmado?: boolean } | null>(null);
  const [boasVindasDispensada, setBoasVindasDispensada] = useState(true);
  const [avisoFicha, setAvisoFicha] = useState<NumeroAula | null>(null);
  const avisosMostrados = useRef<Set<NumeroAula>>(new Set());
  const token = useRef<string | null>(null);
  const tentativas = useRef<string[]>([]);
  const pedidoInicial = useRef<{ aula: NumeroAula | null; abrir: "plano" | "sinal" | null }>({ aula: null, abrir: null });

  const linkInvalido = useCallback(() => {
    apagarToken(armazenamento());
    token.current = null;
    setFase("sem_link");
  }, []);

  const carregar = useCallback(async () => {
    setFase("carregando");
    const storage = armazenamento();
    let lista = tentativas.current;
    if (!lista.length) {
      const pendente = lerInscricaoPendente(storage);
      if (pendente) {
        const r = await inscreverNoCurso(pendente);
        if (r.ok) {
          apagarInscricaoPendente(storage);
          lista = [r.token];
        } else if (!r.guardarPendente) {
          apagarInscricaoPendente(storage);
        }
      }
    }
    if (!lista.length) {
      setFase("sem_link");
      return;
    }
    for (const t of lista) {
      const r = await lerAluno(t);
      if (r.ok) {
        token.current = t;
        tentativas.current = [t];
        guardarToken(storage, t);
        setEstado(r.dados);
        setTela(telaInicial(r.dados, pedidoInicial.current));
        if (pedidoInicial.current.abrir === "sinal") {
          const t0 = telaInicial(r.dados, { aula: pedidoInicial.current.aula, abrir: null });
          setJanela({ aula: t0.tipo === "aula" ? t0.aula : 6 });
        }
        pedidoInicial.current = { aula: null, abrir: null };
        setBoasVindasDispensada(ler(storage, CHAVE_BOAS_VINDAS) === r.dados.aluno.codigo);
        setFase("pronto");
        return;
      }
      if (r.motivo !== "token_invalido") {
        // Rede ou servidor: o token pode valer. Fica guardado para tentar de novo (e para o recarregar).
        setFase("erro");
        return;
      }
    }
    linkInvalido();
  }, [linkInvalido]);

  useEffect(() => {
    const iniciar = () => {
      const fragmento = lerFragmento(window.location.hash);
      const storage = armazenamento();
      const guardado = lerTokenGuardado(storage);
      if (fragmento.tinha) {
        // O token sai da barra de endereço na hora (contrato §3) e fica só no aparelho.
        window.history.replaceState(null, "", CAMINHO_AREA);
      }
      if (fragmento.token) guardarToken(storage, fragmento.token);
      tentativas.current = tokensParaTentar(fragmento.token, guardado);
      pedidoInicial.current = { aula: fragmento.aula, abrir: fragmento.abrir };
      void carregar();
    };
    iniciar();
    // Link novo colado na mesma aba com a área aberta: só o "#" muda e a página não recarrega.
    // Sem isto, o token ficaria à vista na barra de endereço e a área não leria o link novo.
    const aoMudarFragmento = () => {
      if (window.location.hash) iniciar();
    };
    window.addEventListener("hashchange", aoMudarFragmento);
    return () => window.removeEventListener("hashchange", aoMudarFragmento);
  }, [carregar]);

  /**
   * Relê o estado depois de uma gravação (ficha e sinal mudam o que a tela mostra). O progresso da
   * tela não desce: um GET que saiu antes de um marco ser gravado volta com o marco antigo.
   */
  const recarregar = useCallback(async () => {
    if (!token.current) return;
    const r = await lerAluno(token.current);
    if (r.ok) setEstado((atual) => semRegredir(r.dados, atual));
    else if (r.motivo === "token_invalido") linkInvalido();
  }, [linkInvalido]);

  const enviarMarco = useCallback(
    async (aula: NumeroAula, marco: Marco): Promise<boolean> => {
      if (!token.current) return true;
      const r = await registrarProgresso(token.current, aula, marco);
      if (r.ok) {
        setEstado((e) => (e ? comMarco(e, aula, marco) : e));
        return true;
      }
      if (r.motivo === "token_invalido") {
        linkInvalido();
        return true;
      }
      // Só rede e servidor valem nova tentativa; corpo recusado ou limite, não nesta visita.
      return r.motivo === "invalido" || r.motivo === "limite";
    },
    [linkInvalido],
  );

  const salvar: SalvarFicha = useCallback(
    async (aula, respostas) => {
      if (!token.current) return { ok: false, motivo: "token_invalido" } as const;
      const r = await salvarFicha(token.current, aula, respostas);
      if (r.ok) void recarregar();
      else if (r.motivo === "token_invalido") linkInvalido();
      return r;
    },
    [recarregar, linkInvalido],
  ) as SalvarFicha;

  const enviarSinal: EnviarSinal = useCallback(
    async (aula, dataQuerComecar) => {
      if (!token.current) return false;
      const r = await registrarSinal(token.current, { aula, dataQuerComecar });
      if (r.ok) {
        void recarregar();
        return true;
      }
      if (r.motivo === "token_invalido") linkInvalido();
      return false;
    },
    [recarregar, linkInvalido],
  );

  const abrirAula = useCallback((aula: NumeroAula) => {
    setTela({ tipo: "aula", aula });
    setAvisoFicha(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const abrirPlano = useCallback(() => {
    setTela({ tipo: "plano" });
    setAvisoFicha(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const irParaFicha = useCallback((aula: NumeroAula) => {
    setTela({ tipo: "aula", aula });
    setAvisoFicha(null);
    window.setTimeout(() => document.getElementById("ficha")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, []);

  const dispensarBoasVindas = useCallback(() => {
    if (estado) gravar(armazenamento(), CHAVE_BOAS_VINDAS, estado.aluno.codigo);
    setBoasVindasDispensada(true);
  }, [estado]);

  // ─── Telas que não são a área ───────────────────────────────────────────────────────────

  if (fase !== "pronto" || !estado) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Topo estado={null} abrirPlano={() => {}} />
        <main className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10 md:py-16">
          {fase === "carregando" ? (
            <div role="status" className="flex flex-col items-center gap-4 py-20">
              <span className="w-8 h-8 border-[3px] border-white/20 border-t-[#ffaf02] rounded-full animate-spin" />
              <p className="text-[15px] font-semibold text-white/80">{A.carregando}</p>
            </div>
          ) : fase === "erro" ? (
            <div role="alert" className="max-w-md mx-auto text-center space-y-4 py-16">
              <h1 className="text-2xl font-extrabold">{A.erroRede.titulo}</h1>
              <p className="text-[15px] text-white/75">{A.erroRede.texto}</p>
              <button
                type="button"
                onClick={() => void carregar()}
                className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full font-extrabold text-[14px] bg-[#ffaf02] text-[#121212]"
              >
                <RotateCw className="w-4 h-4" />
                {A.erroRede.botao}
              </button>
            </div>
          ) : (
            <LinkInvalido />
          )}
        </main>
      </div>
    );
  }

  // ─── A área ─────────────────────────────────────────────────────────────────────────────

  const boasVindas = mostrarBoasVindas(estado, boasVindasDispensada);
  const sinalFeito = estado.sinal !== null;

  const conteudo =
    tela.tipo === "plano" ? (
      <PlanoMontado estado={estado} irParaFicha={irParaFicha} abrirSinal={() => setJanela({ aula: 6 })} voltar={() => abrirAula(estado.proximaAula <= 6 ? (estado.proximaAula as NumeroAula) : 6)} />
    ) : (
      (() => {
        const aula = AULAS[tela.aula - 1];
        const dados = estado.aulas[tela.aula - 1];
        const proxima = proximaDepois(tela.aula);
        const avancar = () => {
          if (!proxima) {
            abrirPlano();
            return;
          }
          // Aviso da ficha em branco (03 §3.3): uma vez por aula, e só se a ficha está vazia no OS.
          if (!fichaRespondida(dados.ficha) && !avisosMostrados.current.has(tela.aula)) {
            avisosMostrados.current.add(tela.aula);
            setAvisoFicha(tela.aula);
            return;
          }
          abrirAula(proxima);
        };
        const ficha2Respondida = fichaRespondida(estado.aulas[1].ficha);
        return (
          <div className="space-y-6">
            <header className="space-y-1.5">
              <p className="text-[13px] font-bold uppercase tracking-wide text-[#ffaf02]">{rotuloDaAula(aula, A.aula.cabecalho)}</p>
              <h1 className="text-[24px] md:text-[32px] font-extrabold leading-tight text-white">{aula.titulo}</h1>
            </header>

            <PlayerAula key={aula.numero} aula={aula} codigo={estado.aluno.codigo} marcoServidor={dados.marco} enviarMarco={(m) => enviarMarco(aula.numero, m)} />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={avancar}
                className="inline-flex items-center justify-center gap-2 min-h-[52px] px-6 rounded-full font-extrabold text-[14px] bg-[#ffaf02] text-[#121212] text-left"
              >
                <span className="line-clamp-2">{proxima ? A.botoes.proxima(AULAS[proxima - 1].titulo) : A.botoes.verPlano}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              {sinalFeito ? (
                <p className="self-center text-[14px] font-semibold text-white/80">{A.botoes.sinalFeito}</p>
              ) : (
                <button
                  type="button"
                  onClick={() => setJanela({ aula: tela.aula })}
                  className="inline-flex items-center justify-center min-h-[52px] px-6 rounded-full font-extrabold text-[13px] border-[1.5px] border-[#ffaf02] text-[#ffaf02]"
                >
                  {textoDoBotaoSinal(estado)}
                </button>
              )}
            </div>

            {avisoFicha === tela.aula && proxima ? (
              <div role="status" className="rounded-2xl border border-[#ffaf02]/40 bg-[#ffaf02]/10 p-4 space-y-3">
                <p className="text-[15px] font-semibold text-white">{A.avisoFichaEmBranco.texto(tela.aula)}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button type="button" onClick={() => irParaFicha(tela.aula as NumeroAula)} className="min-h-[44px] px-5 rounded-full font-extrabold text-[13px] bg-[#ffaf02] text-[#121212]">
                    {A.avisoFichaEmBranco.responder}
                  </button>
                  <button type="button" onClick={() => abrirAula(proxima)} className="min-h-[44px] px-5 rounded-full font-extrabold text-[13px] border border-white/30 text-white">
                    {A.avisoFichaEmBranco.seguir(proxima)}
                  </button>
                </div>
              </div>
            ) : null}

            {tela.aula === 3 ? (
              ficha2Respondida ? (
                <TabelaEmbutida
                  corteInicial={estado.aulas[0].ficha?.precoCorte as number | undefined}
                  agendaInicial={estado.aulas[2].ficha?.agenda as Parameters<typeof TabelaEmbutida>[0]["agendaInicial"]}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <p className="text-[14px] font-semibold text-white/85">{TEXTOS_FICHA.aula2.tabelaBloqueada}</p>
                  <button type="button" onClick={() => irParaFicha(2)} className="shrink-0 min-h-[44px] px-5 rounded-full font-extrabold text-[13px] border border-[#ffaf02] text-[#ffaf02]">
                    {TEXTOS_FICHA.aula2.irParaFicha2}
                  </button>
                </div>
              )
            ) : null}

            <FichaAula key={`ficha-${tela.aula}`} aula={tela.aula} estado={estado} salvar={salvar} />

            {tela.aula === 6 && !sinalFeito ? (
              <CaixaSinalAula6 estado={estado} enviar={enviarSinal} aoConfirmar={() => setJanela({ aula: 6, jaConfirmado: true })} />
            ) : null}
          </div>
        );
      })()
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Topo estado={estado} abrirPlano={abrirPlano} />
      <main className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6 md:py-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6 min-w-0">
          {boasVindas ? (
            <section className="rounded-3xl border border-[#ffaf02]/40 p-5 md:p-6 space-y-3" style={{ background: "linear-gradient(160deg, #1d1a12 0%, #121212 100%)" }}>
              <h1 className="text-xl md:text-2xl font-extrabold">{A.primeiraEntrada.titulo(estado.aluno.primeiroNome)}</h1>
              <p className="text-[15px] leading-snug text-white/80">
                {A.primeiraEntrada.texto}
                {estado.aluno.email ? ` ${A.primeiraEntrada.textoEmail(estado.aluno.email)}` : ""}
              </p>
              <button
                type="button"
                onClick={() => {
                  dispensarBoasVindas();
                  abrirAula(1);
                }}
                className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full font-extrabold text-[14px] bg-[#ffaf02] text-[#121212]"
              >
                {A.primeiraEntrada.botao}
                <ArrowRight className="w-4 h-4" />
              </button>
            </section>
          ) : null}
          {conteudo}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-[120px]">
          <ListaAulas estado={estado} atual={tela} abrir={abrirAula} />
          <BonusWhatsApp codigo={estado.aluno.codigo} />
          {tela.tipo === "aula" && tela.aula < 6 ? (
            <div className="hidden lg:block rounded-3xl border border-white/10 bg-white/[0.03] p-3">
              <ThumbAula aula={AULAS[tela.aula]} borrada={false} icone="play" />
            </div>
          ) : null}
        </aside>
      </main>
      <JanelaSinal aberta={janela} estado={estado} enviar={enviarSinal} aoFechar={() => setJanela(null)} />
    </div>
  );
}
