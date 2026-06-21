-- Seed: additional demo members, activities, and decisions
-- Run after seed_circle_types.sql

-- Add more members to the demo circles
INSERT INTO memberships (circle_id, user_id, role, status) VALUES
  -- Web3 Study Group: alice is admin, others join
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'MEMBER', 'ACTIVE'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'MEMBER', 'ACTIVE'),

  -- Nairobi Startup Circle: bob is admin, alice joins
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'MEMBER', 'ACTIVE'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'MEMBER', 'ACTIVE'),

  -- Morning Warriors: carol is admin, bob joins
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'MEMBER', 'ACTIVE'),

  -- Farming Cooperative: david is admin, carol joins
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'MEMBER', 'ACTIVE')
ON CONFLICT DO NOTHING;

-- Update member counts to reflect the above
UPDATE circles SET member_count = 3 WHERE id = '10000000-0000-0000-0000-000000000001';
UPDATE circles SET member_count = 3 WHERE id = '10000000-0000-0000-0000-000000000002';
UPDATE circles SET member_count = 2 WHERE id = '10000000-0000-0000-0000-000000000003';
UPDATE circles SET member_count = 2 WHERE id = '10000000-0000-0000-0000-000000000004';

-- Demo decisions
INSERT INTO decisions (id, circle_id, creator_id, title, description, status, closes_at, created_at, updated_at) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Adopt a weekly 2-hour study session format',
    'Should we commit to meeting every Saturday from 10am-12pm for structured learning? This would replace the current ad-hoc approach.',
    'OPEN',
    NOW() + INTERVAL '7 days',
    NOW(),
    NOW()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Host a monthly Demo Day for circle members',
    'Proposal to hold a monthly 30-minute demo session where members share progress on their projects and get feedback from the circle.',
    'OPEN',
    NOW() + INTERVAL '5 days',
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- Demo influence snapshots
INSERT INTO influence_snapshots (user_id, circle_id, score, streak_weeks, consistency_multiplier, quality_factor, total_decay, computed_at) VALUES
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 42.5, 4, 1.4, 1.25, 2.1, NOW()),
  ('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 18.2, 2, 1.2, 1.0,  0.0, NOW()),
  ('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 9.8,  1, 1.1, 0.9,  0.0, NOW()),
  ('00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 55.0, 6, 1.6, 1.3,  4.5, NOW()),
  ('00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 22.0, 3, 1.3, 1.1,  1.0, NOW()),
  ('00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 38.0, 5, 1.5, 1.2,  3.0, NOW()),
  ('00000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000004', 61.0, 8, 1.8, 1.4,  6.0, NOW())
ON CONFLICT DO NOTHING;
