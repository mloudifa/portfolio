import { promises as fs } from "node:fs";
import path from "node:path";
import type { DbShape } from "./types";
import { createSeedDb } from "./seed";

/**
 * File-backed JSON data store.
 * The whole application state (profile, projects, media, blog, messages,
 * admin user) lives in a single `data/db.json` file. Reads are always fresh
 * and writes are atomic (write-to-temp + rename) so a crash never corrupts
 * the file. Swapping this module for a real database later is trivial — the
 * repository layer above it already exposes a stable, typed API.
 */
export const DB_PATH =
  process.env.DATA_FILE ?? path.join(process.cwd(), "data", "db.json");

let queue: Promise<unknown> = Promise.resolve();

/** Serialize read-modify-write cycles to prevent clobbering. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/** Read the JSON file, seeding it on first use. Callers must hold the lock. */
async function readDb(): Promise<DbShape> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw) as DbShape;
  } catch {
    const seed = await createSeedDb();
    await writeDb(seed);
    return seed;
  }
}

export async function getDb(): Promise<DbShape> {
  return withLock(readDb);
}

export async function writeDb(db: DbShape): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const tmp = `${DB_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_PATH);
}

export async function updateDb(
  mutator: (db: DbShape) => void | Promise<void>,
): Promise<DbShape> {
  return withLock(async () => {
    const db = await readDb();
    await mutator(db);
    db.updatedAt = new Date().toISOString();
    await writeDb(db);
    return db;
  });
}
