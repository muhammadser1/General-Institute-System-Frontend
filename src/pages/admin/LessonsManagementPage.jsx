import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { exportLessonsToPDF } from '../../utils/pdfExport'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import '../../styles/pages/admin/LessonsManagementPage.css'
import api from '../../services/api'

const LessonsManagementPage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [lessons, setLessons] = useState([])
  const [pendingLessons, setPendingLessons] = useState([])
  const [rejectedLessons, setRejectedLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [enableMonthFilter, setEnableMonthFilter] = useState(true)
  const [bulkApproving, setBulkApproving] = useState(false)

  const formatDuration = (minutes) => {
    if (minutes == null || isNaN(minutes)) return '-'
    const hrs = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    const hh = String(hrs).padStart(2, '0')
    const mm = String(mins).padStart(2, '0')
    return `${hh}:${mm}`
  }

  const abortRef = useRef()

  useEffect(() => {
    fetchLessons()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [selectedMonth, enableMonthFilter])

  const fetchLessons = async () => {
    setLoading(true)
    setError(null)

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    try {
      console.log(`🔍 Fetching lessons for month: ${selectedMonth}`)

      // Extract month and year from selectedMonth (format: YYYY-MM)
      const [year, month] = selectedMonth.split('-')

      const { data } = await api.get('/lessons/admin/all', {
        params: { skip: 0, limit: 100 },
        signal
      })
      console.log('✅ Lessons API Response (parsed JSON). Top-level keys:', Object.keys(data || {}))
      console.log('📊 Raw lessons count (supports multiple shapes):', Array.isArray(data) ? data.length : (Array.isArray(data.items) ? data.items.length : (Array.isArray(data.results) ? data.results.length : (Array.isArray(data.lessons) ? data.lessons.length : 0))))

      // Normalize lessons list from API
      const rawList = Array.isArray(data) ? data : (data.items || data.results || data.lessons || [])
      console.log('🧮 rawList length:', rawList.length)
      const apiLessonsRaw = rawList.map((l, idx) => {
        const durationMinutes = (l.duration_minutes != null ? l.duration_minutes : (l.duration_hours != null ? l.duration_hours * 60 : null))
        const scheduledDate = l.scheduled_date || l.start_time || null
        const datePart = scheduledDate ? scheduledDate.split('T')[0] : (l.date || '-')
        const timePartFromDate = scheduledDate ? (scheduledDate.split('T')[1] || '').slice(0, 5) : null
        const timeValue = timePartFromDate && timePartFromDate !== '00:00' ? timePartFromDate : formatDuration(durationMinutes)
        return ({
        id: l.id || l.lesson_id || idx,
        title: l.title || l.subject || 'درس',
        teacher_name: l.teacher_name || l.teacher || '-',
        student_name: l.student_name || l.student || (Array.isArray(l.students) ? l.students.map(s => (s?.student_name || s)).join(', ') : '-'),
        lesson_type: l.lesson_type || l.type || 'individual',
        education_level: l.education_level === 'elementary' ? 'ابتدائي' :
                         l.education_level === 'middle' ? 'إعدادي' :
                         l.education_level === 'secondary' ? 'ثانوي' : (l.education_level || '-'),
        duration: (l.duration_hours != null ? l.duration_hours : (durationMinutes != null ? durationMinutes / 60 : l.duration)) || 0,
        status: l.status || 'approved',
        date: datePart,
        time: l.time || timeValue
      })})

      console.log('🔍 Normalized lessons (first 3):', apiLessonsRaw.slice(0, 3))
      console.log('📅 Filtering for year:', year, 'month:', month)

      // Optionally filter by selected month/year on client side
      const apiLessons = enableMonthFilter
        ? apiLessonsRaw.filter((lesson) => {
            console.log('📅 Lesson date:', lesson.date, 'Expected year:', year, 'Expected month:', month)
            if (!lesson.date || lesson.date === '-') {
              console.log('❌ Lesson filtered out - no date:', lesson.title)
              return false
            }
            const [y, m] = lesson.date.split('-')
            const matches = y === year && m === month
            console.log('📅 Date parts:', y, m, 'Matches:', matches)
            return matches
          })
        : apiLessonsRaw

      console.log('📊 Filtered lessons count:', apiLessons.length)

      // Filter out cancelled lessons (case-insensitive) and separate rejected lessons
      const nonCancelledLessons = apiLessons.filter(lesson => {
        const status = (lesson.status || '').toLowerCase()
        return status !== 'cancelled'
      })

      // Separate rejected lessons
      const rejectedLessonsData = nonCancelledLessons.filter(lesson => {
        const status = (lesson.status || '').toLowerCase()
        return status === 'rejected'
      })

      // Filter out rejected lessons from main lists
      const nonRejectedLessons = nonCancelledLessons.filter(lesson => {
        const status = (lesson.status || '').toLowerCase()
        return status !== 'rejected'
      })

      const completedLessons = nonRejectedLessons.filter(lesson => {
        const status = (lesson.status || '').toLowerCase()
        return status === 'completed' || status === 'approved'
      })
      const pendingLessonsData = nonRejectedLessons.filter(lesson => {
        const status = (lesson.status || '').toLowerCase()
        return status !== 'completed' && status !== 'approved'
      })

      console.log('📊 Completed lessons:', completedLessons.length, 'Pending lessons:', pendingLessonsData.length, 'Rejected lessons:', rejectedLessonsData.length)

      setLessons(completedLessons)
      setPendingLessons(pendingLessonsData)
      setRejectedLessons(rejectedLessonsData)
    } catch (error) {
      console.error('❌ Error fetching lessons:', error)
      setError('حدث خطأ أثناء جلب بيانات الدروس.')
    } finally {
      setLoading(false)
    }
  }

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPendingLessons = pendingLessons.filter((lesson) =>
    lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredRejectedLessons = rejectedLessons.filter((lesson) =>
    lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.teacher_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const approveLesson = async (lessonId, token) => {
    const authToken = token || localStorage.getItem('access_token')
    
    if (!authToken) {
      throw new Error('لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.')
    }

    const response = await fetch(`https://general-institute-system-backend.onrender.com/api/v1/lessons/admin/approve/${lessonId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      let errorMessage = 'فشل في الموافقة على الدرس'
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorMessage
      } catch (_) {
        // ignore parse error
      }
      throw new Error(errorMessage)
    }

    const approvedLesson = pendingLessons.find(l => l.id === lessonId)
    if (approvedLesson) {
      setPendingLessons(prev => prev.filter(lesson => lesson.id !== lessonId))
      setLessons(prev => [...prev, { ...approvedLesson, status: 'approved' }])
    }
  }

  const handleApprove = async (lessonId) => {
    setError(null)
    setSuccess(null)
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      setError('لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.')
      return
    }

    try {
      console.log(`✅ Approving lesson: ${lessonId}`)
      await approveLesson(lessonId, token)
      console.log('✅ Lesson approved successfully')
      setSuccess('تمت الموافقة على الدرس بنجاح')
    } catch (error) {
      console.error('❌ Error approving lesson:', error)
      setError(error.message || 'حدث خطأ أثناء الموافقة على الدرس')
      setSuccess(null)
    }
  }

  const handleApproveAll = async () => {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      setError('لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.')
      return
    }

    if (filteredPendingLessons.length === 0) {
      return
    }

    setError(null)
    setSuccess(null)
    setBulkApproving(true)

    const lessonIds = filteredPendingLessons.map(lesson => lesson.id)
    let hasError = false

    for (const lessonId of lessonIds) {
      try {
        await approveLesson(lessonId, token)
      } catch (err) {
        hasError = true
        console.error('❌ Error approving lesson in bulk:', err)
        setError(err.message || 'حدث خطأ أثناء الموافقة على أحد الدروس')
        break
      }
    }

    if (!hasError) {
      setSuccess('تمت الموافقة على جميع الدروس المعلقة المعروضة')
    }

    setBulkApproving(false)
  }

  const handleReject = async (lessonId) => {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      setError('لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.')
      return
    }

    try {
      console.log(`❌ Rejecting lesson: ${lessonId}`)
      
      const response = await fetch(`https://general-institute-system-backend.onrender.com/api/v1/lessons/admin/reject/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'فشل في رفض الدرس')
      }

      console.log('✅ Lesson rejected successfully')
      
      // Update local state - remove from pending
      setPendingLessons(prev => prev.filter(lesson => lesson.id !== lessonId))
    } catch (error) {
      console.error('❌ Error rejecting lesson:', error)
      setError(error.message || 'حدث خطأ أثناء رفض الدرس')
    }
  }

  return (
    <div className="overview-container">
      <header className="overview-header">
        <h1 className="title">إدارة الدروس</h1>
        <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
          {activeTab === 'pending' && filteredPendingLessons.length > 0 && (
            <Button
              onClick={handleApproveAll}
              disabled={bulkApproving}
            >
              {bulkApproving ? 'جاري الموافقة...' : 'موافقة على الكل'}
            </Button>
          )}
          {activeTab === 'all' && filteredLessons.length > 0 && (
            <Button
              onClick={async () => {
                try {
                  await exportLessonsToPDF(filteredLessons, 'all', selectedMonth)
                } catch (error) {
                  console.error('PDF export error:', error)
                  alert('فشل تصدير PDF: ' + error.message)
                }
              }}
              variant="secondary"
            >
              📄 تحميل PDF
            </Button>
          )}
          {activeTab === 'pending' && filteredPendingLessons.length > 0 && (
            <Button
              onClick={async () => {
                try {
                  await exportLessonsToPDF(filteredPendingLessons, 'pending', selectedMonth)
                } catch (error) {
                  console.error('PDF export error:', error)
                  alert('فشل تصدير PDF: ' + error.message)
                }
              }}
              variant="secondary"
            >
              📄 تحميل PDF
            </Button>
          )}
          {activeTab === 'rejected' && filteredRejectedLessons.length > 0 && (
            <Button
              onClick={async () => {
                try {
                  await exportLessonsToPDF(filteredRejectedLessons, 'rejected', selectedMonth)
                } catch (error) {
                  console.error('PDF export error:', error)
                  alert('فشل تصدير PDF: ' + error.message)
                }
              }}
              variant="secondary"
            >
              📄 تحميل PDF
            </Button>
          )}
        </div>
      </header>

      <div style={{ margin: '1rem 0' }}>
        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
      </div>

      <div className="filter-section">
        <label htmlFor="month">اختر الشهر:</label>
        <input
          type="month"
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="filter-input"
          disabled={!enableMonthFilter}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={enableMonthFilter}
            onChange={(e) => setEnableMonthFilter(e.target.checked)}
          />
          تفعيل تصفية الشهر
        </label>

        <input
          type="text"
          placeholder="بحث في الدروس..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="filter-input"
        />
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          جميع الدروس ({lessons.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          الدروس المعلقة ({pendingLessons.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          الدروس المرفوضة ({rejectedLessons.length})
        </button>
      </div>

      {/* All Lessons Tab */}
      {activeTab === 'all' && (
        <div className="stats-section">
          <h2>جميع الدروس</h2>
          {loading ? (
            <p>جارٍ تحميل الدروس...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>عنوان الدرس</th>
                    <th>المعلم</th>
                    <th>الطالب</th>
                    <th>النوع</th>
                    <th>المستوى</th>
                    <th>المدة (ساعة)</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLessons.length === 0 ? (
                    <tr><td colSpan="9">لا توجد دروس متاحة</td></tr>
                  ) : (
                    filteredLessons.map((lesson) => {
                      const statusLabel = lesson.status === 'completed' ? 'مكتمل' : (lesson.status === 'approved' ? 'معتمد' : 'معلق')
                      const statusClass = lesson.status === 'approved' ? 'completed' : lesson.status
                      return (
                      <tr key={lesson.id}>
                        <td>{lesson.date}</td>
                        <td>{lesson.time}</td>
                        <td>{lesson.title}</td>
                        <td>{lesson.teacher_name}</td>
                        <td>{lesson.student_name}</td>
                        <td>{lesson.lesson_type === 'individual' ? 'فردي' : 'جماعي'}</td>
                        <td>{lesson.education_level}</td>
                        <td>{lesson.duration}</td>
                        <td>
                          <span className={`status-badge ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    )})
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pending Lessons Tab */}
      {activeTab === 'pending' && (
        <div className="stats-section">
          <h2>الدروس المعلقة</h2>
          {loading ? (
            <p>جارٍ تحميل الدروس المعلقة...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>عنوان الدرس</th>
                    <th>المعلم</th>
                    <th>الطالب</th>
                    <th>النوع</th>
                    <th>المستوى</th>
                    <th>المدة (ساعة)</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPendingLessons.length === 0 ? (
                    <tr><td colSpan="9">لا توجد دروس معلقة</td></tr>
                  ) : (
                    filteredPendingLessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td>{lesson.date}</td>
                        <td>{lesson.time}</td>
                        <td>{lesson.title}</td>
                        <td>{lesson.teacher_name}</td>
                        <td>{lesson.student_name}</td>
                        <td>{lesson.lesson_type === 'individual' ? 'فردي' : 'جماعي'}</td>
                        <td>{lesson.education_level}</td>
                        <td>{lesson.duration}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn approve-btn"
                              onClick={() => handleApprove(lesson.id)}
                            >
                              موافقة
                            </button>
                            <button
                              className="action-btn reject-btn"
                              onClick={() => handleReject(lesson.id)}
                            >
                              رفض
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Rejected Lessons Tab */}
      {activeTab === 'rejected' && (
        <div className="stats-section">
          <h2>الدروس المرفوضة</h2>
          {loading ? (
            <p>جارٍ تحميل الدروس المرفوضة...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="table-wrapper">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>التاريخ</th>
                    <th>الوقت</th>
                    <th>عنوان الدرس</th>
                    <th>المعلم</th>
                    <th>الطالب</th>
                    <th>النوع</th>
                    <th>المستوى</th>
                    <th>المدة (ساعة)</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRejectedLessons.length === 0 ? (
                    <tr><td colSpan="9">لا توجد دروس مرفوضة</td></tr>
                  ) : (
                    filteredRejectedLessons.map((lesson) => {
                      const statusLabel = 'مرفوض'
                      const statusClass = 'rejected'
                      return (
                        <tr key={lesson.id}>
                          <td>{lesson.date}</td>
                          <td>{lesson.time}</td>
                          <td>{lesson.title}</td>
                          <td>{lesson.teacher_name}</td>
                          <td>{lesson.student_name}</td>
                          <td>{lesson.lesson_type === 'individual' ? 'فردي' : 'جماعي'}</td>
                          <td>{lesson.education_level}</td>
                          <td>{lesson.duration}</td>
                          <td>
                            <span className={`status-badge ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LessonsManagementPage
