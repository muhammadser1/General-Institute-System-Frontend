import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { lessonService } from '../../services/lessonService'
import { adminService } from '../../services/adminService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import '../../styles/pages/lessons/LessonsPage.css'

const LessonsPageDesktop = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  
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
  const [teacherFilter, setTeacherFilter] = useState('all')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)

  // Fetch lessons (for admin with API filters, for teachers without)
  const fetchLessons = async () => {
    setLoading(true)
    setError('')
    try {
      if (isAdmin) {
        // Admin: Use admin API with server-side filtering
        const filters = {}
        if (statusFilter !== 'all') filters.status = statusFilter
        if (teacherFilter !== 'all') filters.teacher_id = teacherFilter
        if (monthFilter !== 'all') filters.month = parseInt(monthFilter)
        if (yearFilter !== 'all') filters.year = parseInt(yearFilter)
        
        const response = await adminService.getAdminLessons(filters)
        setLessons(response.lessons || [])
      } else {
        // Teacher: Use regular API
        const response = await lessonService.getMyLessons()
        setLessons(response.lessons || [])
      }
    } catch (err) {
      console.error('Error fetching lessons:', err)
      setError(err.response?.data?.detail || 'فشل تحميل الدروس')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLessons()
  }, [isAdmin])

  // Re-fetch when filters change (for admin only, as they use server-side filtering)
  useEffect(() => {
    if (isAdmin) {
      fetchLessons()
      setCurrentPage(1)
    }
  }, [statusFilter, teacherFilter, monthFilter, yearFilter, isAdmin])

  // Filter lessons (client-side for teachers, server-side for admins)
  const filteredLessons = isAdmin ? lessons : lessons.filter(lesson => {
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

  // Reset to page 1 when filters change (for teachers using client-side filtering)
  useEffect(() => {
    if (!isAdmin) {
      setCurrentPage(1)
    }
  }, [statusFilter, typeFilter, monthFilter, yearFilter, isAdmin])

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
      case 'completed': return 'status-badge status-completed'
      case 'cancelled': return 'status-badge status-cancelled'
      case 'approved': return 'status-badge status-approved'
      case 'rejected': return 'status-badge status-rejected'
      default: return 'status-badge'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'معلق'
      case 'completed': return 'مكتمل'
      case 'cancelled': return 'ملغي'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      default: return status
    }
  }

  // Handle approve lesson (admin only)
  const handleApprove = async (lessonId) => {
    setError('')
    try {
      await adminService.approveLesson(lessonId)
      setSuccess('تم الموافقة على الدرس بنجاح')
      fetchLessons()
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل الموافقة على الدرس')
    }
  }

  // Handle reject lesson (admin only)
  const handleReject = async (lessonId) => {
    setError('')
    try {
      await adminService.rejectLesson(lessonId)
      setSuccess('تم رفض الدرس بنجاح')
      fetchLessons()
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل رفض الدرس')
    }
  }

  return (
    <div className="lessons-page lessons-page-desktop">
      <div className="page-header">
        <h1 className="page-title">{isAdmin ? 'جميع الدروس' : 'دروسي'}</h1>
        {!isAdmin && (
          <Button onClick={() => window.location.href = '/lessons/create'}>
            + إنشاء درس جديد
          </Button>
        )}
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
            {isAdmin && <option value="approved">موافق عليه</option>}
            {isAdmin && <option value="rejected">مرفوض</option>}
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
        {isAdmin && (
          <div className="status-filter-container">
            <input
              type="text"
              placeholder="معرف المدرس (teacher_id)"
              value={teacherFilter === 'all' ? '' : teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value || 'all')}
              className="teacher-filter-input"
            />
          </div>
        )}
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

      {/* Lessons Table */}
      <div className="lessons-table-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <table className="lessons-table">
            <thead>
              <tr>
                {isAdmin && <th>المدرس</th>}
                <th>التاريخ</th>
                <th>الطلاب</th>
                <th>المادة</th>
                <th>النوع</th>
                <th>المستوى</th>
                <th>المدة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLessons.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '2rem' }}>
                    لا توجد دروس
                  </td>
                </tr>
              ) : (
                paginatedLessons.map((lesson) => (
                  <tr key={lesson.id}>
                    {isAdmin && <td>{lesson.teacher_name || '-'}</td>}
                    <td>{lesson.scheduled_date ? formatDate(lesson.scheduled_date) : '-'}</td>
                    <td>
                      {lesson.students && lesson.students.length > 0 
                        ? lesson.students.map(s => s.student_name).join(', ')
                        : '-'
                      }
                    </td>
                    <td>{lesson.subject || '-'}
                    </td>
                    <td>{lesson.lesson_type === 'group' ? 'جماعي' : 'فردي'}</td>
                    <td>{
                      lesson.education_level === 'elementary' ? 'ابتدائي' :
                      lesson.education_level === 'middle' ? 'إعدادي' :
                      lesson.education_level === 'secondary' ? 'ثانوي' : (lesson.education_level || '-')
                    }</td>
                    <td>{lesson.duration_minutes ? `${(lesson.duration_minutes / 60).toFixed(2)} ساعة` : '-'}</td>
                    <td>
                      <span className={getStatusBadgeClass(lesson.status)}>
                        {getStatusText(lesson.status)}
                      </span>
                    </td>
                    <td>
                      <div className="lessons-actions">
                        {isAdmin && lesson.status === 'pending' ? (
                          <>
                            <button
                              className="action-btn action-btn-approve"
                              onClick={() => handleApprove(lesson.id)}
                            >
                              موافقة
                            </button>
                            <button
                              className="action-btn action-btn-reject"
                              onClick={() => handleReject(lesson.id)}
                            >
                              رفض
                            </button>
                          </>
                        ) : !isAdmin && lesson.status === 'pending' ? (
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

export default LessonsPageDesktop
