"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface WrappedAnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  format?: boolean;
  suffix?: string;
  prefix?: string;
}

export function WrappedAnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className,
  format = true,
  suffix,
  prefix,
}: WrappedAnimatedCounterProps) {
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
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {prefix && <span className="text-muted-foreground mr-1">{prefix}</span>}
      {displayValue}
      {suffix && <span className="text-muted-foreground ml-1 text-sm">{suffix}</span>}
    </motion.span>
  );
}
