# Usage Walkthrough

A typical flow for a group managing shared funds with BitVault.

## 1. Create a vault

The founder calls `create-vault` with a name and an initial threshold of 1. They
become the owner.

```clarity
(contract-call? .multisig-vault create-vault "Team Treasury" u1)
```

## 2. Add members

The owner adds the other members and assigns roles.

```clarity
(contract-call? .multisig-vault add-member u0 'ST1... "signer")
```

## 3. Raise the threshold

Once members are in, the owner raises the threshold so that multiple approvals are
required.

```clarity
(contract-call? .multisig-vault set-threshold u0 u2)
```

## 4. Fund the vault

Anyone can deposit STX into the vault treasury.

```clarity
(contract-call? .treasury deposit-stx u0 u1000000)
```

## 5. Propose a transfer

A member proposes sending funds to a recipient.

```clarity
(contract-call? .proposal-engine create-proposal
  u0 "Pay contractor" "Milestone 1 payment" u1 u144 (some 'ST2...) u500000)
```

## 6. Vote

Members vote during the voting window.

```clarity
(contract-call? .voting cast-vote u0 true)
```

## 7. Finalize and execute

After enough yes votes, finalize the proposal and, once the time-lock clears,
execute the transfer.

```clarity
(contract-call? .voting finalize-votes u0)
(contract-call? .treasury execute-transfer u0)
```
