# proposal-engine

Manages the lifecycle of governance proposals: creation, finalization, the
time-lock, and the execution flag.

## Statuses

| Constant | Value | Meaning |
| --- | --- | --- |
| STATUS-ACTIVE | u1 | Voting is open. |
| STATUS-PASSED | u2 | Reached the required votes; time-lock running. |
| STATUS-REJECTED | u3 | Voting period ended without passing. |
| STATUS-EXECUTED | u4 | The action has been carried out. |
| STATUS-EXPIRED | u5 | Reserved for expired proposals. |

## Proposal types

| Constant | Value |
| --- | --- |
| TYPE-TRANSFER | u1 |
| TYPE-ADD-MEMBER | u2 |
| TYPE-REMOVE-MEMBER | u3 |
| TYPE-CHANGE-THRESHOLD | u4 |
| TYPE-CUSTOM | u5 |

## Timing constants

- `TIMELOCK-PERIOD` (u144) — blocks between passing and execution.
- `MIN-VOTING-PERIOD` (u72) and `MAX-VOTING-PERIOD` (u4320) — allowed voting
  window in blocks.

## Read-only functions

| Function | Returns |
| --- | --- |
| `get-proposal (proposal-id)` | The proposal record, or none. |
| `get-proposal-status (proposal-id)` | The status code. |
| `has-voted (proposal-id voter)` | Whether a voter has a record. |
| `get-voter-info (proposal-id voter)` | The voter record, or none. |
| `get-proposal-nonce` | The next proposal id. |
| `is-proposal-active (proposal-id)` | Active and within the voting window. |
| `is-proposal-executable (proposal-id)` | Passed and past the time-lock. |
| `get-vote-counts (proposal-id)` | Yes, no, and required votes, or none. |
| `get-blocks-remaining (proposal-id)` | Blocks left in the voting window. |
| `is-proposal-passed (proposal-id)` | Whether the proposal has passed. |

## Public functions

### `create-proposal (vault-id title description proposal-type voting-period target-principal target-amount)`

Creates a proposal for a vault. The caller must be a member, the title must be
non-empty, and the voting period must be within range.

### `finalize-proposal (proposal-id)`

Moves an active proposal to passed (if it reached the required votes) or rejected
(if the voting window closed). Otherwise leaves it active.

### `mark-executed (proposal-id)`

Flags a passed proposal as executed once its time-lock has cleared. Called by the
treasury when it executes a transfer.

### `cancel-proposal (proposal-id)`

Lets the original proposer cancel their proposal while it is still active. The
status becomes `STATUS-CANCELLED` (u6).

## Events

Emits `proposal-created` and `proposal-cancelled` print events.
