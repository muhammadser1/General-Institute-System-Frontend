import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { lessonService } from '../../services/lessonService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import '../../styles/pages/lessons/LessonsPage.css'

const LessonsPageMobile = () => {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalError, setModalError] = useState('')
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)

  // Fetch lessons
  const fetchLessons = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await lessonService.getMyLessons()
      setLessons(response.lessons || [])
    } catch (err) {
      console.error('Error fetching lessons:', err)
      setError(err.response?.data?.detail || 'فشل تحميل الدروس')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    if (statusFilter === 'all' && typeFilter === 'all' && monthFilter === 'all' && yearFilter === 'all') return true
    
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter
    const matchesType = typeFilter === 'all' || lesson.lesson_type === typeFilter
    
    const matchesDate = (() => {
      if (monthFilter === 'all' && yearFilter === 'all') return true
      
      const lessonDate = new Date(lesson.scheduled_date)
      const lessonMonth = lessonDate.getMonth() + 1 // 1-12
      const lessonYear = lessonDate.getFullYear()
      
      const matchesMonth = monthFilter === 'all' || parseInt(monthFilter) === lessonMonth
      const matchesYear = yearFilter === 'all' || parseInt(yearFilter) === lessonYear
      
      return matchesMonth && matchesYear
    })()
    
    return matchesStatus && matchesType && matchesDate
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, typeFilter, monthFilter, yearFilter])

  // Handle delete lesson
  const handleDelete = async () => {
    setError('')
    try {
      await lessonService.deleteLesson(selectedLesson.id)
      setSuccess('تم حذف الدرس بنجاح')
      setShowDeleteModal(false)
      setSelectedLesson(null)
      fetchLessons()
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل حذف الدرس')
    }
  }

  // Open delete modal
  const openDeleteModal = (lesson) => {
    setSelectedLesson(lesson)
    setShowDeleteModal(true)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    return `${day}/${month}/${year}`
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge status-pending'
      case 'approved': return 'status-badge status-approved'
      case 'rejected': return 'status-badge status-rejected'
      case 'completed': return 'status-badge status-completed'
      case 'cancelled': return 'status-badge status-cancelled'
      default: return 'status-badge'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'معلق'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'completed': return 'مكتمل'
      case 'cancelled': return 'ملغي'
      default: return status
    }
  }

  return (
    <div className="lessons-page lessons-page-mobile">
      <div className="page-header">
        <h1 className="page-title">دروسي</h1>
        <Button onClick={() => window.location.href = '/lessons/create'}>
          + إنشاء
        </Button>
      </div>

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Filters */}
      <div className="lessons-filters">
        <div className="status-filter-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">معلق</option>
            <option value="approved">موافق عليه</option>
            <option value="rejected">مرفوض</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
        <div className="status-filter-container">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">جميع الأنواع</option>
            <option value="individual">فردي</option>
            <option value="group">جماعي</option>
          </select>
        </div>
        <div className="date-filters-container">
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
      </div>

      {/* Lessons Cards */}
      <div className="lessons-cards-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : paginatedLessons.length === 0 ? (
          <div className="empty-state">
            لا توجد دروس
          </div>
        ) : (
          paginatedLessons.map((lesson) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lesson-card-header">
                <span className={getStatusBadgeClass(lesson.status)}>
                  {getStatusText(lesson.status)}
                </span>
              </div>
              <div className="lesson-card-body">
                <div className="lesson-item">
                  <span className="lesson-label">التاريخ:</span>
                  <span className="lesson-value">{lesson.scheduled_date ? formatDate(lesson.scheduled_date) : '-'}</span>
                </div>
                <div className="lesson-item">
                  <span className="lesson-label">الطلاب:</span>
                  <span className="lesson-value">
                    {lesson.students && lesson.students.length > 0 
                      ? lesson.students.map(s => s.student_name).join(', ')
                      : '-'
                    }
                  </span>
                </div>
                <div className="lesson-item">
                  <span className="lesson-label">المادة:</span>
                  <span className="lesson-value">{lesson.subject || '-'}</span>
                </div>
              <div className="lesson-item">
                <span className="lesson-label">النوع:</span>
                <span className="lesson-value">{lesson.lesson_type === 'group' ? 'جماعي' : 'فردي'}</span>
              </div>
              <div className="lesson-item">
                <span className="lesson-label">المستوى:</span>
                <span className="lesson-value">{
                  lesson.education_level === 'elementary' ? 'ابتدائي' :
                  lesson.education_level === 'middle' ? 'إعدادي' :
                  lesson.education_level === 'secondary' ? 'ثانوي' : (lesson.education_level || '-')
                }</span>
              </div>
                <div className="lesson-item">
                  <span className="lesson-label">المدة:</span>
                  <span className="lesson-value">{lesson.duration_minutes ? `${(lesson.duration_minutes / 60).toFixed(2)} ساعة` : '-'}</span>
                </div>
              </div>
              <div className="lesson-card-actions">
                {lesson.status === 'pending' ? (
                  <>
                    <button
                      className="action-btn action-btn-edit"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        navigate(`/lessons/${lesson.id}`)
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openDeleteModal(lesson)
                      }}
                    >
                      حذف
                    </button>
                  </>
                ) : (
                  <span className="no-actions-text">-</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            السابق
          </button>
          <span className="pagination-info">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            التالي
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedLesson(null) }} title="تأكيد الحذف">
        <div className="delete-confirmation">
          <p>هل أنت متأكد من حذف الدرس <strong>{selectedLesson?.title}</strong>؟</p>
          <p className="warning-text">لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowDeleteModal(false); setSelectedLesson(null) }}>
              إلغاء
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete}>
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LessonsPageMobile

