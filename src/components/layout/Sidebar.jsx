import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAddStudent } from '../../contexts/AddStudentContext'
import '../../styles/components/layout/Sidebar.css'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { setShowAddStudentModal } = useAddStudent()

  const isActive = (path) => location.pathname === path

  const handleAddStudent = (e) => {
    e.preventDefault()
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard')
      // Small delay to ensure dashboard is rendered
      setTimeout(() => setShowAddStudentModal(true), 100)
    } else {
      setShowAddStudentModal(true)
    }
  }

  const teacherMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/lessons', label: 'My Lessons', icon: '📚' },
    { path: '/lessons/create', label: 'Create Lesson', icon: '➕' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { action: 'addStudent', label: 'Add Student', icon: '👨‍🎓' }
  ]

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: '🏠' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/admin/lessons', label: 'Lessons', icon: '📚' },
    { path: '/admin/payments', label: 'Payments', icon: '💰' },
    { path: '/admin/teacher-stats', label: 'Teacher Stats', icon: '📊' },
    { path: '/admin/student-stats', label: 'Student Stats', icon: '📈' }
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : teacherMenuItems

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          if (item.action === 'addStudent') {
            return (
              <button
                key={item.action}
                onClick={handleAddStudent}
                className="sidebar-link sidebar-button"
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            )
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
