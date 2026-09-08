export type MusicMoodKey = "calm" | "focus" | "uplift" | "grief" | "urge" | "hope";

export interface MusicMoodDef {
  key: MusicMoodKey;
  label: string;
  eyebrow: string;
  description: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  mood: MusicMoodKey;
  url?: string;
  source: "bundled" | "custom";
  hint?: string;
}

export const MUSIC_MOODS: MusicMoodDef[] = [
  { key: "calm", label: "Calm", eyebrow: "Slow the pulse", description: "For evening wind-down and anxious moments." },
  { key: "focus", label: "Focus", eyebrow: "Clear & steady", description: "For work, study, and single-minded practice." },
  { key: "uplift", label: "Uplift", eyebrow: "Lift the heart", description: "For the days you need a little more brightness." },
  { key: "grief", label: "Low & tender", eyebrow: "Be gentle", description: "For heavy days; no fixing, just holding." },
  { key: "urge", label: "Urge surge", eyebrow: "Ride it through", description: "For craving waves that pass if you let them." },
  { key: "hope", label: "Hope", eyebrow: "A soft return", description: "For after the storm, when self-belief returns." },
];

export const MUSIC_ASSET_NAMES: Record<MusicMoodKey, string> = {
  calm: "first-light",
  focus: "still-waters",
  uplift: "open-sky",
  grief: "soft-rain",
  urge: "root-hold",
  hope: "slow-canopy",
};

export const BUNDLED_TRACKS: MusicTrack[] = [
  { id: "bundled_firstLight", title: "First Light", mood: "calm", url: "/assets/audio/first-light.wav", source: "bundled" },
  { id: "bundled_stillWaters", title: "Still Waters", mood: "focus", url: "/assets/audio/still-waters.wav", source: "bundled" },
  { id: "bundled_openSky", title: "Open Sky", mood: "uplift", url: "/assets/audio/open-sky.wav", source: "bundled" },
  { id: "bundled_softRain", title: "Soft Rain", mood: "grief", url: "/assets/audio/soft-rain.wav", source: "bundled" },
  { id: "bundled_rootHold", title: "Root Hold", mood: "urge", url: "/assets/audio/root-hold.wav", source: "bundled" },
  { id: "bundled_slowCanopy", title: "Slow Canopy", mood: "hope", url: "/assets/audio/slow-canopy.wav", source: "bundled" },
];