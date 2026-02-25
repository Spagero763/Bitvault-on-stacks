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
    it("returns the token name", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-name",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.stringAscii("BitVault Token"));
    });

    it("returns the token symbol", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-symbol",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.stringAscii("BVT"));
    });

    it("returns the correct decimals", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-decimals",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(6));
    });

    it("returns a token URI", () => {
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

    it("reports total supply as zero initially", () => {
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-total-supply",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(0));
    });
  });

  // =========================================================================
  // Minting
  // =========================================================================
  describe("mint", () => {
    it("allows the deployer to mint tokens", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(1000000), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("credits the recipient balance after minting", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(500000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-balance",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeOk(Cl.uint(500000));
    });

    it("tracks total minted amount", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(250000), Cl.principal(wallet1)],
        deployer
      );
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(750000), Cl.principal(wallet2)],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-total-minted",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(1000000));
    });

    it("rejects minting by non-deployer", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(1000), Cl.principal(wallet1)],
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
      // Mint the full supply first
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(1000000000000), Cl.principal(wallet1)],
        deployer
      );
      // Try to mint one more
      const { result } = simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(1), Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeErr(Cl.uint(203)); // ERR-MINT-FAILED
    });
  });

  // =========================================================================
  // Transfer
  // =========================================================================
  describe("transfer", () => {
    it("allows the sender to transfer tokens", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(5000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(2000),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("updates balances after transfer", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(10000), Cl.principal(wallet1)],
        deployer
      );
      simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(3000),
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
      expect(bal1).toBeOk(Cl.uint(7000));
      expect(bal2).toBeOk(Cl.uint(3000));
    });

    it("rejects transfer when tx-sender is not the sender", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(5000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(1000),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.none(),
        ],
        wallet2 // wallet2 trying to spend wallet1's tokens
      );
      expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
    });

    it("rejects transfer of zero amount", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(5000), Cl.principal(wallet1)],
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

    it("supports transfer with a memo", () => {
      simnet.callPublicFn(
        "governance-token",
        "mint",
        [Cl.uint(5000), Cl.principal(wallet1)],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "governance-token",
        "transfer",
        [
          Cl.uint(1000),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
          Cl.some(Cl.bufferFromHex("68656c6c6f")), // "hello" in hex
        ],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });
  });

  // =========================================================================
  // Set Token URI
  // =========================================================================
  describe("set-token-uri", () => {
    it("allows deployer to update the token URI", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8("https://new-uri.com/metadata.json"))],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("reflects the updated URI in get-token-uri", () => {
      simnet.callPublicFn(
        "governance-token",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8("https://updated.com/meta.json"))],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-token-uri",
        [],
        deployer
      );
      expect(result).toBeOk(
        Cl.some(Cl.stringUtf8("https://updated.com/meta.json"))
      );
    });

    it("allows setting URI to none", () => {
      simnet.callPublicFn(
        "governance-token",
        "set-token-uri",
        [Cl.none()],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "governance-token",
        "get-token-uri",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.none());
    });

    it("rejects set-token-uri by non-deployer", () => {
      const { result } = simnet.callPublicFn(
        "governance-token",
        "set-token-uri",
        [Cl.some(Cl.stringUtf8("https://hack.com"))],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(200)); // ERR-NOT-AUTHORIZED
    });
  });
});
