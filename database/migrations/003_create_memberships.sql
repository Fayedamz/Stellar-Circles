-- Migration: 003_create_memberships
-- Memberships join users to circles with a role and status.

CREATE TYPE member_role   AS ENUM ('ADMIN', 'MEMBER');
CREATE TYPE member_status AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

CREATE TABLE IF NOT EXISTS memberships (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id   UUID          NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id     UUID          NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  role        member_role   NOT NULL DEFAULT 'MEMBER',
  status      member_status NOT NULL DEFAULT 'ACTIVE',
  joined_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE(circle_id, user_id)
);

CREATE INDEX idx_memberships_circle  ON memberships(circle_id, status);
CREATE INDEX idx_memberships_user    ON memberships(user_id, status);
