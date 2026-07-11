import type { ProfileData } from "@/features/export/types";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export async function fetchProfileData(username: string): Promise<ProfileData | null> {
  try {
    const token = process.env.AUTH_GITHUB_TOKEN ?? "";
    if (!token) return null;

    const [userRes, allReposRes, topReposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=10&sort=stars&direction=desc`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      }),
    ]);

    if (!userRes.ok) return null;

    const userData: GitHubUser = await userRes.json();
    const topRepoList: GitHubRepo[] = (topReposRes.ok ? await topReposRes.json() : []) as GitHubRepo[];
    const allRepoList: GitHubRepo[] = (allReposRes.ok ? await allReposRes.json() : []) as GitHubRepo[];
    const events: { type: string }[] = (eventsRes.ok ? await eventsRes.json() : []) as { type: string }[];

    const contributionTypes = new Set(["PushEvent", "PullRequestEvent", "IssuesEvent", "CreateEvent", "ReleaseEvent", "CommitCommentEvent"]);
    const totalContributions = events.filter((e) => contributionTypes.has(e.type)).length;

    const topRepos = topRepoList
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
        url: r.html_url,
      }));

    const languages = new Set<string>();
    for (const repo of allRepoList) {
      if (repo.language) languages.add(repo.language);
    }

    const totalStars = allRepoList.reduce((sum, r) => sum + r.stargazers_count, 0);
    const score = Math.min(Math.round((totalContributions * 0.3 + totalStars * 0.2 + userData.followers * 0.2 + languages.size * 5 + Math.min(allRepoList.length, 50))), 100);
    const grade = score >= 90 ? "S" : score >= 75 ? "A" : score >= 55 ? "B" : score >= 35 ? "C" : score >= 15 ? "D" : "E";

    return {
      username: userData.login,
      name: userData.name ?? userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      stats: {
        totalContributions,
        totalRepos: userData.public_repos,
        totalStars,
        longestStreak: 0,
        currentStreak: 0,
        languagesCount: languages.size,
        developerScore: score,
        developerGrade: grade,
      },
      topRepos,
      achievements: { total: 0, unlocked: 0, recent: [] },
      milestones: [],
    };
  } catch {
    return null;
  }
}
