# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- Project documentation: README, architecture, error-code reference, and
  per-contract guides.
- Contributing guide, security policy, and code of conduct.
- Continuous integration for the contracts and the frontend.
- `cancel-proposal` so a proposer can withdraw their own active proposal.
- `burn` on the governance token to reduce supply.
- Read-only helpers across the contracts: vault lock state and roles, proposal
  vote counts and timing, voting tallies, and treasury balance checks.
- `print` events on vault, proposal, voting, treasury, and token actions for
  off-chain indexing.

## [0.1.0] - 2026-02-25

### Added

- `multisig-vault` contract for vault creation, membership, and thresholds.
- `governance-token` SIP-010 token (BVT).
- `proposal-engine` for the proposal lifecycle and time-lock.
- `voting` contract for vote casting and tallying.
- `treasury` contract for STX deposits and proposal-gated withdrawals.
- Test suites for all contracts.
- React dashboard with Stacks testnet integration.
