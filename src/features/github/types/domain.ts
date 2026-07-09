export interface DeveloperProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  email: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  websiteUrl: string | null;
  twitterUsername: string | null;
  createdAt: string;
  followers: number;
  following: number;
  totalRepos: number;
  totalCommits: number;
  restrictedContributions: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  intensity: 0 | 1 | 2 | 3 | 4;
  week: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionStats {
  totalContributions: number;
  restrictedContributions: number;
  calendar: ContributionCalendar;
}

export interface Repository {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  owner: string;
  visibility: "PUBLIC" | "PRIVATE";
  primaryLanguage: string | null;
  languages: LanguageUsage[];
  stars: number;
  forks: number;
  openIssues: number;
  size: number;
  isFork: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
  defaultBranch: string | null;
}

export interface LanguageUsage {
  name: string;
  size: number;
  percentage: number;
}

export interface PullRequest {
  id: string;
  title: string;
  url: string;
  state: "OPEN" | "MERGED" | "CLOSED";
  createdAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  repository: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface Issue {
  id: string;
  title: string;
  url: string;
  state: "OPEN" | "CLOSED";
  createdAt: string;
  closedAt: string | null;
  repository: string;
  comments: number;
}

export interface Review {
  id: string;
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING";
  submittedAt: string;
  repository: string;
}

export interface Activity {
  pullRequests: PullRequest[];
  issues: Issue[];
  reviews: Review[];
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  currentStreakStart: string | null;
  currentStreakEnd: string | null;
  longestStreakStart: string | null;
  longestStreakEnd: string | null;
}

export interface MonthlyTotal {
  month: string;
  year: number;
  count: number;
}

export interface YearlyTotal {
  year: number;
  count: number;
}

export interface LanguageBreakdown {
  languages: LanguageUsage[];
  totalBytes: number;
}

export interface RepositoryActivityScore {
  repoFullName: string;
  score: number;
  commits: number;
  prs: number;
  issues: number;
  reviews: number;
  daysSinceLastPush: number;
}

export interface Statistics {
  streaks: Streak;
  contributionTotals: {
    allTime: number;
    thisYear: number;
    thisMonth: number;
    thisWeek: number;
  };
  weeklyAverage: number;
  monthlyTotals: MonthlyTotal[];
  yearlyTotals: YearlyTotal[];
  repositoryRankings: RepositoryActivityScore[];
  languageBreakdown: LanguageBreakdown;
  intensityDistribution: Record<number, number>;
  commitFrequency: {
    daily: Record<string, number>;
    hourly: Record<string, number>;
  };
  mostActiveDay: string | null;
  mostActiveHour: number | null;
}

export interface FullProfile {
  profile: DeveloperProfile;
  contributions: ContributionStats;
  repositories: Repository[];
  activity: Activity;
  statistics: Statistics;
}
