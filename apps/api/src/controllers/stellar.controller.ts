/**
 * Stellar Identity Controller
 * Handles linking a Stellar account to a Circles profile via challenge/sign/verify.
 */

import { Request, Response } from "express";
import { generateChallenge, verifyChallenge } from "@stellar-circles/stellar-client";
import { db } from "../config/database";
import { logger } from "../utils/logger";

// In-memory nonce store (replace with Redis in production)
const nonceStore = new Map<string, { nonce: string; expiresAt: Date }>();

/** Step 1 — issue a challenge nonce to the authenticated user */
export async function getStellarChallenge(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const challenge = generateChallenge();

  nonceStore.set(userId, {
    nonce: challenge.nonce,
    expiresAt: new Date(challenge.expiresAt),
  });

  res.json(challenge);
}

/** Step 2 — client signs the nonce and submits for verification */
export async function verifyStellarIdentity(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const { stellarAddress, signature } = req.body;

  const stored = nonceStore.get(userId);
  if (!stored || new Date() > stored.expiresAt) {
    res.status(400).json({ error: "Challenge expired or not found. Request a new one." });
    return;
  }

  const valid = verifyChallenge(
    { stellarAddress, nonce: stored.nonce, signature },
    stored.nonce
  );

  if (!valid) {
    res.status(400).json({ error: "Invalid signature. Verification failed." });
    return;
  }

  // Check address not already linked to another account
  const existing = await db("users")
    .where({ stellar_address: stellarAddress })
    .whereNot({ id: userId })
    .first();

  if (existing) {
    res.status(409).json({ error: "This Stellar address is already linked to another account." });
    return;
  }

  await db("users")
    .where({ id: userId })
    .update({ stellar_address: stellarAddress, updated_at: new Date() });

  nonceStore.delete(userId);

  logger.info("Stellar identity linked", { userId, stellarAddress });

  res.json({ message: "Stellar address linked successfully", stellarAddress });
}
