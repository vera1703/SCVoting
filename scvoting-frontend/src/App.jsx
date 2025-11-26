import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

// ⛔ Deine Smart Contract Adresse:
const CONTRACT_ADDRESS = "0x6CefF4c3ACE4a98E9D2f6875cBB39031E9362e67";

// 🔥 ABI aus artifacts kopiert (nur relevante Teile)
const ABI = [
  "function vote(uint256 option) public",
  "function votes(uint256) public view returns (uint256)"
];

export default function App() {
  const [account, setAccount] = useState(null);
  const [votes, setVotes] = useState([0, 0, 0]);
  const [loadingVotes, setLoadingVotes] = useState(false);

  // 🔥 MetaMask zu Sepolia wechseln
  async function switchToSepolia() {
    if (!window.ethereum) {
      alert("MetaMask not installed!");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xAA36A7" }], // Sepolia chainId
      });
    } catch (switchError) {
      // Sepolia wurde noch nie hinzugefügt
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xAA36A7",
              chainName: "Sepolia",
              rpcUrls: ["https://sepolia.infura.io/v3/"],
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      }
    }
  }

  // 🔥 Wallet verbinden
  async function connectWallet() {
    await switchToSepolia();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  }

  // 🔥 Votes laden
  async function loadVotes() {
    setLoadingVotes(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const v0 = await contract.votes(0);
      const v1 = await contract.votes(1);
      const v2 = await contract.votes(2);

      setVotes([Number(v0), Number(v1), Number(v2)]);
    } catch (error) {
      console.error("Error loading votes:", error);
    }

    setLoadingVotes(false);
  }

  // 🔥 Vote senden
  async function vote(option) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.vote(option);
      await tx.wait();

      alert("Vote submitted!");
      await loadVotes();
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  // Beim ersten Verbinden Votes laden
  useEffect(() => {
  if (!account) return;

  async function fetchVotes() {
    await loadVotes();
  }

  fetchVotes();
}, [account]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Smart Contract Voting</h1>

      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}

      <h2>Votes</h2>

      {loadingVotes ? (
        <p>Loading votes...</p>
      ) : (
        <>
          <p>Option 0: {votes[0]}</p>
          <p>Option 1: {votes[1]}</p>
          <p>Option 2: {votes[2]}</p>
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => vote(0)}>Vote Option 0</button>
        <button onClick={() => vote(1)}>Vote Option 1</button>
        <button onClick={() => vote(2)}>Vote Option 2</button>
      </div>
    </div>
  );
}