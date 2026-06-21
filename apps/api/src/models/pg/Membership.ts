/**
 * PostgreSQL Membership model (Knex query builder).
 *
 * Table: memberships
 *   id          UUID PRIMARY KEY
 *   circle_id   UUID REFERENCES circles(id) ON DELETE CASCADE
 *   user_id     UUID REFERENCES users(id) ON DELETE CASCADE
 *   role        member_role ENUM (ADMIN, MEMBER)
 *   status      member_status ENUM (ACTIVE, INACTIVE, BANNED, PENDING)
 *   joined_at   TIMESTAMPTZ DEFAULT NOW()
 *
 * Unique constraint: (circle_id, user_id)
 */

import { MemberRole, MemberStatus } from '@stellar-circles/shared';
import { getPostgresClient } from '../../config/database';

const TABLE = 'memberships';

export interface MembershipRow {
  id: string;
  circle_id: string;
  user_id: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at: Date;
}

export interface CreateMembershipRow {
  id: string;
  circle_id: string;
  user_id: string;
  role?: MemberRole;
  status?: MemberStatus;
}

export const MembershipModel = {
  async findById(id: string): Promise<MembershipRow | undefined> {
    const db = getPostgresClient();
    return db<MembershipRow>(TABLE).where({ id }).first();
  },

  async findByCircleAndUser(
    circleId: string,
    userId: string
  ): Promise<MembershipRow | undefined> {
    const db = getPostgresClient();
    return db<MembershipRow>(TABLE).where({ circle_id: circleId, user_id: userId }).first();
  },

  async findByCircle(circleId: string): Promise<MembershipRow[]> {
    const db = getPostgresClient();
    return db<MembershipRow>(TABLE)
      .where({ circle_id: circleId, status: MemberStatus.ACTIVE })
      .orderBy('joined_at', 'asc');
  },

  async findByUser(userId: string): Promise<MembershipRow[]> {
    const db = getPostgresClient();
    return db<MembershipRow>(TABLE)
      .where({ user_id: userId, status: MemberStatus.ACTIVE });
  },

  async create(data: CreateMembershipRow): Promise<MembershipRow> {
    const db = getPostgresClient();
    const [row] = await db<MembershipRow>(TABLE)
      .insert({
        role: MemberRole.MEMBER,
        status: MemberStatus.ACTIVE,
        ...data,
      })
      .returning('*');
    return row;
  },

  async updateStatus(id: string, status: MemberStatus): Promise<MembershipRow | undefined> {
    const db = getPostgresClient();
    const [row] = await db<MembershipRow>(TABLE)
      .where({ id })
      .update({ status })
      .returning('*');
    return row;
  },

  async updateRole(id: string, role: MemberRole): Promise<MembershipRow | undefined> {
    const db = getPostgresClient();
    const [row] = await db<MembershipRow>(TABLE)
      .where({ id })
      .update({ role })
      .returning('*');
    return row;
  },

  async delete(circleId: string, userId: string): Promise<void> {
    const db = getPostgresClient();
    await db<MembershipRow>(TABLE).where({ circle_id: circleId, user_id: userId }).delete();
  },
};
