import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/database";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import type { RegisterInput, LoginInput } from "@stellar-circles/shared";

export async function register(req: Request, res: Response): Promise<void> {
  const { username, email, password, stellarAddress }: RegisterInput = req.body;

  // Check uniqueness
  const existing = await db("users")
    .where({ email })
    .orWhere({ username })
    .first();

  if (existing) {
    res.status(409).json({ error: "Email or username already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = uuidv4();

  await db("users").insert({
    id,
    username,
    email,
    password_hash: passwordHash,
    stellar_address: stellarAddress ?? null,
    created_at: new Date(),
  });

  const token = jwt.sign({ userId: id, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  logger.info("User registered", { userId: id, username });

  res.status(201).json({
    token,
    user: { id, username, email, stellarAddress: stellarAddress ?? null },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password }: LoginInput = req.body;

  const user = await db("users").where({ email }).first();
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      stellarAddress: user.stellar_address,
    },
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await db("users")
    .where({ id: req.user!.userId })
    .select("id", "username", "email", "stellar_address", "bio", "avatar_url", "created_at")
    .first();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    stellarAddress: user.stellar_address,
    bio: user.bio,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
  });
}
