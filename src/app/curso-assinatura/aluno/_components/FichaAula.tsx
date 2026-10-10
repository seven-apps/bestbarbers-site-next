"use client";

import { useState, type ReactNode } from "react";
import { MessageCircle, Plus, Table2, Trash2 } from "lucide-react";
import { calcular, DEFAULTS } from "@/app/tabela-precificacao-clube/_components/calc";
import { LINK_PUBLICO_AULA_5, TEXTOS_FICHA, type NumeroAula } from "@/content/curso-assinatura";
import type { Resultado } from "@/lib/curso-api";
import {
  agendaDaTabela,
  derivadosDaAula,
  fichaRespondida,
  hojeEmBrasilia,
  janelaFutura,
  janelaReuniao,
  lerNumeroDigitado,
  moeda,
  numeroParaCampo,
  respostasDaFicha,
  valoresIniciais,
  type AgendaFicha,
  type AulaDoAluno,
  type ComoCobraHoje,
  type Derivados,
  type EstadoAluno,
  type FichasPorAula,
  type UnidadeComissao,
  type ValoresDaFicha,
} from "@/lib/curso";
import { CampoData, CampoNumero, CampoTexto, Escolha, Marcar, Rotulo, Ajuda } from "./Campos";

const F = TEXTOS_FICHA;

export type SalvarFicha = <N extends NumeroAula>(aula: N, respostas: FichasPorAula[N]) => Promise<Resultado<{ derivados: Derivados }>>;

type StatusFicha = "parado" | "salvando" | "salvo" | "erro";

/** Estado de uma ficha na tela: os campos, os erros (nomes do contrato) e o envio. */
function useFicha<N extends NumeroAula>(aula: N, ficha: Record<string, unknown> | null, salvar: SalvarFicha, dataQuerComecar: string | null) {
  const [valores, setValores] = useState<ValoresDaFicha[N]>(() => valoresIniciais(aula, ficha));
  const [campos, setCampos] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusFicha>("parado");

  const atualizar = (novo: ValoresDaFicha[N]) => {
    setValores(novo);
    setStatus((s) => (s === "salvando" ? s : "parado"));
  };

  const enviar = async () => {
    const r = respostasDaFicha(aula, valores, hojeEmBrasilia(), dataQuerComecar);
    if (!r.ok) {
      setCampos(r.campos);
      setStatus("parado");
      return;
    }
    setCampos([]);
    setStatus("salvando");
    const resposta = await salvar(aula, r.respostas);
    if (resposta.ok) {
      setStatus("salvo");
      return;
    }
    if (resposta.motivo === "invalido" && resposta.campos?.length) {
      setCampos(resposta.campos);
      setStatus("parado");
      return;
    }
    setStatus("erro");
  };

  /** O campo tem erro se o servidor ou a tela apontou ele, ou a lista inteira a que ele pertence. */
  const temErro = (campo: string) => campos.some((c) => c === campo || campo.startsWith(`${c}.`));
  return { valores, atualizar, enviar, status, temErro };
}

function CartaoFicha({
  aula,
  status,
  onSalvar,
  children,
  depois,
}: {
  aula: NumeroAula;
  status: StatusFicha;
  onSalvar: () => void;
  children: ReactNode;
  depois?: ReactNode;
}) {
  return (
    <section id="ficha" className="scroll-mt-24 rounded-3xl bg-white text-[#1e1e1e] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />
      <div className="p-5 md:p-7 space-y-5">
        <header className="space-y-1">
          <h2 className="text-xl md:text-2xl font-extrabold">{F.cabecalho(aula)}</h2>
          <p className="text-[14px] leading-snug text-[#4a4a4a]">{F.intro}</p>
        </header>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSalvar();
          }}
          className="space-y-5"
        >
          {children}
          <div className="space-y-3 pt-1">
            <button
              type="submit"
              disabled={status === "salvando"}
              className="w-full sm:w-auto min-h-[48px] px-7 rounded-full font-extrabold text-[14px] bg-[#121212] text-[#ffaf02] disabled:opacity-60 active:scale-[0.98] transition-transform"
            >
              {status === "salvando" ? F.salvando : F.botao}
            </button>
            {status === "salvo" ? (
              <p role="status" className="text-[14px] font-semibold text-[#0f7a2a]">
                {F.salvou(aula)}
              </p>
            ) : null}
            {status === "erro" ? (
              <p role="alert" className="text-[14px] font-semibold text-red-600">
                {F.erro}
              </p>
            ) : null}
          </div>
        </form>
        {depois}
      </div>
    </section>
  );
}

/** Caixa amarela com o que a ficha salva calculou (só com a ficha já guardada no OS). */
function Resultado({ linhas, children }: { linhas: string[]; children?: ReactNode }) {
  if (!linhas.length && !children) return null;
  return (
    <div className="rounded-2xl border border-[#ebad04]/50 bg-[#fff8e6] p-4 space-y-2">
      {linhas.map((l) => (
        <p key={l} className="text-[15px] font-semibold leading-snug">
          {l}
        </p>
      ))}
      {children}
    </div>
  );
}

// ─── Tabela de precificação embutida (contrato §5, recomendação técnica) ──────────────────

/**
 * O mesmo cálculo da `/tabela-precificacao-clube` (`calc.ts`), dentro da área: abrir a página
 * aberta levaria o aluno ao formulário de captura dela, que cria um card de recadastro. Sem pixel
 * (a área não tem rastreador).
 */
export function TabelaEmbutida({ corteInicial, agendaInicial }: { corteInicial?: number; agendaInicial?: AgendaFicha }) {
  const [corte, setCorte] = useState(numeroParaCampo(corteInicial ?? DEFAULTS.corteAvulso, true));
  const [agenda, setAgenda] = useState<AgendaFicha | "">(agendaInicial ?? "");
  const n = lerNumeroDigitado(corte);
  const valido = n !== null && !Number.isNaN(n) && n >= 1 && n <= 2000;
  const r = valido ? calcular({ corteAvulso: n, cadeiras: 1, comissaoPct: DEFAULTS.comissaoPct, agenda: agendaDaTabela(agenda) }) : null;
  return (
    <section className="rounded-3xl bg-white text-[#1e1e1e] p-5 md:p-7 space-y-5">
      <h3 className="flex items-center gap-2 text-lg md:text-xl font-extrabold">
        <Table2 className="w-5 h-5 text-[#ebad04]" />
        {F.tabela.titulo}
      </h3>
      <div className="grid gap-5 md:grid-cols-2">
        <CampoNumero rotulo={F.tabela.corte} unidade="R$" valor={corte} onChange={setCorte} erro={!valido && corte.trim() !== ""} />
        <Escolha rotulo={F.tabela.agenda} opcoes={F.aula3.agenda.opcoes} valor={agenda} onChange={setAgenda} colunas={3} />
      </div>
      {r && n !== null ? (
        <div className="rounded-2xl p-5 text-center bg-[#121212] text-white">
          <p className="text-[12px] uppercase tracking-[0.12em] font-bold text-[#ebad04]">{F.tabela.recomendada}</p>
          <p className="mt-1 text-[36px] md:text-[44px] font-extrabold leading-none text-[#ebad04]">{moeda(r.mensalidade)}</p>
          <p className="mt-3 text-[13px] leading-snug text-white/75">{F.tabela.faixa(moeda(r.faixaMin), moeda(r.faixaMax), moeda(r.teto), moeda(n))}</p>
        </div>
      ) : null}
      <p className="text-[12px] leading-relaxed text-[#6b6b6b]">{F.tabela.como}</p>
    </section>
  );
}

// ─── As 6 fichas ──────────────────────────────────────────────────────────────────────────

interface PropsFicha {
  estado: EstadoAluno;
  salvar: SalvarFicha;
}

const dadosDa = (estado: EstadoAluno, n: NumeroAula): AulaDoAluno => estado.aulas[n - 1];

function Ficha1({ estado, salvar }: PropsFicha) {
  const aula = dadosDa(estado, 1);
  const { valores: v, atualizar, enviar, status, temErro } = useFicha(1, aula.ficha, salvar, null);
  const d = derivadosDaAula(aula);
  const linhas = fichaRespondida(aula.ficha)
    ? [
        ...(d.tetoDoPlano !== undefined ? [F.aula1.depoisTeto(moeda(d.tetoDoPlano))] : []),
        ...(d.visitasNoAno !== undefined && d.valorNoAno !== undefined ? [F.aula1.depoisAno(d.visitasNoAno, moeda(d.valorNoAno))] : []),
      ]
    : [];
  return (
    <CartaoFicha aula={1} status={status} onSalvar={enviar} depois={<Resultado linhas={linhas} />}>
      <CampoNumero {...F.aula1.precoCorte} valor={v.precoCorte} onChange={(x) => atualizar({ ...v, precoCorte: x })} erro={temErro("precoCorte")} />
      <CampoNumero {...F.aula1.diasRetorno} decimal={false} valor={v.diasRetorno} onChange={(x) => atualizar({ ...v, diasRetorno: x })} erro={temErro("diasRetorno")} />
    </CartaoFicha>
  );
}

function Ficha2({ estado, salvar }: PropsFicha) {
  const aula = dadosDa(estado, 2);
  const { valores: v, atualizar, enviar, status, temErro } = useFicha(2, aula.ficha, salvar, null);
  const [tabelaAberta, setTabelaAberta] = useState(false);
  const cobra = v.comoCobraHoje && v.comoCobraHoje !== "nao_cobra";
  const ficha1 = dadosDa(estado, 1).ficha;
  return (
    <CartaoFicha
      aula={2}
      status={status}
      onSalvar={enviar}
      depois={
        fichaRespondida(aula.ficha) ? (
          <div className="space-y-4">
            <Resultado linhas={[...F.aula2.depois]}>
              <button
                type="button"
                onClick={() => setTabelaAberta((a) => !a)}
                aria-expanded={tabelaAberta}
                className="mt-1 inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full font-extrabold text-[13px] bg-[#121212] text-[#ffaf02]"
              >
                <Table2 className="w-4 h-4" />
                {F.aula2.botaoTabela}
              </button>
            </Resultado>
            {tabelaAberta ? (
              <div className="rounded-3xl border border-black/10 overflow-hidden">
                <TabelaEmbutida corteInicial={ficha1?.precoCorte as number | undefined} />
              </div>
            ) : null}
          </div>
        ) : null
      }
    >
      <Escolha<ComoCobraHoje>
        rotulo={F.aula2.comoCobraHoje.rotulo}
        opcoes={F.aula2.comoCobraHoje.opcoes as ReadonlyArray<{ valor: ComoCobraHoje; rotulo: string }>}
        valor={v.comoCobraHoje}
        onChange={(x) => atualizar({ ...v, comoCobraHoje: x })}
      />
      {cobra ? (
        <div className="space-y-1">
          <CampoNumero
            rotulo={F.aula2.atrasados.rotulo}
            exemplo={F.aula2.atrasados.exemplo}
            decimal={false}
            valor={v.atrasadosNaoSei ? "" : v.atrasados}
            onChange={(x) => atualizar({ ...v, atrasados: x, atrasadosNaoSei: false })}
            erro={temErro("atrasados")}
          />
          <Marcar rotulo={F.aula2.atrasados.naoSei} marcado={v.atrasadosNaoSei} onChange={(x) => atualizar({ ...v, atrasadosNaoSei: x })} />
        </div>
      ) : null}
    </CartaoFicha>
  );
}

function Ficha3({ estado, salvar }: PropsFicha) {
  const aula = dadosDa(estado, 3);
  const { valores: v, atualizar, enviar, status, temErro } = useFicha(3, aula.ficha, salvar, null);
  const teto = derivadosDaAula(dadosDa(estado, 1)).tetoDoPlano;
  const P = F.aula3.planos;
  const mudarPlano = (i: number, campo: "nome" | "preco" | "oQueEntra", x: string) =>
    atualizar({ ...v, planos: v.planos.map((p, j) => (j === i ? { ...p, [campo]: x } : p)) });
  return (
    <CartaoFicha aula={3} status={status} onSalvar={enviar}>
      <Escolha<AgendaFicha>
        rotulo={F.aula3.agenda.rotulo}
        ajuda={F.aula3.agenda.ajuda}
        opcoes={F.aula3.agenda.opcoes as ReadonlyArray<{ valor: AgendaFicha; rotulo: string }>}
        valor={v.agenda}
        onChange={(x) => atualizar({ ...v, agenda: x })}
        colunas={3}
      />
      <div className="space-y-3">
        <Rotulo>{P.titulo}</Rotulo>
        <Ajuda>{P.ajuda}</Ajuda>
        {teto !== undefined ? <p className="text-[14px] font-semibold text-[#8a6500]">{F.aula3.lembreteTeto(moeda(teto))}</p> : null}
        {v.planos.map((plano, i) => (
          <div key={i} className="rounded-2xl border border-black/10 p-4 space-y-3">
            <CampoTexto {...P.nome} max={60} valor={plano.nome} onChange={(x) => mudarPlano(i, "nome", x)} erro={temErro(`planos.${i}.nome`)} />
            <CampoNumero {...P.preco} valor={plano.preco} onChange={(x) => mudarPlano(i, "preco", x)} erro={temErro(`planos.${i}.preco`)} />
            <CampoTexto {...P.oQueEntra} max={300} valor={plano.oQueEntra} onChange={(x) => mudarPlano(i, "oQueEntra", x)} erro={temErro(`planos.${i}.oQueEntra`)} />
            {v.planos.length > 1 ? (
              <button
                type="button"
                onClick={() => atualizar({ ...v, planos: v.planos.filter((_, j) => j !== i) })}
                className="inline-flex items-center gap-1.5 min-h-[40px] text-[13px] font-semibold text-[#6b6b6b]"
              >
                <Trash2 className="w-4 h-4" />
                {P.remover}
              </button>
            ) : null}
          </div>
        ))}
        {v.planos.length < P.maximo ? (
          <button
            type="button"
            onClick={() => atualizar({ ...v, planos: [...v.planos, { nome: "", preco: "", oQueEntra: "" }] })}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-[1.5px] border-[#ebad04] text-[13px] font-extrabold text-[#8a6500]"
          >
            <Plus className="w-4 h-4" />
            {P.adicionar.replace(/^\+\s*/, "")}
          </button>
        ) : null}
      </div>
    </CartaoFicha>
  );
}

function Ficha4({ estado, salvar }: PropsFicha) {
  const aula = dadosDa(estado, 4);
  const { valores: v, atualizar, enviar, status, temErro } = useFicha(4, aula.ficha, salvar, null);
  const W = F.aula4.pesos;
  const pote = fichaRespondida(aula.ficha) ? derivadosDaAula(aula).poteEstimado : undefined;
  const mudarPeso = (i: number, campo: "servico" | "pontos", x: string) =>
    atualizar({ ...v, pesos: v.pesos.map((p, j) => (j === i ? { ...p, [campo]: x } : p)) });
  const exemploDe = (i: number) => W.iniciais[i]?.exemplo ?? "";
  return (
    <CartaoFicha aula={4} status={status} onSalvar={enviar} depois={<Resultado linhas={pote !== undefined ? [F.aula4.depoisPote(moeda(pote))] : []} />}>
      <CampoNumero {...F.aula4.receitaAssinaturaMes} valor={v.receitaAssinaturaMes} onChange={(x) => atualizar({ ...v, receitaAssinaturaMes: x })} erro={temErro("receitaAssinaturaMes")} />
      <CampoNumero {...F.aula4.percentualPote} valor={v.percentualPote} onChange={(x) => atualizar({ ...v, percentualPote: x })} erro={temErro("percentualPote")} />
      <div className="space-y-3">
        <Rotulo>{W.rotulo}</Rotulo>
        <Ajuda>{W.ajuda}</Ajuda>
        <div className="grid grid-cols-[1fr_110px_auto] gap-2 text-[12px] font-bold uppercase tracking-wide text-[#6b6b6b]">
          <span>{W.servico}</span>
          <span>{W.pontos}</span>
          <span className="w-9" />
        </div>
        {v.pesos.map((peso, i) => (
          <div key={i} className="grid grid-cols-[1fr_110px_auto] gap-2 items-start">
            <CampoTexto rotulo={`${W.servico} ${i + 1}`} rotuloOculto exemplo={W.exemploServico} max={60} valor={peso.servico} onChange={(x) => mudarPeso(i, "servico", x)} erro={temErro(`pesos.${i}.servico`)} />
            <CampoNumero rotulo={`${W.pontos} ${i + 1}`} rotuloOculto exemplo={exemploDe(i)} decimal={false} valor={peso.pontos} onChange={(x) => mudarPeso(i, "pontos", x)} erro={temErro(`pesos.${i}.pontos`)} />
            <button
              type="button"
              aria-label={W.remover}
              disabled={v.pesos.length <= 1}
              onClick={() => atualizar({ ...v, pesos: v.pesos.filter((_, j) => j !== i) })}
              className="w-9 h-[48px] flex items-center justify-center text-[#6b6b6b] disabled:opacity-30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {v.pesos.length < W.maximo ? (
          <button
            type="button"
            onClick={() => atualizar({ ...v, pesos: [...v.pesos, { servico: "", pontos: "" }] })}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-[1.5px] border-[#ebad04] text-[13px] font-extrabold text-[#8a6500]"
          >
            <Plus className="w-4 h-4" />
            {W.adicionar.replace(/^\+\s*/, "")}
          </button>
        ) : null}
      </div>
    </CartaoFicha>
  );
}

function Ficha5({ estado, salvar }: PropsFicha) {
  const aula = dadosDa(estado, 5);
  const { valores: v, atualizar, enviar, status, temErro } = useFicha(5, aula.ficha, salvar, null);
  const janela = janelaReuniao(hojeEmBrasilia());
  const C = F.aula5.comissaoDeVenda;
  const E = F.aula5.equipe;
  return (
    <CartaoFicha
      aula={5}
      status={status}
      onSalvar={enviar}
      depois={
        LINK_PUBLICO_AULA_5 ? (
          <div className="rounded-2xl border border-black/10 p-4 space-y-3">
            <p className="font-extrabold">{E.titulo}</p>
            <p className="text-[14px] text-[#4a4a4a]">{E.texto}</p>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(E.mensagem(LINK_PUBLICO_AULA_5))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full font-extrabold text-[13px] bg-[#25D366] text-white"
            >
              <MessageCircle className="w-4 h-4" />
              {E.botao}
            </a>
          </div>
        ) : null
      }
    >
      <CampoData
        {...F.aula5.dataReuniaoEquipe}
        valor={v.dataReuniaoEquipe}
        onChange={(x) => atualizar({ ...v, dataReuniaoEquipe: x })}
        min={janela.min}
        max={janela.max}
        erro={temErro("dataReuniaoEquipe")}
        mensagemErro={F.erroDataReuniao}
      />
      <Escolha<"sim" | "nao" | "nao_decidi">
        rotulo={C.rotulo}
        opcoes={C.opcoes as ReadonlyArray<{ valor: "sim" | "nao" | "nao_decidi"; rotulo: string }>}
        valor={v.comissao}
        onChange={(x) => atualizar({ ...v, comissao: x })}
        colunas={3}
      />
      {v.comissao === "sim" ? (
        <div className="space-y-4 rounded-2xl border border-black/10 p-4">
          <Escolha<UnidadeComissao>
            rotulo={C.comoVaiSer}
            opcoes={C.unidades as ReadonlyArray<{ valor: UnidadeComissao; rotulo: string }>}
            valor={v.unidade}
            onChange={(x) => atualizar({ ...v, unidade: x })}
            colunas={2}
          />
          <CampoNumero
            {...C.valor}
            unidade={v.unidade === "percentual" ? "%" : v.unidade === "reais_por_venda" ? "R$" : undefined}
            valor={v.valor}
            onChange={(x) => atualizar({ ...v, valor: x })}
            erro={temErro("comissaoDeVenda.valor")}
          />
        </div>
      ) : null}
    </CartaoFicha>
  );
}

function Ficha6({ estado, salvar }: PropsFicha) {
  const aula = dadosDa(estado, 6);
  const { valores: v, atualizar, enviar, status, temErro } = useFicha(6, aula.ficha, salvar, estado.dataQuerComecar);
  const janela = janelaFutura(hojeEmBrasilia());
  return (
    <CartaoFicha aula={6} status={status} onSalvar={enviar}>
      <CampoData
        {...F.aula6.dataLancamento}
        valor={v.dataLancamento}
        onChange={(x) => atualizar({ ...v, dataLancamento: x })}
        min={janela.min}
        max={janela.max}
        erro={temErro("dataLancamento")}
        mensagemErro={F.erroDataFutura}
      />
      <CampoNumero {...F.aula6.tamanhoPrimeiroLote} decimal={false} valor={v.tamanhoPrimeiroLote} onChange={(x) => atualizar({ ...v, tamanhoPrimeiroLote: x })} erro={temErro("tamanhoPrimeiroLote")} />
      <CampoTexto {...F.aula6.listaDeEspera} max={120} valor={v.listaDeEspera} onChange={(x) => atualizar({ ...v, listaDeEspera: x })} erro={temErro("listaDeEspera")} />
    </CartaoFicha>
  );
}

/** A ficha da aula aberta. Remonta a cada aula (o pai usa `key`), então os campos nascem da ficha guardada. */
export function FichaAula({ aula, estado, salvar }: { aula: NumeroAula; estado: EstadoAluno; salvar: SalvarFicha }) {
  const props = { estado, salvar };
  switch (aula) {
    case 1:
      return <Ficha1 {...props} />;
    case 2:
      return <Ficha2 {...props} />;
    case 3:
      return <Ficha3 {...props} />;
    case 4:
      return <Ficha4 {...props} />;
    case 5:
      return <Ficha5 {...props} />;
    default:
      return <Ficha6 {...props} />;
  }
}
