"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "text-xs tracking-widest uppercase text-muted-foreground font-medium",
  md: "text-sm font-semibold",
  lg: "text-lg font-semibold",
};

export function SectionHeader({ title, action, className, size = "sm" }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className={cn(sizeStyles[size])}>{title}</span>
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}
