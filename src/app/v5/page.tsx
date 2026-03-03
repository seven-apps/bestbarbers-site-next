"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroV5 } from "@/components/sections/HeroV5";
import { SocialProofBar } from "@/components/sections/SocialProofBar";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { FormSectionV5 } from "@/components/sections/FormSectionV5";
import { FAQShortSection } from "@/components/sections/FAQShortSection";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useSearchParams } from "next/navigation";

function LeadMachineContent() {
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
      <Navbar withoutCta />
      <HeroV5 onCtaClick={scrollToForm} />
      <SocialProofBar />
      <BenefitsGrid />
      <ClientsSection onCtaClick={scrollToForm} />
      <FormSectionV5 />
      <FAQShortSection />
      <FooterSimple />
    </>
  );
}

export default function LeadMachine() {
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
        <LeadMachineContent />
      </Suspense>
    </main>
  );
}
