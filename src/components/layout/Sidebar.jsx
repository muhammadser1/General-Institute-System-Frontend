import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../../styles/components/layout/Sidebar.css'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

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
    { path: '/admin/payments', label: 'Payments', icon: '💰' },
    { path: '/admin/pricing', label: 'Pricing', icon: '💵' }
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : teacherMenuItems

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
