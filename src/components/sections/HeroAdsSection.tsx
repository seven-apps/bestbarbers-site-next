"use client";

import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/cta-button";
import { homeContent } from "@/content/home";

interface HeroAdsSectionProps {
  onCtaClick?: () => void;
}

export function HeroAdsSection({ onCtaClick }: HeroAdsSectionProps) {
  const { hero } = homeContent;

  return (
    <section
      className="relative pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-12 lg:pb-14 flex justify-center items-center overflow-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Row 1: Headlines + Video */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-10 w-full mb-6 lg:mb-0 ">
          {/* Headlines */}
          <div className="w-full lg:w-[42%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[22px] md:text-[28px] lg:text-[32px] font-extrabold leading-[1.2] text-neutral-bg2 mb-4"
            >
              Sua barbearia está crescendo, <span className="text-white text-3xl">o dinheiro entrando...</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="flex flex-col gap-1.5"
            >
              <span className="inline-block text-white bg-black px-5 py-2 rounded-lg font-extrabold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] shadow-lg">
                Mas seu lucro
              </span>
              <span className="inline-block text-white bg-black px-5 py-2 rounded-lg font-extrabold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] shadow-lg">
                não aumenta
              </span>
            </motion.div>
          </div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[58%] flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full max-w-md lg:max-w-none aspect-video rounded-xl lg:rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)]"
            >
              <iframe
                src="https://www.youtube.com/embed/ZnicnaPdui0?autoplay=1&mute=1&loop=1&playlist=ZnicnaPdui0&rel=0"
                title="Best Barbers"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Row 2: Description + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="w-full flex flex-col lg:flex-row items-center  justify-between gap-4 "
        >
          {/* Textos */}
          <div className="w-full lg:w-[40%]  flex flex-col items-center lg:items-start gap-2 text-center lg:text-left lg:max-w-xl">
            <p className="text-[15px] md:text-base lg:text-[17px] font-bold leading-relaxed text-neutral-bg2">
              Não é sobre atender mais clientes. É sobre ganhar mais dinheiro e lucrar mais, com a barbearia que você já tem.
            </p>

            <p className="text-[13px] md:text-sm lg:text-[15px] font-medium leading-relaxed text-neutral-bg2/75">
              O BestBarbers ajuda barbearias a organizarem a gestão, criarem novas fontes de receita e transformarem faturamento em lucro real.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            {onCtaClick ? (
              <CTAButton
                onClick={onCtaClick}
                variant="secondary"
                size="lg"
                icon={true}
                className="w-full sm:w-auto"
              >
                QUERO GANHAR MAIS COM A MINHA BARBEARIA
              </CTAButton>
            ) : (
              <CTAButton
                href={hero.cta.href}
                variant="primary"
                size="lg"
                icon={true}
                className="w-full sm:w-auto"
              >
                {hero.cta.text}
              </CTAButton>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
