"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingStage {
  label: string;
  sublabel?: string;
  duration: number;
}

const DEFAULT_STAGES: LoadingStage[] = [
  { label: "Initializing Universe", sublabel: "Warping to your GitHub dimension", duration: 1800 },
  { label: "Scanning repositories", sublabel: "Mapping your code galaxies", duration: 2000 },
  { label: "Generating terrain", sublabel: "Sculpting contribution landscapes", duration: 2200 },
  { label: "Building galaxies", sublabel: "Connecting stars and forks", duration: 1800 },
  { label: "Preparing AI insights", sublabel: "Training neural networks", duration: 1600 },
];

interface LoadingOverlayProps {
  stages?: LoadingStage[];
  onComplete?: () => void;
  className?: string;
  variant?: "overlay" | "inline";
}

export function LoadingOverlay({
  stages = DEFAULT_STAGES,
  onComplete,
  className,
  variant = "overlay",
}: LoadingOverlayProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const advanceStage = useCallback(() => {
    setCurrentStage((prev) => {
      const next = prev + 1;
      if (next >= stages.length) {
        setIsComplete(true);
        onComplete?.();
        return prev;
      }
      return next;
    });
    setProgress(0);
  }, [stages.length, onComplete]);

  useEffect(() => {
    if (isComplete) return;
    const duration = stages[currentStage]?.duration ?? 2000;
    const interval = 50;
    const step = interval / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 1) {
          clearInterval(timer);
          advanceStage();
          return 1;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentStage, stages, isComplete, advanceStage]);

  const stage = stages[currentStage];

  if (!stage) return null;

  return (
    <div
      className={cn(
        variant === "overlay" && "fixed inset-0 z-200 flex items-center justify-center bg-background",
        variant === "inline" && "flex items-center justify-center",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border border-glass-border flex items-center justify-center">
            <div
              className="h-16 w-16 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, oklch(0.65 0.2 265 / 0.3) ${progress * 100}%, oklch(0.25 0.02 265) ${progress * 100}%)`,
              }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-br from-primary to-primary/60 h-3 w-3 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-lg font-semibold"
            >
              {stage.label}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${currentStage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground text-sm"
            >
              {stage.sublabel}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          {stages.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-8 rounded-full transition-all duration-500",
                i < currentStage
                  ? "bg-primary"
                  : i === currentStage
                    ? "bg-primary/50"
                    : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
