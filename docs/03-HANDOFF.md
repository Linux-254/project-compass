# Handoff — Completed Build (docs/03-HANDOFF.md)

> Status: v1 · Written at the end of the 11-phase build. This document records
> the completed state, how everything was verified, and what remains for
> deployment/launch. Companion docs: `docs/00-ENGINEERING-GUIDE.md`,
> `docs/01-CURRENT-STATE.md` (pre-implementation baseline),
> `docs/02-MIGRATION-STRATEGY.md`.

## 1. What was delivered

All 11 phases completed against the engineering guide's MVP cut line (the
"Core Journey"):

| Phase | Delivery                                                                           | Commit    |
| ----- | ---------------------------------------------------------------------------------- | --------- |
| 0     | Baseline commit, `.gitattributes`, docs preserved                                  | `34735e3` |
| 1     | Postgres/Supabase migration + modular data-access layer + seed                     | `ae9672c` |
| 2     | Full marketing site (11 pages, newsletter capture, shared layout)                  | `6d032ca` |
| 3     | RBAC role procedures, helmet/CORS/rate limits, ownership checks, Tier-1 encryption | `dfb65c4` |
| 4     | Conversational 21-dimension onboarding                                             | `c54ba3a` |
| 5     | Dashboard + progress tracker (21-dim bar + history charts)                         | `2fa46ed` |
| 6     | Check-in history, streaks & milestones engine, journal, rules                      | `6c91384` |
| 7     | Goals with steps, library, music rehabilitation, daily devotional                  | `a698ec3` |
| 8     | Newsletter management (preferences, archive, admin publish)                        | `6dfee5a` |
| 9     | Settings + admin panel (role management)                                           | `6dfee5a` |
| 10    | Branch flow + push to GitHub                                                       | —         |
| 11    | This doc + README                                                                  | —         |

Tip: `git log --oneline` shows the same chain on every branch (`dev`,
`staging`, `main`, `feature/db-postgres-supabase` are all at `6dfee5a`).

## 2. How it was verified

- `pnpm check` — TypeScript clean, no errors.
- `pnpm test` — Vitest: `server/auth.logout.test.ts` passing (1 file, 1 test).
- `pnpm build` — client bundle + server bundle build cleanly
  (`dist/index.js`, ~83 KB before dedupe).
- Dev server route smoke tests (all returned HTTP 200):
  `/`, `/about`, `/how-it-works`, `/dimensions`, `/daily-practice`,
  `/success`, `/faq`, `/supporters`, `/contact`, `/privacy`, `/terms`,
  `/dashboard`, `/onboarding`, `/progress`, `/check-in`, `/check-ins`,
  `/journal`, `/rules`, `/goals`, `/guides`, `/music`, `/devotional`,
  `/newsletter`, `/settings`, `/admin`.
- Security spot checks: helmet security headers present, protected procedure
  returns `401 UNAUTHORIZED` for unauthenticated callers, `system.health`
  returns 200.
- **Caveat:** no live `DATABASE_URL` was available during this session, so
  DB-backed flows were exercised as no-op/empty paths. Run `pnpm db:push &&
pnpm db:seed` against a Supabase instance, then re-run the app to exercise
  the real data layer.

## 3. What is NOT done (post-MVP / deployment)

- **Deployment:** no live hosting configured. `main` is production-ready and
  pushes to `origin` (GitHub). Deploy the Express server + static client
  (Vite build) anywhere Node runs; env-driven config in `server/_core/env.ts`.
- **Env/secrets:** `DATABASE_URL`, OAuth (`OAUTH_*`), `JWT_SECRET`,
  `ENCRYPTION_KEY`, `CORS_ORIGINS` must be set in the target environment.
  Without `ENCRYPTION_KEY`/`JWT_SECRET`, encryption falls back to plaintext
  (local development only) — never run production without the key.
- **Community bridge (Phase 3):** `community_membership`, `mentor_pairings`,
  `group_challenges`, `challenge_participants` tables exist in the schema but
  have no UI. Out of MVP scope by design.
- **Newsletter dispatch:** issues can be created (admin) and browsed, but
  scheduled sending (cron/digest composition, send dedupe via
  `recordNewsletterSend`) is not wired to a scheduler. The sending primitives
  exist in `server/db/newsletter.ts`.
- **Content volume:** the seed provides a starter set of guides/devotionals.
  The content workstream (one per dimension) is a continuous effort.
- **GitHub branch protection:** `gh` CLI is not configured here; enable
  protected `main` (require PRs, CI) in the GitHub UI.
- **Observability:** structured logging exists; metrics/tracing/alerting
  (SLOs from the engineering guide) are not yet set up.
- **Tests:** one Vitest test file. The engineering guide's unit/integration/
  e2e matrix is largely outstanding — prioritize timezone-aware streak tests,
  authz matrix tests, and e2e for onboarding/check-in/journal/goals.

## 4. Environment reference

Key variables (see `.env.example`):

- `DATABASE_URL` — Postgres connection string (Supabase).
- `OAUTH_SERVER_URL`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` — OAuth portal.
- `JWT_SECRET` / `ENCRYPTION_KEY` — session signing + Tier-1 encryption key
  (32 bytes, base64).
- `CORS_ORIGINS` — comma-separated allowlist (empty = allow all in dev).
- `NODE_ENV` — `development` / `production`.

## 5. Where to look first

- `README.md` — stack, quick start, routes, server layout.
- `server/routers.ts` — every tRPC procedure (the API surface).
- `drizzle/schema.ts` + `drizzle/0000_round_ted_forrester.sql` — data model.
- `server/db/checkins.ts` — streak/milestone engine (pure logic to unit test).
- `client/src/App.tsx` — the full route table.
