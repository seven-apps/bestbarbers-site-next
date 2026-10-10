"use client";

import { useCallback, useEffect, useState } from "react";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { FooterSimple } from "@/components/sections/FooterSimple";
import {
  apagarInscricaoPendente,
  guardarToken,
  inscreverNoCurso,
  lerInscricaoPendente,
  lerTokenGuardado,
} from "@/lib/curso-api";
import { FormularioCurso } from "./FormularioCurso";
import { ProvaV2 } from "@/components/clube-v2/ProvaV2";
import { AulasCurso, ContinuarCurso, HeroiCurso, LevaCurso, NavbarCurso } from "./SecoesVitrine";

/**
 * Vitrine do curso de assinatura (`/curso-assinatura`, bloco A da estrutura de 06/Out):
 * herói → as 6 aulas → o que a pessoa leva → quem ensina → formulário.
 *
 * Quem volta com o link guardado neste aparelho vê "continuar de onde parei" (contrato §2.3).
 * Inscrição que falhou numa visita anterior (corpo guardado no aparelho) é repetida aqui, com a
 * mesma chave; dando certo, o "continuar" aparece.
 */
export function VitrineCurso() {
  const { trackCustomEvent } = useMetaPixel();
  const [temLink, setTemLink] = useState(false);

  useEffect(() => {
    // Nome estável (não muda com o nome do curso), para público e conversão personalizada.
    void trackCustomEvent("ViewContent", { content_name: "LP Curso de assinatura", content_category: "landing_page" });
  }, [trackCustomEvent]);

  useEffect(() => {
    let storage: Storage | null = null;
    try {
      storage = window.localStorage;
    } catch {
      storage = null;
    }
    if (lerTokenGuardado(storage)) {
      setTemLink(true);
      return;
    }
    const pendente = lerInscricaoPendente(storage);
    if (!pendente) return;
    void inscreverNoCurso(pendente).then((r) => {
      if (r.ok) {
        guardarToken(storage, r.token);
        apagarInscricaoPendente(storage);
        setTemLink(true);
      } else if (!r.guardarPendente) {
        apagarInscricaoPendente(storage);
      }
    });
  }, []);

  const irAoFormulario = useCallback(() => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="min-h-screen">
      <NavbarCurso onCta={irAoFormulario} />
      <HeroiCurso onCta={irAoFormulario} temLink={temLink} />
      <AulasCurso onCta={irAoFormulario} />
      <LevaCurso />
      {/* Prova da /clube (pedido do André, 06/Out): 1.200+ barbearias e os 3 parceiros falando. */}
      <ProvaV2 />
      <section id="formulario" className="relative py-14 md:py-20 overflow-hidden" style={{ background: "#0a0a0a" }}>
        <div
          aria-hidden
          className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle, #ebad04 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        <div className="container-custom relative flex flex-col gap-5 items-center">
          {temLink ? (
            <div className="w-full max-w-lg">
              <ContinuarCurso />
            </div>
          ) : null}
          <FormularioCurso />
        </div>
      </section>
      <FooterSimple />
    </main>
  );
}
