/**
 * Stellar Identity Anchoring
 *
 * Members can optionally link their Stellar account address to their
 * Stellar Circles profile. This creates a verifiable, self-sovereign
 * identity anchor — the user owns the private key.
 *
 * Verification flow:
 *  1. Backend generates a challenge nonce
 *  2. User signs the nonce with their Stellar secret key (client-side)
 *  3. Backend verifies the signature against the public key
 *  4. On success, the Stellar address is stored in the user record
 */

import { Keypair } from "@stellar/stellar-sdk";

export interface IdentityChallenge {
  nonce: string;
  expiresAt: string;
}

export interface SignedChallenge {
  stellarAddress: string;
  nonce: string;
  signature: string;
}

/**
 * Generate a random challenge nonce for identity verification.
 * Call this server-side; return the nonce to the client.
 */
export function generateChallenge(): IdentityChallenge {
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min TTL
  return { nonce, expiresAt };
}

/**
 * Verify a signed challenge.
 * Returns true if the signature is valid for the given Stellar address.
 */
export function verifyChallenge(signed: SignedChallenge, expectedNonce: string): boolean {
  try {
    const keypair = Keypair.fromPublicKey(signed.stellarAddress);
    const dataBuffer = Buffer.from(expectedNonce, "utf-8");
    const signatureBuffer = Buffer.from(signed.signature, "base64");
    return keypair.verify(dataBuffer, signatureBuffer);
  } catch {
    return false;
  }
}

/**
 * Client-side helper: sign a challenge nonce with the user's Stellar secret key.
 * NOTE: Never send the secret key to the server. This runs in the browser or mobile app.
 */
export function signChallenge(secretKey: string, nonce: string): SignedChallenge {
  const keypair = Keypair.fromSecret(secretKey);
  const dataBuffer = Buffer.from(nonce, "utf-8");
  const signature = keypair.sign(dataBuffer).toString("base64");
  return {
    stellarAddress: keypair.publicKey(),
    nonce,
    signature,
  };
}
