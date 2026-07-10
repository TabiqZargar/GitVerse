import type { DeveloperSummary } from "@/features/analytics/types";
import type { ChapterId, SlideContent, NarrativeData } from "../types";

export function buildNarrativePrompt(summary: DeveloperSummary, username: string): string {
  return `You are a senior developer storytelling expert. Generate a narrative for a yearly developer report.

The developer's name is "${username}".

Here is their analytics data:

STREAKS:
- Current streak: ${summary.streaks.currentStreak} days
- Longest streak: ${summary.streaks.longestStreak} days
- Longest inactive period: ${summary.streaks.longestInactiveDays} days

STATISTICS:
- Total contributions: ${summary.statistics.totalContributions}
- Total active days: ${summary.statistics.totalActiveDays}
- Daily average: ${summary.statistics.averages.daily}
- Weekly average: ${summary.statistics.averages.weekly}
- Monthly average: ${summary.statistics.averages.monthly}
- Most productive weekday: ${summary.statistics.mostProductiveWeekday.label} (${summary.statistics.mostProductiveWeekday.contributions} contributions)
- Most productive month: ${summary.statistics.mostProductiveMonth.label} (${summary.statistics.mostProductiveMonth.contributions} contributions)
- Most productive year: ${summary.statistics.mostProductiveYear.year} (${summary.statistics.mostProductiveYear.contributions} contributions)

LANGUAGES:
- Languages used: ${summary.language.languages.map(l => l.name).join(", ")}
- Diversity score: ${summary.language.diversity}
- Primary language: ${summary.language.primaryLanguage ?? "None"}
- New languages explored: ${summary.language.newLanguages.join(", ") || "None"}

REPOSITORIES:
- Total repositories: ${summary.repository.total}
- Public: ${summary.repository.public}
- Private: ${summary.repository.private}
- Forked: ${summary.repository.forked}
- Star count: ${summary.repository.starCount}
- Fork count: ${summary.repository.forkCount}
- Average health score: ${summary.repository.healthAverage}
- Most active: ${summary.repository.mostActive?.name ?? "None"}

ACTIVITY:
- Heat score: ${summary.activity.heatScore}/100
- Momentum: ${summary.activity.momentum}%
- Volatility: ${summary.activity.volatility}%
- Peak day: ${summary.activity.peak?.date ?? "None"} (${summary.activity.peak?.count ?? 0} contributions)

PRODUCTIVITY:
- Consistency score: ${summary.productivity.consistencyScore}/100
- Productivity score: ${summary.productivity.productivityScore}/100
- Active days ratio: ${summary.productivity.activeDaysRatio}%

TRENDS:
- Direction: ${summary.trends.direction}
- Growth score: ${summary.trends.growthScore}
- 6-month growth: ${summary.trends.sixMonthGrowth}%
- Year-over-year growth: ${summary.trends.yearOverYearGrowth}%

MILESTONES:
- Total milestones: ${summary.milestones.total}
- First milestone: ${summary.milestones.milestones[0]?.label ?? "None"}
- Latest milestone: ${summary.milestones.milestones[summary.milestones.milestones.length - 1]?.label ?? "None"}

SCORES:
- Developer score: ${summary.scores.developer.total}/100 (Grade: ${summary.scores.developer.grade})
- Open source score: ${summary.scores.openSource.total}/100 (Grade: ${summary.scores.openSource.grade})

INSIGHTS (${summary.insights.total} total):
Positive: ${summary.insights.positive}
Neutral: ${summary.insights.neutral}
Negative: ${summary.insights.negative}

Generate a JSON object with the following structure. Each chapter should have a compelling title, an inspiring subtitle, a 2-3 sentence story in first person, and 2-4 highlight bullet points. The tone should be motivational and personal, like a coach celebrating your year.

{
  "slides": {
    "welcome": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "summary": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "contribution": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "repository": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "language": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "habits": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "milestones": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "predictions": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "recommendations": { "title": string, "subtitle": string, "story": string, "highlights": string[] },
    "celebration": { "title": string, "subtitle": string, "story": string, "highlights": string[] }
  }
}

Return ONLY valid JSON. No markdown, no explanation.`;
}

export function generateFallbackNarrative(username: string): NarrativeData {
  const slides: Record<ChapterId, SlideContent> = {
    welcome: {
      title: `Welcome back, ${username}.`,
      subtitle: "Let's relive your developer journey this year.",
      story: "Every commit tells a story. Every repository is a chapter. This is your year in code — a celebration of the hours, the breakthroughs, and the quiet persistence that shaped your growth as a developer.",
      highlights: ["Another year of building", "Code that made a difference", "Growth through consistency"],
    },
    summary: {
      title: "Your Year in Review",
      subtitle: "The numbers that defined your journey",
      story: "This year was defined by dedication. Each contribution added to a larger picture of consistent growth and technical exploration. Let the numbers speak for themselves.",
      highlights: ["Consistent contributions across the year", "New repositories and languages explored", "Building momentum day by day"],
    },
    contribution: {
      title: "Contribution Story",
      subtitle: "When you were at your most productive",
      story: "Contributions aren't just numbers — they're the pulse of your development journey. Some months you soared, others you built steadily. Together, they paint a picture of a developer who shows up.",
      highlights: ["Most productive periods revealed", "Consistency across the week", "Growth in contribution patterns"],
    },
    repository: {
      title: "Repository Journey",
      subtitle: "The projects that defined your craft",
      story: "Each repository represents an idea brought to life. From the first line of code to the final commit, these projects showcase your range — from solo experiments to collaborative builds.",
      highlights: ["Diverse project portfolio", "Languages across repositories", "Open source contributions"],
    },
    language: {
      title: "Language Evolution",
      subtitle: "Your expanding technical toolkit",
      story: "Languages are the brushstrokes of your developer story. This year you explored new paradigms, deepened existing skills, and built a more versatile toolkit for tackling any challenge.",
      highlights: ["Primary languages and growth", "New technologies explored", "Language diversity increases"],
    },
    habits: {
      title: "Coding Habits",
      subtitle: "The rhythms behind the code",
      story: "Great code is built on great habits. Your consistency patterns reveal when you're at your best — the days and hours when your creativity flows and the problems yield to persistence.",
      highlights: ["Consistency trends revealed", "Peak productivity windows", "Weekend warrior spirit"],
    },
    milestones: {
      title: "Milestones",
      subtitle: "Moments that mattered",
      story: "Every developer journey is marked by milestones — first commits, longest streaks, achievements that seemed impossible until you reached them. These are yours to celebrate.",
      highlights: ["Key achievements unlocked", "Streaks and records set", "Growth through persistence"],
    },
    predictions: {
      title: "Looking Ahead",
      subtitle: "Where your trajectory is taking you",
      story: "Based on your patterns and growth rate, here's a glimpse into what the next year might hold. These are estimates inspired by your momentum — the future is yours to shape.",
      highlights: ["Projected growth trajectory", "Emerging skill directions", "Potential milestones ahead"],
    },
    recommendations: {
      title: "Recommendations",
      subtitle: "Ideas for your next chapter",
      story: "The best journeys have a compass. Here are some suggestions tailored to your unique developer profile — opportunities to explore, skills to deepen, and horizons to expand.",
      highlights: ["Personalized growth areas", "Technologies to explore", "Community opportunities"],
    },
    celebration: {
      title: "Here's to You.",
      subtitle: "Another year of building, learning, and growing.",
      story: "Every line of code you wrote this year moved you forward. Every challenge you faced made you stronger. This is your journey — and it's just the beginning. Here's to the next year of building.",
      highlights: ["Celebrate your achievements", "Look forward to what's next", "Keep building, keep growing"],
    },
  };

  return { slides };
}

export async function generateNarrative(summary: DeveloperSummary, username: string): Promise<NarrativeData> {
  const prompt = buildNarrativePrompt(summary, username);

  try {
    const response = await fetch("/api/wrapped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, summary, username }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate narrative");
    }

    const data = await response.json();
    return data.narrative as NarrativeData;
  } catch {
    return generateFallbackNarrative(username);
  }
}
