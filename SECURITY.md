# Security Policy

## Supported versions

BitVault is under active development. Security fixes are applied to the `main`
branch and the current testnet deployment.

## Reporting a vulnerability

If you discover a security issue in the contracts or the dashboard, please report
it privately rather than opening a public issue.

- Email: afolabiayomide870@gmail.com
- Include a description, the affected contract or component, and steps to
  reproduce where possible.

Please allow a reasonable amount of time for a fix before any public disclosure.

## Scope

The following are in scope:

- The Clarity contracts in `contracts/`.
- Fund-handling logic in `treasury` and authorization logic in `multisig-vault`.
- The dashboard's transaction construction in `frontend/`.

## Known limitations

- The contracts are deployed to testnet and have not yet been independently
  audited. Do not use them with real funds on mainnet without an audit.
- `emergency-withdraw` lets a vault owner move funds without a proposal. This is
  intentional but should be understood by anyone joining a vault.
