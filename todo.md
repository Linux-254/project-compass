# ReForge Platform - Production Roadmap

- [x] Establish 29-table database schema with Drizzle & migrations
- [x] Configure tRPC routers (auth, profile, onboarding, dashboard, check-in, journal, goals, rules, music, newsletter, resources, preferences)
- [x] Build warm public landing page and responsive navigation
- [x] Implement authenticated user dashboard with streak and dimension progress
- [x] Build daily check-in feature (morning/evening, mood, energy, cravings)
- [ ] Implement conversational onboarding assessment across 21 dimensions
- [x] Build journal feature with privacy handling
- [x] Build goal tracking overview and 30/90/180-day goal creation flow
- [ ] Add goal steps and completion controls
- [x] Build rules & boundaries management and daily review
- [x] Build music rehabilitation trigger and safe genre tracker
- [x] Build content library and resource explorer per dimension
- [x] Build devotional preference choice with faith/secular labelling
- [ ] Add a full devotional content library
- [x] Build newsletter signup and preference management
- [ ] Set up git branch workflow (`features` -> `dev` -> `staging` -> `main`)
- [x] Create automated vitest unit tests
- [ ] Complete authenticated manual verification on the current redesigned protected routes and re-record the protected walkthrough (public walkthrough is complete; authenticated acceptance remains blocked by the signed-out connected browser)
- [x] Fix dashboard navigation and register authenticated workspace routes
- [x] Add idempotent same-day check-in updates and encrypted Tier-1 notes
- [x] Enforce assessment ownership before saving or completing responses
- [x] Replace generic sidebar entries with ReForge recovery navigation
- [x] Add query error and empty states to dashboard and feature pages
- [x] Add production build, unit, and flow verification report
- [x] Prepare browser-driven demo recordings and document recording limitations
- [ ] Create production checkpoint and handoff version

## Implementation Notes

The first checkpoint contains the foundation only. Items above are the active hardening and completion work for the production candidate.
- [x] Redesign global visual system with old-money autumn colors, olive green, and warm neutrals
- [x] Add light/dark theme switching with accessible contrast
- [x] Add persistent responsive navigation and logo links on every public and authenticated page
- [x] Create editable image-backed atmosphere assets for hero, sign-in, journal, check-in, goals, guides, music, and settings
- [x] Redesign desktop sign-in as a calm split layout and add mobile-safe stacked layout
- [x] Add hero content slideshow with functional controls and reduced-motion support
- [x] Add motivation/reflection sections for each guideline/resource area
- [x] Improve journal structure with prompts, entries, privacy cues, and empty/error states
- [x] Improve morning/evening check-in flow with contextual prompts and review summary
- [x] Re-run responsive screenshots, tests, and production build after the visual redesign
- [x] Refine authenticated mobile header so account actions do not crowd the ReForge mark
- [ ] Connect a verified email sender and deliver newsletter confirmation links (subscription state is implemented, but outbound email is not configured)
