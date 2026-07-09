/**
 * Reusable GitHub GraphQL client.
 *
 * This client is the single point of contact with the GitHub API.
 * Every service in this directory uses it internally.
 *
 * Design rationale:
 * - Centralizes authentication, retry logic, and rate-limit handling
 * - Typed responses via a generic `query<T>` method
 * - Server-only; never expose the token or client to the client bundle
 * - Uses the GitHub v4 GraphQL API for efficient, nested data fetching
 */

import { z } from "zod";
import { classifyGitHubError, GitHubError, RateLimitError } from "../errors";

export interface GraphQLResponse<T> {
  data: T | null;
  errors?: Array<{ message: string; type?: string; path?: string[] }>;
}

interface RateLimitInfo {
  resources: {
    core: { limit: number; remaining: number; reset: number; used: number };
    graphql: { limit: number; remaining: number; reset: number; used: number };
  };
}

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = 1000;

export class GitHubClient {
  private readonly token: string;
  private lastRateLimit: RateLimitInfo | null = null;

  constructor(token: string) {
    this.token = token;
  }

  get rateLimit(): RateLimitInfo | null {
    return this.lastRateLimit;
  }

  async query<T>(
    query: string,
    variables?: Record<string, unknown>,
    schema?: z.ZodType<T>
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          const backoff = RETRY_BACKOFF_MS * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, backoff));
        }

        if (this.lastRateLimit) {
          const graphqlLimit = this.lastRateLimit.resources.graphql;
          if (graphqlLimit.remaining <= 1) {
            const resetDate = new Date(graphqlLimit.reset * 1000);
            const waitMs = Math.max(0, resetDate.getTime() - Date.now()) + 1000;
            await new Promise((resolve) => setTimeout(resolve, waitMs));
          }
        }

        const result = await this.executeQuery<T>(query, variables);

        if (schema) {
          return schema.parse(result);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (error instanceof RateLimitError) {
          const waitMs = Math.max(0, error.resetAt.getTime() - Date.now()) + 1000;
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          continue;
        }

        if (error instanceof GitHubError && error.status < 500) {
          throw error;
        }
      }
    }

    throw lastError ?? new Error("GitHub GraphQL request failed after retries");
  }

  private async executeQuery<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v4.idl",
      },
      body: JSON.stringify({ query, variables }),
    });

    this.updateRateLimit(response);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw classifyGitHubError(response.status, body);
    }

    const json = (await response.json()) as GraphQLResponse<T>;

    if (json.errors && json.errors.length > 0) {
      const messages = json.errors.map((e) => e.message).join("; ");
      const hasRateLimit = json.errors.some(
        (e) =>
          e.message.toLowerCase().includes("rate limit") ||
          e.type === "RATE_LIMITED"
      );
      if (hasRateLimit) {
        const resetAt = new Date();
        resetAt.setMinutes(resetAt.getMinutes() + 15);
        throw new RateLimitError(resetAt);
      }
      throw new GitHubError(
        `GraphQL error: ${messages}`,
        422,
        "GRAPHQL_ERROR"
      );
    }

    if (json.data === null || json.data === undefined) {
      throw new GitHubError(
        "GraphQL returned null data — the query may be invalid.",
        422,
        "NULL_DATA"
      );
    }

    return json.data;
  }

  private updateRateLimit(response: Response): void {
    try {
      const remaining = response.headers.get("x-ratelimit-remaining");
      const limit = response.headers.get("x-ratelimit-limit");
      const reset = response.headers.get("x-ratelimit-reset");
      const used = response.headers.get("x-ratelimit-used");

      if (remaining && limit && reset && used) {
        this.lastRateLimit = {
          resources: {
            core: {
              remaining: parseInt(remaining, 10),
              limit: parseInt(limit, 10),
              reset: parseInt(reset, 10),
              used: parseInt(used, 10),
            },
            graphql: {
              remaining: parseInt(remaining, 10),
              limit: parseInt(limit, 10),
              reset: parseInt(reset, 10),
              used: parseInt(used, 10),
            },
          },
        };
      }
    } catch {
      // Silently ignore header parsing errors; rate-limit info is best-effort
    }
  }
}

export function createGitHubClient(token: string): GitHubClient {
  return new GitHubClient(token);
}
