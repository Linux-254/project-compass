export const REFORGE_ASSETS = {
  hero: "/assets/hero-dawn.jpg",
  dashboard: "/assets/dashboard.svg",
  reflection: "/assets/reflection.svg",
  rituals: "/assets/dailypractice.svg",
  signIn: "/assets/signin.svg",
  journal: "/assets/journal-morning.jpg",
  checkIn: "/assets/checkin.svg",
  history: "/assets/history.svg",
  goals: "/assets/goals.svg",
  rules: "/assets/rules.svg",
  guides: "/assets/guides.svg",
  music: "/assets/music.svg",
  devotional: "/assets/devotional.svg",
  newsletter: "/assets/newsletter.svg",
  settings: "/assets/settings.svg",
  admin: "/assets/admin.svg",
  onboarding: "/assets/onboarding.svg",
  progress: "/assets/progress.svg",
  howitworks: "/assets/howitworks.svg",
  dimensions: "/assets/dimensions.svg",
  dailypractice: "/assets/dailypractice.svg",
  success: "/assets/success.svg",
  about: "/assets/about.svg",
  supporters: "/assets/supporters.svg",
  contact: "/assets/contact.svg",
  faq: "/assets/faq.svg",
  privacy: "/assets/privacy.svg",
  terms: "/assets/terms.svg",
} as const;

export type ReforgeAssetKey = keyof typeof REFORGE_ASSETS;

export const natureAsset = (key: ReforgeAssetKey) => REFORGE_ASSETS[key];