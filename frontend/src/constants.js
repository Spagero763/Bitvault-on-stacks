// Shared on-chain enums mirrored for the UI.

export const PROPOSAL_TYPES = [
    { value: 1, label: "Transfer" },
    { value: 2, label: "Add Member" },
    { value: 3, label: "Remove Member" },
    { value: 4, label: "Change Threshold" },
    { value: 5, label: "Custom" },
];

export const PROPOSAL_STATUS = {
    1: "Active",
    2: "Passed",
    3: "Rejected",
    4: "Executed",
    5: "Expired",
    6: "Cancelled",
};

export const MEMBER_ROLES = ["member", "signer", "admin"];

// Voting period bounds, in blocks, matching the proposal-engine contract.
export const MIN_VOTING_PERIOD = 72;
export const MAX_VOTING_PERIOD = 4320;
export const DEFAULT_VOTING_PERIOD = 144;
