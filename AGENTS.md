<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GitVerse

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Fix lint issues
- `npm run format` — Format with Prettier
- `npm run typecheck` — TypeScript type checking
- `npm run db:generate` — Generate Prisma client
- `npm run db:push` — Push schema to database
- `npm run db:migrate` — Run Prisma migrations
- `npm run db:studio` — Open Prisma Studio

## Architecture

- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — Shared UI components (shadcn/ui style)
  - `ui/` — Base primitives (Button, Card, etc.)
  - `providers/` — React context providers
  - `shared/` — Shared layout components (AppShell, ErrorBoundary, Loading)
- `src/features/` — Feature-based modules
  - `auth/` — Authentication (Auth.js + GitHub OAuth)
  - `github/` — GitHub data fetching and types
  - `analytics/` — Analytics and statistics
  - `visualization/` — 3D/R3F and React Flow components
- `src/lib/` — Core utilities (auth, prisma, api-client)
- `src/config/` — Environment variable validation (Zod)
- `src/types/` — Shared TypeScript types
- `src/styles/` — Global CSS with Tailwind v4 theme

## Key Conventions

- Strict TypeScript (`noUnusedLocals`, `noUncheckedIndexedAccess`)
- Feature-based folder structure
- All API routes require authentication via `auth()`
- shadcn/ui-style components use `cn()` utility for class merging
- React Query for server state management
- Zod for runtime validation
- Dark theme as default via `next-themes`
