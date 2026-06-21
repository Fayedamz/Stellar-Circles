/**
 * Decision — influence-weighted proposals within a circle.
 * Unlike token voting, votes are weighted by the voter's current influence
 * score in that specific circle. This rewards consistent contributors
 * with proportionally greater say in group decisions.
 */

export enum DecisionStatus {
  DRAFT    = "DRAFT",
  OPEN     = "OPEN",
  CLOSED   = "CLOSED",
  EXECUTED = "EXECUTED",
}

export enum VoteChoice {
  FOR     = "FOR",
  AGAINST = "AGAINST",
  ABSTAIN = "ABSTAIN",
}

export interface Decision {
  id: string;
  circleId: string;
  creatorId: string;
  title: string;
  description: string;
  status: DecisionStatus;
  /** Voting closes at this timestamp */
  closesAt: string;
  /** Aggregated results — computed on close */
  result?: DecisionResult;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionResult {
  totalInfluenceWeight: number;
  forWeight: number;
  againstWeight: number;
  abstainWeight: number;
  forPercentage: number;
  againstPercentage: number;
  participationRate: number;  // % of eligible members who voted
  passed: boolean;
}

export interface Vote {
  id: string;
  decisionId: string;
  userId: string;
  choice: VoteChoice;
  /** Influence score at the time of voting — snapshot to prevent retroactive changes */
  influenceWeight: number;
  createdAt: string;
}

export interface CreateDecisionInput {
  circleId: string;
  title: string;
  description: string;
  closesAt: string;
}

export interface CastVoteInput {
  decisionId: string;
  choice: VoteChoice;
}
