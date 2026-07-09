/**
 * Repository ranking calculator — sorts and scores repositories by activity.
 *
 * Framework-independent. Operates on Repository and Activity domain models.
 *
 * The activity score is a heuristic: (commits * 1) + (PRs * 3) + (issues * 2) + (reviews * 2).
 * Higher weight on PRs and reviews because they represent deeper engagement.
 */

import type { Repository, RepositoryActivityScore } from "../types/domain";

interface RepoActivity {
  repoFullName: string;
  commits: number;
  prs: number;
  issues: number;
  reviews: number;
  daysSinceLastPush: number;
}

export function rankRepositories(
  repos: Repository[],
  activityMap?: Map<string, { prs: number; issues: number; reviews: number }>
): RepositoryActivityScore[] {
  const today = Date.now();

  const scores: RepoActivity[] = repos.map((repo) => {
    const activity = activityMap?.get(repo.fullName);

    const pushedAt = repo.pushedAt ? new Date(repo.pushedAt).getTime() : null;
    const daysSinceLastPush = pushedAt ? Math.floor((today - pushedAt) / (1000 * 60 * 60 * 24)) : 999;

    return {
      repoFullName: repo.fullName,
      commits: 0,
      prs: activity?.prs ?? 0,
      issues: activity?.issues ?? 0,
      reviews: activity?.reviews ?? 0,
      daysSinceLastPush,
    };
  });

  return scores
    .map((s) => ({
      ...s,
      score: s.commits + s.prs * 3 + s.issues * 2 + s.reviews * 2,
    }))
    .sort((a, b) => b.score - a.score);
}

export function calculateRepositoryRankings(
  repos: Repository[],
  activityMap?: Map<string, { prs: number; issues: number; reviews: number }>
): RepositoryActivityScore[] {
  return rankRepositories(repos, activityMap);
}

export function calculateTotalStars(repos: Repository[]): number {
  return repos.reduce((sum, r) => sum + r.stars, 0);
}

export function calculateTotalForks(repos: Repository[]): number {
  return repos.reduce((sum, r) => sum + r.forks, 0);
}
