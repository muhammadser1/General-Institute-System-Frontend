import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export table as image to PDF (supports Arabic text)
 * @param {HTMLElement} tableElement - The table DOM element to capture
 * @param {string} title - PDF title
 * @param {string} filename - Output filename (without .pdf extension)
 */
export const exportTableAsImageToPDF = async (tableElement, title = 'Table Export', filename = 'export') => {
  try {
    console.log('Starting PDF export with image capture...')
    
    if (!tableElement) {
      throw new Error('Table element not found')
    }
    
    // Capture table as image
    const canvas = await html2canvas(tableElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    const doc = new jsPDF('p', 'mm', 'a4')
    let position = 0
    
    // Add title
    doc.setFontSize(16)
    doc.text(title, 14, 15)
    
    // Add date
    doc.setFontSize(10)
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    doc.text(`Generated on: ${currentDate}`, 14, 22)
    
    // Add image
    doc.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add new pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    const finalFilename = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(finalFilename)
    
    console.log('PDF saved:', finalFilename)
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }
}

