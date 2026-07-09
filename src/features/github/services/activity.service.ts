/**
 * Activity service — fetches pull requests, issues, and code reviews.
 *
 * Single responsibility: collecting the authenticated user's GitHub activity.
 * Each data type is fetched with a separate GraphQL query and normalized
 * independently so callers can request only what they need.
 */

import { z } from "zod";
import type { GitHubClient } from "./github-client";
import { PULL_REQUESTS_QUERY, ISSUES_QUERY, REVIEWS_QUERY } from "../queries/activity";
import type { PullRequest, Issue, Review, Activity } from "../types/domain";
import { CACHE_TTL, cacheKey, githubCache } from "./cache";

const prNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  state: z.enum(["OPEN", "MERGED", "CLOSED"]),
  createdAt: z.string(),
  mergedAt: z.string().nullable(),
  closedAt: z.string().nullable(),
  repository: z.object({ nameWithOwner: z.string() }),
  additions: z.number(),
  deletions: z.number(),
  changedFiles: z.number(),
});

const prResponseSchema = z.object({
  viewer: z.object({
    pullRequests: z.object({
      totalCount: z.number(),
      nodes: z.array(prNodeSchema).nullable(),
    }),
  }),
});

const issueNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  state: z.enum(["OPEN", "CLOSED"]),
  createdAt: z.string(),
  closedAt: z.string().nullable(),
  repository: z.object({ nameWithOwner: z.string() }),
  comments: z.object({ totalCount: z.number() }),
});

const issueResponseSchema = z.object({
  viewer: z.object({
    issues: z.object({
      totalCount: z.number(),
      nodes: z.array(issueNodeSchema).nullable(),
    }),
  }),
});

const reviewNodeSchema = z.object({
  id: z.string(),
  state: z.enum(["APPROVED", "CHANGES_REQUESTED", "COMMENTED", "DISMISSED", "PENDING"]),
  submittedAt: z.string(),
});

const reviewQueryItemSchema = z.object({
  repository: z.object({ nameWithOwner: z.string() }),
  reviews: z.object({
    nodes: z.array(reviewNodeSchema).nullable(),
  }),
});

const reviewResponseSchema = z.object({
  viewer: z.object({
    pullRequests: z.object({
      nodes: z.array(reviewQueryItemSchema).nullable(),
    }),
  }),
});

type PRResponse = z.infer<typeof prResponseSchema>;
type IssueResponse = z.infer<typeof issueResponseSchema>;
type ReviewResponse = z.infer<typeof reviewResponseSchema>;

const RECENT_ACTIVITY_LIMIT = 50;

export class ActivityService {
  constructor(private readonly client: GitHubClient) {}

  async getActivity(forceRefresh = false): Promise<Activity> {
    const cacheKeyStr = cacheKey("activity", "all");
    if (!forceRefresh) {
      const cached = githubCache.get<Activity>(cacheKeyStr);
      if (cached) return cached;
    }

    const [prResult, issueResult, reviewResult] = await Promise.all([
      this.client.query<PRResponse>(
        PULL_REQUESTS_QUERY,
        { first: RECENT_ACTIVITY_LIMIT },
        prResponseSchema
      ),
      this.client.query<IssueResponse>(
        ISSUES_QUERY,
        { first: RECENT_ACTIVITY_LIMIT },
        issueResponseSchema
      ),
      this.client.query<ReviewResponse>(
        REVIEWS_QUERY,
        { first: RECENT_ACTIVITY_LIMIT },
        reviewResponseSchema
      ),
    ]);

    const activity: Activity = {
      pullRequests: this.normalizePRs(prResult.viewer.pullRequests.nodes ?? []),
      issues: this.normalizeIssues(issueResult.viewer.issues.nodes ?? []),
      reviews: this.normalizeReviews(reviewResult.viewer.pullRequests.nodes ?? []),
      totalPRs: prResult.viewer.pullRequests.totalCount,
      totalIssues: issueResult.viewer.issues.totalCount,
      totalReviews: 0,
    };

    activity.totalReviews = activity.reviews.length;

    githubCache.set(cacheKeyStr, activity, CACHE_TTL.ACTIVITY);
    return activity;
  }

  private normalizePRs(nodes: PRResponse["viewer"]["pullRequests"]["nodes"]): PullRequest[] {
    return (nodes ?? []).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      state: n.state,
      createdAt: n.createdAt,
      mergedAt: n.mergedAt,
      closedAt: n.closedAt,
      repository: n.repository.nameWithOwner,
      additions: n.additions,
      deletions: n.deletions,
      changedFiles: n.changedFiles,
    }));
  }

  private normalizeIssues(nodes: IssueResponse["viewer"]["issues"]["nodes"]): Issue[] {
    return (nodes ?? []).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      state: n.state,
      createdAt: n.createdAt,
      closedAt: n.closedAt,
      repository: n.repository.nameWithOwner,
      comments: n.comments.totalCount,
    }));
  }

  private normalizeReviews(nodes: ReviewResponse["viewer"]["pullRequests"]["nodes"]): Review[] {
    const allReviews: Review[] = [];
    for (const pr of nodes ?? []) {
      for (const review of pr.reviews.nodes ?? []) {
        allReviews.push({
          id: review.id,
          state: review.state,
          submittedAt: review.submittedAt,
          repository: pr.repository.nameWithOwner,
        });
      }
    }
    return allReviews;
  }
}
