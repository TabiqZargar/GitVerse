import { NextRequest, NextResponse } from "next/server";
import { apiSuccessResponse, apiErrorResponse } from "@/lib/api-error";
import { getGitHubToken } from "@/features/github/services/token";
import { createServices } from "@/features/github/services";
import type { ProfileData, ProfileRepo, ProfileContributionDay } from "@/features/profile/types";
import type { Repository } from "@/features/github/types/domain";

const GITHUB_API = "https://api.github.com";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    let token: string | null = null;
    try {
      token = await getGitHubToken();
    } catch {
      // OAuth optional
    }

    if (token) {
      return apiSuccessResponse(await fetchAuthedProfile(token, username));
    }

    const data = await fetchPublicProfile(username);
    if (!data) {
      return NextResponse.json(
        { code: "NOT_FOUND", message: "User not found", status: 404 },
        { status: 404 }
      );
    }
    return apiSuccessResponse(data);
  } catch (error) {
    return apiErrorResponse(error);
  }
}

async function fetchAuthedProfile(token: string, username: string): Promise<ProfileData> {
  const services = createServices(token);

  const profile = await services.user.getProfile();
  const usernameTarget = username ?? profile.login;
  const isViewer = usernameTarget.toLowerCase() === profile.login.toLowerCase();

  const repos = await services.repository.getRepositories();
  const languageBreakdown = await services.language.getLanguageBreakdown();
  const activity = await services.activity.getActivity();

  let contributions: ProfileContributionDay[] = [];
  let contributionYears: number[] = [new Date().getFullYear()];

  if (isViewer) {
    try {
      const contribs = await services.contribution.getContributions(usernameTarget);
      contributions = contribs.calendar.weeks.flatMap((w) =>
        w.days.map((d) => ({
          date: d.date,
          count: d.count,
          level: d.intensity,
        }))
      );
      contributionYears = contribs.calendar.weeks.length > 0
        ? [...new Set(contribs.calendar.weeks.flatMap((w) => w.days.map((d) => new Date(d.date).getFullYear())))]
        : [new Date().getFullYear()];
    } catch {
      // contributions not available
    }
  }

  const langMap = new Map<string, number>();
  for (const lang of languageBreakdown.languages) langMap.set(lang.name, lang.size);
  const totalSize = [...langMap.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...langMap.entries()]
    .map(([name, size]) => ({
      name,
      percentage: (size / totalSize) * 100,
      color: null as string | null,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const mappedRepos: ProfileRepo[] = repos.map((r: Repository) => ({
    name: r.name,
    fullName: r.fullName,
    description: r.description,
    url: r.url,
    stars: r.stars,
    forks: r.forks,
    language: r.primaryLanguage,
    topics: [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    isFork: r.isFork,
    isArchived: r.isArchived,
  }));

  const header = isViewer ? profile : await services.user.getProfile();

  return {
    username: header.login,
    name: header.name ?? header.login,
    avatarUrl: header.avatarUrl,
    bio: header.bio,
    location: header.location,
    company: header.company,
    website: header.websiteUrl,
    twitterUsername: header.twitterUsername,
    createdAt: header.createdAt,
    followers: header.followers,
    following: header.following,
    publicRepos: header.totalRepos,
    totalStars: repos.reduce((s: number, r: Repository) => s + r.stars, 0),
    totalCommits: header.totalCommits,
    repositories: mappedRepos,
    pinnedRepositories: [...mappedRepos].sort((a, b) => b.stars - a.stars).slice(0, 6),
    languages,
    organizations: [],
    contributions,
    contributionYears,
    events: [],
    recentActivity: [
      ...activity.pullRequests.map((pr) => ({
        type: "PullRequestEvent",
        repo: pr.repository,
        repoUrl: `https://github.com/${pr.repository}`,
        createdAt: pr.createdAt,
        payload: { action: pr.state === "MERGED" ? "merged" : "opened" },
      })),
      ...activity.issues.map((iss) => ({
        type: "IssuesEvent",
        repo: iss.repository,
        repoUrl: `https://github.com/${iss.repository}`,
        createdAt: iss.createdAt,
        payload: { action: iss.state === "CLOSED" ? "closed" : "opened" },
      })),
    ].slice(0, 50),
  };
}

async function fetchPublicProfile(username: string): Promise<ProfileData | null> {
  try {
    const userRes = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 60 },
    });
    if (!userRes.ok) return null;
    const user = await userRes.json();

    const [reposRes, eventsRes] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 60 },
      }),
      fetch(`${GITHUB_API}/users/${username}/events?per_page=100`, {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 60 },
      }),
    ]);

    const rawRepos = reposRes.ok ? await reposRes.json() : [];
    const repos: ProfileRepo[] = rawRepos.map((r: {
      name: string; full_name: string; description: string | null; html_url: string;
      stargazers_count: number; forks_count: number; language: string | null;
      topics: string[]; created_at: string; updated_at: string; fork: boolean; archived: boolean;
    }) => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      isFork: r.fork,
      isArchived: r.archived,
    }));

    const totalStars = repos.reduce((s, r) => s + r.stars, 0);

    const langMap = new Map<string, number>();
    for (const r of repos) {
      if (r.language) langMap.set(r.language, (langMap.get(r.language) ?? 0) + 1);
    }
    const totalLang = [...langMap.values()].reduce((a, b) => a + b, 0) || 1;
    const languages = [...langMap.entries()]
      .map(([name, count]) => ({ name, percentage: (count / totalLang) * 100, color: null }))
      .sort((a, b) => b.percentage - a.percentage);

    const rawEvents = eventsRes.ok ? await eventsRes.json() : [];
    const recentActivity = (rawEvents as { type: string; repo: { name: string }; created_at: string }[])
      .slice(0, 50).map((e) => ({
        type: e.type,
        repo: e.repo.name,
        repoUrl: `https://github.com/${e.repo.name}`,
        createdAt: e.created_at,
        payload: {},
      }));

    return {
      username: user.login,
      name: user.name ?? user.login,
      avatarUrl: user.avatar_url,
      bio: user.bio,
      location: user.location,
      company: user.company,
      website: user.blog,
      twitterUsername: user.twitter_username,
      createdAt: user.created_at,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      totalCommits: 0,
      repositories: repos,
      pinnedRepositories: [...repos].sort((a, b) => b.stars - a.stars).slice(0, 6),
      languages,
      organizations: [],
      contributions: [],
      contributionYears: [new Date().getFullYear()],
      events: rawEvents ?? [],
      recentActivity,
    };
  } catch {
    return null;
  }
}
