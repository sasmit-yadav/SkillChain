import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ethers } from 'ethers'

const VerifySkill = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [verificationType, setVerificationType] = useState('tokenId') // 'tokenId' or 'txHash'
  const [inputValue, setInputValue] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [error, setError] = useState('')

  // Handle URL parameters
  useEffect(() => {
    const tokenId = searchParams.get('tokenId')
    const txHash = searchParams.get('txHash')
    
    if (tokenId) {
      setVerificationType('tokenId')
      setInputValue(tokenId)
    } else if (txHash) {
      setVerificationType('txHash')
      setInputValue(txHash)
    }
  }, [searchParams])

  // Contract ABI
  const CONTRACT_ABI = [
    "function getCredential(uint256 tokenId) public view returns (string memory skillName, uint256 skillScore, uint256 timestamp)",
    "function ownerOf(uint256 tokenId) public view returns (address)"
  ]

  // NOTE: Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // PLACEHOLDER

  const verifyByTokenId = async (tokenId) => {
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      // Simulate verification for demo
      return {
        verified: true,
        tokenId: tokenId,
        skillName: "React Development",
        skillScore: 82,
        timestamp: Date.now(),
        owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        message: "Credential verified on blockchain (simulated for demo)"
      }
    }

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

      const [skillName, skillScore, timestamp] = await contract.getCredential(tokenId)
      const owner = await contract.ownerOf(tokenId)

      return {
        verified: true,
        tokenId: tokenId,
        skillName: skillName,
        skillScore: skillScore.toString(),
        timestamp: timestamp.toString(),
        owner: owner,
        message: "Credential verified on blockchain"
      }
    } catch (error) {
      if (error.message.includes('does not exist') || error.message.includes('invalid token ID')) {
        return {
          verified: false,
          message: "Credential not found. Invalid token ID."
        }
      }
      throw error
    }
  }

  const verifyByTxHash = async (txHash) => {
    if (CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
      // Simulate verification for demo
      return {
        verified: true,
        txHash: txHash,
        skillName: "React Development",
        skillScore: 82,
        timestamp: Date.now(),
        message: "Transaction verified on blockchain (simulated for demo)"
      }
    }

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const receipt = await provider.getTransactionReceipt(txHash)

      if (!receipt || !receipt.logs) {
        return {
          verified: false,
          message: "Transaction not found or invalid"
        }
      }

      // Parse the CredentialMinted event
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const iface = contract.interface

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log)
          if (parsed && parsed.name === 'CredentialMinted') {
            return {
              verified: true,
              txHash: txHash,
              tokenId: parsed.args.tokenId.toString(),
              skillName: parsed.args.skillName,
              skillScore: parsed.args.skillScore.toString(),
              timestamp: parsed.args.timestamp.toString(),
              owner: parsed.args.to,
              message: "Credential verified on blockchain"
            }
          }
        } catch (e) {
          continue
        }
      }

      return {
        verified: false,
        message: "Credential mint event not found in transaction"
      }
    } catch (error) {
      throw error
    }
  }

  const handleVerify = async () => {
    if (!inputValue.trim()) {
      setError('Please enter a token ID or transaction hash')
      return
    }

    setIsVerifying(true)
    setError('')
    setVerificationResult(null)

    try {
      let result
      if (verificationType === 'tokenId') {
        result = await verifyByTokenId(inputValue)
      } else {
        result = await verifyByTxHash(inputValue)
      }

      setVerificationResult(result)
    } catch (error) {
      setError(`Verification failed: ${error.message}`)
      setVerificationResult({
        verified: false,
        message: error.message
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Auto-verify when URL params are set
  useEffect(() => {
    const tokenId = searchParams.get('tokenId')
    const txHash = searchParams.get('txHash')
    
    if ((tokenId || txHash) && inputValue) {
      // Small delay to ensure state is updated
      const timer = setTimeout(() => {
        handleVerify()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [inputValue, verificationType])

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Skill Verification</h1>
              <p className="text-gray-600">Verify blockchain-verified skill credentials</p>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Verify Credential</h2>

          {/* Verification Type Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setVerificationType('tokenId')
                setInputValue('')
                setVerificationResult(null)
                setError('')
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                verificationType === 'tokenId'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              By Token ID
            </button>
            <button
              onClick={() => {
                setVerificationType('txHash')
                setInputValue('')
                setVerificationResult(null)
                setError('')
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                verificationType === 'txHash'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              By Transaction Hash
            </button>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {verificationType === 'tokenId' ? 'Token ID' : 'Transaction Hash'}
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={verificationType === 'tokenId' ? 'Enter token ID (e.g., 1, 2, 3...)' : 'Enter transaction hash (0x...)'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputValue.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:transform-none"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Credential'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`bg-white rounded-xl shadow-xl p-8 ${
            verificationResult.verified ? 'border-2 border-green-500' : 'border-2 border-red-500'
          }`}>
            {verificationResult.verified ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-600">Credential Verified</h3>
                    <p className="text-gray-600">{verificationResult.message}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Skill Name</span>
                      <p className="text-lg font-semibold text-gray-800">{verificationResult.skillName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Skill Score</span>
                      <p className="text-lg font-semibold text-gray-800">{verificationResult.skillScore}/100</p>
                    </div>
                    {verificationResult.tokenId && (
                      <div>
                        <span className="text-sm text-gray-600">Token ID</span>
                        <p className="text-lg font-mono font-semibold text-gray-800">{verificationResult.tokenId}</p>
                      </div>
                    )}
                    {verificationResult.timestamp && (
                      <div>
                        <span className="text-sm text-gray-600">Issued On</span>
                        <p className="text-lg font-semibold text-gray-800">{formatTimestamp(verificationResult.timestamp)}</p>
                      </div>
                    )}
                    {verificationResult.owner && (
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-600">Owner Address</span>
                        <p className="text-sm font-mono text-gray-800 break-all">{verificationResult.owner}</p>
                      </div>
                    )}
                    {verificationResult.txHash && (
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-600">Transaction Hash</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${verificationResult.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-purple-600 hover:underline break-all block"
                        >
                          {verificationResult.txHash}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  {verificationResult.txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${verificationResult.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                    >
                      View on Etherscan
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setInputValue('')
                      setVerificationResult(null)
                      setError('')
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Verify Another
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-red-600">Verification Failed</h3>
                    <p className="text-gray-600">{verificationResult.message || 'Credential could not be verified'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setInputValue('')
                    setVerificationResult(null)
                    setError('')
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>💡 Tip:</strong> You can verify any credential by entering its Token ID or the transaction hash from when it was minted. 
            All credentials are permanently stored on the Ethereum blockchain.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifySkill

