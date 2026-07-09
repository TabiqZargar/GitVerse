/**
 * Service registry — factory functions for creating service instances.
 *
 * Architecture decision: services are instantiated per-request with a fresh
 * GitHubClient. This ensures the correct OAuth token is always used and
 * avoids stale state between requests.
 *
 * The registry pattern makes it trivial to swap implementations or add
 * middleware (logging, metrics, etc.) later.
 */

import { createGitHubClient, type GitHubClient } from "./github-client";
import { UserService } from "./user.service";
import { RepositoryService } from "./repository.service";
import { ContributionService } from "./contribution.service";
import { LanguageService } from "./language.service";
import { ActivityService } from "./activity.service";

export interface Services {
  client: GitHubClient;
  user: UserService;
  repository: RepositoryService;
  contribution: ContributionService;
  language: LanguageService;
  activity: ActivityService;
}

export function createServices(token: string): Services {
  const client = createGitHubClient(token);
  const user = new UserService(client);
  const repository = new RepositoryService(client);
  const contribution = new ContributionService(client);
  const language = new LanguageService(repository);
  const activity = new ActivityService(client);

  return { client, user, repository, contribution, language, activity };
}

export { UserService } from "./user.service";
export { RepositoryService } from "./repository.service";
export { ContributionService } from "./contribution.service";
export { LanguageService } from "./language.service";
export { ActivityService } from "./activity.service";
export { createGitHubClient, GitHubClient } from "./github-client";
export { ServerCache, githubCache, CACHE_TTL, cacheKey } from "./cache";
export { getGitHubToken, getAuthenticatedUser } from "./token";
