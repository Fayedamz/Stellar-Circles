/**
 * Invite System — generate and redeem invite links for INVITE-only circles.
 *
 * Flow:
 *  1. Circle admin calls POST /circles/:id/invites → receives a signed token
 *  2. Admin shares the link: https://app.stellarcircles.io/join?token=<token>
 *  3. Invitee calls POST /circles/:id/join with { inviteToken } in body
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/database";
import { env } from "../config/env";
import { MemberRole, MemberStatus, MembershipType } from "@stellar-circles/shared";
import { logger } from "../utils/logger";

interface InvitePayload {
  circleId: string;
  createdBy: string;
  type: "circle_invite";
}

/** Admin creates a single-use invite token (valid 7 days) */
export async function createInvite(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const userId = req.user!.userId;

  const membership = await db("memberships")
    .where({ circle_id: circleId, user_id: userId, role: MemberRole.ADMIN, status: MemberStatus.ACTIVE })
    .first();

  if (!membership) {
    res.status(403).json({ error: "Only circle admins can generate invite links" });
    return;
  }

  const payload: InvitePayload = { circleId, createdBy: userId, type: "circle_invite" };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

  logger.info("Invite created", { circleId, createdBy: userId });

  res.json({
    token,
    expiresIn: "7 days",
    inviteUrl: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/join?token=${token}`,
  });
}

/** Verify an invite token — used before joining an INVITE circle */
export function verifyInviteToken(token: string): InvitePayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as InvitePayload;
  } catch {
    return null;
  }
}
