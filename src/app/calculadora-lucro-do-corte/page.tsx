"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
import { HeroCalc } from "./_components/HeroCalc";
import { CalculadoraSection } from "./_components/CalculadoraSection";
import { FormSectionCalc } from "./_components/FormSectionCalc";
import { FAQCalc } from "./_components/FAQCalc";

function CalculadoraContent() {
  const { trackCustomEvent } = useMetaPixel();

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ViewContent no load (lead magnet — sinaliza topo de funil).
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "Calculadora de Lucro por Corte",
      content_category: "lead_magnet",
    });
  }, [trackCustomEvent]);

  return (
    <>
      <Navbar withoutCta />

      {/* 1. Hero — promessa: descubra quanto sobra de cada corte */}
      <HeroCalc onCtaClick={() => scrollToId("calculadora")} />

      {/* 2. Calculadora interativa — inputs + resultado ao vivo */}
      <CalculadoraSection onCtaClick={() => scrollToId("form-section")} />

      {/* 3. Captura de lead — CTA leva até aqui */}
      <FormSectionCalc />

      {/* 4. FAQ — transparência sobre a conta (regra de veracidade) */}
      <FAQCalc />

      {/* 5. Footer */}
      <FooterSimple />
    </>
  );
}

export default function CalculadoraLucroDoCortePage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden max-w-[100vw] w-full"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <CalculadoraContent />
    </main>
  );
}
