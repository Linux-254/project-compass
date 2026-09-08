import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

let _db: ReturnType<typeof drizzle> | null = null;
let _probe: Promise<ReturnType<typeof drizzle> | null> | null = null;

// True when the configured database could not be reached (or is not configured).
// In this mode every data-access layer falls back to bundled demo fixtures so
// the whole product surface stays viewable on localhost without a live Postgres.
export let demoMode = false;

// Lazily create the postgres pool + drizzle instance so local tooling
// (generate, check, tests) can run without a live database.
export async function getDb() {
  if (_db) return _db;
  if (_probe) return _probe;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    demoMode = true;
    return null;
  }

  _probe = (async () => {
    try {
      const client = postgres(databaseUrl, {
        max: 10,
        connect_timeout: 5,
      });
      // Probe with a trivial round-trip so an unreachable host (de-provisioned
      // Supabase project, offline network) flips to demo mode instead of
      // throwing on every query.
      await client`select 1`;
      _db = drizzle(client);
      console.log("[Database] Connected.");
      return _db;
    } catch (error) {
      console.warn(
        "[Database] Unavailable — running in demo mode with sample data:",
        (error as Error).message ?? String(error)
      );
      _db = null;
      demoMode = true;
      return null;
    }
  })();

  return _probe;
}

export type DB = ReturnType<typeof drizzle>;