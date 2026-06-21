import { db } from "../config/database";
import { ActivityModel } from "../models/mongo/Activity";
import { ParticipationLogModel } from "../models/mongo/ParticipationLog";
import { calculateInfluence, calculateVoteWeight } from "../utils/influenceCalculator";
import { ActivityType, InfluenceScore, InfluenceLeaderboardEntry } from "@stellar-circles/shared";
import { logger } from "../utils/logger";

/**
 * Recompute and persist a user's influence score for a specific circle.
 * Called after every activity log and on the weekly decay cron job.
 */
export async function recomputeInfluence(
  userId: string,
  circleId: string
): Promise<InfluenceScore> {
  // 1. Fetch all activities for this user in this circle (last 90 days)
  const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const activities = await ActivityModel.find({ userId, circleId, timestamp: { $gte: since } })
    .select("type timestamp")
    .lean();

  // 2. Fetch participation logs for streak calculation
  const logs = await ParticipationLogModel.find({ userId, circleId })
    .sort({ year: -1, weekNumber: -1 })
    .limit(52)
    .lean();

  // 3. Calculate consecutive active weeks (streak)
  let streakWeeks = 0;
  for (const log of logs) {
    if (log.isActive) streakWeeks++;
    else break;
  }

  // 4. Calculate average quality score
  const qualityScores = logs.filter((l) => l.qualityScore > 0).map((l) => l.qualityScore);
  const peerRatingAvg =
    qualityScores.length > 0
      ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
      : 3.0; // neutral default

  // 5. Weeks inactive
  const lastLog = logs[0];
  const weeksInactive =
    lastLog && !lastLog.isActive
      ? logs.findIndex((l) => l.isActive) // how many consecutive inactive weeks
      : 0;

  // 6. Previous score
  const previous = await db("influence_snapshots")
    .where({ user_id: userId, circle_id: circleId })
    .orderBy("computed_at", "desc")
    .first();
  const previousScore = previous?.score ?? 0;

  // 7. Compute
  const result = calculateInfluence({
    activities: activities.map((a) => ({ type: a.type as ActivityType, timestamp: a.timestamp })),
    streakWeeks,
    peerRatingAvg,
    weeksInactive,
    previousScore,
  });

  // 8. Persist snapshot
  const snapshot = {
    user_id: userId,
    circle_id: circleId,
    score: result.score,
    streak_weeks: streakWeeks,
    consistency_multiplier: result.consistencyMultiplier,
    quality_factor: result.qualityFactor,
    total_decay: result.decayPenalty,
    computed_at: new Date(),
  };

  await db("influence_snapshots").insert(snapshot);

  logger.debug("Influence recomputed", { userId, circleId, score: result.score });

  return {
    id: "", // filled by caller if needed
    userId,
    circleId,
    score: result.score,
    streakWeeks,
    consistencyMultiplier: result.consistencyMultiplier,
    qualityFactor: result.qualityFactor,
    totalDecay: result.decayPenalty,
    computedAt: snapshot.computed_at.toISOString(),
  };
}

/** Get the latest influence score for a user in a circle */
export async function getInfluenceScore(
  userId: string,
  circleId: string
): Promise<InfluenceScore | null> {
  const row = await db("influence_snapshots")
    .where({ user_id: userId, circle_id: circleId })
    .orderBy("computed_at", "desc")
    .first();

  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    circleId: row.circle_id,
    score: parseFloat(row.score),
    streakWeeks: row.streak_weeks,
    consistencyMultiplier: parseFloat(row.consistency_multiplier),
    qualityFactor: parseFloat(row.quality_factor),
    totalDecay: parseFloat(row.total_decay),
    computedAt: row.computed_at,
  };
}

/** Circle leaderboard — top N members by influence score */
export async function getCircleLeaderboard(
  circleId: string,
  limit = 20
): Promise<InfluenceLeaderboardEntry[]> {
  // TODO: optimize with a materialized view or Redis sorted set
  const rows = await db("influence_snapshots as i")
    .join("users as u", "u.id", "i.user_id")
    .where("i.circle_id", circleId)
    .select("u.id", "u.username", "u.avatar_url", "i.score", "i.streak_weeks")
    .orderBy("i.score", "desc")
    .distinctOn(["i.user_id"])
    .limit(limit);

  const maxScore: number = rows[0]?.score ?? 1;

  return rows.map((row: any, index: number) => ({
    rank: index + 1,
    userId: row.id,
    username: row.username,
    avatarUrl: row.avatar_url,
    score: parseFloat(row.score),
    streakWeeks: row.streak_weeks,
    percentileRank: parseFloat(((1 - index / rows.length) * 100).toFixed(1)),
  }));
}

/** Get a user's influence scores across all their circles */
export async function getUserInfluenceAcrossCircles(userId: string) {
  const rows = await db("influence_snapshots as i")
    .join("circles as c", "c.id", "i.circle_id")
    .where("i.user_id", userId)
    .select("c.id", "c.name", "c.type", "i.score", "i.streak_weeks", "i.computed_at")
    .orderBy("i.computed_at", "desc")
    .distinctOn(["i.circle_id"]);

  return rows;
}

/** Get a member's influence weight for voting (normalized within circle) */
export async function getVoteWeight(userId: string, circleId: string): Promise<number> {
  const [userScore, maxRow] = await Promise.all([
    db("influence_snapshots")
      .where({ user_id: userId, circle_id: circleId })
      .orderBy("computed_at", "desc")
      .select("score")
      .first(),
    db("influence_snapshots")
      .where({ circle_id: circleId })
      .max("score as max_score")
      .first(),
  ]);

  const score = parseFloat(userScore?.score ?? 0);
  const maxScore = parseFloat(maxRow?.max_score ?? 1);
  return calculateVoteWeight(score, maxScore);
}
