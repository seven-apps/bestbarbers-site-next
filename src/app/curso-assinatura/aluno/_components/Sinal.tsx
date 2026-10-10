"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, X } from "lucide-react";
import { TEXTOS_AREA, TEXTOS_FICHA, type NumeroAula } from "@/content/curso-assinatura";
import { NUMERO_WHATSAPP_LUCAS } from "@/content/lucas-whatsapp";
import { linkBonusLucas } from "@/lib/curso-api";
import { dataNaJanela, fichaTodaEmBranco, hojeEmBrasilia, janelaFutura, type EstadoAluno } from "@/lib/curso";
import { CampoData, Marcar } from "./Campos";

const S = TEXTOS_AREA.sinal;

/** O registro do sinal: o pai chama a rota e devolve se deu certo (401 ele mesmo trata). */
export type EnviarSinal = (aula: NumeroAula, dataQuerComecar: string | null) => Promise<boolean>;

/** Texto do botão do sinal: a variante de migração para quem respondeu que já tem assinatura. */
export function textoDoBotaoSinal(estado: EstadoAluno): string {
  return estado.aluno.temAssinatura ? TEXTOS_AREA.botoes.sinalMigracao : TEXTOS_AREA.botoes.sinal;
}

function Confirmacao({ estado, aoFechar }: { estado: EstadoAluno; aoFechar: () => void }) {
  const C = S.confirmacao;
  return (
    <div className="space-y-4 text-center">
      <CheckCircle2 className="w-12 h-12 mx-auto text-[#0f7a2a]" />
      <h2 className="text-2xl font-extrabold">{C.titulo(estado.aluno.primeiroNome)}</h2>
      <p className="text-[15px] leading-snug">{C.whatsapp(estado.aluno.whatsapp)}</p>
      {fichaTodaEmBranco(estado) ? null : <p className="text-[15px] leading-snug">{C.ficha}</p>}
      <p className="text-[15px] leading-snug text-[#4a4a4a]">{C.aulas}</p>
      <button type="button" onClick={aoFechar} className="w-full min-h-[48px] rounded-full font-extrabold text-[14px] bg-[#121212] text-[#ffaf02]">
        {C.botao}
      </button>
    </div>
  );
}

/**
 * A janela do sinal (03 §3.5): a data em que a pessoa quer começar, ou "ainda não sei a data", e a
 * confirmação. Abre pelo botão "quero assinatura" de qualquer aula, pela tela do plano e pelo link
 * dos e-mails 4 e 5 (`#abrir=sinal`). Na caixa da aula 6 a data é escolhida ali mesmo e a janela já
 * abre na confirmação (`jaConfirmado`).
 */
export function JanelaSinal({
  aberta,
  estado,
  enviar,
  aoFechar,
}: {
  aberta: { aula: NumeroAula; jaConfirmado?: boolean } | null;
  estado: EstadoAluno;
  enviar: EnviarSinal;
  aoFechar: () => void;
}) {
  const [data, setData] = useState(estado.dataQuerComecar ?? "");
  const [naoSei, setNaoSei] = useState(false);
  const [fase, setFase] = useState<"pergunta" | "enviando" | "confirmado">("pergunta");
  const [erro, setErro] = useState<"data" | "envio" | null>(null);

  useEffect(() => {
    if (!aberta) return;
    setFase(aberta.jaConfirmado ? "confirmado" : "pergunta");
    setErro(null);
    setNaoSei(false);
    setData(estado.dataQuerComecar ?? "");
    const esc = (e: KeyboardEvent) => e.key === "Escape" && aoFechar();
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
    // Reabre do zero a cada abertura; a data guardada só entra como valor inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberta]);

  if (!aberta) return null;
  const janela = janelaFutura(hojeEmBrasilia());

  const confirmar = async () => {
    if (!naoSei && !dataNaJanela(data, janela.min, janela.max)) {
      setErro("data");
      return;
    }
    setErro(null);
    setFase("enviando");
    const ok = await enviar(aberta.aula, naoSei ? null : data);
    if (ok) setFase("confirmado");
    else {
      setFase("pergunta");
      setErro("envio");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={S.janela.titulo}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={aoFechar} />
      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white text-[#1e1e1e] rounded-t-3xl sm:rounded-3xl p-6 md:p-7 pb-[max(24px,env(safe-area-inset-bottom))]">
        <button type="button" onClick={aoFechar} aria-label="Fechar" className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <X className="w-5 h-5" />
        </button>
        {fase === "confirmado" ? (
          <Confirmacao estado={estado} aoFechar={aoFechar} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold pr-8">{S.janela.titulo}</h2>
            <p className="text-[15px] leading-snug text-[#4a4a4a]">{S.janela.texto}</p>
            {naoSei ? null : (
              <CampoData
                rotulo={S.janela.campo}
                valor={data}
                onChange={(x) => {
                  setData(x);
                  setErro(null);
                }}
                min={janela.min}
                max={janela.max}
                erro={erro === "data"}
                mensagemErro={S.janela.erroData}
              />
            )}
            <Marcar
              rotulo={S.janela.naoSei}
              marcado={naoSei}
              onChange={(x) => {
                setNaoSei(x);
                setErro(null);
              }}
            />
            {erro === "envio" ? (
              <p role="alert" className="text-[14px] font-semibold text-red-600">
                {S.janela.erroEnvio}
              </p>
            ) : null}
            <button
              type="button"
              onClick={confirmar}
              disabled={fase === "enviando"}
              className="w-full min-h-[52px] rounded-full font-extrabold text-[15px] bg-[#ffaf02] text-[#121212] disabled:opacity-60 shadow-[0_4px_20px_rgba(255,175,2,0.35)]"
            >
              {S.janela.botao}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A caixa do sinal da aula 6 (03 §3.4): separada da ficha, com a data ali mesmo. Sem data =
 * "ainda não sei" (o mesmo sinal, sem a data).
 */
export function CaixaSinalAula6({ estado, enviar, aoConfirmar }: { estado: EstadoAluno; enviar: EnviarSinal; aoConfirmar: () => void }) {
  const C = TEXTOS_FICHA.aula6.caixaSinal;
  const [data, setData] = useState(estado.dataQuerComecar ?? "");
  const [erro, setErro] = useState<"data" | "envio" | null>(null);
  const [enviando, setEnviando] = useState(false);
  const janela = janelaFutura(hojeEmBrasilia());

  const pedir = async () => {
    if (data && !dataNaJanela(data, janela.min, janela.max)) {
      setErro("data");
      return;
    }
    setErro(null);
    setEnviando(true);
    const ok = await enviar(6, data || null);
    setEnviando(false);
    if (ok) aoConfirmar();
    else setErro("envio");
  };

  return (
    <section className="rounded-3xl p-5 md:p-7 space-y-4 border border-[#ffaf02]/40" style={{ background: "linear-gradient(160deg, #1d1a12 0%, #121212 100%)" }}>
      <h2 className="text-xl md:text-2xl font-extrabold text-white">{C.titulo}</h2>
      <p className="text-[15px] leading-snug text-white/80">{C.texto}</p>
      <div className="rounded-2xl bg-white p-4 text-[#1e1e1e]">
        <CampoData rotulo={C.campo} valor={data} onChange={setData} min={janela.min} max={janela.max} erro={erro === "data"} mensagemErro={TEXTOS_FICHA.erroDataFutura} />
      </div>
      {erro === "envio" ? (
        <p role="alert" className="text-[14px] font-semibold text-red-400">
          {S.janela.erroEnvio}
        </p>
      ) : null}
      <button
        type="button"
        onClick={pedir}
        disabled={enviando}
        className="w-full sm:w-auto min-h-[52px] px-7 rounded-full font-extrabold text-[14px] bg-[#ffaf02] text-[#121212] disabled:opacity-60"
      >
        {textoDoBotaoSinal(estado)}
      </button>
    </section>
  );
}

/** Bônus do WhatsApp do Lucas (03 §3.6; contrato §12). Sem número válido do Lucas, não aparece. */
export function BonusWhatsApp({ codigo }: { codigo: string }) {
  const B = TEXTOS_AREA.bonus;
  const [clicou, setClicou] = useState(false);
  const link = linkBonusLucas(NUMERO_WHATSAPP_LUCAS, B.mensagem, codigo);
  if (!link) return null;
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 space-y-3">
      <h2 className="text-[17px] font-extrabold text-white">{B.titulo}</h2>
      <p className="text-[14px] leading-snug text-white/75">{B.texto}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setClicou(true)}
        className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-full font-extrabold text-[13px] bg-[#25D366] text-white"
      >
        <MessageCircle className="w-4 h-4" />
        {B.botao}
      </a>
      {clicou ? <p className="text-[13px] font-semibold text-[#ffaf02]">{B.depois}</p> : null}
    </section>
  );
}
