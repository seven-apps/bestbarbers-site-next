"use client";

import { motion } from "framer-motion";
import { CTAButton } from "@/components/ui/cta-button";
import { homeContent } from "@/content/home";
import { Sparkles } from "lucide-react";

interface HeroAdsSectionProps {
  onCtaClick?: () => void;
}

export function HeroAdsSection({ onCtaClick }: HeroAdsSectionProps) {
  const { hero } = homeContent;

  return (
    <section
      className="relative pt-24 md:pt-28 lg:pt-32 pb-10 md:pb-14 lg:pb-16 flex justify-center items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffaf02 0%, #ffbe33 50%, #ffaf02 100%)"
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Row 1: Headlines + Video */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12 w-full mb-8 lg:mb-0">
          {/* Headlines */}
          <div className="w-full lg:w-[42%] flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/90 rounded-full text-white text-xs md:text-sm font-bold shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#ffaf02]" />
                Sistema #1 para Barbearias
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[22px] md:text-[28px] lg:text-[32px] font-extrabold leading-[1.2] text-neutral-bg2 mb-4"
            >
              Sua barbearia está crescendo, <span className="text-white text-3xl drop-shadow-md">o dinheiro entrando...</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="flex flex-col gap-2"
            >
              <motion.span
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block text-white bg-black px-5 py-2.5 rounded-xl font-extrabold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                Mas seu lucro
              </motion.span>
              <motion.span
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-block text-white bg-black px-5 py-2.5 rounded-xl font-extrabold text-[32px] md:text-[40px] lg:text-[48px] leading-[1.1] shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
              >
                não aumenta
              </motion.span>
            </motion.div>
          </div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-[58%] flex justify-center lg:justify-end"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-md lg:max-w-none"
            >
              {/* Glow effect behind video */}
              <div className="absolute -inset-3 bg-black/20 rounded-2xl lg:rounded-3xl blur-2xl" />

              {/* Video container */}
              <div className="relative aspect-video rounded-xl lg:rounded-2xl overflow-hidden shadow-[0_25px_80px_-15px_rgba(0,0,0,0.5)] border-4 border-white/20">
                <iframe
                  src="https://www.youtube.com/embed/ZnicnaPdui0?autoplay=1&mute=1&loop=1&playlist=ZnicnaPdui0&rel=0"
                  title="Best Barbers"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Row 2: Description + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 mt-6 lg:mt-8"
        >
          {/* Textos */}
          <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-start gap-3 text-center lg:text-left lg:max-w-xl">
            <p className="text-[15px] md:text-base lg:text-[17px] font-bold leading-relaxed text-neutral-bg2">
              Não é sobre atender mais clientes. É sobre ganhar mais dinheiro e lucrar mais, com a barbearia que você já tem.
            </p>

            <p className="text-[13px] md:text-sm lg:text-[15px] font-medium leading-relaxed text-neutral-bg2/80">
              O BestBarbers ajuda barbearias a organizarem a gestão, criarem novas fontes de receita e transformarem faturamento em lucro real.
            </p>
          </div>

          {/* CTA com destaque máximo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex-shrink-0 w-full sm:w-auto"
          >
            {/* Pulse animation wrapper */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(2, 171, 21, 0)",
                  "0 0 0 10px rgba(2, 171, 21, 0.2)",
                  "0 0 0 20px rgba(2, 171, 21, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full"
            >
              {onCtaClick ? (
                <CTAButton
                  onClick={onCtaClick}
                  variant="secondary"
                  size="lg"
                  icon={true}
                  className="w-full sm:w-auto !shadow-[0_8px_40px_rgba(2,171,21,0.5)] hover:!shadow-[0_12px_50px_rgba(2,171,21,0.6)]"
                >
                  QUERO LUCRAR MAIS COM A MINHA BARBEARIA
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
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
