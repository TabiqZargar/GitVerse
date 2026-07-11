import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";
import { yearQuerySchema, safeParseQuery } from "@/lib/api-query-schemas";

const GITHUB_API = "https://api.github.com";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const { currentDate, year } = safeParseQuery(yearQuerySchema, searchParams);

    let token: string | null = null;
    try {
      token = await getGitHubToken();
    } catch {
      // OAuth optional
    }

    if (token) {
      const services = createServices(token);
      const profile = await services.user.getProfile(username ?? undefined);

      const [contributions, repos] = await Promise.all([
        services.contribution.getContributions(profile.login, year),
        services.repository.getRepositories(),
      ]);

      const days = contributions.calendar.weeks.flatMap((w) =>
        w.days.map((d) => ({
          date: d.date,
          count: d.count,
          level: d.intensity as number,
        }))
      );

      const summary = computeDeveloperSummary({ days, repositories: repos, currentDate });
      return apiSuccessResponse(summary);
    }

    if (!username) {
      return apiErrorResponse(new Error("Authentication or username required"));
    }

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`${GITHUB_API}/users/${username}/events?per_page=100`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      }),
    ]);

    if (!userRes.ok) {
      return apiErrorResponse(new Error("User not found"));
    }

    const events = eventsRes.ok ? await eventsRes.json() : [];
    const contribCount = (events as { type: string }[]).filter(
      (e) => ["PushEvent", "PullRequestEvent", "IssuesEvent", "CreateEvent"].includes(e.type)
    ).length;

    const repos = reposRes.ok ? await reposRes.json() : [];
    const totalStars = (repos as { stargazers_count: number }[]).reduce(
      (s: number, r: { stargazers_count: number }) => s + r.stargazers_count, 0
    );

    return apiSuccessResponse({
      statistics: {
        totalContributions: contribCount,
        totalActiveDays: 0,
        averages: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
        yearlyTotals: [],
        monthlyTotals: [],
        weeklyTotals: [],
        byLevel: [],
        byWeekday: [],
        byMonth: [],
        mostProductiveWeekday: null,
        mostProductiveMonth: null,
        mostProductiveYear: null,
      },
      streaks: { currentStreak: 0, longestStreak: 0, streakHistory: [], longestInactiveDays: 0, longestInactiveStart: null, longestInactiveEnd: null, currentStreakStart: null, currentStreakEnd: null },
      repository: { total: repos.length, public: repos.length, private: 0, forked: 0, archived: 0, health: [], healthAverage: 0, mostActive: null, diversity: 0, starCount: totalStars, forkCount: 0 },
      activity: { heatScore: 0, momentum: 0, volatility: 0, weeklyCadence: [], monthlyCadence: [], peak: null },
      productivity: { commitFrequency: 0, consistencyScore: 0, productivityScore: 0, mostProductivePeriod: "", activeDaysRatio: 0 },
      language: { languages: [], diversity: 0, mostActive: null, evolution: [], newLanguages: [], primaryLanguage: null },
      trends: { comparisons: [], growthScore: 0, direction: "stable" as const, sixMonthGrowth: 0, yearOverYearGrowth: 0 },
      milestones: { milestones: [], total: 0 },
      scores: { developer: { total: 0, components: [], grade: "N/A" }, openSource: { total: 0, components: [], grade: "N/A" } },
      insights: { insights: [], total: 0, positive: 0, neutral: 0, negative: 0 },
      computedAt: new Date().toISOString(),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
