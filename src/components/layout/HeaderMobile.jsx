import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/components/layout/Header.css'

const HeaderMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsMenuOpen(false)
  }

  return (
    <header className="header header-mobile">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="header-logo">
            <img src="/images/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Institute</span>
          </Link>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={isMenuOpen ? 'hamburger active' : 'hamburger'}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="mobile-nav">
          <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/lessons" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Lessons
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          )}
          <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
            Profile
          </Link>
          <button onClick={handleLogout} className="mobile-nav-link mobile-nav-button">
            Logout
          </button>
        </nav>
      )}
    </header>
  )
}

export default HeaderMobile
