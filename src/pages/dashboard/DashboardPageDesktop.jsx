import { useState, useEffect } from 'react'
import { lessonService } from '../../services/lessonService'
import { studentService } from '../../services/studentService'
import { useAddStudent } from '../../contexts/AddStudentContext'
import Alert from '../../components/common/Alert'
import Loading from '../../components/common/Loading'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import '../../styles/pages/dashboard/DashboardPage.css'

const DashboardPageDesktop = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [summary, setSummary] = useState(null)
  const [monthFilter, setMonthFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString())
  
  // Add Student Modal
  const { showAddStudentModal, setShowAddStudentModal } = useAddStudent()
  const [modalError, setModalError] = useState('')
  const [studentFormData, setStudentFormData] = useState({
    full_name: '',
    education_level: 'middle',
    notes: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [monthFilter, yearFilter])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch filtered lessons to calculate stats
      const filters = {}
      if (monthFilter !== 'all') {
        filters.month = parseInt(monthFilter)
      }
      if (yearFilter && yearFilter !== 'all') {
        filters.year = parseInt(yearFilter)
      }
      
      const lessonsData = await lessonService.getMyLessons(filters)
      const lessons = lessonsData.lessons || []
      
      // Calculate stats from filtered lessons
      const stats = calculateStats(lessons)
      setSummary(stats)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.response?.data?.detail || 'فشل تحميل بيانات لوحة التحكم')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (lessons) => {
    const overall = {
      total_lessons: lessons.length,
      total_hours: 0,
      individual_lessons: 0,
      individual_hours: 0,
      group_lessons: 0,
      group_hours: 0
    }

    const bySubject = {}
    const byLevel = {
      individual: { elementary: { lessons: 0, hours: 0 }, middle: { lessons: 0, hours: 0 }, secondary: { lessons: 0, hours: 0 } },
      group: { elementary: { lessons: 0, hours: 0 }, middle: { lessons: 0, hours: 0 }, secondary: { lessons: 0, hours: 0 } }
    }

    lessons.forEach(lesson => {
      const hours = lesson.duration_minutes / 60
      overall.total_hours += hours

      if (lesson.lesson_type === 'individual') {
        overall.individual_lessons++
        overall.individual_hours += hours
        if (byLevel.individual[lesson.education_level]) {
          byLevel.individual[lesson.education_level].lessons++
          byLevel.individual[lesson.education_level].hours += hours
        }
      } else {
        overall.group_lessons++
        overall.group_hours += hours
        if (byLevel.group[lesson.education_level]) {
          byLevel.group[lesson.education_level].lessons++
          byLevel.group[lesson.education_level].hours += hours
        }
      }

      // Group by subject
      if (!bySubject[lesson.subject]) {
        bySubject[lesson.subject] = {
          total_lessons: 0,
          total_hours: 0,
          individual: { lessons: 0, hours: 0 },
          group: { lessons: 0, hours: 0 }
        }
      }

      bySubject[lesson.subject].total_lessons++
      bySubject[lesson.subject].total_hours += hours

      if (lesson.lesson_type === 'individual') {
        bySubject[lesson.subject].individual.lessons++
        bySubject[lesson.subject].individual.hours += hours
      } else {
        bySubject[lesson.subject].group.lessons++
        bySubject[lesson.subject].group.hours += hours
      }
    })

    return {
      overall: {
        total_lessons: overall.total_lessons,
        total_hours: parseFloat(overall.total_hours.toFixed(2)),
        individual_lessons: overall.individual_lessons,
        individual_hours: parseFloat(overall.individual_hours.toFixed(2)),
        group_lessons: overall.group_lessons,
        group_hours: parseFloat(overall.group_hours.toFixed(2))
      },
      by_subject: bySubject,
      by_level: byLevel
    }
  }

  // Handle create student
  const handleCreateStudent = async (e) => {
    e.preventDefault()
    setModalError('')
    try {
      await studentService.createStudent(studentFormData)
      setSuccess('تم إضافة الطالب بنجاح')
      setShowAddStudentModal(false)
      resetStudentForm()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل إضافة الطالب'
      
      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    }
  }

  // Reset student form
  const resetStudentForm = () => {
    setStudentFormData({
      full_name: '',
      education_level: 'middle',
      notes: ''
    })
    setModalError('')
  }

  if (loading) {
    return (
      <div className="dashboard-page dashboard-page-desktop">
        <Loading />
      </div>
    )
  }

  const overall = summary?.overall || {}
  const bySubject = summary?.by_subject || {}
  const byLevel = summary?.by_level || {}

  return (
    <div className="dashboard-page dashboard-page-desktop">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">لوحة التحكم</h1>
          <p className="dashboard-subtitle">نظرة عامة على دروسك وإحصائياتك</p>
        </div>
        <Button onClick={() => { resetStudentForm(); setShowAddStudentModal(true) }}>
          + إضافة طالب جديد
        </Button>
      </div>

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Month and Year Filters */}
      <div className="dashboard-filters">
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="month-filter"
        >
          <option value="all">جميع الشهور</option>
          <option value="1">يناير</option>
          <option value="2">فبراير</option>
          <option value="3">مارس</option>
          <option value="4">أبريل</option>
          <option value="5">مايو</option>
          <option value="6">يونيو</option>
          <option value="7">يوليو</option>
          <option value="8">أغسطس</option>
          <option value="9">سبتمبر</option>
          <option value="10">أكتوبر</option>
          <option value="11">نوفمبر</option>
          <option value="12">ديسمبر</option>
        </select>
        
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="year-filter"
        >
          <option value="all">جميع السنوات</option>
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - 2 + i
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </select>
      </div>

      {/* Overall Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">إجمالي الدروس</div>
          <div className="stat-value">{overall.total_lessons || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">إجمالي الساعات</div>
          <div className="stat-value">{overall.total_hours?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">دروس فردية</div>
          <div className="stat-value">
            {overall.individual_lessons || 0}({overall.individual_hours?.toFixed(2) || '0.00'} ساعة)
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">دروس جماعية</div>
          <div className="stat-value">
            {overall.group_lessons || 0}({overall.group_hours?.toFixed(2) || '0.00'} ساعة)
          </div>
        </div>
      </div>

      {/* Stats by Subject */}
      <div className="dashboard-section">
        <h2 className="section-title">الإحصائيات حسب المادة</h2>
        {Object.keys(bySubject).length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
            لا توجد إحصائيات متاحة
          </p>
        ) : (
          <div className="subject-stats-list">
            {Object.entries(bySubject).map(([subject, stats]) => (
              <div key={subject} className="subject-stat-card">
                <h3 className="subject-name">{subject}</h3>
                <div className="subject-stats-grid">
                  <div className="subject-stat-item">
                    <span className="subject-stat-label">إجمالي الدروس:</span>
                    <span className="subject-stat-value">{stats.total_lessons || 0}</span>
                  </div>
                  <div className="subject-stat-item">
                    <span className="subject-stat-label">إجمالي الساعات:</span>
                    <span className="subject-stat-value">{stats.total_hours?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="subject-stat-item">
                    <span className="subject-stat-label">فردي:</span>
                    <span className="subject-stat-value">
                      {stats.individual?.lessons || 0} درس ({stats.individual?.hours?.toFixed(2) || '0.00'} ساعة)
                    </span>
                  </div>
                  <div className="subject-stat-item">
                    <span className="subject-stat-label">جماعي:</span>
                    <span className="subject-stat-value">
                      {stats.group?.lessons || 0} درس ({stats.group?.hours?.toFixed(2) || '0.00'} ساعة)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats by Education Level */}
      <div className="dashboard-section">
        <h2 className="section-title">حسب المستوى التعليمي</h2>
        <div className="subject-stats-list">
          {['elementary', 'middle', 'secondary'].map((lvl) => {
            const label = lvl === 'elementary' ? 'ابتدائي' : lvl === 'middle' ? 'إعدادي' : 'ثانوي'
            const ind = byLevel?.individual?.[lvl] || { lessons: 0, hours: 0 }
            const grp = byLevel?.group?.[lvl] || { lessons: 0, hours: 0 }
            return (
              <div key={lvl} className="subject-stat-card">
                <h3 className="subject-name">{label}</h3>
                <div className="subject-stats-grid">
                  <div className="subject-stat-item">
                    <span className="subject-stat-label">فردي:</span>
                    <span className="subject-stat-value">{ind.lessons} درس ({ind.hours.toFixed(2)} ساعة)</span>
                  </div>
                  <div className="subject-stat-item">
                    <span className="subject-stat-label">جماعي:</span>
                    <span className="subject-stat-value">{grp.lessons} درس ({grp.hours.toFixed(2)} ساعة)</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={showAddStudentModal} onClose={() => { setShowAddStudentModal(false); resetStudentForm() }} title="إضافة طالب جديد">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleCreateStudent} className="students-form" style={{ marginTop: '1rem' }}>
          <Input
            name="full_name"
            label="الاسم الكامل *"
            value={studentFormData.full_name}
            onChange={(e) => setStudentFormData({ ...studentFormData, full_name: e.target.value })}
            required
            placeholder="أدخل الاسم الكامل"
          />
          <Select
            name="education_level"
            label="المرحلة التعليمية"
            value={studentFormData.education_level}
            onChange={(e) => setStudentFormData({ ...studentFormData, education_level: e.target.value })}
            options={[
              { value: 'elementary', label: 'ابتدائي' },
              { value: 'middle', label: 'إعدادي' },
              { value: 'secondary', label: 'ثانوي' }
            ]}
          />
          <div className="form-group">
            <label>ملاحظات</label>
            <textarea
              name="notes"
              value={studentFormData.notes}
              onChange={(e) => setStudentFormData({ ...studentFormData, notes: e.target.value })}
              placeholder="ملاحظات خاصة..."
              rows="3"
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowAddStudentModal(false); resetStudentForm() }}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              إضافة
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

export default DashboardPageDesktop
