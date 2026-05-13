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
import { useSearchParams } from "next/navigation";

function ParceirosContent() {
  const searchParams = useSearchParams();

  const scrollToForm = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main 
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grain Texture Global Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <Navbar withoutCta />
      <HeroAdsSection onCtaClick={scrollToForm} />
      <TrustBar />
      <BarbershopPainSection />
      <BarbershopGrowthSection />
      <FeaturesSection onCtaClick={scrollToForm} />
      <ClientsSection onCtaClick={scrollToForm} />
      <FormSection
        originDesc="LP V4"
        source="lp_v4"
      />
      <PlanComparisonSection />
      <FAQSection />
      <FooterSimple />
    </main>
  );
}

export default function V4Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#ebad04] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ParceirosContent />
    </Suspense>
  );
}
