# Security Considerations

Stellar Circles is a reputation and influence system built on Soroban. Because influence affects decision-making, we must address manipulation, gaming, and attack vectors.

---

## Threat Model

### Assets at Risk

1. **Influence scores** — manipulated scores can distort decision power
2. **Circle membership** — unauthorized access or removal
3. **Participation records** — fake or duplicated activities
4. **Decision outcomes** — vote manipulation, collusion
5. **Admin privileges** — unauthorized control transfers

### Attackers

- **External** — non-members trying to manipulate circles
- **Internal** — members gaming the system for disproportionate influence
- **Colluding groups** — coordinated manipulation
- **Compromised admins** — malicious or hacked admin accounts

---

## Attack Vectors

### 1. Sybil Attacks

**Threat:** Attacker creates multiple fake identities to gain disproportionate influence.

**Mitigations:**
- ✅ **Stellar account requirement** — each member needs a funded Stellar account (small cost barrier)
- 🚧 **Admin-approved membership** — circles can require invite/approval
- 🚧 **Social verification** — link to external identity (GitHub, email, etc.)
- 📋 **Participation verification** — activities require off-chain validation before on-chain recording

**Current Status:**  
Circle contract supports admin control. Membership contract has invite functionality. Need to add verification layer for participation recording.

**Residual Risk:**  
Attacker could still create multiple Stellar accounts. This is expensive at scale but possible. Social verification layer needed.

---

### 2. Fake Participation

**Threat:** Members log activities they didn't actually perform to inflate influence.

**Mitigations:**
- 📋 **Off-chain validation** — activities verified by circle admin or oracle before on-chain record
- 📋 **Multi-sig requirements** — significant activities require approval from 2+ admins
- 📋 **Attestation system** — other members can vouch for/challenge activities
- 📋 **Time-locked recording** — activities can only be logged within N hours of occurrence
- 📋 **External proofs** — link activities to verifiable external events (GitHub commits, GPS check-ins, etc.)

**Current Status:**  
No participation contract yet. This is **critical priority** for Phase 2.

**Residual Risk:**  
Without external validation, relies on admin honesty. Need robust verification layer.

---

### 3. Reputation Farming

**Threat:** Members optimize for influence gain without genuine contribution.

**Examples:**
- Logging many low-value activities instead of meaningful contributions
- Gaming the streak system by minimal weekly participation
- Exploiting activity weight differences

**Mitigations:**
- ✅ **Quality factor** — peer ratings affect influence calculation
- ✅ **Diminishing returns** — influence growth slows as participation increases
- 🚧 **Activity caps** — limit how many activities can be logged per day/week
- 🚧 **Decay mechanism** — 5% weekly decay for inactive members
- 📋 **Peer review** — members can flag suspicious patterns

**Current Status:**  
Influence model designed with these in mind (see `docs/influence-model.md`). Implementation pending.

**Residual Risk:**  
Determined attacker can still optimize within the rules. Need ongoing monitoring and formula adjustments.

---

### 4. Collusion

**Threat:** Group of members coordinate to manipulate decisions or inflate each other's influence.

**Examples:**
- Vote brigading — coordinated voting to pass/block proposals
- Mutual endorsement rings — members artificially boost each other's quality scores
- Admin conspiracies — multiple admins collude to manipulate circle

**Mitigations:**
- ✅ **Influence caps** — maximum voting weight per member (even with high influence)
- ✅ **Square-root dampening** — vote weight = √(score/max_score), not linear
- 🚧 **Quorum requirements** — decisions need minimum % of members to vote
- 🚧 **Public audit trail** — all votes and participation visible on-chain
- 📋 **Anomaly detection** — flag unusual voting patterns or endorsement networks
- 📋 **Time delays** — proposals have minimum deliberation period before voting closes

**Current Status:**  
Vote weighting formula includes dampening. Decision contract not yet implemented.

**Residual Risk:**  
Organized groups can still coordinate. Transparency helps but doesn't prevent.

---

### 5. Influence Concentration

**Threat:** Single member or small group accumulates overwhelming influence.

**Mitigations:**
- ✅ **Influence caps** — maximum influence score per member
- ✅ **Vote weight caps** — even max-influence member has limited % of total vote weight
- ✅ **Decay** — inactive high-influence members lose score over time
- 🚧 **Participation requirements** — minimum activity level to maintain influence
- 📋 **Term limits** — admin roles expire after N months (requires re-election)
- 📋 **Influence redistribution** — decayed influence doesn't disappear, gets redistributed

**Current Status:**  
Caps and decay designed. Implementation pending.

**Residual Risk:**  
Founder effect — early members naturally have more influence. This is somewhat intentional (reward early contributors) but needs monitoring.

---

### 6. Admin Abuse

**Threat:** Circle admin acts maliciously or gets compromised.

**Examples:**
- Removing legitimate members
- Approving fake participation
- Blocking proposals
- Transferring admin to attacker

**Mitigations:**
- ✅ **Authorization checks** — all admin functions require signature verification (Soroban native)
- ✅ **Multi-admin** — circles can have multiple admins (implemented in membership contract)
- 🚧 **Admin removal vote** — members can vote to remove admin (requires decision contract)
- 🚧 **Time delays** — admin actions (removals, etc.) have delay period where other admins can veto
- 📋 **Admin activity log** — transparent on-chain record of all admin actions
- 📋 **Emergency pause** — contract pause mechanism for suspected compromise

**Current Status:**  
Admin authorization works. Multi-admin supported. Removal/veto mechanisms pending.

**Residual Risk:**  
Single-admin circles are vulnerable. Encourage multi-admin governance.

---

### 7. Duplicate Activity

**Threat:** Same activity logged multiple times to inflate influence.

**Mitigations:**
- 📋 **Activity IDs** — each activity has unique identifier, duplicate IDs rejected
- 📋 **Timestamp validation** — prevent logging the same activity type within short time window
- 📋 **Merkle proofs** — activities reference external proof that can't be reused
- 📋 **Nonce system** — activities include incrementing nonce per member

**Current Status:**  
Not yet implemented (no participation contract yet).

**Residual Risk:**  
Critical to get right in Phase 2. Without this, the whole system breaks.

---

### 8. Wallet Compromise

**Threat:** Attacker gains access to member's Stellar secret key.

**Mitigations:**
- ✅ **Stellar native security** — uses Stellar's account security model
- 📋 **Multi-sig accounts** — members can use multi-sig Stellar accounts
- 📋 **Activity anomaly detection** — flag sudden unusual participation patterns
- 📋 **Influence freeze** — member can freeze their influence if they suspect compromise
- 📋 **Recovery mechanism** — social recovery to new account with influence transferred

**Current Status:**  
Relies on Stellar security. Application-level protections pending.

**Residual Risk:**  
If wallet compromised, attacker can impersonate member until detected. Need detection + recovery.

---

### 9. Smart Contract Bugs

**Threat:** Bugs in Soroban contracts allow unintended behavior.

**Mitigations:**
- ✅ **Comprehensive tests** — unit tests for all functions (implemented for circle & membership)
- 🚧 **Integration tests** — test contract interactions
- 📋 **Formal verification** — mathematically prove key properties
- 📋 **External audit** — professional security audit before mainnet
- 📋 **Bug bounty** — incentivize responsible disclosure
- 📋 **Upgrade mechanism** — ability to fix bugs without losing state

**Current Status:**  
Unit tests exist. Need integration tests, audit, and upgrade plan.

**Residual Risk:**  
Contracts are immutable once deployed. Bugs are permanent unless upgrade mechanism exists.

---

### 10. Front-Running

**Threat:** Attacker sees pending decision vote in mempool and submits competing transaction with higher fee.

**Mitigations:**
- ✅ **Stellar fee structure** — base fee model reduces front-running incentive
- 🚧 **Commit-reveal voting** — members commit hash of vote, then reveal later
- 📋 **Batch voting** — votes processed in batches, reducing MEV opportunity

**Current Status:**  
Not yet relevant (no decision contract). Consider for Phase 3.

**Residual Risk:**  
Less of an issue on Stellar than Ethereum, but still possible.

---

## Security Roadmap

### Phase 1 (Current)
- ✅ Authorization checks in all contracts
- ✅ Comprehensive unit tests
- ✅ Input validation

### Phase 2 (Q2 2025)
- 🚧 Participation verification layer
- 🚧 Influence calculation with caps & decay
- 🚧 Integration tests
- 🚧 Anomaly detection design

### Phase 3 (Q3 2025)
- 📋 Decision contract with vote dampening
- 📋 Multi-sig requirements
- 📋 External security audit
- 📋 Bug bounty program

### Phase 4 (Q4 2025)
- 📋 Formal verification (critical paths)
- 📋 Social recovery mechanism
- 📋 Upgrade/migration plan
- 📋 Testnet battle-testing

---

## Reporting Security Issues

**Do not open public issues for security vulnerabilities.**

Instead:
1. Email: [security contact to be added]
2. Provide:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)

We will respond within 48 hours and work with you on a fix and disclosure timeline.

---

## Security Assumptions

Stellar Circles assumes:

1. **Soroban platform security** — we trust Stellar's VM and consensus
2. **Stellar account security** — members protect their secret keys
3. **Off-chain coordination** — some verification happens outside smart contracts
4. **Admin honesty** — circles with single admins trust that admin
5. **Rational actors** — gaming the system is more expensive than legitimate participation

If any of these assumptions break, the system may not provide intended guarantees.

---

## Conclusion

Security is an ongoing process. This document will evolve as:
- Contracts are implemented and tested
- Attack vectors are discovered
- Mitigation strategies are deployed
- Community feedback is received

**Current priority:** Implement participation verification layer with robust anti-duplication and validation mechanisms.

Last updated: 2025-01-XX
