# ReForge Platform - Development Roadmap

## Phase 1: Foundation (Weeks 1-6)

### Database & Schema
- [ ] Create comprehensive Drizzle schema for users, profiles, roles, and dimensions
- [ ] Create assessment and dimension scoring tables
- [ ] Create check-in, streak, and milestone tables
- [ ] Create journal, rules, and goals tables
- [ ] Create newsletter subscription and content tables
- [ ] Create music profile and playlist tables
- [ ] Set up row-level security policies and access control
- [ ] Generate and apply all migrations

### Authentication & Security
- [ ] Implement JWT-based session management
- [ ] Set up OAuth login flow with Manus auth
- [ ] Implement RBAC (user, supporter, mentor, moderator, admin roles)
- [ ] Add rate limiting on auth endpoints
- [ ] Implement CORS and CSRF protection
- [ ] Add input validation with Zod schemas
- [ ] Create protected and public procedure wrappers

### Public Marketing Website
- [ ] Design visual direction (warm, non-clinical, compassionate)
- [ ] Build landing page hero section
- [ ] Build about page with mission and values
- [ ] Build how-it-works page (4-phase journey)
- [ ] Build dimensions explainer page
- [ ] Build daily-practice walkthrough page
- [ ] Build success indicators page
- [ ] Build FAQ page
- [ ] Build for-supporters page
- [ ] Build contact page
- [ ] Add newsletter signup to all pages
- [ ] Implement mobile-first responsive design (375px, 768px, 1440px)
- [ ] Add navigation header and footer

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
