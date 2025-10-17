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
            <img src="/images/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Institute System</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/lessons" className="nav-link">Lessons</Link>
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="nav-link">Admin</Link>
          )}
        </nav>

        <div className="header-actions">
          <div className="user-menu">
            <span className="user-name">{user?.full_name || user?.username}</span>
            <div className="user-dropdown">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <button onClick={handleLogout} className="dropdown-item">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderDesktop
