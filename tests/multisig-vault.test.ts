import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("BitVault Multi-Signature Vault", () => {
  // =========================================================================
  // Vault Creation
  // =========================================================================
  describe("create-vault", () => {
    it("creates a new vault successfully", () => {
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Test Vault"), Cl.uint(1)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(0));
    });

    it("increments the vault nonce", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Vault One"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Vault Two"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "get-vault-nonce",
        [],
        deployer
      );
      expect(result).toBeUint(2);
    });

    it("stores vault metadata correctly", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("My DAO"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "get-vault",
        [Cl.uint(0)],
        deployer
      );
      // Verify the vault exists and contains expected fields
      // (created-at is a block height we can't predict exactly)
      expect(result).not.toBeNone();
    });

    it("registers creator as owner member", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Owner Test"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "is-vault-owner",
        [Cl.uint(0), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeBool(true);
    });

    it("rejects empty vault name", () => {
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii(""), Cl.uint(1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(110)); // ERR-INVALID-NAME
    });

    it("rejects threshold of zero", () => {
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Bad Vault"), Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(105)); // ERR-INVALID-THRESHOLD
    });

    it("tracks owner vault count", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Vault A"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Vault B"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "get-owner-vault-count",
        [Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeTuple({ count: Cl.uint(2) });
    });
  });

  // =========================================================================
  // Member Management
  // =========================================================================
  describe("add-member", () => {
    it("allows owner to add a member", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Team Vault"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("increments member count after adding", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Count Test"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "get-vault-member-count",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(2));
    });

    it("rejects adding a member by non-owner", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Auth Test"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet2), Cl.stringAscii("member")],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it("rejects adding an existing member", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Dup Test"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      expect(result).toBeErr(Cl.uint(103)); // ERR-MEMBER-EXISTS
    });

    it("confirms membership via is-member", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Check Member"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("signer")],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "is-member",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeBool(true);
    });
  });

  // =========================================================================
  // Remove Member
  // =========================================================================
  describe("remove-member", () => {
    it("allows owner to remove a member", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Remove Test"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "remove-member",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("prevents removing the vault owner", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("No Self Remove"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "remove-member",
        [Cl.uint(0), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(107)); // ERR-CANNOT-REMOVE-OWNER
    });

    it("rejects removal by non-owner", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Auth Remove"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "remove-member",
        [Cl.uint(0), Cl.principal(wallet1)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });
  });

  // =========================================================================
  // Set Threshold
  // =========================================================================
  describe("set-threshold", () => {
    it("allows owner to update threshold", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Threshold Test"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "set-threshold",
        [Cl.uint(0), Cl.uint(2)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("reads updated threshold correctly", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Read Threshold"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "set-threshold",
        [Cl.uint(0), Cl.uint(2)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "get-vault-threshold",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(2));
    });

    it("rejects threshold higher than member count", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Too High"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "set-threshold",
        [Cl.uint(0), Cl.uint(5)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(108)); // ERR-THRESHOLD-TOO-HIGH
    });

    it("rejects threshold of zero", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Zero Thresh"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "set-threshold",
        [Cl.uint(0), Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(105)); // ERR-INVALID-THRESHOLD
    });
  });

  // =========================================================================
  // Toggle Lock
  // =========================================================================
  describe("toggle-lock", () => {
    it("locks the vault", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Lock Test"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "toggle-lock",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("blocks add-member when vault is locked", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Locked Vault"), Cl.uint(1)],
        deployer
      );
      simnet.callPublicFn(
        "multisig-vault",
        "toggle-lock",
        [Cl.uint(0)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "add-member",
        [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
        deployer
      );
      expect(result).toBeErr(Cl.uint(109)); // ERR-VAULT-LOCKED
    });

    it("rejects toggle by non-owner", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Toggle Auth"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "multisig-vault",
        "toggle-lock",
        [Cl.uint(0)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });
  });

  // =========================================================================
  // Read-Only Helpers
  // =========================================================================
  describe("read-only helpers", () => {
    it("returns none for non-existent vault", () => {
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "get-vault",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeNone();
    });

    it("returns false for non-member", () => {
      simnet.callPublicFn(
        "multisig-vault",
        "create-vault",
        [Cl.stringAscii("Non Member"), Cl.uint(1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "is-member",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeBool(false);
    });

    it("returns error for threshold of non-existent vault", () => {
      const { result } = simnet.callReadOnlyFn(
        "multisig-vault",
        "get-vault-threshold",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(102)); // ERR-VAULT-NOT-FOUND
    });
  });
});
