export interface ContributionStats {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalRepos: number;
  streakDays: number;
  longestStreak: number;
  busiestDay: string;
  busiestHour: number;
  languageBreakdown: Record<string, number>;
  monthlyActivity: Array<{ month: string; count: number }>;
}

export interface AnalyticsSummary {
  stats: ContributionStats;
  trend: "up" | "down" | "stable";
  percentChange: number;
}
