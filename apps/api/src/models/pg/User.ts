/**
 * PostgreSQL User model (Knex query builder).
 *
 * Table: users
 *   id            UUID PRIMARY KEY
 *   stellar_address VARCHAR(56) UNIQUE  -- Stellar G... public key (optional)
 *   username      VARCHAR(50) UNIQUE NOT NULL
 *   email         VARCHAR(255) UNIQUE NOT NULL
 *   password_hash VARCHAR(255) NOT NULL
 *   avatar_url    TEXT
 *   bio           TEXT
 *   created_at    TIMESTAMPTZ DEFAULT NOW()
 *   updated_at    TIMESTAMPTZ DEFAULT NOW()
 */

import { getPostgresClient } from '../../config/database';

const TABLE = 'users';

export interface UserRow {
  id: string;
  stellar_address: string | null;
  username: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  stellar_address?: string;
  avatar_url?: string;
  bio?: string;
}

export const UserModel = {
  async findById(id: string): Promise<UserRow | undefined> {
    const db = getPostgresClient();
    return db<UserRow>(TABLE).where({ id }).first();
  },

  async findByEmail(email: string): Promise<UserRow | undefined> {
    const db = getPostgresClient();
    return db<UserRow>(TABLE).where({ email }).first();
  },

  async findByUsername(username: string): Promise<UserRow | undefined> {
    const db = getPostgresClient();
    return db<UserRow>(TABLE).where({ username }).first();
  },

  async create(data: CreateUserRow): Promise<UserRow> {
    const db = getPostgresClient();
    const [row] = await db<UserRow>(TABLE).insert(data).returning('*');
    return row;
  },

  async updateById(id: string, updates: Partial<UserRow>): Promise<UserRow | undefined> {
    const db = getPostgresClient();
    const [row] = await db<UserRow>(TABLE)
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning('*');
    return row;
  },

  async deleteById(id: string): Promise<void> {
    const db = getPostgresClient();
    await db<UserRow>(TABLE).where({ id }).delete();
  },
};
