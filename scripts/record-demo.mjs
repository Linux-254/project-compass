import { chromium } from "playwright";
import { mkdir, rm } from "node:fs/promises";

const baseUrl = process.env.REFORGE_PREVIEW_URL || "https://3000-i0wzf8dlr9akv7t941y4z-d9faf54e.us4.manus.computer";
const outputDir = process.env.REFORGE_DEMO_DIR || "/home/ubuntu/reforge-demo";

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  viewport: { width: 1440, height: 900 },
  args: ["--disable-dev-shm-usage", "--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: outputDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();

async function visit(path, label, prepare) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  if (prepare) await prepare();
  await page.waitForTimeout(1400);
}

await visit("/", "dashboard");
await visit("/check-in", "check-in", async () => {
  const sliders = page.locator('input[type="range"]');
  if (await sliders.count()) await sliders.nth(0).fill("7");
  const notes = page.locator("textarea");
  if (await notes.count()) await notes.fill("A demo reflection prepared for the feature walkthrough.");
});
await visit("/journal", "journal", async () => {
  const journal = page.locator("textarea");
  if (await journal.count()) await journal.fill("A private reflection prepared for the walkthrough.");
});
await visit("/goals", "goals", async () => {
  const goal = page.locator('input[placeholder*="walk"]');
  if (await goal.count()) await goal.fill("Take a short walk after work");
});
await visit("/music", "music", async () => {
  const inputs = page.locator("input");
  if (await inputs.count() >= 3) {
    await inputs.nth(0).fill("club mixes");
    await inputs.nth(2).fill("jazz, acoustic");
  }
});
await visit("/guides", "guides", async () => {
  const firstDimension = page.locator('button').filter({ hasText: "Work & Career" }).first();
  if (await firstDimension.count()) await firstDimension.click();
});
await visit("/settings", "settings");
await visit("/onboarding", "onboarding");

await context.close();
await browser.close();
console.log(`Demo video written to ${outputDir}`);
