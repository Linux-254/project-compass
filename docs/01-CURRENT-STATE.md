# Current State — ReForge / Project Compass

> **Status: v1 · SUPERSEDED.** This document describes the **pre-implementation
> baseline** (prototype handover). All items in its "Gaps vs the ask list"
> below have since been completed in the 11-phase build. For the completed
> state, see `README.md` and `docs/03-HANDOFF.md`. The engineering guide
> (`docs/00-ENGINEERING-GUIDE.md`) remains the master spec.

> Status: v1 · Written at handover from the prototype phase. Companion doc:
> `docs/00-ENGINEERING-GUIDE.md` (the master engineering guide preserved from the
> Lovable prototype) and `docs/02-MIGRATION-STRATEGY.md`.

## 1. Two codebases, one product

### 1.1 The Lovable prototype (GitHub: `Linux-254/project-compass`)

A static marketing prototype built with **Lovable** on **TanStack Start**
(React 19, Vite, edge runtime). Commits are mirrored from the Lovable editor
project `ab37fc5a-e3b7-4494-b252-9f7bcf945ded`.

What it contains:

| Area              | Files                                                                         | Notes                                                             |
| ----------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Marketing pages   | `src/routes/{index,how-it-works,dimensions,daily-practice,stories,start}.tsx` | Static, client-only, no backend                                   |
| Site components   | `src/components/site/*`                                                       | nav, footer, hero, CTA band, reveal                               |
| Content           | `src/lib/reforge-content.ts`                                                  | partners, 4 phases, 5 life-area groups, stories, daily beats      |
| Brand assets      | `src/assets/*.jpg`                                                            | hero and journal imagery                                          |
| Engineering guide | `docs/00-ENGINEERING-GUIDE.md`                                                | role charter, ADRs, non-negotiables, 24-week plan, two-track rule |
| Lovable config    | `.lovable/plan.md`, `.lovable/project.json`                                   | template `tanstack_start_ts_current`                              |

**Value:** warm brand voice, page copy, and the engineering guide that defines
the standards this implementation follows. **Limitation:** no auth, no database,
no application logic.

### 1.2 The full-stack implementation (local `reforge-app`)

Built from the Manus `web-db-user` template (`template.json`). This is the
production-grade continuation and is **superseding** the prototype.

Stack:

- **Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/ui (Radix), wouter,
  TanStack Query, tRPC React client, recharts.
- **Backend:** Express, tRPC 11 (superjson), Drizzle ORM, JWT sessions (jose).
- **Database:** Drizzle schema + generated Postgres migration
  (`drizzle/0000_round_ted_forrester.sql`) for **PostgreSQL / Supabase**.
  The original MySQL migration was removed during Phase 1.
- **Auth:** Manus OAuth portal login with `__Host-` CSRF state cookie, one-year
  signed session cookie, `Bearer` fallback for Safari/WebView.

## 2. What exists in the implementation today

### Database schema (`drizzle/schema.ts`)

30 tables covering all 21 life dimensions and every core feature:

- **Identity & access:** `users`, `user_roles`, `profiles`, `supporter_links`
- **Program config:** `substance_focus`, `user_preferences`, `life_dimensions`
- **Assessment & tracking:** `assessments`, `assessment_responses`,
  `dimension_scores`, `check_ins`, `streaks`, `milestones`
- **User content:** `journal_entries`, `rules_boundaries`, `rule_reviews`,
  `goals`, `goal_steps`
- **Platform content:** `resources`, `activity_guides`, `music_profiles`,
  `playlists`
- **Newsletter:** `newsletter_subscriptions`, `newsletter_issues`,
  `newsletter_sends`
- **Community (Phase 2):** `community_membership`, `mentor_pairings`,
  `group_challenges`, `challenge_participants`

### Server

- `server/_core/index.ts` — Express bootstrap: JSON body, storage proxy, OAuth
  routes, `/api/trpc` middleware, Vite dev / static prod serving.
- `server/_core/sdk.ts` — OAuth + session SDK (exchange code, user info, JWT
  sign/verify, request authentication, cron identity).
- `server/_core/oauth.ts` — `/api/oauth/callback` with CSRF nonce check.
- `server/_core/trpc.ts` — `publicProcedure`, `protectedProcedure`,
  `adminProcedure`.
- `server/routers.ts` — tRPC app router: `auth`, `profile`, `onboarding`,
  `dashboard`, `checkIn`, `journal`, `goals`, `rules`, `music`, `newsletter`,
  `resources`, `preferences`, `system`.
- `server/db.ts` — data-access layer (single file, ~600 lines) with lifecycle
  helpers, dimension seeding, streaks, scoring, newsletter, music profiles.
- `server/_core/*` — heartbeat (scheduled jobs), notification, storage,
  storage proxy, LLM, image generation, map, voice transcription, data API.

### Client

- `client/src/main.tsx` — tRPC client with batch link, Bearer fallback,
  auto-login on `UNAUTHORIZED`.
- `client/src/App.tsx` — routes: `/` (Home), `/dashboard`, `/404`.
- Pages: `Home` (landing), `Dashboard`, `CheckIn`, `ComponentShowcase`,
  `NotFound`.
- Components: `DashboardLayout` (resizable sidebar + user menu),
  `DashboardLayoutSkeleton`, `AIChatBox`, `Map`, `ErrorBoundary`, 53 shadcn/ui
  primitives.

### Other

- `shared/` — constants (cookie names, OAuth state codec), shared types, errors.
- `server/auth.logout.test.ts` — Vitest unit test for session logout.
- `.gitignore`, `.prettierrc`, `components.json`, `vite.config.ts`,
  `drizzle.config.ts`, `vitest.config.ts`.

## 3. Gaps vs. the ask list

| Ask                                                           | Status in code                                      | Work remaining                                                                                                               |
| ------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Analyze repo + Lovable config, document state, migration plan | **This doc set**                                    | —                                                                                                                            |
| DB schema & migrations for 21 dimensions                      | Schema + MySQL migration exist                      | Migrate to Postgres/Supabase, regenerate migration, seed content                                                             |
| Public marketing site (warm, non-clinical)                    | Single landing page only                            | About, How-It-Works, Dimensions, Daily Practice, Success, FAQ, Supporters, Contact + newsletter capture + shared site layout |
| Auth, RBAC, security                                          | OAuth + JWT + `protectedProcedure`/`adminProcedure` | Role-gated procedures (supporter/mentor/moderator), rate limiting, CORS, helmet, ownership checks, Tier-1 encryption         |
| Conversational onboarding (21 dims)                           | Backend procedures exist                            | Substance selection → conversational UI → profile setup → scoring → completion                                               |
| App dashboard + progress tracking                             | Dashboard overview page                             | Progress/dimension charts, dimension detail, sidebar navigation to all features                                              |
| Check-ins, journal, rules & boundaries                        | Check-in page + backend                             | History, streaks/milestones, journal UI, rules CRUD + review                                                                 |
| Goal tracker, activity guides, content library                | Backend only                                        | Goal UI + steps, guide recommendation, resource library                                                                      |
| Music rehabilitation + devotional space                       | Backend only                                        | Music profile/playlists UI, devotional (faith + secular)                                                                     |
| Newsletter system                                             | Subscribe/unsubscribe backend                       | Double opt-in, preferences, archive, admin issue creation                                                                    |
| Branch workflow + push                                        | No git repo yet                                     | `feature → dev → staging → main`, push to GitHub                                                                             |
| Final summary + hand-off docs                                 | —                                                   | README, `docs/03-HANDOFF.md`                                                                                                 |

## 4. Notable defects / cleanups found

1. `server/db.ts` — `savSubstanceFocus` is a typo for `saveSubstanceFocus`
   (used consistently, so it works; renamed during Phase 1).
2. `drizzle/relations.ts` is empty — relations are implicit via `userId`/FK
   columns. Acceptable for MVP; documented.
3. `check_ins` is indexed but not unique on `(userId, localDate, part)` — a
   duplicate check-in would insert a second row. Unique constraint added in the
   Postgres migration.
4. `cookies.ts` has dead `domain` logic commented out — preserved for now,
   noted in code review.
5. `resources` filtering in `db.ts` uses `type ? eq(...) : undefined` — valid in
   Drizzle, cleaned up during module split.
6. `getLatestDimensionScores` issues one query per dimension (21 queries). Fine
   at current scale; flagged for the dashboard aggregate optimization.
