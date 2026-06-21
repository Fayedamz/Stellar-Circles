/**
 * Influence Decay Job — runs weekly via cron.
 *
 * For every member who had no activity in the past week,
 * their influence score decays by 5%.
 *
 * Schedule: every Monday at 00:00 UTC
 * Cron expression: "0 0 * * 1"
 *
 * Usage (Phase 2): wire this into a node-cron scheduler in src/index.ts
 *   import cron from "node-cron";
 *   import { runInfluenceDecayJob } from "./jobs/influenceDecay.job";
 *   cron.schedule("0 0 * * 1", runInfluenceDecayJob);
 */

import { db } from "../config/database";
import { ParticipationLogModel } from "../models/mongo/ParticipationLog";
import { recomputeInfluence } from "../services/influence.service";
import { emit } from "../services/notification.service";
import { logger } from "../utils/logger";

function getCurrentWeek(): { week: number; year: number } {
  const now = new Date();
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return {
    week: 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7),
    year: d.getFullYear(),
  };
}

export async function runInfluenceDecayJob(): Promise<void> {
  logger.info("Influence decay job started");

  const { week, year } = getCurrentWeek();

  // Get all active memberships
  const memberships = await db("memberships")
    .where({ status: "ACTIVE" })
    .select("user_id", "circle_id");

  let decayed = 0;
  let skipped = 0;

  for (const m of memberships) {
    // Check if they had activity this week
    const log = await ParticipationLogModel.findOne({
      userId: m.user_id,
      circleId: m.circle_id,
      weekNumber: week,
      year,
    });

    if (!log || !log.isActive) {
      // No activity this week — apply decay
      try {
        const updated = await recomputeInfluence(m.user_id, m.circle_id);
        emit({
          type: "influence:updated",
          circleId: m.circle_id,
          payload: { userId: m.user_id, score: updated.score, reason: "weekly_decay" },
        });
        decayed++;
      } catch (err) {
        logger.error("Decay failed for member", {
          userId: m.user_id,
          circleId: m.circle_id,
          err,
        });
      }
    } else {
      skipped++;
    }
  }

  logger.info("Influence decay job completed", {
    total: memberships.length,
    decayed,
    skipped,
  });
}
