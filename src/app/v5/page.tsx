"use client";

import { Suspense, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroV5 } from "@/components/sections/HeroV5";
import { SocialProofBar } from "@/components/sections/SocialProofBar";
import { PainRecognition } from "@/components/sections/PainRecognition";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { FAQShortSection } from "@/components/sections/FAQShortSection";
import { FormSectionV5 } from "@/components/sections/FormSectionV5";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useSearchParams } from "next/navigation";
import { useMetaPixel } from "@/hooks";

function LeadMachineContent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();
  const { trackCustomEvent } = useMetaPixel();
  const trackedSections = useRef(new Set<string>());

  const scrollToForm = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ViewContent pixel event on page load
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP V5 - Lead Machine",
      content_category: "landing_page",
    });
  }, [trackCustomEvent]);

  // Scroll depth tracking via IntersectionObserver
  const trackSection = useCallback((sectionId: string) => {
    if (trackedSections.current.has(sectionId)) return;
    trackedSections.current.add(sectionId);
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", "ScrollDepth", { section: sectionId });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sections = ["pain-section", "case-study", "benefits-section", "faq-section", "form-section"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [trackSection]);

  return (
    <>
      {/* 1. Navbar */}
      <Navbar withoutCta />

      {/* 2. Hero — Dynamic headline by utm_content */}
      <HeroV5 onCtaClick={scrollToForm} />

      {/* 3. Social Proof Bar — Before/After + Authority stats */}
      <SocialProofBar />

      {/* 4. Pain Recognition — FDO validated quotes (NEW) */}
      <div id="pain-section">
        <PainRecognition />
      </div>

      {/* 5. Case Study — Before/After Pirajussara (NEW) */}
      <div id="case-study">
        <CaseStudy onCtaClick={scrollToForm} />
      </div>

      {/* 6. Outcomes Grid — Results, not features */}
      <div id="benefits-section">
        <BenefitsGrid />
      </div>

      {/* 7. Client Logos */}
      <ClientsSection onCtaClick={scrollToForm} />

      {/* 8. FAQ / Objection Handler — Real objections, BEFORE form */}
      <div id="faq-section">
        <FAQShortSection />
      </div>

      {/* 9. Form — Lead capture */}
      <FormSectionV5 />

      {/* 10. Footer */}
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
