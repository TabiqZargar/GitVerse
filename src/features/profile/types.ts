export interface ProfileData {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  website: string | null;
  twitterUsername: string | null;
  createdAt: string;

  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalCommits: number;

  repositories: ProfileRepo[];
  pinnedRepositories: ProfileRepo[];
  languages: { name: string; percentage: number; color: string | null }[];
  organizations: { login: string; avatarUrl: string }[];
  contributions: ProfileContributionDay[];
  contributionYears: number[];
  events: RawGitHubEvent[];
  recentActivity: ProfileActivity[];
}

export interface ProfileRepo {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  isFork: boolean;
  isArchived: boolean;
}

export interface ProfileContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ProfileActivity {
  type: string;
  repo: string;
  repoUrl: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

export interface RawGitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: Record<string, unknown>;
}

export interface ProfileSearchResult {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string | null;
}
