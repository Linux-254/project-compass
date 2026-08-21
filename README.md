# ReForge (Project Compass)

A web-based sober-lifestyle platform guiding people through a structured
**3-to-6-month** journey from substance dependence back into productive,
community-integrated life. Standalone digital companion first, community
bridge second. Not therapy, not a medical tool.

This repository is the **full-stack production build** that supersedes the
static Lovable prototype. See `docs/00-ENGINEERING-GUIDE.md` for the master
engineering guide, `docs/01-CURRENT-STATE.md` for the original state doc, and
`docs/03-HANDOFF.md` for the completed-state handoff.

## Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS v4, shadcn/ui (Radix), wouter,
  TanStack Query, tRPC React client, recharts
- **Backend:** Express, tRPC 11 (superjson), Drizzle ORM, JWT sessions (jose),
  helmet, cors, express-rate-limit
- **Database:** PostgreSQL via Supabase (`postgres-js` driver), Drizzle schema
  with generated migrations
- **Auth:** OAuth portal login with CSRF state cookie, signed session cookie,
  `Bearer` fallback
- **Security:** RBAC role procedures (`roleProcedure`/`adminProcedure`),
  per-record ownership checks, Tier-1 field-level encryption (AES-256-GCM) for
  journal/assessment/check-in free text, rate limiting, CORS allowlist

## Quick start

```bash
pnpm install
cp .env.example .env        # set DATABASE_URL + OAuth/JWT secrets
pnpm db:push                # generate + apply migrations (or pnpm db:migrate)
pnpm db:seed                # seed 21 life dimensions + starter content
pnpm dev                    # tsx watch on server/_core/index.ts
```

- `pnpm check` — TypeScript typecheck
- `pnpm test` — Vitest unit tests
- `pnpm build` — Vite (client) + esbuild (server) production bundle
- `pnpm start` — run the production build

## Feature surface

**Public site** (`client/src/pages/site/`): Home, About, How It Works,
Dimensions, Daily Practice, Success, FAQ, Supporters, Contact, Privacy, Terms,
newsletter signup — warm stone/amber theme, shared `SiteLayout`.

**App** (`client/src/pages/`):

| Route         | Purpose                                                                        |
| ------------- | ------------------------------------------------------------------------------ |
| `/dashboard`  | Welcome, streak cards, today's check-ins, 21-dimension progress, quick actions |
| `/onboarding` | Conversational onboarding: substance → profile → 21 dimension scores           |
| `/progress`   | Bar chart of all dimensions + per-dimension history line chart                 |
| `/check-in`   | Morning/evening daily reflection (mood, energy, cravings, notes)               |
| `/check-ins`  | History, current/longest streak, milestone badges (7/14/30/60/90/180)          |
| `/journal`    | Encrypted private journal entries (create/delete, paginated)                   |
| `/rules`      | Rules & boundaries (add, toggle active, cadence, remove)                       |
| `/goals`      | 30/90/180-day goals with actionable steps (toggle, complete, delete)           |
| `/guides`     | Library: activities, situations, relationships, devotionals, articles          |
| `/music`      | Trigger/safe genre map + saved safe playlists                                  |
| `/devotional` | Daily devotional (deterministic rotation)                                      |
| `/newsletter` | Subscribe/unsubscribe, content preferences, past editions                      |
| `/settings`   | Profile, notification toggles, account                                         |
| `/admin`      | RBAC role management + newsletter issue publishing (admin only)                |

## Server layout

- `server/_core/` — Express bootstrap, OAuth/session SDK, tRPC
  `publicProcedure`/`protectedProcedure`/`roleProcedure`/`adminProcedure`,
  context (loads `userRoles`), helmet/CORS/rate-limit middleware
- `server/db/` — modular Postgres data-access layer (`client`, `users`,
  `profiles`, `dimensions`, `assessment`, `checkins`, `journal`, `goals`,
  `rules`, `scores`, `music`, `newsletter`, `preferences`, `resources`)
- `server/lib/encryption.ts` — AES-256-GCM Tier-1 encryption (`enc:v1:` prefix)
- `server/routers.ts` — tRPC app router for every feature area
- `server/seed.ts` + `server/seed-content.ts` — dimension + content seeding

## Branches

`feature/db-postgres-supabase` (all work) → `dev` → `staging` → `main`.
`main` is the production-ready branch; GitHub remote:
`https://github.com/Linux-254/project-compass.git`.
