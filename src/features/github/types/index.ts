export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubContributions {
  totalContributions: number;
  weeks: GitHubWeek[];
}

export interface GitHubWeek {
  contributionDays: GitHubDay[];
}

export interface GitHubDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  days: GitHubDay[];
}
