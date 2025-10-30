import { useState, useEffect } from 'react'
import { lessonService } from '../../services/lessonService'
import Alert from '../../components/common/Alert'
import Loading from '../../components/common/Loading'
import '../../styles/pages/dashboard/DashboardPage.css'

const DashboardPageDesktop = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)
  const [monthFilter, setMonthFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString())

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
        <h1 className="dashboard-title">لوحة التحكم</h1>
        <p className="dashboard-subtitle">نظرة عامة على دروسك وإحصائياتك</p>
      </div>

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

    </div>
  )
}

export default DashboardPageDesktop
