/**
 * Client-side Stellar helpers.
 * Note: never expose secret keys — these utilities are for public key operations only.
 */

const HORIZON_URL =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

/**
 * Look up a Stellar account by public key.
 * Returns null if the account is not funded/created.
 */
export async function lookupStellarAccount(publicKey: string) {
  try {
    const res = await fetch(`${HORIZON_URL}/accounts/${publicKey}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Build the Stellar Expert link for a transaction hash.
 */
export function stellarExpertTxUrl(txHash: string): string {
  const network =
    process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${network}/tx/${txHash}`;
}

/**
 * Validate that a string looks like a valid Stellar public key (G...).
 */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address);
}
