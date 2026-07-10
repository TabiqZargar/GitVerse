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

    const [userRes, , reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=10&sort=stars&direction=desc`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      }),
    ]);

    if (!userRes.ok) return null;

    const userData: GitHubUser = await userRes.json();
    const reposData: GitHubRepo[] = (reposRes.ok ? await reposRes.json() : []) as GitHubRepo[];

    const topRepos = reposData
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
    for (const repo of reposData) {
      if (repo.language) languages.add(repo.language);
    }

    return {
      username: userData.login,
      name: userData.name ?? userData.login,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      stats: {
        totalContributions: userData.public_repos * 50 + userData.followers * 10,
        totalRepos: userData.public_repos,
        totalStars: reposData.reduce((sum, r) => sum + r.stargazers_count, 0),
        longestStreak: 0,
        currentStreak: 0,
        languagesCount: languages.size,
        developerScore: 0,
        developerGrade: "N/A",
      },
      topRepos,
      achievements: { total: 0, unlocked: 0, recent: [] },
      milestones: [],
    };
  } catch {
    return null;
  }
}
