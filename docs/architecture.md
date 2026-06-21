# Stellar Circles — Architecture Overview

## System Design

Stellar Circles is a monorepo with three layers: a Next.js frontend, a Node.js/Express API, and a dual-database storage layer (PostgreSQL + MongoDB).

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                  │
│   (React, Tailwind, SWR, WebSocket client)          │
└───────────────────────┬─────────────────────────────┘
                        │ REST + WebSocket
┌───────────────────────▼─────────────────────────────┐
│               Express API (Node.js)                 │
│  Auth │ Circles │ Members │ Activities │ Influence   │
│  Decisions │ Stellar Service │ WebSocket Events      │
└──────┬─────────────────────┬───────────────────────-┘
       │                     │
┌──────▼──────┐     ┌────────▼────────┐     ┌──────────────┐
│ PostgreSQL  │     │    MongoDB      │     │   Stellar    │
│ (relational │     │ (activity logs, │     │  Network     │
│  data)      │     │  participation) │     │ (optional)   │
└─────────────┘     └─────────────────┘     └──────────────┘
```

## Database Strategy

| Data Type | Store | Reasoning |
|---|---|---|
| Users, Circles, Memberships | PostgreSQL | Relational, ACID, FK constraints |
| Decisions, Votes, Influence snapshots | PostgreSQL | Transactional integrity required |
| Activities (high-volume append) | MongoDB | Flexible schema, high write throughput |
| Participation logs (weekly) | MongoDB | Document per week, easy aggregation |

## Influence Engine

The influence engine runs as a service (`influence.service.ts`) triggered on every activity log. It reads from both databases and writes a snapshot back to PostgreSQL.

The weekly decay cron job (to be added in Phase 2) calls `recomputeInfluence` for all members who were inactive.

## Real-time Layer

WebSocket events flow through an internal EventEmitter bus:

```
Controller → emit() → EventEmitter → WebSocket Handler → Client
```

Clients subscribe to circle channels by sending:
```json
{ "type": "subscribe", "circleId": "<uuid>" }
```

## Security

- JWT-based authentication (7-day expiry, configurable)
- Rate limiting on all endpoints (stricter on auth)
- Helmet for HTTP security headers
- Input validation via express-validator + Zod
- Parameterized queries via Knex (no SQL injection)
