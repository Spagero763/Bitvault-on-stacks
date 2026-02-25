import { useState, useEffect, useCallback } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { APP_NAME } from "./stacksConfig";
import Dashboard from "./components/Dashboard";
import "./index.css";

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

function App() {
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = useCallback(() => {
    try {
      showConnect({
        appDetails: {
          name: APP_NAME,
          icon: window.location.origin + "/icon.png",
        },
        redirectTo: "/",
        onFinish: () => {
          setUserData(userSession.loadUserData());
          showToast("Wallet connected!", "success");
        },
        onCancel: () => {
          showToast("Connection cancelled", "error");
        },
        userSession,
      });
    } catch (err) {
      console.error("Connect error:", err);
      showToast(
        "Install Leather/Hiro Wallet extension to connect",
        "error"
      );
      window.open("https://leather.io/install-extension", "_blank");
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    userSession.signUserOut("/");
    setUserData(null);
    showToast("Wallet disconnected", "success");
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const stxAddress = userData?.profile?.stxAddress?.testnet || "";

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
          {userData ? (
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
        {userData ? (
          <Dashboard
            stxAddress={stxAddress}
            userSession={userSession}
            showToast={showToast}
          />
        ) : (
          <div className="hero">
            <h1>Multi-Sig Treasury & DAO Toolkit</h1>
            <p>
              Create vaults, manage members, vote on proposals, and control
              treasury funds — all secured by Bitcoin via the Stacks blockchain.
            </p>
            <button className="btn btn-primary" onClick={connectWallet}>
              Connect Hiro Wallet to Start
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
