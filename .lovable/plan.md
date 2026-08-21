## What I took in

- **PRD (ReForge):** 3–6 month sober-lifestyle web platform. 4 user profiles (Self-Starter, Post-Rehab Graduate, Reducer, Supporter), 5 Phase-1 substances, 21 life dimensions, 4 platform components (public website, web app, newsletter system, community bridge in Phase 2), features incl. onboarding assessment, daily check-ins, progress/dimension tracking, activity guides, music rehabilitation, situation + relationship-repair guides, faith space, rules & boundaries, journal, goals, resource library, settings.
- **TRD:** HTML/CSS/ES6+, React 18 (explicitly not 19), TypeScript, Node.js/Go, PostgreSQL (Supabase) + MongoDB, REST + GraphQL, JWT/OAuth2/OWASP, Git feature→staging→main (no direct main pushes), rate limiting, load balancing, API gateway, Redis caching, RBAC/ABAC, SSL/TLS, CORS, XSS + SQLi protection, migrations, indexing, Docker, CI/CD, unit/integration/e2e, Azure + Vercel, monitoring/logging, mobile-first responsive, loading + skeleton states, <200ms API p90, 99.9% uptime, 10x scale.
- **MVP PDF:** same scope plus the 4-phase delivery timeline (Weeks 1–6 foundation, 7–12 core, 13–18 community bridge, 19–24 scale/optimize) and the reference base (SAMHSA-style recovery capital, habit formation, Gottman for relationship repair).

## The role this build should be run under

**Role: Senior Full-Stack Product Engineer / Technical Lead (health-adjacent SaaS)**

- **Experience level:** Senior / Lead — 7–10 years total, of which 4+ years leading full-stack product delivery end to end (discovery → architecture → ship → operate).
- **Core background:** TypeScript-first full-stack. React 18 + modern build tooling, design-system work, accessibility, mobile-first responsive UI, loading/skeleton state discipline. Node.js (LTS) services, PostgreSQL data modelling, REST-first APIs with GraphQL where read-heavy, Redis caching.
- **Security & compliance depth:** 3+ years shipping OWASP-aligned auth (JWT rotation, OAuth 2.0/OIDC), RBAC + ABAC authorization, rate limiting, CSP/XSS hardening, parameterized queries, secrets handling. Sensitive-personal-data instincts (this is recovery/health-adjacent data — treated as high-sensitivity even though ReForge is not a medical tool).
- **DevOps/platform depth:** 3+ years Docker, CI/CD, trunk-adjacent branching (feature → staging → main, main protected), migrations as code, observability (metrics, structured logs, tracing), Azure + Vercel deploys, load balancing / API gateway patterns.
- **Product/soft skills:** writes PRD/TRD-grade docs, breaks a 24-week roadmap into shippable slices, and has the empathy/tone judgement to keep copy conversational and non-clinical (a hard requirement of this product).
- **Explicitly NOT needed:** clinical/medical credentials, native mobile, ML research. AI personalisation is a Phase-4 concern only.

**Supporting roles the lead directs (part-time on MVP):** product designer (UI/UX + mobile UX), content/copy lead (21 dimensions of guides, newsletters, devotionals), QA (e2e flows), and a security reviewer for the pre-launch pass.

## The guide I'll produce (this is the deliverable, not the docs themselves)

A single master guide, `docs/00-ENGINEERING-GUIDE.md`, containing:

1. **Role charter** — the persona above, responsibilities, decision rights, and the "definition of done" bar (typed, tested, migrated, observable, secure, skeleton-stated).
2. **Product intake summary** — condensed PRD/TRD/MVP facts so the guide stands alone.
3. **Architecture decision record set** — modular-monolith-first with service seams (vs. the TRD's microservices-oriented framing), Postgres as system of record, JSONB for evolving journal/assessment payloads instead of a second MongoDB store on MVP, REST-first + GraphQL only where over-fetching is proven, Redis caching layer, each with rationale and the trade-off named.
4. **Non-negotiables checklist** — the full TRD security/infra/DevOps list mapped to a concrete implementation and a verification step for each (so "rate limiting" becomes a testable requirement, not a bullet).
5. **Git & environment workflow** — feature → staging → main, protected main, PR review gates, CI checks, migration ordering, environment matrix (dev/staging/prod).
6. **Data model outline** — users, profiles, substance focus, assessment responses, the 21 dimensions + scores, daily check-ins, journal entries, rules/boundaries, goals, activities, music prefs, newsletters, milestones; plus indexing and row-level access rules.
7. **UI/UX standards** — mobile-first breakpoints, tone-of-voice rules (conversational, never clinical, never shaming), loading + skeleton state patterns, empty states, accessibility, privacy-in-UI (nothing sensitive in notifications/previews).
8. **24-week delivery plan** — the 4 PDF phases turned into week-by-week workstreams with entry/exit criteria per phase and MVP cut lines.
9. **Document production order** — the exact sequence, owner, and required inputs for the doc suite you listed: PRD → TRD → App Flow → UI/UX → Database Schema → Backend → Mobile UI/UX → Cloud & Deployment, each with a one-paragraph brief on what it must contain so they can be generated consistently later.
10. **Risk register** — sensitive-data exposure, crisis/self-harm content escalation path (out-of-scope disclaimer + signposting), scope creep from 21 dimensions, content-volume bottleneck, newsletter deliverability.

## Technical note (worth flagging before we build anything here)

This Lovable project runs on TanStack Start (React 19, Vite, edge runtime) with Lovable Cloud (Postgres/auth/storage/server functions) — it does not match parts of the TRD (React 18 pinning, Azure hosting, Docker, separate Node/Go microservices, MongoDB, self-managed API gateway/load balancer). The guide will call this out explicitly and give two tracks: the **spec-faithful track** for the documentation suite (what your TRD says, for handover to an external team), and the **platform-native track** for anything actually built here (Lovable Cloud equivalents for auth, RLS-based RBAC/ABAC, migrations, rate limiting in server functions). Nothing in the guide will silently contradict your TRD.

## Not in this step

No PRD/TRD/App Flow/schema/deployment documents get written in this step, and no ReForge application code is built — this step only intakes the three documents and produces the guide. Say the word once it's approved and I'll generate the document suite in the order above.
