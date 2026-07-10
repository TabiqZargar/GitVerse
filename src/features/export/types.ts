export type ExportVisualization =
  | "landscape"
  | "repository-universe"
  | "contribution-galaxy"
  | "wrapped"
  | "achievements"
  | "timeline";

export type ExportTheme = "dark" | "aurora" | "midnight" | "neon" | "minimal";

export type AspectRatio = "square" | "portrait" | "landscape" | "story" | "wallpaper";

export type ExportResolution = "standard" | "hd" | "4k";

export type ExportFormat = "png" | "gif" | "mp4" | "pdf";

export interface AspectRatioDimensions {
  width: number;
  height: number;
  label: string;
}

export const ASPECT_RATIO_PRESETS: Record<AspectRatio, AspectRatioDimensions> = {
  square: { width: 1080, height: 1080, label: "1:1 Square" },
  portrait: { width: 1080, height: 1350, label: "4:5 Portrait" },
  landscape: { width: 1200, height: 630, label: "1.91:1 Landscape" },
  story: { width: 1080, height: 1920, label: "9:16 Story" },
  wallpaper: { width: 1920, height: 1080, label: "16:9 Wallpaper" },
};

export const RESOLUTION_SCALE: Record<ExportResolution, number> = {
  standard: 1,
  hd: 1.5,
  "4k": 3,
};

export const VISUALIZATION_LABELS: Record<ExportVisualization, string> = {
  landscape: "Contribution Landscape",
  "repository-universe": "Repository Universe",
  "contribution-galaxy": "Contribution Galaxy",
  wrapped: "AI Wrapped",
  achievements: "Achievements",
  timeline: "Timeline Snapshot",
};

export const THEME_LABELS: Record<ExportTheme, string> = {
  dark: "Dark",
  aurora: "Aurora",
  midnight: "Midnight",
  neon: "Neon",
  minimal: "Minimal",
};

export interface ExportOptions {
  visualization: ExportVisualization;
  theme: ExportTheme;
  aspectRatio: AspectRatio;
  resolution: ExportResolution;
  format: ExportFormat;
  backgroundColor: string;
  accentColor: string;
  showStats: boolean;
  showWatermark: boolean;
  quality: number;
}

export interface ExportJob {
  id: string;
  status: "pending" | "processing" | "complete" | "error";
  options: ExportOptions;
  progress: number;
  resultUrl?: string;
  error?: string;
  createdAt: string;
}

export interface ThemeDefinition {
  id: ExportTheme;
  background: string;
  accent: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  glow: string;
}

export const THEME_DEFINITIONS: Record<ExportTheme, ThemeDefinition> = {
  dark: {
    id: "dark",
    background: "oklch(0.11 0.015 265)",
    accent: "oklch(0.65 0.2 265)",
    surface: "oklch(0.16 0.02 265 / 0.5)",
    text: "oklch(0.97 0.005 265)",
    mutedText: "oklch(0.6 0.03 265)",
    border: "oklch(0.25 0.02 265)",
    glow: "oklch(0.65 0.2 265 / 0.15)",
  },
  aurora: {
    id: "aurora",
    background: "oklch(0.08 0.02 180)",
    accent: "oklch(0.7 0.18 170)",
    surface: "oklch(0.15 0.02 180 / 0.5)",
    text: "oklch(0.97 0.005 180)",
    mutedText: "oklch(0.6 0.04 180)",
    border: "oklch(0.25 0.03 180)",
    glow: "oklch(0.7 0.18 170 / 0.15)",
  },
  midnight: {
    id: "midnight",
    background: "oklch(0.06 0.02 280)",
    accent: "oklch(0.65 0.2 300)",
    surface: "oklch(0.12 0.025 280 / 0.5)",
    text: "oklch(0.96 0.01 280)",
    mutedText: "oklch(0.55 0.04 280)",
    border: "oklch(0.2 0.03 280)",
    glow: "oklch(0.65 0.2 300 / 0.15)",
  },
  neon: {
    id: "neon",
    background: "oklch(0.05 0.02 300)",
    accent: "oklch(0.75 0.25 320)",
    surface: "oklch(0.12 0.03 300 / 0.5)",
    text: "oklch(0.97 0.01 300)",
    mutedText: "oklch(0.6 0.05 300)",
    border: "oklch(0.25 0.04 300)",
    glow: "oklch(0.75 0.25 320 / 0.2)",
  },
  minimal: {
    id: "minimal",
    background: "oklch(0.15 0.01 265)",
    accent: "oklch(0.7 0.02 265)",
    surface: "oklch(0.2 0.015 265 / 0.5)",
    text: "oklch(0.95 0.005 265)",
    mutedText: "oklch(0.6 0.02 265)",
    border: "oklch(0.28 0.015 265)",
    glow: "oklch(0.7 0.02 265 / 0.1)",
  },
};

export interface ExportStudioState {
  isOpen: boolean;
  options: ExportOptions;
  jobs: ExportJob[];
  activeJobId: string | null;
  previewUrl: string | null;
}

export interface ProfileData {
  username: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  stats: {
    totalContributions: number;
    totalRepos: number;
    totalStars: number;
    longestStreak: number;
    currentStreak: number;
    languagesCount: number;
    developerScore: number;
    developerGrade: string;
  };
  topRepos: {
    name: string;
    description: string | null;
    stars: number;
    language: string | null;
    url: string;
  }[];
  achievements: {
    total: number;
    unlocked: number;
    recent: { id: string; name: string; rarity: string; icon: string }[];
  };
  milestones: { id: string; label: string; date: string }[];
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  visualization: "landscape",
  theme: "dark",
  aspectRatio: "landscape",
  resolution: "standard",
  format: "png",
  backgroundColor: "oklch(0.11 0.015 265)",
  accentColor: "oklch(0.65 0.2 265)",
  showStats: true,
  showWatermark: true,
  quality: 0.95,
};
