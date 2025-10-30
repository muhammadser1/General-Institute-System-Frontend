import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/authService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import '../../styles/pages/profile/ProfilePage.css'

const ProfilePageDesktop = () => {
  const { user: authUser, token } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  // Fetch user data
  const fetchUserData = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await authService.getCurrentUser()
      setUser(response)
      setFormData({
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        email: response.email || '',
        phone: response.phone || ''
      })
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('فشل تحميل بيانات المستخدم')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      await authService.updateProfile(formData)
      await fetchUserData()
      setSuccess('تم تحديث الملف الشخصي بنجاح')
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.response?.data?.detail || 'فشل تحديث الملف الشخصي')
    }
  }

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    if (passwordData.new_password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    try {
      await authService.changePassword(
        passwordData.old_password,
        passwordData.new_password
      )
      setSuccess('تم تحديث كلمة المرور بنجاح')
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      })
      setShowPasswordForm(false)
    } catch (err) {
      console.error('Error changing password:', err)
      setError(err.response?.data?.detail || 'فشل تحديث كلمة المرور')
    }
  }

  // Handle cancel edit
  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  if (loading) {
    return (
      <div className="profile-page profile-page-desktop">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page profile-page-desktop">
      <div className="profile-header">
        <h1 className="profile-title">الملف الشخصي</h1>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
      )}

      <div className="profile-content">
        {/* Profile Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              <span className="avatar-icon">👤</span>
            </div>
            <h3 className="avatar-name">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.username}
            </h3>
            <p className="avatar-role">
              {user?.role === 'admin' ? 'مدير' : user?.role === 'teacher' ? 'معلم' : 'مستخدم'}
            </p>
          </div>

          <div className="profile-info-card">
            <h4 className="info-card-title">معلومات سريعة</h4>
            <div className="info-item">
              <span className="info-label">اسم المستخدم:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">تاريخ الانضمام:</span>
              <span className="info-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : '-'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">آخر تحديث:</span>
              <span className="info-value">
                {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('en-GB') : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Main Content */}
        <div className="profile-main">
          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">معلومات شخصية</h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                >
                  تعديل
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>الاسم الأول *</label>
                    <Input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>اسم العائلة *</label>
                    <Input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>البريد الإلكتروني *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>رقم الهاتف</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <Button type="submit" className="save-btn">
                    حفظ التغييرات
                  </Button>
                  <Button type="button" onClick={handleCancel} className="cancel-btn">
                    إلغاء
                  </Button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">الاسم الأول:</span>
                    <span className="info-value">{user?.first_name || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">اسم العائلة:</span>
                    <span className="info-value">{user?.last_name || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">البريد الإلكتروني:</span>
                    <span className="info-value">{user?.email || '-'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">رقم الهاتف:</span>
                    <span className="info-value">{user?.phone || '-'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h2 className="section-title">تغيير كلمة المرور</h2>
              {!showPasswordForm && (
                <Button
                  onClick={() => setShowPasswordForm(true)}
                  className="edit-btn"
                >
                  تغيير كلمة المرور
                </Button>
              )}
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="profile-form">
                <div className="form-group">
                  <label>كلمة المرور الحالية *</label>
                  <Input
                    type="password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, old_password: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>كلمة المرور الجديدة *</label>
                  <Input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>تأكيد كلمة المرور *</label>
                  <Input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-actions">
                  <Button type="submit" className="save-btn">
                    حفظ كلمة المرور
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordData({ old_password: '', new_password: '', confirm_password: '' })
                    }} 
                    className="cancel-btn"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePageDesktop
