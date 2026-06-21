-- Migration: 001_create_users
-- Users table — core identity record.
-- Stellar address is optional; users can link it later for blockchain anchoring.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username         VARCHAR(30)  NOT NULL UNIQUE,
  email            VARCHAR(255) NOT NULL UNIQUE,
  password_hash    TEXT         NOT NULL,
  stellar_address  VARCHAR(56)  UNIQUE,          -- G... Stellar public key
  avatar_url       TEXT,
  bio              VARCHAR(500),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_stellar  ON users(stellar_address) WHERE stellar_address IS NOT NULL;
