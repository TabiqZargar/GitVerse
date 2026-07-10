import { NextRequest } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";

async function computeData(request: NextRequest) {
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

  return computeDeveloperSummary({ days, repositories: repos, currentDate });
}

export async function GET(request: NextRequest) {
  try {
    const summary = await computeData(request);
    return apiSuccessResponse(summary.insights);
  } catch (error) {
    return apiErrorResponse(error);
  }
}
