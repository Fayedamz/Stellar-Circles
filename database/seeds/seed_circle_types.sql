-- Seed: demo circles for each vertical type
-- Used for development and staging environments

INSERT INTO users (id, username, email, password_hash, bio) VALUES
  ('00000000-0000-0000-0000-000000000001', 'seed_admin', 'admin@stellarcircles.dev',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPJ2GGFSMcqZa', -- password: admin123
   'Stellar Circles seed administrator'),
  ('00000000-0000-0000-0000-000000000002', 'alice_learns', 'alice@example.com',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPJ2GGFSMcqZa',
   'Lifelong learner and study group organizer'),
  ('00000000-0000-0000-0000-000000000003', 'bob_builds', 'bob@example.com',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPJ2GGFSMcqZa',
   'Startup founder and business community member'),
  ('00000000-0000-0000-0000-000000000004', 'carol_fit', 'carol@example.com',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPJ2GGFSMcqZa',
   'Fitness enthusiast and group challenge organizer'),
  ('00000000-0000-0000-0000-000000000005', 'david_farm', 'david@example.com',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPJ2GGFSMcqZa',
   'Small-scale farmer and agricultural cooperative member')
ON CONFLICT DO NOTHING;

INSERT INTO circles (id, name, description, type, creator_id, member_count) VALUES
  ('10000000-0000-0000-0000-000000000001',
   'Web3 Study Group',
   'A circle for developers learning Stellar, Soroban, and decentralized systems together.',
   'LEARNING', '00000000-0000-0000-0000-000000000002', 1),

  ('10000000-0000-0000-0000-000000000002',
   'Nairobi Startup Circle',
   'East African founders collaborating on product, funding, and growth accountability.',
   'BUSINESS', '00000000-0000-0000-0000-000000000003', 1),

  ('10000000-0000-0000-0000-000000000003',
   'Morning Warriors Fitness',
   '5AM workout group tracking daily fitness habits and monthly challenges.',
   'FITNESS', '00000000-0000-0000-0000-000000000004', 1),

  ('10000000-0000-0000-0000-000000000004',
   'Smallholder Farmers Cooperative',
   'Sharing seasonal farming knowledge, cooperative buying, and harvest coordination.',
   'FARMING', '00000000-0000-0000-0000-000000000005', 1)
ON CONFLICT DO NOTHING;

INSERT INTO memberships (circle_id, user_id, role, status) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'ADMIN', 'ACTIVE'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'ADMIN', 'ACTIVE'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'ADMIN', 'ACTIVE'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005', 'ADMIN', 'ACTIVE')
ON CONFLICT DO NOTHING;
