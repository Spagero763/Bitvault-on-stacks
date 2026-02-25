# BitVault – Multi‑Signature Treasury & DAO Toolkit

## 🎯 Project Overview
BitVault is a **full‑stack DAO toolkit** built on the Stacks blockchain. It provides:
- **Multi‑signature vaults** for secure fund management.
- **Proposal engine** for creating, voting on, and executing governance proposals.
- **Voting contract** with customizable vote weights.
- **Treasury contract** for STX deposits, withdrawals, and transaction history.
- **Governance token (BVT)** – a SIP‑010 compliant token used for token‑weighted voting.

All contracts are written in **Clarity v3** and tested with the **Clarinet SDK** + **Vitest**. The UI (not included here) would be a sleek React dashboard that talks to these contracts via the Stacks.js library.

## 📦 Repository Structure
```
bitvault/
├─ contracts/                # Clarity contracts
│   ├─ multisig-vault.clar
│   ├─ proposal-engine.clar
│   ├─ voting.clar
│   ├─ treasury.clar
│   └─ governance-token.clar
├─ tests/                    # Vitest test suites (full coverage)
│   ├─ multisig-vault.test.ts
│   ├─ proposal-engine.test.ts
│   ├─ voting.test.ts
│   ├─ treasury.test.ts
│   └─ governance-token.test.ts
├─ Clarinet.toml            # Clarinet project config
├─ vitest.config.js         # Vitest + Clarinet integration
├─ package.json             # npm dependencies & scripts
└─ README.md                # <‑ you are reading this!
```

## ⚙️ Setup & Development
1. **Clone the repo** (or continue in the existing workspace).
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the test suite** (all contracts on the Clarinet Simnet)
   ```bash
   npm run test        # basic run
   npm run test:report # with coverage & cost report
   ```
   The tests live in `tests/` and cover every public function, error path, and edge case.

## 🚀 Deploy to Testnet
The project is already configured for the Stacks **Testnet** via `settings/Testnet.toml`. To deploy:
```bash
clarinet deploy --network testnet
```
This will publish all contracts and output their contract IDs. Update any front‑end config with those IDs.

## 📚 How to Contribute (PR Workflow)
1. **Create a feature branch** from `main`.
2. **Add/modify code** (contracts, tests, UI, docs).
3. **Run the full test suite** – ensure `npm run test` passes.
4. **Commit** with a clear title and description.
5. **Push** the branch and open a Pull Request targeting `main`.
6. **CI** (GitHub Actions) will automatically run `npm run test:report`.
7. Once the PR passes checks, merge it.

### Example Branch Naming
```
feat/<contract>-<feature>
fix/<contract>-<bug>
chore/<description>
```

## 🛠️ Adding New Tests
All test files follow the same pattern:
```ts
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
// …
```
- Use `simnet.callPublicFn` for public calls.
- Use `simnet.callReadOnlyFn` for read‑only calls.
- Assert with `toBeOk`, `toBeErr`, `toBeUint`, `toBeBool`, `toBeSome`, etc.

## 📄 License
MIT – feel free to fork, modify, and use in your own DAO projects.

---
*Happy hacking! 🚀*
