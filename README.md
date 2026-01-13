# SkillChain - Blockchain Skill Credential Platform

A hackathon-ready prototype demonstrating skill-based hiring with blockchain-verified credentials, AI evaluation simulation, and smart contract escrow payments.

## 🎯 Project Overview

SkillChain is a platform where users prove their skills by completing real tasks. After task submission:
- **AI evaluates performance** (simulated for prototype)
- **Blockchain-verified skill credential is minted** (real implementation on Sepolia testnet)
- **Payment is released** via smart contract escrow (UI simulation)

This prototype is designed for a 24-hour hackathon demo, prioritizing clarity and reliability over full production depth.

## ✨ Features

- **User Dashboard**: Enhanced dashboard with skill reputation, earned credentials, total earnings, and statistics
- **Task Marketplace**: Browse and select from available skill-based tasks with detailed descriptions
- **Task Submission**: Submit work for evaluation with intuitive form interface
- **AI Evaluation**: Simulated AI performance assessment with detailed metrics
- **Blockchain Credentials**: Real NFT minting on Ethereum Sepolia testnet with transaction tracking
- **Skill Verification**: Verify any credential by Token ID or Transaction Hash with blockchain validation
- **Payment System**: UI simulation of smart contract escrow payment release
- **Credential Display**: Beautiful visual representation of earned blockchain credentials with verification badges
- **Share Functionality**: Share credentials with others via native share API or clipboard
- **Navigation Bar**: Sticky navigation with quick access to all features
- **Responsive Design**: Modern, polished UI with smooth animations and transitions

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Web3 Integration**: ethers.js v6
- **Wallet**: MetaMask integration

### Blockchain
- **Network**: Ethereum Sepolia Testnet
- **Standard**: ERC-721 (NFT) for credentials
- **Smart Contract**: Solidity-based SkillCredential contract
- **Library**: OpenZeppelin contracts for security

### Data Storage
- **Credentials**: Stored in browser localStorage (for prototype)
- **Blockchain**: Permanent credential storage on Ethereum
- **Earnings**: Tracked locally for demo purposes

## ⚠️ AI Simulation Disclaimer

**Important**: The AI evaluation in this prototype is **simulated** for demonstration purposes. In a production environment, this would integrate with real AI/ML models for:
- Code quality assessment
- Performance analysis
- Fraud detection
- Skill verification

The current implementation shows static evaluation metrics to demonstrate the flow.

## 🔗 Blockchain Implementation

### Quick Start

For a complete, step-by-step blockchain setup guide, see **[BLOCKCHAIN_GUIDE.md](./BLOCKCHAIN_GUIDE.md)**.

This guide covers:
- ✅ MetaMask setup and Sepolia testnet configuration
- ✅ Getting free Sepolia ETH from faucets
- ✅ Deploying the smart contract using Remix IDE (easiest method)
- ✅ Connecting frontend to deployed contract
- ✅ Testing blockchain features
- ✅ Troubleshooting common issues

### Smart Contract Details

The `SkillCredential.sol` contract:
- Implements ERC-721 standard for NFT credentials
- Stores skill name, score, and timestamp
- Emits events for credential minting
- Provides view functions to retrieve credential data

### Contract Deployment (Quick Reference)

**Using Remix IDE (Easiest Method):**
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Upload `contracts/SkillCredential.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Sepolia via MetaMask
5. Copy the contract address
6. Update `CONTRACT_ADDRESS` in `Credential.jsx` and `VerifySkill.jsx`

**📖 For detailed step-by-step instructions, see [BLOCKCHAIN_GUIDE.md](./BLOCKCHAIN_GUIDE.md)**

### Contract Functions

- `mintCredential(address to, string skillName, uint256 skillScore)`: Mints a new credential NFT
- `getCredential(uint256 tokenId)`: Retrieves credential data

### Frontend Integration

The frontend connects to MetaMask and:
- Checks wallet connection
- Validates Sepolia network
- Calls `mintCredential()` function
- Displays transaction hash and token ID
- Links to Etherscan for verification

**📖 For detailed instructions, see [BLOCKCHAIN_GUIDE.md](./BLOCKCHAIN_GUIDE.md)**

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Sepolia testnet ETH (for gas fees)

### Installation

1. **Clone the repository**:
   ```bash
   cd SkillChain
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:5173`
   - The app will start at the Dashboard page

### Smart Contract Setup

1. **Install Hardhat** (optional, for local development):
   ```bash
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   ```

2. **Deploy contract to Sepolia**:
   - Use Remix IDE (recommended for quick setup)
   - Or use Hardhat with Sepolia network configuration
   - Copy the deployed contract address

3. **Update contract address**:
   - Open `frontend/src/pages/Credential.jsx`
   - Replace `CONTRACT_ADDRESS` placeholder with your deployed address

## 🎬 Demo Flow

### Step-by-Step User Journey

1. **Dashboard** (`/`)
   - View enhanced user profile with statistics
   - See skill reputation (82/100) and average score
   - View earned credentials with verification badges
   - Quick access to tasks and verification

2. **Task Marketplace** (`/tasks`)
   - View 3 available tasks with descriptions
   - See reward amounts and required skills
   - Select a task and click "Start Task"

3. **Task Submission** (`/submit/:taskId`)
   - Read detailed task description
   - Enter submission in text area
   - Click "Submit Task"

4. **AI Evaluation** (`/evaluation/:taskId`)
   - View simulated evaluation metrics (Accuracy, Speed, Fraud Check)
   - See final score (82/100)
   - Click "Issue Credential"

5. **Credential Minting** (`/credential/:taskId`)
   - Connect MetaMask wallet
   - Ensure Sepolia testnet is selected
   - Click "Mint Credential"
   - View transaction hash and token ID
   - Click "Continue to Payment"

6. **Payment Release** (`/payment/:taskId`)
   - See payment success confirmation
   - View released amount
   - Return to Dashboard to see updated credentials and earnings

7. **Skill Verification** (`/verify`)
   - Verify credentials by Token ID or Transaction Hash
   - View detailed credential information
   - Access verification links directly from credential cards
   - Share verified credentials with others

### Key Demo Points

- **No login required**: Start directly from Dashboard
- **Real blockchain interaction**: Actual NFT minting on Sepolia
- **Clear UI flow**: Step-by-step navigation
- **Visual feedback**: Loading states, success messages, error handling
- **Etherscan links**: Verify transactions on blockchain explorer

## 📁 Project Structure

```
skillchain/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Enhanced landing page with stats
│   │   │   ├── Tasks.jsx          # Task marketplace
│   │   │   ├── SubmitTask.jsx     # Task submission form
│   │   │   ├── Evaluation.jsx     # Simulated AI evaluation
│   │   │   ├── Credential.jsx      # Blockchain credential minting
│   │   │   ├── Payment.jsx        # Payment success screen
│   │   │   └── VerifySkill.jsx    # Skill verification page
│   │   ├── components/
│   │   │   ├── CredentialCard.jsx  # Enhanced credential display
│   │   │   └── Navbar.jsx         # Navigation bar component
│   │   ├── App.jsx                # Router configuration
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind CSS + animations
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── contracts/
│   └── SkillCredential.sol        # ERC-721 smart contract
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet)
- **Smart Contracts**: Solidity
- **Web3 Library**: ethers.js v6
- **Wallet**: MetaMask

## 📝 Notes

- This is a **hackathon prototype**, not a production application
- Credentials are stored in localStorage for demo purposes
- AI evaluation is simulated with static metrics
- Payment system is UI-only (no real token transfers)
- Smart contract must be deployed and address updated before blockchain features work

## 🔒 Security Considerations

For production use, consider:
- Server-side credential validation
- Real AI/ML model integration
- Secure wallet connection handling
- Input validation and sanitization
- Rate limiting and fraud prevention
- Gas optimization for smart contracts

## 📄 License

This project is created for hackathon demonstration purposes.

---

**Built for Hackathon Demo** | SkillChain - Proving Skills on the Blockchain

