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
  
  // Filters
  const [activeFilter, setActiveFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPricing, setSelectedPricing] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    subject: '',
    customSubject: '',
    individual_price: '',
    group_price: '',
    currency: 'USD',
    is_active: true
  })

  // Fetch pricing
  const fetchPricing = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (activeFilter !== '') {
        params.is_active = activeFilter === 'true'
      }
      
      console.log('🔍 Fetching pricing with params:', params)
      const response = await pricingService.getAllPricing(params)
      console.log('📦 API Response:', response)
      console.log('💰 Pricing array:', response.pricing)
      console.log('📊 Total pricing items:', response.pricing?.length)
      
      setPricing(response.pricing || [])
    } catch (err) {
      console.error('❌ Error fetching pricing:', err)
      console.error('❌ Error response:', err.response)
      setError(err.response?.data?.detail || 'فشل تحميل الأسعار')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPricing()
  }, [activeFilter])

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
        subject: formData.subject === 'Other' ? formData.customSubject : formData.subject,
        individual_price: parseFloat(formData.individual_price),
        group_price: parseFloat(formData.group_price),
        currency: formData.currency,
        is_active: formData.is_active
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
        group_price: parseFloat(formData.group_price),
        is_active: formData.is_active
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
      customSubject: '',
      individual_price: '',
      group_price: '',
      currency: 'USD',
      is_active: true
    })
    setModalError('')
  }

  // Open edit modal
  const openEditModal = (item) => {
    setSelectedPricing(item)
    setFormData({
      subject: item.subject,
      individual_price: item.individual_price,
      group_price: item.group_price,
      currency: item.currency || 'USD',
      is_active: item.is_active
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
        <Select
          value={activeFilter}
          onChange={(e) => { setActiveFilter(e.target.value) }}
          options={[
            { value: '', label: 'جميع الحالات' },
            { value: 'true', label: 'نشط' },
            { value: 'false', label: 'غير نشط' }
          ]}
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
                <th>السعر الفردي</th>
                <th>السعر الجماعي</th>
                <th>العملة</th>
                <th>الحالة</th>
                <th>تاريخ الإنشاء</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPricing.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    لا توجد نتائج
                  </td>
                </tr>
              ) : (
                filteredPricing.map((item) => (
                  <tr key={item.id}>
                    <td>{item.subject}</td>
                    <td>{item.individual_price.toFixed(2)} {item.currency}</td>
                    <td>{item.group_price.toFixed(2)} {item.currency}</td>
                    <td>{item.currency}</td>
                    <td>
                      <span className={`badge badge-${item.is_active ? 'active' : 'inactive'}`}>
                        {item.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '-'}</td>
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
          <Select
            name="subject"
            label="المادة"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value, customSubject: '' })}
            required
            options={[
              { value: '', label: 'اختر المادة' },
              { value: 'Math', label: 'رياضيات' },
              { value: 'Physics', label: 'فيزياء' },
              { value: 'Chemistry', label: 'كيمياء' },
              { value: 'Biology', label: 'أحياء' },
              { value: 'English', label: 'إنجليزية' },
              { value: 'Arabic', label: 'عربية' },
              { value: 'Computer Science', label: 'حاسوب' },
              { value: 'History', label: 'تاريخ' },
              { value: 'Geography', label: 'جغرافيا' },
              { value: 'Other', label: 'أخرى (مخصص)' }
            ]}
          />
          {formData.subject === 'Other' && (
            <Input
              name="customSubject"
              label="اسم المادة المخصص"
              value={formData.customSubject}
              onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
              required
              placeholder="أدخل اسم المادة"
            />
          )}
          <div className="form-row">
            <Input
              type="number"
              step="0.01"
              name="individual_price"
              label="السعر الفردي"
              value={formData.individual_price}
              onChange={(e) => setFormData({ ...formData, individual_price: e.target.value })}
              required
              placeholder="0.00"
            />
            <Input
              type="number"
              step="0.01"
              name="group_price"
              label="السعر الجماعي"
              value={formData.group_price}
              onChange={(e) => setFormData({ ...formData, group_price: e.target.value })}
              required
              placeholder="0.00"
            />
          </div>
          <div className="form-row">
            <Select
              name="currency"
              label="العملة"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              options={[
                { value: 'USD', label: 'دولار (USD)' },
                { value: 'EUR', label: 'يورو (EUR)' },
                { value: 'SAR', label: 'ريال سعودي (SAR)' },
                { value: 'AED', label: 'درهم إماراتي (AED)' },
                { value: 'IQD', label: 'دينار عراقي (IQD)' }
              ]}
            />
            <Select
              name="is_active"
              label="الحالة"
              value={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
              options={[
                { value: 'true', label: 'نشط' },
                { value: 'false', label: 'غير نشط' }
              ]}
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
          <p><strong>المادة:</strong> {selectedPricing?.subject}</p>
          <div className="form-row">
            <Input
              type="number"
              step="0.01"
              name="individual_price"
              label="السعر الفردي"
              value={formData.individual_price}
              onChange={(e) => setFormData({ ...formData, individual_price: e.target.value })}
              required
              placeholder="0.00"
            />
            <Input
              type="number"
              step="0.01"
              name="group_price"
              label="السعر الجماعي"
              value={formData.group_price}
              onChange={(e) => setFormData({ ...formData, group_price: e.target.value })}
              required
              placeholder="0.00"
            />
          </div>
          <div className="form-row">
            <Select
              name="currency"
              label="العملة"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              options={[
                { value: 'USD', label: 'دولار (USD)' },
                { value: 'EUR', label: 'يورو (EUR)' },
                { value: 'SAR', label: 'ريال سعودي (SAR)' },
                { value: 'AED', label: 'درهم إماراتي (AED)' },
                { value: 'IQD', label: 'دينار عراقي (IQD)' }
              ]}
            />
            <Select
              name="is_active"
              label="الحالة"
              value={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
              options={[
                { value: 'true', label: 'نشط' },
                { value: 'false', label: 'غير نشط' }
              ]}
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
          <p>هل أنت متأكد من حذف سعر المادة <strong>{selectedPricing?.subject}</strong>؟</p>
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
