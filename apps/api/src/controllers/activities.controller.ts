import { Request, Response } from "express";
import { ActivityModel } from "../models/mongo/Activity";
import { ParticipationLogModel } from "../models/mongo/ParticipationLog";
import { db } from "../config/database";
import { MemberStatus, ACTIVITY_WEIGHTS } from "@stellar-circles/shared";
import type { LogActivityInput } from "@stellar-circles/shared";
import { recomputeInfluence } from "../services/influence.service";
import { anchorActivityOnStellar } from "../services/stellar.service";
import { emit } from "../services/notification.service";
import { logger } from "../utils/logger";

/** Get the ISO week number for a date */
function getWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return {
    week: 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7),
    year: d.getFullYear(),
  };
}

export async function logActivity(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const userId = req.user!.userId;
  const { type, description, metadata, anchorOnStellar }: LogActivityInput = req.body;

  // Verify membership
  const membership = await db("memberships")
    .where({ circle_id: circleId, user_id: userId, status: MemberStatus.ACTIVE })
    .first();

  if (!membership) {
    res.status(403).json({ error: "You must be a member of this circle to log activities" });
    return;
  }

  const weight = ACTIVITY_WEIGHTS[type] ?? 1.0;
  const now = new Date();

  // Create activity document
  const activity = await ActivityModel.create({
    userId,
    circleId,
    type,
    description,
    metadata: metadata ?? {},
    influenceDelta: weight,
    timestamp: now,
  });

  // Update weekly participation log (upsert)
  const { week, year } = getWeekNumber(now);
  await ParticipationLogModel.findOneAndUpdate(
    { userId, circleId, weekNumber: week, year },
    {
      $inc: { eventCount: 1, streakDays: 1 },
      $set: { isActive: true },
    },
    { upsert: true, new: true }
  );

  // Recompute influence asynchronously (don't block response)
  recomputeInfluence(userId, circleId).catch((err) =>
    logger.error("Influence recompute failed", { err, userId, circleId })
  );

  // Optional Stellar anchoring (fire-and-forget)
  if (anchorOnStellar) {
    anchorActivityOnStellar(activity.id, {
      circleId,
      userId,
      activityType: type,
      timestamp: now.toISOString(),
    }).then((result) => {
      if (result) {
        ActivityModel.findByIdAndUpdate(activity.id, { stellarTxHash: result.txHash }).exec();
      }
    });
  }

  emit({
    type: "circle:activity_logged",
    circleId,
    payload: { activityId: activity.id, userId, activityType: type },
  });

  res.status(201).json({
    id: activity.id,
    userId,
    circleId,
    type,
    description,
    influenceDelta: weight,
    timestamp: now.toISOString(),
  });
}

export async function getActivities(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const { page = "1", limit = "20", userId } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  const filter: Record<string, unknown> = { circleId };
  if (userId) filter.userId = userId;

  const [activities, total] = await Promise.all([
    ActivityModel.find(filter)
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(parseInt(limit as string))
      .lean(),
    ActivityModel.countDocuments(filter),
  ]);

  res.json({ data: activities, total, page: parseInt(page as string), limit: parseInt(limit as string) });
}
