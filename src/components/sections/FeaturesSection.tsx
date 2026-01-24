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
      className="pt-6 md:pt-8 pb-12 md:pb-14 lg:pb-16 overflow-hidden"
      style={{ 
        background: "linear-gradient(180deg, #ffaf02 0%, #ffbe33 100%)"
      }}
    >
      <div className="px-4 md:container-custom">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-1.5 bg-black/10 rounded-full text-neutral-bg2 text-xs md:text-sm font-bold mb-3"
          >
            FUNCIONALIDADES
          </motion.span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-neutral-bg2">
            E muito mais!
          </h2>
          <p className="text-sm md:text-base text-neutral-bg2/80 mt-2 max-w-md mx-auto">
            Tudo que sua barbearia precisa em um só lugar
          </p>
        </motion.div>
      </div>

      {/* Carrossel container - full width no mobile */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden">
        <div className="relative">
          {/* Gradient fade esquerda */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-[#ffaf02] to-transparent z-10 pointer-events-none" />

          {/* Gradient fade direita */}
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-[#ffbe33] to-transparent z-10 pointer-events-none" />

          {/* Carousel track */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-3 md:gap-5 items-center"
          >
            {duplicatedItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  scale: 1.08, 
                  y: -5,
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)"
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex-shrink-0 flex flex-col items-center justify-center text-center gap-2.5 md:gap-3.5 p-4 md:p-5 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-all duration-300 w-[130px] h-[120px] md:w-[170px] md:h-[160px] border border-white/50 cursor-pointer group"
              >
                <motion.div 
                  className="w-11 h-11 md:w-14 md:h-14 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={item.icon}
                    alt={`Ícone ${item.title}`}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                  />
                </motion.div>
                <p className="text-[11px] md:text-sm font-bold text-neutral-black-text leading-tight px-1 group-hover:text-[#121212] transition-colors">
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
        className="flex justify-center mt-10 md:mt-12 px-4"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 0 0 rgba(2, 171, 21, 0)",
              "0 0 0 8px rgba(2, 171, 21, 0.15)",
              "0 0 0 16px rgba(2, 171, 21, 0)"
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="rounded-full"
        >
          {onCtaClick ? (
            <CTAButton
              onClick={onCtaClick}
              variant="secondary"
              size="md"
              icon={true}
              className="!shadow-[0_8px_30px_rgba(2,171,21,0.4)]"
            >
              QUERO UM APP PRÓPRIO
            </CTAButton>
          ) : (
            <CTAButton
              href={features.cta.href}
              variant="secondary"
              size="md"
              icon={true}
              className="!shadow-[0_8px_30px_rgba(2,171,21,0.4)]"
            >
              QUERO UM APP PRÓPRIO
            </CTAButton>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
