# staking

Lets BVT holders stake their governance tokens. Staked balances are the basis for
voting weight and future reward distribution. Staked tokens are held by the
staking contract until withdrawn.

## Error codes (600–699)

| Code | Name | Meaning |
| --- | --- | --- |
| u600 | ERR-NOT-AUTHORIZED | Caller is not allowed to perform the action. |
| u601 | ERR-INVALID-AMOUNT | Amount must be greater than zero. |
| u602 | ERR-INSUFFICIENT-STAKE | Caller has not staked enough to unstake. |
| u603 | ERR-TRANSFER-FAILED | The token transfer failed. |

## Read-only functions

| Function | Returns |
| --- | --- |
| `get-stake (staker)` | The stake record (amount and last update block). |
| `get-staked-amount (staker)` | The staked amount as a uint. |
| `get-total-staked` | Total BVT staked across all stakers. |
| `get-staker-count` | Number of accounts with a non-zero stake. |
| `is-staking (staker)` | Whether the account has any stake. |

## Public functions

### `stake (amount)`

Transfers `amount` BVT from the caller into the staking contract and records the
stake. New stakers increase the staker count. Emits a `staked` event.

### `unstake (amount)`

Returns `amount` BVT from the staking contract to the caller, provided they have
enough staked. Fully unstaking decreases the staker count. Emits an `unstaked`
event.
