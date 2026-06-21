import { anchorActivity, AnchorPayload, AnchorResult } from "@stellar-circles/stellar-client";
import { logger } from "../utils/logger";
import { db } from "../config/database";

/**
 * Anchor an activity on the Stellar network and store the tx hash.
 * This is fire-and-forget — failures are logged but don't block activity logging.
 */
export async function anchorActivityOnStellar(
  activityId: string,
  payload: AnchorPayload
): Promise<AnchorResult | null> {
  try {
    const result = await anchorActivity(payload);

    // Store tx hash back on the activity record in MongoDB
    // (caller is responsible for updating the Mongoose doc)
    logger.info("Activity anchored on Stellar", {
      activityId,
      txHash: result.txHash,
      ledger: result.ledger,
    });

    return result;
  } catch (err) {
    logger.warn("Stellar anchoring failed — activity recorded off-chain only", {
      activityId,
      error: (err as Error).message,
    });
    return null;
  }
}
