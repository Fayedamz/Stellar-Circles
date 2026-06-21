import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { MemberRole, MemberStatus, MembershipType } from "@stellar-circles/shared";
import { emit } from "../services/notification.service";
import { logger } from "../utils/logger";

export async function listMembers(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const members = await db("memberships as m")
    .join("users as u", "u.id", "m.user_id")
    .where({ "m.circle_id": circleId, "m.status": MemberStatus.ACTIVE })
    .select("m.id", "m.role", "m.joined_at", "u.id as userId", "u.username", "u.avatar_url");

  res.json(members);
}

export async function joinCircle(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const userId = req.user!.userId;

  const circle = await db("circles").where({ id: circleId }).first();
  if (!circle) {
    res.status(404).json({ error: "Circle not found" });
    return;
  }

  if (circle.membership_type === MembershipType.INVITE) {
    // TODO: validate invite token from req.body.inviteToken
    res.status(403).json({ error: "This circle requires an invite link to join" });
    return;
  }

  const existing = await db("memberships")
    .where({ circle_id: circleId, user_id: userId })
    .first();

  if (existing) {
    if (existing.status === MemberStatus.ACTIVE) {
      res.status(409).json({ error: "Already a member of this circle" });
      return;
    }
    // Re-activate if previously left
    await db("memberships")
      .where({ circle_id: circleId, user_id: userId })
      .update({ status: MemberStatus.ACTIVE, joined_at: new Date() });
  } else {
    await db("memberships").insert({
      id: uuidv4(),
      circle_id: circleId,
      user_id: userId,
      role: MemberRole.MEMBER,
      status: MemberStatus.ACTIVE,
      joined_at: new Date(),
    });
  }

  // Update member count
  await db("circles")
    .where({ id: circleId })
    .increment("member_count", 1);

  emit({ type: "circle:member_joined", circleId, payload: { userId } });
  logger.info("Member joined circle", { userId, circleId });

  res.status(200).json({ message: "Joined circle successfully" });
}

export async function leaveCircle(req: Request, res: Response): Promise<void> {
  const { id: circleId } = req.params;
  const userId = req.user!.userId;

  const membership = await db("memberships")
    .where({ circle_id: circleId, user_id: userId, status: MemberStatus.ACTIVE })
    .first();

  if (!membership) {
    res.status(404).json({ error: "You are not a member of this circle" });
    return;
  }

  if (membership.role === MemberRole.ADMIN) {
    const adminCount = await db("memberships")
      .where({ circle_id: circleId, role: MemberRole.ADMIN, status: MemberStatus.ACTIVE })
      .count("id as count")
      .first();
    if (parseInt(adminCount?.count as string ?? "1") <= 1) {
      res.status(400).json({ error: "Cannot leave — you are the only admin. Transfer admin role first." });
      return;
    }
  }

  await db("memberships")
    .where({ circle_id: circleId, user_id: userId })
    .update({ status: MemberStatus.INACTIVE });

  await db("circles").where({ id: circleId }).decrement("member_count", 1);

  emit({ type: "circle:member_left", circleId, payload: { userId } });

  res.json({ message: "Left circle successfully" });
}
