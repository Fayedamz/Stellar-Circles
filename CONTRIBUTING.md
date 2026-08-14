# Contributing to Stellar Circles

Thank you for your interest in contributing to Stellar Circles! This document provides everything you need to get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Contributions](#making-contributions)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Wave Contributor Model](#wave-contributor-model)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:
- Be respectful and professional
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints

---

## Getting Started

### Prerequisites

**For Smart Contract Development:**
- Rust (latest stable): `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- Soroban CLI: `cargo install --locked soroban-cli`
- wasm32 target: `rustup target add wasm32-unknown-unknown`

**For Frontend/Backend:**
- Node.js >= 20: [nodejs.org](https://nodejs.org)
- npm >= 10
- Docker: [docker.com](https://docker.com)

**Recommended:**
- VS Code with Rust Analyzer extension
- Stellar Laboratory: [laboratory.stellar.org](https://laboratory.stellar.org)

---

## Development Setup

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/Stellar-Circles.git
cd Stellar-Circles
```

### 2. Install Dependencies

```bash
# Install npm dependencies (frontend/backend)
npm install

# Contracts have their own Cargo.toml files
cd contracts/circle
cargo build
```

### 3. Start Local Infrastructure

```bash
# Start Postgres, MongoDB, Redis
npm run docker:up

# Run database migrations
npm run db:migrate
```

### 4. Start Local Stellar Network (for contract testing)

```bash
soroban network start
```

### 5. Run Everything

```bash
# In separate terminals:

# Terminal 1: Frontend
cd apps/web
npm run dev

# Terminal 2: Backend API
cd apps/api
npm run dev

# Terminal 3: Contract tests (watch mode)
cd contracts/circle
cargo watch -x test
```

---

## Project Structure

```
stellar-circles/
├── contracts/              # Soroban smart contracts (Rust)
│   ├── circle/             # Circle creation & management
│   ├── membership/         # Membership & roles
│   ├── reputation/         # Participation tracking (TODO)
│   └── decisions/          # Voting & proposals (TODO)
├── apps/
│   ├── web/                # Next.js frontend
│   └── api/                # Node.js backend
├── packages/
│   ├── shared/             # Shared TypeScript types
│   └── stellar-client/     # Stellar SDK helpers
├── database/
│   ├── migrations/         # PostgreSQL migrations
│   └── seeds/              # Seed data
├── tests/                  # Integration tests (TODO)
├── docs/                   # Documentation
└── examples/               # Reference implementations (TODO)
```

---

## Making Contributions

### Finding Work

1. Browse [open issues](https://github.com/Fayedamz/Stellar-Circles/issues)
2. Look for labels:
   - `good first issue` — beginner-friendly
   - `help wanted` — actively seeking contributors
   - `smart-contract` — Soroban/Rust work
   - `frontend` — React/Next.js work
   - `backend` — Node.js/API work
   - `documentation` — writing/docs work

3. Comment on an issue to claim it
4. Wait for maintainer acknowledgment before starting work

### Creating Issues

Before opening a new issue:
- Check if it already exists
- Provide clear reproduction steps for bugs
- Include relevant logs, screenshots, error messages
- For features, explain the **why** (use case) not just the **what**

Use issue templates:
- Bug Report
- Feature Request
- Smart Contract Enhancement
- Documentation Update

---

## Pull Request Process

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming convention:
- `feature/` — new features
- `fix/` — bug fixes
- `docs/` — documentation
- `test/` — test additions
- `refactor/` — code refactoring

### 2. Make Changes

- Write clean, documented code
- Follow existing code style
- Add tests for new functionality
- Update documentation if needed

### 3. Test Your Changes

**Smart Contracts:**
```bash
cd contracts/YOUR_CONTRACT
cargo test
cargo clippy -- -D warnings
```

**Frontend/Backend:**
```bash
npm run lint
npm run test  # when tests exist
```

### 4. Commit

Use conventional commits:
```bash
git commit -m "feat(circle): add pause/unpause functionality"
git commit -m "fix(membership): prevent duplicate join attempts"
git commit -m "docs: update influence model explanation"
git commit -m "test(reputation): add participation tracking tests"
```

Commit format:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`

### 5. Push & Open PR

```bash
git push origin your-branch-name
```

Then open a PR on GitHub with:
- Clear title describing the change
- Description explaining **why** (not just what)
- Reference related issues: "Closes #123"
- Screenshots/demos for UI changes
- Test results for contract changes

### 6. Code Review

- Respond to feedback promptly
- Make requested changes in new commits (don't force-push)
- Mark conversations as resolved after addressing
- Be patient — reviews may take a few days

---

## Code Standards

### Rust (Smart Contracts)

- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` before committing
- Run `cargo clippy` and fix all warnings
- Document public functions with `///` doc comments
- Add `#[cfg(test)]` tests for all public functions

Example:
```rust
/// Creates a new circle with the given parameters.
///
/// # Arguments
/// * `env` - The contract environment
/// * `circle_id` - Unique identifier for the circle
/// * `name` - Human-readable circle name
///
/// # Panics
/// Panics if a circle with this ID already exists
pub fn create_circle(
    env: Env,
    circle_id: String,
    name: String,
) -> Circle {
    // implementation
}
```

### TypeScript (Frontend/Backend)

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use named exports over default exports
- Document complex functions with JSDoc
- Follow existing patterns in the codebase

Example:
```typescript
/**
 * Calculate influence-weighted vote result
 * @param votes - Array of cast votes with influence weights
 * @returns Aggregated result with percentages
 */
export function calculateVoteResult(
  votes: Vote[]
): DecisionResult {
  // implementation
}
```

### File Naming

- Rust: `snake_case.rs`
- TypeScript: `camelCase.ts` for functions, `PascalCase.tsx` for components
- Tests: `*.test.ts`, `test.rs` module

---

## Testing Guidelines

### Smart Contract Tests

Every public function needs a test:

```rust
#[test]
fn test_create_circle() {
    // Setup
    let env = Env::default();
    let contract_id = env.register_contract(None, CircleContract);
    
    // Execute
    let result = client.create_circle(...);
    
    // Assert
    assert_eq!(result.name, expected_name);
}

#[test]
#[should_panic(expected = "Expected error message")]
fn test_unauthorized_action() {
    // Test that unauthorized actions panic
}
```

Run tests:
```bash
cargo test
cargo test test_name -- --nocapture  # with output
```

### Frontend/Backend Tests

(To be added as testing infrastructure is built)

```typescript
describe('Circle API', () => {
  it('should create a circle', async () => {
    const response = await apiClient.post('/circles', payload);
    expect(response.status).toBe(201);
    expect(response.data.name).toBe('Test Circle');
  });
});
```

---

## Wave Contributor Model

Stellar Circles is designed for distributed contribution through the Wave model:

### How It Works

1. **Browse Issues** — find tasks with bounties or wave assignments
2. **Claim & Work** — comment to claim, receive guidance
3. **Submit PR** — follow PR process above
4. **Get Reviewed** — maintainer reviews and requests changes
5. **Merge & Credit** — once approved, PR is merged and you're credited

### Good First Issues

Start here if you're new:
- Add test coverage for existing contracts
- Write documentation for contract functions
- Create example circle implementations
- Improve error messages
- Add validation checks

### High-Impact Areas

For experienced contributors:
- Reputation contract implementation
- Influence calculation algorithm
- Decision/voting contract
- Frontend wallet integration
- Security audit & attack vectors

See [docs/wave-contributions.md](./docs/wave-contributions.md) for the full breakdown.

---

## Getting Help

Stuck? Reach out:

- **GitHub Discussions** — ask questions, share ideas
- **Issues** — for bugs and feature requests
- **PR Comments** — for code review questions

---

## Recognition

Contributors are recognized in:
- GitHub Contributors page
- Release notes for significant contributions
- README acknowledgments (for major features)

Thank you for helping build Stellar Circles! 🌟
