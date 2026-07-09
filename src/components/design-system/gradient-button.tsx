"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "subtle";
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-250",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          sizeStyles[size],
          variant === "primary" && [
            "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
            "shadow-[0_0_20px_oklch(0.65_0.2_265/0.2)]",
            "hover:shadow-[0_0_30px_oklch(0.65_0.2_265/0.35)] hover:brightness-110",
            "active:brightness-90 active:scale-[0.98]",
          ],
          variant === "subtle" && [
            "glass text-foreground hover:bg-glass-hover",
            "active:scale-[0.98]",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GradientButton.displayName = "GradientButton";
