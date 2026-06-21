# Stellar Integration Guide

## Overview

Stellar integration in Stellar Circles is **optional** and additive. The platform works fully without it. When enabled, it provides:

- **Activity anchoring** — immutable on-chain proof of participation
- **Identity anchoring** — link your Stellar account to your profile

## Activity Anchoring

When a member logs an activity with `anchorOnStellar: true`, the API:

1. Creates the activity record in MongoDB
2. Calls `anchorActivity()` from `@stellar-circles/stellar-client`
3. Submits a minimal Stellar transaction with a MEMO describing the event
4. Stores the returned `txHash` on the activity record

The memo format is: `SC|<circleId[:8]>|<userId[:8]>|<activityType[:10]>`

The transaction hash becomes publicly verifiable on [Stellar Expert](https://stellar.expert).

### Cost

A single transaction costs 100 stroops = 0.00001 XLM. Negligible for coordination use cases.

### Setup

Set these environment variables:

```env
STELLAR_NETWORK=testnet                    # or mainnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_ISSUER_SECRET=S...                 # your issuer Stellar secret key
```

Get testnet funds: https://laboratory.stellar.org/#account-creator

## Identity Anchoring

Members can link their Stellar address to prove wallet ownership:

1. Call `GET /auth/stellar/challenge` → receive a nonce
2. Sign the nonce client-side using `signChallenge(secretKey, nonce)` from `@stellar-circles/stellar-client`
3. Submit the signed challenge to `POST /auth/stellar/verify`
4. On success, `stellar_address` is stored on the user record

**The secret key never leaves the client.** Only the signature and public key are sent to the server.

## Network Configuration

| Setting | Testnet | Mainnet |
|---|---|---|
| Network | `testnet` | `mainnet` |
| Horizon URL | `https://horizon-testnet.stellar.org` | `https://horizon.stellar.org` |
| Network passphrase | `Test SDF Network ; September 2015` | `Public Global Stellar Network ; September 2015` |
| Faucet | https://laboratory.stellar.org | N/A |
