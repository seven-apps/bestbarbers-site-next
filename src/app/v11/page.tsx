"use client";

import { Suspense, useEffect, useRef, useCallback, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroV11 } from "@/components/sections/HeroV11";
import { TrustHeroV11 } from "@/components/sections/TrustHeroV11";
import { BigNumbersV11 } from "@/components/sections/BigNumbersV11";
import { OfferComparisonV11 } from "@/components/sections/OfferComparisonV11";
import { TestimonialsV11 } from "@/components/sections/TestimonialsV11";
import { FAQShortV11 } from "@/components/sections/FAQShortV11";
import { FormSectionV11 } from "@/components/sections/FormSectionV11";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useSearchParams } from "next/navigation";
import { useMetaPixel } from "@/hooks";

function LeadMachineContent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();
  const { trackCustomEvent } = useMetaPixel();
  const trackedSections = useRef(new Set<string>());
  const [showStickyCta, setShowStickyCta] = useState(false);

  const scrollToForm = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Show sticky CTA after scrolling past hero, hide when form is visible
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const heroHeight = document.querySelector("section")?.offsetHeight || 600;
      const formEl = document.getElementById("form-section");
      const formTop = formEl?.getBoundingClientRect().top || Infinity;
      const isFormVisible = formTop < window.innerHeight;
      setShowStickyCta(window.scrollY > heroHeight && !isFormVisible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ViewContent pixel event on page load
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP V11 - Lead Machine Oferta",
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

    const sections = ["testimonials-section", "faq-section", "form-section"];
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

      {/* 2. Hero — OFERTA: app próprio sem taxa */}
      <HeroV11 onCtaClick={scrollToForm} />

      {/* 3. OfferComparison — vantagem competitiva imediata após Hero */}
      <OfferComparisonV11 onCtaClick={scrollToForm} />

      {/* 4. BigNumbers — autoridade reforça a oferta */}
      <BigNumbersV11 />

      {/* 5. TrustHero — influencers + carrossel 2 linhas */}
      <TrustHeroV11 />

      {/* 6. Testimonials — master + 4 quotes influencers */}
      <div id="testimonials-section">
        <TestimonialsV11 />
      </div>

      {/* 8. Form — pivot oferta */}
      <FormSectionV11 />

      {/* 7. FAQ slim (5 críticas + ver mais) */}
      <div id="faq-section">
        <FAQShortV11 />
      </div>

      {/* 9. Footer */}
      <FooterSimple />

      {/* Sticky CTA — mobile only, appears after hero, hides when form is visible */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent pt-4 pb-4 px-4 animate-fade-in-up">
          <button
            onClick={scrollToForm}
            className="w-full bg-gradient-to-r from-[#029912] to-[#02ab15] text-white font-extrabold text-[14px] px-6 py-4 rounded-full shadow-[0_8px_40px_rgba(2,171,21,0.5)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            QUERO MEU APP PRÓPRIO
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      )}
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
