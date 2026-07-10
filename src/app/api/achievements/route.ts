import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";
import { evaluateAchievements } from "@/features/achievements/engine/achievement-engine";
import { getActiveMilestoneEvents } from "@/features/achievements/engine/milestone-engine";
import { getUpcomingAchievements } from "@/features/achievements/engine/progress-tracker";
import { ACHIEVEMENT_DEFINITIONS } from "@/features/achievements/engine/achievement-rules";

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
    const previousUnlocks = new Map();
    const { evaluations } = evaluateAchievements(summary, previousUnlocks);

    const progressList = ACHIEVEMENT_DEFINITIONS.map((a) => {
      const ev = evaluations.get(a.id);
      return {
        achievementId: a.id,
        definition: { id: a.id, name: a.name, description: a.description, category: a.category, rarity: a.rarity, icon: a.icon, hidden: a.hidden },
        unlocked: ev?.unlocked ?? false,
        progress: ev?.progress ?? 0,
        progressLabel: ev?.progressLabel,
      };
    });

    const unlocked = progressList.filter((p) => p.unlocked);
    const milestones = getActiveMilestoneEvents(summary);
    const upcoming = getUpcomingAchievements(summary, new Set(unlocked.map((u) => u.achievementId)), 6);

    return apiSuccessResponse({
      total: ACHIEVEMENT_DEFINITIONS.length,
      unlocked: unlocked.length,
      completion: ACHIEVEMENT_DEFINITIONS.length > 0
        ? Math.round((unlocked.length / ACHIEVEMENT_DEFINITIONS.length) * 100)
        : 0,
      progress: progressList,
      milestones,
      upcoming: upcoming.map((u) => ({
        id: u.achievement.id,
        name: u.achievement.name,
        description: u.achievement.description,
        category: u.achievement.category,
        rarity: u.achievement.rarity,
        icon: u.achievement.icon,
        progress: u.progress,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
