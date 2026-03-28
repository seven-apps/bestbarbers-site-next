"use client";

import { Suspense, useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useMetaPixel, useUtmParams, useWhatsAppRedirect } from "@/hooks";
import { getVariant } from "@/data/lp-variants";
import { Navbar } from "@/components/sections/Navbar";
import { HeroV6 } from "@/components/sections/HeroV6";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { FooterSimple } from "@/components/sections/FooterSimple";

// Dynamic imports — below fold (reduce initial bundle)
const PainSection = dynamic(
  () => import("@/components/sections/PainSection").then((m) => ({ default: m.PainSection })),
  { loading: () => <SectionSkeleton /> }
);
const HowItWorks = dynamic(
  () => import("@/components/sections/HowItWorks").then((m) => ({ default: m.HowItWorks })),
  { loading: () => <SectionSkeleton /> }
);
const ObjectionSection = dynamic(
  () => import("@/components/sections/ObjectionSection").then((m) => ({ default: m.ObjectionSection })),
  { loading: () => <SectionSkeleton /> }
);
const SocialProofVideo = dynamic(
  () => import("@/components/sections/SocialProofVideo").then((m) => ({ default: m.SocialProofVideo })),
  { loading: () => <SectionSkeleton /> }
);
const CTAFinalSection = dynamic(
  () => import("@/components/sections/CTAFinalSection").then((m) => ({ default: m.CTAFinalSection })),
  { loading: () => <SectionSkeleton /> }
);

function SectionSkeleton() {
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#ffaf02] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function V6Content() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = useSearchParams();
  const { trackCustomEvent } = useMetaPixel();
  const { getUtmParams } = useUtmParams();
  const { generateWhatsAppLink, WHATSAPP_NUMBER } = useWhatsAppRedirect();
  const trackedSections = useRef(new Set<string>());
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const utmContent = useMemo(
    () => (mounted ? getUtmParams().utm_content : null),
    [mounted, getUtmParams]
  );
  const variant = useMemo(() => getVariant(utmContent), [utmContent]);
  const whatsappLink = useMemo(
    () => (mounted ? generateWhatsAppLink() : `https://wa.me/${WHATSAPP_NUMBER}`),
    [mounted, generateWhatsAppLink, WHATSAPP_NUMBER]
  );

  // ViewContent event
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP V6 - Lead Machine",
      content_category: "landing_page",
    });
  }, [trackCustomEvent]);

  // Sticky CTA — show after hero, hide near form
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      const heroHeight =
        document.getElementById("hero-section")?.offsetHeight || 600;
      const formEl = document.getElementById("form-section");
      const formTop = formEl?.getBoundingClientRect().top || Infinity;
      const isFormVisible = formTop < window.innerHeight;
      setShowStickyCta(window.scrollY > heroHeight && !isFormVisible);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll depth tracking
  const trackSection = useCallback(
    (sectionId: string) => {
      if (trackedSections.current.has(sectionId)) return;
      trackedSections.current.add(sectionId);
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("trackCustom", "ScrollDepth", { section: sectionId });
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = [
      "pain-section",
      "how-it-works",
      "objections-section",
      "social-proof",
      "form-section",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) trackSection(entry.target.id);
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
      {/* 1. Navbar — distraction-free, no CTA */}
      <Navbar withoutCta />

      {/* 2. Hero — 2-col with multi-step form */}
      <HeroV6 />

      {/* 3. Proof Strip — dense stats + logos */}
      <ProofStrip metrics={variant.proof.metrics} />

      {/* 4. Pain — 3 FDO pain cards */}
      <div id="pain-section">
        <PainSection cards={variant.pain.cards} transition={variant.pain.transition} />
      </div>

      {/* 5. How It Works — 3 steps (NEW) */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* 6. Objections — 5 FAQs + value stack */}
      <div id="objections-section">
        <ObjectionSection objections={variant.objections} />
      </div>

      {/* 7. Social Proof — video + testimonials + stats */}
      <div id="social-proof">
        <SocialProofVideo
          videoUrl={variant.socialProof.videoUrl}
          testimonials={variant.socialProof.testimonials}
        />
      </div>

      {/* 8. CTA Final — urgency + form repeat + WhatsApp */}
      <CTAFinalSection
        headline={variant.ctaFinal.headline}
        sub={variant.ctaFinal.sub}
        cta={variant.ctaFinal.cta}
      />

      {/* 9. Footer */}
      <FooterSimple />

      {/* Sticky WhatsApp CTA — mobile only */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent pt-4 pb-4 px-4 animate-fade-in-up">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white font-extrabold text-[14px] px-6 py-4 rounded-full shadow-[0_8px_40px_rgba(37,211,102,0.4)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar com especialista
          </a>
        </div>
      )}
    </>
  );
}

export default function LeadMachineV6() {
  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#ffaf02] border-t-transparent rounded-full animate-spin" />
              <p className="text-white/60 text-sm font-medium">
                Carregando...
              </p>
            </div>
          </div>
        }
      >
        <V6Content />
      </Suspense>
    </main>
  );
}
