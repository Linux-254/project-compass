export const REFORGE_ASSETS = {
  hero: "/manus-storage/reforge-hero_10653d96.svg",
  signIn: "/manus-storage/reforge-signin_3bbf1541.svg",
  journal: "/manus-storage/reforge-journal_baf361c4.svg",
  checkIn: "/manus-storage/reforge-checkin_16952216.svg",
  guides: "/manus-storage/reforge-guides_3e31eaea.svg",
  goals: "/manus-storage/reforge-goals_00056283.svg",
  music: "/manus-storage/reforge-music_a576ed42.svg",
  settings: "/manus-storage/reforge-settings_841835e1.svg",
} as const;

export type ReforgeAssetKey = keyof typeof REFORGE_ASSETS;
