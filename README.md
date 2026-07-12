# GitVerse

> Every commit tells a story. Watch yours come alive through high-fidelity 3D visualizations, deep repository insights, and an immersive developer identity experience.

GitVerse transforms your GitHub contribution history into an explorable universe. Search any public GitHub username to generate real-time interactive visualizations — no login required for basic exploration. Sign in with GitHub for richer insights, achievements, and narrative generation.

---

## Features

### Search-First Landing

Enter any GitHub username on the landing page to instantly explore their coding universe. Suggestions appear as you type via the GitHub User Search API. Recent searches are cached locally.

### Command Center (Dashboard)

A bento-grid overview of a developer's profile: avatar, bio, stats (commits, repos, stars, followers), AI-generated insights based on activity volume, contribution activity grid (GitHub-style heatmap), top repositories sorted by recency, skills and language breakdown, and quick navigation to all visualizations.

### Contribution Landscape

A 3D Three.js terrain where each tile represents a day of contribution activity. Height and color correspond to contribution count. Built with React Three Fiber, Drei. Includes mouse-drag orbit controls, scroll-to-zoom, and a reduced-motion toggle.

### Repository Universe

An orbital 3D visualization where each repository is a planet. Planet size scales with star count; orbit distance correlates with last-updated recency. Includes a side inspector panel, language/visibility filters, search within repositories, and a bottom dock for cross-page navigation.

### Developer Analytics

Backend-computed metrics using the analytics engine (`src/features/analytics/services/`): streaks (current, longest), contribution statistics (totals, averages, distributions by weekday/month/year), language diversity and evolution over time, repository health scoring, activity heat scoring, momentum and volatility metrics, productivity and consistency scores, trend direction and growth rates, milestone detection (100th commit, 7-day streak, etc.), and composite developer and open-source scores.

### Year Wrapped

A full-screen slide-based narrative experience. Chapters: Welcome, Summary, Contributions, Repositories, Languages, Coding Habits, Milestones, Predictions, Recommendations, Celebration. Narrative can be AI-generated (OpenAI) or uses a fallback template. Slide progress bar, chapter navigator, keyboard navigation, and reduced-motion support.

### Achievements (Hall of Honor)

Gamified achievement system with unlockable badges across categories (Speed, Explorer, Quality, Social, Streak, Legacy, Collector, Insight). Rules engine in `src/features/achievements/engine/`. Shows locked/unlocked state, progress toward next achievement, and upcoming achievements.

### Export Studio

Template-based export system for generating shareable images of developer profiles. Templates: minimal, aurora, cyber, retro. Export as PNG or copy to clipboard (implementation scaffolded).

### Public Profile (`/u/[username]`)

Server-side rendered public profile page with hero, summary stats, pinned repositories, achievements preview, and link to the full wrapped experience.

---

## Architecture

### Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | Next.js 15.5 (App Router)                 |
| Language         | TypeScript 5 (strict mode)                |
| Styling          | Tailwind CSS v4 with custom design tokens |
| 3D Rendering     | React Three Fiber + Drei + Three.js       |
| State Management | Zustand v5 (with `persist` middleware)    |
| Server State     | TanStack React Query v5                   |
| Auth             | Auth.js v5 (NextAuth) with GitHub OAuth   |
| Database         | PostgreSQL via Prisma (Auth.js adapter)   |
| Animation        | Framer Motion v11                         |
| Linting          | ESLint 9 + Prettier                       |
| Testing          | Vitest (unit) + Playwright (E2E)          |

### Design System

Custom dark theme with the following tokens defined in `tailwind.config`:

- **Background**: `#050816` (deep space blue-black)
- **Primary**: `#d2bbff` (soft lavender)
- **Secondary**: `#7bd0ff` (sky cyan)
- **Tertiary**: `#c3c5da` (muted silver)
- **Surfaces**: Layered opacity system (`surface-container-low`, `surface-container`, `surface-container-high`, etc.)
- **Glassmorphism**: `bg-surface-container-low/60 backdrop-blur-xl border border-white/10`
- **Typography**: Geist (body/headings) + JetBrains Mono (labels/mono)
- **Spacing**: 4px base unit (`unit-xs`: 4px, `unit-sm`: 8px, `unit-md`: 16px, `gutter`: 24px, `unit-lg`: 32px, `unit-xl`: 64px, `unit-xxl`: 128px)

### Project Structure

```
src/
├── app/                        # Next.js App Router pages and API routes
│   ├── (auth)/login/           # Login page (search + GitHub OAuth)
│   ├── api/                    # 13 API route modules
│   │   ├── profile/search/     # GitHub user search (public)
│   │   ├── profile/[username]/ # Profile data (OAuth-optional)
│   │   ├── analytics/          # Developer analytics (OAuth-optional)
│   │   ├── wrapped/            # Wrapped data + AI narrative (OAuth required)
│   │   ├── achievements/       # Achievement evaluations (OAuth required)
│   │   ├── contributions/      # Contribution calendar (OAuth required)
│   │   ├── insights/           # AI insights (OAuth required)
│   │   ├── intelligence/       # AI intelligence endpoint
│   │   ├── milestones/         # Milestone events
│   │   ├── repositories/       # Repository data
│   │   ├── scores/             # Developer scores
│   │   ├── share/              # Shareable links
│   │   └── statistics/         # Statistics endpoint
│   ├── dashboard/              # Command Center (bento grid)
│   │   ├── analytics/          # Analytics sub-page
│   │   ├── visualization/      # Universe sub-page
│   │   └── repos/              # Repositories sub-page
│   ├── landscape/              # 3D Contribution Landscape
│   ├── wrapped/                # Year Wrapped slides
│   ├── achievements/           # Hall of Honor
│   ├── export/                 # Export Studio
│   ├── settings/               # User settings
│   ├── share/[id]/             # Shared profile view
│   └── u/[username]/           # Public profile (SSR)
├── components/
│   ├── layout/                 # AppShell, TopNav, SideNav
│   ├── shared/                 # GlassCard, StatsCard, DeveloperScore, etc.
│   ├── ui/                     # Button, Card, Skeleton, AchievementCard
│   ├── design-system/          # SceneContainer, NavigationBar
│   ├── panels/                 # LeftPanel, RightPanel
│   └── providers/              # React context providers (query, theme, session)
├── features/                   # Feature-based modules
│   ├── profile/                # Profile types, Zustand store, search bar
│   ├── analytics/              # Analytics engine, scoring, insights
│   ├── achievements/           # Achievement rules engine
│   ├── github/                 # GitHub API client, services, types
│   ├── visualization/          # 3D Landscape scene components
│   ├── repository-universe/    # 3D Universe scene components
│   ├── wrapped/                # Wrapped slides, narrative, store
│   ├── contribution-galaxy/    # Contribution galaxy visualization
│   ├── auth/                   # Auth components and hooks
│   ├── replay/                 # Replay timeline system
│   ├── export/                 # Export service
│   └── share/                  # Share service
├── lib/                        # Core utilities
│   ├── api-client.ts           # Typed fetch wrapper
│   ├── api-error.ts            # Error response helpers
│   ├── auth.ts                 # Auth.js configuration
│   ├── prisma.ts               # Prisma client singleton
│   └── utils.ts                # cn() classname merger
├── config/env.ts               # Zod environment validation
├── styles/globals.css          # Tailwind v4 theme tokens
├── middleware.ts               # Auth middleware
└── types/                      # Shared TypeScript types
```

### Data Flow

```
User searches username
        ↓
SearchBar → onNavigate → router.push(/dashboard?username=...)
        ↓
DashboardContent (useEffect on usernameParam)
        ↓
useProfileStore.fetchProfile(username)
        ↓
├── API: /api/profile/[username]  → GitHub REST API (public) or OAuth GraphQL
├── Cache check (zustand persist)
├── Store update (profile, activeUsername, recentSearches)
└── React Query re-fetches on sub-pages
        ↓
All feature components reactively consume useProfileStore(state)
```

All pages consume the same `useProfileStore()` hook. The store uses Zustand with `persist` middleware to cache profiles and recent searches across sessions. Cache TTL is 5 minutes.

### API Routes

| Route                                    | Auth Required | Description                                          |
| ---------------------------------------- | ------------- | ---------------------------------------------------- |
| `GET /api/profile/search?q=`             | No            | GitHub user search (5 results)                       |
| `GET /api/profile/[username]`            | Optional      | Full profile with repos, languages, events           |
| `GET /api/analytics?username=`           | Optional      | Developer analytics (rich with OAuth, basic without) |
| `GET /api/wrapped`                       | **Yes**       | Wrapped developer summary + AI narrative             |
| `POST /api/wrapped`                      | **Yes**       | Generate AI narrative via OpenAI                     |
| `GET /api/achievements`                  | **Yes**       | Achievement evaluations                              |
| `GET /api/contributions?username=&year=` | **Yes**       | Contribution calendar                                |
| `GET /api/repositories?username=`        | Optional      | Repository list                                      |
| `GET /api/insights`                      | **Yes**       | AI-generated insights                                |
| `GET /api/scores`                        | **Yes**       | Developer and open-source scores                     |
| `GET /api/statistics`                    | **Yes**       | Detailed contribution statistics                     |
| `GET /api/milestones`                    | **Yes**       | Milestone events                                     |
| `GET /api/share/[id]`                    | No            | Shared profile data                                  |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- GitHub OAuth App (for sign-in)
- GitHub Personal Access Token (for API calls, optional but recommended)

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:

| Variable             | Description                              |
| -------------------- | ---------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string             |
| `AUTH_SECRET`        | NextAuth secret (`openssl rand -hex 32`) |
| `AUTH_GITHUB_ID`     | GitHub OAuth App client ID               |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App client secret           |

Optional but recommended:

| Variable              | Description                                |
| --------------------- | ------------------------------------------ |
| `GITHUB_ACCESS_TOKEN` | Personal access token (avoids rate limits) |
| `NEXT_PUBLIC_APP_URL` | Public URL of the app                      |
| `NARRATIVE_API_KEY`   | OpenAI API key for wrapped narratives      |

### Install & Run

```bash
npm install
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run dev            # Start development server
```

### Scripts

| Script              | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Production build         |
| `npm run lint`      | Run ESLint               |
| `npm run lint:fix`  | Fix ESLint issues        |
| `npm run format`    | Format with Prettier     |
| `npm run typecheck` | TypeScript type checking |
| `npm run test`      | Run Vitest unit tests    |
| `npm run test:e2e`  | Run Playwright E2E tests |
| `npm run db:studio` | Open Prisma Studio       |

---

## Deployment Blockers

### 1. Auth Middleware Blocks Unauthenticated Access (CRITICAL)

The middleware (`src/middleware.ts`) redirects all non-authenticated requests away from pages like `/dashboard`, `/landscape`, `/wrapped`, and `/achievements` to `/login`. This conflicts with the app's core value proposition — **search-first, no-login-required exploration**.

**Fix needed:** Update the middleware matcher to allow public access to visualization pages while protecting only auth-gated routes (settings, share creation, narrative generation). The middleware should redirect only when an authenticated action is attempted (e.g., saving a share, generating narratives), not for browsing.

**Files:** `src/middleware.ts:4-8`

### 2. Environment Validation Blocks Startup (HIGH)

`src/config/env.ts` uses Zod validation that throws on startup if any required env var is missing:

- `DATABASE_URL` — required
- `AUTH_SECRET` — required
- `AUTH_GITHUB_ID` — required
- `AUTH_GITHUB_SECRET` — required

**Fix needed:** Make OAuth-related env vars optional for the basic public-search flow. The app should boot and serve the landing page, search, and public profile views without a database or OAuth configuration. Only features that explicitly need auth (achievements, wrapped narrative, share saving) should fail at the point of use, not at startup.

**Files:** `src/config/env.ts:3-14`

### 3. API Routes Hard-Depend on Auth Token (HIGH)

Several API routes require OAuth tokens but serve features that display on public-facing pages:

- `/api/achievements` — calls `getGitHubToken()` which throws if no token
- `/api/contributions` — same
- `/api/repositories` — requires token for authenticated path
- `/api/wrapped` — requires auth entirely

**Fix needed:** Make all API routes follow the OAuth-optional pattern used by `/api/profile/[username]` and `/api/analytics`, which gracefully fall back to public REST API data when no token is available.

**Files:** `src/app/api/achievements/route.ts`, `src/app/api/contributions/route.ts`, `src/app/api/wrapped/route.ts`

### 4. Narrative Generation Requires External API (MEDIUM)

The Wrapped narrative generation requires OpenAI API credentials. Without them, the feature uses `generateFallbackNarrative()` which produces generic templates. The API route returns a 500 error when narrative is requested but not configured.

**Fix needed:** Gracefully handle missing AI config — return fallback narrative from the API instead of throwing, so the Wrapped slides always render.

**Files:** `src/app/api/wrapped/route.ts:104-105`

---

## Design Decisions

### Search-First, Not Auth-First

The primary entry point is a public search bar, not a login wall. This follows the Stitch AI design principle: "Let users explore first, authenticate for richer features."

### Feature-Based Folders

Each feature (profile, analytics, wrapped, achievements) owns its components, hooks, services, and store. This keeps the codebase modular and prevents cross-feature coupling.

### Dual API Path (OAuth Optional)

Every API route that can work without authentication implements a dual path:

1. **With OAuth token**: Uses GitHub GraphQL API for rich data (contributions, detailed analytics)
2. **Without OAuth**: Uses GitHub REST API for public data (user info, repos, stars)

This pattern is fully implemented in `/api/profile/[username]` and `/api/analytics`, and should be replicated to other routes.

### Centralized Profile Store

All pages consume `useProfileStore()` from zustand. When a search completes, the store is populated once and all downstream pages reactively update. No duplicate fetching.

### Lazy-Loaded 3D Scenes

Heavy Three.js scenes (Landscape, Universe) are dynamically imported with `next/dynamic` and wrapped in `<Suspense>` with loading skeletons. This keeps the initial bundle small.

---

## Verification

```bash
npm run typecheck    # TypeScript check passes
npm run lint         # No ESLint warnings/errors
npm run build        # Build succeeds
npm run test         # Vitest tests pass
```
