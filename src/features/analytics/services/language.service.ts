import type { Repository } from "@/features/github/types/domain";
import type { LanguageResult, LanguageMetrics, LanguageEvolutionPoint } from "../types";

export function calculateLanguageMetrics(repos: Repository[]): LanguageMetrics[] {
  const langMap = new Map<string, { bytes: number; repoCount: number }>();

  for (const repo of repos) {
    for (const lang of repo.languages) {
      const existing = langMap.get(lang.name);
      if (existing) {
        existing.bytes += lang.size;
        existing.repoCount++;
      } else {
        langMap.set(lang.name, { bytes: lang.size, repoCount: 1 });
      }
    }
  }

  const totalBytes = Array.from(langMap.values()).reduce((s, l) => s + l.bytes, 0);

  const metrics: LanguageMetrics[] = Array.from(langMap.entries())
    .map(([name, data]) => ({
      name,
      bytes: data.bytes,
      percentage: totalBytes > 0 ? Math.round((data.bytes / totalBytes) * 10000) / 100 : 0,
      repoCount: data.repoCount,
      contributionShare: 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  return metrics;
}

export function calculateLanguageDiversity(repos: Repository[]): number {
  const languages = new Set<string>();
  for (const repo of repos) {
    for (const lang of repo.languages) {
      languages.add(lang.name);
    }
  }
  return languages.size;
}

export function findMostActiveLanguage(repos: Repository[]): LanguageMetrics | null {
  const metrics = calculateLanguageMetrics(repos);
  if (metrics.length === 0) return null;
  return metrics[0] ?? null;
}

export function calculateLanguageEvolution(
  repos: Repository[]
): LanguageEvolutionPoint[] {
  const byCreated = [...repos]
    .filter((r) => r.languages.length > 0)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  if (byCreated.length === 0) return [];

  const first = byCreated[0];
  if (!first) return [];
  const startYear = new Date(first.createdAt).getFullYear();
  const endYear = new Date().getFullYear();

  const evolution: LanguageEvolutionPoint[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const reposUpToYear = byCreated.filter(
      (r) => new Date(r.createdAt).getFullYear() <= year
    );

    if (reposUpToYear.length === 0) continue;

    const totalBytes = reposUpToYear.reduce(
      (sum, r) => sum + r.languages.reduce((s, l) => s + l.size, 0),
      0
    );

    if (totalBytes === 0) continue;

    const langBytes = new Map<string, number>();
    for (const repo of reposUpToYear) {
      for (const lang of repo.languages) {
        langBytes.set(lang.name, (langBytes.get(lang.name) ?? 0) + lang.size);
      }
    }

    const languages = Array.from(langBytes.entries())
      .map(([name, bytes]) => ({
        name,
        percentage: Math.round((bytes / totalBytes) * 10000) / 100,
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    evolution.push({ period: String(year), languages });
  }

  return evolution;
}

export function findNewLanguages(repos: Repository[]): string[] {
  const byCreated = [...repos]
    .filter((r) => r.languages.length > 0)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  if (byCreated.length === 0) return [];

  const seenLanguages = new Set<string>();
  const newLanguages: string[] = [];
  const totalSeen = new Set<string>();

  for (const repo of byCreated) {
    for (const lang of repo.languages) {
      totalSeen.add(lang.name);
    }
  }

  const checkWindow = 365 * 24 * 60 * 60 * 1000;

  for (const repo of byCreated) {
    const repoTime = new Date(repo.createdAt).getTime();
    const recentlyActiveBefore = byCreated.filter(
      (r) => {
        const t = new Date(r.createdAt).getTime();
        return t < repoTime && (repoTime - t) <= checkWindow;
      }
    );

    const langsBefore = new Set<string>();
    for (const r of recentlyActiveBefore) {
      for (const l of r.languages) {
        langsBefore.add(l.name);
      }
    }

    for (const lang of repo.languages) {
      seenLanguages.add(lang.name);
      if (!langsBefore.has(lang.name) && !newLanguages.includes(lang.name)) {
        newLanguages.push(lang.name);
      }
    }
  }

  return newLanguages.filter((l) => seenLanguages.has(l));
}

export function findPrimaryLanguage(repos: Repository[]): string | null {
  const metrics = calculateLanguageMetrics(repos);
  if (metrics.length === 0) return null;
  return metrics[0]?.name ?? null;
}

export function calculateLanguageAnalytics(repos: Repository[]): LanguageResult {
  return {
    languages: calculateLanguageMetrics(repos),
    diversity: calculateLanguageDiversity(repos),
    mostActive: findMostActiveLanguage(repos),
    evolution: calculateLanguageEvolution(repos),
    newLanguages: findNewLanguages(repos),
    primaryLanguage: findPrimaryLanguage(repos),
  };
}
