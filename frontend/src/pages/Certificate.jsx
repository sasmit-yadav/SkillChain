import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { generateCredentialPDF } from '../utils/pdfGenerator'
import QRCodeModal from '../components/QRCodeModal'

const Certificate = () => {
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const [credential, setCredential] = useState(null)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    // Load credential from localStorage
    const savedCredentials = JSON.parse(localStorage.getItem('skillchain_credentials') || '[]')
    const found = savedCredentials.find(cred => cred.tokenId === tokenId)
    
    if (found) {
      setCredential(found)
    }
  }, [tokenId])

  if (!credential) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Credential not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Certificate */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-200">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8 text-center">
            <div className="mb-4">
              <svg className="w-20 h-20 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">SkillChain</h1>
            <p className="text-xl text-purple-100">Certificate of Achievement</p>
          </div>

          {/* Certificate Body */}
          <div className="p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">This is to certify that</p>
            
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                {credential.skillName}
              </h2>
              <p className="text-gray-600 text-lg mb-6">has been successfully completed with a score of</p>
              <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-5xl font-bold px-8 py-4 rounded-xl shadow-lg">
                {credential.skillScore}/100
              </div>
            </div>

            {credential.taskTitle && (
              <div className="mb-8">
                <p className="text-gray-500 text-sm mb-2">Task Completed</p>
                <p className="text-gray-700 font-medium">{credential.taskTitle}</p>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div>
                <p className="text-gray-500 text-sm mb-2">Issued On</p>
                <p className="text-gray-800 font-semibold">{formatDate(credential.timestamp)}</p>
              </div>
              {credential.tokenId && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Token ID</p>
                  <p className="text-gray-800 font-mono font-semibold text-sm">{credential.tokenId}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-sm mb-2">Status</p>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>
            </div>

            {/* Blockchain Verification */}
            {credential.txHash && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Blockchain Transaction</p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${credential.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-700 text-sm font-mono break-all"
                >
                  {credential.txHash}
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              This credential is verified on the Ethereum blockchain (Sepolia Testnet)
            </p>
            {credential.tokenId && (
              <p className="text-center text-gray-400 text-xs mt-2">
                Verify at: {window.location.origin}/verify?tokenId={credential.tokenId}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => generateCredentialPDF(credential)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Certificate
          </button>
          <button
            onClick={() => setShowQR(true)}
            className="bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Show QR Code
          </button>
          <button
            onClick={() => navigate(`/verify?tokenId=${credential.tokenId}`)}
            className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verify on Blockchain
          </button>
        </div>

        {/* QR Code Modal */}
        <QRCodeModal
          credential={credential}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      </div>
    </div>
  )
}

export default Certificate

