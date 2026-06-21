# Stellar Circles — Influence Model

## Core Principles

1. **Non-transferable** — influence cannot be sent, sold, or delegated
2. **Non-tokenized** — it is a social signal, not a digital asset
3. **Context-specific** — your score in a Fitness circle is independent of your Business circle score
4. **Living** — grows with participation, decays with inactivity

## Formula

```
score = (Σ activity_weights) × consistency_multiplier × quality_factor − decay_penalty
```

### Components

**Activity Weight**
Each activity type has a weight (see `ACTIVITY_WEIGHTS` in `packages/shared/src/types/activity.ts`). High-value contributions (milestones, mentoring, cooperative tasks) carry higher weights.

**Consistency Multiplier**
```
multiplier = 1.0 + min(streak_weeks × 0.1, 1.0)
```
- Range: 1.0× (no streak) to 2.0× (10+ consecutive weeks)
- A member active for 5 consecutive weeks gets a 1.5× multiplier

**Quality Factor**
```
quality_factor = 0.25 + (peer_rating_avg × 0.25)
```
- Range: 0.5× (lowest rating) to 1.5× (highest rating)
- Based on peer endorsements and contribution ratings within the circle

**Decay**
```
decay = previous_score × (0.05 × weeks_inactive)
```
- 5% reduction per week of inactivity
- Prevents stale influence from dominating decisions indefinitely

## Voting Weight

When casting a vote, influence is normalized across the circle and square-root dampened to reduce extremes:

```
vote_weight = √(user_score / max_score_in_circle)
```

A member with 4× the score of another gets only 2× the vote weight — not 4×. This keeps decisions accessible while still rewarding contribution.

## Decay Schedule

A weekly cron job (Phase 2) will:
1. Find all members inactive for ≥ 1 week
2. Call `recomputeInfluence` for each
3. Emit `influence:updated` events for affected circles

## Context Isolation

Influence is stored per `(user_id, circle_id)` pair. There is no global influence score. This prevents cross-circle dominance and ensures relevance — a seasoned fitness tracker has no inherent advantage in a business accountability circle.
