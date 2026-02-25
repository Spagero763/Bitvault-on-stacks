import { useState, useEffect, useCallback } from "react";
import { connect, isConnected, disconnect, getLocalStorage } from "@stacks/connect";
import { APP_NAME } from "./stacksConfig";
import Dashboard from "./components/Dashboard";
import "./index.css";

function App() {
  const [stxAddress, setStxAddress] = useState(null);
  const [toast, setToast] = useState(null);

  // On mount, check if already connected
  useEffect(() => {
    if (isConnected()) {
      const stored = getLocalStorage();
      const addr =
        stored?.addresses?.stx?.find((a) => a.type === "p2pkh" || a.symbol === "STX")
          ?.address ||
        stored?.addresses?.stx?.[0]?.address ||
        null;
      setStxAddress(addr);
    }
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
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setStxAddress(null);
    showToast("Wallet disconnected", "success");
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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
              <span className="address">
                {stxAddress.slice(0, 6)}...{stxAddress.slice(-4)}
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

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default App;
