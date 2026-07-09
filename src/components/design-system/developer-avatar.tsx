"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface DeveloperAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  glow?: boolean;
}

const sizeMap = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 72,
};

const containerSize = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
  xl: "h-18 w-18",
};

const textSize = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-2xl",
};

export function DeveloperAvatar({
  name,
  image,
  size = "md",
  className,
  glow = false,
}: DeveloperAvatarProps) {
  const initials = getInitials(name ?? "?");

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0",
        containerSize[size],
        glow && "animate-pulse-glow rounded-full",
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={name ?? "User avatar"}
          width={sizeMap[size]}
          height={sizeMap[size]}
          className={cn("rounded-full object-cover", containerSize[size])}
        />
      ) : (
        <div
          className={cn(
            "bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center rounded-full font-medium text-foreground",
            containerSize[size],
            textSize[size]
          )}
        >
          {initials}
        </div>
      )}
      {glow && (
        <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/10 blur-xl" />
      )}
    </div>
  );
}
