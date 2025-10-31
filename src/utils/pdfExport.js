import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas'

/**
 * Export table data to PDF
 * @param {Array} headers - Array of column headers
 * @param {Array} rows - Array of row data arrays
 * @param {string} title - PDF title
 * @param {string} filename - Output filename (without .pdf extension)
 */
/**
 * Check if text contains Arabic characters
 */
const hasArabicText = (text) => {
  if (!text || typeof text !== 'string') return false
  return /[\u0600-\u06FF]/.test(text)
}

/**
 * Check if headers or rows contain Arabic text
 */
const hasArabicContent = (headers, rows) => {
  const allText = [...headers, ...rows.flat()].join(' ')
  return hasArabicText(allText)
}

/**
 * Export table data to PDF
 * For Arabic text, uses image capture method. For English, uses text method.
 * @param {Array} headers - Array of column headers
 * @param {Array} rows - Array of row data arrays
 * @param {string} title - PDF title
 * @param {string} filename - Output filename (without .pdf extension)
 */
export const exportTableToPDF = async (headers, rows, title = 'Table Export', filename = 'export') => {
  try {
    console.log('Starting PDF export...', { headers, rowsCount: rows.length, title, filename })
    
    // Check if we have Arabic text
    const containsArabic = hasArabicContent(headers, rows) || hasArabicText(title)
    
    if (containsArabic) {
      console.log('Arabic text detected, using HTML table method...')
      // Create a temporary HTML table to capture
      const tempTable = document.createElement('div')
      tempTable.style.position = 'absolute'
      tempTable.style.left = '-9999px'
      tempTable.style.width = '800px'
      tempTable.style.direction = 'rtl'
      tempTable.style.fontFamily = 'Arial, "Segoe UI", sans-serif'
      tempTable.style.backgroundColor = '#ffffff'
      tempTable.style.padding = '20px'
      
      // Build HTML table
      let tableHTML = `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; margin-bottom: 10px;">${title}</h2>
          <p style="font-size: 12px; color: #666;">Generated on: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background-color: #667eea; color: white; font-weight: bold;">
      `
      
      headers.forEach(header => {
        tableHTML += `<th style="text-align: center; padding: 8px; border: 1px solid #ddd;">${header}</th>`
      })
      
      tableHTML += `
            </tr>
          </thead>
          <tbody>
      `
      
      rows.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? '#f5f7fa' : '#ffffff'
        tableHTML += `<tr style="background-color: ${bgColor};">`
        row.forEach(cell => {
          tableHTML += `<td style="text-align: center; padding: 6px; border: 1px solid #ddd;">${cell}</td>`
        })
        tableHTML += `</tr>`
      })
      
      tableHTML += `
          </tbody>
        </table>
      `
      
      tempTable.innerHTML = tableHTML
      document.body.appendChild(tempTable)
      
      try {
        // Capture as image
        const canvas = await html2canvas(tempTable, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: tempTable.offsetWidth,
          height: tempTable.offsetHeight
        })
        
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight
        
        const doc = new jsPDF('p', 'mm', 'a4')
        let position = 0
        
        // Add image
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
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
        
        // Cleanup
        document.body.removeChild(tempTable)
        
        console.log('PDF saved with Arabic support:', finalFilename)
        return true
      } catch (error) {
        document.body.removeChild(tempTable)
        throw error
      }
    } else {
      // Use text method for non-Arabic content
      console.log('No Arabic text, using text method...')
      const doc = new jsPDF()
      
      if (typeof doc.autoTable !== 'function') {
        throw new Error('autoTable plugin not loaded. Please restart the dev server and refresh the page.')
      }
      
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 35,
        styles: {
          fontSize: 9,
          cellPadding: 3,
          halign: 'center'
        },
        headStyles: {
          fillColor: [102, 126, 234],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        },
        didDrawPage: function (data) {
          if (data.pageNumber === 1) {
            doc.setFontSize(16)
            doc.text(title, 14, 20)
            
            doc.setFontSize(10)
            const currentDate = new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            doc.text(`Generated on: ${currentDate}`, 14, 26)
          }
        }
      })
      
      const finalFilename = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`
      const pdfBlob = doc.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = finalFilename
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
      
      console.log('PDF saved:', finalFilename)
      return true
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    console.error('Error stack:', error.stack)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }
}

/**
 * Export payments table to PDF
 * @param {Array} payments - Array of payment objects
 * @param {string} studentName - Optional student name for filtering
 * @param {string} month - Optional month filter
 * @param {string} year - Optional year filter
 */
export const exportPaymentsToPDF = async (payments, studentName = null, month = null, year = null) => {
  console.log('exportPaymentsToPDF called with:', { paymentsCount: payments.length, studentName, month, year })
  const headers = ['#', 'Date', 'Student Name', 'Amount', 'Notes']
  
  // Format rows
  const rows = payments.map((payment, index) => {
    const date = new Date(payment.payment_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    const amount = `$${parseFloat(payment.amount || 0).toFixed(2)}`
    const notes = payment.notes || '-'
    
    return [
      index + 1,
      date,
      payment.student_name || '-',
      amount,
      notes
    ]
  })
  
  // Generate title
  let title = 'Payments Report'
  if (studentName) {
    title = `Payments - ${studentName}`
  }
  if (month && year) {
    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' })
    title += ` (${monthName} ${year})`
  } else if (!studentName) {
    title += ' - All Payments'
  }
  
  // Generate filename
  let filename = 'payments'
  if (studentName) {
    filename += `_${studentName.replace(/\s+/g, '_')}`
  }
  if (month && year) {
    filename += `_${year}_${String(month).padStart(2, '0')}`
  }
  
  console.log('Calling exportTableToPDF with:', { headers, rowsCount: rows.length, title, filename })
  await exportTableToPDF(headers, rows, title, filename)
}

/**
 * Export teacher stats table to PDF
 * @param {Array} teachers - Array of teacher stat objects
 * @param {string} month - Selected month (YYYY-MM format)
 */
export const exportTeacherStatsToPDF = async (teachers, month = null) => {
  const headers = ['المعلم', 'إجمالي ساعات الدروس الفردية', 'إجمالي ساعات دروس المجموعات', 'ساعات الفردي حسب المستوى', 'ساعات المجموعة حسب المستوى']
  
  const rows = teachers.map((teacher) => {
    // Format individual hours by level
    const individualHours = Object.entries(teacher.individual_hours_by_level || {})
      .filter(([_, hours]) => hours > 0)
      .map(([level, hours]) => {
        const levelNames = { 'elementary': 'ابتدائي', 'middle': 'إعدادي', 'secondary': 'ثانوي' }
        return `${levelNames[level] || level}: ${hours} ساعة`
      })
      .join(', ') || '-'
    
    // Format group hours by level
    const groupHours = Object.entries(teacher.group_hours_by_level || {})
      .filter(([_, hours]) => hours > 0)
      .map(([level, hours]) => {
        const levelNames = { 'elementary': 'ابتدائي', 'middle': 'إعدادي', 'secondary': 'ثانوي' }
        return `${levelNames[level] || level}: ${hours} ساعة`
      })
      .join(', ') || '-'
    
    return [
      teacher.teacher_name || '-',
      teacher.total_individual_hours || 0,
      teacher.total_group_hours || 0,
      individualHours,
      groupHours
    ]
  })
  
  let title = 'إحصائيات المعلمين'
  let filename = 'teacher_stats'
  if (month) {
    const [year, monthNum] = month.split('-')
    const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })
    title += ` - ${monthName}`
    filename += `_${year}_${monthNum}`
  }
  
  exportTableToPDF(headers, rows, title, filename)
}

/**
 * Export student stats table to PDF
 * @param {Array} students - Array of student stat objects
 * @param {string} month - Selected month (YYYY-MM format)
 */
export const exportStudentStatsToPDF = async (students, month = null) => {
  const headers = ['الطالب', 'ساعات الدروس الفردية', 'ساعات دروس المجموعات', 'إجمالي الساعات', 'المستوى التعليمي']
  
  const rows = students.map((student) => [
    student.student_name || '-',
    student.total_individual_hours || 0,
    student.total_group_hours || 0,
    student.total_hours || (student.total_individual_hours + student.total_group_hours) || 0,
    student.education_level || '-'
  ])
  
  let title = 'إحصائيات الطلاب'
  let filename = 'student_stats'
  if (month) {
    const [year, monthNum] = month.split('-')
    const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })
    title += ` - ${monthName}`
    filename += `_${year}_${monthNum}`
  }
  
  exportTableToPDF(headers, rows, title, filename)
}

/**
 * Export lessons table to PDF
 * @param {Array} lessons - Array of lesson objects
 * @param {string} tabType - Type of tab ('all', 'pending', 'rejected')
 * @param {string} month - Selected month (YYYY-MM format)
 */
export const exportLessonsToPDF = async (lessons, tabType = 'all', month = null) => {
  const headers = ['التاريخ', 'الوقت', 'عنوان الدرس', 'المعلم', 'الطالب', 'النوع', 'المستوى', 'المدة (ساعة)', 'الحالة']
  
  const rows = lessons.map((lesson) => {
    const statusLabels = {
      'pending': 'معلق',
      'approved': 'موافق عليه',
      'completed': 'مكتمل',
      'rejected': 'مرفوض',
      'cancelled': 'ملغي'
    }
    
    return [
      lesson.date || '-',
      lesson.time || '-',
      lesson.title || '-',
      lesson.teacher_name || '-',
      lesson.student_name || '-',
      lesson.lesson_type === 'individual' ? 'فردي' : 'جماعي',
      lesson.education_level || '-',
      lesson.duration || 0,
      statusLabels[lesson.status?.toLowerCase()] || lesson.status || '-'
    ]
  })
  
  const tabLabels = {
    'all': 'جميع الدروس',
    'pending': 'الدروس المعلقة',
    'rejected': 'الدروس المرفوضة'
  }
  
  let title = tabLabels[tabType] || 'الدروس'
  let filename = `lessons_${tabType}`
  if (month) {
    const [year, monthNum] = month.split('-')
    const monthName = new Date(year, parseInt(monthNum) - 1).toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })
    title += ` - ${monthName}`
    filename += `_${year}_${monthNum}`
  }
  
  exportTableToPDF(headers, rows, title, filename)
}

/**
 * Export users table to PDF
 * @param {Array} users - Array of user objects
 */
export const exportUsersToPDF = async (users) => {
  const headers = ['الاسم', 'البريد الإلكتروني', 'الدور', 'الحالة']
  
  const rows = users.map((user) => [
    user.full_name || user.name || '-',
    user.email || '-',
    user.role === 'admin' ? 'مدير' : 'معلم',
    user.is_active !== false ? 'نشط' : 'غير نشط'
  ])
  
  const title = 'إدارة المستخدمين'
  const filename = 'users'
  
  exportTableToPDF(headers, rows, title, filename)
}

/**
 * Export students table to PDF
 * @param {Array} students - Array of student objects
 */
export const exportStudentsToPDF = async (students) => {
  const headers = ['الاسم الكامل', 'الهاتف', 'المرحلة التعليمية', 'ملاحظات']
  
  const rows = students.map((student) => [
    student.full_name || '-',
    student.phone || '-',
    student.education_level === 'elementary' ? 'ابتدائي' : 
    student.education_level === 'middle' ? 'إعدادي' : 
    student.education_level === 'secondary' ? 'ثانوي' : '-',
    student.notes ? (student.notes.length > 50 ? student.notes.substring(0, 50) + '...' : student.notes) : '-'
  ])
  
  const title = 'إدارة الطلاب'
  const filename = 'students'
  
  exportTableToPDF(headers, rows, title, filename)
}

