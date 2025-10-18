import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage'
import LessonsPage from '../pages/lessons/LessonsPage'
import LessonDetailPage from '../pages/lessons/LessonDetailPage'
import CreateLessonPage from '../pages/lessons/CreateLessonPage'

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import UsersManagementPage from '../pages/admin/UsersManagementPage'
import TeacherEarningsPage from '../pages/admin/TeacherEarningsPage'
import PaymentsPage from '../pages/admin/PaymentsPage'
import PricingPage from '../pages/admin/PricingPage'

// Profile Pages
import ProfilePage from '../pages/profile/ProfilePage'

// Public Pages
import HomePage from '../pages/public/HomePage'
import PricingPublicPage from '../pages/public/PricingPublicPage'
import ContactPage from '../pages/public/ContactPage'
import AboutPage from '../pages/public/AboutPage'

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPublicPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected Routes - Teacher */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:id" element={<LessonDetailPage />} />
        <Route path="/lessons/create" element={<CreateLessonPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Protected Routes - Admin */}
      <Route element={<ProtectedRoute requireAdmin><MainLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UsersManagementPage />} />
        <Route path="/admin/earnings/:teacherId" element={<TeacherEarningsPage />} />
        <Route path="/admin/payments" element={<PaymentsPage />} />
        <Route path="/admin/pricing" element={<PricingPage />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
