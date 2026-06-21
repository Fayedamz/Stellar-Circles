/**
 * PostgreSQL Decision and Vote models (Knex query builder).
 *
 * Table: decisions
 *   id           UUID PRIMARY KEY
 *   circle_id    UUID REFERENCES circles(id)
 *   creator_id   UUID REFERENCES users(id)
 *   title        VARCHAR(255) NOT NULL
 *   description  TEXT
 *   status       decision_status ENUM (DRAFT, OPEN, CLOSED, EXECUTED, CANCELLED)
 *   closes_at    TIMESTAMPTZ NOT NULL
 *   created_at   TIMESTAMPTZ DEFAULT NOW()
 *   updated_at   TIMESTAMPTZ DEFAULT NOW()
 *
 * Table: votes
 *   id               UUID PRIMARY KEY
 *   decision_id      UUID REFERENCES decisions(id)
 *   user_id          UUID REFERENCES users(id)
 *   influence_weight DECIMAL(10,2) NOT NULL  -- snapshot of voter's influence at vote time
 *   choice           vote_choice ENUM (FOR, AGAINST, ABSTAIN)
 *   created_at       TIMESTAMPTZ DEFAULT NOW()
 *
 * Unique constraint on votes: (decision_id, user_id)
 */

import { DecisionStatus, VoteChoice } from '@stellar-circles/shared';
import { getPostgresClient } from '../../config/database';

const DECISIONS_TABLE = 'decisions';
const VOTES_TABLE = 'votes';

export interface DecisionRow {
  id: string;
  circle_id: string;
  creator_id: string;
  title: string;
  description: string;
  status: DecisionStatus;
  closes_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface VoteRow {
  id: string;
  decision_id: string;
  user_id: string;
  influence_weight: number;
  choice: VoteChoice;
  created_at: Date;
}

export const DecisionModel = {
  async findById(id: string): Promise<DecisionRow | undefined> {
    const db = getPostgresClient();
    return db<DecisionRow>(DECISIONS_TABLE).where({ id }).first();
  },

  async findByCircle(circleId: string): Promise<DecisionRow[]> {
    const db = getPostgresClient();
    return db<DecisionRow>(DECISIONS_TABLE)
      .where({ circle_id: circleId })
      .orderBy('created_at', 'desc');
  },

  async create(data: Omit<DecisionRow, 'created_at' | 'updated_at'>): Promise<DecisionRow> {
    const db = getPostgresClient();
    const [row] = await db<DecisionRow>(DECISIONS_TABLE).insert(data).returning('*');
    return row;
  },

  async updateStatus(id: string, status: DecisionStatus): Promise<DecisionRow | undefined> {
    const db = getPostgresClient();
    const [row] = await db<DecisionRow>(DECISIONS_TABLE)
      .where({ id })
      .update({ status, updated_at: new Date() })
      .returning('*');
    return row;
  },

  async castVote(data: Omit<VoteRow, 'created_at'>): Promise<VoteRow> {
    const db = getPostgresClient();
    const [row] = await db<VoteRow>(VOTES_TABLE).insert(data).returning('*');
    return row;
  },

  async findVote(decisionId: string, userId: string): Promise<VoteRow | undefined> {
    const db = getPostgresClient();
    return db<VoteRow>(VOTES_TABLE).where({ decision_id: decisionId, user_id: userId }).first();
  },

  async getVotesForDecision(decisionId: string): Promise<VoteRow[]> {
    const db = getPostgresClient();
    return db<VoteRow>(VOTES_TABLE).where({ decision_id: decisionId });
  },

  /**
   * Compute the weighted tally for a decision.
   * Returns sums of influence_weight grouped by choice.
   */
  async getTally(decisionId: string): Promise<Record<VoteChoice, number>> {
    const db = getPostgresClient();
    const rows = await db<VoteRow>(VOTES_TABLE)
      .where({ decision_id: decisionId })
      .select('choice')
      .sum('influence_weight as total')
      .groupBy('choice');

    const tally: Record<string, number> = {
      [VoteChoice.FOR]: 0,
      [VoteChoice.AGAINST]: 0,
      [VoteChoice.ABSTAIN]: 0,
    };

    for (const row of rows) {
      tally[row.choice] = parseFloat(String((row as { total: string }).total ?? '0'));
    }

    return tally as Record<VoteChoice, number>;
  },
};
