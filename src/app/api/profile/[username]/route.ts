import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";
import { evaluateAchievements } from "@/features/achievements/engine/achievement-engine";
import { ACHIEVEMENT_DEFINITIONS } from "@/features/achievements/engine/achievement-rules";
import { getActiveMilestoneEvents } from "@/features/achievements/engine/milestone-engine";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const token = await getGitHubToken();
    const services = createServices(token);

    const [profile, repos] = await Promise.all([
      services.user.getProfile(),
      services.repository.getRepositories(),
    ]);

    const contributions = await services.contribution.getContributions(username, new Date().getFullYear());

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
    const unlockedIds = new Set<string>();
    for (const [id, ev] of evaluations) {
      if (ev.unlocked) unlockedIds.add(id);
    }

    const unlockedAchievements = ACHIEVEMENT_DEFINITIONS
      .filter((a) => unlockedIds.has(a.id))
      .slice(0, 6)
      .map((a) => ({ id: a.id, name: a.name, rarity: a.rarity, icon: a.icon }));

    const milestones = getActiveMilestoneEvents(summary).slice(0, 8);

    const topRepos = repos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stars,
        language: r.primaryLanguage,
        url: r.url,
      }));

    return apiSuccessResponse({
      username: profile.login,
      name: profile.name ?? profile.login,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      stats: {
        totalContributions: summary.statistics.totalContributions,
        totalRepos: repos.length,
        totalStars: repos.reduce((s, r) => s + r.stars, 0),
        longestStreak: summary.streaks.longestStreak,
        currentStreak: summary.streaks.currentStreak,
        languagesCount: summary.language.diversity,
        developerScore: summary.scores.developer.total,
        developerGrade: summary.scores.developer.grade,
      },
      topRepos,
      achievements: {
        total: ACHIEVEMENT_DEFINITIONS.length,
        unlocked: unlockedIds.size,
        recent: unlockedAchievements,
      },
      milestones: milestones.map((m) => ({
        id: m.id,
        label: m.label,
        date: m.date,
      })),
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
