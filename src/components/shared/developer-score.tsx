"use client";

import { cn } from "@/lib/utils";

interface DeveloperScoreProps {
  score: number;
  grade: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "h-20 w-20", stroke: 60, text: "text-lg" },
  md: { container: "h-28 w-28", stroke: 80, text: "text-2xl" },
  lg: { container: "h-36 w-36", stroke: 100, text: "text-3xl" },
};

export function DeveloperScore({
  score,
  grade,
  label = "Developer Score",
  size = "md",
  className,
}: DeveloperScoreProps) {
  const dims = sizeMap[size];
  const radius = dims.stroke / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-unit-sm", className)}>
      <div className={cn("relative", dims.container)}>
        <svg
          viewBox={`0 0 ${dims.stroke} ${dims.stroke}`}
          className="h-full w-full -rotate-90"
          aria-label={`Developer score: ${score} out of 100`}
        >
          <circle
            cx={dims.stroke / 2}
            cy={dims.stroke / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          <circle
            cx={dims.stroke / 2}
            cy={dims.stroke / 2}
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d2bbff" />
              <stop offset="100%" stopColor="#7bd0ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold text-on-surface", dims.text)}>{score}</span>
          <span className="text-[8px] font-label-mono text-primary uppercase tracking-widest">{grade}</span>
        </div>
      </div>
      <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</span>
    </div>
  );
}
