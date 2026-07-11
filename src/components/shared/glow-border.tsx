"use client";

import { cn } from "@/lib/utils";

interface GlowBorderProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  color?: "primary" | "secondary" | "tertiary";
}

const colorMap = {
  primary: "before:bg-gradient-to-r before:from-primary/40 before:via-secondary/40 before:to-primary-container/40",
  secondary: "before:bg-gradient-to-r before:from-secondary/40 before:via-primary/40 before:to-secondary-container/40",
  tertiary: "before:bg-gradient-to-r before:from-tertiary/40 before:via-primary/40 before:to-tertiary-container/40",
};

export function GlowBorder({ children, className, active = false, color = "primary" }: GlowBorderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        active
          ? "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude] before:pointer-events-none"
          : "",
        active ? colorMap[color] : "",
        className,
      )}
    >
      {children}
    </div>
  );
}
