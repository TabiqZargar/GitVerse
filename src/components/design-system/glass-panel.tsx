"use client";

import { motion } from "framer-motion";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "flat";
}

const variants = {
  default: "glass rounded-xl",
  elevated: "glass rounded-xl shadow-glass-lg",
  flat: "bg-card backdrop-blur-none border border-border rounded-xl",
};

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(variants[variant], "bg-glass", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

const GlassPanelHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between px-5 py-4", className)} {...props} />
  )
);
GlassPanelHeader.displayName = "GlassPanelHeader";

const GlassPanelContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-5 pb-5", className)} {...props} />
  )
);
GlassPanelContent.displayName = "GlassPanelContent";

function GlassPanelMotion({
  children,
  className,
  variant = "default",
  delay = 0,
}: GlassPanelProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(variants[variant], className)}
    >
      {children}
    </motion.div>
  );
}

export { GlassPanel, GlassPanelHeader, GlassPanelContent, GlassPanelMotion };
