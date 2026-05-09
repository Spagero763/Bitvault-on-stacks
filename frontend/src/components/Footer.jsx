import { STACKS_NETWORK, CONTRACT_ADDRESS } from "../stacksConfig";
import { addressUrl } from "../utils/explorer";
import { truncateAddress } from "../utils/format";

function Footer() {
    return (
        <footer className="footer">
            <span>BitVault · Multi-Sig Treasury & DAO Toolkit</span>
            <span className="footer-meta">
                Network: {STACKS_NETWORK} ·{" "}
                <a
                    href={addressUrl(CONTRACT_ADDRESS)}
                    target="_blank"
                    rel="noreferrer"
                >
                    {truncateAddress(CONTRACT_ADDRESS)}
                </a>
            </span>
        </footer>
    );
}

export default Footer;
