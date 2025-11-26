import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'

// Korrigiertes ABI - uint8 statt uint256!
const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint8", "name": "_vote", "type": "uint8" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasVoted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "_option", "type": "uint8" }],
    "name": "getVotes",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
]

const CONTRACT_ADDRESS = "0x6CefF4c3ACE4a98E9D2f6875cBB39031E9362e67" // Deine Contract-Adresse hier

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("Bitte installiere MetaMask!")
        return
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      setContract(contractInstance)
      setError("")
    } catch (err) {
      setError("Wallet-Verbindung fehlgeschlagen: " + err.message)
    }
  }

  const handleVote = async (option) => {
    if (!contract) {
      setError("Bitte zuerst Wallet verbinden!")
      return
    }
    
    setLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const tx = await contract.vote(option)
      await tx.wait()
      setSuccess(`Erfolgreich für Option ${option} gestimmt!`)
    } catch (err) {
      if (err.message.includes("already voted")) {
        setError("Du hast bereits abgestimmt!")
      } else {
        setError("Voting fehlgeschlagen: " + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>SC Voting</h1>
      
      {!account ? (
        <button onClick={connectWallet}>Wallet verbinden</button>
      ) : (
        <p>Verbunden: {account.slice(0,6)}...{account.slice(-4)}</p>
      )}
      
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
      
      <div className="voting-options">
        <button onClick={() => handleVote(0)} disabled={loading || !account}>
          {loading ? "Voting..." : "Option 0"}
        </button>
        <button onClick={() => handleVote(1)} disabled={loading || !account}>
          {loading ? "Voting..." : "Option 1"}
        </button>
      </div>
    </div>
  )
}

export default App