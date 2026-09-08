// Generates the bundled ambient music tracks for the recovery lib, one per
// mood, as deterministic 16-bit mono WAV files (~24s each @ 22050 Hz).
// Soft pads + gentle wind; no percussive transients so they loop comfortably.
// Usage: node scripts/generate-audio.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../client/public/assets/audio");
mkdirSync(outDir, { recursive: true });

const SAMPLE_RATE = 22050;
const TRACK_DURATION = 24; // seconds
const CHORD_DURATION = 6; // seconds, 4 chords per track
const NUM_SAMPLES = SAMPLE_RATE * TRACK_DURATION;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

// raised-cosine fade helpers (0..1)
function attackEnv(t, a) {
  if (a <= 0) return 1;
  return Math.min(1, 0.5 - 0.5 * Math.cos(Math.PI * Math.min(t / a, 1)));
}
function releaseEnv(t, d, r) {
  if (r <= 0) return 1;
  const x = d - t;
  if (x <= 0) return 0;
  if (x >= r) return 1;
  return 0.5 + 0.5 * Math.cos(Math.PI * (1 - x / r));
}

const TRACKS = {
  // key: [root(midi), chord arrays of note(midi), ampScale, wind, detune]
  "first-light": {
    root: 48,
    chords: [
      [60, 64, 67, 71],
      [57, 60, 64, 67],
      [53, 60, 64, 69],
      [60, 64, 67, 72],
    ],
    amp: 0.5,
    wind: 0.05,
  },
  "still-waters": {
    root: 50,
    chords: [
      [62, 65, 69, 72],
      [60, 64, 67, 71],
      [55, 62, 66, 69],
      [62, 65, 69, 74],
    ],
    amp: 0.42,
    wind: 0.035,
  },
  "open-sky": {
    root: 48,
    chords: [
      [60, 64, 67, 72],
      [59, 62, 67, 71],
      [57, 60, 64, 69],
      [60, 64, 67, 76],
    ],
    amp: 0.4,
    wind: 0.06,
  },
  "soft-rain": {
    root: 45,
    chords: [
      [57, 60, 64, 69],
      [53, 57, 60, 64],
      [55, 60, 64, 67],
      [50, 53, 57, 60],
    ],
    amp: 0.46,
    wind: 0.085,
  },
  "root-hold": {
    root: 50,
    chords: [
      [50, 53, 57, 62],
      [55, 59, 62, 67],
      [50, 53, 57, 65],
      [57, 62, 66, 69],
    ],
    amp: 0.52,
    wind: 0.05,
  },
  "slow-canopy": {
    root: 53,
    chords: [
      [65, 69, 72, 76],
      [67, 71, 74, 76],
      [64, 67, 71, 74],
      [65, 67, 69, 72, 76],
    ],
    amp: 0.38,
    wind: 0.07,
  },
};

function renderTrack(name, spec) {
  const rnd = mulberry32(name.split("").reduce((n, c) => n + c.charCodeAt(0) * 7, 1337));
  const buf = new Float32Array(NUM_SAMPLES);
  const attack = 2.4;
  const release = 3.2;

  spec.chords.forEach((notes, i) => {
    const start = i * CHORD_DURATION;
    const dur = CHORD_DURATION + 3; // bleed a little into the next chord
    const amp = spec.amp;
    notes.forEach(midi => {
      const f = midiToFreq(midi);
      // hum voice: fundamental + smaller 2nd/3rd harmonics
      const harmonics = [
        { mult: 1, gain: 0.78 },
        { mult: 2, gain: 0.18 },
        { mult: 3, gain: 0.06 },
      ];
      for (const h of harmonics) {
        const phase = rnd() * Math.PI * 2;
        for (let n = 0; n < NUM_SAMPLES; n++) {
          const t = n / SAMPLE_RATE;
          const lt = t - start;
          if (lt < -0.01 || lt > dur) continue;
          const env = attackEnv(lt, attack) * releaseEnv(lt, dur, release);
          const g = (amp * h.gain) / h.mult;
          buf[n] += Math.sin(2 * Math.PI * f * h.mult * lt + phase) * env * g;
        }
      }
      // detuned pair for natural thickness
      for (const det of [0.999, 1.004]) {
        const phase = rnd() * Math.PI * 2;
        const g = amp * 0.16;
        for (let n = 0; n < NUM_SAMPLES; n++) {
          const t = n / SAMPLE_RATE;
          const lt = t - start;
          if (lt < -0.01 || lt > dur) continue;
          const env = attackEnv(lt, attack) * releaseEnv(lt, dur, release);
          buf[n] += Math.sin(2 * Math.PI * (f * det) * lt + phase) * env * g;
        }
      }
    });
    // soft sub root (-12)
    {
      const f = midiToFreq(spec.root - 12);
      const phase = rnd() * Math.PI * 2;
      const g = spec.amp * 0.5;
      for (let n = 0; n < NUM_SAMPLES; n++) {
        const t = n / SAMPLE_RATE;
        const lt = t - start;
        if (lt < -0.01 || lt > dur) continue;
        const env = attackEnv(lt, attack) * releaseEnv(lt, dur, release);
        buf[n] += Math.sin(2 * Math.PI * f * lt + phase) * env * g;
      }
    }
  });

  // gentle wind: low-passed noise with slow swell
  {
    let noise = 0;
    const wind = spec.wind;
    for (let n = 0; n < NUM_SAMPLES; n++) {
      noise = noise * 0.99 + (rnd() * 2 - 1) * 0.01;
      const t = n / SAMPLE_RATE;
      const swell = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.05 * t + 1.2);
      buf[n] += noise * 8 * wind * swell;
    }
  }

  // whole-track fades + slow breathing swell
  const fade = Math.floor(SAMPLE_RATE * 2.4);
  const popStart = (t) => Math.min(1, 0.5 - 0.5 * Math.cos(Math.PI * Math.min(t / 2.4, 1)));
  for (let n = 0; n < NUM_SAMPLES; n++) {
    const t = n / SAMPLE_RATE;
    let gain = 0.62 + 0.38 * Math.sin(2 * Math.PI * 0.045 * t + 0.7);
    gain *= popStart(t);
    if (n > NUM_SAMPLES - fade) gain *= (NUM_SAMPLES - n) / fade;
    buf[n] *= gain;
  }

  // normalize-ish: soft clip at 0.92 to avoid harshness
  let peak = 0;
  for (let n = 0; n < NUM_SAMPLES; n++) peak = Math.max(peak, Math.abs(buf[n]));
  const norm = peak > 0.92 ? 0.92 / peak : 1;
  const out = new Int16Array(NUM_SAMPLES);
  for (let n = 0; n < NUM_SAMPLES; n++) {
    let s = buf[n] * norm;
    s = Math.max(-1, Math.min(1, s));
    out[n] = Math.round(s * 32767);
  }
  return out;
}

function toWav(pcm) {
  const header = Buffer.alloc(44);
  const dataSize = pcm.length * 2;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, Buffer.from(pcm.buffer, pcm.byteOffset, pcm.length)]);
}

for (const [name, spec] of Object.entries(TRACKS)) {
  const pcm = renderTrack(name, spec);
  writeFileSync(path.join(outDir, `${name}.wav`), toWav(pcm));
  console.log(`generated ${name}.wav (${(toWav(pcm).length / 1024).toFixed(1)} KB)`);
}
console.log(`Done. ${Object.keys(TRACKS).length} tracks -> ${outDir}`);