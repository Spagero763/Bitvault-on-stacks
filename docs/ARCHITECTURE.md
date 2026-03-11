# Architecture

BitVault is a set of small, focused Clarity contracts plus a React dashboard.
This document explains how the pieces fit together and the path a typical action
takes through the system.

## Contracts

### multisig-vault

The base contract. It owns the concept of a *vault*: a named group with an owner,
a set of members, per-member roles, and a signing threshold. Every other contract
asks `multisig-vault` whether a principal is a member or the owner of a vault
before allowing an action.

### proposal-engine

Holds the lifecycle of a *proposal*. A member of a vault creates a proposal with a
type, a voting period, and optional transfer targets. The engine tracks status
(active, passed, rejected, executed, expired) and enforces a time-lock between a
proposal passing and being executed.

### voting

Records votes against a proposal. It reads membership from `multisig-vault` and
proposal state from `proposal-engine`, prevents double voting, supports per-member
vote weights, and finalizes a proposal once voting closes.

### treasury

Custodies STX for each vault. Anyone can deposit. Withdrawals only happen by
executing a passed, time-lock-cleared transfer proposal. The treasury keeps a
running transaction history per vault.

### governance-token

A SIP-010 fungible token (BVT) intended for token-weighted voting and incentives.

## A proposal end to end

1. A member calls `create-proposal` on `proposal-engine`.
2. Members call `cast-vote` on `voting` during the voting period.
3. `finalize-votes` tallies the result and asks `proposal-engine` to mark the
   proposal passed or rejected.
4. If passed, a time-lock starts. After it clears, a member calls
   `execute-transfer` on `treasury`, which moves the funds and flags the proposal
   executed.

## Why separate contracts

Splitting responsibilities keeps each contract small enough to reason about and
lets membership, governance, and fund custody evolve independently.
