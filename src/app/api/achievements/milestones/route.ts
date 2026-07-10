import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";
import { getActiveMilestoneEvents } from "@/features/achievements/engine/milestone-engine";

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
    const milestones = getActiveMilestoneEvents(summary);

    return apiSuccessResponse({ milestones, total: milestones.length });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
