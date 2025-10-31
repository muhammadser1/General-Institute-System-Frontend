import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { exportTeacherStatsToPDF } from '../../utils/pdfExport'
import api from '../../services/api'
import Button from '../../components/common/Button'
import '../../styles/pages/admin/TeacherStatsPage.css'

const TeacherStatsPageMobile = () => {
  const { user } = useAuth()
  const [teacherStats, setTeacherStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchTeacher, setSearchTeacher] = useState('')

  const abortRef = useRef()

  useEffect(() => {
    fetchTeacherStats()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [selectedMonth, searchTeacher])

  const fetchTeacherStats = async () => {
    setLoading(true)
    setError(null)

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    try {
      console.log(`🔍 Fetching teacher stats for month: ${selectedMonth}`)

      // Extract month and year from selectedMonth (format: YYYY-MM)
      const [year, month] = selectedMonth.split('-')

      const { data } = await api.get('/dashboard/stats/teachers-detailed', {
        params: {
          month,
          year,
          ...(searchTeacher ? { search: searchTeacher } : {})
        },
        signal
      })

      console.log('✅ Teacher Stats API Response:', data)

      setTeacherStats(data?.teachers || [])
      console.log('📊 Teacher Stats Data (Mobile):', data.teachers || [])
      console.log('📈 Total Teachers (Mobile):', data.teachers?.length || 0)
    } catch (error) {
      console.error('❌ Error fetching teacher statistics:', error)
      setError('حدث خطأ أثناء جلب إحصائيات المعلمين.')
    } finally {
      setLoading(false)
    }
  }

  const hasAnyHours = (teacher) => {
    const total = (teacher.total_individual_hours || 0) + (teacher.total_group_hours || 0)
    if (total > 0) return true
    const indSum = Object.values(teacher.individual_hours_by_level || {}).reduce((a, b) => a + (b || 0), 0)
    const grpSum = Object.values(teacher.group_hours_by_level || {}).reduce((a, b) => a + (b || 0), 0)
    return indSum + grpSum > 0
  }

  const filteredTeachers = teacherStats
    .filter(hasAnyHours)
    .filter((teacher) =>
      teacher.teacher_name?.toLowerCase().includes(searchTeacher.toLowerCase())
    )

  // Log teacher stats whenever they change
  useEffect(() => {
    console.log('🔄 Teacher Stats Updated (Mobile):', teacherStats)
    console.log('🔍 Filtered Teachers (Mobile):', filteredTeachers)
    console.log('🔎 Search Query (Mobile):', searchTeacher)
  }, [teacherStats, filteredTeachers, searchTeacher])

  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1 className="title">نظرة عامة على النظام</h1>
        {filteredTeachers.length > 0 && (
          <Button
            onClick={async () => {
              try {
                await exportTeacherStatsToPDF(filteredTeachers, selectedMonth)
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
          placeholder="بحث باسم المعلم"
          value={searchTeacher}
          onChange={(e) => setSearchTeacher(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Teacher Statistics */}
      {loading ? (
        <p>جارٍ تحميل إحصائيات المعلمين...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="stats-section">
          <h2>إحصائيات المعلمين</h2>
          <div className="teachers-cards-mobile">
            {filteredTeachers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>{searchTeacher ? 'لا توجد نتائج للبحث المحدد' : 'لا توجد بيانات متاحة لهذا الشهر'}</p>
              </div>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <div key={index} className="teacher-card-mobile">
                  <div className="teacher-header-mobile">
                    <h3 className="teacher-name">{teacher.teacher_name}</h3>
                  </div>
                  
                  <div className="teacher-totals-mobile">
                    <div className="total-item individual">
                      <span className="total-label">إجمالي ساعات الدروس الفردية</span>
                      <span className="total-value">{teacher.total_individual_hours}</span>
                    </div>
                    <div className="total-item group">
                      <span className="total-label">إجمالي ساعات دروس المجموعات</span>
                      <span className="total-value">{teacher.total_group_hours}</span>
                    </div>
                  </div>

                  <div className="levels-section-mobile">
                    <div className="level-section">
                      <h4>ساعات الفردي حسب المستوى</h4>
                      {Object.entries(teacher.individual_hours_by_level || {}).map(([level, hours]) => {
                        const levelNames = {
                          'elementary': 'ابتدائي',
                          'middle': 'إعدادي',
                          'secondary': 'ثانوي'
                        }
                        return hours > 0 ? (
                          <div key={`ind-${level}`} className="level-item-mobile">
                            <span className="level-icon individual">📚</span>
                            <span className="level-name">{levelNames[level] || level}:</span>
                            <span className="level-hours-value">{hours} ساعة</span>
                          </div>
                        ) : null
                      })}
                    </div>

                    <div className="level-section">
                      <h4>ساعات المجموعة حسب المستوى</h4>
                      {Object.entries(teacher.group_hours_by_level || {}).map(([level, hours]) => {
                        const levelNames = {
                          'elementary': 'ابتدائي',
                          'middle': 'إعدادي',
                          'secondary': 'ثانوي'
                        }
                        return hours > 0 ? (
                          <div key={`grp-${level}`} className="level-item-mobile">
                            <span className="level-icon group">👥</span>
                            <span className="level-name">{levelNames[level] || level}:</span>
                            <span className="level-hours-value">{hours} ساعة</span>
                          </div>
                        ) : null
                      })}
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

export default TeacherStatsPageMobile
