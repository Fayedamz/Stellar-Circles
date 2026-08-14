# Stellar Circles

> **Soroban-based infrastructure for communities where participation earns non-transferable influence**

Stellar Circles is a **smart contract framework** on Stellar's Soroban platform that enables communities to track membership, participation, reputation, and influence — without turning social capital into tradable tokens.

**What makes it different:** Influence is earned through verified participation, not purchased. It's non-transferable, context-specific, and recalculated based on contribution history.

---

## The Problem

Online communities struggle to recognize and reward meaningful contribution. Traditional solutions either:
- Use tokens (turning social capital into speculative assets)
- Rely on centralized moderation (opaque, unverifiable)
- Have no reputation system at all (spam, noise, manipulation)

## The Solution

**Participation creates social capital.**

```
Join Circle
    ↓
Participate (verified activities)
    ↓
Build Reputation (on-chain history)
    ↓
Earn Influence (calculated, not minted)
    ↓
Participate in Decisions (influence-weighted voting)
```

Influence reflects **contribution**, not **capital**.

---

## Why Soroban?

Stellar Circles uses **Soroban smart contracts** to create:
- **Programmable membership rules** — who can join, how members are approved
- **Verifiable participation tracking** — immutable record of contributions
- **Transparent reputation calculations** — anyone can audit the formula
- **Influence-weighted decisions** — voting power reflects actual contribution

The blockchain provides a **verifiable foundation** for community activity without requiring influence itself to become a transferable financial asset.

---

## Architecture

```
stellar-circles/
├── contracts/          # Soroban smart contracts (Rust)
│   ├── circle/         # Circle creation & management
│   ├── membership/     # Join, invite, remove members
│   ├── reputation/     # Participation → reputation calculation
│   └── decisions/      # Influence-weighted proposals & voting
├── frontend/           # Next.js web interface
├── backend/            # Node.js API (off-chain coordination)
├── tests/              # Integration & e2e tests
├── docs/               # Architecture, influence model, security
└── examples/           # Reference implementations (learning, business, fitness, farming)
```

---

## Current Status

This is an **active development MVP**. Here's what exists today:

### ✅ Implemented
- **Circle contract** — create, retrieve, update circles with admin authorization
- **Membership contract** — join, invite, remove members with role-based access
- **Full test coverage** — comprehensive unit tests for all contract functions
- **Frontend scaffold** — Next.js app with circle explorer, dashboard, auth flows
- **Backend API** — Node.js REST API with PostgreSQL + MongoDB
- **Deployment configs** — Docker, Railway, Vercel ready

### 🚧 In Progress
- **Reputation contract** — participation → reputation calculation engine
- **Influence engine** — streak multipliers, quality factors, decay model
- **Decision contract** — influence-weighted proposals & voting
- **Frontend integration** — connect wallet → interact with contracts
- **Cross-contract integration** — circle ↔ membership ↔ reputation flow

### 📋 Roadmap
- Security audit (Sybil attacks, collusion, manipulation)
- Wave contributor integration (issues, bounties, documentation)
- Example circles (learning, business, fitness, farming templates)
- Testnet deployment
- Mainnet deployment

---

## Quick Start

### Prerequisites
- Rust + Cargo
- Soroban CLI: `cargo install --locked soroban-cli`
- Node.js >= 20
- Docker (for databases)

### Run Circle Contract Tests

```bash
cd contracts/circle
cargo test
```

### Run Membership Contract Tests

```bash
cd contracts/membership
cargo test
```

### Deploy Contracts Locally

```bash
# Start local Stellar network
soroban network start

# Build contracts
cd contracts/circle && cargo build --target wasm32-unknown-unknown --release
cd ../membership && cargo build --target wasm32-unknown-unknown --release

# Deploy
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_circles_circle.wasm \
  --source <YOUR_SECRET_KEY> \
  --network local
```

### Run Frontend & Backend

```bash
# Install dependencies
npm install

# Start infrastructure
npm run docker:up

# Run migrations
npm run db:migrate

# Start dev servers
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000/api/health

---

## Influence Model

Influence is a **living social signal** — not a static score or transferable token.

### Formula

```
influence_score = (Σ activity_weights)
                × consistency_multiplier
                × quality_factor
                − decay_penalty
```

### Key Properties

| Property | Value |
|---|---|
| **Transferable?** | ❌ No — cannot be sent, sold, or delegated |
| **Tokenized?** | ❌ No — it's a calculated reputation, not an asset |
| **Global?** | ❌ No — influence is specific to each circle |
| **Purchasable?** | ❌ No — must be earned through verified participation |
| **Decays?** | ✅ Yes — 5% reduction per week of inactivity |
| **Recalculated?** | ✅ Yes — updates after every participation event |

### Components

**Activity Weight**  
Different contributions carry different weights:
- Attended session: 1.0
- Shared resource: 1.2
- Completed milestone: 2.0
- Mentored member: 1.8

**Consistency Multiplier**  
```
multiplier = 1.0 + min(streak_weeks × 0.1, 1.0)
```
Range: 1.0× (no streak) to 2.0× (10+ consecutive weeks)

**Quality Factor**  
```
quality = 0.25 + (peer_rating_avg × 0.25)
```
Range: 0.5× (lowest) to 1.5× (highest)

**Decay**  
```
decay = previous_score × (0.05 × weeks_inactive)
```
Prevents stale influence from dominating decisions indefinitely.

### Voting Weight

When members vote on proposals, influence is normalized and square-root dampened:

```
vote_weight = √(user_score / max_score_in_circle)
```

A member with 4× the score of another gets only 2× the vote weight — not 4×. This keeps decisions accessible while rewarding contribution.

See [docs/influence-model.md](./docs/influence-model.md) for full details.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Smart Contracts** | Soroban (Rust) |
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Primary DB | PostgreSQL 16 |
| Activity DB | MongoDB 7 |
| Cache | Redis 7 |
| Blockchain | Stellar (Soroban) |
| Monorepo | Turborepo + npm workspaces |

---

## Example Use Cases

Stellar Circles is **infrastructure**, not a single-purpose app. It can power:

### 🎓 Learning Circles
- Study groups tracking attendance, resource sharing, peer mentoring
- Influence from teaching, completing challenges, helping members
- Weighted voting on curriculum decisions

### 💼 Business Circles
- Startup founder accountability groups
- Influence from progress updates, mentorship, resource sharing
- Weighted voting on partnership opportunities

### 💪 Fitness Circles
- Group workout challenges, habit tracking
- Influence from consistency, personal records, helping others
- Weighted voting on challenge formats

### 🌾 Farming Circles
- Agricultural cooperatives, knowledge sharing
- Influence from harvest contributions, expertise sharing
- Weighted voting on equipment purchases

These aren't four separate apps — they're four demonstrations of the same programmable foundation.

See [examples/](./examples/) for implementation templates.

---

## Contributing

We welcome contributors! Stellar Circles is structured to enable distributed development through the **Wave** model.

### Areas Open for Contribution

| Area | Description | Difficulty |
|---|---|---|
| **Smart Contracts** | Reputation & decision contracts | Advanced |
| **Influence Algorithm** | Streak, quality, decay calculations | Intermediate |
| **Frontend** | Wallet integration, contract interaction | Intermediate |
| **Testing** | Integration tests, security tests | Beginner-Intermediate |
| **Documentation** | Developer guides, examples | Beginner |
| **Security Review** | Audit auth, manipulation vectors | Advanced |

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions and [docs/wave-contributions.md](./docs/wave-contributions.md) for Wave-specific guidance.

### Wave Issues

Check the [Issues](https://github.com/Fayedamz/Stellar-Circles/issues) tab for tasks labeled:
- `good first issue`
- `help wanted`
- `smart-contract`
- `frontend`
- `testing`
- `documentation`

---

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [Influence Model](./docs/influence-model.md)
- [Security Considerations](./docs/security.md)
- [API Reference](./docs/api-reference.md)
- [Soroban Integration Guide](./docs/stellar-integration.md)
- [Wave Contributions](./docs/wave-contributions.md)

---

## Roadmap

- **Phase 1** — Circle & Membership MVP ✅
- **Phase 2** — Reputation & Influence Engine 🚧
- **Phase 3** — Decision & Voting System 📋
- **Phase 4** — Frontend Integration 📋
- **Phase 5** — Security Audit & Testnet 📋
- **Phase 6** — Mainnet Launch 📋

---

## License

MIT

---

## Contact

- GitHub: [@Fayedamz](https://github.com/Fayedamz)
- Project: [Stellar Circles](https://github.com/Fayedamz/Stellar-Circles)
