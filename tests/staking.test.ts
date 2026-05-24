import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// Give an account some BVT to stake.
function fund(account: string, amount: number) {
  simnet.callPublicFn(
    "governance-token",
    "mint",
    [Cl.uint(amount), Cl.principal(account)],
    deployer
  );
}

describe("BitVault Staking", () => {
  beforeEach(() => {
    fund(wallet1, 1_000_000);
    fund(wallet2, 1_000_000);
  });

  describe("initial state", () => {
    it("starts with zero total staked", () => {
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-total-staked",
        [],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("starts with zero stakers", () => {
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-staker-count",
        [],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("reports a zero staked amount for a new account", () => {
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-staked-amount",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeUint(0);
    });
  });

  describe("stake", () => {
    it("stakes tokens successfully", () => {
      const { result } = simnet.callPublicFn(
        "staking",
        "stake",
        [Cl.uint(500_000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("records the staked amount", () => {
      simnet.callPublicFn("staking", "stake", [Cl.uint(400_000)], wallet1);
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-staked-amount",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeUint(400_000);
    });

    it("increases total staked", () => {
      simnet.callPublicFn("staking", "stake", [Cl.uint(300_000)], wallet1);
      simnet.callPublicFn("staking", "stake", [Cl.uint(200_000)], wallet2);
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-total-staked",
        [],
        deployer
      );
      expect(result).toBeUint(500_000);
    });

    it("counts each staker once", () => {
      simnet.callPublicFn("staking", "stake", [Cl.uint(100_000)], wallet1);
      simnet.callPublicFn("staking", "stake", [Cl.uint(100_000)], wallet1);
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-staker-count",
        [],
        deployer
      );
      expect(result).toBeUint(1);
    });

    it("rejects staking zero", () => {
      const { result } = simnet.callPublicFn(
        "staking",
        "stake",
        [Cl.uint(0)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(601)); // ERR-INVALID-AMOUNT
    });
  });

  describe("unstake", () => {
    it("returns staked tokens", () => {
      simnet.callPublicFn("staking", "stake", [Cl.uint(500_000)], wallet1);
      const { result } = simnet.callPublicFn(
        "staking",
        "unstake",
        [Cl.uint(200_000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("reduces the staked amount", () => {
      simnet.callPublicFn("staking", "stake", [Cl.uint(500_000)], wallet1);
      simnet.callPublicFn("staking", "unstake", [Cl.uint(300_000)], wallet1);
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-staked-amount",
        [Cl.principal(wallet1)],
        deployer
      );
      expect(result).toBeUint(200_000);
    });

    it("drops the staker count when fully unstaked", () => {
      simnet.callPublicFn("staking", "stake", [Cl.uint(500_000)], wallet1);
      simnet.callPublicFn("staking", "unstake", [Cl.uint(500_000)], wallet1);
      const { result } = simnet.callReadOnlyFn(
        "staking",
        "get-staker-count",
        [],
        deployer
      );
      expect(result).toBeUint(0);
    });

    it("rejects unstaking more than staked", () => {
      simnet.callPublicFn("staking", "stake", [Cl.uint(100_000)], wallet1);
      const { result } = simnet.callPublicFn(
        "staking",
        "unstake",
        [Cl.uint(200_000)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(602)); // ERR-INSUFFICIENT-STAKE
    });

    it("rejects unstaking zero", () => {
      const { result } = simnet.callPublicFn(
        "staking",
        "unstake",
        [Cl.uint(0)],
        wallet1
      );
      expect(result).toBeErr(Cl.uint(601)); // ERR-INVALID-AMOUNT
    });
  });
});
