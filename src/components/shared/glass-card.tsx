"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  as?: "div" | "section" | "article";
  padding?: "sm" | "md" | "lg";
}

const paddingMap = {
  sm: "p-unit-sm",
  md: "p-unit-md",
  lg: "p-unit-lg",
};

export function GlassCard({
  children,
  className,
  glow = false,
  hover = false,
  as: Tag = "div",
  padding = "md",
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-white/10 bg-surface-container-low/60 backdrop-blur-xl",
        glow && "shadow-[0_0_30px_-5px_rgba(210,187,255,0.2)]",
        hover && "transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_40px_-5px_rgba(210,187,255,0.3)]",
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
