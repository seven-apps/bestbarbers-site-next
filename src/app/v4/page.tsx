"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroAdsSection } from "@/components/sections/HeroAdsSection";
import { BarbershopGrowthSection } from "@/components/sections/BarbershopGrowthSection";
import { BarbershopPainSection } from "@/components/sections/BarbershopPainSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TotemSection } from "@/components/sections/TotemSection";
import { NotificationsSection } from "@/components/sections/NotificationsSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { BasicPlanSection } from "@/components/sections/BasicPlanSection";
import { FormSection } from "@/components/sections/FormSection";
import { Footer } from "@/components/sections/Footer";
import { useSearchParams } from "next/navigation";

function ParceirosContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const scrollToForm = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar onCtaClick={scrollToForm} />
      <HeroAdsSection onCtaClick={scrollToForm} />
      <BarbershopPainSection onCtaClick={scrollToForm} />
      <BarbershopGrowthSection onCtaClick={scrollToForm} />
      {/* <InvoicesSection onCtaClick={scrollToForm} /> */}
      <FeaturesSection onCtaClick={scrollToForm} />
      <ClientsSection onCtaClick={scrollToForm} />
      <FormSection />
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
