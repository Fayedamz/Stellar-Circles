-- Migration: 002_create_circles
-- Circles are micro-societies. Each has a type (vertical), membership model, and rules.

CREATE TYPE circle_type AS ENUM ('LEARNING', 'BUSINESS', 'FITNESS', 'FARMING');
CREATE TYPE circle_status AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');
CREATE TYPE membership_type AS ENUM ('OPEN', 'INVITE');

CREATE TABLE IF NOT EXISTS circles (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(80)   NOT NULL,
  description      TEXT          NOT NULL,
  type             circle_type   NOT NULL,
  status           circle_status NOT NULL DEFAULT 'ACTIVE',
  membership_type  membership_type NOT NULL DEFAULT 'OPEN',
  rules            JSONB         NOT NULL DEFAULT '{}',
  creator_id       UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  member_count     INTEGER       NOT NULL DEFAULT 0 CHECK (member_count >= 0),
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_circles_type       ON circles(type);
CREATE INDEX idx_circles_status     ON circles(status);
CREATE INDEX idx_circles_creator    ON circles(creator_id);
CREATE INDEX idx_circles_name_trgm  ON circles USING gin(name gin_trgm_ops);

-- Enable trigram search for name lookups
CREATE EXTENSION IF NOT EXISTS pg_trgm;
