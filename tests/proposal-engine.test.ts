import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// ---------------------------------------------------------------------------
// Helper: set up a vault with deployer as owner and wallet1 as member
// ---------------------------------------------------------------------------
function setupVaultWithMember(): number {
  const { result } = simnet.callPublicFn(
    "multisig-vault",
    "create-vault",
    [Cl.stringAscii("Test Vault"), Cl.uint(1)],
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

describe("BitVault Proposal Engine", () => {
  // =========================================================================
  // Create Proposal
  // =========================================================================
  describe("create-proposal", () => {
    it("allows a vault member to create a proposal", () => {
      const vaultId = setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Fund development"),
          Cl.stringAscii("Allocate tokens to dev team"),
          Cl.uint(1), // TYPE-TRANSFER
          Cl.uint(144), // 144 blocks voting period
          Cl.some(Cl.principal(wallet2)),
          Cl.uint(1000),
        ],
        deployer
      );
      expect(result).toBeOk(Cl.uint(0));
    });

    it("increments the proposal nonce", () => {
      const vaultId = setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Proposal A"),
          Cl.stringAscii("First"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Proposal B"),
          Cl.stringAscii("Second"),
          Cl.uint(5),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "get-proposal-nonce",
        [],
        deployer
      );
      expect(result).toBeUint(2);
    });

    it("rejects proposals from non-members", () => {
      const vaultId = setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Sneaky proposal"),
          Cl.stringAscii("Should fail"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        wallet2 // not a member
      );
      expect(result).toBeErr(Cl.uint(300)); // ERR-NOT-AUTHORIZED
    });

    it("rejects proposals with empty title", () => {
      const vaultId = setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii(""),
          Cl.stringAscii("No title"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(306)); // ERR-INVALID-TITLE
    });

    it("rejects voting period below MIN-VOTING-PERIOD (72)", () => {
      const vaultId = setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Short vote"),
          Cl.stringAscii("Too short"),
          Cl.uint(1),
          Cl.uint(10), // below 72
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(307)); // ERR-INVALID-DURATION
    });

    it("rejects voting period above MAX-VOTING-PERIOD (4320)", () => {
      const vaultId = setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Long vote"),
          Cl.stringAscii("Too long"),
          Cl.uint(1),
          Cl.uint(5000), // above 4320
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(307)); // ERR-INVALID-DURATION
    });

    it("rejects proposals for non-existent vaults", () => {
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(999),
          Cl.stringAscii("Ghost vault"),
          Cl.stringAscii("No vault"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(301)); // ERR-VAULT-NOT-FOUND
    });
  });

  // =========================================================================
  // Read-Only
  // =========================================================================
  describe("read-only functions", () => {
    it("returns proposal data via get-proposal", () => {
      const vaultId = setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Read test"),
          Cl.stringAscii("Check data"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.some(Cl.principal(wallet2)),
          Cl.uint(500),
        ],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      // Should be some tuple with correct fields
      expect(result).not.toBeNone();
    });

    it("returns none for non-existent proposal", () => {
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "get-proposal",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeNone();
    });

    it("returns ACTIVE status for new proposal", () => {
      const vaultId = setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Status check"),
          Cl.stringAscii("Should be active"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "get-proposal-status",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(1)); // STATUS-ACTIVE
    });

    it("is-proposal-active returns true for new proposal", () => {
      const vaultId = setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Active check"),
          Cl.stringAscii("Is active"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "is-proposal-active",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeBool(true);
    });

    it("has-voted returns false when no one has voted", () => {
      const vaultId = setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Vote check"),
          Cl.stringAscii("Unvoted"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "has-voted",
        [Cl.uint(0), Cl.principal(deployer)],
        deployer
      );
      expect(result).toBeBool(false);
    });

    it("returns error for status of non-existent proposal", () => {
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "get-proposal-status",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(302)); // ERR-PROPOSAL-NOT-FOUND
    });
  });

  // =========================================================================
  // Finalize Proposal
  // =========================================================================
  describe("finalize-proposal", () => {
    it("stays ACTIVE when yes-votes < threshold", () => {
      const vaultId = setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Under threshold"),
          Cl.stringAscii("Not enough votes"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      // Finalize without any votes
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "finalize-proposal",
        [Cl.uint(0)],
        deployer
      );
      // Should return ACTIVE since no votes cast and not expired
      expect(result).toBeOk(Cl.uint(1)); // STATUS-ACTIVE
    });

    it("rejects finalize for non-existent proposal", () => {
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "finalize-proposal",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(302)); // ERR-PROPOSAL-NOT-FOUND
    });
  });

  // =========================================================================
  // Mark Executed
  // =========================================================================
  describe("mark-executed", () => {
    it("rejects mark-executed for non-existent proposal", () => {
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "mark-executed",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(302)); // ERR-PROPOSAL-NOT-FOUND
    });

    it("rejects mark-executed for an ACTIVE proposal (not PASSED)", () => {
      const vaultId = setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(vaultId),
          Cl.stringAscii("Not passed yet"),
          Cl.stringAscii("Still active"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "mark-executed",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(304)); // ERR-PROPOSAL-NOT-ACTIVE (STATUS must be PASSED)
    });
  });
});
