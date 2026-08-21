import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";

const execFileAsync = promisify(execFile);
const baseUrl = process.env.REFORGE_PREVIEW_URL || "https://3000-i0wzf8dlr9akv7t941y4z-d9faf54e.us4.manus.computer";
const outputDir = process.env.REFORGE_AUTH_DEMO_DIR || "/home/ubuntu/reforge-auth-demo";
const framesDir = join(outputDir, "frames");
await mkdir(framesDir, { recursive: true });

const browser = await chromium.connectOverCDP("http://127.0.0.1:9222");
const context = browser.contexts()[0];
if (!context) throw new Error("No managed browser context found");
const page = context.pages()[0] || await context.newPage();
let frameIndex = 0;

async function captureFrame() {
  const filename = join(framesDir, `frame-${String(frameIndex++).padStart(5, "0")}.jpg`);
  await page.screenshot({ path: filename, type: "jpeg", quality: 78 });
}

async function hold(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    await captureFrame();
    await page.waitForTimeout(100);
  }
}

async function visit(path, prepare) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(650);
  if (prepare) await prepare();
  await hold(2100);
}

await visit("/");
await visit("/check-in", async () => {
  const sliders = page.locator('input[type="range"]');
  if (await sliders.count()) await sliders.nth(0).fill("7");
  const notes = page.locator("textarea");
  if (await notes.count()) await notes.fill("A demo reflection prepared for the feature walkthrough.");
});
await visit("/journal", async () => {
  const journal = page.locator("textarea");
  if (await journal.count()) await journal.fill("A private reflection prepared for the walkthrough.");
});
await visit("/goals", async () => {
  const goal = page.locator('input[placeholder*="walk"]');
  if (await goal.count()) await goal.fill("Take a short walk after work");
});
await visit("/music", async () => {
  const inputs = page.locator("input");
  if (await inputs.count() >= 3) {
    await inputs.nth(0).fill("club mixes");
    await inputs.nth(2).fill("jazz, acoustic");
  }
});
await visit("/guides", async () => {
  const firstDimension = page.locator("button").filter({ hasText: "Work & Career" }).first();
  if (await firstDimension.count()) await firstDimension.click();
});
await visit("/settings");
await visit("/onboarding");
await hold(500);

await execFileAsync("ffmpeg", [
  "-y",
  "-framerate", "10",
  "-i", join(framesDir, "frame-%05d.jpg"),
  "-c:v", "libvpx-vp9",
  "-pix_fmt", "yuv420p",
  join(outputDir, "reforge-authenticated-demo.webm"),
]);
console.log(`Authenticated demo written to ${join(outputDir, "reforge-authenticated-demo.webm")}`);
process.exit(0);
