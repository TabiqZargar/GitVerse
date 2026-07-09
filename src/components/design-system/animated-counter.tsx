"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  format?: boolean;
  suffix?: string;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className,
  format = true,
  suffix,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;
    const difference = to - from;

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + difference * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, duration]);

  const displayValue = format ? count.toLocaleString() : String(count);

  return (
    <motion.span
      className={cn("tabular-nums", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {displayValue}
      {suffix && <span className="text-muted-foreground ml-0.5 text-xs">{suffix}</span>}
    </motion.span>
  );
}
