import type { Repository } from "@/features/github/types/domain";
import type { MilestoneResult, Milestone, MilestoneType } from "../types";

interface MilestoneInput {
  days: { date: string; count: number }[];
  repositories: Repository[];
  currentDate?: string;
}

function filterUpToDate(
  days: { date: string; count: number }[],
  currentDate?: string
): { date: string; count: number }[] {
  if (!currentDate) return [...days];
  return days.filter((d) => d.date <= currentDate);
}

export function detectMilestones(input: MilestoneInput): Milestone[] {
  const { repositories } = input;
  const days = filterUpToDate(input.days, input.currentDate);
  const milestones: Milestone[] = [];

  if (days.length === 0 && repositories.length === 0) return milestones;

  const activeDays = days.filter((d) => d.count > 0);

  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

  const firstCommitDay = activeDays[0];
  if (firstCommitDay) {
    milestones.push({
      type: "first_commit",
      label: "First commit",
      date: firstCommitDay.date,
      value: firstCommitDay.count,
    });
  }

  const sortedRepos = [...repositories].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  const firstRepo = sortedRepos[0];
  if (firstRepo) {
    milestones.push({
      type: "first_repository",
      label: "First repository",
      date: firstRepo.createdAt.slice(0, 10),
      value: 1,
      metadata: { name: firstRepo.name },
    });
  }

  const firstPublicRepo = sortedRepos.find((r) => r.visibility === "PUBLIC");
  if (firstPublicRepo) {
    milestones.push({
      type: "first_public_repository",
      label: "First public repository",
      date: firstPublicRepo.createdAt.slice(0, 10),
      value: 1,
      metadata: { name: firstPublicRepo.name },
    });
  }

  let runningTotal = 0;
  const commitMilestones = [100, 500, 1000];
  for (const day of sortedDays) {
    runningTotal += day.count;
    for (const threshold of commitMilestones) {
      if (runningTotal >= threshold && !milestones.some((m) => m.type === `commit_${threshold}` as MilestoneType)) {
        milestones.push({
          type: `commit_${threshold}` as MilestoneType,
          label: `${threshold.toLocaleString()} commits`,
          date: day.date,
          value: threshold,
        });
      }
    }
  }

  const contributionThresholds = [1000, 5000, 10000];
  let contribTotal = 0;
  for (const day of sortedDays) {
    contribTotal += day.count;
    for (const threshold of contributionThresholds) {
      if (contribTotal >= threshold && !milestones.some((m) => m.type === `contribution_${threshold}` as MilestoneType)) {
        milestones.push({
          type: `contribution_${threshold}` as MilestoneType,
          label: `${threshold.toLocaleString()} contributions`,
          date: day.date,
          value: threshold,
        });
      }
    }
  }

  let tempStreak = 0;
  const streakThresholds = [7, 30, 365];
  for (let i = 0; i < sortedDays.length; i++) {
    const day = sortedDays[i];
    if (!day) break;
    if (day.count > 0) {
      tempStreak++;
      for (const threshold of streakThresholds) {
        if (tempStreak === threshold && !milestones.some((m) => m.type === `streak_${threshold}` as MilestoneType)) {
          milestones.push({
            type: `streak_${threshold}` as MilestoneType,
            label: `${threshold}-day streak`,
            date: day.date,
            value: threshold,
          });
        }
      }
    } else {
      tempStreak = 0;
    }
  }

  const maxCountDay = sortedDays.reduce(
    (max, d) => (d.count > max.count ? d : max),
    sortedDays[0] ?? { date: "", count: 0 }
  );
  if (maxCountDay.count > 0) {
    milestones.push({
      type: "largest_contribution_day",
      label: "Largest contribution day",
      date: maxCountDay.date,
      value: maxCountDay.count,
    });
  }

  const languagesFound = new Set<string>();
  const firstLanguage = new Map<string, string>();

  for (const repo of sortedRepos) {
    for (const lang of repo.languages) {
      if (!languagesFound.has(lang.name)) {
        languagesFound.add(lang.name);
        firstLanguage.set(lang.name, repo.createdAt.slice(0, 10));
      }
    }
  }

  const langEntries = Array.from(firstLanguage.entries()).sort(
    (a, b) => a[1].localeCompare(b[1])
  );

  const firstLangEntry = langEntries[0];
  if (firstLangEntry) {
    milestones.push({
      type: "first_language",
      label: `First language: ${firstLangEntry[0]}`,
      date: firstLangEntry[1],
      value: 1,
      metadata: { language: firstLangEntry[0] },
    });
  }

  if (langEntries.length > 1) {
    const lastLangEntry = langEntries[langEntries.length - 1];
    if (lastLangEntry) {
      milestones.push({
        type: "newest_language",
        label: `Newest language: ${lastLangEntry[0]}`,
        date: lastLangEntry[1],
        value: 1,
        metadata: { language: lastLangEntry[0] },
      });
    }
  }

  const starThresholds = [10, 100];
  for (const threshold of starThresholds) {
    let totalStars = 0;
    let starDate = "";
    for (const repo of sortedRepos) {
      totalStars += repo.stars;
      if (totalStars >= threshold && !starDate) {
        starDate = repo.createdAt.slice(0, 10);
      }
    }
    if (starDate) {
      milestones.push({
        type: `stars_${threshold}` as MilestoneType,
        label: `${threshold} stars across repositories`,
        date: starDate,
        value: threshold,
      });
    }
  }

  for (const repo of repositories) {
    const created = repo.createdAt.slice(0, 10);
    const anniversary = new Date(created);
    const now = new Date();
    const yearsSince = now.getFullYear() - anniversary.getFullYear();

    if (yearsSince >= 1) {
      milestones.push({
        type: "repository_anniversary",
        label: `${repo.name} turns ${yearsSince} year${yearsSince > 1 ? "s" : ""}`,
        date: `${anniversary.getFullYear() + yearsSince}-${String(anniversary.getMonth() + 1).padStart(2, "0")}-${String(anniversary.getDate()).padStart(2, "0")}`,
        value: yearsSince,
        metadata: { repo: repo.name },
      });
    }
  }

  milestones.sort((a, b) => a.date.localeCompare(b.date));

  return milestones;
}

export function calculateMilestones(input: MilestoneInput): MilestoneResult {
  const milestones = detectMilestones(input);
  return { milestones, total: milestones.length };
}
