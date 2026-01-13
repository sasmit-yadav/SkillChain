import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

const QRCodeModal = ({ credential, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  // Generate verification URL
  const verificationUrl = credential.tokenId
    ? `${window.location.origin}/verify?tokenId=${credential.tokenId}`
    : credential.txHash
    ? `${window.location.origin}/verify?txHash=${credential.txHash}`
    : `${window.location.origin}/verify`

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const svg = document.getElementById('credential-qr-code')
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `skillchain-credential-${credential.tokenId || 'qr'}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Credential QR Code</h3>
            <p className="text-gray-500 text-sm mt-1">Scan to verify on blockchain</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Credential Info */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-1">{credential.skillName}</h4>
            <p className="text-sm text-gray-600">Score: {credential.skillScore}/100</p>
            {credential.tokenId && (
              <p className="text-xs text-gray-500 font-mono mt-1">Token ID: {credential.tokenId}</p>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-purple-100">
            <QRCodeSVG
              id="credential-qr-code"
              value={verificationUrl}
              size={200}
              level="H"
              includeMargin={true}
              fgColor="#7c3aed"
              bgColor="#ffffff"
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Scan this QR code to verify this credential on the blockchain
          </p>
        </div>

        {/* Verification URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Verification Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={verificationUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDownloadQR}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default QRCodeModal

