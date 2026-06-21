/**
 * Circle types — the four verticals of Stellar Circles.
 * Each type unlocks specific activity templates and tracking metrics.
 */
export enum CircleType {
  LEARNING = "LEARNING",   // Study groups, knowledge sharing, skill progression
  BUSINESS = "BUSINESS",   // Startup collaboration, accountability, idea validation
  FITNESS  = "FITNESS",    // Workout tracking, challenges, health habits
  FARMING  = "FARMING",    // Agricultural cooperation, seasonal planning
}

export enum CircleStatus {
  ACTIVE   = "ACTIVE",
  PAUSED   = "PAUSED",
  ARCHIVED = "ARCHIVED",
}

/** Open: anyone can join. Invite: requires an invitation link or admin approval. */
export enum MembershipType {
  OPEN   = "OPEN",
  INVITE = "INVITE",
}

export interface CircleRules {
  /** Minimum activities per week to maintain active membership */
  minWeeklyActivities?: number;
  /** Max number of members (0 = unlimited) */
  maxMembers?: number;
  /** Whether members can see each other's influence scores */
  influenceVisible?: boolean;
  /** Custom rules defined by the circle creator */
  customRules?: string[];
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  type: CircleType;
  status: CircleStatus;
  membershipType: MembershipType;
  rules: CircleRules;
  creatorId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCircleInput {
  name: string;
  description: string;
  type: CircleType;
  membershipType: MembershipType;
  rules?: CircleRules;
}

export interface UpdateCircleInput {
  name?: string;
  description?: string;
  status?: CircleStatus;
  membershipType?: MembershipType;
  rules?: CircleRules;
}
