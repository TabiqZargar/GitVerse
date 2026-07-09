/**
 * Contribution service — fetches the user's contribution calendar from GitHub
 * and normalizes it into GitVerse domain models.
 *
 * Supports fetching by year range. The calendar data powers streak calculation,
 * heat maps, and timeline visualizations in future features.
 */

import { z } from "zod";
import type { GitHubClient } from "./github-client";
import { CONTRIBUTION_CALENDAR_QUERY } from "../queries/contribution";
import type { ContributionWeek, ContributionStats } from "../types/domain";
import { CACHE_TTL, cacheKey, githubCache } from "./cache";
import { EmptyDataError } from "../errors";

const contributionDaySchema = z.object({
  date: z.string(),
  contributionCount: z.number(),
  color: z.string(),
});

const weekSchema = z.object({
  contributionDays: z.array(contributionDaySchema),
});

const calendarResponseSchema = z.object({
  user: z.object({
    contributionsCollection: z.object({
      totalCommitContributions: z.number(),
      restrictedContributionsCount: z.number(),
      contributionCalendar: z.object({
        totalContributions: z.number(),
        weeks: z.array(weekSchema),
      }),
    }),
  }),
});

type CalendarResponse = z.infer<typeof calendarResponseSchema>;

const CURRENT_YEAR = new Date().getFullYear();

export class ContributionService {
  constructor(private readonly client: GitHubClient) {}

  async getContributions(
    username: string,
    year: number = CURRENT_YEAR,
    forceRefresh = false
  ): Promise<ContributionStats> {
    const cacheKeyStr = cacheKey("contributions", username, String(year));
    if (!forceRefresh) {
      const cached = githubCache.get<ContributionStats>(cacheKeyStr);
      if (cached) return cached;
    }

    const { from, to } = this.getYearRange(year);

    const raw = await this.client.query<CalendarResponse>(
      CONTRIBUTION_CALENDAR_QUERY,
      { login: username, from: from.toISOString(), to: to.toISOString() },
      calendarResponseSchema
    );

    const collection = raw.user.contributionsCollection;

    if (collection.contributionCalendar.weeks.length === 0) {
      throw new EmptyDataError(`contributions for ${username}`);
    }

    const stats = this.normalize(collection);
    githubCache.set(cacheKeyStr, stats, CACHE_TTL.CONTRIBUTIONS);
    return stats;
  }

  async getContributionsRange(
    username: string,
    startYear: number = CURRENT_YEAR - 2,
    endYear: number = CURRENT_YEAR
  ): Promise<Map<number, ContributionStats>> {
    const results = new Map<number, ContributionStats>();
    const promises: Promise<void>[] = [];

    for (let year = startYear; year <= endYear; year++) {
      promises.push(
        this.getContributions(username, year).then((stats) => {
          results.set(year, stats);
        })
      );
    }

    await Promise.all(promises);
    return results;
  }

  private getYearRange(year: number): { from: Date; to: Date } {
    const from = new Date(Date.UTC(year, 0, 1));
    const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
    return { from, to };
  }

  private normalize(raw: CalendarResponse["user"]["contributionsCollection"]): ContributionStats {
    const weeks: ContributionWeek[] = raw.contributionCalendar.weeks.map((w, weekIndex) => ({
      days: w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        intensity: this.mapIntensity(d.contributionCount),
        week: weekIndex,
      })),
    }));

    return {
      totalContributions: raw.contributionCalendar.totalContributions,
      restrictedContributions: raw.restrictedContributionsCount,
      calendar: {
        totalContributions: raw.contributionCalendar.totalContributions,
        weeks,
      },
    };
  }

  private mapIntensity(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  }
}
