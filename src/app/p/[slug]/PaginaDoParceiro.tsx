"use client";

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

export interface ParceiroDaPagina {
  slug: string;
  nome: string;
  /** "Nome (Barbearia)": vai para a Descrição da Campanha do card, como o `odesc` dos links antigos. */
  odesc: string;
  originId: number;
  foto: { src: string; width: number; height: number } | null;
}

/**
 * A mesma página da /parceiros (sem o modo cupom), com a foto e a origem do parceiro vindas do OS. A origem vai como
 * prop do formulário e vence qualquer `?origin=` da URL (usePloomesAPI: `customOriginId ?? utmMapping.originId`).
 */
export function PaginaDoParceiro({ parceiro }: { parceiro: ParceiroDaPagina }) {
  const scrollToForm = () => {
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const fotoRemota = parceiro.foto ? { ...parceiro.foto, alt: `${parceiro.nome}, parceiro BestBarbers` } : null;

  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
      <Navbar onCtaClick={scrollToForm} />
      <HeroPartnerSection onCtaClick={scrollToForm} source={parceiro.slug} fotoRemota={fotoRemota} />
      <SubscriptionsSection onCtaClick={scrollToForm} />
      <InvoicesSection onCtaClick={scrollToForm} />
      <FeaturesSection onCtaClick={scrollToForm} />
      <TotemSection onCtaClick={scrollToForm} />
      <ClientsSection onCtaClick={scrollToForm} />
      <NotificationsSection onCtaClick={scrollToForm} />
      <FormSection originId={parceiro.originId} originDesc={parceiro.odesc} />
      <BasicPlanSection />
      <Footer />
    </main>
  );
}
