// Generates the tranquil nature artwork set for every page (SVG, ~1200x675).
// Deterministic per page: sky + ground palettes, sun glow, layered hills,
// floating leaves, and a soft emblem carrying a simple line glyph.
// Usage: node scripts/generate-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../client/public/assets");
mkdirSync(outDir, { recursive: true });

function hexPalette(...hex) {
  return hex;
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function shade(hex, t) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(lerp((n >> 16) & 255, 255, t));
  const g = Math.round(lerp((n >> 8) & 255, 255, t));
  const b = Math.round(lerp(n & 255, 255, t));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function leaf(idBase, cx, cy, s, rot, color) {
  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})" opacity="0.85">
    <path d="M0 0 C 6 -14 22 -16 30 -6 C 24 -2 8 4 0 0 Z" fill="${color}"/>
    <path d="M2 -2 C 12 -8 22 -8 28 -5" fill="none" stroke="${shade(color, 0.35)}" stroke-width="1.6" stroke-linecap="round"/>
  </g>`;
}

const ICONS = {
  sun: `<g stroke="#f2d39c" stroke-width="7" stroke-linecap="round" fill="none">
    <circle cx="0" cy="0" r="14"/>
    <g stroke-width="5">${[0,45,90,135,180,225,270,315].map((a) => `<line x1="0" y1="-20" x2="0" y2="-27" transform="rotate(${a})"/>`).join("")}</g>
  </g>`,
  path: `<g stroke="#cfe3c4" stroke-width="7" stroke-linecap="round" fill="none">
    <path d="M-38 30 C -18 6 -6 -12 6 -30"/>
    <path d="M-20 30 C -4 12 4 -4 16 -22"/>
    <circle cx="12" cy="-34" r="5" fill="#f2d39c" stroke="none"/>
  </g>`,
  flag: `<g stroke="#cfe3c4" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M-8 34 L-8 -28"/>
    <path d="M-8 -26 L26 -18 L-8 -8 Z" fill="#f2d39c" stroke="none"/>
    <circle cx="0" cy="40" r="4" fill="#f2d39c" stroke="none"/>
  </g>`,
  book: `<g stroke="#e9d9bd" stroke-width="6" stroke-linecap="round" fill="none">
    <rect x="-26" y="-22" width="52" height="38" rx="5"/>
    <path d="M0 -22 L0 16"/>
    <path d="M-26 -10 L-26 16 L-10 16 M26 -10 L26 16 L10 16"/>
  </g>`,
  music: `<g stroke="#aee0d2" stroke-width="6" stroke-linecap="round" fill="none">
    <circle cx="-16" cy="8" r="8"/>
    <circle cx="14" cy="14" r="8"/>
    <path d="M-8 8 L-8 -24 L28 -30 L28 14"/>
  </g>`,
  gear: `<g fill="none" stroke="#e0d6ae" stroke-width="6">
    <circle cx="0" cy="0" r="13"/>
    <circle cx="0" cy="0" r="5" fill="#e0d6ae" stroke="none"/>
    ${[0,45,90,135,180,225,270,315].map((a) => `<rect x="-4" y="-24" width="8" height="10" rx="2" transform="rotate(${a})"/>`).join("")}
  </g>`,
  shield: `<g fill="none" stroke="#cfe3c4" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M0 -30 L22 -24 L22 -2 C22 12 12 26 0 30 C-12 26 -22 12 -22 -2 Z"/>
    <path d="M-8 2 L-3 7 L8 -8"/>
  </g>`,
  envelope: `<g stroke="#e9d9bd" stroke-width="6" stroke-linecap="round" fill="none">
    <rect x="-30" y="-22" width="60" height="42" rx="6"/>
    <path d="M-30 -22 L0 4 L30 -22"/>
  </g>`,
  candle: `<g stroke="#f2d39c" stroke-width="6" stroke-linecap="round" fill="none">
    <rect x="-8" y="-14" width="16" height="26" rx="3"/>
    <path d="M0 -18 C-8 -28 8 -32 0 -40" fill="#f2d39c" stroke="none" stroke-width="0"/>
    <path d="M-4 20 L4 22 M-4 25 L4 27 M-4 30 L4 32" />
  </g>`,
  compass: `<g stroke="#aee0d2" stroke-width="6" stroke-linecap="round" fill="none">
    <circle cx="0" cy="0" r="26"/>
    <path d="M0 -26 L8 8 L0 4 L-8 8 Z" fill="#f2d39c" stroke="none"/>
    <path d="M-16 -16 L16 16" stroke-width="4" opacity="0.55"/>
  </g>`,
  fence: `<g stroke="#d8b89a" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M-34 -18 L-34 26 M-12 -18 L-12 26 M10 -18 L10 26 M32 -18 L32 26" />
    <path d="M-36 -8 L34 -8 M-36 8 L34 8"/>
    <path d="M-34 -18 L-44 -26 M10 -18 L0 -26 M32 -18 L42 -26" opacity="0.65"/>
  </g>`,
  timeline: `<g stroke="#cfe3c4" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M-38 24 L38 24"/>
    <path d="M-28 24 L-28 8 M-12 24 L-12 2 M6 24 L6 -8 M24 24 L24 0 M38 24 L38 -2"/>
    ${[-28,-12,6,24,38].map((x,i) => `<circle cx="${x}" cy="${[8,2,-8,0,-2][i]}" r="5" fill="#f2d39c" stroke="none"/>`).join("")}
  </g>`,
  flower: `<g fill="none" stroke="#e9d9bd" stroke-width="6" stroke-linecap="round">
    ${[0,60,120,180,240,300].map((a) => `<ellipse cx="0" cy="-16" rx="6" ry="14" transform="rotate(${a})"/>`).join("")}
    <circle cx="0" cy="0" r="8" fill="#f2d39c" stroke="none"/>
  </g>`,
  heart: `<g fill="none" stroke="#f2d39c" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M0 28 C -34 4 -28 -20 -12 -18 C -4 -17 0 -8 0 -4 C 0 -8 4 -17 12 -18 C 28 -20 34 4 0 28 Z" transform="scale(0.62)"/>
  </g>`,
  lock: `<g stroke="#cfe3c4" stroke-width="6" stroke-linecap="round" fill="none">
    <rect x="-20" y="-4" width="40" height="30" rx="6"/>
    <path d="M-12 -4 L-12 -18 C-12 -30 12 -30 12 -18 L12 -4"/>
    <circle cx="0" cy="11" r="4" fill="#cfe3c4" stroke="none"/>
  </g>`,
  map: `<g stroke="#e9d9bd" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M-24 -14 L-8 -24 L8 -14 L24 -22 L26 16 L8 24 L-10 16 L-26 22 Z"/>
    <path d="M-10 16 L-10 -14 M8 -14 L8 24"/>
    <circle cx="4" cy="-2" r="6" fill="#f2d39c" stroke="none"/>
  </g>`,
  gate: `<g stroke="#d8b89a" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M-30 28 L-30 -8 M30 28 L30 -8"/>
    <path d="M-30 -8 C -16 -34 16 -34 30 -8" />
    <path d="M-30 8 L30 8" opacity="0.7"/>
  </g>`,
  steps: `<g stroke="#cfe3c4" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M-34 28 L-34 20 M-34 20 L-14 20 M-14 20 L-14 10 M-14 10 L10 10 M10 10 L10 0 M10 0 L30 0"/>
    <path d="M30 0 L30 -12" stroke-dasharray="4 5"/>
    <circle cx="30" cy="-16" r="4" fill="#f2d39c" stroke="none"/>
  </g>`,
  wave: `<g stroke="#aee0d2" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M-38 4 C -24 -16 -10 18 4 0 C 18 -16 30 10 38 -4"/>
    <path d="M-38 20 C -24 2 -10 34 4 16 C 18 2 30 26 38 12" opacity="0.55"/>
  </g>`,
  sprint: `<g stroke="#e0d6ae" stroke-width="6" stroke-linecap="round" fill="none">
    <circle cx="-20" cy="10" r="9"/>
    <path d="M-11 10 L20 10 M20 10 L13 3 M20 10 L13 17"/>
  </g>`,
};

const PAGES = [
  // name, skyTop, skyBottom, hillFar, hillMid, hillNear, sun, emblemBg, glyph
  ["dashboard",   "#F3F5E5", "#E6EBD2", "#A8C0A5", "#8FB28A", "#3D7045", "#F4E8BF", "path"],
  ["checkin",     "#F3F5E5", "#F1E2C0", "#D9C896", "#BFA95E", "#7A6A3E", "#FCF2D4", "sun"],
  ["progress",    "#F3F5E5", "#E2E7C8", "#B7C8A4", "#93AE83", "#285C32", "#F7E3B0", "steps"],
  ["journal",     "#F4F0E2", "#E7DFC7", "#C9BCA0", "#A89A7C", "#6B5B42", "#F3E4C2", "book"],
  ["goals",       "#F3F5E5", "#DCE7D2", "#A9C4AB", "#85A98C", "#2E5941", "#F8E4B4", "flag"],
  ["rules",       "#F3F1E2", "#E2E3C0", "#BFC590", "#A0A069", "#5E6438", "#EFE0B4", "fence"],
  ["guides",      "#F3F5E5", "#DDE7DA", "#A2C4B0", "#7FA795", "#2E5843", "#F7E3AE", "compass"],
  ["music",       "#F3F5E5", "#E0E7C6", "#BAD0A0", "#8FB268", "#2E5B38", "#F8E4B2", "music"],
  ["devotional",  "#F3F5E5", "#E3E8C6", "#C3D0A0", "#9BB27E", "#42633A", "#F8E4B0", "candle"],
  ["newsletter",  "#F3F5E5", "#E4E9C8", "#BFCD9B", "#9AB27C", "#3E6239", "#F6E3B2", "envelope"],
  ["settings",    "#F4F1E4", "#E5E3C4", "#C7CB9D", "#A5AA75", "#5C6238", "#F0E1B2", "gear"],
  ["onboarding",  "#F3F5E5", "#DFE7CB", "#B3C8A0", "#8FAE83", "#2E5A3B", "#F8E5B0", "map"],
  ["admin",       "#F3F5E5", "#E0E7C9", "#B6CBA2", "#8FAC81", "#24502E", "#F7E3B0", "shield"],
  ["history",     "#F4F0E2", "#E5DFC7", "#C8C0A2", "#A6A081", "#655F3E", "#F3E4B8", "timeline"],
  ["signin",      "#F3F5E5", "#E2E8C6", "#B6CB9B", "#90AE82", "#28583A", "#F9E6B0", "gate"],
  ["reflection",  "#F3F5E5", "#E0E8C8", "#B4C99C", "#8FB081", "#2E5A38", "#F9E6B0", "flower"],
  ["howitworks",  "#F3F5E5", "#E1E7C8", "#B5C99C", "#8FAF84", "#2C5838", "#F7E5B0", "steps"],
  ["dimensions",  "#F3F5E5", "#E4E7C8", "#C2CBA0", "#9BAD82", "#45643A", "#F7E5AE", "flower"],
  ["dailypractice", "#F5EFE2", "#F0DFBE", "#DCC592", "#BFA85E", "#75663A", "#FCEFC4", "sun"],
  ["success",     "#F3F5E5", "#DEE6D0", "#ADC9A6", "#8AB085", "#2C5A40", "#FAE7B2", "flag"],
  ["about",       "#F3F4E0", "#E5E5C4", "#C7CC9C", "#A6AC7C", "#5E693C", "#F3E4B4", "book"],
  ["supporters",  "#F3F5E5", "#E2E6CF", "#BFCDAE", "#9AB99A", "#35603F", "#F7E5B0", "heart"],
  ["contact",     "#F4F1E3", "#E8E3C6", "#CCC7A2", "#ADA77F", "#66613C", "#F3E3B4", "envelope"],
  ["faq",         "#F3F5E5", "#E3E8C8", "#C0CDA0", "#9BB47F", "#3E6237", "#F7E5B0", "sprint"],
  ["privacy",     "#F3F5E5", "#DEE6C6", "#B6CB98", "#8FAE7E", "#2C5A38", "#F9E7B2", "lock"],
  ["terms",       "#F4F1E3", "#E6E2C2", "#CAC899", "#ABAB79", "#60653B", "#F0E1B0", "book"],
  ["rulesalt",    "#F3F1E2", "#E2E3C0", "#BFC590", "#A0A069", "#5E6438", "#EFE0B4", "fence"],
];

function makeSvg({ name, skyTop, skyBottom, hillFar, hillMid, hillNear, sun, emblemBg, glyph }) {
  const ground = shade(hillNear, -0.35);
  const leaves = [
    leaf(`l1`, 90, 120, 1, -18, "#A8C0A5"),
    leaf(`l2`, 1110, 90, 1.1, 24, "#8FB28A"),
    leaf(`l3`, 1050, 320, 0.8, -40, "#F4E8BF"),
    leaf(`l4`, 140, 330, 0.9, 40, "#B7C8A4"),
    leaf(`l5`, 620, 70, 0.7, 8, "#F4E8BF"),
    leaf(`l6`, 340, 210, 0.65, -24, "#8FB28A"),
    leaf(`l7`, 880, 210, 0.7, 34, "#A8C0A5"),
  ].join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" role="img">
  <defs>
    <linearGradient id="sky-${name}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBottom}"/>
    </linearGradient>
    <radialGradient id="glow-${name}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${shade(sun, 0.35)}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${shade(sun, 0.35)}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gd-${name}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${hillNear}"/><stop offset="1" stop-color="${ground}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#sky-${name})"/>
  <circle cx="880" cy="190" r="330" fill="url(#glow-${name})"/>
  <circle cx="880" cy="190" r="66" fill="${shade(sun, 0.3)}"/>
  <circle cx="880" cy="190" r="46" fill="${sun}"/>
  <path d="M0 470 Q300 400 600 460 T1200 430 L1200 675 L0 675 Z" fill="${hillFar}"/>
  <path d="M0 520 Q360 450 760 520 T1200 505 L1200 675 L0 675 Z" fill="${hillMid}" opacity="0.92"/>
  <path d="M0 590 Q420 520 820 590 T1200 585 L1200 675 L0 675 Z" fill="url(#gd-${name})"/>
  ${leaves}
  <g opacity="0.9">
    <rect x="430" y="352" width="340" height="340" rx="170" fill="rgba(255,253,246,0.14)"/>
  </g>
  <g transform="translate(600 508)">
    <circle r="92" fill="rgba(255,253,246,0.16)"/>
    <circle r="70" fill="rgba(255,253,246,0.12)"/>
    <circle r="46" fill="${shade(emblemBg, -0.1)}"/>
    ${ICONS[glyph]}
  </g>
</svg>
`;
}

for (const page of PAGES) {
  writeFileSync(path.join(outDir, `${page[0]}.svg`), makeSvg({ name: page[0], skyTop: page[1], skyBottom: page[2], hillFar: page[3], hillMid: page[4], hillNear: page[5], sun: page[6], emblemBg: page[7], glyph: page[8] }));
  console.log(`generated ${page[0]}.svg`);
}
console.log(`Done. ${PAGES.length} assets -> ${outDir}`);