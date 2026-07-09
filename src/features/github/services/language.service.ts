/**
 * Language service — aggregates language data across all user repositories.
 *
 * Single responsibility: collecting and normalizing language statistics.
 * Unlike the repository service which returns per-repo languages, this
 * service produces a unified language breakdown for the entire profile.
 *
 * Depends on RepositoryService since language data is fetched as part
 * of the repositories query (avoids an extra GraphQL call).
 */

import type { LanguageUsage, LanguageBreakdown } from "../types/domain";
import { CACHE_TTL, cacheKey, githubCache } from "./cache";
import type { RepositoryService } from "./repository.service";

export class LanguageService {
  constructor(private readonly repoService: RepositoryService) {}

  async getLanguageBreakdown(forceRefresh = false): Promise<LanguageBreakdown> {
    const cacheKeyStr = cacheKey("languages", "breakdown");
    if (!forceRefresh) {
      const cached = githubCache.get<LanguageBreakdown>(cacheKeyStr);
      if (cached) return cached;
    }

    const repos = await this.repoService.getRepositories(forceRefresh);

    const aggregated = this.aggregate(repos.flatMap((r) => r.languages));
    githubCache.set(cacheKeyStr, aggregated, CACHE_TTL.LANGUAGES);
    return aggregated;
  }

  private aggregate(allLanguages: LanguageUsage[]): LanguageBreakdown {
    const totals = new Map<string, number>();

    for (const lang of allLanguages) {
      totals.set(lang.name, (totals.get(lang.name) ?? 0) + lang.size);
    }

    const totalBytes = Array.from(totals.values()).reduce((sum, s) => sum + s, 0);

    if (totalBytes === 0) {
      return { languages: [], totalBytes: 0 };
    }

    const languages: LanguageUsage[] = Array.from(totals.entries())
      .map(([name, size]) => ({
        name,
        size,
        percentage: Math.round((size / totalBytes) * 10000) / 100,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return { languages, totalBytes };
  }
}
