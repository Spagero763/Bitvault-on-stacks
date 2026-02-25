import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// ---------------------------------------------------------------------------
// Helper: create a vault, add wallet1 as member, create a proposal
// Returns { vaultId, proposalId }
// ---------------------------------------------------------------------------
function setupVaultAndProposal(): { vaultId: number; proposalId: number } {
  simnet.callPublicFn(
    "multisig-vault",
    "create-vault",
    [Cl.stringAscii("Vote Vault"), Cl.uint(1)],
    deployer
  );
  const vaultId = 0;
  simnet.callPublicFn(
    "multisig-vault",
    "add-member",
    [Cl.uint(vaultId), Cl.principal(wallet1), Cl.stringAscii("member")],
    deployer
  );
  simnet.callPublicFn(
    "proposal-engine",
    "create-proposal",
    [
      Cl.uint(vaultId),
      Cl.stringAscii("Test Proposal"),
      Cl.stringAscii("A proposal for testing votes"),
      Cl.uint(1),
      Cl.uint(144),
      Cl.none(),
      Cl.uint(0),
    ],
    deployer
  );
  return { vaultId, proposalId: 0 };
}

describe("BitVault Voting", () => {
  // =========================================================================
  // Cast Vote
  // =========================================================================
  describe("cast-vote", () => {
    it("allows a member to cast a yes-vote", () => {
      const { proposalId } = setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(true)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("allows a member to cast a no-vote", () => {
      const { proposalId } = setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(false)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates vote-stats tallies for yes-vote", () => {
      const { proposalId } = setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(true)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(proposalId)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(1),
        "total-no": Cl.uint(0),
        "total-voters": Cl.uint(1),
        finalized: Cl.bool(false),
      });
    });

    it("updates vote-stats tallies for no-vote", () => {
      const { proposalId } = setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(false)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(proposalId)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(0),
        "total-no": Cl.uint(1),
        "total-voters": Cl.uint(1),
        finalized: Cl.bool(false),
      });
    });

    it("accumulates votes from multiple members", () => {
      const { proposalId } = setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(true)],
        deployer
      );
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(true)],
        wallet1
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(proposalId)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(2),
        "total-no": Cl.uint(0),
        "total-voters": Cl.uint(2),
        finalized: Cl.bool(false),
      });
    });

    it("rejects votes from non-members", () => {
      const { proposalId } = setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(true)],
        wallet2 // not a member
      );
      expect(result).toBeErr(Cl.uint(405)); // ERR-NOT-MEMBER
    });

    it("rejects vote on non-existent proposal", () => {
      setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(999), Cl.bool(true)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(402)); // ERR-PROPOSAL-NOT-FOUND
    });
  });

  // =========================================================================
  // Set Vote Weight
  // =========================================================================
  describe("set-vote-weight", () => {
    it("allows owner to set a member vote weight", () => {
      const { vaultId } = setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(vaultId), Cl.principal(wallet1), Cl.uint(5)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("reflects updated weight via get-vote-weight", () => {
      const { vaultId } = setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(vaultId), Cl.principal(wallet1), Cl.uint(3)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-weight",
        [Cl.uint(vaultId), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeTuple({ weight: Cl.uint(3) });
    });

    it("rejects set-vote-weight by non-owner", () => {
      const { vaultId } = setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(vaultId), Cl.principal(wallet1), Cl.uint(5)],
        wallet1 // not the owner
      );
      expect(result).toBeErr(Cl.uint(400)); // ERR-NOT-AUTHORIZED
    });

    it("rejects set-vote-weight for non-member voter", () => {
      const { vaultId } = setupVaultAndProposal();
      const { result } = simnet.callPublicFn(
        "voting",
        "set-vote-weight",
        [Cl.uint(vaultId), Cl.principal(wallet2), Cl.uint(5)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(405)); // ERR-NOT-MEMBER
    });
  });

  // =========================================================================
  // Finalize Votes
  // =========================================================================
  describe("finalize-votes", () => {
    it("marks vote stats as finalized", () => {
      const { proposalId } = setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(true)],
        deployer
      );
      simnet.callPublicFn(
        "voting",
        "finalize-votes",
        [Cl.uint(proposalId)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-stats",
        [Cl.uint(proposalId)],
        deployer
      );
      expect(result).toBeTuple({
        "total-yes": Cl.uint(1),
        "total-no": Cl.uint(0),
        "total-voters": Cl.uint(1),
        finalized: Cl.bool(true),
      });
    });

    it("rejects double finalization", () => {
      const { proposalId } = setupVaultAndProposal();
      simnet.callPublicFn(
        "voting",
        "cast-vote",
        [Cl.uint(proposalId), Cl.bool(true)],
        deployer
      );
      simnet.callPublicFn(
        "voting",
        "finalize-votes",
        [Cl.uint(proposalId)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "voting",
        "finalize-votes",
        [Cl.uint(proposalId)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(404)); // ERR-VOTING-CLOSED
    });
  });

  // =========================================================================
  // Read-Only Helpers
  // =========================================================================
  describe("read-only helpers", () => {
    it("returns default vote-stats for unvoted proposal", () => {
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

    it("returns default weight of 1 for member without custom weight", () => {
      const { result } = simnet.callReadOnlyFn(
        "voting",
        "get-vote-weight",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeTuple({ weight: Cl.uint(1) });
    });
  });
});
