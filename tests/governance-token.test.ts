import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("BitVault Governance Token (SIP-010)", () => {
  // =========================================================================
  // SIP-010 Metadata
  // =========================================================================
  describe("SIP-010 metadata", () => {
    it("returns the correct token name", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-name",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.stringAscii("BitVault Token"));
    });

    it("returns the correct token symbol", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-symbol",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.stringAscii("BVT"));
    });

    it("returns the correct number of decimals", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-decimals",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(6));
    });

    it("returns the token URI", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-token-uri",
        [],
        deployer
      );
      expect(result).toBeOk(
        Cl.some(Cl.stringUtf8("https://bitvault.app/token-metadata.json"))
      );
    });
  });

  // =========================================================================
  // Minting
  // =========================================================================
  describe("mint", () => {
    it("allows the contract owner to mint tokens", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(1000000), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("reflects minted balance correctly", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(5000000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(5000000));
    });

    it("updates total supply after minting", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(2000000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(2000000));
    });

    it("rejects minting by non-owner", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(1000), Cl.principal(wallet2)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
    });

    it("rejects minting zero tokens", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(0), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(202)); // ERR-INVALID-AMOUNT
    });

    it("rejects minting beyond max supply", () => {
      // Max supply is 1_000_000_000_000
      const { result } = simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(1000000000001), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(203)); // ERR-MINT-FAILED
    });

    it("tracks total minted correctly", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(3000000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-total-minted",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(3000000));
    });
  });

  // =========================================================================
  // Transfer
  // =========================================================================
  describe("transfer", () => {
    it("allows token holder to transfer", () => {
      // Mint tokens first
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(10000000), Cl.principal(wallet1)],
        deployer
      );
      // Transfer from wallet1 to wallet2
      const { result } = simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(5000000),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates both sender and recipient balances", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(10000000), Cl.principal(wallet1)],
        deployer
      );
      simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(3000000),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet1
      );

      const { result: bal1 } = simnet.callReadOnlyFn(
        "governance-token",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      const { result: bal2 } = simnet.callReadOnlyFn(
        "governance-token",
        "get-balance",
        [Cl.principal(wallet2)],
        deployer
      );
      expect(bal1).toBeOk(Cl.uint(7000000));
      expect(bal2).toBeOk(Cl.uint(3000000));
    });

    it("rejects transfer if sender is not tx-sender", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(10000000), Cl.principal(wallet1)],
        deployer
      );
      // wallet2 tries to transfer wallet1's tokens
      const { result } = simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(1000000),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
    });

    it("rejects transfer of zero amount", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(10000000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(0),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(202)); // ERR-INVALID-AMOUNT
    });
  });

  // =========================================================================
  // Token URI Management
  // =========================================================================
  describe("set-token-uri", () => {
    it("allows owner to update token URI", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8("https://new-uri.com/metadata.json"))],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("rejects non-owner from updating token URI", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8("https://hacker.com"))],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
    });
  });
});
