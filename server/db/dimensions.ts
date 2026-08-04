import { eq, asc } from "drizzle-orm";
import { lifeDimensions, InsertLifeDimension } from "../../drizzle/schema";
import { getDb } from "./client";

export async function getLifeDimensions() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(lifeDimensions).orderBy(asc(lifeDimensions.order));
}

export async function seedLifeDimensions() {
  const db = await getDb();
  if (!db) return;

  const dimensionData: InsertLifeDimension[] = [
    { slug: "work-career", label: "Work & Career", order: 1 },
    { slug: "aspirations-goals", label: "Aspirations & Goals", order: 2 },
    { slug: "impact-loved-ones", label: "Impact on Loved Ones", order: 3 },
    { slug: "behavioral-changes", label: "Behavioural Changes", order: 4 },
    { slug: "who-before", label: "Who They Were Before", order: 5 },
    { slug: "escaping-from", label: "What They Were Escaping", order: 6 },
    {
      slug: "getting-back-to",
      label: "What They Were Trying to Get Back To",
      order: 7,
    },
    { slug: "when-using", label: "What They Were Like When Using", order: 8 },
    { slug: "short-term-changes", label: "Short-Term Changes", order: 9 },
    { slug: "long-term-changes", label: "Long-Term Changes", order: 10 },
    { slug: "going-for", label: "What They Were Going For", order: 11 },
    {
      slug: "faith-relationship",
      label: "Relationship with God/Faith",
      order: 12,
    },
    { slug: "relationships", label: "Relationship with Others", order: 13 },
    { slug: "avoiding", label: "What They Were Avoiding", order: 14 },
    { slug: "not-avoiding", label: "What They Were NOT Avoiding", order: 15 },
    { slug: "physical-health", label: "Physical Health", order: 16 },
    { slug: "mental-health", label: "Mental Health", order: 17 },
    { slug: "financial", label: "Financial Situation", order: 18 },
    { slug: "daily-routines", label: "Daily Routines", order: 19 },
    { slug: "social-environment", label: "Social Environment", order: 20 },
    { slug: "self-image", label: "Self-Image", order: 21 },
  ];

  for (const dim of dimensionData) {
    const existing = await db
      .select()
      .from(lifeDimensions)
      .where(eq(lifeDimensions.slug, dim.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(lifeDimensions).values(dim);
    }
  }
}
