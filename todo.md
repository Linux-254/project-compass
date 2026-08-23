# ReForge Platform - Development Roadmap

## Phase 1: Foundation (Weeks 1-6)

### Database & Schema
- [x] Create comprehensive Drizzle schema for users, profiles, roles, and dimensions
- [x] Create assessment and dimension scoring tables
- [x] Create check-in, streak, and milestone tables
- [x] Create journal, rules, and goals tables
- [x] Create newsletter subscription and content tables
- [x] Create music profile and playlist tables
- [x] Set up row-level security policies and access control
- [x] Generate and apply all migrations

### Authentication & Security
- [x] Set up OAuth login flow with Manus auth (template-provided)
- [x] Add RBAC role fields to schema (user, supporter, mentor, moderator, admin)
- [x] Implement role-gated procedure authorization
- [x] Implement supporter consent-scope enforcement
- [x] Add rate limiting on auth endpoints
- [x] Implement CORS and CSRF protection
- [x] Add input validation with Zod schemas
- [x] Create protected and public procedure wrappers

### Public Marketing Website
- [ ] Define comprehensive visual direction (warm, non-clinical, compassionate)
- [x] Build landing page hero section
- [ ] Build about page with mission and values
- [ ] Build how-it-works page (4-phase journey)
- [ ] Build dimensions explainer page
- [ ] Build daily-practice walkthrough page
- [ ] Build success indicators page
- [ ] Build FAQ page
- [ ] Build for-supporters page
- [ ] Build contact page
- [ ] Add newsletter signup to all pages
- [ ] Verify responsive design at 375px, 768px, 1440px breakpoints
- [ ] Create shared site layout with functional header/footer

### Newsletter System
- [ ] Create newsletter subscription management UI
- [ ] Implement double opt-in flow
- [ ] Build subscription preferences page
- [ ] Create newsletter archive page
- [ ] Set up email templates for daily, weekly, milestone, dimension, and situation sends

## Phase 2: Core Journey (Weeks 7-12)

### Conversational Onboarding
- [ ] Build substance selection flow (alcohol, nicotine, marijuana, codeine, prescription)
- [ ] Build 21-dimension assessment with conversational UI
- [ ] Implement progress indicator through assessment
- [ ] Create profile setup (name, timezone, faith preference)
- [ ] Add skip/back navigation
- [ ] Implement assessment response storage
- [ ] Create initial dimension scoring from assessment

### App Dashboard
- [ ] Build dashboard layout with sidebar navigation
- [ ] Display whole-life progress across 21 dimensions
- [ ] Add sober-day streak counter
- [ ] Add mood trend visualization
- [ ] Add today's check-in prompt
- [ ] Add upcoming goals preview
- [ ] Implement skeleton loading states
- [ ] Implement empty states
- [ ] Add quick-exit affordance for privacy

### Daily Check-ins
- [ ] Build morning check-in form (mood, energy, cravings)
- [ ] Build evening check-in form
- [ ] Implement streak tracking and milestone celebrations
- [ ] Add optimistic updates for check-in submission
- [ ] Create check-in history view
- [ ] Add check-in time preferences

### Progress Tracker
- [ ] Build dimension score visualization
- [ ] Create dimension score history charts
- [ ] Implement phase progression display
- [ ] Add responsive charts at all breakpoints
- [ ] Create dimension detail view with scoring explanation

### Journal Feature
- [ ] Build journal entry creation with guided prompts
- [ ] Implement dimension-linked journal entries
- [ ] Add rich text editor for journal bodies
- [ ] Create journal entry list view
- [ ] Implement Tier-1 sensitive data encryption
- [ ] Add journal search and filtering

### Rules & Boundaries
- [ ] Build rules creation and editing UI
- [ ] Implement daily review cadence
- [ ] Create rule review history
- [ ] Add rule status tracking (active/inactive)
- [ ] Build review completion flow

### Goal Tracker
- [ ] Build goal creation (30/90/180 day horizons)
- [ ] Implement goal step breakdown
- [ ] Create goal progress visualization
- [ ] Add goal status tracking (active/completed/abandoned)
- [ ] Build goal history view
- [ ] Link goals to dimensions

## Phase 3: Content & Personalization (Weeks 13-18)

### Activity Guides
- [ ] Create activity guide content structure
- [ ] Build activity guide recommendation engine
- [ ] Implement context-based filtering (job type, energy, time, interests)
- [ ] Create activity guide detail view
- [ ] Add activity tracking

### Situation Guides
- [ ] Create situation guide content structure
- [ ] Build situation trigger detection
- [ ] Implement situation guide recommendation
- [ ] Create situation guide detail view

### Relationship Repair Guides
- [ ] Create relationship guide content structure
- [ ] Build relationship context assessment
- [ ] Implement relationship guide recommendation
- [ ] Create guide detail view

### Faith/Secular Devotional Space
- [ ] Build faith preference selection in onboarding
- [ ] Create devotional content structure (faith and secular variants)
- [ ] Build daily devotional delivery
- [ ] Implement devotional archive
- [ ] Add devotional reflection prompts

### Resource Library
- [ ] Create resource content structure
- [ ] Build resource search and filtering
- [ ] Implement dimension-based resource organization
- [ ] Create resource detail view
- [ ] Add resource bookmarking

### Music Rehabilitation
- [ ] Build trigger genre/artist assessment
- [ ] Create safe genre profile
- [ ] Implement gradual genre shift algorithm
- [ ] Build curated playlist generation
- [ ] Create playlist context selection
- [ ] Add music discovery recommendations
- [ ] Build music preference history

## Phase 4: Community & Scale (Weeks 19-24)

### Supporter Features
- [ ] Build supporter link creation and management
- [ ] Implement consent-scoped access
- [ ] Create supporter dashboard
- [ ] Add supporter access logging
- [ ] Build supporter messaging (future)

### Community Features
- [ ] Implement readiness milestone gating
- [ ] Build community membership management
- [ ] Create peer encouragement features
- [ ] Implement group challenges
- [ ] Add moderation tooling
- [ ] Build mentor pairing system

### Monitoring & Observability
- [ ] Set up structured logging
- [ ] Implement performance metrics
- [ ] Create monitoring dashboards
- [ ] Set up alerting on SLOs
- [ ] Add request tracing

### Testing & QA
- [ ] Write unit tests for domain logic
- [ ] Write integration tests for procedures
- [ ] Write e2e tests for core flows
- [ ] Implement accessibility testing
- [ ] Run performance testing (p90 < 200ms)
- [ ] Run load testing (10x capacity)

## Cross-cutting Concerns

### Security & Compliance
- [ ] Implement Tier-1 sensitive data encryption (journal, assessment)
- [ ] Add log scrubbing to prevent sensitive data leakage
- [ ] Implement break-glass audit logging for admin access
- [ ] Set up OWASP security checklist
- [ ] Conduct pre-launch security review

### Design System & Styling
- [ ] Define color palette (warm, compassionate)
- [ ] Create typography scale
- [ ] Define spacing and radius scales
- [ ] Create component library with shadcn/ui
- [ ] Implement dark/light theme support
- [ ] Add animation guidelines

### Responsive Design
- [ ] Verify 375px mobile layout
- [ ] Verify 768px tablet layout
- [ ] Verify 1440px desktop layout
- [ ] Test touch targets (≥44px)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

### Documentation
- [ ] Create API documentation (OpenAPI/Swagger)
- [ ] Write database schema documentation
- [ ] Create deployment runbook
- [ ] Write rollback procedures
- [ ] Create incident response guide

## Completed Items (from Lovable prototype)
- [x] Static landing page layout
- [x] Static how-it-works page
- [x] Static dimensions page
- [x] Static daily-practice page
- [x] Static stories/testimonials page
- [x] Basic onboarding flow (local state only)
- [x] UI component library setup
- [x] Tailwind CSS configuration
- [x] TypeScript setup
- [ ] Fix TRPCClientError: db.getSubstanceFocus is not a function on the dashboard route
- [ ] Redesign ReForge UI/UX around a nature-led restorative visual language
- [ ] Replace autumn-only surfaces with botanical earth, moss, clay, mist, and forest tokens
- [ ] Create and upload nature-led page atmosphere assets for public, sign-in, dashboard, journal, check-in, goals, guides, music, rules, newsletter, and settings
- [ ] Rebuild public landing and sign-in composition with nature imagery, calm motion, and accessible controls
- [ ] Rework authenticated shell, navigation, dashboard, and all recovery workspace pages with contextual nature cues
- [ ] Add responsive and reduced-motion polish for the nature redesign
- [ ] Validate the redesign with type checks, tests, production build, and screenshots
- [ ] Reconcile PostgreSQL schema fields with backend helpers and tRPC client contracts so the full-stack build compiles cleanly
- [ ] Finish nature-led redesign for dashboard, settings, newsletter, and onboarding routes
- [ ] Diagnose and repair OAuth callback failure in server/_core/oauth.ts or session cookie configuration
- [x] Implement a restorative loading spinner and overlay on the frontend while OAuth handoff and session verification are processing
- [x] Add a safe timeout fallback so stale OAuth handoff state returns users to the sign-in gate
- [x] Add smooth CSS fade-in and fade-out keyframes for the OAuth loading overlay
- [x] Introduce burnt-wood typography tokens (e.g. text-[oklch(0.38_0.07_52)]) for nature-led headings
- [x] Redesign the admin dashboard with glassmorphic cards, RBAC-aware user-to-admin navigation, role grant/revoke controls, and newsletter issue CRUD operations
- [x] Add admin user and newsletter search/filter controls
- [x] Add glassmorphic confirmation modal for destructive admin actions
- [x] Add nature-toned toast notifications for admin CRUD feedback
- [x] Fortify admin authorization, mutation validation, and safe audit behavior
- [ ] Add practical modern admin affordances and responsive verification
- [x] Add server-side audit logging for admin role grants/revokes and newsletter create/update/delete actions without sensitive content
- [x] Add regression tests covering successful and rejected admin audit events
- [x] Tighten default CORS behavior and enforce same-origin checks on state-changing API requests
- [x] Reject state-changing tRPC requests when Origin and Referer are absent or invalid
- [x] Add regression tests for same-origin, cross-origin, and missing-origin mutations
- [x] Review non-tRPC state-changing endpoints for equivalent origin protection
- [x] Audit all non-tRPC Express routes and document protections for any state-changing handlers
- [x] Add a focused route-safety test or checklist proving non-tRPC routes are GET-only or equivalently protected
- [x] Implement consent-scoped supporter access with explicit scope checks and access logging
- [x] Enforce consent scope on the implemented supporter journal member-data procedure
- [ ] Enforce consent scope on every future supporter-facing member-data procedure
- [x] Add non-sensitive supporter access logging for link reads, scoped data access, and revocations
- [x] Add helper-level regression tests for supporter scope and link status
- [x] Add procedure-level regression tests for supporter journal and access-summary authorization and audit outcomes
- [x] Add successful supporter access-summary procedure coverage and verify its success audit event
- [x] Add procedure-level success and rejection tests for supporter link listing and revocation audit outcomes
- [x] Add supporter link-list rejection coverage for a non-supporter caller and rejected audit event
- [x] Add secure supporter-link creation with explicit consent scope, ownership checks, and pending status
- [x] Update supporter-link creation to use PostgreSQL-safe returning semantics and add persistence coverage
- [x] Add a database-level uniqueness or transactional guard against duplicate active or pending supporter links
- [ ] Add runtime-backed supporter-link persistence verification against the deployed database driver
