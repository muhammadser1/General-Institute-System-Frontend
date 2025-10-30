import { useState, useEffect } from 'react'
import { pricingService } from '../../services/pricingService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import '../../styles/pages/admin/PricingPage.css'

const PricingPageDesktop = () => {
  const [pricing, setPricing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalError, setModalError] = useState('')
  
  // Subject mapping
  const subjectLabels = {
    'Arabic': 'عربي',
    'Hebrew': 'عبراني',
    'English': 'انجليزي',
    'Math': 'رياضيات',
    'History': 'تاريخ',
    'Religion': 'دين',
    'Geography': 'جغرافيا',
    'Physics': 'فيزيا',
    'Electronics': 'مخترونيكا',
    'Civics': 'مدنيات',
    'Chemistry': 'كيميا',
    'Biology': 'بيولوجيا',
    'Environment': 'بيئه',
    'Technology': 'تكنولوجيا',
    'Computer': 'حاسوب',
    'Science': 'علوم',
    'Adapted Teaching': 'הוראה מותאמת',
    'Architecture': 'אדריכלות',
    'Statistics': 'סטטיסטיקה'
  }
  
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
    subject: '',
    education_level: 'elementary',
    individual_price: '',
    group_price: ''
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
    return item.subject.toLowerCase().includes(query)
  })

  // Handle create pricing
  const handleCreate = async (e) => {
    e.preventDefault()
    setModalError('')
    try {
      const data = {
        subject: formData.subject,
        education_level: formData.education_level,
        individual_price: parseFloat(formData.individual_price),
        group_price: parseFloat(formData.group_price)
      }
      
      console.log('📤 Sending pricing data:', data)
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
      individual_price: '',
      group_price: ''
    })
    setModalError('')
  }

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedPricing(item)
    setFormData({
      subject: item.subject,
      education_level: item.education_level,
      individual_price: item.individual_price,
      group_price: item.group_price
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (item) => {
    setSelectedPricing(item)
    setShowDeleteModal(true)
  }

  return (
    <div className="pricing-page pricing-page-desktop">
      <div className="page-header">
        <h1 className="page-title">إدارة الأسعار</h1>
        <Button onClick={() => { resetForm(); setShowCreateModal(true) }}>
          + إضافة سعر جديد
        </Button>
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

      {/* Pricing Table */}
      <div className="pricing-table-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <table className="pricing-table">
            <thead>
              <tr>
                <th>المادة</th>
                <th>المرحلة التعليمية</th>
                <th>السعر الفردي</th>
                <th>السعر الجماعي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPricing.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    لا توجد نتائج
                  </td>
                </tr>
              ) : (
                filteredPricing.map((item) => (
                  <tr key={item.id}>
                    <td>{item.subject}</td>
                    <td>{getEducationLevelLabel(item.education_level)}</td>
                    <td>{item.individual_price.toFixed(2)} ₪</td>
                    <td>{item.group_price.toFixed(2)} ₪</td>
                    <td>
                      <div className="pricing-actions">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Pricing Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm() }} title="إضافة سعر جديد">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleCreate} className="pricing-form">
          <Input
            name="subject"
            label="المادة *"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            placeholder="أدخل اسم المادة (مثال: Mathematics، Arabic، Physics)"
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
          
          <div className="form-row">
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
          </div>
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

             {/* Edit Pricing Modal */}
       <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); resetForm() }} title="تعديل السعر">
         {modalError && <Alert type="error" message={modalError} />}
         <form onSubmit={handleEdit} className="pricing-form">
           <p><strong>المادة:</strong> {selectedPricing ? selectedPricing.subject : ''}</p>
           <p><strong>المرحلة التعليمية:</strong> {selectedPricing ? getEducationLevelLabel(selectedPricing.education_level) : ''}</p>
          <div className="form-row">
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
          </div>
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

             {/* Delete Confirmation Modal */}
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

export default PricingPageDesktop
