"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { homeContent } from "@/content/home";
import { ArrowRight } from "lucide-react";

interface NavbarProps {
  onCtaClick?: () => void;
}

export function Navbar({ onCtaClick }: NavbarProps) {
  const { navbar } = homeContent;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-white/5"
    >
      <div className="container-custom flex justify-between items-center min-h-[70px] md:h-[80px] py-3 md:py-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/">
            <Image
              src={navbar.logo.src}
              alt={navbar.logo.alt}
              width={navbar.logo.width}
              height={navbar.logo.height}
              className="w-[120px] md:w-[140px] h-auto"
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          {onCtaClick ? (
            <motion.button
              onClick={onCtaClick}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 hover:bg-[#e69f00] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              {navbar.buttons.primary.text}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={navbar.buttons.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 hover:bg-[#e69f00] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                {navbar.buttons.primary.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden">
          {onCtaClick ? (
            <motion.button
              onClick={onCtaClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-1.5 bg-[#ffaf02] text-[#121212] px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_2px_8px_rgba(255,175,2,0.25)]"
            >
              {navbar.buttons.primary.text}
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={navbar.buttons.primary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#ffaf02] text-[#121212] px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_2px_8px_rgba(255,175,2,0.25)]"
              >
                {navbar.buttons.primary.text}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
