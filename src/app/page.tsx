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
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SubscriptionsSection />
      <InvoicesSection />
      <FeaturesSection />
      <TotemSection />
      <NotificationsSection />
      <ClientsSection />
      <StepsSection />
      <BasicPlanSection />
      <Footer />
    </main>
  );
}