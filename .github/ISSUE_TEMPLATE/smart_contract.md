---
name: Smart Contract Task
about: Implement or improve a Soroban contract
title: '[CONTRACT] '
labels: smart-contract
assignees: ''
---

## Contract
**Which contract?** (circle, membership, reputation, decisions, or new)

## Objective
What needs to be implemented or improved?

## Specification

### Functions to Implement
```rust
/// Description
pub fn function_name(env: Env, param: Type) -> ReturnType {
    // TODO
}
```

### Storage Schema
What data needs to be stored?
```rust
const KEY: Symbol = symbol_short!("KEY");

#[contracttype]
pub struct DataStructure {
    field1: Type1,
    field2: Type2,
}
```

### Authorization
Who can call these functions? What checks are needed?

### Error Conditions
What should cause panics or errors?

## Test Cases Required
- [ ] Happy path test
- [ ] Authorization test (unauthorized caller)
- [ ] Edge case: ...
- [ ] Edge case: ...
- [ ] Integration test with other contracts (if applicable)

## Acceptance Criteria
- [ ] All specified functions implemented
- [ ] 100% test coverage of new code
- [ ] All tests pass (`cargo test`)
- [ ] No clippy warnings (`cargo clippy -- -D warnings`)
- [ ] Code formatted (`cargo fmt`)
- [ ] Public functions documented with `///` comments
- [ ] Gas usage measured and reasonable

## References
- Related issues: #...
- Design docs: ...
- Similar implementations: ...

## Estimated Effort
(Select one)
- [ ] Small (< 8 hours)
- [ ] Medium (8–20 hours)
- [ ] Large (20–40 hours)
- [ ] Extra Large (> 40 hours)

## For Contributors
See [CONTRIBUTING.md](../CONTRIBUTING.md) for setup instructions.  
Comment "I'd like to work on this" to claim.
