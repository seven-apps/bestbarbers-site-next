"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface StickyCtaMobileProps {
  onCtaClick?: () => void;
  ctaText?: string;
}

export function StickyCtaMobile({ 
  onCtaClick,
  ctaText = "QUERO MEU APP EXCLUSIVO"
}: StickyCtaMobileProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      const shouldShow = window.scrollY > 500;
      
      // Check if form section is in view
      const formSection = document.getElementById("form-section");
      if (formSection) {
        const rect = formSection.getBoundingClientRect();
        const isFormInView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsFormVisible(isFormInView);
      }
      
      setIsVisible(shouldShow && !isFormVisible);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFormVisible]);

  const handleClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const formSection = document.getElementById("form-section");
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-black via-black/95 to-transparent transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Glow effect */}
      <div className="absolute inset-x-4 bottom-4 h-14 bg-[#ffaf02]/20 rounded-full blur-xl" />
      
      <button
        onClick={handleClick}
        className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffaf02] to-[#ffc233] text-black font-bold text-sm py-4 px-6 rounded-full shadow-[0_8px_30px_rgba(255,175,2,0.4)] active:scale-[0.98] transition-transform duration-200"
      >
        <span>{ctaText}</span>
        {/* CSS animated arrow */}
        <span className="animate-bounce-x">
          <ArrowRight className="w-5 h-5" />
        </span>
      </button>
      
      {/* CSS animation for arrow bounce */}
      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
