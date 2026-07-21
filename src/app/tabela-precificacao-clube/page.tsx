"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
import { HeroTabela } from "./_components/HeroTabela";
import { TabelaSection } from "./_components/TabelaSection";
import { MetodoSection } from "./_components/MetodoSection";
import { FormSectionTabela } from "./_components/FormSectionTabela";
import { FAQTabela } from "./_components/FAQTabela";

function TabelaContent() {
  const { trackCustomEvent } = useMetaPixel();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ViewContent no load (lead magnet — sinaliza topo de funil).
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "Tabela de Precificação de Clubes",
      content_category: "lead_magnet",
    });
  }, [trackCustomEvent]);

  return (
    <>
      <Navbar withoutCta />

      {/* 1. Hero — promessa: o preço certo do clube em 1 minuto */}
      <HeroTabela onCtaClick={() => scrollToId("tabela")} />

      {/* 2. Tabela interativa — sliders + preço/margem/ganho ao vivo */}
      <TabelaSection onCtaClick={() => scrollToId("form-section")} />

      {/* 3. O método por trás — Regra dos 2 Cortes, preço "uau", agenda */}
      <MetodoSection />

      {/* 4. Captura de lead — CTA "quero montar meu clube" leva até aqui */}
      <FormSectionTabela />

      {/* 5. FAQ — objeções reais de precificação (regra de veracidade) */}
      <FAQTabela />

      {/* 6. Footer */}
      <FooterSimple />
    </>
  );
}

export default function TabelaPrecificacaoClubePage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden max-w-[100vw] w-full"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <TabelaContent />
    </main>
  );
}
