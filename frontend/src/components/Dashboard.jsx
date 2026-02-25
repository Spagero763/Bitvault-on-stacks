import { useState } from "react";
import { openContractCall } from "@stacks/connect";
import {
    uintCV,
    stringAsciiCV,
    principalCV,
    someCV,
    noneCV,
} from "@stacks/transactions";
import { CONTRACT_ADDRESS, STACKS_NETWORK } from "../stacksConfig";

function Dashboard({ stxAddress, userSession, showToast }) {
    const [activeTab, setActiveTab] = useState("vaults");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);

    // Form states
    const [vaultName, setVaultName] = useState("");
    const [vaultThreshold, setVaultThreshold] = useState("1");
    const [depositVaultId, setDepositVaultId] = useState("0");
    const [depositAmount, setDepositAmount] = useState("");
    const [proposalVaultId, setProposalVaultId] = useState("0");
    const [proposalTitle, setProposalTitle] = useState("");
    const [proposalDesc, setProposalDesc] = useState("");
    const [proposalType, setProposalType] = useState("1");
    const [votingPeriod, setVotingPeriod] = useState("144");
    const [targetAmount, setTargetAmount] = useState("0");
    const [targetPrincipal, setTargetPrincipal] = useState("");
    const [memberVaultId, setMemberVaultId] = useState("0");
    const [memberAddress, setMemberAddress] = useState("");
    const [memberRole, setMemberRole] = useState("member");

    // === Contract Calls ===

    const createVault = async () => {
        if (!vaultName.trim()) return showToast("Vault name is required", "error");
        try {
            await openContractCall({
                network: STACKS_NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: "multisig-vault",
                functionName: "create-vault",
                functionArgs: [
                    stringAsciiCV(vaultName),
                    uintCV(parseInt(vaultThreshold) || 1),
                ],
                onFinish: (data) => {
                    showToast("Vault creation submitted! TX: " + data.txId.slice(0, 8) + "...");
                    setShowCreateModal(false);
                    setVaultName("");
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    const depositSTX = async () => {
        const amountMicro = Math.floor(parseFloat(depositAmount) * 1000000);
        if (!amountMicro || amountMicro <= 0) return showToast("Enter a valid amount", "error");
        try {
            await openContractCall({
                network: STACKS_NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: "treasury",
                functionName: "deposit-stx",
                functionArgs: [
                    uintCV(parseInt(depositVaultId)),
                    uintCV(amountMicro),
                ],
                onFinish: (data) => {
                    showToast("Deposit submitted! TX: " + data.txId.slice(0, 8) + "...");
                    setShowDepositModal(false);
                    setDepositAmount("");
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    const createProposal = async () => {
        if (!proposalTitle.trim()) return showToast("Title is required", "error");
        try {
            const targetArg = targetPrincipal.trim()
                ? someCV(principalCV(targetPrincipal))
                : noneCV();
            await openContractCall({
                network: STACKS_NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: "proposal-engine",
                functionName: "create-proposal",
                functionArgs: [
                    uintCV(parseInt(proposalVaultId)),
                    stringAsciiCV(proposalTitle),
                    stringAsciiCV(proposalDesc || "No description"),
                    uintCV(parseInt(proposalType)),
                    uintCV(parseInt(votingPeriod) || 144),
                    targetArg,
                    uintCV(parseInt(targetAmount) || 0),
                ],
                onFinish: (data) => {
                    showToast("Proposal created! TX: " + data.txId.slice(0, 8) + "...");
                    setShowProposalModal(false);
                    setProposalTitle("");
                    setProposalDesc("");
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    const addMember = async () => {
        if (!memberAddress.trim()) return showToast("Member address required", "error");
        try {
            await openContractCall({
                network: STACKS_NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: "multisig-vault",
                functionName: "add-member",
                functionArgs: [
                    uintCV(parseInt(memberVaultId)),
                    principalCV(memberAddress),
                    stringAsciiCV(memberRole),
                ],
                onFinish: (data) => {
                    showToast("Member added! TX: " + data.txId.slice(0, 8) + "...");
                    setShowMemberModal(false);
                    setMemberAddress("");
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    const castVote = async (proposalId, vote) => {
        try {
            await openContractCall({
                network: STACKS_NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: "voting",
                functionName: "cast-vote",
                functionArgs: [
                    uintCV(proposalId),
                    { type: 3, value: vote }, // bool CV
                ],
                onFinish: (data) => {
                    showToast(`Vote cast! TX: ${data.txId.slice(0, 8)}...`);
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    return (
        <>
            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Network</div>
                    <div className="stat-value warning">Testnet</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Your Address</div>
                    <div className="stat-value accent" style={{ fontSize: 14, fontFamily: "monospace" }}>
                        {stxAddress.slice(0, 10)}...{stxAddress.slice(-6)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Contract</div>
                    <div className="stat-value success" style={{ fontSize: 14, fontFamily: "monospace" }}>
                        {CONTRACT_ADDRESS.slice(0, 10)}...
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Status</div>
                    <div className="stat-value success">● Live</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                {["vaults", "proposals", "treasury"].map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Vaults Tab */}
            {activeTab === "vaults" && (
                <>
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">🏦 Your Vaults</h3>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowMemberModal(true)}>
                                    + Add Member
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
                                    + Create Vault
                                </button>
                            </div>
                        </div>
                        <div className="empty-state">
                            <div className="empty-state-icon">🏦</div>
                            <p>
                                Create your first multi-sig vault to get started.<br />
                                Vaults allow you to manage shared funds with customizable thresholds.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Proposals Tab */}
            {activeTab === "proposals" && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📋 Proposals</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowProposalModal(true)}>
                            + New Proposal
                        </button>
                    </div>
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <p>
                            Create governance proposals for your vault.<br />
                            Members can vote on transfers, adding members, and more.
                        </p>
                    </div>
                </div>
            )}

            {/* Treasury Tab */}
            {activeTab === "treasury" && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">💰 Treasury</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowDepositModal(true)}>
                            + Deposit STX
                        </button>
                    </div>
                    <div className="empty-state">
                        <div className="empty-state-icon">💰</div>
                        <p>
                            Deposit STX into your vault treasury.<br />
                            Funds can be withdrawn through governance proposals.
                        </p>
                    </div>
                </div>
            )}

            {/* === MODALS === */}

            {/* Create Vault Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Create New Vault</h3>
                        <div className="form-group">
                            <label className="form-label">Vault Name</label>
                            <input
                                className="form-input"
                                placeholder="e.g. Team Treasury"
                                value={vaultName}
                                onChange={(e) => setVaultName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Signing Threshold</label>
                            <input
                                className="form-input"
                                type="number"
                                min="1"
                                placeholder="1"
                                value={vaultThreshold}
                                onChange={(e) => setVaultThreshold(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={createVault}>
                                Create Vault
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deposit Modal */}
            {showDepositModal && (
                <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Deposit STX</h3>
                        <div className="form-group">
                            <label className="form-label">Vault ID</label>
                            <input
                                className="form-input"
                                type="number"
                                min="0"
                                value={depositVaultId}
                                onChange={(e) => setDepositVaultId(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Amount (STX)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.000001"
                                placeholder="0.000000"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowDepositModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={depositSTX}>
                                Deposit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Proposal Modal */}
            {showProposalModal && (
                <div className="modal-overlay" onClick={() => setShowProposalModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Create Proposal</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Vault ID</label>
                                <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    value={proposalVaultId}
                                    onChange={(e) => setProposalVaultId(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Proposal Type</label>
                                <select
                                    className="form-input"
                                    value={proposalType}
                                    onChange={(e) => setProposalType(e.target.value)}
                                >
                                    <option value="1">Transfer</option>
                                    <option value="2">Add Member</option>
                                    <option value="3">Remove Member</option>
                                    <option value="4">Change Threshold</option>
                                    <option value="5">Custom</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                className="form-input"
                                placeholder="Proposal title"
                                value={proposalTitle}
                                onChange={(e) => setProposalTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input
                                className="form-input"
                                placeholder="Brief description"
                                value={proposalDesc}
                                onChange={(e) => setProposalDesc(e.target.value)}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Voting Period (blocks)</label>
                                <input
                                    className="form-input"
                                    type="number"
                                    min="72"
                                    max="4320"
                                    value={votingPeriod}
                                    onChange={(e) => setVotingPeriod(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Target Amount (µSTX)</label>
                                <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Target Principal (optional)</label>
                            <input
                                className="form-input"
                                placeholder="ST1PQHQ..."
                                value={targetPrincipal}
                                onChange={(e) => setTargetPrincipal(e.target.value)}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowProposalModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={createProposal}>
                                Create Proposal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {showMemberModal && (
                <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Add Vault Member</h3>
                        <div className="form-group">
                            <label className="form-label">Vault ID</label>
                            <input
                                className="form-input"
                                type="number"
                                min="0"
                                value={memberVaultId}
                                onChange={(e) => setMemberVaultId(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Member STX Address</label>
                            <input
                                className="form-input"
                                placeholder="ST1PQHQ..."
                                value={memberAddress}
                                onChange={(e) => setMemberAddress(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-input"
                                value={memberRole}
                                onChange={(e) => setMemberRole(e.target.value)}
                            >
                                <option value="member">Member</option>
                                <option value="signer">Signer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowMemberModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={addMember}>
                                Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;
