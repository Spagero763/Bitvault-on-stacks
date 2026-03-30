# Deployment

This guide covers deploying the BitVault contracts with Clarinet and pointing the
dashboard at a deployment.

## Networks

Network settings live in `settings/`. `Devnet.toml` is committed for local work.
`Testnet.toml` and `Mainnet.toml` are ignored because they hold mnemonics; create
them locally from the Devnet template.

## Contract order

Because of the dependency graph, contracts must be deployed in this order:

1. `multisig-vault`
2. `governance-token`
3. `proposal-engine`
4. `voting`
5. `treasury`

Clarinet's generated deployment plan already respects this order.

## Deploying to testnet

```bash
clarinet deployments generate --testnet --low-cost
clarinet deployments apply --testnet
```

## Pointing the dashboard at a deployment

Update the contract address in the front end (see `frontend/.env.example`) so the
dashboard reads from your deployment:

```
VITE_CONTRACT_ADDRESS=ST26TQH4FRPTKHQEYE6HZQG98R4CZE6PTJ8J1YYR8
VITE_STACKS_NETWORK=testnet
```

## Verifying a deployment

After applying, confirm the contracts are live with the read-only `get-vault-nonce`
and `get-proposal-nonce` functions, or open the dashboard and connect a wallet.
