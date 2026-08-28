"use client";

import Image from "next/image";
import Link from "next/link";
import { clubeContent } from "@/content/clube";
import { ArrowRight } from "lucide-react";

interface NavbarClubeProps {
  onCtaClick: () => void;
}

/**
 * Clone da Navbar da homepage para a página /clube.
 * CTA "QUERO O CLUBE NA MINHA BARBEARIA" abre o LeadFormModal
 * com originDesc [Site-Clube]BT-Header (controlado pela ClubePage).
 */
export function NavbarClube({ onCtaClick }: NavbarClubeProps) {
  const { navbar } = clubeContent;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-white/5 animate-fade-in-up">
      <div className="container-custom flex justify-between items-center min-h-[70px] md:h-[80px] py-3 md:py-4">
        {/* Logo */}
        <div className="hover:scale-[1.02] transition-transform duration-200">
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
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={navbar.buttons.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 text-white/80 px-5 py-3 rounded-full text-xs font-semibold transition-all duration-300 hover:border-white/40 hover:text-white hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Já sou cliente
          </Link>
          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
          >
            {navbar.buttons.primary.text}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden flex items-center gap-1.5 ml-3">
          <Link
            href={navbar.buttons.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center whitespace-nowrap border border-white/20 text-white/70 px-3 py-2 rounded-full text-[11px] font-semibold leading-none hover:border-white/40 hover:text-white transition-all duration-200"
          >
            Já sou cliente
          </Link>
          <button
            onClick={onCtaClick}
            className="inline-flex items-center gap-1 whitespace-nowrap bg-[#ffaf02] text-[#121212] px-3.5 py-2 rounded-full text-[11px] font-bold leading-none shadow-[0_2px_8px_rgba(255,175,2,0.25)] active:scale-[0.98] transition-transform duration-200"
          >
            {navbar.buttons.primary.textMobile}
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </nav>
  );
}
