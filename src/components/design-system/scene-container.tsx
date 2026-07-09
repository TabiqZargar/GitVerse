"use client";

import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SceneContainerProps {
  children?: ReactNode;
  className?: string;
  overlay?: ReactNode;
  isLoading?: boolean;
  loadingOverlay?: ReactNode;
  label?: string;
}

export function SceneContainer({
  children,
  className,
  overlay,
  isLoading,
  loadingOverlay,
  label,
}: SceneContainerProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-surface via-background to-surface",
        "border border-glass-border",
        "shadow-glass-lg",
        className
      )}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.65_0.2_265/0.03),transparent_70%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,oklch(0.7_0.18_170/0.02),transparent_50%)]" />

      <AnimatePresence>
        {isLoading && loadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          >
            {loadingOverlay}
          </motion.div>
        )}
      </AnimatePresence>

      {overlay && (
        <div className="pointer-events-none absolute inset-0 z-10">{overlay}</div>
      )}

      <div
        className={cn("relative z-0 h-full w-full", !loaded && "opacity-0")}
        onLoad={() => setLoaded(true)}
      >
        {children}
      </div>

      {!children && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 flex h-16 w-16 items-center justify-center rounded-2xl">
              <div className="text-2xl opacity-40">*</div>
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Visualization space
            </p>
            <p className="text-muted-foreground/50 max-w-xs text-xs">
              The 3D contribution landscape will render here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
