import type { Repository } from "@/features/github/types/domain";
import type { OpenSourceScoreResult, ScoreComponent } from "../types";

const WEIGHTS = {
  publicRepos: 0.25,
  stars: 0.20,
  forks: 0.15,
  communityEngagement: 0.20,
  documentation: 0.10,
  longevity: 0.10,
};

export function calculateOpenSourceScore(repos: Repository[]): OpenSourceScoreResult {
  const components: ScoreComponent[] = [];

  const publicRepos = repos.filter((r) => r.visibility === "PUBLIC" && !r.isFork);
  const forkedRepos = repos.filter((r) => r.isFork);

  const publicRepoValue = calculatePublicRepoComponent(publicRepos);
  components.push({
    label: "Public repositories",
    value: publicRepoValue,
    weight: WEIGHTS.publicRepos,
    contribution: Math.round(publicRepoValue * WEIGHTS.publicRepos),
  });

  const starsValue = calculateStarsComponent(publicRepos);
  components.push({
    label: "Stars received",
    value: starsValue,
    weight: WEIGHTS.stars,
    contribution: Math.round(starsValue * WEIGHTS.stars),
  });

  const forksValue = calculateForksComponent(publicRepos);
  components.push({
    label: "Forks",
    value: forksValue,
    weight: WEIGHTS.forks,
    contribution: Math.round(forksValue * WEIGHTS.forks),
  });

  const engagementValue = calculateEngagementComponent(publicRepos, forkedRepos);
  components.push({
    label: "Community engagement",
    value: engagementValue,
    weight: WEIGHTS.communityEngagement,
    contribution: Math.round(engagementValue * WEIGHTS.communityEngagement),
  });

  const docValue = calculateDocumentationComponent(publicRepos);
  components.push({
    label: "Documentation",
    value: docValue,
    weight: WEIGHTS.documentation,
    contribution: Math.round(docValue * WEIGHTS.documentation),
  });

  const longevityValue = calculateLongevityComponent(publicRepos);
  components.push({
    label: "Longevity",
    value: longevityValue,
    weight: WEIGHTS.longevity,
    contribution: Math.round(longevityValue * WEIGHTS.longevity),
  });

  const total = Math.min(100, components.reduce((s, c) => s + c.contribution, 0));
  const grade = scoreToGrade(total);

  return { total, components, grade };
}

function calculatePublicRepoComponent(publicRepos: Repository[]): number {
  return Math.min(publicRepos.length * 5, 100);
}

function calculateStarsComponent(publicRepos: Repository[]): number {
  const totalStars = publicRepos.reduce((s, r) => s + r.stars, 0);
  return Math.min(totalStars, 100);
}

function calculateForksComponent(publicRepos: Repository[]): number {
  const totalForks = publicRepos.reduce((s, r) => s + r.forks, 0);
  return Math.min(totalForks * 2, 100);
}

function calculateEngagementComponent(publicRepos: Repository[], forkedRepos: Repository[]): number {
  const hasIssues = publicRepos.filter((r) => r.openIssues > 0).length;
  const forkParticipation = forkedRepos.length;
  return Math.min(hasIssues * 10 + forkParticipation * 5, 100);
}

function calculateDocumentationComponent(publicRepos: Repository[]): number {
  if (publicRepos.length === 0) return 0;

  const withDescription = publicRepos.filter((r) => r.description && r.description.length > 0).length;
  return Math.round((withDescription / publicRepos.length) * 100);
}

function calculateLongevityComponent(publicRepos: Repository[]): number {
  if (publicRepos.length === 0) return 0;

  const sorted = [...publicRepos].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const oldest = sorted[0];
  if (!oldest) return 0;

  const created = new Date(oldest.createdAt);
  const now = new Date();
  const yearsActive = (now.getTime() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.min(Math.round(yearsActive * 10), 100);
}

function scoreToGrade(score: number): string {
  if (score >= 80) return "A";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}
