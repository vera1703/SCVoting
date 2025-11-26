"use client"

import { useState } from "react"
import { ethers } from "ethers"
import "./App.css"

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint8", name: "_vote", type: "uint8" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint8", name: "_option", type: "uint8" }],
    name: "getVotes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

const CONTRACT_ADDRESS = "0x6CefF4c3ACE4a98E9D2f6875cBB39031E9362e67"

const VOTING_QUESTION = "Choose an option!"
const VOTE_OPTIONS = [
  { id: 0, label: "Option 1" },
  { id: 1, label: "Option 2" },
  { id: 2, label: "Option 3" },
]

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Please install MetaMask!")
        return
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0])

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      setContract(contractInstance)
      setError("")
    } catch (err) {
      setError("Wallet connection failed")
    }
  }

  const handleVote = async (option) => {
    if (!contract) {
      setError("Wallet not connected")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const tx = await contract.vote(option)
      await tx.wait()
      setSuccess(`Successfully voted for "${VOTE_OPTIONS[option].label}"!`)
    } catch (err) {
      const errorMessage = err.message.toLowerCase()
      if (
        errorMessage.includes("already voted") ||
        errorMessage.includes("user already voted") ||
        errorMessage.includes("revert reason: already voted")
      ) {
        setError("You have already voted")
      } else if (errorMessage.includes("user rejected")) {
        setError("Transaction rejected")
      } else {
        setError("Voting failed")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Smart Contract Voting</h1>
        <p className="question">{VOTING_QUESTION}</p>
      </div>

      <div className="wallet-section">
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <p className="connected">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="voting-options">
        {VOTE_OPTIONS.map((option) => (
          <button
            key={option.id}
            className="vote-btn"
            onClick={() => handleVote(option.id)}
            disabled={loading || !account}
          >
            {loading ? "Voting..." : option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
