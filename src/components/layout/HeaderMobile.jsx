import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/components/layout/Header.css'

const HeaderMobile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const teacherMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lessons', label: 'My Lessons', icon: '📚' },
    { path: '/lessons/create', label: 'Create Lesson', icon: '➕' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: '🏠' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/admin/lessons', label: 'Lessons', icon: '📚' },
    { path: '/admin/teacher-stats', label: 'Teacher Stats', icon: '📊' },
    { path: '/admin/student-stats', label: 'Student Stats', icon: '📈' }
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : teacherMenuItems

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="header header-mobile">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="header-logo">
            <img src="/images/logo.jpeg" alt="Logo" className="logo-img" />
            <span className="logo-text">Institute System</span>
          </Link>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-nav">
          {/* Navigation Items */}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* User Info and Logout */}
          <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)', marginTop: 'var(--spacing-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {user?.full_name || user?.username}
              </span>
            </div>
            <button onClick={handleLogout} className="mobile-logout-btn">
              <span className="logout-icon">🚪</span>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default HeaderMobile
