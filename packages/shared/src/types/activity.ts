/**
 * Activity — any logged contribution inside a circle.
 * Activities are stored in MongoDB for high-volume append-only writes.
 * Each activity optionally carries a Stellar transaction hash for immutable anchoring.
 */

export enum ActivityType {
  // Learning
  SESSION_ATTENDED    = "SESSION_ATTENDED",
  RESOURCE_SHARED     = "RESOURCE_SHARED",
  SKILL_MILESTONE     = "SKILL_MILESTONE",
  PEER_MENTORED       = "PEER_MENTORED",

  // Business
  IDEA_SUBMITTED      = "IDEA_SUBMITTED",
  TASK_COMPLETED      = "TASK_COMPLETED",
  PROGRESS_UPDATE     = "PROGRESS_UPDATE",
  ACCOUNTABILITY_CHECK = "ACCOUNTABILITY_CHECK",

  // Fitness
  WORKOUT_LOGGED      = "WORKOUT_LOGGED",
  CHALLENGE_COMPLETED = "CHALLENGE_COMPLETED",
  HABIT_CHECKED       = "HABIT_CHECKED",
  PERSONAL_RECORD     = "PERSONAL_RECORD",

  // Farming
  PLANTING_LOGGED     = "PLANTING_LOGGED",
  HARVEST_RECORDED    = "HARVEST_RECORDED",
  KNOWLEDGE_SHARED    = "KNOWLEDGE_SHARED",
  COOPERATIVE_TASK    = "COOPERATIVE_TASK",

  // General
  DISCUSSION_POST     = "DISCUSSION_POST",
  DECISION_VOTED      = "DECISION_VOTED",
  MEMBER_ENDORSED     = "MEMBER_ENDORSED",
}

/** Weight multipliers per activity type — used in influence calculation */
export const ACTIVITY_WEIGHTS: Record<ActivityType, number> = {
  [ActivityType.SESSION_ATTENDED]:     1.0,
  [ActivityType.RESOURCE_SHARED]:      1.2,
  [ActivityType.SKILL_MILESTONE]:      2.0,
  [ActivityType.PEER_MENTORED]:        1.8,
  [ActivityType.IDEA_SUBMITTED]:       1.3,
  [ActivityType.TASK_COMPLETED]:       1.5,
  [ActivityType.PROGRESS_UPDATE]:      1.0,
  [ActivityType.ACCOUNTABILITY_CHECK]: 1.1,
  [ActivityType.WORKOUT_LOGGED]:       1.0,
  [ActivityType.CHALLENGE_COMPLETED]:  1.8,
  [ActivityType.HABIT_CHECKED]:        0.8,
  [ActivityType.PERSONAL_RECORD]:      2.0,
  [ActivityType.PLANTING_LOGGED]:      1.0,
  [ActivityType.HARVEST_RECORDED]:     1.5,
  [ActivityType.KNOWLEDGE_SHARED]:     1.3,
  [ActivityType.COOPERATIVE_TASK]:     1.6,
  [ActivityType.DISCUSSION_POST]:      0.7,
  [ActivityType.DECISION_VOTED]:       1.2,
  [ActivityType.MEMBER_ENDORSED]:      1.0,
};

export interface Activity {
  id: string;
  userId: string;
  circleId: string;
  type: ActivityType;
  description: string;
  /** Optional structured data — e.g. { reps: 20, weight: "80kg" } for fitness */
  metadata?: Record<string, unknown>;
  /** Stellar transaction hash — present if this activity was anchored on-chain */
  stellarTxHash?: string;
  influenceDelta?: number;
  timestamp: string;
}

export interface LogActivityInput {
  circleId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  /** Whether to anchor this activity on Stellar (optional) */
  anchorOnStellar?: boolean;
}
