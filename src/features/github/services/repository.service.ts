/**
 * Repository service — fetches the authenticated user's repositories and
 * normalizes them into GitVerse Repository domain models.
 *
 * Handles pagination internally so callers always receive the full list.
 * Each repository includes its language breakdown for the analytics layer.
 */

import { z } from "zod";
import type { GitHubClient } from "./github-client";
import { REPOSITORIES_QUERY } from "../queries/repository";
import type { LanguageUsage, Repository } from "../types/domain";
import { CACHE_TTL, cacheKey, githubCache } from "./cache";
import { EmptyDataError } from "../errors";

const languageEdgeSchema = z.object({
  size: z.number(),
  node: z.object({ name: z.string() }),
});

const repoNodeSchema = z.object({
  id: z.string(),
  databaseId: z.number().nullable(),
  name: z.string(),
  nameWithOwner: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  isPrivate: z.boolean(),
  isFork: z.boolean(),
  isArchived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  pushedAt: z.string().nullable(),
  forkCount: z.number(),
  stargazerCount: z.number(),
  openIssues: z.object({ totalCount: z.number() }),
  diskUsage: z.number().nullable(),
  primaryLanguage: z.object({ name: z.string() }).nullable(),
  languages: z.object({ edges: z.array(languageEdgeSchema).nullable() }).nullable(),
  defaultBranchRef: z.object({ name: z.string() }).nullable(),
  owner: z.object({ login: z.string() }),
});

const repositoriesResponseSchema = z.object({
  viewer: z.object({
    repositories: z.object({
      totalCount: z.number(),
      pageInfo: z.object({
        hasNextPage: z.boolean(),
        endCursor: z.string().nullable(),
      }),
      nodes: z.array(repoNodeSchema).nullable(),
    }),
  }),
});

type RepoNode = z.infer<typeof repoNodeSchema>;

const MAX_REPOS = 100;

export class RepositoryService {
  constructor(private readonly client: GitHubClient) {}

  async getRepositories(forceRefresh = false): Promise<Repository[]> {
    const cacheKeyStr = cacheKey("repos", "all");
    if (!forceRefresh) {
      const cached = githubCache.get<Repository[]>(cacheKeyStr);
      if (cached) return cached;
    }

    const repos = await this.fetchAllPages();
    const normalized = repos.map((r) => this.normalize(r));

    githubCache.set(cacheKeyStr, normalized, CACHE_TTL.REPOSITORIES);
    return normalized;
  }

  private async fetchAllPages(): Promise<RepoNode[]> {
    const allRepos: RepoNode[] = [];
    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage && allRepos.length < MAX_REPOS) {
      const result = await this.client.query<Record<string, unknown>>(
        REPOSITORIES_QUERY,
        { first: MAX_REPOS, after }
      );
      const raw = repositoriesResponseSchema.parse(result);

      const page = raw.viewer.repositories;
      const nodes = page.nodes ?? [];

      if (nodes.length === 0) break;

      allRepos.push(...nodes);
      hasNextPage = page.pageInfo.hasNextPage;
      after = page.pageInfo.endCursor;
    }

    if (allRepos.length === 0) {
      throw new EmptyDataError("repositories");
    }

    return allRepos.slice(0, MAX_REPOS);
  }

  private normalize(raw: RepoNode): Repository {
    return {
      id: raw.id,
      githubId: raw.databaseId ?? 0,
      name: raw.name,
      fullName: raw.nameWithOwner,
      description: raw.description,
      url: raw.url,
      owner: raw.owner.login,
      visibility: raw.isPrivate ? "PRIVATE" : "PUBLIC",
      primaryLanguage: raw.primaryLanguage?.name ?? null,
      languages: this.normalizeLanguages(raw.languages?.edges ?? null),
      stars: raw.stargazerCount,
      forks: raw.forkCount,
      openIssues: raw.openIssues.totalCount,
      size: raw.diskUsage ?? 0,
      isFork: raw.isFork,
      isArchived: raw.isArchived,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      pushedAt: raw.pushedAt,
      defaultBranch: raw.defaultBranchRef?.name ?? null,
    };
  }

  private normalizeLanguages(
    edges: Array<{ size: number; node: { name: string } }> | null
  ): LanguageUsage[] {
    if (!edges || edges.length === 0) return [];
    const total = edges.reduce((sum, e) => sum + e.size, 0);
    if (total === 0) return [];

    return edges
      .map((e) => ({
        name: e.node.name,
        size: e.size,
        percentage: Math.round((e.size / total) * 10000) / 100,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }
}
