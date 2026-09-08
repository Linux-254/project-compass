export interface PageMeta {
  title: string;
  description: string;
  noIndex?: boolean;
}

/**
 * Per-route metadata for SEO. Added to the SPA via the RouterMeta watcher.
 * Keep descriptions specific, written for humans, and distinct per page.
 */
export const ROUTE_META: Record<string, PageMeta> = {
  "/": {
    title: "ReForge — Recovery • Growth • Community",
    description:
      "ReForge is a gentle whole-life recovery companion. Return to yourself, one honest day at a time, across 21 dimensions of life.",
  },
  "/about": {
    title: "Our approach",
    description:
      "How ReForge works — a calm, private, whole-life recovery practice rather than a clinical dashboard.",
  },
  "/how-it-works": {
    title: "How ReForge works",
    description:
      "The ReForge daily rhythm: two-minute check-ins, private reflection, and whole-life progress across 21 dimensions.",
  },
  "/dimensions": {
    title: "The 21 life dimensions",
    description:
      "Explore the 21 dimensions ReForge uses to understand progress beyond a single habit — health, home, work, relationships, meaning and more.",
  },
  "/daily-practice": {
    title: "Daily practice",
    description:
      "Small daily check-ins, reflection and routines that form the ReForge rhythm of recovery.",
  },
  "/success": {
    title: "Recovery stories",
    description:
      "A calm collection of recovery, growth and transformation stories shared with the ReForge community.",
  },
  "/supporters": {
    title: "Supporters",
    description:
      "Information for people, organizations and communities supporting someone through recovery.",
  },
  "/faq": {
    title: "Frequently asked questions",
    description:
      "Common questions about ReForge, privacy, progress, and the daily practice — answered plainly.",
  },
  "/contact": {
    title: "Contact ReForge",
    description:
      "Questions, feedback, or something we should hear. Reach the ReForge team directly.",
  },
  "/privacy": {
    title: "Privacy policy",
    description:
      "How ReForge collects, uses, and protects your data — written plainly, not buried in legalese.",
  },
  "/terms": {
    title: "Terms & conditions",
    description:
      "The terms that govern your use of ReForge. Straightforward guidance for using the service responsibly.",
  },
  "/sign-in": {
    title: "Sign in",
    description: "Sign in to continue your private ReForge recovery practice.",
  },
  "/dashboard": {
    title: "Your practice",
    description: "Your calm daily landing place in ReForge — current rhythm and progress at a glance.",
    noIndex: true,
  },
  "/check-in": {
    title: "Check in",
    description: "Morning and evening check-in for mood, sleep, cravings, energy and a kind intention.",
    noIndex: true,
  },
  "/check-ins": {
    title: "Check-in history",
    description: "A reflective timeline of your previous ReForge check-ins and patterns.",
    noIndex: true,
  },
  "/progress": {
    title: "Progress",
    description: "Visualize your growth across the 21 dimensions over time.",
    noIndex: true,
  },
  "/journal": {
    title: "Journal",
    description: "A private reflective writing space in ReForge.",
    noIndex: true,
  },
  "/goals": {
    title: "Goals",
    description: "Small, meaningful goals and humane next steps in ReForge.",
    noIndex: true,
  },
  "/rules": {
    title: "Boundaries",
    description: "Create and review personal boundaries that support your recovery.",
    noIndex: true,
  },
  "/guides": {
    title: "Guides",
    description: "Educational and practical resources for the dimensions of your recovery.",
    noIndex: true,
  },
  "/music": {
    title: "Music reset",
    description: "A calming music-based reset experience for your recovery practice.",
    noIndex: true,
  },
  "/devotional": {
    title: "Devotional",
    description: "A quiet reflective space for people who choose to use it.",
    noIndex: true,
  },
  "/newsletter": {
    title: "Newsletter",
    description: "ReForge updates, reflections and community resources delivered by email.",
    noIndex: true,
  },
  "/settings": {
    title: "Settings",
    description: "Manage your ReForge account, preferences and privacy settings.",
    noIndex: true,
  },
  "/onboarding": {
    title: "Get started",
    description: "Begin your ReForge whole-life assessment.",
    noIndex: true,
  },
  "/admin": {
    title: "Admin",
    description: "Administrative controls for the ReForge platform.",
    noIndex: true,
  },
  "/404": {
    title: "Page not found",
    description: "The page you were looking for could not be found.",
  },
};

export function metaForPath(path: string): PageMeta | undefined {
  // Exact match wins; fall back to prefix for nested dashboard routes.
  if (ROUTE_META[path]) return ROUTE_META[path];
  for (const key of Object.keys(ROUTE_META)) {
    if (key !== "/" && path.startsWith(key)) return ROUTE_META[key];
  }
  return undefined;
}
