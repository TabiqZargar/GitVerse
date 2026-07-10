import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";
import { getUpcomingAchievements } from "@/features/achievements/engine/progress-tracker";

export async function GET() {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);

    const profile = await services.user.getProfile();

    const [contributions, repos] = await Promise.all([
      services.contribution.getContributions(profile.login, new Date().getFullYear()),
      services.repository.getRepositories(),
    ]);

    const days = contributions.calendar.weeks.flatMap((w) =>
      w.days.map((d) => ({
        date: d.date,
        count: d.count,
        level: d.intensity as number,
      }))
    );

    const summary = computeDeveloperSummary({ days, repositories: repos });
    const allUnlocked = new Set<string>();
    const upcoming = getUpcomingAchievements(summary, allUnlocked, 6);

    return apiSuccessResponse(upcoming.map((u) => ({
      achievementId: u.achievement.id,
      name: u.achievement.name,
      description: u.achievement.description,
      category: u.achievement.category,
      rarity: u.achievement.rarity,
      icon: u.achievement.icon,
      progress: u.progress,
      progressPercent: Math.round(u.progress * 100),
    })));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
