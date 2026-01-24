"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  iconType?: "arrow" | "chevron";
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function CTAButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  icon = true,
  iconType = "arrow",
  className = "",
  fullWidth = false,
  disabled = false,
  type = "button",
}: CTAButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: "bg-[#121212] text-[#ffaf02] hover:bg-[#2a2a2a] shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    secondary: "bg-[#02ab15] text-white hover:bg-[#029912] shadow-[0_4px_20px_rgba(2,171,21,0.4)]",
    outline: "bg-transparent border-2 border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#ffaf02]",
    dark: "bg-[#ffaf02] text-[#121212] hover:bg-[#e69f00] shadow-[0_4px_20px_rgba(255,175,2,0.4)]",
  };

  // Size styles - mobile-first responsive
  const sizeStyles = {
    sm: "px-5 py-3 text-xs",
    md: "px-5 py-3 text-[11px] md:px-8 md:py-4 md:text-sm",
    lg: "px-6 py-4 text-[13px] md:px-10 md:py-5 md:text-base",
  };

  // Icon sizes
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const IconComponent = iconType === "arrow" ? ArrowRight : ChevronRight;

  const baseStyles = `
    inline-flex items-center justify-center gap-2 md:gap-3
    font-extrabold leading-tight
    rounded-full
    transition-all duration-300
    transform
    text-center
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  const buttonContent = (
    <>
      <span>{children}</span>
      {icon && (
        <motion.span
          initial={{ x: 0 }}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          <IconComponent className={iconSizes[size]} />
        </motion.span>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={baseStyles}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={baseStyles}
    >
      {buttonContent}
    </motion.button>
  );
}

// Glow effect variant for special emphasis
export function CTAButtonGlow({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`
        relative
        inline-flex items-center justify-center gap-3
        bg-[#02ab15] text-white
        px-8 py-4
        text-sm font-extrabold leading-tight
        rounded-full
        whitespace-pre-line text-center
        overflow-hidden
        ${className}
      `}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#02ab15] via-[#03d11c] to-[#02ab15] opacity-0"
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="relative z-10">{children}</span>
      <motion.span
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 inline-flex"
      >
        <ArrowRight className="w-5 h-5" />
      </motion.span>
    </motion.button>
  );
}
