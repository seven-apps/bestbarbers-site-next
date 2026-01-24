"use client";

import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/content/home";
import { ArrowRight } from "lucide-react";

interface NavbarProps {
  onCtaClick?: () => void;
}

export function Navbar({ onCtaClick }: NavbarProps) {
  const { navbar } = homeContent;

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
        <div className="hidden md:flex items-center">
          {onCtaClick ? (
            <button
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              {navbar.buttons.primary.text}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href={navbar.buttons.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              {navbar.buttons.primary.text}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden">
          {onCtaClick ? (
            <button
              onClick={onCtaClick}
              className="inline-flex items-center gap-1.5 bg-[#ffaf02] text-[#121212] px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_2px_8px_rgba(255,175,2,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              {navbar.buttons.primary.text}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href={navbar.buttons.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#ffaf02] text-[#121212] px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_2px_8px_rgba(255,175,2,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              {navbar.buttons.primary.text}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
