# Architecture Decision Records — ReForge / Project Compass

Format: **Context → Decision → Consequences → Trade-off accepted**.
ADRs 001–007 are defined in `docs/00-ENGINEERING-GUIDE.md` (preserved from the
prototype). ADRs 008+ extend them for the production implementation.

---

## ADR-008 — PostgreSQL (Supabase) as the database

- **Context:** The implementation template shipped a Drizzle schema in the MySQL
  dialect with a generated MySQL migration. The TRD (and the product decision)
  specify PostgreSQL via Supabase.
- **Decision:** Rewrite `drizzle/schema.ts` using `drizzle-orm/pg-core`, swap the
  driver from `mysql2` to `postgres` (postgres-js), update
  `drizzle.config.ts` to the `postgresql` dialect, and regenerate the migration.
- **Consequences:** One engine aligned with Supabase's managed Postgres; JSONB
  columns for flexible payloads; `onConflictDoUpdate` for idempotent upserts.
- **Trade-off accepted:** Schema is no longer portable to MySQL; the old MySQL
  migration is archived in history only.

## ADR-009 — React 19 kept

- **Context:** TRD pins React 18 ("not 19"). The Manus template ships React 19.2
  and the Lovable prototype also runs React 19 via TanStack Start.
- **Decision:** Keep React 19.
- **Consequences:** React 19-specific behaviour (concurrent features, new hooks)
  is available; shadcn/Radix dependencies already target it.
- **Trade-off accepted:** Documented deviation from the TRD's React 18 pin.

## ADR-010 — No Redis at MVP

- **Context:** TRD lists Redis for caching and distributed rate limiting.
- **Decision:** Use an in-memory sliding-window rate limiter and computed
  dashboard snapshots at MVP. Redis is reintroduced only if measured load needs
  it (the rate limiter is behind a small interface to allow that swap).
- **Trade-off accepted:** Rate limits are per-process, not distributed — correct
  for a single-instance deploy.

## ADR-011 — No Docker at MVP

- **Context:** TRD lists Docker + CI/CD containers.
- **Decision:** The production build is a single output (`dist/`) from
  `vite build` + esbuild bundling of the server; deployment is a plain Node
  process (Supabase/Azure-friendly). Dockerfiles are added when a container
  target is adopted.
- **Trade-off accepted:** No container portability until the platform target is
  fixed.

## ADR-012 — Tier-1 data encryption at rest (server-side)

- **Context:** Journal bodies, assessment answers, and check-in free text are
  classified Tier-1 sensitive.
- **Decision:** Encrypt these fields with AES-256-GCM before writing to the
  database, using a key derived from `ENCRYPTION_KEY` (or `JWT_SECRET` when
  unset). Decryption happens only in the server data-access layer for the
  authenticated owner.
- **Consequences:** Rows in `journal_entries` etc. are ciphertext; owner-only
  reads remain the only read path.
- **Trade-off accepted:** Adds a small server-side crypto dependency; recovery
  requires the same secret (documented in the handoff).

## ADR-013 — Role-gated tRPC procedures

- **Context:** RBAC roles (`user`, `supporter`, `mentor`, `moderator`, `admin`)
  live in a dedicated `user_roles` table.
- **Decision:** The tRPC context loads the authenticated user's roles; a
  `roleProcedure(...roles)` factory gates procedures per role, layered over
  existing `protectedProcedure` ownership checks.
- **Trade-off accepted:** One extra role query per authenticated request.

## ADR-014 — Ownership checks on every user-scoped procedure

- **Context:** Cross-tenant access via guessed IDs is the top authz risk.
- **Decision:** Every procedure that accepts an entity id
  (`goalId`, `ruleId`, `assessmentId`, `journalId`, ...) verifies the record
  belongs to `ctx.user.id` before mutating.
- **Trade-off accepted:** Slightly more verbose resolvers; safe by default.
