"use client";

import { ArrowLeft, PencilLine } from "lucide-react";
import { MOSTRAR_CONTA_DO_ANO, ROTULOS_DO_PLANO, TEXTOS_AREA, type NumeroAula } from "@/content/curso-assinatura";
import { dataBR, moeda, montarPlano, type EstadoAluno } from "@/lib/curso";
import { textoDoBotaoSinal } from "./Sinal";

const P = TEXTOS_AREA.plano;

/**
 * A tela final (03 §3.8): o plano de assinatura montado com as fichas. Abre no fim da aula 6,
 * pelo topo ("ver o meu plano") e pelo link do e-mail 5 (`#abrir=plano`). Bloco sem ficha mostra
 * o atalho para a aula que responde.
 */
export function PlanoMontado({
  estado,
  irParaFicha,
  abrirSinal,
  voltar,
}: {
  estado: EstadoAluno;
  irParaFicha: (aula: NumeroAula) => void;
  abrirSinal: () => void;
  voltar: () => void;
}) {
  const blocos = montarPlano(estado, { mostrarContaDoAno: MOSTRAR_CONTA_DO_ANO });
  const C = ROTULOS_DO_PLANO.colunasPlanos;
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-[26px] md:text-4xl font-extrabold leading-tight text-white">
          <span className="block">{P.titulo}</span>
          <span className="block text-[#ffaf02]">{P.destaque}</span>
        </h1>
        <p className="text-[15px] text-white/75">{P.frase}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {blocos.map((b) => (
          <section key={b.chave} className={`rounded-2xl bg-white text-[#1e1e1e] p-5 space-y-2 ${b.chave === "planos" ? "md:col-span-2" : ""}`}>
            <h2 className="text-[12px] font-bold uppercase tracking-wide text-[#8a6500]">{b.titulo}</h2>
            {b.vazio ? (
              <div className="space-y-3">
                <p className="text-[15px] text-[#4a4a4a]">{P.blocoEmBranco(b.aula)}</p>
                <button
                  type="button"
                  onClick={() => irParaFicha(b.aula)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-[1.5px] border-[#ebad04] text-[13px] font-extrabold text-[#8a6500]"
                >
                  <PencilLine className="w-4 h-4" />
                  {P.responder(b.aula)}
                </button>
              </div>
            ) : (
              <>
                {b.linhas.map((l) => (
                  <p key={l} className="text-[15px] font-semibold leading-snug">
                    {l}
                  </p>
                ))}
                {b.tabela?.length ? (
                  <div className="mt-2 rounded-xl border border-black/10 overflow-hidden">
                    <div className="hidden md:grid grid-cols-[1fr_140px_2fr] gap-3 px-4 py-2 bg-gray-50 text-[12px] font-bold uppercase tracking-wide text-[#6b6b6b]">
                      <span>{C.plano}</span>
                      <span>{C.preco}</span>
                      <span>{C.oQueEntra}</span>
                    </div>
                    {b.tabela.map((plano, i) => (
                      <div key={i} className="grid md:grid-cols-[1fr_140px_2fr] gap-1 md:gap-3 px-4 py-3 border-t border-black/5 first:border-t-0 md:first:border-t">
                        <span className="font-bold">{plano.nome}</span>
                        <span className="font-semibold text-[#8a6500]">{moeda(plano.preco)}</span>
                        <span className="text-[14px] text-[#4a4a4a]">{plano.oQueEntra}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </section>
        ))}
      </div>

      {estado.sinal ? (
        <section className="rounded-3xl border border-[#ffaf02]/40 p-5 md:p-6 space-y-2 bg-white/[0.04]">
          <p className="text-[16px] font-semibold text-white">{P.fechoComSinal.texto}</p>
          {estado.dataQuerComecar ? <p className="text-[15px] font-bold text-[#ffaf02]">{P.fechoComSinal.data(dataBR(estado.dataQuerComecar))}</p> : null}
        </section>
      ) : (
        <section className="rounded-3xl p-5 md:p-7 space-y-4 border border-[#ffaf02]/40" style={{ background: "linear-gradient(160deg, #1d1a12 0%, #121212 100%)" }}>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">{P.fechoSemSinal.titulo}</h2>
          <p className="text-[15px] leading-snug text-white/80">{P.fechoSemSinal.texto}</p>
          <button
            type="button"
            onClick={abrirSinal}
            className="w-full sm:w-auto min-h-[52px] px-7 rounded-full font-extrabold text-[14px] bg-[#ffaf02] text-[#121212]"
          >
            {textoDoBotaoSinal(estado)}
          </button>
        </section>
      )}

      <p className="text-[14px] text-white/60">{P.rodape}</p>
      <button type="button" onClick={voltar} className="inline-flex items-center gap-2 min-h-[44px] text-[14px] font-bold text-white/80 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        {P.voltar}
      </button>
    </div>
  );
}
