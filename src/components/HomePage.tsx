"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { SubscriptionsSection } from "@/components/sections/SubscriptionsSection";
import { InvoicesSection } from "@/components/sections/InvoicesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TotemSection } from "@/components/sections/TotemSection";
import { NotificationsSection } from "@/components/sections/NotificationsSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { StepsSection } from "@/components/sections/StepsSection";
import { BasicPlanSection } from "@/components/sections/BasicPlanSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";
import { LeadFormModal } from "@/components/sections/LeadFormModal";

export function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDesc, setModalDesc] = useState<string>("");

  const openModal = useCallback((desc: string) => {
    setModalDesc(desc);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar onCtaClick={() => openModal("[Site]BT-Header")} />
      <HeroSection onCtaClick={() => openModal("[Site]BT-Rapha")} />
      <SubscriptionsSection onCtaClick={() => openModal("[Site]BT-Assinatura")} />
      <InvoicesSection onCtaClick={() => openModal("[Site]BT-Nota-fiscal")} />
      <FeaturesSection onCtaClick={() => openModal("[Site]BT-Funcionalidades")} />
      <TotemSection onCtaClick={() => openModal("[Site]BT-Totem")} />
      <NotificationsSection onCtaClick={() => openModal("[Site]BT-Notificacoes")} />
      <ClientsSection />
      <TestimonialsSection />
      <StepsSection onCtaClick={() => openModal("[Site]BT-Passos")} />
      <BasicPlanSection />
      <FAQSection />
      <Footer />

      <LeadFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        originDesc={modalDesc}
      />
    </main>
  );
}
