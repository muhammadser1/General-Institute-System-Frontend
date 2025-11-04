import { useState, useEffect } from 'react'
import { pricingService } from '../../services/pricingService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import { subjectLabels, labelToSubject, getSubjectOptions, DEFAULT_INDIVIDUAL_PRICE, DEFAULT_GROUP_PRICE } from '../../constants/subjects'
import '../../styles/pages/admin/PricingPage.css'

const PricingPageMobile = () => {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalError, setModalError] = useState('')
  const [isPopulating, setIsPopulating] = useState(false)
  
  // Function to get subject label
  const getSubjectLabel = (subject) => {
    return subjectLabels[subject] || subject
  }
  
  // Function to get education level label
  const getEducationLevelLabel = (level) => {
    const labels = {
      'elementary': 'ابتدائي',
      'middle': 'اعدادي',
      'secondary': 'ثانوي'
    }
    return labels[level] || level
  }
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPricing, setSelectedPricing] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    subject: '', // This will store the Arabic/Hebrew label
    education_level: 'elementary',
    individual_price: DEFAULT_INDIVIDUAL_PRICE.toString(),
    group_price: DEFAULT_GROUP_PRICE.toString()
  })

  // Fetch pricing
  const fetchPricing = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await pricingService.getAllPricing()
      setPricing(response.pricing || [])
    } catch (err) {
      console.error('Error fetching pricing:', err)
      setError(err.response?.data?.detail || 'فشل تحميل الأسعار')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPricing()
  }, [])

  // Filter pricing by search query
  const filteredPricing = pricing.filter(item => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const subjectLabel = getSubjectLabel(item.subject).toLowerCase()
    const subjectEnglish = item.subject.toLowerCase()
    return subjectLabel.includes(query) || subjectEnglish.includes(query)
  })

  // Handle create pricing
  const handleCreate = async (e) => {
    e.preventDefault()
    setModalError('')
    try {
      // Convert Arabic/Hebrew label to English for API
      const englishSubject = labelToSubject[formData.subject]
      if (!englishSubject) {
        setModalError('يرجى اختيار مادة صحيحة')
        return
      }

      const data = {
        subject: englishSubject, // Send English name to API
        education_level: formData.education_level,
        individual_price: parseFloat(formData.individual_price),
        group_price: parseFloat(formData.group_price)
      }
      
      await pricingService.createPricing(data)
      setSuccess('تم إنشاء السعر بنجاح')
      setShowCreateModal(false)
      resetForm()
      fetchPricing()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل إنشاء السعر'
      
      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    }
  }

  // Handle edit pricing
  const handleEdit = async (e) => {
    e.preventDefault()
    setModalError('')
    try {
      const data = {
        individual_price: parseFloat(formData.individual_price),
        group_price: parseFloat(formData.group_price)
      }
      
      await pricingService.updatePricing(selectedPricing.id, data)
      setSuccess('تم تحديث السعر بنجاح')
      setShowEditModal(false)
      resetForm()
      fetchPricing()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل تحديث السعر'
      
      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    }
  }

  // Handle delete pricing
  const handleDelete = async () => {
    setError('')
    try {
      await pricingService.deletePricing(selectedPricing.id)
      setSuccess('تم حذف السعر بنجاح')
      setShowDeleteModal(false)
      setSelectedPricing(null)
      fetchPricing()
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل حذف السعر')
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      subject: '',
      education_level: 'elementary',
      individual_price: DEFAULT_INDIVIDUAL_PRICE.toString(),
      group_price: DEFAULT_GROUP_PRICE.toString()
    })
    setModalError('')
  }

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedPricing(item)
    // Convert English subject to Arabic/Hebrew label for display
    const subjectLabel = getSubjectLabel(item.subject)
    setFormData({
      subject: subjectLabel,
      education_level: item.education_level,
      individual_price: item.individual_price.toString(),
      group_price: item.group_price.toString()
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (item) => {
    setSelectedPricing(item)
    setShowDeleteModal(true)
  }

  // Populate all subjects with default prices
  const handlePopulateAllSubjects = async () => {
    if (!window.confirm('هل تريد إنشاء جميع المواد (19 مادة × 3 مراحل = 57 سعر) بالأسعار الافتراضية (50 ₪)؟')) {
      return
    }

    setIsPopulating(true)
    setError('')
    setSuccess('')
    
    const educationLevels = ['elementary', 'middle', 'secondary']
    const allSubjects = Object.keys(subjectLabels)
    let successCount = 0
    let errorCount = 0
    const errors = []

    try {
      for (const subject of allSubjects) {
        for (const level of educationLevels) {
          try {
            // Send Arabic/Hebrew subject name to backend
            const subjectLabel = subjectLabels[subject] // Get Arabic/Hebrew label
            await pricingService.createPricing({
              subject: subjectLabel, // Send Arabic/Hebrew name (e.g., "عربي", "رياضيات")
              education_level: level,
              individual_price: DEFAULT_INDIVIDUAL_PRICE,
              group_price: DEFAULT_GROUP_PRICE
            })
            successCount++
          } catch (err) {
            // If pricing already exists, skip it
            if (err.response?.status === 400 || err.response?.status === 409) {
              // Pricing already exists, skip
            } else {
              errorCount++
              errors.push(`${subjectLabels[subject]} - ${level}: ${err.response?.data?.detail || 'خطأ غير معروف'}`)
            }
          }
        }
      }

      let message = `تم إنشاء ${successCount} سعر بنجاح!`
      if (errorCount > 0) {
        message += ` (${errorCount} فشل - قد تكون موجودة مسبقاً)`
      }
      setSuccess(message)
      
      if (errors.length > 0 && errorCount > 5) {
        console.error('بعض الأخطاء:', errors.slice(0, 5))
      }
      
      // Refresh the pricing list
      await fetchPricing()
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الأسعار')
    } finally {
      setIsPopulating(false)
    }
  }

  return (
    <div className="pricing-page pricing-page-mobile">
      <div className="page-header">
        <h1 className="page-title">إدارة الأسعار</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          <Button 
            onClick={handlePopulateAllSubjects}
            disabled={isPopulating}
            variant="secondary"
            style={{ width: '100%' }}
          >
            {isPopulating ? 'جاري الإنشاء...' : '⚡ إنشاء جميع المواد (50 ₪)'}
          </Button>
          <Button onClick={() => { resetForm(); setShowCreateModal(true) }} style={{ width: '100%' }}>
            + إضافة
          </Button>
        </div>
      </div>

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Filters */}
      <div className="pricing-filters">
        <Input
          type="text"
          placeholder="بحث..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Pricing Cards */}
      <div className="pricing-cards-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredPricing.length === 0 ? (
          <div className="empty-state">
            لا توجد نتائج
          </div>
        ) : (
          filteredPricing.map((item) => (
            <div key={item.id} className="pricing-card">
              <div className="pricing-card-header">
                <h3 className="pricing-subject">{getSubjectLabel(item.subject)}</h3>
                <span className="badge badge-info">
                  {getEducationLevelLabel(item.education_level)}
                </span>
              </div>
              <div className="pricing-card-body">
                <div className="pricing-item">
                  <span className="pricing-label">السعر الفردي:</span>
                  <span className="pricing-value">{item.individual_price.toFixed(2)} ₪</span>
                </div>
                <div className="pricing-item">
                  <span className="pricing-label">السعر الجماعي:</span>
                  <span className="pricing-value">{item.group_price.toFixed(2)} ₪</span>
                </div>
              </div>
              <div className="pricing-card-actions">
                <button
                  className="action-btn action-btn-edit"
                  onClick={() => openEditModal(item)}
                >
                  تعديل
                </button>
                <button
                  className="action-btn action-btn-delete"
                  onClick={() => openDeleteModal(item)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm() }} title="إضافة سعر جديد">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleCreate} className="pricing-form">
          <Select
            name="subject"
            label="المادة *"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            options={getSubjectOptions()}
            placeholder="اختر المادة"
          />
          
          <Select
            name="education_level"
            label="المرحلة التعليمية *"
            value={formData.education_level}
            onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
            required
            options={[
              { value: 'elementary', label: 'ابتدائي (Elementary)' },
              { value: 'middle', label: 'اعدادي (Middle)' },
              { value: 'secondary', label: 'ثانوي (Secondary)' }
            ]}
          />
          
          <Input
            type="number"
            step="0.01"
            name="individual_price"
            label="السعر الفردي (₪ / ساعة)"
            value={formData.individual_price}
            onChange={(e) => setFormData({ ...formData, individual_price: e.target.value })}
            required
            placeholder="0.00"
          />
          <Input
            type="number"
            step="0.01"
            name="group_price"
            label="السعر الجماعي (₪ / ساعة)"
            value={formData.group_price}
            onChange={(e) => setFormData({ ...formData, group_price: e.target.value })}
            required
            placeholder="0.00"
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowCreateModal(false); resetForm() }}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              إنشاء
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); resetForm() }} title="تعديل السعر">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleEdit} className="pricing-form">
          <p><strong>المادة:</strong> {selectedPricing ? getSubjectLabel(selectedPricing.subject) : ''}</p>
          <p><strong>المرحلة التعليمية:</strong> {selectedPricing ? getEducationLevelLabel(selectedPricing.education_level) : ''}</p>
          <Input
            type="number"
            step="0.01"
            name="individual_price"
            label="السعر الفردي (₪ / ساعة)"
            value={formData.individual_price}
            onChange={(e) => setFormData({ ...formData, individual_price: e.target.value })}
            required
            placeholder="0.00"
          />
          <Input
            type="number"
            step="0.01"
            name="group_price"
            label="السعر الجماعي (₪ / ساعة)"
            value={formData.group_price}
            onChange={(e) => setFormData({ ...formData, group_price: e.target.value })}
            required
            placeholder="0.00"
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowEditModal(false); resetForm() }}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedPricing(null) }} title="تأكيد الحذف">
        <div className="delete-confirmation">
          <p>هل أنت متأكد من حذف سعر المادة <strong>{selectedPricing ? getSubjectLabel(selectedPricing.subject) : ''}</strong>؟</p>
          <p className="warning-text">لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowDeleteModal(false); setSelectedPricing(null) }}>
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

export default PricingPageMobile
