-- Migration: 005_create_votes
-- Votes on decisions, weighted by the member's influence score at time of voting.

CREATE TYPE vote_choice AS ENUM ('FOR', 'AGAINST', 'ABSTAIN');

CREATE TABLE IF NOT EXISTS votes (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id      UUID        NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES users(id)     ON DELETE RESTRICT,
  choice           vote_choice NOT NULL,
  -- Influence weight is snapshotted at vote time — not retroactively changed
  influence_weight NUMERIC(12, 6) NOT NULL DEFAULT 1.0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(decision_id, user_id)  -- one vote per member per decision
);

CREATE INDEX idx_votes_decision ON votes(decision_id);
CREATE INDEX idx_votes_user     ON votes(user_id);
