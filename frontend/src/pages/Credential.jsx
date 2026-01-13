import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import QRCodeModal from '../components/QRCodeModal'
import { generateCredentialPDF } from '../utils/pdfGenerator'

const Credential = () => {
  const navigate = useNavigate()
  const { taskId } = useParams()
  const [isMinting, setIsMinting] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [mintedCredential, setMintedCredential] = useState(null)

  const tasks = {
    1: {
      title: 'Build a React Component Library',
      skill: 'React Development',
      reward: 150.00,
      score: 82
    },
    2: {
      title: 'Design a Smart Contract for Voting',
      skill: 'Solidity Development',
      reward: 200.00,
      score: 82
    },
    3: {
      title: 'Optimize Database Queries',
      skill: 'Backend Engineering',
      reward: 175.00,
      score: 82
    }
  }

  const task = tasks[taskId] || tasks[1]

  // Contract ABI (simplified - in production, use full ABI)
  const CONTRACT_ABI = [
    "function mintCredential(address to, string memory skillName, uint256 skillScore) public returns (uint256)",
    "function getCredential(uint256 tokenId) public view returns (string memory skillName, uint256 skillScore, uint256 timestamp)",
    "event CredentialMinted(uint256 indexed tokenId, address indexed to, string skillName, uint256 skillScore, uint256 timestamp)"
  ]

  // NOTE: Replace with your deployed contract address on Sepolia testnet
  const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // PLACEHOLDER - Update with deployed address

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setIsConnected(accounts.length > 0)
      } catch (error) {
        console.error('Error checking wallet:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      setIsConnected(true)
      setError('')
    } catch (error) {
      setError('Failed to connect wallet. Please try again.')
      console.error('Wallet connection error:', error)
    }
  }

  const mintCredential = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first.')
      return
    }

    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setError('Contract address not configured. Please deploy the contract and update CONTRACT_ADDRESS in Credential.jsx')
      return
    }

    setIsMinting(true)
    setError('')

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      // Check network (should be Sepolia)
      const network = await provider.getNetwork()
      if (network.chainId !== BigInt(11155111)) {
        setError('Please switch to Sepolia testnet in MetaMask')
        setIsMinting(false)
        return
      }

      // Call mintCredential function
      const tx = await contract.mintCredential(
        await signer.getAddress(),
        task.skill,
        task.score
      )

      setTxHash(tx.hash)

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      
      // Get token ID from event
      const mintEvent = receipt.logs.find(
        log => {
          try {
            const parsed = contract.interface.parseLog(log)
            return parsed && parsed.name === 'CredentialMinted'
          } catch {
            return false
          }
        }
      )

      if (mintEvent) {
        const parsed = contract.interface.parseLog(mintEvent)
        const mintedTokenId = parsed.args.tokenId.toString()
        setTokenId(mintedTokenId)

        // Save credential to localStorage
        const credential = {
          skillName: task.skill,
          skillScore: task.score,
          tokenId: mintedTokenId,
          txHash: tx.hash,
          timestamp: new Date().toISOString(),
          taskTitle: task.title
        }

        setMintedCredential(credential)

        const existingCredentials = JSON.parse(localStorage.getItem('skillchain_credentials') || '[]')
        existingCredentials.push(credential)
        localStorage.setItem('skillchain_credentials', JSON.stringify(existingCredentials))

        // Trigger update event
        window.dispatchEvent(new Event('credentialUpdated'))
      } else {
        // Fallback: use transaction receipt to get token ID
        // This is a simplified approach - in production, parse events properly
        setTokenId('Pending')
      }

    } catch (error) {
      console.error('Minting error:', error)
      if (error.message.includes('user rejected')) {
        setError('Transaction was rejected. Please try again.')
      } else if (error.message.includes('insufficient funds')) {
        setError('Insufficient funds for transaction. Please add Sepolia ETH to your wallet.')
      } else {
        setError(`Error minting credential: ${error.message}`)
      }
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mint Credential</h1>
          <p className="text-gray-600">Issue your blockchain-verified skill credential</p>
        </div>

        {/* Task Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h2>
          <div className="flex items-center gap-4 mt-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {task.skill}
            </span>
            <span className="text-gray-600">Score: <strong>{task.score}/100</strong></span>
          </div>
        </div>

        {/* Wallet Connection */}
        {!isConnected && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect Wallet</h3>
            <p className="text-gray-600 mb-4">
              Connect your MetaMask wallet to mint your credential on the Sepolia testnet.
            </p>
            <button
              onClick={connectWallet}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Connect MetaMask
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Minting Section */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Blockchain Credential</h3>
            <p className="text-gray-600 mb-6">
              Your credential will be minted as an NFT on the Ethereum Sepolia testnet.
            </p>

            {!txHash ? (
              <button
                onClick={mintCredential}
                disabled={isMinting}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 w-full"
              >
                {isMinting ? 'Minting...' : 'Mint Credential'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <p className="text-green-800 font-semibold mb-2">✓ Credential Minted Successfully!</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Transaction Hash:</span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline ml-2 break-all"
                      >
                        {txHash}
                      </a>
                    </div>
                    {tokenId && (
                      <div>
                        <span className="text-gray-600">Token ID:</span>
                        <span className="text-gray-800 font-mono ml-2">{tokenId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowQR(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    QR Code
                  </button>
                  <button
                    onClick={() => {
                      if (mintedCredential) {
                        generateCredentialPDF(mintedCredential)
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/payment/${taskId}`)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 w-full mt-3"
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </div>
        )}

        {/* QR Code Modal */}
        {mintedCredential && (
          <QRCodeModal
            credential={mintedCredential}
            isOpen={showQR}
            onClose={() => setShowQR(false)}
          />
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> Make sure you're connected to the Sepolia testnet and have some Sepolia ETH for gas fees.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Credential

