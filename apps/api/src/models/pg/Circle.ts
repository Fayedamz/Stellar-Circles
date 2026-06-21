/**
 * PostgreSQL Circle model (Knex query builder).
 *
 * Table: circles
 *   id              UUID PRIMARY KEY
 *   name            VARCHAR(100) NOT NULL
 *   description     TEXT
 *   type            circle_type ENUM (LEARNING, BUSINESS, FITNESS, FARMING)
 *   creator_id      UUID REFERENCES users(id)
 *   membership_type membership_type ENUM (OPEN, INVITE_ONLY)
 *   status          circle_status ENUM (ACTIVE, ARCHIVED, SUSPENDED)
 *   rules           JSONB DEFAULT '[]'
 *   created_at      TIMESTAMPTZ DEFAULT NOW()
 *   updated_at      TIMESTAMPTZ DEFAULT NOW()
 */

import { CircleType, MembershipType, CircleStatus } from '@stellar-circles/shared';
import { getPostgresClient } from '../../config/database';

const TABLE = 'circles';

export interface CircleRow {
  id: string;
  name: string;
  description: string;
  type: CircleType;
  creator_id: string;
  membership_type: MembershipType;
  status: CircleStatus;
  rules: Array<{ id: string; title: string; description: string; created_at: string }>;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCircleRow {
  id: string;
  name: string;
  description: string;
  type: CircleType;
  creator_id: string;
  membership_type: MembershipType;
  rules?: CircleRow['rules'];
}

export const CircleModel = {
  async findById(id: string): Promise<CircleRow | undefined> {
    const db = getPostgresClient();
    return db<CircleRow>(TABLE).where({ id }).first();
  },

  async findAll(filters?: {
    type?: CircleType;
    status?: CircleStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<CircleRow[]> {
    const db = getPostgresClient();
    let query = db<CircleRow>(TABLE).where({ status: CircleStatus.ACTIVE });

    if (filters?.type) query = query.where({ type: filters.type });
    if (filters?.search) {
      query = query.where((builder) =>
        builder
          .whereILike('name', `%${filters.search}%`)
          .orWhereILike('description', `%${filters.search}%`)
      );
    }
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.offset(filters.offset);

    return query.orderBy('created_at', 'desc');
  },

  async findByCreator(creatorId: string): Promise<CircleRow[]> {
    const db = getPostgresClient();
    return db<CircleRow>(TABLE).where({ creator_id: creatorId });
  },

  async create(data: CreateCircleRow): Promise<CircleRow> {
    const db = getPostgresClient();
    const [row] = await db<CircleRow>(TABLE)
      .insert({ ...data, rules: JSON.stringify(data.rules ?? []) })
      .returning('*');
    return row;
  },

  async updateById(id: string, updates: Partial<CircleRow>): Promise<CircleRow | undefined> {
    const db = getPostgresClient();
    const [row] = await db<CircleRow>(TABLE)
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning('*');
    return row;
  },

  async getMemberCount(circleId: string): Promise<number> {
    const db = getPostgresClient();
    const result = await db('memberships')
      .where({ circle_id: circleId, status: 'ACTIVE' })
      .count('id as count')
      .first();
    return parseInt(String(result?.count ?? '0'), 10);
  },
};
