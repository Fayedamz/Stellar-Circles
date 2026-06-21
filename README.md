# Stellar Circles

> Micro-societies built on earned social capital — not tokens.

Stellar Circles is a social coordination platform on the Stellar ecosystem that enables people to form **circles** (micro-societies) around shared interests: learning, business, fitness, and farming. Influence is earned through consistent participation and contribution — never bought, traded, or transferred.

---

## Architecture

```
stellar-circles/
├── apps/
│   ├── web/          # Next.js frontend (TypeScript + Tailwind)
│   └── api/          # Node.js/Express backend (TypeScript)
├── packages/
│   ├── shared/       # Shared TypeScript types & utilities
│   └── stellar-client/ # Stellar SDK integration helpers
├── database/
│   ├── migrations/   # PostgreSQL SQL migrations
│   └── seeds/        # Seed data
└── docs/             # Architecture & API documentation
```

## Key Concepts

| Concept | Description |
|---|---|
| **Circle** | A micro-society built around a shared interest or goal |
| **Influence** | Non-transferable social capital earned through participation |
| **Activity** | Any logged contribution (attendance, task, milestone) |
| **Decision** | A proposal within a circle, weighted by member influence |
| **Streak** | Consistency multiplier that boosts influence gain |

## Circle Types

- 🎓 **Learning** — Study groups, knowledge sharing, skill progression
- 💼 **Business** — Startup collaboration, accountability, idea validation
- 💪 **Fitness** — Workout tracking, group challenges, health habits
- 🌾 **Farming** — Agricultural cooperation, seasonal planning, resource sharing

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10
- Docker & Docker Compose

### 1. Clone & Install

```bash
git clone https://github.com/Fayedamz/Stellar-Circles.git
cd Stellar-Circles
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start Infrastructure

```bash
npm run docker:up
```

### 4. Run Database Migrations

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development Servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs

---

## Influence Model

Influence is a **living social signal** — not a static score.

```
influence_score = (participation_count × activity_weight)
                × consistency_multiplier
                × quality_factor
                − decay_penalty
```

- **Decay**: 5% reduction per week of inactivity
- **Streak Multiplier**: consecutive weeks × 0.1 bonus (max 2×)
- **Quality Factor**: peer-rated contribution quality (0.5–1.5)
- **Context-specific**: influence in one circle doesn't transfer to another

---

## Stellar Integration

Activity anchoring is optional but provides:
- Immutable participation records on Stellar testnet/mainnet
- Transparent contribution history
- Secure identity anchoring via Stellar account addresses

See [docs/stellar-integration.md](./docs/stellar-integration.md) for details.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Primary DB | PostgreSQL 16 |
| Activity DB | MongoDB 7 |
| Cache | Redis 7 |
| Blockchain | Stellar SDK (optional) |
| Monorepo | Turborepo + npm workspaces |

---

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Influence Model](./docs/influence-model.md)
- [Stellar Integration](./docs/stellar-integration.md)

---

## Roadmap

- **Phase 1** — Circle System MVP (circle creation, membership, basic influence)
- **Phase 2** — Social Capital Engine (advanced weighting, decisions)
- **Phase 3** — Vertical Circles (learning, business, fitness, farming modules)
- **Phase 4** — Ecosystem Expansion (cross-circle identity, analytics, blockchain anchoring)

---

## License

MIT
