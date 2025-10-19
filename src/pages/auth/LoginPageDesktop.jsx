import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import PublicHeader from '../../components/layout/PublicHeader'
import Footer from '../../components/layout/Footer'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import '../../styles/pages/auth/LoginPage.css'

const LoginPageDesktop = () => {
  const [formData, setFormData] = useState({
    username: localStorage.getItem('remembered_username') || '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('remembered_username'))
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = await login(formData.username, formData.password)
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('remembered_username', formData.username)
      } else {
        localStorage.removeItem('remembered_username')
      }
      
      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      let errorMessage = 'فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.'
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail
        if (detail.toLowerCase().includes('incorrect') || detail.toLowerCase().includes('invalid')) {
          errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة'
        } else if (detail.toLowerCase().includes('not found')) {
          errorMessage = 'المستخدم غير موجود'
        } else {
          errorMessage = detail
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <PublicHeader />
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <div className="login-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
              </svg>
            </div>
            <h1>تسجيل الدخول</h1>
            <p>مرحباً بك مرة أخرى في نظام المعهد العام</p>
          </div>

          {error && (
            <div className="error-message">
              <Alert type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              type="text"
              name="username"
              label="اسم المستخدم"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="أدخل اسم المستخدم"
            />

            <div className="password-input-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                label="كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="أدخل كلمة المرور"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>تذكرني</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LoginPageDesktop

