-- Migration: 006_create_influence_snapshots
-- Periodic snapshots of each member's influence score per circle.
-- Multiple snapshots are kept for history; latest is used for voting weight.

CREATE TABLE IF NOT EXISTS influence_snapshots (
  id                     UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID         NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  circle_id              UUID         NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  score                  NUMERIC(14, 4) NOT NULL DEFAULT 0,
  streak_weeks           INTEGER      NOT NULL DEFAULT 0,
  consistency_multiplier NUMERIC(6, 4)  NOT NULL DEFAULT 1.0,
  quality_factor         NUMERIC(6, 4)  NOT NULL DEFAULT 1.0,
  total_decay            NUMERIC(14, 4) NOT NULL DEFAULT 0,
  computed_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_influence_user_circle  ON influence_snapshots(user_id, circle_id, computed_at DESC);
CREATE INDEX idx_influence_circle_score ON influence_snapshots(circle_id, score DESC);
