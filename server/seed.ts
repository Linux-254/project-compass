import { and, eq } from "drizzle-orm";
import {
  lifeDimensions,
  resources,
  newsletterIssues,
  activityGuides,
} from "../drizzle/schema";
import { getDb } from "./db/client";
import { seedLifeDimensions } from "./db/dimensions";
import { resourceSeeds, newsletterSeeds } from "./seed-content";

async function seedResources() {
  const db = await getDb();
  if (!db)
    throw new Error("DATABASE_URL is required to seed. Set it and re-run.");

  const dims = await db.select().from(lifeDimensions);
  const bySlug = new Map(dims.map(d => [d.slug, d.id]));

  for (const seed of resourceSeeds) {
    const existing = await db
      .select()
      .from(resources)
      .where(
        and(eq(resources.title, seed.title), eq(resources.type, seed.type))
      )
      .limit(1);

    if (existing.length > 0) continue;

    const dimensionId = seed.dimensionSlug
      ? (bySlug.get(seed.dimensionSlug) ?? null)
      : null;

    const [resource] = await db
      .insert(resources)
      .values({
        type: seed.type,
        title: seed.title,
        body: seed.body,
        tags: seed.tags,
        faithVariant: seed.faithVariant,
        dimensionId,
        publishedAt: new Date(),
      })
      .returning({ id: resources.id });

    if (seed.type === "activity_guide" && resource) {
      await db.insert(activityGuides).values({
        resourceId: resource.id,
        timeAvailable: "flexible",
        energyLevel: "medium",
      });
    }
  }

  console.log(
    `[Seed] resources seeded (${resourceSeeds.length} definitions checked)`
  );
}

async function seedNewsletterIssues() {
  const db = await getDb();
  if (!db) return;

  const now = new Date();
  for (const seed of newsletterSeeds) {
    const existing = await db
      .select()
      .from(newsletterIssues)
      .where(eq(newsletterIssues.subject, seed.subject))
      .limit(1);

    if (existing.length > 0) continue;

    const scheduledFor = new Date(
      now.getTime() + seed.daysAhead * 24 * 60 * 60 * 1000
    );

    await db.insert(newsletterIssues).values({
      type: seed.type,
      subject: seed.subject,
      body: seed.body,
      scheduledFor,
    });
  }

  console.log(
    `[Seed] newsletter issues seeded (${newsletterSeeds.length} definitions checked)`
  );
}

async function main() {
  console.log("[Seed] starting…");
  await seedLifeDimensions();
  console.log("[Seed] life dimensions ensured (21)");
  await seedResources();
  await seedNewsletterIssues();
  console.log("[Seed] complete");
  process.exit(0);
}

main().catch(error => {
  console.error("[Seed] failed:", error);
  process.exit(1);
});
