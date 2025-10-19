import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '../../services/dashboardService'
import Alert from '../../components/common/Alert'
import Button from '../../components/common/Button'

const DashboardPageDesktop = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubjects: 0,
    pendingTasks: 0
  })
  const [userDistribution, setUserDistribution] = useState({
    teachers: 0,
    students: 0,
    admins: 0
  })
  const [filter, setFilter] = useState('all') // all, this_month, last_month, this_year
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData()
  }, [filter, customDateRange])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError('')
    try {
      // Build query params based on filter
      const params = {}
      
      if (filter === 'custom' && customDateRange.start && customDateRange.end) {
        params.start_date = customDateRange.start
        params.end_date = customDateRange.end
      } else if (filter !== 'all') {
        // Add filter parameter
        params.filter = filter
      }
      
      console.log('📊 Fetching dashboard with params:', params)
      const data = await dashboardService.getDashboardStats(params)
      console.log('📊 Dashboard data:', data)
      
      // Map API response to component state
      setStats({
        totalUsers: (data.users?.total_users || 0) + (data.students?.total_students || 0),
        totalRevenue: data.payments?.total_revenue || 0,
        activeSubjects: data.pricing?.active_subjects || 0,
        pendingTasks: data.lessons?.pending_lessons || 0
      })
      
      setUserDistribution({
        teachers: data.users?.total_teachers || 0,
        students: data.students?.total_students || 0,
        admins: data.users?.total_admins || 0
      })
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err)
      console.log('⚠️ Using mock data as fallback')
      
      // Fallback mock data
      setStats({
        totalUsers: 32,
        totalRevenue: 2500.00,
        activeSubjects: 15,
        pendingTasks: 30
      })
      
      setUserDistribution({
        teachers: 5,
        students: 25,
        admins: 2
      })
      
      setError('⚠️ استخدام بيانات تجريبية - API غير متاح بعد')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-page-desktop">
      <div className="page-header">
        <h1 className="page-title">لوحة التحكم</h1>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Filters */}
      <div className="dashboard-filters">
        <div className="filter-group">
          <label className="filter-label">تصفية حسب:</label>
          <select 
            className="filter-select"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              if (e.target.value !== 'custom') {
                setShowDatePicker(false)
              }
            }}
          >
            <option value="all">الكل</option>
            <option value="this_month">هذا الشهر</option>
            <option value="last_month">الشهر الماضي</option>
            <option value="this_year">هذا العام</option>
            <option value="custom">نطاق مخصص</option>
          </select>
        </div>

        {filter === 'custom' && (
          <div className="custom-date-range">
            <div className="date-input-group">
              <label>من تاريخ:</label>
              <input
                type="date"
                className="date-input"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
              />
            </div>
            <div className="date-input-group">
              <label>إلى تاريخ:</label>
              <input
                type="date"
                className="date-input"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
              />
            </div>
            <button 
              className="apply-filter-btn"
              onClick={() => fetchDashboardData()}
              disabled={!customDateRange.start || !customDateRange.end}
            >
              تطبيق
            </button>
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="stat-card stat-card-users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3 className="stat-label">إجمالي المستخدمين</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card stat-card-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3 className="stat-label">إجمالي الإيرادات</h3>
            <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card stat-card-courses">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3 className="stat-label">المواد النشطة</h3>
            <p className="stat-value">{stats.activeSubjects}</p>
          </div>
        </div>

        <div className="stat-card stat-card-tasks">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3 className="stat-label">المهام المعلقة</h3>
            <p className="stat-value">{stats.pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* User Distribution */}
      <div className="user-distribution-section">
        <h2 className="section-title">توزيع المستخدمين</h2>
        <div className="distribution-cards">
          <div className="distribution-card">
            <div className="distribution-icon">👨‍🏫</div>
            <div className="distribution-info">
              <h3 className="distribution-label">المعلمين</h3>
              <p className="distribution-value">{userDistribution.teachers}</p>
            </div>
          </div>
          <div className="distribution-card">
            <div className="distribution-icon">👨‍🎓</div>
            <div className="distribution-info">
              <h3 className="distribution-label">الطلاب</h3>
              <p className="distribution-value">{userDistribution.students}</p>
            </div>
          </div>
          <div className="distribution-card">
            <div className="distribution-icon">👨‍💼</div>
            <div className="distribution-info">
              <h3 className="distribution-label">المدراء</h3>
              <p className="distribution-value">{userDistribution.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">إجراءات سريعة</h2>
        <div className="quick-actions-grid">
          <Button 
            size="large" 
            onClick={() => navigate('/admin/users')}
            className="quick-action-btn"
          >
            ➕ إضافة مستخدم
          </Button>
          <Button 
            size="large" 
            onClick={() => navigate('/admin/pricing')}
            className="quick-action-btn"
          >
            💰 إضافة سعر
          </Button>
          <Button 
            size="large" 
            onClick={() => navigate('/admin/sessions')}
            className="quick-action-btn"
          >
            📚 إنشاء جلسة
          </Button>
          <Button 
            size="large" 
            onClick={() => navigate('/admin/payments')}
            className="quick-action-btn"
          >
            💳 عرض المدفوعات
          </Button>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="navigation-section">
        <h2 className="section-title">إدارة النظام</h2>
        <div className="navigation-grid">
          <div className="nav-card" onClick={() => navigate('/admin/users')}>
            <div className="nav-icon">👥</div>
            <h3 className="nav-title">إدارة المستخدمين</h3>
            <p className="nav-description">عرض وإدارة جميع المستخدمين</p>
          </div>

          <div className="nav-card" onClick={() => navigate('/admin/pricing')}>
            <div className="nav-icon">💰</div>
            <h3 className="nav-title">إدارة الأسعار</h3>
            <p className="nav-description">تحديد أسعار المواد</p>
          </div>

          <div className="nav-card" onClick={() => navigate('/admin/sessions')}>
            <div className="nav-icon">📚</div>
            <h3 className="nav-title">إدارة الجلسات</h3>
            <p className="nav-description">إنشاء وإدارة الجلسات التعليمية</p>
          </div>

          <div className="nav-card" onClick={() => navigate('/admin/payments')}>
            <div className="nav-icon">💳</div>
            <h3 className="nav-title">المدفوعات</h3>
            <p className="nav-description">عرض وتتبع المدفوعات</p>
          </div>

          <div className="nav-card" onClick={() => navigate('/admin/messages')}>
            <div className="nav-icon">📧</div>
            <h3 className="nav-title">الرسائل</h3>
            <p className="nav-description">إدارة الرسائل والإشعارات</p>
          </div>

          <div className="nav-card" onClick={() => navigate('/admin/reports')}>
            <div className="nav-icon">📊</div>
            <h3 className="nav-title">التقارير</h3>
            <p className="nav-description">عرض التقارير والإحصائيات</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPageDesktop

