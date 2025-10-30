import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/components/layout/Header.css'

const HeaderDesktop = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header header-desktop">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="header-logo">
            <img src="/images/logo.jpeg" alt="Logo" className="logo-img" />
            <span className="logo-text">Institute System</span>
          </Link>
        </div>


        <div className="header-actions">
          <span className="user-name">{user?.full_name || user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderDesktop
