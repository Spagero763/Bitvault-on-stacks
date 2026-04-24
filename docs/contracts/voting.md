# voting

Records and tallies votes for proposals. Reads membership from `multisig-vault`
and proposal state from `proposal-engine`.

## Vote weights

Each member has a vote weight, defaulting to 1. A vault owner can override a
member's weight with `set-vote-weight`, which enables token- or role-weighted
governance.

## Read-only functions

| Function | Returns |
| --- | --- |
| `get-vote-stats (proposal-id)` | Yes/no totals, voter count, finalized flag. |
| `get-vote-weight (vault-id voter)` | The voter's weight (default 1). |
| `has-voter-voted (proposal-id voter)` | Whether the voter already voted. |
| `get-total-weight-cast (proposal-id)` | Sum of yes and no weights. |
| `is-finalized (proposal-id)` | Whether the vote stats are finalized. |

## Events

`cast-vote` emits a `vote-cast` print event including the voter, choice, and
weight.

## Public functions

### `cast-vote (proposal-id vote)`

Casts a yes/no vote. The caller must be a vault member, the proposal must be
active, and the caller must not have voted before. The vote is weighted by the
caller's vote weight.

### `set-vote-weight (vault-id voter weight)`

Owner-only. Sets the vote weight for a member of the vault.

### `finalize-votes (proposal-id)`

Marks the vote stats finalized and asks `proposal-engine` to finalize the
proposal, returning the resulting status.
