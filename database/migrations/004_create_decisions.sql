-- Migration: 004_create_decisions
-- Proposals within a circle. Voting is influence-weighted.

CREATE TYPE decision_status AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'EXECUTED');

CREATE TABLE IF NOT EXISTS decisions (
  id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id   UUID            NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  creator_id  UUID            NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
  title       VARCHAR(200)    NOT NULL,
  description TEXT            NOT NULL,
  status      decision_status NOT NULL DEFAULT 'OPEN',
  result      JSONB,                        -- populated when status = CLOSED
  closes_at   TIMESTAMPTZ     NOT NULL,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decisions_circle  ON decisions(circle_id, status);
CREATE INDEX idx_decisions_closes  ON decisions(closes_at) WHERE status = 'OPEN';
