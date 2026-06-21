import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { CircleType, CircleStatus, MembershipType, MemberRole, MemberStatus } from "@stellar-circles/shared";
import type { CreateCircleInput, UpdateCircleInput } from "@stellar-circles/shared";
import { logger } from "../utils/logger";

export async function listCircles(req: Request, res: Response): Promise<void> {
  const { type, search, page = "1", limit = "20" } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  let query = db("circles")
    .where({ status: CircleStatus.ACTIVE })
    .select("id", "name", "description", "type", "membership_type", "member_count", "created_at");

  if (type) query = query.where({ type });
  if (search) query = query.whereILike("name", `%${search}%`);

  const [circles, countResult] = await Promise.all([
    query.limit(parseInt(limit as string)).offset(offset).orderBy("created_at", "desc"),
    db("circles").where({ status: CircleStatus.ACTIVE }).count("id as count").first(),
  ]);

  res.json({
    data: circles,
    total: parseInt(countResult?.count as string ?? "0"),
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
}

export async function getCircle(req: Request, res: Response): Promise<void> {
  const circle = await db("circles")
    .where({ id: req.params.id })
    .join("users as u", "u.id", "circles.creator_id")
    .select("circles.*", "u.username as creator_username")
    .first();

  if (!circle) {
    res.status(404).json({ error: "Circle not found" });
    return;
  }

  res.json(circle);
}

export async function createCircle(req: Request, res: Response): Promise<void> {
  const { name, description, type, membershipType, rules }: CreateCircleInput = req.body;
  const creatorId = req.user!.userId;
  const id = uuidv4();

  await db.transaction(async (trx) => {
    await trx("circles").insert({
      id,
      name,
      description,
      type,
      status: CircleStatus.ACTIVE,
      membership_type: membershipType ?? MembershipType.OPEN,
      rules: JSON.stringify(rules ?? {}),
      creator_id: creatorId,
      member_count: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Creator automatically becomes admin member
    await trx("memberships").insert({
      id: uuidv4(),
      circle_id: id,
      user_id: creatorId,
      role: MemberRole.ADMIN,
      status: MemberStatus.ACTIVE,
      joined_at: new Date(),
    });
  });

  logger.info("Circle created", { circleId: id, creatorId });

  const circle = await db("circles").where({ id }).first();
  res.status(201).json(circle);
}

export async function updateCircle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.userId;

  const circle = await db("circles").where({ id }).first();
  if (!circle) {
    res.status(404).json({ error: "Circle not found" });
    return;
  }

  // Only admins can update
  const membership = await db("memberships")
    .where({ circle_id: id, user_id: userId, role: MemberRole.ADMIN })
    .first();
  if (!membership) {
    res.status(403).json({ error: "Only circle admins can update settings" });
    return;
  }

  const { name, description, status, membershipType, rules }: UpdateCircleInput = req.body;

  await db("circles").where({ id }).update({
    ...(name && { name }),
    ...(description && { description }),
    ...(status && { status }),
    ...(membershipType && { membership_type: membershipType }),
    ...(rules && { rules: JSON.stringify(rules) }),
    updated_at: new Date(),
  });

  const updated = await db("circles").where({ id }).first();
  res.json(updated);
}
