import { NextRequest, NextResponse } from "next/server";
import { createServices, getGitHubToken } from "@/features/github/services";
import { auth } from "@/lib/auth";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { computeDeveloperSummary } from "@/features/analytics/services/summary.service";

export async function GET(request: NextRequest) {
  try {
    const token = await getGitHubToken();
    const services = createServices(token);

    const { searchParams } = new URL(request.url);
    const currentDate = searchParams.get("currentDate") ?? undefined;

    const profile = await services.user.getProfile();
    const year = currentDate
      ? new Date(currentDate).getFullYear()
      : new Date().getFullYear();

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

    return apiSuccessResponse({ summary, username: profile.login });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return apiErrorResponse(new Error("Not authenticated"));
    }

    const body = await request.json();
    const { prompt } = body as { prompt?: string };

    if (!prompt) {
      return NextResponse.json(
        { error: { code: "MISSING_PROMPT", message: "Prompt is required" } },
        { status: 400 }
      );
    }

    const NARRATIVE_API_URL = process.env.NARRATIVE_API_URL;
    const NARRATIVE_API_KEY = process.env.NARRATIVE_API_KEY;

    if (NARRATIVE_API_URL && NARRATIVE_API_KEY) {
      const response = await fetch(NARRATIVE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${NARRATIVE_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.NARRATIVE_MODEL ?? "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a narrative generator for a developer year-in-review. Return ONLY valid JSON. No markdown, no explanations.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API returned ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content ?? data.content;

      let narrative;
      try {
        narrative = typeof content === "string" ? JSON.parse(content) : content;
      } catch {
        throw new Error("Failed to parse LLM response as JSON");
      }

      return NextResponse.json({ narrative });
    }

    return NextResponse.json(
      { narrative: null },
      { status: 503, statusText: "Narrative generation not configured" }
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
