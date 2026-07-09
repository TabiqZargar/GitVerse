export class GitHubError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
    this.code = code;
  }
}

export class RateLimitError extends GitHubError {
  public readonly resetAt: Date;

  constructor(resetAt: Date) {
    super("GitHub API rate limit exceeded. Try again later.", 429, "RATE_LIMITED");
    this.name = "RateLimitError";
    this.resetAt = resetAt;
  }
}

export class AuthenticationError extends GitHubError {
  constructor() {
    super("GitHub OAuth token is invalid or expired. Re-authenticate to continue.", 401, "AUTH_EXPIRED");
    this.name = "AuthenticationError";
  }
}

export class GitHubDownError extends GitHubError {
  constructor() {
    super("GitHub is experiencing downtime. Please try again later.", 503, "GITHUB_DOWN");
    this.name = "GitHubDownError";
  }
}

export class NotFoundError extends GitHubError {
  constructor(resource: string) {
    super(`GitHub resource not found: ${resource}`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class EmptyDataError extends GitHubError {
  constructor(resource: string) {
    super(`No data available for: ${resource}`, 200, "EMPTY_DATA");
    this.name = "EmptyDataError";
  }
}

export class PrivateAccountError extends GitHubError {
  constructor() {
    super("Contribution data is not available for private accounts or insufficient permissions.", 403, "PRIVATE_ACCOUNT");
    this.name = "PrivateAccountError";
  }
}

export function classifyGitHubError(status: number, body: Record<string, unknown>): GitHubError {
  if (status === 401 || status === 403) {
    const message = (body?.message as string) ?? "";
    if (message.toLowerCase().includes("rate limit")) {
      const resetAt = new Date();
      resetAt.setMinutes(resetAt.getMinutes() + 15);
      return new RateLimitError(resetAt);
    }
    if (status === 401) return new AuthenticationError();
    if (message.toLowerCase().includes("private")) return new PrivateAccountError();
    return new GitHubError(`GitHub API error: ${message || "Forbidden"}`, status, "FORBIDDEN");
  }
  if (status === 404) return new NotFoundError(body?.resource as string ?? "unknown");
  if (status >= 500) return new GitHubDownError();
  return new GitHubError(`GitHub API error: ${(body?.message as string) ?? "Unknown"}`, status, "API_ERROR");
}
