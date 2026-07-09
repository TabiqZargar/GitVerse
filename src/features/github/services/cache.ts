/**
 * Server-side in-memory cache for GitHub API responses.
 *
 * Architecture decision: in-memory Map is the initial implementation because:
 * 1. Zero infrastructure — works immediately in any Node.js environment
 * 2. Fastest possible reads for repeated requests within a server process
 * 3. Natural TTL expiration avoids stale data
 *
 * Designed for drop-in replacement with Redis later. The public API
 * (get/set/invalidate) mirrors what a Redis client would provide.
 *
 * TTLs are chosen based on data volatility:
 *   - Profile data: 5 min (rarely changes within a session)
 *   - Repository list: 5 min (infrequent changes)
 *   - Contribution calendar: 10 min (only updates on push)
 *   - Languages: 30 min (very stable)
 *   - Activity (PRs/issues): 2 min (more dynamic)
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export class ServerCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private hits = 0;
  private misses = 0;

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  invalidateByPattern(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) {
        this.store.delete(key);
      }
    }
  }

  clear(): void {
    this.store.clear();
  }

  get stats() {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0
        ? this.hits / (this.hits + this.misses)
        : 0,
    };
  }
}

export const githubCache = new ServerCache();

export const CACHE_TTL = {
  PROFILE: 5 * 60 * 1000,
  REPOSITORIES: 5 * 60 * 1000,
  CONTRIBUTIONS: 10 * 60 * 1000,
  LANGUAGES: 30 * 60 * 1000,
  ACTIVITY: 2 * 60 * 1000,
} as const;

export function cacheKey(...parts: string[]): string {
  return parts.join(":");
}
