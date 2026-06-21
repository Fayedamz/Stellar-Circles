/**
 * Influence Calculator — the core social capital engine.
 *
 * Influence Formula:
 *   score = Σ(activity_weight_i) × consistency_multiplier × quality_factor − decay
 *
 * Parameters:
 *   consistency_multiplier = 1.0 + min(streak_weeks × 0.1, 1.0)  → range [1.0, 2.0]
 *   quality_factor         = peer_rating / 3.0                    → range [0.5, 1.5]
 *   decay                  = score × 0.05 per inactive week
 */

import { ACTIVITY_WEIGHTS, ActivityType } from "@stellar-circles/shared";

export interface InfluenceInputs {
  /** List of (activityType, timestamp) pairs */
  activities: Array<{ type: ActivityType; timestamp: Date }>;
  /** Number of consecutive active weeks */
  streakWeeks: number;
  /** Peer-rating average (1–5 scale) */
  peerRatingAvg: number;
  /** Weeks since last activity (for decay calculation) */
  weeksInactive: number;
  /** Previously accumulated score (for decay base) */
  previousScore: number;
}

export interface InfluenceResult {
  score: number;
  consistencyMultiplier: number;
  qualityFactor: number;
  decayPenalty: number;
  basePoints: number;
}

export function calculateInfluence(inputs: InfluenceInputs): InfluenceResult {
  const { activities, streakWeeks, peerRatingAvg, weeksInactive, previousScore } = inputs;

  // 1. Base points — sum of activity weights
  const basePoints = activities.reduce((sum, a) => {
    return sum + (ACTIVITY_WEIGHTS[a.type] ?? 1.0);
  }, 0);

  // 2. Consistency multiplier — reward streaks, cap at 2×
  const consistencyMultiplier = 1.0 + Math.min(streakWeeks * 0.1, 1.0);

  // 3. Quality factor — peer-rated contribution quality (1–5 → 0.5–1.5)
  const normalizedRating = Math.max(1, Math.min(5, peerRatingAvg));
  const qualityFactor = 0.25 + normalizedRating * 0.25; // [0.5, 1.5]

  // 4. Decay — 5% of previous score per week of inactivity
  const decayPenalty = weeksInactive > 0
    ? previousScore * (0.05 * weeksInactive)
    : 0;

  // 5. Final score
  const score = Math.max(
    0,
    basePoints * consistencyMultiplier * qualityFactor - decayPenalty
  );

  return {
    score: parseFloat(score.toFixed(4)),
    consistencyMultiplier: parseFloat(consistencyMultiplier.toFixed(4)),
    qualityFactor: parseFloat(qualityFactor.toFixed(4)),
    decayPenalty: parseFloat(decayPenalty.toFixed(4)),
    basePoints: parseFloat(basePoints.toFixed(4)),
  };
}

/**
 * Calculate the influence weight to apply when a member casts a vote.
 * Caps influence weight to prevent outsized dominance.
 */
export function calculateVoteWeight(influenceScore: number, maxScore: number): number {
  if (maxScore === 0) return 1;
  // Normalize to [0, 1] then apply square-root dampening to reduce extremes
  const normalized = influenceScore / maxScore;
  return parseFloat(Math.sqrt(normalized).toFixed(6));
}
