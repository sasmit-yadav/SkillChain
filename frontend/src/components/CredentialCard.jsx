import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import QRCodeModal from './QRCodeModal'
import { generateCredentialPDF } from '../utils/pdfGenerator'

const CredentialCard = ({ credential }) => {
  const navigate = useNavigate()
  const [showQR, setShowQR] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleShare = async () => {
    const verificationUrl = credential.tokenId
      ? `${window.location.origin}/verify?tokenId=${credential.tokenId}`
      : credential.txHash
      ? `${window.location.origin}/verify?txHash=${credential.txHash}`
      : window.location.origin

    const shareData = {
      title: `SkillChain Credential: ${credential.skillName}`,
      text: `I earned a ${credential.skillScore}/100 score in ${credential.skillName}! Verify on blockchain: ${verificationUrl}`,
      url: verificationUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.text)
      alert('Credential details copied to clipboard!')
    }
  }

  const handleVerify = () => {
    if (credential.tokenId) {
      navigate(`/verify?tokenId=${credential.tokenId}`)
    } else if (credential.txHash) {
      navigate(`/verify?txHash=${credential.txHash}`)
    } else {
      navigate('/verify')
    }
  }

  const handleDownloadPDF = () => {
    generateCredentialPDF(credential)
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
      {/* Verification Badge */}
      {credential.tokenId && (
        <div className="absolute top-4 right-4 bg-green-500 rounded-full p-1.5 shadow-lg">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      )}

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs opacity-90 bg-white/20 px-2 py-1 rounded-full">Blockchain Verified</div>
          </div>
          <h4 className="text-2xl font-bold mb-1">{credential.skillName}</h4>
          {credential.taskTitle && (
            <p className="text-sm opacity-80">{credential.taskTitle}</p>
          )}
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2">
            <span className="text-sm opacity-90">Score</span>
            <span className="text-2xl font-bold">{credential.skillScore}/100</span>
          </div>
          {credential.tokenId && (
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-80">Token ID:</span>
              <span className="font-mono bg-white/10 px-2 py-1 rounded">{credential.tokenId}</span>
            </div>
          )}
          {credential.timestamp && (
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-80">Issued:</span>
              <span>{formatDate(credential.timestamp)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {credential.txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${credential.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Etherscan
            </a>
          )}
          <button
            onClick={handleVerify}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verify
          </button>
          <button
            onClick={() => setShowQR(true)}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1"
            title="Show QR Code"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR Code
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1"
            title="Download PDF Certificate"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {credential.tokenId && (
            <button
              onClick={() => navigate(`/certificate/${credential.tokenId}`)}
              className="w-full bg-gradient-to-r from-yellow-400/30 to-orange-400/30 hover:from-yellow-400/40 hover:to-orange-400/40 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1"
              title="View full certificate"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Certificate
            </button>
          )}
          <button
            onClick={handleShare}
            className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1"
            title="Share credential"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Credential
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        credential={credential}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
      />
    </div>
  )
}

export default CredentialCard

