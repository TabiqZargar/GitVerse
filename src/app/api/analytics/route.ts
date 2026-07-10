import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";

export async function GET(request: NextRequest) {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);

    const { searchParams } = new URL(request.url);
    const currentDate = searchParams.get("currentDate") ?? undefined;
    const yearParam = searchParams.get("year");

    const profile = await services.user.getProfile();
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const [contributions, repos] = await Promise.all([
      services.contribution.getContributions(profile.login, year),
      services.repository.getRepositories(),
    ]);

    const days = contributions.calendar.weeks.flatMap((w) =>
      w.days.map((d) => ({
        date: d.date,
        count: d.count,
        level: d.intensity as number,
      }))
    );

    const summary = computeDeveloperSummary({
      days,
      repositories: repos,
      currentDate,
    });

    return apiSuccessResponse(summary);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
