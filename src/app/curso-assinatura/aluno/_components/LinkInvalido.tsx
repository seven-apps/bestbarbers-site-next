"use client";

import { useState } from "react";
import { MailCheck, MessageCircle } from "lucide-react";
import { CAMINHO_VITRINE, TEXTOS_AREA } from "@/content/curso-assinatura";
import { NUMERO_WHATSAPP_LUCAS } from "@/content/lucas-whatsapp";
import { linkLucasSemCodigo, pedirLink } from "@/lib/curso-api";
import { classeDoCampo, Rotulo } from "./Campos";

const L = TEXTOS_AREA.linkInvalido;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sem link, link revogado ou inexistente (03 §3.7; contrato §4.5). O OS responde igual exista ou
 * não o cadastro, então a tela também: "se este e-mail estiver no cadastro…". Quem envia o e-mail
 * novo é o cron do OS, minutos depois.
 */
export function LinkInvalido() {
  const [email, setEmail] = useState("");
  const [fase, setFase] = useState<"pedir" | "enviando" | "enviado">("pedir");
  const [erro, setErro] = useState<string | null>(null);
  const whatsapp = linkLucasSemCodigo(NUMERO_WHATSAPP_LUCAS, L.whatsapp.mensagem);

  const enviar = async () => {
    const valor = email.trim().toLowerCase();
    if (!EMAIL.test(valor) || valor.length > 200) {
      setErro(L.erroEmail);
      return;
    }
    setErro(null);
    setFase("enviando");
    const r = await pedirLink({ email: valor });
    if (r.ok) setFase("enviado");
    else {
      setFase("pedir");
      setErro(TEXTOS_AREA.erroRede.texto);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <section className="rounded-3xl bg-white text-[#1e1e1e] overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />
        <div className="p-6 md:p-7 space-y-4">
          <h1 className="text-[22px] md:text-2xl font-extrabold leading-tight">{L.titulo}</h1>
          {fase === "enviado" ? (
            <div role="status" className="rounded-2xl border border-[#ebad04]/50 bg-[#fff8e6] p-4 flex items-start gap-3">
              <MailCheck className="w-5 h-5 shrink-0 mt-0.5 text-[#8a6500]" />
              <p className="text-[15px] font-semibold leading-snug">{L.depois}</p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void enviar();
              }}
              className="space-y-4"
            >
              <p className="text-[15px] leading-snug text-[#4a4a4a]">{L.texto}</p>
              <div className="space-y-1.5">
                <Rotulo htmlFor="curso-email">{L.campo.rotulo}</Rotulo>
                <input
                  id="curso-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  placeholder={L.campo.exemplo}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErro(null);
                  }}
                  className={classeDoCampo(!!erro)}
                />
                {erro ? <p className="text-[13px] font-medium text-red-600">{erro}</p> : null}
              </div>
              <button
                type="submit"
                disabled={fase === "enviando"}
                className="w-full min-h-[52px] rounded-full font-extrabold text-[15px] bg-[#ffaf02] text-[#121212] disabled:opacity-60"
              >
                {L.botao}
              </button>
            </form>
          )}
        </div>
      </section>

      {whatsapp ? (
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 space-y-3 text-center">
          <p className="text-[15px] font-semibold text-white">{L.whatsapp.pergunta}</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-full font-extrabold text-[13px] bg-[#25D366] text-white"
          >
            <MessageCircle className="w-4 h-4" />
            {L.whatsapp.botao}
          </a>
        </section>
      ) : null}

      <div className="text-center space-y-2">
        <p className="text-[14px] text-white/70">{L.rodape.pergunta}</p>
        {/* <a> comum: a vitrine tem GTM e pixel, então é página nova (contrato §3). */}
        <a href={CAMINHO_VITRINE} className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full border border-white/25 text-[13px] font-extrabold text-white">
          {L.rodape.botao}
        </a>
      </div>
    </div>
  );
}
