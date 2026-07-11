"use client";

import { cn } from "@/lib/utils";

interface Language {
  name: string;
  percentage: number;
  color: string | null;
}

interface SkillsBarProps {
  languages: Language[];
  className?: string;
  max?: number;
}

export function SkillsBar({ languages, className, max = 5 }: SkillsBarProps) {
  const top = languages.slice(0, max);

  return (
    <div className={cn("space-y-unit-sm", className)}>
      <div className="flex h-2 rounded-full bg-surface-container-highest overflow-hidden">
        {top.map((lang) => (
          <div
            key={lang.name}
            className="h-full transition-all duration-500"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color ?? "#d2bbff",
            }}
            title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-unit-md gap-y-1">
        {top.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: lang.color ?? "#d2bbff" }}
            />
            <span className="text-xs text-on-surface-variant">{lang.name}</span>
            <span className="text-[10px] text-on-surface-variant/50">{lang.percentage.toFixed(0)}%</span>
          </div>
        ))}
        {languages.length > max && (
          <span className="text-xs text-on-surface-variant/50">+{languages.length - max} more</span>
        )}
      </div>
    </div>
  );
}
