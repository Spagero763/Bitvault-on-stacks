import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// ---------------------------------------------------------------------------
// Helper: create a vault with deployer as owner (wallet1 as member)
// ---------------------------------------------------------------------------
function setupVault(): number {
  simnet.callPublicFn(
    "multisig-vault",
    "create-vault",
    [Cl.stringAscii("Treasury Vault"), Cl.uint(1)],
    deployer
  );
  const vaultId = 0;
  simnet.callPublicFn(
    "multisig-vault",
    "add-member",
    [Cl.uint(vaultId), Cl.principal(wallet1), Cl.stringAscii("member")],
    deployer
  );
  return vaultId;
}

describe("BitVault Treasury", () => {
  // =========================================================================
  // Deposit STX
  // =========================================================================
  describe("deposit-stx", () => {
    it("deposits STX into a vault", () => {
      const vaultId = setupVault();
      const { result } = simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(1000000)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("tracks the vault balance after deposit", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(500000)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(vaultId)],
        deployer
      );
      expect(result).toBeUint(500000);
    });

    it("accumulates balance from multiple deposits", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(300000)],
        deployer
      );
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(200000)],
        wallet1
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(vaultId)],
        deployer
      );
      expect(result).toBeUint(500000);
    });

    it("records a deposit transaction", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(100000)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-transaction",
        [Cl.uint(vaultId), Cl.uint(0)],
        deployer
      );
      expect(result).not.toBeNone();
    });

    it("increments the transaction count", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(100000)],
        deployer
      );
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(200000)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-tx-count",
        [Cl.uint(vaultId)],
        deployer
      );
      expect(result).toBeUint(2);
    });

    it("rejects deposit of zero amount", () => {
      const vaultId = setupVault();
      const { result } = simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(507)); // ERR-INVALID-AMOUNT
    });

    it("rejects deposit to non-existent vault", () => {
      const { result } = simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(999), Cl.uint(100000)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(501)); // ERR-VAULT-NOT-FOUND
    });
  });

  // =========================================================================
  // Emergency Withdraw
  // =========================================================================
  describe("emergency-withdraw", () => {
    it("allows vault owner to emergency withdraw", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(1000000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(vaultId), Cl.uint(500000), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates balance after emergency withdraw", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(1000000)],
        deployer
      );
      simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(vaultId), Cl.uint(400000), Cl.principal(deployer)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(vaultId)],
        deployer
      );
      expect(result).toBeUint(600000);
    });

    it("rejects emergency withdraw by non-owner", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(1000000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(vaultId), Cl.uint(500000), Cl.principal(wallet1)],
        wallet1 // member but not owner
      );
      expect(result).toBeErr(Cl.uint(500)); // ERR-NOT-AUTHORIZED
    });

    it("rejects withdrawal exceeding balance", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(100000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(vaultId), Cl.uint(500000), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(503)); // ERR-INSUFFICIENT-FUNDS
    });

    it("rejects emergency withdrawal of zero amount", () => {
      const vaultId = setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(vaultId), Cl.uint(1000000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(vaultId), Cl.uint(0), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(507)); // ERR-INVALID-AMOUNT
    });
  });

  // =========================================================================
  // Execute Transfer (requires passed + executable proposal)
  // =========================================================================
  describe("execute-transfer", () => {
    it("rejects execute-transfer for non-existent proposal", () => {
      setupVault();
      const { result } = simnet.callPublicFn(
        "treasury",
        "execute-transfer",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(502)); // ERR-PROPOSAL-NOT-FOUND
    });

    it("rejects execute-transfer for a non-executable proposal", () => {
      const vaultId = setupVault();
      // Create a proposal (still ACTIVE, not PASSED)
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Transfer test"),
          Cl.stringAscii("Attempt transfer"),
          Cl.uint(1), // TYPE-TRANSFER
          Cl.uint(144),
          Cl.some(Cl.principal(wallet2)),
          Cl.uint(50000),
        ],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "execute-transfer",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(505)); // ERR-PROPOSAL-NOT-EXECUTABLE
    });
  });

  // =========================================================================
  // Read-Only Helpers
  // =========================================================================
  describe("read-only helpers", () => {
    it("returns zero balance for new vault", () => {
      const vaultId = setupVault();
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(vaultId)],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("returns zero tx-count for new vault", () => {
      const vaultId = setupVault();
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-tx-count",
        [Cl.uint(vaultId)],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("returns none for non-existent transaction", () => {
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-transaction",
        [Cl.uint(0), Cl.uint(999)],
        deployer
      );
      expect(result).toBeNone();
    });

    it("returns default vault-balance tuple for non-existent vault", () => {
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-vault-balance",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeTuple({ "stx-balance": Cl.uint(0) });
    });
  });
});
