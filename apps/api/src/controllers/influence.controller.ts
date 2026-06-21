import { Request, Response } from "express";
import {
  getInfluenceScore,
  getCircleLeaderboard,
  getUserInfluenceAcrossCircles,
} from "../services/influence.service";

export async function getCircleInfluence(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const leaderboard = await getCircleLeaderboard(circleId);
  res.json(leaderboard);
}

export async function getUserInfluence(req: Request, res: Response): Promise<void> {
  const { id: userId } = req.params;
  const scores = await getUserInfluenceAcrossCircles(userId);
  res.json(scores);
}

export async function getMemberInfluenceInCircle(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const userId = req.user!.userId;
  const score = await getInfluenceScore(userId, circleId);
  if (!score) {
    res.json({ score: 0, streakWeeks: 0, message: "No influence recorded yet — start participating!" });
    return;
  }
  res.json(score);
}
