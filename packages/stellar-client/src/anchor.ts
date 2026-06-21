/**
 * Activity Anchoring — optionally record participation events on the Stellar network.
 *
 * How it works:
 *  1. Serialize the activity payload to a compact JSON string
 *  2. Attach it as a MEMO_TEXT or DATA entry on a Stellar transaction
 *  3. Submit the transaction — the tx hash becomes an immutable proof-of-participation
 *
 * This layer is OPTIONAL. Circles can operate entirely off-chain.
 */

import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Memo,
  Asset,
} from "@stellar/stellar-sdk";
import { Horizon } from "@stellar/stellar-sdk";
import { getStellarConfig } from "./config";

export interface AnchorPayload {
  circleId: string;
  userId: string;
  activityType: string;
  timestamp: string;
}

export interface AnchorResult {
  txHash: string;
  ledger: number;
  networkUrl: string;
}

/**
 * Anchor an activity event on the Stellar network.
 * Returns the transaction hash that can be stored alongside the activity record.
 */
export async function anchorActivity(
  payload: AnchorPayload
): Promise<AnchorResult> {
  const config = getStellarConfig();

  if (!config.issuerSecret) {
    throw new Error(
      "STELLAR_ISSUER_SECRET is not configured. Cannot anchor activity."
    );
  }

  const server = new Horizon.Server(config.horizonUrl);
  const issuerKeypair = Keypair.fromSecret(config.issuerSecret);
  const account = await server.loadAccount(issuerKeypair.publicKey());

  // Compact memo: "SC|<circleId[:8]>|<userId[:8]>|<type>"
  const memoText = `SC|${payload.circleId.slice(0, 8)}|${payload.userId.slice(0, 8)}|${payload.activityType.slice(0, 10)}`;

  const network =
    config.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

  const transaction = new TransactionBuilder(account, {
    fee: String(config.baseFee),
    networkPassphrase: network,
  })
    .addOperation(
      // Self-payment of 0 XLM — minimal-cost data anchoring
      Operation.payment({
        destination: issuerKeypair.publicKey(),
        asset: Asset.native(),
        amount: "0.0000001",
      })
    )
    .addMemo(Memo.text(memoText))
    .setTimeout(30)
    .build();

  transaction.sign(issuerKeypair);

  const response = await server.submitTransaction(transaction);

  return {
    txHash: response.hash,
    ledger: response.ledger,
    networkUrl: `${config.horizonUrl}/transactions/${response.hash}`,
  };
}
