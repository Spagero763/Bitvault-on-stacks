import { useState, useCallback } from "react";
import { connect, isConnected, disconnect, getLocalStorage } from "@stacks/connect";
import { APP_NAME } from "./stacksConfig";
import { truncateAddress } from "./utils/format";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import "./index.css";

// Read the already-connected address (if any) from local storage on first load.
function readStoredAddress() {
  if (!isConnected()) return null;
  const stored = getLocalStorage();
  return (
    stored?.addresses?.stx?.find((a) => a.type === "p2pkh" || a.symbol === "STX")
      ?.address ||
    stored?.addresses?.stx?.[0]?.address ||
    null
  );
}

function App() {
  const [stxAddress, setStxAddress] = useState(readStoredAddress);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      const response = await connect({
        appDetails: {
          name: APP_NAME,
          icon: window.location.origin + "/icon.png",
        },
        forceWalletSelect: true,
      });

      // v8 returns addresses directly
      const stxAddrs = response?.addresses?.filter(
        (a) => a.symbol === "STX" || a.type === "p2pkh"
      );
      const addr = stxAddrs?.[0]?.address || null;
      setStxAddress(addr);
      showToast("Wallet connected!", "success");
    } catch (err) {
      console.error("Connect error:", err);
      if (err?.message?.includes("No wallet") || err?.message?.includes("provider")) {
        showToast("Install Leather Wallet to connect", "error");
        window.open("https://leather.io/install-extension", "_blank");
      } else {
        showToast("Connection cancelled", "error");
      }
    }
  }, [showToast]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setStxAddress(null);
    showToast("Wallet disconnected", "success");
  }, [showToast]);

  const copyAddress = async () => {
    if (!stxAddress) return;
    try {
      await navigator.clipboard.writeText(stxAddress);
      showToast("Address copied", "success");
    } catch {
      showToast("Could not copy address", "error");
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">B</div>
          <span className="navbar-title">BitVault</span>
          <span className="navbar-badge">Testnet</span>
        </div>
        <div className="navbar-actions">
          {stxAddress ? (
            <>
              <span
                className="address"
                onClick={copyAddress}
                title="Click to copy address"
                style={{ cursor: "pointer" }}
              >
                {truncateAddress(stxAddress)}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        {stxAddress ? (
          <Dashboard
            stxAddress={stxAddress}
            showToast={showToast}
          />
        ) : (
          <div className="hero">
            <h1>Multi-Sig Treasury &amp; DAO Toolkit</h1>
            <p>
              Create vaults, manage members, vote on proposals, and control
              treasury funds — all secured by Bitcoin via the Stacks blockchain.
            </p>
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Leather Wallet to Start
            </button>
            <p
              style={{
                marginTop: 16,
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              Don't have a wallet?{" "}
              <a
                href="https://leather.io/install-extension"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)" }}
              >
                Install Leather Wallet →
              </a>
            </p>
          </div>
        )}
      </main>

      <Footer />

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default App;
