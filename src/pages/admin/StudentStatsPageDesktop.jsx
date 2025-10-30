import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/pages/admin/StudentStatsPage.css'

const StudentStatsPageDesktop = () => {
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

      console.log('✅ Student Stats API Response:', data)

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
      console.log('📊 Student Stats Data:', transformedStudents)
      console.log('📈 Total Students:', transformedStudents.length)
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
          <div className="table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>المستوى التعليمي</th>
                  <th>إجمالي الساعات</th>
                  <th>ساعات دروس المجموعات</th>
                  <th>ساعات الدروس الفردية</th>
                  <th>الطالب</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="5">لا توجد بيانات متاحة</td></tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.student_id || index}>
                      <td>{student.education_level}</td>
                      <td>{student.total_hours || (student.total_individual_hours + student.total_group_hours)}</td>
                      <td>{student.total_group_hours}</td>
                      <td>{student.total_individual_hours}</td>
                      <td>{student.student_name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentStatsPageDesktop
