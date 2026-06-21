/**
 * Environment variable validation.
 * Fails fast on startup if required variables are missing.
 */

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  NODE_ENV:    optional("NODE_ENV", "development"),
  PORT:        parseInt(optional("PORT", "4000"), 10),

  // PostgreSQL
  DATABASE_URL: optional(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/stellar_circles"
  ),

  // MongoDB
  MONGO_URI: optional("MONGO_URI", "mongodb://localhost:27017/stellar_circles"),

  // Redis
  REDIS_URL: optional("REDIS_URL", "redis://localhost:6379"),

  // JWT
  JWT_SECRET:     optional("JWT_SECRET", "dev_secret_change_in_production"),
  JWT_EXPIRES_IN: optional("JWT_EXPIRES_IN", "7d"),

  // Stellar
  STELLAR_NETWORK:     optional("STELLAR_NETWORK", "testnet"),
  STELLAR_HORIZON_URL: optional("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org"),
  STELLAR_ISSUER_SECRET: process.env.STELLAR_ISSUER_SECRET,

  isDev:  () => env.NODE_ENV === "development",
  isProd: () => env.NODE_ENV === "production",
};
