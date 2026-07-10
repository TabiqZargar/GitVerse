"use client";

import { cn } from "@/lib/utils";
import type { Rarity } from "../types";

interface RarityBadgeProps {
  rarity: Rarity;
  className?: string;
  showLabel?: boolean;
}

const rarityStyles: Record<Rarity, string> = {
  common: "border-muted-foreground/20 text-muted-foreground bg-muted/50",
  rare: "border-chart-1/30 text-chart-1 bg-chart-1/10",
  epic: "border-chart-4/30 text-chart-4 bg-chart-4/10",
  legendary: "border-chart-5/30 text-chart-5 bg-chart-5/10",
  mythic: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
};

const rarityGlow: Record<Rarity, string> = {
  common: "",
  rare: "shadow-glow",
  epic: "shadow-[0_0_12px_oklch(0.65_0.2_320_/_0.2)]",
  legendary: "shadow-[0_0_16px_oklch(0.6_0.22_15_/_0.25)]",
  mythic: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
};

export function RarityBadge({ rarity, className, showLabel = true }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        rarityStyles[rarity],
        rarityGlow[rarity],
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          rarity === "common" && "bg-muted-foreground/40",
          rarity === "rare" && "bg-chart-1",
          rarity === "epic" && "bg-chart-4",
          rarity === "legendary" && "bg-chart-5",
          rarity === "mythic" && "bg-yellow-400"
        )}
      />
      {showLabel && rarity}
    </span>
  );
}
