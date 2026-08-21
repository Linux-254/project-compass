import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the postgres pool + drizzle instance so local tooling
// (generate, check, tests) can run without a live database.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { max: 10 });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export type DB = ReturnType<typeof drizzle>;
