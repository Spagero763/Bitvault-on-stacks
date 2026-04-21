# multisig-vault

Manages vault creation, membership, roles, and the signing threshold. This is the
base contract the rest of BitVault depends on.

## Constants

- `MAX-MEMBERS` (u20) — the maximum number of members per vault.

## Read-only functions

| Function | Returns |
| --- | --- |
| `get-vault (vault-id)` | The vault record, or none. |
| `get-vault-member (vault-id member)` | The membership record, or none. |
| `is-member (vault-id who)` | `true` if `who` belongs to the vault. |
| `is-vault-owner (vault-id who)` | `true` if `who` has the `owner` role. |
| `get-vault-threshold (vault-id)` | The signing threshold. |
| `get-vault-member-count (vault-id)` | The current member count. |
| `get-vault-nonce` | The next vault id to be assigned. |
| `get-owner-vault-count (owner)` | How many vaults a principal owns. |
| `get-max-members` | The maximum members allowed per vault. |
| `vault-exists (vault-id)` | Whether a vault with the id exists. |
| `is-vault-locked (vault-id)` | The lock state, or an error if missing. |
| `get-member-role (vault-id member)` | The member's role, or none. |

## Events

Public functions emit `print` events for off-chain indexers:
`vault-created`, `member-added`, and `member-removed`.

## Public functions

### `create-vault (name threshold)`

Creates a new vault, assigns the caller the `owner` role, and returns the new
vault id. The name must be non-empty and the threshold must be between 1 and
`MAX-MEMBERS`.

### `add-member (vault-id new-member role)`

Owner-only. Adds a member with the given role while the vault is unlocked and below
the member cap.

### `remove-member (vault-id member)`

Owner-only. Removes a member. The owner cannot be removed, and the member count
must stay above the threshold.

### `set-threshold (vault-id new-threshold)`

Owner-only. Updates the signing threshold. Must be between 1 and the current member
count.

### `toggle-lock (vault-id)`

Owner-only. Locks or unlocks the vault. While locked, membership and threshold
changes are blocked.
