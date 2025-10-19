import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import PublicHeader from '../../components/layout/PublicHeader'
import Footer from '../../components/layout/Footer'
import '../../styles/pages/auth/TestLoginPage.css'

const TestLoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userData = await login(username, password)
      
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

  const quickLogin = (user, pass) => {
    setUsername(user)
    setPassword(pass)
  }

  return (
    <div className="test-login-page">
      <PublicHeader />
      <div className="test-login-container">
        <div className="test-login-content">
          <div className="test-login-header">
            <h1>🔐 Test Login Page</h1>
            <p>Quick login for testing purposes</p>
          </div>

          {error && (
            <div className="test-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="test-login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="test-login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="quick-login-section">
            <h3>Quick Login Buttons</h3>
            <div className="quick-login-buttons">
              <button 
                className="quick-btn teacher-btn"
                onClick={() => quickLogin('teacher1', 'password123')}
              >
                👨‍🏫 Login as Teacher
              </button>
              <button 
                className="quick-btn admin-btn"
                onClick={() => quickLogin('admin', 'admin123')}
              >
                👨‍💼 Login as Admin
              </button>
            </div>

            <div className="test-credentials">
              <h4>Test Credentials:</h4>
              <div className="credential-item">
                <strong>Teacher:</strong> teacher1 / password123
              </div>
              <div className="credential-item">
                <strong>Admin:</strong> admin / admin123
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TestLoginPage

