import { useState, useEffect } from 'react'
import { studentService } from '../../services/studentService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import '../../styles/pages/admin/StudentsManagementPage.css'

const StudentsManagementPageMobile = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalError, setModalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    education_level: 'middle',
    notes: ''
  })

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await studentService.getAllStudents()
      setStudents(response.students || [])
    } catch (err) {
      console.error('Error fetching students:', err)
      setError(err.response?.data?.detail || 'فشل تحميل الطلاب')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // Filter students by search query
  const filteredStudents = students.filter(student => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      student.full_name?.toLowerCase().includes(query) ||
      student.phone?.toLowerCase().includes(query)
    )
  })

  const isDuplicateName = (name, excludeId = null) => {
    if (!name) return false
    const normalizedName = name.trim().toLowerCase()
    return students.some(student => {
      if (!student.full_name) return false
      if (excludeId && student.id === excludeId) return false
      return student.full_name.trim().toLowerCase() === normalizedName
    })
  }

  // Handle create student
  const handleCreate = async (e) => {
    e.preventDefault()
    setModalError('')
    if (isSubmitting) return
    const trimmedName = formData.full_name.trim()

    if (!trimmedName) {
      setModalError('يرجى إدخال اسم الطالب')
      return
    }

    if (isDuplicateName(trimmedName)) {
      setModalError('اسم الطالب موجود بالفعل')
      return
    }

    setIsSubmitting(true)
    try {
      await studentService.createStudent({ ...formData, full_name: trimmedName })
      setSuccess('تم إضافة الطالب بنجاح')
      setShowCreateModal(false)
      resetForm()
      fetchStudents()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل إضافة الطالب'
      
      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit student
  const handleEdit = async (e) => {
    e.preventDefault()
    setModalError('')
    if (isSubmitting) return
    const trimmedName = formData.full_name.trim()

    if (!trimmedName) {
      setModalError('يرجى إدخال اسم الطالب')
      return
    }

    if (isDuplicateName(trimmedName, selectedStudent?.id)) {
      setModalError('اسم الطالب موجود بالفعل')
      return
    }

    setIsSubmitting(true)
    try {
      await studentService.updateStudent(selectedStudent.id, { ...formData, full_name: trimmedName })
      setSuccess('تم تحديث الطالب بنجاح')
      setShowEditModal(false)
      resetForm()
      fetchStudents()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل تحديث الطالب'
      
      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete student
  const handleDelete = async () => {
    setError('')
    try {
      await studentService.deleteStudent(selectedStudent.id)
      setSuccess('تم حذف الطالب بنجاح')
      setShowDeleteModal(false)
      setSelectedStudent(null)
      fetchStudents()
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل حذف الطالب')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      education_level: 'middle',
      notes: ''
    })
    setModalError('')
  }

  // Open edit modal
  const openEditModal = (student) => {
    setSelectedStudent(student)
    setFormData({
      full_name: student.full_name || '',
      phone: student.phone || '',
      education_level: student.education_level || 'middle',
      notes: student.notes || ''
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (student) => {
    setSelectedStudent(student)
    setShowDeleteModal(true)
  }

  return (
    <div className="students-management-page students-page-mobile">
      <div className="page-header">
        <h1 className="page-title">إدارة الطلاب</h1>
        <Button onClick={() => { resetForm(); setShowCreateModal(true) }}>
          + إضافة
        </Button>
      </div>

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Filters */}
      <div className="students-filters">
        <Input
          type="text"
          placeholder="بحث..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Students Cards */}
      <div className="students-cards-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            لا توجد نتائج
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="student-card">
              <div className="student-card-header">
                <h3 className="student-name">{student.full_name}</h3>
              </div>
              <div className="student-card-body">
                <div className="student-item">
                  <span className="student-label">الهاتف:</span>
                  <span className="student-value">{student.phone || '-'}</span>
                </div>
                {student.notes && (
                  <div className="student-item">
                    <span className="student-label">ملاحظات:</span>
                    <span className="student-value">{student.notes}</span>
                  </div>
                )}
              </div>
              <div className="student-card-actions">
                <button
                  className="action-btn action-btn-edit"
                  onClick={() => openEditModal(student)}
                >
                  تعديل
                </button>
                <button
                  className="action-btn action-btn-delete"
                  onClick={() => openDeleteModal(student)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm() }} title="إضافة طالب جديد">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleCreate} className="students-form">
          <Input
            name="full_name"
            label="الاسم الكامل *"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
            placeholder="أدخل الاسم الكامل"
          />
          <Input
            name="phone"
            label="رقم الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+966501234567"
          />
          <Select
            name="education_level"
            label="المرحلة التعليمية"
            value={formData.education_level}
            onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
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
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="ملاحظات خاصة..."
              rows="3"
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { if (!isSubmitting) { setShowCreateModal(false); resetForm() } }}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              إضافة
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); resetForm() }} title="تعديل الطالب">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleEdit} className="students-form">
          <Input
            name="full_name"
            label="الاسم الكامل *"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <Input
            name="phone"
            label="رقم الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Select
            name="education_level"
            label="المرحلة التعليمية"
            value={formData.education_level}
            onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
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
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
            />
          </div>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { if (!isSubmitting) { setShowEditModal(false); resetForm() } }}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              حفظ
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedStudent(null) }} title="تأكيد الحذف">
        <div className="delete-confirmation">
          <p>هل أنت متأكد من حذف الطالب <strong>{selectedStudent?.full_name}</strong>؟</p>
          <p className="warning-text">لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowDeleteModal(false); setSelectedStudent(null) }}>
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

export default StudentsManagementPageMobile

