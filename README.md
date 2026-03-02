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

## Architecture

BitVault is made up of five Clarity contracts that build on one another:

| Contract | Responsibility |
| --- | --- |
| `multisig-vault` | Vault creation, membership, roles, and signing threshold. |
| `proposal-engine` | Proposal lifecycle: creation, finalization, time-lock, execution flag. |
| `voting` | Vote casting, weighting, tallying, and quorum. |
| `treasury` | STX deposits, proposal-gated withdrawals, and transaction history. |
| `governance-token` | SIP-010 BVT token used for token-weighted voting. |

Dependencies flow upward: `proposal-engine` reads the vault, `voting` reads both
the vault and proposals, and `treasury` executes transfers approved by a passed
proposal.

```
governance-token        multisig-vault
                              |
                       proposal-engine
                          /        \
                     voting       treasury
```

## Status

Deployed to the Stacks testnet and under active development. Contracts are
written for Clarity 3.
