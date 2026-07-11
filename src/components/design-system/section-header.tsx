"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const sizeStyles = {
  sm: "text-xs tracking-widest uppercase text-muted-foreground font-medium",
  md: "text-sm font-semibold",
  lg: "text-lg font-semibold",
};

const Headings = {
  1: (props: { className?: string; children: ReactNode }) => <h1 className={props.className}>{props.children}</h1>,
  2: (props: { className?: string; children: ReactNode }) => <h2 className={props.className}>{props.children}</h2>,
  3: (props: { className?: string; children: ReactNode }) => <h3 className={props.className}>{props.children}</h3>,
  4: (props: { className?: string; children: ReactNode }) => <h4 className={props.className}>{props.children}</h4>,
  5: (props: { className?: string; children: ReactNode }) => <h5 className={props.className}>{props.children}</h5>,
  6: (props: { className?: string; children: ReactNode }) => <h6 className={props.className}>{props.children}</h6>,
};

export function SectionHeader({ title, action, className, size = "sm", level = 2 }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {Headings[level]({ className: cn(sizeStyles[size]), children: title })}
      {action && <div className="flex items-center">{action}</div>}
    </div>
  );
}
