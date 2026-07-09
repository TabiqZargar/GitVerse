"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ from = 0, to, duration = 2, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const startTime = Date.now();
    const difference = to - from;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + difference * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [from, to, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {count.toLocaleString()}
    </motion.span>
  );
}
