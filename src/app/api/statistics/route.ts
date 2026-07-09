/**
 * GET /api/statistics
 *
 * Returns computed analytics for the authenticated user's GitHub profile.
 *
 * Query params:
 *   refresh — set to "true" to bypass cache
 *
 * Response shape:
 * {
 *   data: Statistics
 * }
 *
 * This endpoint combines data from all services and runs the analytics engine.
 * It is the single source of truth for dashboard charts and insights.
 */

import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import {
  calculateStreaks,
  calculateWeeklyAverage,
  calculateMonthlyTotals,
  calculateYearlyTotals,
  calculateIntensityDistribution,
  calculateCommitFrequency,
  findMostActiveDay,
  findMostActiveHour,
  calculateContributionTotals,
  calculateRepositoryRankings,
} from "@/features/github/analytics";

export async function GET(request: NextRequest) {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    const [profile, repos, activity] = await Promise.all([
      services.user.getProfile(),
      services.repository.getRepositories(forceRefresh),
      services.activity.getActivity(forceRefresh),
    ]);

    const contributionStats = await services.contribution.getContributions(
      profile.login,
      new Date().getFullYear(),
      forceRefresh
    );

    const languageBreakdown = await services.language.getLanguageBreakdown(forceRefresh);

    const allDays = contributionStats.calendar.weeks.flatMap((w) => w.days);

    const streaks = calculateStreaks(allDays);

    const activityMap = new Map<string, { prs: number; issues: number; reviews: number }>();
    for (const pr of activity.pullRequests) {
      const entry = activityMap.get(pr.repository) ?? { prs: 0, issues: 0, reviews: 0 };
      entry.prs++;
      activityMap.set(pr.repository, entry);
    }
    for (const issue of activity.issues) {
      const entry = activityMap.get(issue.repository) ?? { prs: 0, issues: 0, reviews: 0 };
      entry.issues++;
      activityMap.set(issue.repository, entry);
    }
    for (const review of activity.reviews) {
      const entry = activityMap.get(review.repository) ?? { prs: 0, issues: 0, reviews: 0 };
      entry.reviews++;
      activityMap.set(review.repository, entry);
    }

    const statistics = {
      streaks,
      contributionTotals: calculateContributionTotals(allDays),
      weeklyAverage: calculateWeeklyAverage(contributionStats.calendar.weeks),
      monthlyTotals: calculateMonthlyTotals(allDays),
      yearlyTotals: calculateYearlyTotals(allDays),
      repositoryRankings: calculateRepositoryRankings(repos, activityMap),
      languageBreakdown,
      intensityDistribution: calculateIntensityDistribution(allDays),
      commitFrequency: calculateCommitFrequency(allDays),
      mostActiveDay: findMostActiveDay(allDays),
      mostActiveHour: findMostActiveHour(),
    };

    return apiSuccessResponse(statistics);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
