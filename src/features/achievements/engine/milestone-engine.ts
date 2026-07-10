import type { DeveloperSummary } from "@/features/analytics/types";
import type { MilestoneEvent } from "../types";

export interface MilestoneDetectionInput {
  summary: DeveloperSummary;
  previousMilestones: MilestoneEvent[];
}

export interface MilestoneDetectionResult {
  new: MilestoneEvent[];
  all: MilestoneEvent[];
}

const MILESTONE_CONFIGS = [
  { id: "first-commit", label: "First Commit", check: (s: DeveloperSummary) => s.milestones.milestones.find((m) => m.type === "first_commit") ?? null },
  { id: "first-repo", label: "First Repository", check: (s: DeveloperSummary) => s.milestones.milestones.find((m) => m.type === "first_repository") ?? null },
  { id: "longest-streak", label: "Longest Streak", check: (s: DeveloperSummary) => ({ date: s.streaks.longestStreakEnd ?? "", value: s.streaks.longestStreak, label: `${s.streaks.longestStreak}-day streak` }) },
  { id: "biggest-day", label: "Biggest Contribution Day", check: (s: DeveloperSummary) => s.milestones.milestones.find((m) => m.type === "largest_contribution_day") ?? null },
  { id: "first-language", label: "First Language", check: (s: DeveloperSummary) => s.milestones.milestones.find((m) => m.type === "first_language") ?? null },
  { id: "commit-100", label: "100 Commits", check: (s: DeveloperSummary) => s.milestones.milestones.find((m) => m.type === "commit_100") ?? null },
  { id: "commit-1000", label: "1,000 Commits", check: (s: DeveloperSummary) => s.milestones.milestones.find((m) => m.type === "commit_1000") ?? null },
  { id: "commit-10000", label: "10,000 Commits", check: (s: DeveloperSummary) => s.milestones.milestones.find((m) => m.type === "contribution_10000") ?? null },
] as const;

export function detectMilestoneEvents(input: MilestoneDetectionInput): MilestoneDetectionResult {
  const { summary, previousMilestones } = input;
  const all: MilestoneEvent[] = [...previousMilestones];
  const newEvents: MilestoneEvent[] = [];

  const previousIds = new Set(previousMilestones.map((m) => m.id));

  for (const config of MILESTONE_CONFIGS) {
    if (previousIds.has(config.id)) continue;

    const result = config.check(summary);
    if (result) {
      const event: MilestoneEvent = {
        id: config.id,
        type: config.id,
        label: result.label ?? config.label,
        date: result.date,
        value: result.value,
      };
      all.push(event);
      newEvents.push(event);
    }
  }

  return { new: newEvents, all };
}

export function getActiveMilestoneEvents(summary: DeveloperSummary): MilestoneEvent[] {
  const events: MilestoneEvent[] = [];

  for (const config of MILESTONE_CONFIGS) {
    const result = config.check(summary);
    if (result) {
      events.push({
        id: config.id,
        type: config.id,
        label: result.label ?? config.label,
        date: result.date,
        value: result.value,
      });
    }
  }

  return events;
}
