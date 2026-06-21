/**
 * Influence — the social capital model at the heart of Stellar Circles.
 *
 * Influence is:
 *  - Non-transferable: cannot be sent, sold, or delegated
 *  - Non-tokenized: exists only as a social signal, not an asset
 *  - Context-specific: your score in a Fitness circle is independent
 *    of your score in a Business circle
 *  - Living: decays with inactivity, grows with consistent contribution
 *
 * Formula:
 *   score = (participation_count × activity_weight)
 *           × consistency_multiplier
 *           × quality_factor
 *           − decay_penalty
 */

export interface InfluenceScore {
  id: string;
  userId: string;
  circleId: string;
  /** Raw computed score */
  score: number;
  /** Streak of consecutive active weeks */
  streakWeeks: number;
  /** Multiplier applied from streak (1.0 – 2.0) */
  consistencyMultiplier: number;
  /** Peer-rated quality factor (0.5 – 1.5) */
  qualityFactor: number;
  /** Total decay applied over lifetime */
  totalDecay: number;
  /** Percentile rank within the circle (0–100) */
  percentileRank?: number;
  computedAt: string;
}

export enum InfluenceEventType {
  ACTIVITY_LOGGED    = "ACTIVITY_LOGGED",
  DECISION_VOTED     = "DECISION_VOTED",
  PEER_ENDORSEMENT   = "PEER_ENDORSEMENT",
  STREAK_BONUS       = "STREAK_BONUS",
  INACTIVITY_DECAY   = "INACTIVITY_DECAY",
  QUALITY_ADJUSTMENT = "QUALITY_ADJUSTMENT",
}

export interface InfluenceEvent {
  id: string;
  userId: string;
  circleId: string;
  type: InfluenceEventType;
  delta: number;          // positive = gain, negative = decay/penalty
  reason: string;
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

/** Leaderboard entry for a circle */
export interface InfluenceLeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  score: number;
  streakWeeks: number;
  percentileRank: number;
}
