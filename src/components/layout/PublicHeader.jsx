import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useIsMobile } from '../../hooks/useMediaQuery'
import ContactModal from '../common/ContactModal'
import '../../styles/components/layout/PublicHeader.css'

const PublicHeader = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const isMobile = useIsMobile()
  const location = useLocation()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  if (isMobile) {
    return (
      <>
        <PublicHeaderMobile 
          isAuthenticated={isAuthenticated} 
          user={user} 
          logout={logout}
          onContactClick={() => setIsContactModalOpen(true)}
          currentPath={location.pathname}
        />
        <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </>
    )
  }

  return (
    <>
      <PublicHeaderDesktop 
        isAuthenticated={isAuthenticated} 
        user={user} 
        logout={logout}
        onContactClick={() => setIsContactModalOpen(true)}
        currentPath={location.pathname}
      />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  )
}

const PublicHeaderDesktop = ({ isAuthenticated, user, logout, onContactClick, currentPath }) => {
  return (
    <header className="public-header public-header-desktop">
      <div className="public-header-container">
        <div className="public-header-brand">
          <Link to="/" className="public-header-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">نظام المعهد العام</span>
          </Link>
        </div>

        <nav className="public-header-nav">
          <Link to="/" className={`nav-link ${currentPath === '/' ? 'active' : ''}`}>الرئيسية</Link>
          <Link to="/about" className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}>من نحن</Link>
          <button onClick={onContactClick} className="nav-link nav-button">اتصل بنا</button>
        </nav>

        <div className="public-header-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user?.full_name || user?.username}</span>
              <div className="user-dropdown">
                <Link to="/dashboard" className="dropdown-item">لوحة التحكم</Link>
                <Link to="/profile" className="dropdown-item">الملف الشخصي</Link>
                <button onClick={logout} className="dropdown-item">تسجيل الخروج</button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-primary">تسجيل الدخول</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const PublicHeaderMobile = ({ isAuthenticated, user, logout, onContactClick, currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="public-header public-header-mobile">
      <div className="public-header-container">
        <div className="public-header-brand">
          <Link to="/" className="public-header-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">نظام المعهد</span>
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
          <Link to="/" className={`mobile-nav-link ${currentPath === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
            الرئيسية
          </Link>
          <Link to="/about" className={`mobile-nav-link ${currentPath === '/about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
            من نحن
          </Link>
          <button className="mobile-nav-link mobile-nav-button" onClick={() => { onContactClick(); setIsMenuOpen(false); }}>
            اتصل بنا
          </button>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                لوحة التحكم
              </Link>
              <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                الملف الشخصي
              </Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="mobile-nav-link mobile-nav-button">
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              تسجيل الدخول
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}

export default PublicHeader

