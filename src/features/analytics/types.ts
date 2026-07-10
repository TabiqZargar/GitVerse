import type { Repository } from "@/features/github/types/domain";

// ─── Date helpers for timeline-aware analytics ──────────────────────

export interface DateRange {
  start: string;
  end: string;
}

// ─── Streak service ─────────────────────────────────────────────────

export interface StreakSegment {
  start: string;
  end: string;
  length: number;
}

export interface StreakResult {
  currentStreak: number;
  currentStreakStart: string | null;
  currentStreakEnd: string | null;
  longestStreak: number;
  longestStreakStart: string | null;
  longestStreakEnd: string | null;
  streakHistory: StreakSegment[];
  longestInactiveDays: number;
  longestInactiveStart: string | null;
  longestInactiveEnd: string | null;
}

// ─── Statistics service ─────────────────────────────────────────────

export interface WeeklyTotals {
  week: string;
  count: number;
}

export interface MonthlyTotals {
  year: number;
  month: number;
  label: string;
  count: number;
}

export interface YearlyTotals {
  year: number;
  count: number;
}

export interface DistributionByLevel {
  level: number;
  days: number;
  contributions: number;
}

export interface DistributionByWeekday {
  weekday: number;
  label: string;
  days: number;
  contributions: number;
}

export interface DistributionByMonth {
  month: number;
  label: string;
  contributions: number;
}

export interface ContributionAverages {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface StatisticsResult {
  totalContributions: number;
  totalActiveDays: number;
  averages: ContributionAverages;
  yearlyTotals: YearlyTotals[];
  monthlyTotals: MonthlyTotals[];
  weeklyTotals: WeeklyTotals[];
  byLevel: DistributionByLevel[];
  byWeekday: DistributionByWeekday[];
  byMonth: DistributionByMonth[];
  mostProductiveWeekday: { weekday: number; label: string; contributions: number };
  mostProductiveMonth: { month: number; label: string; contributions: number };
  mostProductiveYear: { year: number; contributions: number };
}

// ─── Language service ───────────────────────────────────────────────

export interface LanguageMetrics {
  name: string;
  bytes: number;
  percentage: number;
  repoCount: number;
  contributionShare: number;
}

export interface LanguageEvolutionPoint {
  period: string;
  languages: { name: string; percentage: number }[];
}

export interface LanguageResult {
  languages: LanguageMetrics[];
  diversity: number;
  mostActive: LanguageMetrics | null;
  evolution: LanguageEvolutionPoint[];
  newLanguages: string[];
  primaryLanguage: string | null;
}

// ─── Repository service ─────────────────────────────────────────────

export interface RepositoryHealth {
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  staleDays: number;
  isArchived: boolean;
  hasDescription: boolean;
  hasLicense: boolean;
  hasTopics: boolean;
  healthScore: number;
}

export interface RepositoryMetrics {
  name: string;
  contributionCount: number;
  primaryLanguage: string | null;
}

export interface RepositoryResult {
  total: number;
  public: number;
  private: number;
  forked: number;
  archived: number;
  health: RepositoryHealth[];
  healthAverage: number;
  mostActive: RepositoryMetrics | null;
  diversity: number;
  starCount: number;
  forkCount: number;
}

// ─── Activity service ───────────────────────────────────────────────

export interface ActivityHeatPoint {
  date: string;
  count: number;
  dayOfWeek: number;
}

export interface ActivityResult {
  heatScore: number;
  momentum: number;
  volatility: number;
  weeklyCadence: number[];
  monthlyCadence: number[];
  peak: { date: string; count: number } | null;
}

// ─── Productivity service ───────────────────────────────────────────

export interface ProductivityResult {
  commitFrequency: number;
  consistencyScore: number;
  productivityScore: number;
  mostProductivePeriod: string;
  activeDaysRatio: number;
}

// ─── Trend service ──────────────────────────────────────────────────

export interface PeriodComparison {
  period: string;
  previous: number;
  current: number;
  change: number;
  changePercent: number;
}

export interface TrendResult {
  comparisons: PeriodComparison[];
  growthScore: number;
  direction: "up" | "down" | "stable";
  sixMonthGrowth: number;
  yearOverYearGrowth: number;
}

// ─── Milestone service ──────────────────────────────────────────────

export type MilestoneType =
  | "first_commit"
  | "first_repository"
  | "first_public_repository"
  | "longest_streak"
  | "largest_contribution_day"
  | "first_language"
  | "newest_language"
  | "commit_100"
  | "commit_500"
  | "commit_1000"
  | "contribution_1000"
  | "contribution_5000"
  | "contribution_10000"
  | "stars_10"
  | "stars_100"
  | "repository_anniversary"
  | "streak_7"
  | "streak_30"
  | "streak_365";

export interface Milestone {
  type: MilestoneType;
  label: string;
  date: string;
  value: number;
  metadata?: Record<string, string>;
}

export interface MilestoneResult {
  milestones: Milestone[];
  total: number;
}

// ─── Scoring ────────────────────────────────────────────────────────

export interface ScoreComponent {
  label: string;
  value: number;
  weight: number;
  contribution: number;
}

export interface DeveloperScoreResult {
  total: number;
  components: ScoreComponent[];
  grade: string;
}

export interface OpenSourceScoreResult {
  total: number;
  components: ScoreComponent[];
  grade: string;
}

// ─── Insights ───────────────────────────────────────────────────────

export interface Insight {
  id: string;
  category: string;
  message: string;
  severity: "positive" | "neutral" | "negative";
  metric: number;
  timestamp: string;
}

export interface InsightCollection {
  insights: Insight[];
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

// ─── Summary service (aggregated) ───────────────────────────────────

export interface DeveloperSummary {
  streaks: StreakResult;
  statistics: StatisticsResult;
  language: LanguageResult;
  repository: RepositoryResult;
  activity: ActivityResult;
  productivity: ProductivityResult;
  trends: TrendResult;
  milestones: MilestoneResult;
  scores: {
    developer: DeveloperScoreResult;
    openSource: OpenSourceScoreResult;
  };
  insights: InsightCollection;
  computedAt: string;
}

// ─── Analytics engine input ─────────────────────────────────────────

export interface AnalyticsInput {
  days: {
    date: string;
    count: number;
    level: number;
  }[];
  repositories: Repository[];
  currentDate?: string;
}

// ─── Store state ────────────────────────────────────────────────────

export interface AnalyticsState {
  streaks: StreakResult | null;
  statistics: StatisticsResult | null;
  language: LanguageResult | null;
  repository: RepositoryResult | null;
  activity: ActivityResult | null;
  productivity: ProductivityResult | null;
  trends: TrendResult | null;
  milestones: MilestoneResult | null;
  summary: DeveloperSummary | null;
  insights: InsightCollection | null;
  scores: { developer: DeveloperScoreResult; openSource: OpenSourceScoreResult } | null;
  isCalculating: boolean;
  lastUpdated: string | null;
}
