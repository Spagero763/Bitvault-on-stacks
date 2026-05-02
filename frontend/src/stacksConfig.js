// Network and contract configuration. Values can be overridden at build time
// through Vite env vars (see .env.example); sensible testnet defaults are used
// when they are not set.

export const STACKS_NETWORK = import.meta.env.VITE_STACKS_NETWORK || "testnet";

export const CONTRACT_ADDRESS =
    import.meta.env.VITE_CONTRACT_ADDRESS ||
    "ST26TQH4FRPTKHQEYE6HZQG98R4CZE6PTJ8J1YYR8";

export const CONTRACTS = {
    multisigVault: `${CONTRACT_ADDRESS}.multisig-vault`,
    governanceToken: `${CONTRACT_ADDRESS}.governance-token`,
    proposalEngine: `${CONTRACT_ADDRESS}.proposal-engine`,
    voting: `${CONTRACT_ADDRESS}.voting`,
    treasury: `${CONTRACT_ADDRESS}.treasury`,
};

export const APP_NAME = "BitVault";
export const APP_ICON = "https://bitvault.app/icon.png";
