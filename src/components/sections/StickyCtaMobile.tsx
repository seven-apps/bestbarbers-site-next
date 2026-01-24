"use client";

import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-black via-black/95 to-transparent"
        >
          {/* Glow effect */}
          <div className="absolute inset-x-4 bottom-4 h-14 bg-[#ffaf02]/20 rounded-full blur-xl" />
          
          <motion.button
            onClick={handleClick}
            whileTap={{ scale: 0.98 }}
            className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ffaf02] to-[#ffc233] text-black font-bold text-sm py-4 px-6 rounded-full shadow-[0_8px_30px_rgba(255,175,2,0.4)]"
          >
            <span>{ctaText}</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
