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
          className="flex flex-col items-center text-center space-y-8"
        >
          {/* Logo */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#ebad04]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <Image
              src="/images/Logo-BestBarbers-branco_1.webp"
              alt="BestBarbers"
              width={200}
              height={50}
              className="relative w-[140px] md:w-[160px] h-auto"
            />
          </div>

          {/* Frase de impacto */}
          <p 
            className="text-[#fafafa] opacity-60 text-sm md:text-base max-w-lg leading-relaxed"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Transformando barbeiros em empresários e barbearias em grandes empresas através de tecnologia e dados.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-12 mb-8"
        />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[#fafafa] opacity-40 text-[10px] md:text-xs uppercase tracking-widest"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            © {new Date().getFullYear()} BestBarbers · Todos os direitos reservados
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
