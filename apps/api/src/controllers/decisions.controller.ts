import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { DecisionStatus, MemberStatus, VoteChoice } from "@stellar-circles/shared";
import type { CreateDecisionInput, CastVoteInput } from "@stellar-circles/shared";
import { getVoteWeight } from "../services/influence.service";
import { emit } from "../services/notification.service";
import { logger } from "../utils/logger";

export async function listDecisions(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const { status } = req.query;

  let query = db("decisions").where({ circle_id: circleId });
  if (status) query = query.where({ status });

  const decisions = await query.orderBy("created_at", "desc");
  res.json(decisions);
}

export async function createDecision(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const userId = req.user!.userId;
  const { title, description, closesAt }: CreateDecisionInput = req.body;

  // Must be an active member
  const membership = await db("memberships")
    .where({ circle_id: circleId, user_id: userId, status: MemberStatus.ACTIVE })
    .first();
  if (!membership) {
    res.status(403).json({ error: "Must be a circle member to create decisions" });
    return;
  }

  const id = uuidv4();
  await db("decisions").insert({
    id,
    circle_id: circleId,
    creator_id: userId,
    title,
    description,
    status: DecisionStatus.OPEN,
    closes_at: new Date(closesAt),
    created_at: new Date(),
    updated_at: new Date(),
  });

  emit({ type: "circle:decision_created", circleId, payload: { decisionId: id, title } });

  const decision = await db("decisions").where({ id }).first();
  res.status(201).json(decision);
}

export async function castVote(req: Request, res: Response): Promise<void> {
  const { id: decisionId } = req.params;
  const userId = req.user!.userId;
  const { choice }: CastVoteInput = req.body;

  const decision = await db("decisions").where({ id: decisionId }).first();
  if (!decision) {
    res.status(404).json({ error: "Decision not found" });
    return;
  }
  if (decision.status !== DecisionStatus.OPEN) {
    res.status(400).json({ error: "Voting is closed for this decision" });
    return;
  }
  if (new Date(decision.closes_at) < new Date()) {
    res.status(400).json({ error: "Voting period has ended" });
    return;
  }

  // Check already voted
  const existing = await db("votes").where({ decision_id: decisionId, user_id: userId }).first();
  if (existing) {
    res.status(409).json({ error: "You have already voted on this decision" });
    return;
  }

  // Get influence weight at time of voting (snapshot)
  const influenceWeight = await getVoteWeight(userId, decision.circle_id);

  await db("votes").insert({
    id: uuidv4(),
    decision_id: decisionId,
    user_id: userId,
    choice,
    influence_weight: influenceWeight,
    created_at: new Date(),
  });

  emit({
    type: "circle:vote_cast",
    circleId: decision.circle_id,
    payload: { decisionId, userId, choice, influenceWeight },
  });

  res.status(201).json({ message: "Vote cast successfully", influenceWeight });
}

export async function getDecisionResults(req: Request, res: Response): Promise<void> {
  const { id: decisionId } = req.params;

  const votes = await db("votes").where({ decision_id: decisionId });
  const totalWeight = votes.reduce((s: number, v: any) => s + parseFloat(v.influence_weight), 0);

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
    .where({ circle_id: db("decisions").where({ id: decisionId }).select("circle_id") })
    .count("id as count")
    .first();

  res.json({
    totalInfluenceWeight: totalWeight,
    forWeight,
    againstWeight,
    abstainWeight,
    forPercentage: totalWeight > 0 ? (forWeight / totalWeight) * 100 : 0,
    againstPercentage: totalWeight > 0 ? (againstWeight / totalWeight) * 100 : 0,
    participationRate: 0, // TODO: compute from memberCount vs votes.length
    passed: forWeight > againstWeight,
    totalVotes: votes.length,
  });
}
