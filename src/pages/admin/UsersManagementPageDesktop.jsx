import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import '../../styles/pages/admin/UsersManagementPage.css'

const UsersManagementPageDesktop = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalError, setModalError] = useState('')
  
  // Filters
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [limit] = useState(20)
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'teacher',
    status: 'active'
  })

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        skip: currentPage * limit,
        limit,
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter })
      }
      
      const response = await adminService.getUsers(params)
      
      // Handle both response formats: array directly or wrapped in object
      let usersToSet = []
      let totalToSet = 0
      
      if (Array.isArray(response)) {
        // Response is an array directly
        usersToSet = response
        totalToSet = response.length
      } else if (response.users) {
        // Response is wrapped in object
        usersToSet = response.users
        totalToSet = response.total || response.users.length
      }
      
      setUsers(usersToSet)
      setTotalUsers(totalToSet)
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل تحميل المستخدمين')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, roleFilter, statusFilter])

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const username = (user.username || '').toLowerCase()
    const email = (user.email || '').toLowerCase()
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase()
    
    return (
      username.includes(query) ||
      email.includes(query) ||
      fullName.includes(query)
    )
  })

  // Handle create user
  const handleCreate = async (e) => {
    e.preventDefault()
    setModalError('')
    try {
      // Clean up form data - remove empty optional fields
      const cleanedData = { ...formData }
      if (!cleanedData.email || cleanedData.email.trim() === '') {
        delete cleanedData.email
      }
      if (!cleanedData.phone || cleanedData.phone.trim() === '') {
        delete cleanedData.phone
      }
      
      await adminService.createUser(cleanedData)
      setSuccess('تم إنشاء المستخدم بنجاح')
      setShowCreateModal(false)
      resetForm()
      fetchUsers()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل إنشاء المستخدم'
      
      if (Array.isArray(errorDetail)) {
        // Validation errors
        errorMessage = errorDetail.map(e => e.msg || JSON.stringify(e)).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    }
  }

  // Handle edit user
  const handleEdit = async (e) => {
    e.preventDefault()
    setModalError('')
    try {
      // Clean up form data - remove empty optional fields
      const cleanedData = { ...formData }
      if (!cleanedData.email || cleanedData.email.trim() === '') {
        delete cleanedData.email
      }
      if (!cleanedData.phone || cleanedData.phone.trim() === '') {
        delete cleanedData.phone
      }
      
      await adminService.updateUser(selectedUser.id, cleanedData)
      setSuccess('تم تحديث المستخدم بنجاح')
      setShowEditModal(false)
      resetForm()
      fetchUsers()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل تحديث المستخدم'
      
      if (Array.isArray(errorDetail)) {
        // Validation errors
        errorMessage = errorDetail.map(e => e.msg || e).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    }
  }

  // Handle delete user
  const handleDelete = async () => {
    setError('')
    try {
      await adminService.deactivateUser(selectedUser.id)
      setSuccess('تم حذف المستخدم بنجاح')
      setShowDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل حذف المستخدم')
    }
  }

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setModalError('')
    try {
      await adminService.resetPassword(selectedUser.id, { new_password: formData.password })
      setSuccess('تم تغيير كلمة المرور بنجاح')
      setShowPasswordModal(false)
      resetForm()
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      let errorMessage = 'فشل تغيير كلمة المرور'
      
      if (Array.isArray(errorDetail)) {
        // Validation errors
        errorMessage = errorDetail.map(e => e.msg || e).join(', ')
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail
      }
      
      setModalError(errorMessage)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'teacher',
      status: 'active'
    })
    setModalError('')
  }

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      role: user.role,
      status: user.status
    })
    setShowEditModal(true)
  }

  // Open delete modal
  const openDeleteModal = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  // Open password modal
  const openPasswordModal = (user) => {
    setSelectedUser(user)
    setFormData({ password: '' })
    setShowPasswordModal(true)
  }

  // Pagination
  const totalPages = Math.ceil(totalUsers / limit)

  return (
    <div className="users-management-page users-management-page-desktop">
      <div className="page-header">
        <h1 className="page-title">إدارة المستخدمين</h1>
        <Button onClick={() => { resetForm(); setShowCreateModal(true) }}>
          + إضافة مستخدم جديد
        </Button>
      </div>

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Filters */}
      <div className="users-filters">
        <Input
          type="text"
          placeholder="بحث..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <Select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(0) }}
          options={[
            { value: '', label: 'جميع الأدوار' },
            { value: 'teacher', label: 'معلم' },
            { value: 'admin', label: 'مدير' }
          ]}
        />
        <Select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0) }}
          options={[
            { value: '', label: 'جميع الحالات' },
            { value: 'active', label: 'نشط' },
            { value: 'inactive', label: 'غير نشط' },
            { value: 'suspended', label: 'معلق' }
          ]}
        />
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>اسم المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th>الاسم الكامل</th>
                <th>الدور</th>
                <th>الحالة</th>
                <th>تاريخ الإنشاء</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    لا توجد نتائج
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{(user.first_name || '') + ' ' + (user.last_name || '') || '-'}</td>
                    <td>
                      <span className={`badge badge-${user.role}`}>
                        {user.role === 'admin' ? 'مدير' : 'معلم'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${user.status}`}>
                        {user.status === 'active' ? 'نشط' : user.status === 'inactive' ? 'غير نشط' : 'معلق'}
                      </span>
                    </td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : '-'}</td>
                    <td>
                      <div className="user-actions">
                        <button
                          className="action-btn action-btn-edit"
                          onClick={() => openEditModal(user)}
                        >
                          تعديل
                        </button>
                        <button
                          className="action-btn action-btn-password"
                          onClick={() => openPasswordModal(user)}
                        >
                          كلمة المرور
                        </button>
                        <button
                          className="action-btn action-btn-delete"
                          onClick={() => openDeleteModal(user)}
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            السابق
          </button>
          <span className="pagination-info">
            صفحة {currentPage + 1} من {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
          >
            التالي
          </button>
        </div>
      )}

      {/* Create User Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm() }} title="إضافة مستخدم جديد">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleCreate} className="user-form">
          <Input
            name="username"
            label="اسم المستخدم"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <Input
            type="email"
            name="email"
            label="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            type="password"
            name="password"
            label="كلمة المرور"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="form-row">
            <Input
              name="first_name"
              label="الاسم الأول"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <Input
              name="last_name"
              label="اسم العائلة"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
          <Input
            name="phone"
            label="رقم الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="form-row">
            <Select
              name="role"
              label="الدور"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'teacher', label: 'معلم' },
                { value: 'admin', label: 'مدير' }
              ]}
            />
            <Select
              name="status"
              label="الحالة"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' },
                { value: 'suspended', label: 'معلق' }
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

      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => { setShowEditModal(false); resetForm() }} title="تعديل المستخدم">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleEdit} className="user-form">
          <Input
            name="username"
            label="اسم المستخدم"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <Input
            type="email"
            name="email"
            label="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="form-row">
            <Input
              name="first_name"
              label="الاسم الأول"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <Input
              name="last_name"
              label="اسم العائلة"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
          <Input
            name="phone"
            label="رقم الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="form-row">
            <Select
              name="role"
              label="الدور"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'teacher', label: 'معلم' },
                { value: 'admin', label: 'مدير' }
              ]}
            />
            <Select
              name="status"
              label="الحالة"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'active', label: 'نشط' },
                { value: 'inactive', label: 'غير نشط' },
                { value: 'suspended', label: 'معلق' }
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
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedUser(null) }} title="تأكيد الحذف">
        <div className="delete-confirmation">
          <p>هل أنت متأكد من حذف المستخدم <strong>{selectedUser?.username}</strong>؟</p>
          <p className="warning-text">لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowDeleteModal(false); setSelectedUser(null) }}>
              إلغاء
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete}>
              حذف
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => { setShowPasswordModal(false); resetForm() }} title="تغيير كلمة المرور">
        {modalError && <Alert type="error" message={modalError} />}
        <form onSubmit={handleResetPassword} className="user-form">
          <p>تغيير كلمة مرور المستخدم: <strong>{selectedUser?.username}</strong></p>
          <Input
            type="password"
            name="password"
            label="كلمة المرور الجديدة"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => { setShowPasswordModal(false); resetForm() }}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              تغيير كلمة المرور
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default UsersManagementPageDesktop
