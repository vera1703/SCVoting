# Smart Contract Voting Application

A complete blockchain voting application built with **Hardhat** (backend) and **React + Vite** (frontend). Users can connect their MetaMask wallet and cast their vote on the Sepolia testnet.

## Project Overview

This project demonstrates a complete Web3 application with:
- **Smart Contract**: A Solidity smart contract deployed on Sepolia that manages voting
- **Frontend**: A React application that lets users connect their wallet and vote
- **Blockchain Integration**: Direct interaction with the Ethereum blockchain using ethers.js

## Prerequisites

Before you start, make sure you have:

1. **Node.js** 
2. **MetaMask Wallet** 
3. **Sepolia Testnet ETH** 

## Quick Start

### 1. Setup MetaMask

1. Install the MetaMask browser extension
2. Create a new wallet or import an existing one
3. Switch to the **Sepolia** testnet (click the network dropdown → Select Sepolia)
4. Get free test ETH from a faucet to pay for transactions

### 2. Clone & Install Dependencies

1. Clone the project: `git clone https://github.com/vera1703/SCVoting.git`
2. Install backend dependencies: `npm install`
3. Install frontend dependencies: `cd scvoting-frontend` `npm install`
4. Start frontend: `cd scvoting-frontend` `npm run dev`


The app will open at http://localhost:5173

## How to Use the Application

### Step 1: Connect Your Wallet
- Click the **"Connect Wallet"** button
- MetaMask will pop up asking for permission to connect
- Click **"Next"** → **"Connect"** to approve

### Step 2: Cast Your Vote
- You'll see 3 voting options displayed
- Click any option button to vote
- MetaMask will ask you to confirm the transaction
- Review the transaction and click **"Confirm"**
- Wait for the transaction to be mined (usually 10-30 seconds)

### Step 3: View Results
- Once your vote is confirmed, you'll see the vote count update
- **Note**: Each wallet address can only vote once. Trying to vote again will show an error: "You have already voted"

## Smart Contract Details

### Deployed Contract

- **Network**: Sepolia Testnet
- **Address**: `0x6CefF4c3ACE4a98E9D2f6875cBB39031E9362e67`
- **Explorer:** https://sepolia.etherscan.io/address0x6CefF4c3ACE4a98E9D2f6875cBB39031E9362e67
- **Contract File**: `contracts/SCVoting.sol`

