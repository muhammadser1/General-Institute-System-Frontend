import { useState, useEffect } from 'react'
import { lessonService } from '../../services/lessonService'
import { studentService } from '../../services/studentService'
import { pricingService } from '../../services/pricingService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import SearchableSelect from '../../components/common/SearchableSelect'
import '../../styles/pages/lessons/CreateLessonPage.css'

const CreateLessonPageMobile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // API data
  const [allStudents, setAllStudents] = useState([]) // Store all students with education_level
  const [availableStudents, setAvailableStudents] = useState([]) // Filtered students
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Form data
  const [formData, setFormData] = useState({
    title: 'درس جديد',
    description: 'درس تعليمي',
    lesson_type: 'individual',
    subject: '',
    education_level: 'elementary',
    scheduled_date: getTodayDate(),
    duration_minutes: 60,
    max_students: 1,
    students: [],
    notes: '',
    homework: ''
  })

  // Fetch students and subjects on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true)
      try {
        // Fetch students
        const studentsResponse = await studentService.getAllStudents({ include_inactive: false })
        const students = studentsResponse.students || []
        const mappedStudents = students.map(s => ({
          id: s.id,
          name: s.full_name,
          email: s.email || '',
          education_level: s.education_level || null
        }))
        setAllStudents(mappedStudents)
        // Initially show all students
        setAvailableStudents(mappedStudents)

        // Fetch pricing to get subjects
        const pricingResponse = await pricingService.getAllPricing({ include_inactive: false })
        const pricing = pricingResponse.pricing || []
        // Extract unique subjects (now subjects are stored as labels in Arabic)
        const uniqueSubjects = [...new Set(pricing.map(p => p.subject))].filter(Boolean)
        setAvailableSubjects(uniqueSubjects)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('فشل تحميل البيانات')
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Validate that at least one student is selected
      const validStudents = formData.students.filter(s => s.student_id && s.student_name.trim() !== '')
      const uniqueStudentIds = new Set(validStudents.map(s => s.student_id))
      
      if (uniqueStudentIds.size !== validStudents.length) {
        setError('لا يمكن إضافة نفس الطالب أكثر من مرة')
        setLoading(false)
        return
      }
      
      if (formData.lesson_type === 'group' && validStudents.length < 2) {
        setError('يجب اختيار طالبين على الأقل للدروس الجماعية')
        setLoading(false)
        return
      }
      
      if (formData.lesson_type === 'individual') {
        if (validStudents.length !== 1) {
          setError('يجب اختيار طالب واحد فقط للدروس الفردية')
          setLoading(false)
          return
        }
        if (formData.students.length > 1) {
          setError('لا يمكن إضافة أكثر من طالب واحد في الدروس الفردية')
          setLoading(false)
          return
        }
      }
      
      if (validStudents.length === 0) {
        setError('يجب اختيار طالب واحد على الأقل')
        setLoading(false)
        return
      }

      // Prepare data according to backend API expectations
      const lessonData = {
        subject: formData.subject,
        education_level: formData.education_level,
        lesson_type: formData.lesson_type,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        duration_minutes: parseInt(formData.duration_minutes),
        max_students: formData.lesson_type === 'individual' ? 1 : parseInt(formData.max_students),
        students: validStudents.map(s => ({
          student_name: s.student_name,
          student_email: s.student_email || ''
        }))
      }
      
      console.log('Sending lesson data:', lessonData)
      await lessonService.submitLesson(lessonData)
      setSuccess('تم إنشاء الدرس بنجاح')
      // Reset form
      setFormData({
        title: 'درس جديد',
        description: 'درس تعليمي',
        lesson_type: 'individual',
        subject: '',
        education_level: 'elementary',
        scheduled_date: getTodayDate(),
        duration_minutes: 60,
        max_students: 1,
        students: [],
        notes: '',
        homework: ''
      })
    } catch (err) {
      console.error('Lesson creation error:', err)
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل إنشاء الدرس'
      
      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Filter students based on education level
  useEffect(() => {
    if (formData.education_level) {
      const filtered = allStudents.filter(s => 
        !s.education_level || s.education_level === formData.education_level
      )
      setAvailableStudents(filtered)
    } else {
      setAvailableStudents(allStudents)
    }
  }, [formData.education_level, allStudents])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      }
      
      // Auto-update max_students based on lesson type
      if (name === 'lesson_type') {
        if (value === 'individual') {
          newData.max_students = 1
        } else if (value === 'group') {
          newData.max_students = prev.students.length || 1
        }
      }
      
      return newData
    })
  }

  // Handle student addition
  const addStudent = () => {
    setFormData(prev => {
      const newStudents = [...prev.students, { student_id: '', student_name: '', student_email: '' }]
      return {
        ...prev,
        students: newStudents,
        // Update max_students for group lessons
        max_students: prev.lesson_type === 'group' ? newStudents.length : prev.max_students
      }
    })
  }

  // Handle student removal
  const removeStudent = (index) => {
    setFormData(prev => {
      const newStudents = prev.students.filter((_, i) => i !== index)
      return {
        ...prev,
        students: newStudents,
        // Update max_students for group lessons
        max_students: prev.lesson_type === 'group' ? newStudents.length : prev.max_students
      }
    })
  }

  // Handle student selection
  const handleStudentSelection = (index, studentId) => {
    const selectedStudent = allStudents.find(s => s.id === studentId)
    if (selectedStudent && selectedStudent.education_level) {
      // Auto-update education level to match selected student
      setFormData(prev => ({
        ...prev,
        education_level: selectedStudent.education_level,
        students: prev.students.map((student, i) => 
          i === index ? { 
            student_id: selectedStudent.id,
            student_name: selectedStudent.name,
            student_email: selectedStudent.email || ''
          } : student
        )
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        students: prev.students.map((student, i) => 
          i === index ? { 
            student_id: selectedStudent ? selectedStudent.id : '',
            student_name: selectedStudent ? selectedStudent.name : '',
            student_email: selectedStudent ? selectedStudent.email || '' : ''
          } : student
        )
      }))
    }
  }

  return (
    <div className="create-lesson-page create-lesson-page-mobile">
      <div className="page-header">
        <h1 className="page-title">إنشاء درس جديد</h1>
        <Button 
          variant="secondary" 
          onClick={() => window.location.href = '/lessons'}
        >
          العودة
        </Button>
      </div>

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      <form onSubmit={handleSubmit} className="create-lesson-form">
        <div className="form-section">
          <h2 className="section-title">معلومات الدرس</h2>
          
          <div className="form-group">
            <label>نوع الدرس *</label>
            <select
              name="lesson_type"
              value={formData.lesson_type}
              onChange={handleInputChange}
              required
            >
              <option value="individual">فردي</option>
              <option value="group">جماعي</option>
            </select>
          </div>

          <div className="form-group">
            <label>المادة *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              disabled={loadingData}
            >
              <option value="">{loadingData ? 'جاري التحميل...' : 'اختر المادة'}</option>
              {availableSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>المرحلة التعليمية *</label>
            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleInputChange}
              required
            >
              <option value="elementary">ابتدائي</option>
              <option value="middle">اعدادي</option>
              <option value="secondary">ثانوي</option>
            </select>
          </div>

          <div className="form-group">
            <label>تاريخ الدرس *</label>
            <input
              type="date"
              name="scheduled_date"
              value={formData.scheduled_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>مدة الدرس *</label>
            <select
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleInputChange}
              required
            >
              <option value="30">30 دقيقة</option>
              <option value="45">45 دقيقة</option>
              <option value="60">ساعة واحدة (60 دقيقة)</option>
              <option value="75">ساعة و 15 دقيقة (75 دقيقة)</option>
              <option value="90">ساعة ونصف (90 دقيقة)</option>
              <option value="105">ساعة و 45 دقيقة (105 دقيقة)</option>
              <option value="120">ساعتان (120 دقيقة)</option>
              <option value="135">ساعتان و 15 دقيقة (135 دقيقة)</option>
              <option value="150">ساعتان ونصف (150 دقيقة)</option>
              <option value="165">ساعتان و 45 دقيقة (165 دقيقة)</option>
              <option value="180">3 ساعات (180 دقيقة)</option>
              <option value="195">3 ساعات و 15 دقيقة (195 دقيقة)</option>
              <option value="210">3 ساعات ونصف (210 دقيقة)</option>
              <option value="225">3 ساعات و 45 دقيقة (225 دقيقة)</option>
              <option value="240">4 ساعات (240 دقيقة)</option>
            </select>
          </div>

          <div className="form-group">
            <label>الحد الأقصى للطلاب</label>
            <input
              type="number"
              name="max_students"
              value={formData.max_students}
              onChange={handleInputChange}
              min="1"
              max="50"
              disabled={formData.lesson_type === 'individual'}
              className={formData.lesson_type === 'individual' ? 'disabled-input' : ''}
            />
            {formData.lesson_type === 'individual' && (
              <small className="form-help">الحد الأقصى للدروس الفردية هو طالب واحد</small>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">الطلاب</h2>
            <Button type="button" variant="secondary" onClick={addStudent}>
              + إضافة طالب
            </Button>
          </div>

          {formData.students.map((student, index) => (
            <div key={index} className="student-item">
              <div className="student-inputs">
                <SearchableSelect
                  label="اختر الطالب"
                  value={student.student_id}
                  onChange={(studentId) => handleStudentSelection(index, studentId)}
                  options={availableStudents}
                  placeholder={loadingData ? 'جاري التحميل...' : 'اختر الطالب'}
                  disabled={loadingData}
                />
              </div>
              <Button 
                type="button" 
                variant="danger" 
                onClick={() => removeStudent(index)}
              >
                حذف
              </Button>
            </div>
          ))}

          {formData.students.length === 0 && (
            <p className="no-students">لا يوجد طلاب مضافون</p>
          )}
        </div>


        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => window.location.href = '/lessons'}
          >
            إلغاء
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            إنشاء الدرس
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateLessonPageMobile
