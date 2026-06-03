# membership-nft

A SIP-009 non-fungible token used to issue membership badges. Each badge records
the vault it belongs to and a tier label (for example `gold` or `signer`).

## Error codes (700–799)

| Code | Name | Meaning |
| --- | --- | --- |
| u700 | ERR-NOT-AUTHORIZED | Caller is not the contract owner or token sender. |
| u701 | ERR-NOT-TOKEN-OWNER | Caller does not own the badge. |
| u702 | ERR-TOKEN-NOT-FOUND | No badge with the given id. |
| u703 | ERR-INVALID-RECIPIENT | The recipient is invalid. |

## SIP-009 read-only functions

| Function | Returns |
| --- | --- |
| `get-last-token-id` | The id of the most recently minted badge. |
| `get-token-uri (token-id)` | A metadata URI derived from the base URI and id. |
| `get-owner (token-id)` | The current owner, or none. |
| `get-token-meta (token-id)` | The vault id and tier for a badge. |

## Public functions

### `transfer (token-id sender recipient)`

Standard SIP-009 transfer. Only the token owner may move their badge.

### `mint (recipient vault-id tier)`

Owner-only. Mints a new badge to a recipient, stores its vault id and tier, and
returns the new token id. Emits a `badge-minted` event.

### `burn (token-id)`

Lets the holder burn their own badge. Emits a `badge-burned` event.

### `set-base-uri (new-uri)`

Owner-only. Updates the base metadata URI used by `get-token-uri`.
