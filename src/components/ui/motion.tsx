"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode, useEffect, useState, useRef } from "react";

// ==========================================
// ANIMATION VARIANTS
// ==========================================

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ==========================================
// ANIMATED COMPONENTS
// ==========================================

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { delay, duration: 0.5 },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

export function AnimatedDiv({
  children,
  className,
  variants = fadeInUp,
  delay = 0,
  ...props
}: AnimatedDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...(typeof variants.visible === "object" &&
            "transition" in variants.visible
              ? variants.visible.transition
              : {}),
            delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  as: Component = "p",
}: AnimatedTextProps) {
  const MotionComponent = motion.create(Component);

  return (
    <MotionComponent
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

// ==========================================
// STAGGER CONTAINER
// ==========================================

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// FLOATING ANIMATION
// ==========================================

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "strong";
}

export function FloatingElement({
  children,
  className,
  intensity = "medium",
}: FloatingElementProps) {
  const yValues = {
    light: [-5, 5, -5],
    medium: [-10, 10, -10],
    strong: [-15, 15, -15],
  };

  return (
    <motion.div
      animate={{ y: yValues[intensity] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// COUNT UP ANIMATION
// ==========================================

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // Easing function (ease out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOutCubic * end));

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// ==========================================
// PARALLAX WRAPPER
// ==========================================

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function Parallax({ children, className, speed = 0.5 }: ParallaxProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: -20 * speed }}
      viewport={{ once: false, margin: "-200px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==========================================
// HIGHLIGHT TEXT ANIMATION
// ==========================================

interface HighlightTextProps {
  children: ReactNode;
  className?: string;
  highlightColor?: string;
}

export function HighlightText({
  children,
  className,
  highlightColor = "#ffaf02",
}: HighlightTextProps) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      style={{
        backgroundImage: `linear-gradient(to right, ${highlightColor}, ${highlightColor})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
        paddingBottom: "2px",
      }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

// ==========================================
// ANIMATED BUTTON
// ==========================================

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
}: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ==========================================
// MARQUEE (Infinite Scroll)
// ==========================================

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
}

export function Marquee({
  children,
  className,
  speed = 30,
  direction = "left",
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: direction === "left" ? "0%" : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : "0%" }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-8 whitespace-nowrap"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

// Re-export motion for direct use
export { motion };
