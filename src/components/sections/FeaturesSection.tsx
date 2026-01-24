"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/cta-button";
import { homeContent } from "@/content/home";

interface FeaturesSectionProps {
  onCtaClick?: () => void;
}

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { features } = homeContent;

  // Duplicate items for infinite scroll effect
  const duplicatedItems = [...features.items, ...features.items];

  return (
    <section
      className="pt-4 md:pt-6 pb-10 md:pb-12 lg:pb-14 overflow-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="px-4 md:container-custom">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-bg2">
            E muito mais!
          </h2>
          <p className="text-sm md:text-base text-neutral-bg2/80 mt-1">
            Tudo que sua barbearia precisa em um só lugar
          </p>
        </motion.div>
      </div>

      {/* Carrossel container - full width no mobile */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden">
          <div className="relative">
            {/* Gradient fade esquerda */}
            <div className="absolute left-0 top-0 bottom-0 w-4 md:w-10 bg-gradient-to-r from-[#ffaf02] to-transparent z-10 pointer-events-none" />

            {/* Gradient fade direita */}
            <div className="absolute right-0 top-0 bottom-0 w-4 md:w-10 bg-gradient-to-l from-[#ffaf02] to-transparent z-10 pointer-events-none" />

            {/* Carousel track */}
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-3 md:gap-4 items-center"
            >
              {duplicatedItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 flex flex-col items-center justify-center text-center gap-2 md:gap-3 p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 w-[120px] h-[110px] md:w-[160px] md:h-[150px]"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                    <Image
                      src={item.icon}
                      alt={`Ícone ${item.title}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] md:text-xs font-semibold text-neutral-black-text leading-tight px-1">
                    {item.title}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mt-8 md:mt-10 px-4"
      >
        {onCtaClick ? (
          <CTAButton
            onClick={onCtaClick}
            variant="secondary"
            size="md"
            icon={true}
          >
            QUERO UM APP PRÓPRIO
          </CTAButton>
        ) : (
          <CTAButton
            href={features.cta.href}
            variant="secondary"
            size="md"
            icon={true}
          >
            QUERO UM APP PRÓPRIO
          </CTAButton>
        )}
      </motion.div>
    </section>
  );
}
