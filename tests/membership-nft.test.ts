import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("BitVault Membership Badge (SIP-009)", () => {
  describe("metadata", () => {
    it("starts with a last token id of zero", () => {
      const { result } = simnet.callReadOnlyFn(
        "membership-nft",
        "get-last-token-id",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(0));
    });

    it("returns a token uri derived from the token id", () => {
      const { result } = simnet.callReadOnlyFn(
        "membership-nft",
        "get-token-uri",
        [Cl.uint(1)],
        deployer
      );
      expect(result).toBeOk(
        Cl.some(Cl.stringAscii("https://bitvault.app/badge/1"))
      );
    });
  });

  describe("mint", () => {
    it("allows the owner to mint a badge", () => {
      const { result } = simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        deployer
      );
      expect(result).toBeOk(Cl.uint(1));
    });

    it("assigns ownership to the recipient", () => {
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "membership-nft",
        "get-owner",
        [Cl.uint(1)],
        deployer
      );
      expect(result).toBeOk(Cl.some(Cl.principal(wallet1)));
    });

    it("stores the badge metadata", () => {
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(3), Cl.stringAscii("silver")],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "membership-nft",
        "get-token-meta",
        [Cl.uint(1)],
        deployer
      );
      expect(result).toBeSome(
        Cl.tuple({ "vault-id": Cl.uint(3), tier: Cl.stringAscii("silver") })
      );
    });

    it("increments the last token id", () => {
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        deployer
      );
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet2), Cl.uint(0), Cl.stringAscii("bronze")],
        deployer
      );
      const { result } = simnet.callReadOnlyFn(
        "membership-nft",
        "get-last-token-id",
        [],
        deployer
      );
      expect(result).toBeOk(Cl.uint(2));
    });

    it("rejects minting by a non-owner", () => {
      const { result } = simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(700)); // ERR-NOT-AUTHORIZED
    });
  });

  describe("transfer", () => {
    it("lets the owner transfer their badge", () => {
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "membership-nft",
        "transfer",
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet2)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("rejects a transfer not signed by the sender", () => {
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "membership-nft",
        "transfer",
        [Cl.uint(1), Cl.principal(wallet1), Cl.principal(wallet2)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(700)); // ERR-NOT-AUTHORIZED
    });
  });

  describe("burn", () => {
    it("lets the holder burn their badge", () => {
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "membership-nft",
        "burn",
        [Cl.uint(1)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("rejects burning a badge the caller does not own", () => {
      simnet.callPublicFn(
        "membership-nft",
        "mint",
        [Cl.principal(wallet1), Cl.uint(0), Cl.stringAscii("gold")],
        deployer
      );
      const { result } = simnet.callPublicFn(
        "membership-nft",
        "burn",
        [Cl.uint(1)],
        wallet2
      );
      expect(result).toBeErr(Cl.uint(701)); // ERR-NOT-TOKEN-OWNER
    });
  });

  describe("set-base-uri", () => {
    it("rejects updates from a non-owner", () => {
      const { result } = simnet.callPublicFn(
        "membership-nft",
        "set-base-uri",
        [Cl.stringAscii("https://evil.example/")],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(700)); // ERR-NOT-AUTHORIZED
    });
  });
});
