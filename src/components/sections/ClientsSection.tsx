"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/motion";

interface ClientsSectionProps {
  onCtaClick?: () => void;
}

export function ClientsSection({ }: ClientsSectionProps) {

  // All logos for marquee
  const allLogos = [
    "/images/Barber-Style.webp",
    "/images/Sr-Barbearia.webp",
    "/images/Premium.webp",
    "/images/Rapha_2.webp",
    "/images/Black-House.webp",
    "/images/James.webp",
    "/images/Ferrari.webp",
    "/images/T.webp",
    "/images/Spartano.webp",
    "/images/Sr-Freitas.webp",
    "/images/Seu-Oziel.webp",
    "/images/Vicente.webp",
    "/images/R.webp",
    "/images/o.webp",
    "/images/Camilos.webp",
    "/images/Sr-Joao.webp",
    "/images/Kadosh.webp",
    "/images/Igor.webp",
    "/images/Urus.webp",
    "/images/Vitor.webp",
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20 lg:py-24 w-full overflow-hidden">
      {/* Título com Count-up */}
      <div className="px-4 md:container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-normal text-neutral-black-text text-center">
            <span className="text-[#ffaf02] font-extrabold">
              Mais de <CountUp end={1000} duration={2} suffix="+" />
            </span>
            {" barbearias"}
            <br className="hidden md:block" />
            {" ativaram o modo Best!"}
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 mt-3 text-sm md:text-base"
          >
            Junte-se às barbearias que já transformaram seus resultados
          </motion.p>
        </motion.div>
      </div>

      {/* Marquee de logos - Full width no mobile */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden mb-8 md:mb-12 py-2">
            {/* Row 1 - Left to Right */}
            <div className="relative mb-4 md:mb-6">
              <div className="absolute left-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-r from-white to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-l from-white to-transparent z-10" />

              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex gap-3 md:gap-6 items-center"
              >
                {[...allLogos.slice(0, 10), ...allLogos.slice(0, 10)].map((logo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-2 md:p-3"
                  >
                    <Image
                      src={logo}
                      alt={`Logo barbearia ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain hover:grayscale-0 transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Row 2 - Right to Left */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-r from-gray-50 to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-6 md:w-16 bg-gradient-to-l from-gray-50 to-transparent z-10" />

              <motion.div
                animate={{ x: ["-50%", "0%"] }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex gap-3 md:gap-6 items-center"
              >
                {[...allLogos.slice(10), ...allLogos.slice(10)].map((logo, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 flex-shrink-0 flex items-center justify-center bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-2 md:p-3"
                  >
                    <Image
                      src={logo}
                      alt={`Logo barbearia ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-contain  hover:grayscale-0 transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

    </section>
  );
}
