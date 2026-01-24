"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroAdsSection } from "@/components/sections/HeroAdsSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { BarbershopPainSection } from "@/components/sections/BarbershopPainSection";
import { BarbershopGrowthSection } from "@/components/sections/BarbershopGrowthSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { FormSection } from "@/components/sections/FormSection";
import { PlanComparisonSection } from "@/components/sections/PlanComparisonSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { StickyCtaMobile } from "@/components/sections/StickyCtaMobile";
import { useSearchParams } from "next/navigation";

function ParceirosContent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();

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
      <TrustBar />
      <BarbershopPainSection onCtaClick={scrollToForm} />
      <BarbershopGrowthSection />
      <FeaturesSection onCtaClick={scrollToForm} />
      <ClientsSection onCtaClick={scrollToForm} />
      <FormSection />
      <PlanComparisonSection />
      <FAQSection />
      <FooterSimple />
      <StickyCtaMobile onCtaClick={scrollToForm} />
    </>
  );
}

export default function Parceiros() {
  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#ffaf02] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 text-sm font-medium">Carregando...</p>
          </div>
        </div>
      }>
        <ParceirosContent />
      </Suspense>
    </main>
  );
}
