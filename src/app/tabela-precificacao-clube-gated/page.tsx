"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
// Componentes ESTÁVEIS — reusados do diretório de produção (sem duplicar).
import { HeroTabela } from "../tabela-precificacao-clube/_components/HeroTabela";
import { MetodoSection } from "../tabela-precificacao-clube/_components/MetodoSection";
import { FAQTabela } from "../tabela-precificacao-clube/_components/FAQTabela";
// Componentes NOVOS desta variante (gate de formulário obrigatório em modal).
import { TabelaSectionGated } from "./_components/TabelaSectionGated";
import { FormModalTabelaGated } from "./_components/FormModalTabelaGated";

function TabelaContent() {
  const { trackCustomEvent } = useMetaPixel();

  // Gate: o RESULTADO (Coluna 2) só é revelado depois de enviar o formulário.
  const [unlocked, setUnlocked] = useState(false);
  // O formulário virou MODAL — o CTA do gate abre; o envio fecha e libera.
  const [modalOpen, setModalOpen] = useState(false);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ViewContent no load (lead magnet — sinaliza topo de funil).
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "Tabela de Precificação de Clubes (Gated)",
      content_category: "lead_magnet",
    });
  }, [trackCustomEvent]);

  return (
    <>
      <Navbar withoutCta />

      {/* 1. Hero — promessa: o preço certo do clube em 1 minuto */}
      <HeroTabela onCtaClick={() => scrollToId("tabela")} />

      {/* 2. Tabela interativa — sliders livres; RESULTADO borrado até o form */}
      <TabelaSectionGated
        unlocked={unlocked}
        onUnlockRequest={() => setModalOpen(true)}
      />

      {/* 3. O método por trás — Regra dos 2 Cortes, preço "uau", agenda */}
      <MetodoSection />

      {/* 4. FAQ — objeções reais de precificação (regra de veracidade) */}
      <FAQTabela />

      {/* 5. Footer */}
      <FooterSimple />

      {/* Modal de captura — abre pelo CTA do gate; ao enviar, fecha,
          libera o resultado (Coluna 2) e rola até ele. */}
      <FormModalTabelaGated
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          setUnlocked(true);
          scrollToId("tabela");
        }}
      />
    </>
  );
}

export default function TabelaPrecificacaoClubeGatedPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden max-w-[100vw] w-full"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <TabelaContent />
    </main>
  );
}
