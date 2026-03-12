# Error Codes

Each contract uses a dedicated numeric range so that an error code uniquely
identifies the contract it came from.

## multisig-vault (100–199)

| Code | Name | Meaning |
| --- | --- | --- |
| u100 | ERR-NOT-AUTHORIZED | Caller is not allowed to perform the action. |
| u101 | ERR-VAULT-EXISTS | A vault with the given id already exists. |
| u102 | ERR-VAULT-NOT-FOUND | No vault with the given id. |
| u103 | ERR-MEMBER-EXISTS | The principal is already a member. |
| u104 | ERR-MEMBER-NOT-FOUND | The principal is not a member. |
| u105 | ERR-INVALID-THRESHOLD | Threshold is below the minimum. |
| u106 | ERR-MAX-MEMBERS-REACHED | Vault already has the maximum members. |
| u107 | ERR-CANNOT-REMOVE-OWNER | The owner cannot be removed. |
| u108 | ERR-THRESHOLD-TOO-HIGH | Threshold exceeds the member count. |
| u109 | ERR-VAULT-LOCKED | The vault is locked. |
| u110 | ERR-INVALID-NAME | The vault name is empty. |

## governance-token (200–299)

| Code | Name | Meaning |
| --- | --- | --- |
| u200 | ERR-NOT-AUTHORIZED | Caller is not the token owner or sender. |
| u201 | ERR-INSUFFICIENT-BALANCE | Not enough balance for the operation. |
| u202 | ERR-INVALID-AMOUNT | Amount must be greater than zero. |
| u203 | ERR-MINT-FAILED | Mint would exceed the maximum supply. |

## proposal-engine (300–399)

| Code | Name | Meaning |
| --- | --- | --- |
| u300 | ERR-NOT-AUTHORIZED | Caller is not a vault member. |
| u301 | ERR-VAULT-NOT-FOUND | Referenced vault does not exist. |
| u302 | ERR-PROPOSAL-NOT-FOUND | No proposal with the given id. |
| u303 | ERR-PROPOSAL-EXPIRED | The proposal has expired. |
| u304 | ERR-PROPOSAL-NOT-ACTIVE | The proposal is not in the active state. |
| u305 | ERR-PROPOSAL-ALREADY-EXECUTED | The proposal was already executed. |
| u306 | ERR-INVALID-TITLE | The title is empty. |
| u307 | ERR-INVALID-DURATION | Voting period is out of range. |
| u308 | ERR-QUORUM-NOT-MET | Quorum was not reached. |
| u309 | ERR-THRESHOLD-NOT-MET | Yes votes did not reach the threshold. |
| u310 | ERR-TIMELOCK-ACTIVE | The time-lock has not cleared. |
| u311 | ERR-INVALID-AMOUNT | Amount must be greater than zero. |

## voting (400–499)

| Code | Name | Meaning |
| --- | --- | --- |
| u400 | ERR-NOT-AUTHORIZED | Caller is not allowed to set weights. |
| u401 | ERR-VAULT-NOT-FOUND | Referenced vault does not exist. |
| u402 | ERR-PROPOSAL-NOT-FOUND | No proposal with the given id. |
| u403 | ERR-ALREADY-VOTED | The caller has already voted. |
| u404 | ERR-VOTING-CLOSED | Voting is closed or already finalized. |
| u405 | ERR-NOT-MEMBER | The caller is not a vault member. |
| u406 | ERR-PROPOSAL-NOT-ACTIVE | The proposal is not active. |

## treasury (500–599)

| Code | Name | Meaning |
| --- | --- | --- |
| u500 | ERR-NOT-AUTHORIZED | Caller is not a vault member or owner. |
| u501 | ERR-VAULT-NOT-FOUND | Referenced vault does not exist. |
| u502 | ERR-PROPOSAL-NOT-FOUND | No proposal with the given id. |
| u503 | ERR-INSUFFICIENT-FUNDS | Vault balance is too low. |
| u504 | ERR-TRANSFER-FAILED | The STX transfer failed. |
| u505 | ERR-PROPOSAL-NOT-EXECUTABLE | The proposal is not ready to execute. |
| u506 | ERR-WRONG-PROPOSAL-TYPE | The proposal is not a transfer. |
| u507 | ERR-INVALID-AMOUNT | Amount must be greater than zero. |
| u508 | ERR-DEPOSIT-FAILED | The STX deposit failed. |
