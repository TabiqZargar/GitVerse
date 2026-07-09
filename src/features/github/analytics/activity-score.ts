/**
 * Activity score — computes a single engagement score for a developer profile.
 *
 * Framework-independent pure function.
 *
 * The score ranges from 0-100 and is composed of:
 * - Recent contribution density (40%)
 * - Repository diversity (25%)
 * - Community engagement via PRs/reviews (20%)
 * - Consistency / streak length (15%)
 *
 * This is used by the API layer and future AI features.
 */

import type { ContributionDay, Streak, Repository, Activity } from "../types/domain";

interface ScoreInput {
  days: ContributionDay[];
  streaks: Streak;
  repos: Repository[];
  activity: Activity;
}

export interface ActivityScore {
  total: number;
  components: {
    contributionDensity: number;
    repositoryDiversity: number;
    communityEngagement: number;
    consistency: number;
  };
}

export function calculateActivityScore(input: ScoreInput): ActivityScore {
  const contributionDensity = scoreContributionDensity(input.days);
  const repositoryDiversity = scoreRepositoryDiversity(input.repos);
  const communityEngagement = scoreCommunityEngagement(input.activity);
  const consistency = scoreConsistency(input.streaks);

  const total = Math.round(
    contributionDensity * 0.4 +
    repositoryDiversity * 0.25 +
    communityEngagement * 0.2 +
    consistency * 0.15
  );

  return {
    total,
    components: {
      contributionDensity,
      repositoryDiversity,
      communityEngagement,
      consistency,
    },
  };
}

function scoreContributionDensity(days: ContributionDay[]): number {
  if (days.length === 0) return 0;
  const activeDays = days.filter((d) => d.count > 0).length;
  const ratio = activeDays / days.length;
  return Math.round(ratio * 100);
}

function scoreRepositoryDiversity(repos: Repository[]): number {
  if (repos.length === 0) return 0;
  const languages = new Set(repos.map((r) => r.primaryLanguage).filter(Boolean));
  const langScore = Math.min(languages.size * 10, 50);
  const repoScore = Math.min(repos.length * 2, 50);
  return Math.round(langScore + repoScore);
}

function scoreCommunityEngagement(activity: Activity): number {
  let score = 0;
  score += Math.min(activity.totalPRs * 2, 40);
  score += Math.min(activity.totalIssues * 1, 30);
  score += Math.min(activity.totalReviews * 3, 30);
  return Math.round(Math.min(score, 100));
}

function scoreConsistency(streaks: Streak): number {
  let score = 0;
  score += Math.min(streaks.longestStreak * 0.5, 50);
  score += Math.min(streaks.currentStreak * 2, 50);
  return Math.round(Math.min(score, 100));
}
