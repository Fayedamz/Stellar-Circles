/**
 * Stellar network configuration.
 * Supports both testnet (default for development) and mainnet.
 */

export type StellarNetwork = "testnet" | "mainnet";

export interface StellarConfig {
  network: StellarNetwork;
  horizonUrl: string;
  /** The Stellar account that signs anchoring transactions */
  issuerSecret?: string;
  /** Base fee in stroops (1 XLM = 10,000,000 stroops) */
  baseFee: number;
}

export function getStellarConfig(): StellarConfig {
  const network = (process.env.STELLAR_NETWORK as StellarNetwork) ?? "testnet";
  return {
    network,
    horizonUrl:
      network === "mainnet"
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org",
    issuerSecret: process.env.STELLAR_ISSUER_SECRET,
    baseFee: 100, // 100 stroops = 0.00001 XLM
  };
}
