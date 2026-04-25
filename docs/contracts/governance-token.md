# governance-token

A SIP-010 compliant fungible token, BVT (BitVault Token), used for token-weighted
voting and incentives.

## Token details

| Property | Value |
| --- | --- |
| Name | BitVault Token |
| Symbol | BVT |
| Decimals | 6 |
| Max supply | 1,000,000,000000 (1,000,000 BVT) |

## Read-only functions

The standard SIP-010 getters are implemented: `get-name`, `get-symbol`,
`get-decimals`, `get-balance`, `get-total-supply`, and `get-token-uri`. In
addition, `get-total-minted` reports how much has been minted so far.

## Public functions

### `transfer (amount sender recipient memo)`

Standard SIP-010 transfer. Only the sender may move their own tokens, and the
amount must be greater than zero. An optional memo is printed for indexers.

### `mint (amount recipient)`

Owner-only. Mints new tokens to a recipient up to the maximum supply. Emits a
`mint` event.

### `burn (amount)`

Burns tokens from the caller's own balance, reducing the total supply. Emits a
`burn` event.

### `set-token-uri (new-uri)`

Owner-only. Updates the token metadata URI.
