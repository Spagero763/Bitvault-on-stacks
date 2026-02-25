import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// Helper: create vault with a member
function setupVault() {
  simnet.callPublicFn(
    "multisig-vault",
    "create-vault",
    [Cl.stringAscii("Treasury DAO"), Cl.uint(1)],
    deployer
  );
  simnet.callPublicFn(
    "multisig-vault",
    "add-member",
    [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
    deployer
  );
}

describe("BitVault Treasury", () => {
  // =========================================================================
  // Deposit STX
  // =========================================================================
  describe("deposit-stx", () => {
    it("allows depositing STX into a vault", () => {
      setupVault();
      const { result } = simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(1000000)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates vault balance after deposit", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(5000000)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeUint(5000000);
    });

    it("accumulates multiple deposits", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(2000000)],
        deployer
      );
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(3000000)],
        wallet1
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeUint(5000000);
    });

    it("records transaction history for deposits", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(1000000)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-transaction",
        [Cl.uint(0), Cl.uint(0)],
        deployer
      );
      expect(result).toBeSome(expect.anything());
    });

    it("increments tx count after deposit", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(1000000)],
        deployer
      );
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(2000000)],
        wallet1
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-tx-count",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeUint(2);
    });

    it("rejects depositing zero STX", () => {
      setupVault();
      const { result } = simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(507)); // ERR-INVALID-AMOUNT
    });

    it("rejects deposit to non-existent vault", () => {
      const { result } = simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(999), Cl.uint(1000000)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(501)); // ERR-VAULT-NOT-FOUND
    });
  });

  // =========================================================================
  // Read-Only Functions
  // =========================================================================
  describe("read-only functions", () => {
    it("returns zero balance for new vault", () => {
      setupVault();
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("returns default vault balance struct for unknown vault", () => {
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-vault-balance",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeTuple({ "stx-balance": Cl.uint(0) });
    });

    it("returns zero tx count for new vault", () => {
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-tx-count",
        [Cl.uint(0)],
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
  });

  // =========================================================================
  // Emergency Withdraw
  // =========================================================================
  describe("emergency-withdraw", () => {
    it("allows vault owner to emergency withdraw", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(5000000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(0), Cl.uint(2000000), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates balance after emergency withdraw", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(5000000)],
        deployer
      );
      simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(0), Cl.uint(2000000), Cl.principal(deployer)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "treasury",
        "get-stx-balance",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeUint(3000000);
    });

    it("rejects emergency withdraw by non-owner", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(5000000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(0), Cl.uint(1000000), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(500)); // ERR-NOT-AUTHORIZED
    });

    it("rejects withdraw exceeding balance", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(1000000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(0), Cl.uint(9999999), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(503)); // ERR-INSUFFICIENT-FUNDS
    });

    it("rejects zero-amount emergency withdraw", () => {
      setupVault();
      simnet.callPublicFn(
        "treasury",
        "deposit-stx",
        [Cl.uint(0), Cl.uint(5000000)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "treasury",
        "emergency-withdraw",
        [Cl.uint(0), Cl.uint(0), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(507)); // ERR-INVALID-AMOUNT
    });
  });
});
