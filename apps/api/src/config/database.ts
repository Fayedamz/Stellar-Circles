import knex, { Knex } from "knex";
import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

// ─── PostgreSQL via Knex ──────────────────────────────────────────────────────

export const db: Knex = knex({
  client: "pg",
  connection: env.DATABASE_URL,
  pool: { min: 2, max: 10 },
  migrations: {
    directory: "../../../database/migrations",
    extension: "sql",
  },
});

export async function connectPostgres(): Promise<void> {
  await db.raw("SELECT 1");
  logger.info("PostgreSQL connected");
}

// ─── MongoDB via Mongoose ─────────────────────────────────────────────────────

export async function connectMongo(): Promise<void> {
  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  logger.info("MongoDB connected");
}

export async function connectDatabases(): Promise<void> {
  await Promise.all([connectPostgres(), connectMongo()]);
}

export async function disconnectDatabases(): Promise<void> {
  await Promise.all([db.destroy(), mongoose.disconnect()]);
}
