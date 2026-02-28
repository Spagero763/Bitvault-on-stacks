# BitVault

> Multi-Signature Treasury & DAO Toolkit for Bitcoin, built on Stacks.

BitVault lets a group of people pool funds and govern them together. Create a
vault, add members, set a signing threshold, raise proposals, vote, and move
treasury funds only when the group agrees. Every action is secured by Bitcoin
through the Stacks blockchain.

## Features

- **Multi-sig vaults** — create vaults with a configurable signing threshold and
  up to 20 members.
- **On-chain governance** — members raise proposals (transfers, membership
  changes, threshold changes, or custom actions) and vote on them.
- **Treasury** — deposit STX into a vault and release funds only through an
  approved, time-locked proposal.
- **Governance token (BVT)** — a SIP-010 fungible token for token-weighted
  voting.
- **Web dashboard** — a React front end for managing vaults, proposals, and
  funds from a Stacks wallet.

## Status

Deployed to the Stacks testnet and under active development. Contracts are
written for Clarity 3.
