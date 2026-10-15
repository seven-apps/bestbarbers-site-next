"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroPartnerSection } from "@/components/sections/HeroPartnerSection";
import { SubscriptionsSection } from "@/components/sections/SubscriptionsSection";
import { InvoicesSection } from "@/components/sections/InvoicesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TotemSection } from "@/components/sections/TotemSection";
import { NotificationsSection } from "@/components/sections/NotificationsSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { BasicPlanSection } from "@/components/sections/BasicPlanSection";
import { FormSection } from "@/components/sections/FormSection";
import { Footer } from "@/components/sections/Footer";
import { useSearchParams } from "next/navigation";
import { CupomBar } from "@/components/sections/CupomBar";
import { cupomDaUrl, CUPOM_VALOR, CUPOM_VALIDO_ATE_TEXTO } from "@/lib/cupom-parceiro";

function ParceirosContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  // Modo cupom (out/26): só com o cupom válido do mesmo parceiro do link (src/lib/cupom-parceiro.ts).
  const cupom = cupomDaUrl({ cupom: searchParams.get("cupom"), source });

  const scrollToForm = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (cupom) {
    // O cadastro sobe para logo depois do topo (decisão da reunião de 14/Out/26); o produto vem depois.
    return (
      <>
        <Navbar onCtaClick={scrollToForm} />
        <HeroPartnerSection onCtaClick={scrollToForm} source={source} cupom={cupom} />
        <FormSection
          title={`Garanta a sua oferta exclusiva: cupom ${cupom.codigo}`}
          description={`Preencha os dados da sua barbearia. Um consultor do BestBarbers fala com você no WhatsApp e aplica R$${CUPOM_VALOR} de desconto na 1ª mensalidade do seu app próprio.\n\nO cupom vale até ${CUPOM_VALIDO_ATE_TEXTO}.`}
          ctaText={`GARANTIR MEU CUPOM DE R$${CUPOM_VALOR}`}
          ctaEnviado="✓ CUPOM GUARDADO! O CONSULTOR VAI FALAR COM VOCÊ"
        />
        <SubscriptionsSection onCtaClick={scrollToForm} />
        <InvoicesSection onCtaClick={scrollToForm} />
        <FeaturesSection onCtaClick={scrollToForm} />
        <TotemSection onCtaClick={scrollToForm} />
        <ClientsSection onCtaClick={scrollToForm} />
        <NotificationsSection onCtaClick={scrollToForm} />
        <BasicPlanSection />
        <Footer />
        <CupomBar cupom={cupom} onCtaClick={scrollToForm} />
      </>
    );
  }

  return (
    <>
      <Navbar onCtaClick={scrollToForm} />
      <HeroPartnerSection onCtaClick={scrollToForm} source={source} />
      <SubscriptionsSection onCtaClick={scrollToForm} />
      <InvoicesSection onCtaClick={scrollToForm} />
      <FeaturesSection onCtaClick={scrollToForm} />
      <TotemSection onCtaClick={scrollToForm} />
      <ClientsSection onCtaClick={scrollToForm} />
      <NotificationsSection onCtaClick={scrollToForm} />
      <FormSection />
      <BasicPlanSection />
      <Footer />
    </>
  );
}

export default function Parceiros() {
  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg">Carregando...</div>
        </div>
      }>
        <ParceirosContent />
      </Suspense>
    </main>
  );
}
