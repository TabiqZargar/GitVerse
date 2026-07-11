"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loading({ className, size = "md", text }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-label={text ?? "Loading"}>
      <div className={cn("relative", sizeClasses[size], className)}>
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-primary/30 to-primary/10",
            "animate-pulse-glow"
          )}
        />
        <div
          className={cn(
            "relative rounded-full border-2",
            "border-primary/20 border-t-primary",
            "animate-spin",
            sizeClasses[size]
          )}
        />
      </div>
      {text && <p className="text-muted-foreground animate-pulse text-sm">{text}</p>}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading size="lg" text="Loading GitVerse..." />
    </div>
  );
}

export function SectionLoading() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Loading text="Loading..." />
    </div>
  );
}
