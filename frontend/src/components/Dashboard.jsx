import { useState, useEffect, useCallback } from "react";
import { openContractCall } from "@stacks/connect";
import {
    uintCV,
    stringAsciiCV,
    principalCV,
    someCV,
    noneCV,
    boolCV,
} from "@stacks/transactions";
import { CONTRACT_ADDRESS, STACKS_NETWORK } from "../stacksConfig";

// Stacks API base
const API_BASE =
    STACKS_NETWORK === "mainnet"
        ? "https://api.hiro.so"
        : "https://api.testnet.hiro.so";

// Call a read-only function on-chain
async function readOnly(contractName, fnName, args = []) {
    const res = await fetch(
        `${API_BASE}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${contractName}/${fnName}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sender: CONTRACT_ADDRESS, arguments: args }),
        }
    );
    const json = await res.json();
    return json;
}

// Decode a Clarity uint value from API response
function decodeUint(cv) {
    if (!cv || cv.type !== "uint") return 0;
    return parseInt(cv.value, 10);
}

function Dashboard({ stxAddress, userSession, showToast }) {
    const [activeTab, setActiveTab] = useState("vaults");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);

    // On-chain data
    const [vaultCount, setVaultCount] = useState(0);
    const [vaults, setVaults] = useState([]);
    const [proposalCount, setProposalCount] = useState(0);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(false);

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

    // === Data Fetching ===

    const fetchChainData = useCallback(async () => {
        if (!stxAddress) return;
        setLoading(true);
        try {
            // 1. How many vaults total exist?
            const nonceRes = await readOnly("multisig-vault", "get-vault-nonce");
            const totalVaults = nonceRes.okay
                ? parseInt(nonceRes.result?.value ?? "0", 10)
                : 0;

            // 2. How many proposals exist?
            const pNonceRes = await readOnly("proposal-engine", "get-proposal-nonce");
            const totalProposals = pNonceRes.okay
                ? parseInt(pNonceRes.result?.value ?? "0", 10)
                : 0;

            setVaultCount(totalVaults);
            setProposalCount(totalProposals);

            // 3. Load each vault (cap at 10 for MVP)
            const vaultList = [];
            for (let i = 0; i < Math.min(totalVaults, 10); i++) {
                try {
                    const vRes = await readOnly("multisig-vault", "get-vault", [
                        `0x${uintCV(i).buffer.toString("hex")}`,
                    ]);
                    if (vRes.okay && vRes.result?.type === "some") {
                        const v = vRes.result.value;
                        // Also fetch treasury balance
                        const bRes = await readOnly("treasury", "get-stx-balance", [
                            `0x${uintCV(i).buffer.toString("hex")}`,
                        ]);
                        const balance = bRes.okay
                            ? parseInt(bRes.result?.value ?? "0", 10)
                            : 0;
                        vaultList.push({
                            id: i,
                            name: v?.name?.value ?? `Vault #${i}`,
                            owner: v?.owner?.value ?? "",
                            threshold: parseInt(v?.threshold?.value ?? "1", 10),
                            memberCount: parseInt(v?.["member-count"]?.value ?? "1", 10),
                            isLocked: v?.["is-locked"]?.value === true,
                            balance: balance / 1_000_000, // µSTX → STX
                        });
                    }
                } catch {
                    // vault may not exist, skip
                }
            }
            setVaults(vaultList);

            // 4. Load proposals (cap at 10)
            const proposalList = [];
            const statusLabels = { 1: "Active", 2: "Passed", 3: "Rejected", 4: "Executed", 5: "Expired" };
            for (let i = 0; i < Math.min(totalProposals, 10); i++) {
                try {
                    const pRes = await readOnly("proposal-engine", "get-proposal", [
                        `0x${uintCV(i).buffer.toString("hex")}`,
                    ]);
                    if (pRes.okay && pRes.result?.type === "some") {
                        const p = pRes.result.value;
                        proposalList.push({
                            id: i,
                            title: p?.title?.value ?? `Proposal #${i}`,
                            status: statusLabels[parseInt(p?.status?.value ?? "1", 10)] ?? "Unknown",
                            statusCode: parseInt(p?.status?.value ?? "1", 10),
                            yesVotes: parseInt(p?.["yes-votes"]?.value ?? "0", 10),
                            noVotes: parseInt(p?.["no-votes"]?.value ?? "0", 10),
                            requiredVotes: parseInt(p?.["required-votes"]?.value ?? "1", 10),
                            vaultId: parseInt(p?.["vault-id"]?.value ?? "0", 10),
                        });
                    }
                } catch {
                    // skip
                }
            }
            setProposals(proposalList);
        } catch (err) {
            console.error("Error fetching chain data:", err);
        } finally {
            setLoading(false);
        }
    }, [stxAddress]);

    useEffect(() => {
        fetchChainData();
    }, [fetchChainData]);

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
                    setTimeout(fetchChainData, 5000); // refresh after ~5s
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    const depositSTX = async () => {
        const amountMicro = Math.floor(parseFloat(depositAmount) * 1_000_000);
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
                    setTimeout(fetchChainData, 5000);
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
                    setTimeout(fetchChainData, 5000);
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
                    setTimeout(fetchChainData, 5000);
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    // FIX: use boolCV() instead of raw type/value object
    const castVote = async (proposalId, vote) => {
        try {
            await openContractCall({
                network: STACKS_NETWORK,
                contractAddress: CONTRACT_ADDRESS,
                contractName: "voting",
                functionName: "cast-vote",
                functionArgs: [
                    uintCV(proposalId),
                    boolCV(vote),
                ],
                onFinish: (data) => {
                    showToast(`Vote cast! TX: ${data.txId.slice(0, 8)}...`);
                    setTimeout(fetchChainData, 5000);
                },
                onCancel: () => showToast("Transaction cancelled", "error"),
            });
        } catch (e) {
            showToast("Error: " + e.message, "error");
        }
    };

    const statusColor = (status) => {
        if (status === "Active") return "warning";
        if (status === "Passed" || status === "Executed") return "success";
        return ""; // rejected/expired
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
                    <div className="stat-label">Total Vaults</div>
                    <div className="stat-value success">{loading ? "…" : vaultCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Proposals</div>
                    <div className="stat-value accent">{loading ? "…" : proposalCount}</div>
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
                            <h3 className="card-title">🏦 Vaults</h3>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowMemberModal(true)}>
                                    + Add Member
                                </button>
                                <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
                                    + Create Vault
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={fetchChainData} disabled={loading}>
                                    {loading ? "…" : "↻ Refresh"}
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="empty-state"><p>Loading vaults from chain…</p></div>
                        ) : vaults.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🏦</div>
                                <p>
                                    No vaults found on-chain yet.<br />
                                    Create your first multi-sig vault to get started.
                                </p>
                            </div>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                        <th style={{ padding: "8px 12px", textAlign: "left" }}>ID</th>
                                        <th style={{ padding: "8px 12px", textAlign: "left" }}>Name</th>
                                        <th style={{ padding: "8px 12px", textAlign: "right" }}>Members</th>
                                        <th style={{ padding: "8px 12px", textAlign: "right" }}>Threshold</th>
                                        <th style={{ padding: "8px 12px", textAlign: "right" }}>Balance (STX)</th>
                                        <th style={{ padding: "8px 12px", textAlign: "center" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vaults.map((v) => (
                                        <tr key={v.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "10px 12px" }}>#{v.id}</td>
                                            <td style={{ padding: "10px 12px", fontWeight: 600 }}>{v.name}</td>
                                            <td style={{ padding: "10px 12px", textAlign: "right" }}>{v.memberCount}</td>
                                            <td style={{ padding: "10px 12px", textAlign: "right" }}>{v.threshold}</td>
                                            <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace" }}>
                                                {v.balance.toFixed(6)}
                                            </td>
                                            <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                                <span className={`stat-value ${v.isLocked ? "" : "success"}`} style={{ fontSize: 12 }}>
                                                    {v.isLocked ? "🔒 Locked" : "● Active"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {/* Proposals Tab */}
            {activeTab === "proposals" && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📋 Proposals</h3>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowProposalModal(true)}>
                                + New Proposal
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={fetchChainData} disabled={loading}>
                                {loading ? "…" : "↻ Refresh"}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state"><p>Loading proposals from chain…</p></div>
                    ) : proposals.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <p>
                                No proposals yet.<br />
                                Create a governance proposal for your vault.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 0" }}>
                            {proposals.map((p) => (
                                <div key={p.id} style={{
                                    border: "1px solid var(--border)",
                                    borderRadius: 8,
                                    padding: "14px 16px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 16,
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                            #{p.id} — {p.title}
                                        </div>
                                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                                            Vault #{p.vaultId} · ✅ {p.yesVotes}/{p.requiredVotes} required · ❌ {p.noVotes}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span className={`stat-value ${statusColor(p.status)}`} style={{ fontSize: 12 }}>
                                            {p.status}
                                        </span>
                                        {p.statusCode === 1 && (
                                            <>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => castVote(p.id, true)}
                                                >
                                                    ✅ Yes
                                                </button>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => castVote(p.id, false)}
                                                >
                                                    ❌ No
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Treasury Tab */}
            {activeTab === "treasury" && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">💰 Treasury</h3>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowDepositModal(true)}>
                                + Deposit STX
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={fetchChainData} disabled={loading}>
                                {loading ? "…" : "↻ Refresh"}
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="empty-state"><p>Loading treasury data…</p></div>
                    ) : vaults.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">💰</div>
                            <p>
                                Create a vault first, then deposit STX into its treasury.<br />
                                Funds can be withdrawn through governance proposals.
                            </p>
                        </div>
                    ) : (
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Vault</th>
                                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Name</th>
                                    <th style={{ padding: "8px 12px", textAlign: "right" }}>STX Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaults.map((v) => (
                                    <tr key={v.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <td style={{ padding: "10px 12px" }}>#{v.id}</td>
                                        <td style={{ padding: "10px 12px" }}>{v.name}</td>
                                        <td style={{ padding: "10px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 600 }}>
                                            {v.balance.toFixed(6)} STX
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
                                max="20"
                                placeholder="1"
                                value={vaultThreshold}
                                onChange={(e) => setVaultThreshold(e.target.value)}
                            />
                            <small style={{ color: "var(--text-muted)", fontSize: 12 }}>
                                Number of signatures required. Add members after creating the vault.
                            </small>
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
