"use client";

import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { SubscriptionsSection } from "@/components/sections/SubscriptionsSection";
import { InvoicesSection } from "@/components/sections/InvoicesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TotemSection } from "@/components/sections/TotemSection";
import { NotificationsSection } from "@/components/sections/NotificationsSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { StepsSection } from "@/components/sections/StepsSection";
import { BasicPlanSection } from "@/components/sections/BasicPlanSection";
import { FormSection } from "@/components/sections/FormSection";
import { Footer } from "@/components/sections/Footer";

export default function Parceiros() {
  const scrollToForm = () => {
    const formSection = document.getElementById("form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar onCtaClick={scrollToForm} />
      <HeroSection onCtaClick={scrollToForm} />
      <SubscriptionsSection onCtaClick={scrollToForm} />
      <InvoicesSection onCtaClick={scrollToForm} />
      <FeaturesSection onCtaClick={scrollToForm} />
      <TotemSection onCtaClick={scrollToForm} />
      <ClientsSection onCtaClick={scrollToForm} />
      <NotificationsSection onCtaClick={scrollToForm} />
      <FormSection />
      <BasicPlanSection onCtaClick={scrollToForm} />
      <Footer />
    </main>
  );
}
