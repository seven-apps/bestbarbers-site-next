"use client";

import Image from "next/image";
import { CTAButton } from "@/components/ui/cta-button";
import { homeContent } from "@/content/home";

export function BarbershopPainSection() {
  const { subscriptions } = homeContent;

  const scrollToNextSection = () => {
    const growthSection = document.getElementById("growth-section");
    if (growthSection) {
      growthSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

}
