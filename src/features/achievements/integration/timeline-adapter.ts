import type { MilestoneEvent } from "../types";

export interface TimelineMilestoneEvent {
  id: string;
  date: string;
  label: string;
  type: "achievement" | "milestone";
  value: number;
  metadata?: Record<string, string>;
}

export function mapToTimelineEvents(
  milestoneEvents: MilestoneEvent[],
  _achievementEvents?: { id: string; name: string; unlockedAt: string }[]
): TimelineMilestoneEvent[] {
  const events: TimelineMilestoneEvent[] = milestoneEvents.map((m) => ({
    id: `milestone-${m.id}`,
    date: m.date,
    label: m.label,
    type: "milestone" as const,
    value: m.value,
    metadata: m.metadata,
  }));

  if (_achievementEvents) {
    for (const a of _achievementEvents) {
      events.push({
        id: `achievement-${a.id}`,
        date: a.unlockedAt,
        label: a.name,
        type: "achievement" as const,
        value: 1,
      });
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}
