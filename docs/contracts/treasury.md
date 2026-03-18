# treasury

Custodies STX for each vault and records a transaction history. Withdrawals are
gated by passed, time-lock-cleared transfer proposals.

## Read-only functions

| Function | Returns |
| --- | --- |
| `get-vault-balance (vault-id)` | The balance record (default zero). |
| `get-stx-balance (vault-id)` | The STX balance as a uint. |
| `get-transaction (vault-id tx-id)` | A single transaction record, or none. |
| `get-tx-count (vault-id)` | Number of recorded transactions. |

## Public functions

### `deposit-stx (vault-id amount)`

Transfers STX from the caller into the vault and records a `deposit` transaction.
Anyone can deposit into any vault.

### `execute-transfer (proposal-id)`

Executes a passed transfer proposal: checks the proposal type and executability,
ensures the vault has enough funds, moves STX to the target principal, records a
`withdrawal`, and asks `proposal-engine` to mark the proposal executed. The caller
must be a vault member.

### `emergency-withdraw (vault-id amount recipient)`

Owner-only escape hatch that moves funds without a proposal. Use with care: anyone
joining a vault should understand the owner holds this power.
