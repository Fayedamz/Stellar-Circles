/**
 * Close Decisions Job — runs every 15 minutes.
 *
 * Finds OPEN decisions whose closes_at has passed,
 * tallies the influence-weighted votes, writes the result,
 * and sets status to CLOSED.
 *
 * Schedule: "*/15 * * * *"
 */

import { db } from "../config/database";
import { DecisionModel } from "../models/pg/Decision";
import { DecisionStatus, VoteChoice } from "@stellar-circles/shared";
import { emit } from "../services/notification.service";
import { logger } from "../utils/logger";

export async function runCloseDecisionsJob(): Promise<void> {
  const expired = await DecisionModel.findExpiredOpen();
  if (expired.length === 0) return;

  logger.info("Closing expired decisions", { count: expired.length });

  for (const decision of expired) {
    try {
      const votes = await db("votes").where({ decision_id: decision.id });

      const totalWeight = votes.reduce(
        (s: number, v: any) => s + parseFloat(v.influence_weight),
        0
      );
      const forWeight = votes
        .filter((v: any) => v.choice === VoteChoice.FOR)
        .reduce((s: number, v: any) => s + parseFloat(v.influence_weight), 0);
      const againstWeight = votes
        .filter((v: any) => v.choice === VoteChoice.AGAINST)
        .reduce((s: number, v: any) => s + parseFloat(v.influence_weight), 0);
      const abstainWeight = votes
        .filter((v: any) => v.choice === VoteChoice.ABSTAIN)
        .reduce((s: number, v: any) => s + parseFloat(v.influence_weight), 0);

      const memberCount = await db("memberships")
        .where({ circle_id: decision.circle_id, status: "ACTIVE" })
        .count("id as count")
        .first();

      const eligible = parseInt(memberCount?.count as string ?? "1");
      const result = {
        totalInfluenceWeight: totalWeight,
        forWeight,
        againstWeight,
        abstainWeight,
        forPercentage: totalWeight > 0 ? (forWeight / totalWeight) * 100 : 0,
        againstPercentage: totalWeight > 0 ? (againstWeight / totalWeight) * 100 : 0,
        participationRate: eligible > 0 ? (votes.length / eligible) * 100 : 0,
        passed: forWeight > againstWeight,
        totalVotes: votes.length,
        closedAt: new Date().toISOString(),
      };

      await DecisionModel.close(decision.id, result);

      emit({
        type: "circle:decision_created", // reuse channel — frontend listens for updates
        circleId: decision.circle_id,
        payload: { decisionId: decision.id, status: DecisionStatus.CLOSED, result },
      });

      logger.info("Decision closed", {
        decisionId: decision.id,
        passed: result.passed,
        votes: result.totalVotes,
      });
    } catch (err) {
      logger.error("Failed to close decision", { decisionId: decision.id, err });
    }
  }
}
