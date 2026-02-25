import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

// Helper: set up a vault with members and create a proposal
function setupVaultAndProposal() {
  // Create vault
  simnet.callPublicFn(
    "multisig-vault",
    "create-vault",
    [Cl.stringAscii("Voting DAO"), Cl.uint(1)],
    deployer
  );

  // Add members
  simnet.callPublicFn(
    "multisig-vault",
    "add-member",
    [Cl.uint(0), Cl.principal(wallet1), Cl.stringAscii("member")],
    deployer
  );
  simnet.callPublicFn(
    "multisig-vault",
    "add-member",
    [Cl.uint(0), Cl.principal(wallet2), Cl.stringAscii("member")],
    deployer
  );

  // Create a proposal
  simnet.callPublicFn(
    "proposal-engine",
    "create-proposal",
    [
      Cl.uint(0),
      Cl.stringAscii("Test Proposal"),
      Cl.stringAscii("A proposal for voting tests"),
      Cl.uint(5), // TYPE-CUSTOM
      Cl.uint(144),
      Cl.none(),
      Cl.uint(0),
    ],
    deployer
  );
}

describe("BitVault Voting Contract", () => {
  // =========================================================================
  // Cast Vote
  // =========================================================================
  describe("cast-vote", () => {
    it("allows a vault member to vote YES", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("allows a vault member to vote NO", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(false)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates vote stats after a YES vote", () => {
      setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        wallet1
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(1),
        "total-no": Cl.uint(0),
        "total-voters": Cl.uint(1),
        finalized: Cl.bool(false),
      });
    });

    it("updates vote stats after a NO vote", () => {
      setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(false)],
        wallet1
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(0),
        "total-no": Cl.uint(1),
        "total-voters": Cl.uint(1),
        finalized: Cl.bool(false),
      });
    });

    it("tallies multiple voters correctly", () => {
      setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        deployer
      );
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        wallet1
      );
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(false)],
        wallet2
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(2),
        "total-no": Cl.uint(1),
        "total-voters": Cl.uint(3),
        finalized: Cl.bool(false),
      });
    });

    it("rejects double voting", () => {
      setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        wallet1
      );
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(false)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(403)); // ERR-ALREADY-VOTED
    });

    it("rejects vote from non-member", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        wallet3
      );
      expect(result).toBeErr(Cl.uint(405)); // ERR-NOT-MEMBER
    });

    it("rejects vote on non-existent proposal", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(999), Cl.bool(true)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(402)); // ERR-PROPOSAL-NOT-FOUND
    });
  });

  // =========================================================================
  // Vote Weights
  // =========================================================================
  describe("set-vote-weight", () => {
    it("allows vault owner to set vote weight", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(0), Cl.principal(wallet1), Cl.uint(5)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("reflects custom weight in vote stats", () => {
      setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(0), Cl.principal(wallet1), Cl.uint(3)],
        deployer
      );
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        wallet1
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(3),
        "total-no": Cl.uint(0),
        "total-voters": Cl.uint(1),
        finalized: Cl.bool(false),
      });
    });

    it("rejects setting weight by non-owner", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(0), Cl.principal(wallet2), Cl.uint(5)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(400)); // ERR-NOT-AUTHORIZED
    });

    it("rejects setting weight for non-member", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(0), Cl.principal(wallet3), Cl.uint(5)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(405)); // ERR-NOT-MEMBER
    });
  });

  // =========================================================================
  // Read-Only
  // =========================================================================
  describe("read-only functions", () => {
    it("returns default vote stats for a new proposal", () => {
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(999)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(0),
        "total-no": Cl.uint(0),
        "total-voters": Cl.uint(0),
        finalized: Cl.bool(false),
      });
    });

    it("returns default weight of 1 for unset voters", () => {
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-weight",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeTuple({ weight: Cl.uint(1) });
    });

    it("has-voter-voted tracks correctly", () => {
      setupVaultAndProposal();
      const { result: before } = simnet.callReadOnlyFn(
        "voting",
        "has-voter-voted",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(before).toBeBool(false);
    });
  });

  // =========================================================================
  // Finalize Votes
  // =========================================================================
  describe("finalize-votes", () => {
    it("marks votes as finalized and calls proposal finalize", () => {
      setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "voting",
        "finalize-votes",
        [Cl.uint(0)],
        deployer
      );
      // Should return ok with a status (PASSED=2 since yes-votes >= threshold of 1)
      expect(result).toBeOk(Cl.uint(2)); // STATUS-PASSED
    });

    it("rejects finalizing already finalized votes", () => {
      setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(0), Cl.bool(true)],
        deployer
      );
      simnet.callPublicFn(
        "voting",
        "finalize-votes",
        [Cl.uint(0)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "voting",
        "finalize-votes",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(404)); // ERR-VOTING-CLOSED
    });
  });
});
