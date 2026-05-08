// Build links to the Hiro Stacks Explorer for the configured network.

import { STACKS_NETWORK, CONTRACT_ADDRESS } from "../stacksConfig";

const BASE = "https://explorer.hiro.so";

function chainParam() {
    return `?chain=${STACKS_NETWORK === "mainnet" ? "mainnet" : "testnet"}`;
}

export function addressUrl(address) {
    return `${BASE}/address/${address}${chainParam()}`;
}

export function txUrl(txId) {
    return `${BASE}/txid/${txId}${chainParam()}`;
}

export function contractUrl(name) {
    return `${BASE}/txid/${CONTRACT_ADDRESS}.${name}${chainParam()}`;
}
