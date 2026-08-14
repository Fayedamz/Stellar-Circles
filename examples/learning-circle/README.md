# Learning Circle Example

This is a **reference implementation** of a Learning Circle — a study group using Stellar Circles infrastructure for participation tracking and influence-based decisions.

---

## Overview

**Use Case:** A group learning Soroban smart contract development together.

**Circle Properties:**
- **Name:** "Soroban Study Group"
- **Type:** Learning
- **Membership:** Open (anyone can join)
- **Activity Tracking:** Session attendance, resource sharing, peer mentoring

**Influence Factors:**
- Attending weekly study sessions (1.0 weight)
- Sharing learning resources (1.2 weight)
- Completing coding challenges (2.0 weight)
- Mentoring other members (1.8 weight)

---

## Setup

### 1. Deploy Contracts

```bash
# Deploy circle contract
soroban contract deploy \
  --wasm ../../contracts/circle/target/wasm32-unknown-unknown/release/stellar_circles_circle.wasm \
  --network testnet \
  --source ADMIN_SECRET_KEY

# Save contract ID
export CIRCLE_CONTRACT_ID=<returned_id>

# Deploy membership contract
soroban contract deploy \
  --wasm ../../contracts/membership/target/wasm32-unknown-unknown/release/stellar_circles_membership.wasm \
  --network testnet \
  --source ADMIN_SECRET_KEY

export MEMBERSHIP_CONTRACT_ID=<returned_id>
```

### 2. Initialize Circle

```bash
soroban contract invoke \
  --id $CIRCLE_CONTRACT_ID \
  --network testnet \
  --source ADMIN_SECRET_KEY \
  -- \
  create_circle \
  --circle_id "soroban-study-2025" \
  --name "Soroban Study Group" \
  --description "Learning Soroban smart contract development together" \
  --creator ADMIN_PUBLIC_KEY
```

### 3. Initialize Membership

```bash
soroban contract invoke \
  --id $MEMBERSHIP_CONTRACT_ID \
  --network testnet \
  --source ADMIN_SECRET_KEY \
  -- \
  initialize \
  --admin ADMIN_PUBLIC_KEY
```

### 4. Members Join

```bash
# Any Stellar account can join (open membership)
soroban contract invoke \
  --id $MEMBERSHIP_CONTRACT_ID \
  --network testnet \
  --source MEMBER_SECRET_KEY \
  -- \
  join_circle \
  --member MEMBER_PUBLIC_KEY
```

---

## Activity Types

### Session Attendance
**Weight:** 1.0  
**Trigger:** Attend weekly study session  
**Verification:** Admin marks attendance

```bash
# Future: Log participation via reputation contract
soroban contract invoke \
  --id $REPUTATION_CONTRACT_ID \
  -- \
  log_activity \
  --member MEMBER_PUBLIC_KEY \
  --activity_type SESSION_ATTENDED \
  --proof "session-2025-01-15-recording-url"
```

### Resource Sharing
**Weight:** 1.2  
**Trigger:** Share useful learning resource  
**Verification:** Admin or peer validation

Examples:
- Tutorial link with explanation
- Code example with documentation
- Video walkthrough

### Challenge Completion
**Weight:** 2.0  
**Trigger:** Complete weekly coding challenge  
**Verification:** GitHub PR link verified by admin

### Peer Mentoring
**Weight:** 1.8  
**Trigger:** Help another member debug or learn  
**Verification:** Mentee attestation + admin approval

---

## Influence Model

### Calculation
```
Base Score = SESSION_ATTENDED × 1.0 + RESOURCE_SHARED × 1.2 + ...
Consistency Multiplier = 1.0 + (consecutive_weeks × 0.1)  [max 2.0]
Quality Factor = 0.25 + (peer_rating_avg × 0.25)          [0.5–1.5]

Final Influence = Base × Consistency × Quality - Decay
```

### Example Member

**Alice:**
- Attended 8 sessions (8.0 points)
- Shared 3 resources (3.6 points)
- Completed 2 challenges (4.0 points)
- Mentored 1 member (1.8 points)

**Base:** 17.4  
**Streak:** 8 weeks → 1.8× multiplier  
**Quality:** 4.2/5 rating → 1.3× factor  
**Decay:** 0 (active)  

**Final Influence:** 17.4 × 1.8 × 1.3 = **40.7**

---

## Decision Examples

### Proposal: Change Study Time

**Created by:** Alice (influence: 40.7)  
**Question:** Should we move study sessions from Saturday 10am to Sunday 2pm?  
**Voting Period:** 7 days  

**Results:**
- FOR: Alice (40.7) + Bob (22.0) = 62.7 (68%)
- AGAINST: Carol (29.3) = 29.3 (32%)
- **Outcome:** PASSED (68% > 50%)

The decision passes because FOR votes carry more influence weight than AGAINST votes.

---

## Customization

### Activity Weights

Modify weights based on your group's values:

```rust
// In reputation contract config
pub const LEARNING_ACTIVITIES: [(ActivityType, f64); 4] = [
    (SESSION_ATTENDED, 1.0),    // baseline
    (RESOURCE_SHARED, 1.5),     // value sharing more
    (CHALLENGE_COMPLETED, 3.0), // highly value completion
    (PEER_MENTORED, 2.5),       // highly value helping
];
```

### Participation Requirements

Set minimum participation for maintaining influence:

```rust
// Circle rules
{
    min_weekly_activities: 1,  // must log at least 1 activity/week
    decay_rate: 0.05,           // 5% decay per inactive week
    max_influence_cap: 100.0,   // prevent excessive concentration
}
```

---

## Integration with Frontend

### Display Leaderboard

```typescript
// Fetch influence scores for circle
const leaderboard = await fetchCircleLeaderboard(circleId);

<div>
  {leaderboard.map((member, index) => (
    <div key={member.userId}>
      <span>#{index + 1}</span>
      <span>{member.username}</span>
      <InfluenceBar score={member.score} maxScore={leaderboard[0].score} />
      <span>{member.streakWeeks}w streak</span>
    </div>
  ))}
</div>
```

### Log Activity

```typescript
const logActivity = async (type: ActivityType, proof: string) => {
  const tx = await reputationContract.log_activity({
    member: walletAddress,
    activity_type: type,
    proof,
  });
  
  await tx.signAndSend();
  toast.success('Activity logged! Influence updated.');
};
```

---

## Best Practices

### 1. Verification

Don't trust self-reported participation. Use:
- GitHub PR links for code challenges
- Google Meet/Zoom attendance logs
- Peer attestations (2+ members confirm)
- Admin review queue

### 2. Quality Over Quantity

Reward meaningful contribution:
- Completing 1 challenge > attending 5 sessions without engagement
- Teaching others > just showing up
- Quality resources > spam links

### 3. Prevent Gaming

- Cap daily activity logging (max 3/day)
- Require proof for high-weight activities
- Admin can dispute/remove fraudulent entries
- Peer reporting mechanism

### 4. Maintain Engagement

- Weekly challenges keep people active
- Recognize top contributors
- Rotate discussion leadership
- Celebrate milestones (10-week streak!)

---

## See Also

- [Business Circle Example](../business-circle/)
- [Fitness Circle Example](../fitness-circle/)
- [Farming Circle Example](../farming-circle/)
- [Influence Model Deep Dive](../../docs/influence-model.md)
