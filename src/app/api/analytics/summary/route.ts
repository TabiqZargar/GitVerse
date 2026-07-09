/**
 * GET /api/analytics/summary (legacy — prefer /api/statistics)
 *
 * Returns computed analytics summary.
 * Maintained for backward compatibility with existing hooks.
 */

import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import {
  calculateStreaks,
  calculateMonthlyTotals,
  findMostActiveDay,
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

    return apiSuccessResponse({
      stats: {
        totalCommits: contributionStats.totalContributions,
        totalPRs: activity.totalPRs,
        totalIssues: activity.totalIssues,
        totalRepos: repos.length,
        streakDays: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
        busiestDay: findMostActiveDay(allDays) ?? "",
        busiestHour: 0,
        languageBreakdown: Object.fromEntries(
          languageBreakdown.languages.map((l) => [l.name, l.percentage])
        ),
        monthlyActivity: calculateMonthlyTotals(allDays).map((m) => ({
          month: m.month,
          count: m.count,
        })),
      },
      trend: "stable",
      percentChange: 0,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
