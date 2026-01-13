import jsPDF from 'jspdf'

export const generateCredentialPDF = (credential) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 210] // A4 landscape
  })

  // Colors
  const primaryColor = [124, 58, 237] // Purple
  const secondaryColor = [59, 130, 246] // Blue
  const textColor = [31, 41, 55] // Gray-800

  // Background gradient effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(0, 0, 297, 210, 'F')
  
  // Decorative elements
  doc.setFillColor(255, 255, 255, 0.1)
  doc.circle(50, 50, 30, 'F')
  doc.circle(247, 160, 40, 'F')

  // White content area
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(20, 30, 257, 150, 5, 5, 'F')

  // Header
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text('SkillChain', 148.5, 60, { align: 'center' })

  // Certificate Title
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.setFontSize(20)
  doc.setFont('helvetica', 'normal')
  doc.text('Certificate of Achievement', 148.5, 75, { align: 'center' })

  // This certifies
  doc.setFontSize(12)
  doc.text('This is to certify that', 148.5, 95, { align: 'center' })

  // Skill Name
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(credential.skillName, 148.5, 115, { align: 'center', maxWidth: 240 })

  // Score
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(textColor[0], textColor[1], textColor[2])
  doc.text('has been successfully completed with a score of', 148.5, 130, { align: 'center' })
  
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  doc.text(`${credential.skillScore}/100`, 148.5, 145, { align: 'center' })

  // Details section
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  
  const detailsY = 160
  let currentY = detailsY

  if (credential.tokenId) {
    doc.text(`Token ID: ${credential.tokenId}`, 30, currentY)
    currentY += 8
  }

  if (credential.timestamp) {
    const date = new Date(credential.timestamp)
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.text(`Issued: ${formattedDate}`, 30, currentY)
    currentY += 8
  }

  if (credential.txHash) {
    const shortHash = credential.txHash.substring(0, 20) + '...'
    doc.text(`Transaction: ${shortHash}`, 30, currentY)
    currentY += 8
  }

  // Verification note
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text('This credential is verified on the Ethereum blockchain', 148.5, 190, { align: 'center' })
  
  if (credential.tokenId) {
    const verifyUrl = `${window.location.origin}/verify?tokenId=${credential.tokenId}`
    doc.text(`Verify at: ${verifyUrl}`, 148.5, 198, { align: 'center' })
  }

  // Border
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.setLineWidth(0.5)
  doc.roundedRect(20, 30, 257, 150, 5, 5, 'S')

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('SkillChain - Blockchain-Verified Skill Credentials', 148.5, 205, { align: 'center' })

  // Generate filename
  const filename = `SkillChain-Credential-${credential.skillName.replace(/\s+/g, '-')}-${credential.tokenId || 'cert'}.pdf`
  
  // Save PDF
  doc.save(filename)
}

