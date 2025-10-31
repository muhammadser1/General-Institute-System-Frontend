import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { exportStudentStatsToPDF } from '../../utils/pdfExport'
import Button from '../../components/common/Button'
import '../../styles/pages/admin/StudentStatsPage.css'

const StudentStatsPageMobile = () => {
  const { user } = useAuth()
  const [studentStats, setStudentStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchStudent, setSearchStudent] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  useEffect(() => {
    fetchStudentStats()
  }, [selectedMonth, searchStudent, filterLevel])

  const fetchStudentStats = async () => {
    setLoading(true)
    setError(null)

    const token = localStorage.getItem('access_token')

    if (!token) {
      setError('لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.')
      return
    }

    try {
      console.log(`🔍 Fetching student stats for month: ${selectedMonth}`)

      // Extract month and year from selectedMonth (format: YYYY-MM)
      const [year, month] = selectedMonth.split('-')

      // Build query parameters
      const params = new URLSearchParams({
        month: month,
        year: year
      })

      // Add search query if provided
      if (searchStudent) {
        params.append('search', searchStudent)
      }

      // Add education level filter if provided
      if (filterLevel) {
        const levelMap = {
          'ابتدائي': 'elementary',
          'إعدادي': 'middle',
          'ثانوي': 'secondary'
        }
        params.append('education_level', levelMap[filterLevel] || filterLevel)
      }

      const response = await fetch(`http://127.0.0.1:8000/api/v1/dashboard/stats/students-detailed?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      console.log('✅ Student Stats API Response (Mobile):', data)

      if (!response.ok) {
        if (response.status === 404) {
          console.log('📝 No data found for the selected month, showing empty state')
          setStudentStats([])
          return
        }
        throw new Error(data.detail || 'Error fetching student statistics')
      }

      // Transform API data to match our component structure
      const transformedStudents = (data.students || []).map(student => ({
        student_id: student.student_id,
        student_name: student.student_name,
        total_individual_hours: student.individual_hours || 0,
        total_group_hours: student.group_hours || 0,
        total_hours: student.total_hours || 0,
        education_level: student.education_level === 'elementary' ? 'ابتدائي' :
                        student.education_level === 'middle' ? 'إعدادي' :
                        student.education_level === 'secondary' ? 'ثانوي' : student.education_level
      }))

      setStudentStats(transformedStudents)
      console.log('📊 Student Stats Data (Mobile):', transformedStudents)
      console.log('📈 Total Students (Mobile):', transformedStudents.length)
    } catch (error) {
      console.error('❌ Error fetching student statistics:', error)
      setError('حدث خطأ أثناء جلب إحصائيات الطلاب.')
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = studentStats.filter((student) => {
    const matchesSearch = student.student_name?.toLowerCase().includes(searchStudent.toLowerCase())
    const matchesLevel = !filterLevel || student.education_level === filterLevel
    return matchesSearch && matchesLevel
  })

  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1 className="title">نظرة عامة على النظام</h1>
        {filteredStudents.length > 0 && (
          <Button
            onClick={async () => {
              try {
                await exportStudentStatsToPDF(filteredStudents, selectedMonth)
              } catch (error) {
                console.error('PDF export error:', error)
                alert('فشل تصدير PDF: ' + error.message)
              }
            }}
            variant="secondary"
            size="small"
            style={{ marginLeft: 'auto' }}
          >
            📄 PDF
          </Button>
        )}
      </header>

      <div className="filter-section">
        <label htmlFor="month">اختر الشهر:</label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="filter-input"
        />

        <input
          type="text"
          placeholder="بحث باسم الطالب"
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
          className="filter-input"
        />

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="filter-input"
        >
          <option value="">جميع المستويات</option>
          <option value="ابتدائي">ابتدائي</option>
          <option value="إعدادي">إعدادي</option>
          <option value="ثانوي">ثانوي</option>
        </select>
      </div>

      {/* Student Statistics */}
      {loading ? (
        <p>جارٍ تحميل إحصائيات الطلاب...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="stats-section">
          <h2>إحصائيات الطلاب</h2>
          <div className="students-cards-mobile">
            {filteredStudents.length === 0 ? (
              <p>لا توجد بيانات متاحة</p>
            ) : (
              filteredStudents.map((student, index) => (
                <div key={student.student_id || index} className="student-card-mobile">
                  <div className="student-header-mobile">
                    <h3 className="student-name">{student.student_name}</h3>
                    <p className="education-level">{student.education_level}</p>
                  </div>
                  
                  <div className="student-totals-mobile">
                    <div className="total-item individual">
                      <span className="total-label">ساعات الدروس الفردية</span>
                      <span className="total-value">{student.total_individual_hours}</span>
                    </div>
                    <div className="total-item group">
                      <span className="total-label">ساعات دروس المجموعات</span>
                      <span className="total-value">{student.total_group_hours}</span>
                    </div>
                    <div className="total-item total">
                      <span className="total-label">إجمالي الساعات</span>
                      <span className="total-value">{student.total_hours || (student.total_individual_hours + student.total_group_hours)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentStatsPageMobile
