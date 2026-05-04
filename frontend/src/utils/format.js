// Small formatting helpers shared across the dashboard.

const MICRO_PER_STX = 1_000_000;

// Shorten a Stacks address for display, e.g. "ST1PQH...J1YYR8".
export function truncateAddress(address, lead = 6, tail = 4) {
    if (!address) return "";
    if (address.length <= lead + tail) return address;
    return `${address.slice(0, lead)}...${address.slice(-tail)}`;
}

// Convert micro-STX (the on-chain unit) to STX.
export function microToStx(micro) {
    const value = typeof micro === "string" ? parseInt(micro, 10) : micro;
    if (!value || Number.isNaN(value)) return 0;
    return value / MICRO_PER_STX;
}

// Convert STX to micro-STX, floored to an integer.
export function stxToMicro(stx) {
    const value = typeof stx === "string" ? parseFloat(stx) : stx;
    if (!value || Number.isNaN(value)) return 0;
    return Math.floor(value * MICRO_PER_STX);
}

// Format a micro-STX amount as a STX string with six decimals.
export function formatStx(micro, decimals = 6) {
    return microToStx(micro).toFixed(decimals);
}
