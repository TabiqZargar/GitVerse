import type { Repository } from "@/features/github/types/domain";
import type { RepositoryResult, RepositoryHealth, RepositoryMetrics } from "../types";

function calculateRepoHealth(repo: Repository): RepositoryHealth {
  const now = Date.now();
  const pushedAt = repo.pushedAt ? new Date(repo.pushedAt).getTime() : null;
  const staleDays = pushedAt ? Math.floor((now - pushedAt) / (1000 * 60 * 60 * 24)) : 999;

  let score = 100;
  if (repo.isArchived) score -= 30;
  if (!repo.description) score -= 5;
  if (repo.openIssues > 0) score -= Math.min(repo.openIssues, 20);
  if (staleDays > 90) score -= 15;
  if (staleDays > 365) score -= 20;
  if (repo.stars > 0) score += Math.min(repo.stars, 20);
  if (repo.forks > 0) score += Math.min(repo.forks, 10);
  score = Math.max(0, Math.min(100, score));

  return {
    fullName: repo.fullName,
    stars: repo.stars,
    forks: repo.forks,
    openIssues: repo.openIssues,
    staleDays,
    isArchived: repo.isArchived,
    hasDescription: repo.description !== null && repo.description.length > 0,
    hasLicense: false,
    hasTopics: false,
    healthScore: score,
  };
}

export function calculateRepositoryHealth(repos: Repository[]): RepositoryHealth[] {
  return repos.map(calculateRepoHealth);
}

export function calculateAverageHealth(repos: Repository[]): number {
  if (repos.length === 0) return 0;
  const healths = calculateRepositoryHealth(repos);
  const total = healths.reduce((s, h) => s + h.healthScore, 0);
  return Math.round((total / repos.length) * 100) / 100;
}

export function findMostActiveRepository(
  repos: Repository[]
): RepositoryMetrics | null {
  if (repos.length === 0) return null;

  const repo = repos[0];
  if (!repo) return null;

  return {
    name: repo.fullName,
    contributionCount: 0,
    primaryLanguage: repo.primaryLanguage,
  };
}

export function calculateRepositoryDiversity(repos: Repository[]): number {
  if (repos.length === 0) return 0;
  const languages = new Set(repos.map((r) => r.primaryLanguage).filter(Boolean));
  const langScore = Math.min(languages.size * 10, 50);
  const countScore = Math.min(repos.length, 50);
  return Math.round(langScore + countScore);
}

export function calculateRepositoryAnalytics(
  repos: Repository[]
): RepositoryResult {
  const healthData = calculateRepositoryHealth(repos);

  return {
    total: repos.length,
    public: repos.filter((r) => r.visibility === "PUBLIC").length,
    private: repos.filter((r) => r.visibility === "PRIVATE").length,
    forked: repos.filter((r) => r.isFork).length,
    archived: repos.filter((r) => r.isArchived).length,
    health: healthData,
    healthAverage: calculateAverageHealth(repos),
    mostActive: findMostActiveRepository(repos),
    diversity: calculateRepositoryDiversity(repos),
    starCount: repos.reduce((s, r) => s + r.stars, 0),
    forkCount: repos.reduce((s, r) => s + r.forks, 0),
  };
}
