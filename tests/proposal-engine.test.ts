import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// Helper: create a vault and add wallet1 as a member
function setupVaultWithMember() {
  simnet.callPublicFn(
    "multisig-vault",
    "create-vault",
    [Cl.stringAscii("Test DAO"), Cl.uint(1)],
    deployer
  );
  simnet.callPublicFn(
    "multisig-vault",
    "add-member",
    [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
    deployer
  );
}

describe("BitVault Proposal Engine", () => {
  // =========================================================================
  // Create Proposal
  // =========================================================================
  describe("create-proposal", () => {
    it("allows a vault member to create a proposal", () => {
      setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Fund Development"),
          Cl.stringAscii("Allocate STX for dev work"),
          Cl.uint(1), // TYPE-TRANSFER
          Cl.uint(144), // voting period
          Cl.some(Cl.principal(wallet2)),
          Cl.uint(1000000),
        ],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(0));
    });

    it("increments the proposal nonce", () => {
      setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
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
          Cl.uint(0),
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

    it("rejects proposal from non-member", () => {
      setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Sneaky Proposal"),
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

    it("rejects proposal with empty title", () => {
      setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
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

    it("rejects voting period below minimum (72 blocks)", () => {
      setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Short Vote"),
          Cl.stringAscii("Too short"),
          Cl.uint(1),
          Cl.uint(10), // below MIN-VOTING-PERIOD
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(307)); // ERR-INVALID-DURATION
    });

    it("rejects voting period above maximum (4320 blocks)", () => {
      setupVaultWithMember();
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Long Vote"),
          Cl.stringAscii("Too long"),
          Cl.uint(1),
          Cl.uint(5000), // above MAX-VOTING-PERIOD
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(307)); // ERR-INVALID-DURATION
    });

    it("rejects proposal for non-existent vault", () => {
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(999),
          Cl.stringAscii("Ghost Vault"),
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
  // Read-Only Functions
  // =========================================================================
  describe("read-only functions", () => {
    it("returns proposal details after creation", () => {
      setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Read Test"),
          Cl.stringAscii("Verify data"),
          Cl.uint(5), // TYPE-CUSTOM
          Cl.uint(200),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "proposal-engine",
        "get-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeSome(expect.anything());
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

    it("shows proposal as active after creation", () => {
      setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Active Check"),
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
        "is-proposal-active",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeBool(true);
    });

    it("returns correct proposal status (active = 1)", () => {
      setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Status Check"),
          Cl.stringAscii("Check status"),
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

    it("has-voted returns false before voting", () => {
      setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Vote Check"),
          Cl.stringAscii("Check voting"),
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
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeBool(false);
    });
  });

  // =========================================================================
  // Finalize & Mark Executed
  // =========================================================================
  describe("finalize-proposal", () => {
    it("keeps proposal active when votes insufficient", () => {
      setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("No Votes Yet"),
          Cl.stringAscii("Should stay active"),
          Cl.uint(1),
          Cl.uint(144),
          Cl.none(),
          Cl.uint(0),
        ],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "finalize-proposal",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(1)); // STATUS-ACTIVE
    });

    it("rejects finalizing non-existent proposal", () => {
      const { result } = simnet.callPublicFn(
        "proposal-engine",
        "finalize-proposal",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(302)); // ERR-PROPOSAL-NOT-FOUND
    });
  });

  describe("mark-executed", () => {
    it("rejects marking an active proposal as executed", () => {
      setupVaultWithMember();
      simnet.callPublicFn(
        "proposal-engine",
        "create-proposal",
        [
          Cl.uint(0),
          Cl.stringAscii("Cannot Execute"),
          Cl.stringAscii("Not passed yet"),
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
      expect(result).toBeErr(Cl.uint(304)); // ERR-PROPOSAL-NOT-ACTIVE (status not PASSED)
    });
  });
});
