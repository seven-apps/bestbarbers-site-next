"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroV12 } from "./_components/HeroV12";
import { TrustHeroV12 } from "./_components/TrustHeroV12";
import { BigNumbersV12 } from "./_components/BigNumbersV12";
import { OfferComparisonV12 } from "./_components/OfferComparisonV12";
import { TestimonialsV12 } from "./_components/TestimonialsV12";
import { FAQShortV12 } from "./_components/FAQShortV12";
import { FormSectionV12 } from "./_components/FormSectionV12";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";

function LeadMachineContent() {
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

    const heroEl = document.querySelector("section") as HTMLElement | null;
    const formEl = document.getElementById("form-section");
    const heroHeight = heroEl?.offsetHeight || 600;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const formTop = formEl?.getBoundingClientRect().top ?? Infinity;
        const isFormVisible = formTop < window.innerHeight;
        setShowStickyCta(window.scrollY > heroHeight && !isFormVisible);
        ticking = false;
      });
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
      <HeroV12 onCtaClick={scrollToForm} />

      {/* 3. OfferComparison — vantagem competitiva imediata após Hero */}
      <OfferComparisonV12 onCtaClick={scrollToForm} />

      {/* 4. BigNumbers — autoridade reforça a oferta */}
      <BigNumbersV12 />

      {/* 5. TrustHero — influencers + carrossel 2 linhas */}
      <TrustHeroV12 onCtaClick={scrollToForm} />

      {/* 6. Testimonials — master + 4 quotes influencers */}
      <div id="testimonials-section">
        <TestimonialsV12 />
      </div>

      {/* 7. Form — pivot oferta */}
      <FormSectionV12 />

      {/* 8. FAQ slim (5 críticas + ver mais) */}
      <div id="faq-section">
        <FAQShortV12 />
      </div>

      {/* 9. Footer */}
      <FooterSimple />

      {/* Sticky CTA — mobile only, appears after hero, hides when form is visible */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pt-4 pb-4 px-4 animate-fade-in-up">
          <button
            onClick={scrollToForm}
            className="w-full bg-gradient-to-r from-[#029912] to-[#02ab15] text-white font-extrabold text-[14px] px-6 py-4 rounded-full active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            style={{ 
              fontFamily: "var(--font-montserrat)",
              boxShadow: "0 10px 30px rgba(2,171,21,0.35)"
            }}
          >
            QUERO MEU APP PRÓPRIO
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      )}
    </>
  );
}

export default function LeadMachineV12() {
  return (
    <main
      className="min-h-screen overflow-x-hidden max-w-[100vw] w-full"
      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <LeadMachineContent />
    </main>
  );
}
