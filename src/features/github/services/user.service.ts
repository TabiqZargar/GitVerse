/**
 * User service — retrieves the authenticated developer's GitHub profile and
 * normalizes it into a GitVerse DeveloperProfile domain model.
 *
 * Single responsibility: fetching and transforming user data.
 * Delegates raw GraphQL execution to GitHubClient.
 */

import { z } from "zod";
import type { GitHubClient } from "./github-client";
import { USER_PROFILE_QUERY } from "../queries/user";
import type { DeveloperProfile } from "../types/domain";
import { CACHE_TTL, cacheKey, githubCache } from "./cache";

const userResponseSchema = z.object({
  viewer: z.object({
    login: z.string(),
    name: z.string().nullable(),
    avatarUrl: z.string(),
    email: z.string().nullable(),
    bio: z.string().nullable(),
    company: z.string().nullable(),
    location: z.string().nullable(),
    websiteUrl: z.string().nullable(),
    twitterUsername: z.string().nullable(),
    createdAt: z.string(),
    followers: z.object({ totalCount: z.number() }),
    following: z.object({ totalCount: z.number() }),
    repositories: z.object({ totalCount: z.number() }),
    contributionsCollection: z.object({
      totalCommitContributions: z.number(),
      restrictedContributionsCount: z.number(),
    }),
  }),
});

type UserResponse = z.infer<typeof userResponseSchema>;

const DEFAULT_REPO_LIMIT = 100;

export class UserService {
  constructor(private readonly client: GitHubClient) {}

  async getProfile(username?: string): Promise<DeveloperProfile> {
    const cacheKeyStr = cacheKey("user", "profile", username ?? "viewer");
    const cached = githubCache.get<DeveloperProfile>(cacheKeyStr);
    if (cached) return cached;

    const raw = await this.client.query<UserResponse>(
      USER_PROFILE_QUERY,
      { first: DEFAULT_REPO_LIMIT },
      userResponseSchema
    );

    const profile = this.normalize(raw.viewer);
    githubCache.set(cacheKeyStr, profile, CACHE_TTL.PROFILE);
    return profile;
  }

  private normalize(raw: UserResponse["viewer"]): DeveloperProfile {
    return {
      login: raw.login,
      name: raw.name,
      avatarUrl: raw.avatarUrl,
      email: raw.email,
      bio: raw.bio,
      company: raw.company,
      location: raw.location,
      websiteUrl: raw.websiteUrl,
      twitterUsername: raw.twitterUsername,
      createdAt: raw.createdAt,
      followers: raw.followers.totalCount,
      following: raw.following.totalCount,
      totalRepos: raw.repositories.totalCount,
      totalCommits: raw.contributionsCollection.totalCommitContributions,
      restrictedContributions: raw.contributionsCollection.restrictedContributionsCount,
    };
  }
}
