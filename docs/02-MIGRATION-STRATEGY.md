# Migration Strategy — Prototype → Production Implementation

> How the full-stack `reforge-app` supersedes the Lovable prototype in the
> `Linux-254/project-compass` repository, without destroying history.

## 1. Summary

The prototype (TanStack Start + static pages) and the production implementation
(Express + tRPC + Drizzle + React 19) are **different codebases**. We do not
attempt to merge them file-by-file. Instead:

1. **Preserve** the valuable prototype artefacts inside the new tree
   (engineering guide, brand assets, marketing copy, Lovable config).
2. **Rebuild** the marketing pages as real routed pages in the implementation,
   using the preserved content and a warm, non-clinical voice.
3. **Supersede** `main` via the branch workflow `feature → dev → staging → main`
   (see Phase 10 of the roadmap), keeping the prototype's 22 commits in history.

## 2. Preserved artefacts

| Prototype source | New location | Purpose |
|---|---|---|
| `docs/00-ENGINEERING-GUIDE.md` | `docs/00-ENGINEERING-GUIDE.md` | Standards, ADRs, 24-week plan |
| `.lovable/plan.md`, `.lovable/project.json` | `.lovable/` | Record of the Lovable configuration |
| `src/lib/reforge-content.ts` | `client/src/lib/site-content.ts` (adapted) | Marketing copy + 21-dimension definitions |
| `src/assets/hero-dawn.jpg`, `journal-morning.jpg` | `client/public/assets/` | Brand imagery |
| `README.md` | `docs/prototype-README.md` | Historical record |
| `src/routes/*` page copy | Rebuilt as `client/src/pages/site/*` | Page copy ported into real routes |

## 3. Decision records (ADRs)

Tracked in `docs/ADRS.md`. Key decisions affecting migration:

| ADR | Decision | Deviation from TRD |
|---|---|---|
| ADR-008 | **PostgreSQL / Supabase** as the database | TRD already specified Postgres via Supabase — implementation now matches |
| ADR-009 | **React 19 kept** | TRD pinned React 18; template + prototype both ship React 19 |
| ADR-010 | **No Redis at MVP** | TRD lists Redis; in-memory rate limiter + computed snapshots used first |
| ADR-011 | **No Docker at MVP** | TRD lists Docker; single deployable via `vite build` + esbuild server bundle |

## 4. Migration ordering (expand → deploy → backfill → contract)

1. **Schema**: rewrite `drizzle/schema.ts` to `pg-core`, regenerate the Drizzle
   migration, apply against the Supabase database.
2. **Code**: swap the Drizzle driver to Postgres, update the upsert/`RETURNING`
   paths, fix the `saveSubstanceFocus` typo.
3. **Seed**: run `server/seed.ts` for the 21 dimensions and starter content.
4. **Deploy**: push through `dev → staging → main`; run migrations in the
   pipeline before code that relies on new columns.
5. **Contract**: drop legacy MySQL artefacts (old migration SQL, `mysql2`
   driver) only after the Postgres path is verified.

## 5. Environment matrix

| Env | Branch | Database | Purpose |
|---|---|---|---|
| Local | any | seeded synthetic (Supabase local/dev) | development |
| Preview | per PR / feature | ephemeral seeded | review + e2e |
| Staging | `staging` | synthetic, prod-shaped | QA, load tests, migration rehearsal |
| Production | `main` | real Supabase project | live |

## 6. Non-goals for this migration

- No file-level merge with the TanStack prototype.
- No force-push / history rewrite on the connected branches (Lovable
  requirement honoured).
- No split into separate microservices (modular monolith per ADR-001).
