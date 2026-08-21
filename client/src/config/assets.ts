export const REFORGE_ASSETS = {
  hero: "/manus-storage/reforge-nature-hero_5156bddd.jpg",
  dashboard: "/manus-storage/reforge-nature-dashboard_45bac10e.jpg",
  reflection: "/manus-storage/reforge-nature-reflection_95fe1295.jpg",
  guides: "/manus-storage/reforge-nature-guides_ad35d270.jpg",
  rituals: "/manus-storage/reforge-nature-rituals_f7a383d4.jpg",
  signIn: "/manus-storage/reforge-signin_3bbf1541.svg",
  journal: "/manus-storage/reforge-journal_baf361c4.svg",
  checkIn: "/manus-storage/reforge-checkin_16952216.svg",
  goals: "/manus-storage/reforge-goals_00056283.svg",
  music: "/manus-storage/reforge-music_a576ed42.svg",
  settings: "/manus-storage/reforge-settings_841835e1.svg",
} as const;

export type ReforgeAssetKey = keyof typeof REFORGE_ASSETS;

export const natureAsset = (key: ReforgeAssetKey) => REFORGE_ASSETS[key];
