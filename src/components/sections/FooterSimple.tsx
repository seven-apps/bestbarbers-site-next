"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function FooterSimple() {
  return (
    <footer className="bg-[#0a0a0a] py-12 md:py-16 overflow-hidden border-t border-white/5">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          {/* Logo */}
          <Image
            src="/images/Logo-BestBarbers-branco_1.webp"
            alt="BestBarbers"
            width={200}
            height={50}
            className="w-[140px] md:w-[160px] h-auto"
          />

          {/* Frase de impacto */}
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            Transformando barbeiros em empresários e barbearias em grandes empresas desde 2020.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-8 mb-6"
        />

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-500 text-xs"
        >
          © {new Date().getFullYear()} BestBarbers. Todos os direitos reservados.
        </motion.p>
      </div>
    </footer>
  );
}
