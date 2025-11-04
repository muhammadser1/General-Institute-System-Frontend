import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Layouts
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import TestLoginPage from '../pages/auth/TestLoginPage'

// Dashboard Pages
import TeacherDashboardPage from '../pages/dashboard/DashboardPage'
import LessonsPage from '../pages/lessons/LessonsPage'
import LessonDetailPage from '../pages/lessons/LessonDetailPage'
import CreateLessonPage from '../pages/lessons/CreateLessonPage'

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import DashboardPage from '../pages/admin/DashboardPage'
import UsersManagementPage from '../pages/admin/UsersManagementPage'
import StudentsManagementPage from '../pages/admin/StudentsManagementPage'
import TeacherEarningsPage from '../pages/admin/TeacherEarningsPage'
import PaymentsPage from '../pages/admin/PaymentsPage'
import MainPaymentsPage from '../pages/admin/MainPaymentsPage'
import PricingPage from '../pages/admin/PricingPage'
import TeacherStatsPage from '../pages/admin/TeacherStatsPage'
import StudentStatsPage from '../pages/admin/StudentStatsPage'
import LessonsManagementPage from '../pages/admin/LessonsManagementPage'

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
      <Route path="/test-login" element={<TestLoginPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected Routes - Teacher */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:id" element={<LessonDetailPage />} />
        <Route path="/lessons/create" element={<CreateLessonPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Protected Routes - Admin */}
      <Route element={<ProtectedRoute requireAdmin><MainLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/users" element={<UsersManagementPage />} />
        <Route path="/admin/students" element={<StudentsManagementPage />} />
        <Route path="/admin/lessons" element={<LessonsManagementPage />} />
        <Route path="/admin/payments" element={<PaymentsPage />} />
        <Route path="/admin/pricing" element={<PricingPage />} />
        <Route path="/admin/teacher-stats" element={<TeacherStatsPage />} />
        <Route path="/admin/student-stats" element={<StudentStatsPage />} />
        <Route path="/admin/earnings/:teacherId" element={<TeacherEarningsPage />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
