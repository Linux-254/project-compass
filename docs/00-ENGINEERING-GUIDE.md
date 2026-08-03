# ReForge — Master Engineering Guide

> Status: master guide (v1). This is the single source of truth for **who builds ReForge, to what standard, in what order**.
> The document suite (PRD, TRD, App Flow, UI/UX, Database Schema, Backend, Mobile UI/UX, Cloud & Deployment) is **not** written yet — section 9 defines how each one gets produced.

---

## 1. Role Charter

### Primary role: Senior Full-Stack Product Engineer / Technical Lead (health-adjacent SaaS)

| Attribute | Requirement |
|---|---|
| Seniority | Senior / Lead |
| Total experience | 7–10 years professional software engineering |
| Leading delivery end-to-end | 4+ years (discovery → architecture → ship → operate) |
| Security-focused delivery | 3+ years OWASP-aligned auth & authorization |
| DevOps / platform | 3+ years Docker, CI/CD, migrations, observability, cloud deploys |
| Domain fit | Consumer wellbeing / health-adjacent products handling sensitive personal data |

### Background & skills

**Frontend**
- HTML5, CSS3, JavaScript (ES6+), TypeScript-first discipline.
- React 18 (pinned — **not** React 19 per TRD), component architecture, design systems.
- Mobile-first responsive layout, accessibility (WCAG 2.1 AA), animation restraint.
- Loading states and skeleton states treated as first-class UI, never an afterthought.

**Backend**
- Node.js LTS, TypeScript services; Go reserved for latency-critical seams only.
- REST-first API design with OpenAPI contracts; GraphQL applied surgically where over-fetching is measured, not assumed.
- Redis caching, background jobs, scheduled newsletter dispatch.

**Data**
- PostgreSQL modelling, normalisation judgement, JSONB for evolving payloads.
- Migrations as version-controlled code; indexing strategy driven by query plans.

**Security**
- JWT (short-lived access + rotating refresh), OAuth 2.0 / OIDC, OWASP Top 10.
- RBAC + ABAC authorization, rate limiting, CSP/XSS hardening, parameterized queries, secret hygiene.
- Instinct for high-sensitivity data: ReForge is *not* a medical tool, but recovery data is treated as if it were.

**Platform / DevOps**
- Docker, CI/CD pipelines, protected `main`, migration ordering, blue/green or preview deploys.
- Observability: metrics, structured logs, tracing, alerting on SLOs.
- Azure (backend/data) + Vercel (frontend) per TRD.

**Product & communication**
- Writes PRD/TRD-grade documentation.
- Slices a 24-week roadmap into shippable increments with hard cut lines.
- Tone judgement: every user-facing word must read as a warm friend, never a clinician, never a judge.

### Explicitly NOT required
Clinical or medical credentials. Native mobile (iOS/Android) engineering. ML research. AI personalisation is a Phase-4 concern only.

### Supporting roles the lead directs (part-time on MVP)
- **Product designer** — UI/UX + mobile UX, design system, empty/skeleton states.
- **Content / copy lead** — guides across 21 dimensions, newsletters, devotionals and secular alternatives, situation guides.
- **QA** — e2e flows, regression suite, accessibility passes.
- **Security reviewer** — pre-launch OWASP pass and threat model sign-off.

### Decision rights
The lead owns: architecture, data model, security posture, branching/release process, and the MVP cut line. The client owns: scope priority, content voice, launch date. Anything that changes the data model, auth model, or hosting target requires a written ADR (section 3 format).

### Definition of Done (every ticket)
1. Typed — no `any` at module boundaries.
2. Tested — unit for logic, integration for module seams, e2e for the user flow it touches.
3. Migrated — schema changes shipped as reviewed migrations, never manual SQL.
4. Observable — meaningful logs and at least one metric or trace on new server paths.
5. Secure — authz check present, input validated, output escaped.
6. Stated — loading state, skeleton state, empty state, and error state all implemented.
7. Responsive — verified at 375px, 768px, 1440px.
8. Merged via PR into `staging`, never directly into `main`.

---

## 2. Product Intake Summary

**ReForge** — a web-based sober-lifestyle platform guiding people through a structured **3-to-6-month** journey from substance dependence back into productive, community-integrated life. Standalone digital companion first; community bridge second. Not therapy, not a medical tool — whole-person lifestyle restructuring.

**Target users:** The Self-Starter · The Post-Rehab Graduate · The Reducer · The Supporter.

**Substances (Phase 1):** alcohol · cigarettes/nicotine · marijuana/cannabis · codeine and OTC opioids · prescription medication misuse. Hardcore substances deferred to Phase 2.

**21 life dimensions:** Work & Career · Aspirations & Goals · Impact on Loved Ones · Behavioural Changes · Who They Were Before · What They Were Escaping · What They Were Trying to Get Back To · What They Were Like When Using · Short-Term Changes · Long-Term Changes · What They Were Going For · Relationship with God/Faith · Relationship with Others · What They Were Avoiding · What They Were NOT Avoiding · Physical Health · Mental Health · Financial Situation · Daily Routines · Social Environment · Self-Image.

**Platform components**
1. **Public website** — landing, about, how it works, success indicators, newsletter signup, blog/resources, FAQ, for supporters, contact.
2. **Web application** — dashboard, onboarding assessment, daily check-in, progress tracker, life dimensions panel, activity guides, music rehabilitation, situation guides, relationship repair guides, faith/spirituality space, rules & boundaries, journal, goal tracker, newsletter archive, resource library, settings.
3. **Newsletter system** — daily encouragement, Sunday weekly digest, milestone celebrations (7/14/30/60/90/180 days), bi-weekly dimension-specific, event-triggered situation-specific.
4. **Community bridge (Phase 2)** — gated by readiness milestone; peer encouragement, group challenges, moderation, mentorship pairing.

**Signature features:** music taste rehabilitation (assessment → gradual shift → curated context playlists → discovery), activity guides derived from what the user *actually does*, conversational non-clinical onboarding.

**Technical mandate (TRD):** HTML/CSS/ES6+ · React 18 (not 19) · TypeScript · Node.js LTS (+ Go where justified) · PostgreSQL via Supabase (+ MongoDB for flexible content) · REST + GraphQL · JWT / OAuth 2.0 / OWASP · Git feature→staging→main with `main` protected · rate limiting · load balancing · API gateway · Redis caching · RBAC/ABAC · SSL/TLS · CORS · XSS protection · SQL injection prevention · migrations · indexing · Docker · CI/CD · unit/integration/e2e · Azure + Vercel · monitoring & centralised logging · mobile-first responsive · loading + skeleton states.

**Non-functional targets:** API p90 < 200ms · page load < 3s · 99.9% uptime · 10x load headroom without degradation.

**Delivery timeline (MVP doc):** Phase 1 Foundation wk 1–6 · Phase 2 Core wk 7–12 · Phase 3 Community Bridge wk 13–18 · Phase 4 Scale & Optimize wk 19–24.

**Reference base:** recovery-capital literature, habit-formation research, Gottman Institute frameworks for relationship repair.

---

## 3. Architecture Decision Records

ADR format for all future decisions: **Context → Decision → Consequences → Trade-off accepted**.

### ADR-001 — Modular monolith first, service seams pre-cut
- **Context:** TRD specifies a microservices-oriented approach. Team size at MVP is small; traffic is unproven.
- **Decision:** Ship a modular monolith with hard internal module boundaries (`auth`, `assessment`, `checkins`, `journal`, `goals`, `content`, `newsletter`, `community`). Each module owns its tables and exposes a typed internal interface only.
- **Consequences:** One deployable, one CI pipeline, far less ops overhead during weeks 1–12. Any module can be extracted to its own service without touching callers.
- **Trade-off accepted:** No independent per-module scaling on day one. Revisit at Phase 4 when real load data exists.

### ADR-002 — PostgreSQL as system of record; JSONB instead of MongoDB at MVP
- **Context:** TRD lists Postgres *and* MongoDB for flexible/evolving content (journal, assessments).
- **Decision:** Postgres only for MVP. Evolving payloads (assessment answers, journal blocks, activity metadata) live in `jsonb` columns with GIN indexes and a versioned schema key.
- **Consequences:** One backup story, one migration story, transactional consistency across check-ins and dimension scores.
- **Trade-off accepted:** Losing document-store ergonomics. If content modelling genuinely outgrows JSONB in Phase 3–4, introduce MongoDB for the content/resource library only — never for user records.

### ADR-003 — REST-first, GraphQL only where over-fetching is measured
- **Context:** TRD requires both.
- **Decision:** All write paths and core reads are REST with an OpenAPI contract. GraphQL is introduced for exactly one surface first — the dashboard aggregate (streaks + mood trend + 21 dimension scores + goals + today's guides) — where a single request replaces 5+ round-trips.
- **Consequences:** Simple, cacheable, easily rate-limited REST surface plus one efficient composite read.
- **Trade-off accepted:** Two API paradigms to maintain. Justified only where the round-trip saving is demonstrable.

### ADR-004 — Redis for caching, sessions-adjacent state, and rate limiting
- **Decision:** Redis backs response caching for content/resource reads, computed dimension-score snapshots, newsletter dedupe keys, and the distributed rate limiter.
- **Trade-off accepted:** An additional stateful dependency; every cache key gets an explicit TTL and an invalidation owner documented in the Backend doc.

### ADR-005 — React 18 pinned
- **Decision:** `react@18.x` / `react-dom@18.x` exact-pinned in the spec-faithful build; any library requiring React 19 is rejected.
- **Trade-off accepted:** No React 19 features (see section 11 for how this interacts with this Lovable project).

### ADR-006 — Authorization: RBAC baseline, ABAC on record ownership
- **Decision:** Roles = `user`, `supporter`, `mentor`, `moderator`, `admin`, stored in a dedicated `user_roles` table (never on the profile row). Attribute rules layer on top: record ownership, supporter-link consent scope, and community readiness milestone.
- **Trade-off accepted:** Two-layer authz is more code than roles alone; unavoidable for supporter access and mentorship.

### ADR-007 — Sensitive data handling
- **Decision:** Journal bodies, assessment answers, and check-in free text are classified **Tier 1 sensitive**: encrypted at rest, excluded from logs and analytics events, never included in email or push notification bodies, and excluded from any admin read surface without an explicit, audited break-glass flow.
- **Trade-off accepted:** Harder support/debugging. Correct for this product.

---

## 4. Non-Negotiables Checklist

Each row is a testable requirement, not a bullet.

| # | Requirement | Concrete implementation | Verification |
|---|---|---|---|
| 1 | Rate limiting | Redis sliding window; 5/min on auth, 60/min authenticated general, 20/min on write endpoints | Load script exceeds limit → 429 + `Retry-After`; asserted in integration tests |
| 2 | SSL/TLS | TLS 1.2+ enforced at edge, HSTS with preload, no mixed content | SSL Labs A rating in pre-launch checklist |
| 3 | CORS | Explicit origin allowlist per environment, credentials mode declared, no wildcard on authed routes | Test asserts a disallowed origin is rejected |
| 4 | XSS protection | CSP with nonce, no `dangerouslySetInnerHTML` without sanitiser, all rich content sanitised server-side | CSP header snapshot test + a stored-XSS payload e2e test |
| 5 | SQL injection | Parameterized queries / query builder only; string-concatenated SQL blocked in CI by lint rule | CI lint rule + injection payload test on search endpoints |
| 6 | RBAC / ABAC | `user_roles` table + security-definer role check + ownership predicates on every query | Authz matrix test: each role × each endpoint, expected allow/deny |
| 7 | Auth | Short-lived access JWT + rotating refresh, OAuth 2.0/OIDC providers, leaked-password check on signup, password reset page implemented | e2e signup/login/reset/expiry-refresh suite |
| 8 | Load balancing | Stateless app instances behind the platform load balancer; no in-process session state | Kill one instance under load → zero failed requests |
| 9 | API gateway | Single entry point handling routing, auth pre-check, rate limit, request ID injection | Request ID visible end-to-end in traces |
| 10 | Caching | Redis with per-key TTL and named invalidation owner | Cache hit ratio metric on the dashboard aggregate |
| 11 | Docker | Multi-stage images, non-root user, pinned base digests | Image builds reproducibly in CI; vulnerability scan gate |
| 12 | CI/CD | Lint → typecheck → unit → integration → build → e2e on preview → deploy | Red pipeline blocks merge; enforced by branch protection |
| 13 | Testing | Unit (logic), integration (module seams + DB), e2e (onboarding, check-in, journal, goals, newsletter opt-in) | Coverage floor on `src/modules/**`; e2e suite green pre-deploy |
| 14 | Migrations | Forward-only versioned migrations in repo, applied by pipeline, never by hand | Fresh DB rebuilt from migrations in CI each run |
| 15 | Indexing | Indexes on every FK, on `(user_id, date)` for check-ins/journal, GIN on JSONB payloads | `EXPLAIN` review on the 10 hottest queries before each phase exit |
| 16 | Monitoring | Metrics (latency p50/p90/p99, error rate, saturation), dashboards, alerts on SLO burn | Alert fires in a staging fire-drill |
| 17 | Logging | Structured JSON, centralised, request-correlated, **zero Tier-1 sensitive fields** | Log-scrub test asserts journal/assessment text never appears |
| 18 | Performance | API p90 < 200ms, page load < 3s | k6 run per phase exit; Lighthouse ≥ 90 perf on public site |
| 19 | Availability | 99.9% target, graceful degradation, retries with backoff | Chaos check: dependency down → app degrades, never white-screens |
| 20 | Mobile-first | Designed at 375px first, verified 375/768/1440 | Visual regression suite at all three widths |
| 21 | Loading & skeleton states | Every async surface ships skeleton + empty + error states | Storybook/e2e states enumerated per screen; PR checklist item |
| 22 | Scalability | Horizontal scale, stateless app tier, connection pooling | 10x synthetic load run at Phase 4 exit |

---

## 5. Git & Environment Workflow

**Branch model**
```text
feature/<ticket>-<slug>  ──PR──▶  staging  ──PR──▶  main (production)
hotfix/<slug>            ──PR──▶  main  ──back-merge──▶  staging
```
- Direct pushes to `main` are **prohibited** — branch protection enforced, not just agreed.
- `staging` is the QA/integration branch and always deployable.
- `main` always reflects production-ready code; every merge is a release candidate.

**PR gates:** 1 reviewer minimum (2 for auth, authz, or migrations) · all CI checks green · migration reviewed separately from app code · screenshots at 375px for any UI change · security checklist ticked for any endpoint change.

**Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).

**Environments**

| Env | Branch | Data | Purpose |
|---|---|---|---|
| Local | any | seeded synthetic | development |
| Preview | per PR | ephemeral seeded | review + e2e |
| Staging | `staging` | synthetic, prod-shaped | QA, load tests, migration rehearsal |
| Production | `main` | real | live |

**Migration ordering rule:** expand → deploy → backfill → contract. Never ship a destructive migration in the same release as the code that stops using the column.

---

## 6. Data Model Outline

Postgres. All user-owned tables carry `user_id` with an ownership policy; all timestamps are `timestamptz`.

**Identity & access**
- `users` (auth-managed) · `profiles` (display name, avatar, timezone, locale, journey start date, current phase)
- `user_roles` (user_id, role enum — separate table, never on `profiles`)
- `supporter_links` (supporter_user_id, member_user_id, consent scope, status) — powers The Supporter profile

**Program configuration**
- `substance_focus` (user_id, substance enum, frequency, duration, reduce_vs_quit)
- `user_preferences` (check-in times, faith inclusion flag, notification channels, music consent)
- `life_dimensions` (reference table — the 21 dimensions, slug, label, order)

**Assessment & tracking**
- `assessments` (user_id, version, completed_at) · `assessment_responses` (assessment_id, dimension_id, `payload jsonb`)
- `dimension_scores` (user_id, dimension_id, score, captured_on) — the progress spine
- `check_ins` (user_id, `local_date`, part enum morning/evening, mood, energy, cravings, `payload jsonb`)
- `streaks` (user_id, current, longest, last_counted_date)
- `milestones` (user_id, day_count, achieved_at, celebrated_at)

**Content the user creates**
- `journal_entries` (user_id, prompt_id nullable, `body` Tier-1 sensitive, dimension_id nullable)
- `rules_boundaries` (user_id, text, active, review_cadence) · `rule_reviews` (rule_id, date, kept boolean)
- `goals` (user_id, horizon enum 30/90/180, dimension_id, title, status) · `goal_steps` (goal_id, title, done_at)

**Content the platform serves**
- `resources` (type, dimension_id, title, `body`, tags, published_at)
- `activity_guides` (context tags: job type, energy, time available, interests)
- `situation_guides` · `relationship_guides` · `devotionals` (faith flag: faith / secular alternative)
- `music_profiles` (user_id, trigger genres/artists, safe genres) · `playlists` (context, tracks metadata)

**Newsletter**
- `newsletter_subscriptions` (email, user_id nullable, status, source)
- `newsletter_issues` (type enum daily/weekly/milestone/dimension/situation, subject, body, scheduled_for)
- `newsletter_sends` (issue_id, subscription_id, sent_at, opened_at, dedupe key)

**Community (Phase 2)**
- `community_membership` (user_id, unlocked_at, readiness_milestone) · `mentor_pairings` · `group_challenges`

**Indexing**
- FK indexes everywhere; `(user_id, local_date)` unique-ish on `check_ins`; `(user_id, created_at desc)` on `journal_entries`; `(user_id, dimension_id, captured_on)` on `dimension_scores`; GIN on every `jsonb payload`; partial index on `newsletter_sends (scheduled_for) where sent_at is null`.

**Access rules**
- Default deny. A row is readable only by its owner, by a linked supporter within the consented scope, or by a moderator inside community tables. Tier-1 sensitive tables (`journal_entries`, `assessment_responses`, free-text on `check_ins`) are owner-only — no supporter, mentor, or admin read path.

---

## 7. UI/UX Standards

**Mobile-first.** Design and build at 375px, then 768px, then 1440px. Touch targets ≥ 44px. Bottom-anchored primary actions on mobile.

**Tone of voice — hard rules**
- Conversational, warm, second person. "How did today go?" not "Please complete your daily assessment."
- Never clinical, never shaming, never gamified-cute about relapse.
- No streak-loss punishment language. A broken streak gets "Let's start today" — never "You failed."
- Faith content is opt-in with a parallel secular alternative for every devotional.
- Crisis language is never handled with product copy alone — see the risk register.

**State discipline.** Every async surface ships four states: **skeleton** (matching final layout, no spinners for content), **empty** (with one clear next action), **error** (human sentence + retry), **success**. Optimistic updates on check-ins, journal saves, and goal steps.

**Progress visualisation.** The dashboard leads with whole-life progress across dimensions, not just a sober-day counter — the day count is present but never the largest element on screen.

**Accessibility.** WCAG 2.1 AA: contrast, focus rings, keyboard paths through onboarding and check-in, reduced-motion support, semantic headings, labelled form controls.

**Privacy in the UI.** Nothing sensitive in notification previews, page titles, email subjects, or share cards. A visible quick-exit affordance on the web app. Session timeout with re-auth on sensitive surfaces.

**Design system.** Semantic tokens only — no hardcoded colour utilities in components. One typographic scale, one spacing scale, one radius scale, defined once and themed.

---

## 8. 24-Week Delivery Plan

### Phase 1 — Foundation (weeks 1–6)
- **Entry:** documents suite approved, environments provisioned.
- Wk 1: repo, CI skeleton, branch protection, Docker, design tokens, ADR log.
- Wk 2: auth (JWT + OAuth), roles table, authz matrix, password reset.
- Wk 3: data model + migrations for identity, config, dimensions; seeding.
- Wk 4: public website (landing, about, how it works, FAQ, supporters, contact) + newsletter signup.
- Wk 5: onboarding assessment across the 21 dimensions, conversational UI.
- Wk 6: app shell, dashboard v1, observability baseline, security pass #1.
- **Exit:** a user can sign up, complete onboarding, and see a dashboard. Pipeline green, p90 measured.

### Phase 2 — Core Journey (weeks 7–12)
- Wk 7: daily check-in (morning/evening) + streaks + milestones.
- Wk 8: progress tracker + life dimensions panel + dimension scoring.
- Wk 9: journal with guided prompts; rules & boundaries with daily review.
- Wk 10: goal tracker (30/90/180) with daily step breakdown.
- Wk 11: newsletter system — daily, weekly digest, milestone, dimension, situation triggers + archive.
- Wk 12: activity guides, situation guides, relationship repair guides, faith/secular space, music rehabilitation v1, resource library, settings.
- **Exit:** the full 3–6 month solo journey is usable end to end. e2e suite covers all core flows. **This is the MVP cut line** — everything below is post-MVP.

### Phase 3 — Community Bridge (weeks 13–18)
- Readiness milestone gate, community membership, peer encouragement, group challenges, moderation tooling, mentorship pairing, supporter experience deepening, reporting/safety flows.
- **Exit:** moderated community live behind the readiness gate with an incident runbook.

### Phase 4 — Scale & Optimize (weeks 19–24)
- Analytics, content expansion, caching/index tuning against real query plans, 10x load test, cost review, AI personalisation exploration, security audit #2, accessibility audit.
- **Exit:** SLOs met under 10x synthetic load; audits closed.

---

## 9. Document Production Order

Produced in this sequence; each document consumes the ones above it. Owner in brackets.

1. **PRD** *(product lead + engineering lead)* — vision, users, problem, scope by phase, 21 dimensions, all four platform components, feature requirements, success indicators, out-of-scope. Inputs: MVP overview. Already drafted; to be reconciled against this guide.
2. **TRD** *(engineering lead)* — stack, architecture, security, infrastructure, DevOps, cloud, data strategy, NFRs, API overview, monitoring. Inputs: PRD + ADRs in section 3. Already drafted; to be reconciled.
3. **App Flow** *(engineering lead + designer)* — every route on the public site and web app, entry/exit points, state transitions, gating rules (onboarding complete, readiness milestone), error and edge paths, notification triggers. Inputs: PRD scope + section 6 data model.
4. **UI/UX Specification** *(designer)* — design tokens, component inventory, screen-by-screen layouts, all four states per surface, tone-of-voice guide with approved/banned phrasing, accessibility requirements. Inputs: App Flow.
5. **Database Schema** *(engineering lead)* — full DDL, enums, constraints, indexes, access policies, migration plan, seed strategy, retention and deletion policy for Tier-1 data. Inputs: section 6 outline + App Flow.
6. **Backend Specification** *(engineering lead)* — module boundaries, OpenAPI contract per endpoint, the one GraphQL aggregate, authz matrix, caching keys and TTLs, rate-limit tiers, background jobs and newsletter scheduling, error taxonomy. Inputs: Database Schema + App Flow.
7. **Mobile UI/UX Specification** *(designer)* — 375px-first layouts for every screen, navigation pattern, gestures, offline/poor-network behaviour, notification design with privacy constraints, install/PWA considerations. Inputs: UI/UX Specification.
8. **Cloud & Deployment** *(engineering lead)* — Azure topology, Vercel frontend config, environment matrix and secrets management, CI/CD pipeline stages, Docker images, load balancer and gateway config, monitoring/logging/alerting, backup & disaster recovery, runbooks, rollback procedure. Inputs: all of the above.

Each document opens with: purpose, audience, inputs consumed, and open questions. No document is "final" until the one after it has been written against it without contradiction.

---

## 10. Risk Register

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| Tier-1 sensitive data exposure (journal, assessment) | Severe — user trust, legal | Owner-only access, encryption at rest, log scrubbing, no admin read path, break-glass audited | Eng lead |
| Crisis / self-harm disclosure in journal or check-in | Severe — safety | ReForge is explicitly not a crisis service: prominent disclaimer, region-aware helpline signposting on every free-text surface, no automated clinical interpretation, documented escalation guidance for supporters | Product + Eng lead |
| Scope creep from 21 dimensions | Schedule | Dimensions ship as a shared content pattern (guide + prompt + score), not 21 bespoke features; content volume tracked as its own workstream | Eng lead |
| Content production bottleneck (guides, newsletters, devotionals) | Schedule | Content lead starts week 1, parallel to build; MVP requires a defined minimum set per dimension, not completeness | Content lead |
| Newsletter deliverability & reputation | Engagement | Dedicated sending domain, SPF/DKIM/DMARC, warm-up, double opt-in, one-click unsubscribe, bounce/complaint handling, send dedupe keys | Eng lead |
| Two API paradigms (REST + GraphQL) sprawl | Maintenance | GraphQL restricted to the dashboard aggregate; adding a second GraphQL surface requires an ADR | Eng lead |
| Stack drift between the TRD spec and what is prototyped | Rework | Section 11 two-track rule; every deviation recorded as an ADR | Eng lead |
| Supporter access misuse | Trust | Consent-scoped links, revocable at any time, never exposes Tier-1 content, all access logged | Eng lead |
| Under-tested 3–6 month long-horizon logic (streaks, milestones, timezones) | Correctness | Time-travel integration tests over simulated 180-day journeys, timezone-aware `local_date` | QA |

---

## 11. Two-Track Rule: Spec-Faithful vs Platform-Native

This Lovable project runs on **TanStack Start (React 19, Vite, edge runtime) with Lovable Cloud** (managed Postgres, auth, storage, server functions). That does **not** match parts of the TRD: React 18 pinning, Azure hosting, Docker, separate Node/Go microservices, MongoDB, and a self-managed API gateway and load balancer.

Nothing here silently overrides the TRD. Two tracks run in parallel:

**Track A — Spec-faithful (documentation suite).** Every document in section 9 is written to the TRD as authored: React 18, Node.js/Go, Postgres + MongoDB, Docker, Azure + Vercel, self-managed gateway/LB/Redis. This is the handover artefact for an external build team.

**Track B — Platform-native (anything built inside this Lovable project).** Equivalents, one-to-one:

| TRD requirement | Platform-native equivalent here |
|---|---|
| React 18 | React 19 via TanStack Start (framework-fixed) — noted as a deviation |
| Node.js API services | TanStack `createServerFn` server functions + `src/routes/api/*` server routes |
| Azure app hosting + LB | Managed edge runtime; scaling and load balancing handled by the platform |
| API gateway | Server-route entry layer with auth pre-check, request ID, and rate limiting |
| Docker | Not applicable — platform-managed build and deploy |
| PostgreSQL (Supabase) | Lovable Cloud Postgres (same engine) |
| MongoDB | `jsonb` columns per ADR-002 |
| RBAC/ABAC | `user_roles` table + security-definer role function + row-level policies |
| JWT / OAuth | Lovable Cloud auth (email/password + Google), bearer tokens on server functions |
| Migrations | Lovable Cloud SQL migrations, version-controlled |
| Redis caching | Query-layer caching + computed snapshot tables; Redis reintroduced only if measured need |
| Rate limiting | Enforced in the server-function/route layer |
| Centralised logging/monitoring | Platform logs + structured server-function logging |

**Rule:** every Track-B substitution is recorded as an ADR referencing the TRD clause it replaces, so the two tracks can be reconciled at handover.

---

## 12. Backend Architecture, Domain Logic & Problem-Solving Method

### 12.1 Backend skills the role must own (added to section 1)

- **Duration:** 5+ of the 7–10 years spent primarily server-side, of which 3+ owning a production Postgres schema and its migration history end to end.
- **Depth:** API contract design (versioning, idempotency, pagination, error taxonomy), transactional correctness, data modelling for evolving requirements, caching and invalidation, background/scheduled work, third-party integration hardening (retries, backoff, circuit breaking, webhook verification), observability instrumentation.
- **Problem-solving profile:** reproduces before fixing, isolates by layer (client → edge → handler → query → data), fixes the *category* not the instance, and leaves a regression test behind. Comfortable reasoning about concurrency, partial failure, and clock/timezone bugs — all three appear in daily-check-in streak logic.

### 12.2 Layered backend architecture

```text
Client (React)
  │  typed RPC / HTTP
Edge entry layer      → auth pre-check, request ID, rate limit, input validation (Zod)
  │
Application layer    → use-cases: one function = one business operation, transactional
  │
Domain layer         → pure TypeScript: scoring, streaks, phase progression, eligibility
  │
Data-access layer    → repositories; parameterised queries only; RLS as second gate
  │
Postgres (+ jsonb)   ── side channels: scheduled jobs, email/newsletter, storage
```

Rules:
1. **Domain logic is pure and framework-free.** Scoring, streaks, milestone rules and phase transitions live in `src/domain/*` with zero I/O, so they are unit-testable without a database.
2. **Use-cases are the only transaction boundary.** No route or component composes multiple writes; a use-case wraps them.
3. **Validation happens twice** — Zod at the edge, database constraints/RLS at the floor. Client validation is UX only.
4. **No cross-layer shortcuts.** Routes never touch the data layer directly; the domain never imports the client.

### 12.3 Core domain logic to specify before coding

| Concern | Rule to pin down |
|---|---|
| Dimension scoring | Per-dimension 0–100 score, weighted by check-in recency; decay after N days of silence rather than a hard reset |
| Streaks | Computed in the **user's** timezone from check-in dates, not `now()`; a single stored `timezone` per user; idempotent per calendar day |
| Phase progression | Time-in-programme **and** engagement thresholds; never auto-regress a user — surface, don't punish |
| Reduction track | Target curve per substance with tolerance band; "off-track" is informational, never blocking |
| Milestones | Derived, not stored as truth — recomputed from events so history stays correctable |
| Journal & assessments | Append-only with soft delete; edits create revisions (recovery data must never silently vanish) |
| Supporter access | Explicit per-dimension grants, revocable, default deny; supporter sees aggregates not raw journal text |
| Crisis signals | Keyword/severity detection routes to signposting content; logged as an event, never auto-escalated to a human by the system |

### 12.4 Data & consistency rules

- Every write carries `user_id`; every read is RLS-scoped. No table in `public` without explicit `GRANT`s.
- Check-ins are unique per `(user_id, local_date)` — enforced by a unique index, so retries are safe.
- Long-running or fan-out work (newsletter sends, digest computation) is queued as rows in a jobs table processed by a scheduled endpoint, never done inline in a request.
- Aggregates that get read on every dashboard load are materialised into a snapshot table, refreshed on write, and treated as a rebuildable cache.

### 12.5 Error taxonomy and failure behaviour

| Class | HTTP | Behaviour |
|---|---|---|
| Validation | 400 | Field-level messages, no stack detail |
| Unauthenticated | 401 | Redirect to sign-in, preserve destination |
| Unauthorised | 403 | Generic message — never reveal that the record exists |
| Not found | 404 | Route-level not-found UI |
| Conflict / duplicate | 409 | Treated as success where idempotent (repeat check-in) |
| Rate limited | 429 | `Retry-After`, calm copy |
| Downstream failure | 200 + typed fallback | Feature degrades (e.g. empty resource list + banner); core journey never blocks |
| Unexpected | 500 | Logged with request ID, generic UI, alert fires |

Never leak provider errors, SQL text, or PII into responses or logs.

### 12.6 Problem-solving playbook

1. **Reproduce** with the smallest possible input; capture request ID, user role, route.
2. **Locate the layer** by bisecting the stack above — is the payload wrong at the edge, the rule wrong in the domain, or the row wrong in the data layer?
3. **Write the failing test first** at the layer that owns the bug (domain bug → unit test; access bug → policy test; flow bug → e2e).
4. **Fix the category:** when one path is wrong, enumerate its siblings — every route, fetcher and policy sharing the assumption — and fix them in the same change.
5. **Verify with the signal that matters** (the failing test now green, plus the log/metric that first showed the problem).
6. **Record it** — an ADR if it changed a decision, a checklist row in section 4 if it revealed a missing guardrail.

Escalation triggers: three failed attempts on the same error, any suspected data exposure (stop and treat as an incident), or any fix that would require weakening an access policy.

### 12.7 Backend definition of done

Typed contract + Zod validation; transaction boundary correct; RLS policy and GRANTs present and tested from a non-owner account; idempotent where retried; unit tests on domain rules and a policy test on access; structured log with request ID; p90 under 200ms or a documented reason; migration reversible and reviewed.

---

*End of guide. Next step on approval: produce the document suite in the order defined in section 9.*

