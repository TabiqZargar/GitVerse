"use client";

import { motion } from "framer-motion";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  delay?: number;
  variant?: "default" | "accent" | "success" | "warning";
}

const variantStyles = {
  default: "border-glass-border/50",
  accent: "border-chart-1/20 bg-chart-1/5",
  success: "border-chart-2/20 bg-chart-2/5",
  warning: "border-chart-5/20 bg-chart-5/5",
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, delay = 0, variant = "default", children }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={cn(
          "glass rounded-2xl p-5",
          variantStyles[variant],
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
