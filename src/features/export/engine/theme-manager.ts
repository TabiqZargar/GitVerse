import type { ExportTheme } from "../types";
import { THEME_DEFINITIONS } from "../types";

export function applyThemeToCssVars(themeId: ExportTheme): Record<string, string> {
  const theme = THEME_DEFINITIONS[themeId];
  return {
    "--export-bg": theme.background,
    "--export-accent": theme.accent,
    "--export-surface": theme.surface,
    "--export-text": theme.text,
    "--export-muted": theme.mutedText,
    "--export-border": theme.border,
    "--export-glow": theme.glow,
  };
}

export function getExportTailwindClasses(themeId: ExportTheme): string {
  switch (themeId) {
    case "dark":
      return "bg-[oklch(0.11_0.015_265)] text-[oklch(0.97_0.005_265)]";
    case "aurora":
      return "bg-[oklch(0.08_0.02_180)] text-[oklch(0.97_0.005_180)]";
    case "midnight":
      return "bg-[oklch(0.06_0.02_280)] text-[oklch(0.96_0.01_280)]";
    case "neon":
      return "bg-[oklch(0.05_0.02_300)] text-[oklch(0.97_0.01_300)]";
    case "minimal":
      return "bg-[oklch(0.15_0.01_265)] text-[oklch(0.95_0.005_265)]";
  }
}

export function getThemeGradient(themeId: ExportTheme): string {
  switch (themeId) {
    case "dark":
      return "bg-gradient-to-br from-[oklch(0.11_0.015_265)] via-[oklch(0.14_0.02_265)] to-[oklch(0.11_0.015_265)]";
    case "aurora":
      return "bg-gradient-to-br from-[oklch(0.08_0.02_180)] via-[oklch(0.12_0.03_170)] to-[oklch(0.08_0.02_180)]";
    case "midnight":
      return "bg-gradient-to-br from-[oklch(0.06_0.02_280)] via-[oklch(0.1_0.03_290)] to-[oklch(0.06_0.02_280)]";
    case "neon":
      return "bg-gradient-to-br from-[oklch(0.05_0.02_300)] via-[oklch(0.1_0.04_310)] to-[oklch(0.05_0.02_300)]";
    case "minimal":
      return "bg-gradient-to-br from-[oklch(0.15_0.01_265)] via-[oklch(0.18_0.015_265)] to-[oklch(0.15_0.01_265)]";
  }
}
