"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WrappedAnimatedCounter } from "./animated-counter";

interface StatDisplayProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  format?: boolean;
  className?: string;
  delay?: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
};

export function StatDisplay({
  label,
  value,
  suffix,
  prefix,
  format = true,
  className,
  delay = 0,
  size = "md",
}: StatDisplayProps) {
  return (
    <motion.div
      className={cn("flex flex-col items-center", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <WrappedAnimatedCounter
        to={value}
        suffix={suffix}
        prefix={prefix}
        format={format}
        duration={2}
        className={cn("font-bold tracking-tight", sizeClasses[size])}
      />
      <span className="mt-1 text-sm text-muted-foreground">{label}</span>
    </motion.div>
  );
}
