# Wave Contributor Guide

This document maps how contributors fit into Stellar Circles through the **Wave** distributed development model.

---

## What is Wave?

Wave is a framework for distributed open-source contribution where:
- Work is broken into discrete, well-defined tasks
- Tasks have clear specifications and acceptance criteria
- Contributors claim tasks, complete them, and get recognized
- Quality work leads to ongoing collaboration opportunities

Stellar Circles is **built for Wave** — the architecture, documentation, and issue structure are designed to enable parallel contributions.

---

## Contribution Map

### 🔷 Smart Contracts (Soroban/Rust)

**Skill Level:** Intermediate to Advanced  
**Time Commitment:** 10–40 hours per contract  
**Prerequisites:** Rust, blockchain concepts, Soroban SDK

| Task | Description | Difficulty | Status |
|---|---|---|---|
| **Reputation Contract** | Track participation events on-chain, calculate base reputation scores | Advanced | 🚧 Active |
| **Influence Engine** | Implement streak multipliers, quality factors, decay formula | Advanced | 🚧 Active |
| **Decision Contract** | Create proposals, cast influence-weighted votes, tally results | Advanced | 📋 Planned |
| **Participation Verification** | Off-chain oracle integration for activity validation | Advanced | 📋 Planned |
| **Cross-Contract Integration** | Circle ↔ Membership ↔ Reputation flow | Advanced | 📋 Planned |

**Contributor Work:**
1. Review contract specifications in issue
2. Write Rust implementation following existing patterns
3. Add comprehensive unit tests (90%+ coverage target)
4. Document all public functions
5. Submit PR with test results and gas estimates

**Example Issue:** "Implement Reputation Contract with Participation Tracking"

---

### 🎨 Frontend (React/Next.js/TypeScript)

**Skill Level:** Intermediate  
**Time Commitment:** 5–20 hours per feature  
**Prerequisites:** React, Next.js, TypeScript, Tailwind CSS

| Task | Description | Difficulty | Status |
|---|---|---|---|
| **Wallet Connection** | Integrate Freighter/Albedo wallet for Stellar authentication | Intermediate | 📋 Planned |
| **Contract Interaction** | Call Soroban contracts from frontend (read/write) | Intermediate | 📋 Planned |
| **Circle Explorer** | Browse, filter, search circles with real contract data | Beginner | 📋 Planned |
| **Influence Dashboard** | Visualize member's influence across circles | Intermediate | 📋 Planned |
| **Voting Interface** | UI for creating proposals and casting influence-weighted votes | Intermediate | 📋 Planned |
| **Activity Logger** | Form for logging participation events | Beginner | 📋 Planned |
| **Real-time Updates** | WebSocket integration for live activity feed | Intermediate | 📋 Planned |

**Contributor Work:**
1. Design component mockups (optional but helpful)
2. Implement React components following project patterns
3. Connect to Soroban contracts via SDK
4. Add error handling and loading states
5. Test with local Stellar network
6. Submit PR with screenshots/video

**Example Issue:** "Build Wallet Connection Flow with Freighter Integration"

---

### ⚙️ Backend (Node.js/Express/TypeScript)

**Skill Level:** Intermediate  
**Time Commitment:** 5–15 hours per feature  
**Prerequisites:** Node.js, Express, TypeScript, PostgreSQL, MongoDB

| Task | Description | Difficulty | Status |
|---|---|---|---|
| **Contract Event Indexer** | Listen to Soroban events, index to PostgreSQL | Intermediate | 📋 Planned |
| **Participation Oracle** | Off-chain verification service for activities | Advanced | 📋 Planned |
| **Notification Service** | Real-time WebSocket notifications for circle events | Intermediate | ✅ Done |
| **Influence Snapshot Service** | Background job to compute & cache influence scores | Intermediate | 🚧 Active |
| **Analytics API** | Endpoints for circle stats, participation trends | Beginner | 📋 Planned |
| **Search Service** | Full-text search for circles and members | Intermediate | 📋 Planned |

**Contributor Work:**
1. Review API specification in issue
2. Implement endpoints following REST conventions
3. Add input validation and error handling
4. Write integration tests
5. Update API documentation
6. Submit PR with test coverage report

**Example Issue:** "Implement Contract Event Indexer for Participation Tracking"

---

### 🧪 Testing

**Skill Level:** Beginner to Intermediate  
**Time Commitment:** 2–10 hours per test suite  
**Prerequisites:** Basic programming, understanding of testing concepts

| Task | Description | Difficulty | Status |
|---|---|---|---|
| **Contract Unit Tests** | Expand test coverage for existing contracts | Beginner | 🚧 Active |
| **Integration Tests** | Test contract interactions (Circle → Membership → Reputation) | Intermediate | 📋 Planned |
| **Frontend E2E Tests** | Playwright/Cypress tests for user flows | Intermediate | 📋 Planned |
| **Security Tests** | Test auth, manipulation vectors, attack scenarios | Advanced | 📋 Planned |
| **Load Tests** | Stress test contracts and API under high load | Intermediate | 📋 Planned |

**Contributor Work:**
1. Identify gaps in test coverage
2. Write additional test cases
3. Ensure tests are deterministic and isolated
4. Document what each test validates
5. Submit PR with coverage report

**Example Issue:** "Add Security Tests for Membership Contract Authorization"

---

### 📝 Documentation

**Skill Level:** Beginner  
**Time Commitment:** 2–8 hours per doc  
**Prerequisites:** Clear writing, understanding of the project

| Task | Description | Difficulty | Status |
|---|---|---|---|
| **Contract Function Docs** | Document each contract function with examples | Beginner | 🚧 Active |
| **Integration Guides** | How to integrate Stellar Circles into your app | Beginner | 📋 Planned |
| **Video Tutorials** | Screen recordings of setup, deployment, usage | Beginner | 📋 Planned |
| **Architecture Diagrams** | Visual explanations of system design | Intermediate | 📋 Planned |
| **API Reference** | Complete OpenAPI/Swagger spec for backend | Beginner | 🚧 Active |
| **Influence Model Deep-Dive** | Detailed explanation with examples and edge cases | Intermediate | 📋 Planned |

**Contributor Work:**
1. Review existing documentation
2. Identify gaps or unclear sections
3. Write clear, example-driven documentation
4. Add diagrams where helpful (mermaid, excalidraw)
5. Submit PR with before/after comparison

**Example Issue:** "Document Reputation Contract with Usage Examples"

---

### 🛡️ Security

**Skill Level:** Advanced  
**Time Commitment:** 10–40 hours  
**Prerequisites:** Security background, smart contract auditing experience

| Task | Description | Difficulty | Status |
|---|---|---|---|
| **Authorization Review** | Audit all access control mechanisms | Advanced | 📋 Planned |
| **Attack Vector Analysis** | Document potential exploits and mitigations | Advanced | 📋 Planned |
| **Formal Verification** | Prove key properties (influence can't be inflated, etc.) | Expert | 📋 Planned |
| **Penetration Testing** | Attempt to break the system in controlled environment | Advanced | 📋 Planned |

**Contributor Work:**
1. Review contract code for vulnerabilities
2. Document attack vectors with proof-of-concept
3. Propose mitigations
4. Verify fixes
5. Submit security advisory (private initially)

**Example Issue:** "Security Audit: Reputation Contract Manipulation Vectors"

---

### 🌱 Example Implementations

**Skill Level:** Beginner to Intermediate  
**Time Commitment:** 5–15 hours per example  
**Prerequisites:** Understanding of Stellar Circles concepts

| Task | Description | Difficulty | Status |
|---|---|---|---|
| **Learning Circle Template** | Pre-configured circle for study groups | Beginner | 📋 Planned |
| **Business Circle Template** | Startup accountability group setup | Beginner | 📋 Planned |
| **Fitness Circle Template** | Workout challenge circle configuration | Beginner | 📋 Planned |
| **Farming Circle Template** | Agricultural cooperative template | Beginner | 📋 Planned |
| **Custom Activity Types** | Example activity definitions for each vertical | Intermediate | 📋 Planned |

**Contributor Work:**
1. Design circle configuration for specific use case
2. Define relevant activity types and weights
3. Create sample data and scenarios
4. Document setup process
5. Submit PR with complete example

**Example Issue:** "Create Learning Circle Template with Study Group Activities"

---

## How to Get Started

### 1. Find Your Area

Pick an area that matches your skills:
- Strong in Rust? → Smart Contracts
- Love React? → Frontend
- Enjoy writing? → Documentation
- Security minded? → Security Review

### 2. Browse Issues

Go to [Issues](https://github.com/Fayedamz/Stellar-Circles/issues) and filter by:
- `good first issue` — if you're new
- `help wanted` — actively seeking contributors
- Your chosen area label: `smart-contract`, `frontend`, `backend`, `testing`, `documentation`

### 3. Claim an Issue

Comment on the issue:
```
I'd like to work on this. My approach would be:
1. [step 1]
2. [step 2]
3. [step 3]

Estimated completion: [timeframe]
Questions: [any clarifications needed]
```

Wait for maintainer acknowledgment before starting work.

### 4. Do the Work

Follow the guidelines in [CONTRIBUTING.md](../CONTRIBUTING.md):
- Set up development environment
- Create a feature branch
- Implement the solution
- Add tests
- Update documentation
- Follow code standards

### 5. Submit PR

- Clear title and description
- Reference the issue: "Closes #123"
- Include test results
- Add screenshots/video for UI changes
- Respond to review feedback

### 6. Get Merged

Once approved:
- PR is merged
- You're credited in the commit
- Issue is closed
- You're added to contributors list

### 7. Keep Contributing

Build reputation in the project:
- High-quality work → more complex tasks
- Consistent contributions → maintainer role consideration
- Domain expertise → architecture input

---

## Contributor Levels

### 🌱 Beginner

**Who:** New to the project or open source  
**Tasks:** Documentation, beginner-labeled issues, test additions  
**Support:** Detailed guidance, fast feedback, learning resources  
**Goal:** Learn the codebase, build confidence

### 🌿 Intermediate

**Who:** Familiar with tech stack, contributed 2–3 PRs  
**Tasks:** Feature implementation, bug fixes, integration work  
**Support:** Technical guidance, architecture context  
**Goal:** Ship complete features independently

### 🌳 Advanced

**Who:** Deep project knowledge, 5+ merged PRs  
**Tasks:** Complex features, cross-cutting changes, security review  
**Support:** Architectural decisions, design input  
**Goal:** Drive major features, mentor others

### 🏆 Core Contributor

**Who:** Long-term contributors with extensive contributions  
**Tasks:** Architecture, roadmap, release management  
**Support:** Maintainer access, decision authority  
**Goal:** Shape project direction

---

## Recognition

Contributors are recognized through:

1. **GitHub Contributors** — automatic on merge
2. **README Acknowledgments** — major features listed
3. **Release Notes** — contributions mentioned in releases
4. **Maintainer Consideration** — consistent high-quality work leads to maintainer role

---

## Success Stories

*(To be populated as contributors ship work)*

> "I started with documentation and now I'm building the reputation contract." — [Contributor Name]

> "The Wave model made it easy to contribute meaningful work in focused blocks." — [Contributor Name]

---

## Questions?

- **General Questions:** Open a GitHub Discussion
- **Task-Specific:** Comment on the issue
- **Technical Help:** Ask in PR review comments

We're here to help you succeed! 🚀
