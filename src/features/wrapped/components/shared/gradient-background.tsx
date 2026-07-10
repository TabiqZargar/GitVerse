"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GradientBackgroundProps {
  colors?: [string, string, string];
  speed?: number;
}

export function GradientBackground({
  colors = ["oklch(0.2 0.06 265)", "oklch(0.15 0.05 200)", "oklch(0.18 0.05 300)"],
  speed = 8,
}: GradientBackgroundProps) {
  const [positions, setPositions] = useState({
    x1: 0,
    y1: 0,
    x2: 100,
    y2: 100,
    x3: 50,
    y3: 50,
  });

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    const animate = (now: number) => {
      const t = ((now - start) / (speed * 1000)) * Math.PI * 2;
      setPositions({
        x1: 50 + Math.sin(t) * 30,
        y1: 50 + Math.cos(t * 0.8) * 30,
        x2: 50 + Math.sin(t * 0.7 + 2) * 30,
        y2: 50 + Math.cos(t * 0.9 + 1) * 30,
        x3: 50 + Math.sin(t * 1.1 + 4) * 25,
        y3: 50 + Math.cos(t * 0.6 + 3) * 25,
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [speed]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(600px at ${positions.x1}% ${positions.y1}%, ${colors[0]} 0%, transparent 70%),
            radial-gradient(600px at ${positions.x2}% ${positions.y2}%, ${colors[1]} 0%, transparent 70%),
            radial-gradient(600px at ${positions.x3}% ${positions.y3}%, ${colors[2]} 0%, transparent 70%)
          `,
        }}
      />
    </motion.div>
  );
}
