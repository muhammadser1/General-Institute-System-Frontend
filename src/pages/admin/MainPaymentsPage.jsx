import { useState, useEffect } from 'react'
import { paymentService } from '../../services/paymentService'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Input from '../../components/common/Input'
import Alert from '../../components/common/Alert'
import Loading from '../../components/common/Loading'
import '../../styles/pages/admin/MainPaymentsPage.css'

const MainPaymentsPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [paymentData, setPaymentData] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchPaymentStatus()
  }, [selectedMonth, selectedYear])

  const fetchPaymentStatus = async () => {
    setLoading(true)
    setError('')
    try {
      const month = selectedMonth === 'all' ? null : parseInt(selectedMonth)
      const year = selectedYear === 'all' ? null : parseInt(selectedYear)
      
      const data = await paymentService.getStudentsPaymentStatus(month, year)
      setPaymentData(data)
    } catch (err) {
      console.error('Error fetching payment status:', err)
      setError(err.response?.data?.detail || 'فشل تحميل بيانات المدفوعات')
    } finally {
      setLoading(false)
    }
  }

  // Filter students by search query
  const filteredStudents = paymentData?.students?.filter(student => 
    student.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone?.includes(searchQuery)
  ) || []

  // Calculate stats from filtered data
  const stats = paymentData ? {
    totalPaid: filteredStudents.reduce((sum, s) => sum + (s.total_paid || 0), 0),
    totalDebts: filteredStudents.reduce((sum, s) => sum + (s.outstanding_balance || 0), 0),
    studentsWithDebts: filteredStudents.filter(s => s.has_debt).length,
    totalStudents: filteredStudents.length
  } : {
    totalPaid: 0,
    totalDebts: 0,
    studentsWithDebts: 0,
    totalStudents: 0
  }

  if (loading) {
    return (
      <div className="main-payments-page">
        <Loading />
      </div>
    )
  }

  return (
    <div className="main-payments-page">
      <div className="page-header">
        <h1 className="page-title">المدفوعات</h1>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} />
      )}

      {/* Filters */}
      <div className="payments-filters">
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          options={[
            { value: 'all', label: 'جميع الشهور' },
            { value: '1', label: 'يناير' },
            { value: '2', label: 'فبراير' },
            { value: '3', label: 'مارس' },
            { value: '4', label: 'أبريل' },
            { value: '5', label: 'مايو' },
            { value: '6', label: 'يونيو' },
            { value: '7', label: 'يوليو' },
            { value: '8', label: 'أغسطس' },
            { value: '9', label: 'سبتمبر' },
            { value: '10', label: 'أكتوبر' },
            { value: '11', label: 'نوفمبر' },
            { value: '12', label: 'ديسمبر' }
          ]}
        />
        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          options={[
            { value: 'all', label: 'جميع السنوات' },
            ...Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i
              return { value: year.toString(), label: year.toString() }
            })
          ]}
        />
        <Input
          type="text"
          placeholder="🔍 بحث بالاسم أو الهاتف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Stats Cards */}
      <div className="payments-stats">
        <div className="stat-card stat-paid">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalPaid.toLocaleString()} {paymentData?.students?.[0]?.currency || 'ILS'}</div>
            <div className="stat-label">إجمالي المدفوعات</div>
          </div>
        </div>
        <div className="stat-card stat-debts">
          <div className="stat-icon">🧾</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDebts.toLocaleString()} {paymentData?.students?.[0]?.currency || 'ILS'}</div>
            <div className="stat-label">الديون الكلية</div>
          </div>
        </div>
        <div className="stat-card stat-students">
          <div className="stat-icon">🧑‍🎓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.studentsWithDebts} / {stats.totalStudents}</div>
            <div className="stat-label">الطلاب المدينين</div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>اسم الطالب</th>
              <th>الهاتف</th>
              <th>المرحلة</th>
              <th>عدد الدروس</th>
              <th>تكلفة الدروس</th>
              <th>المدفوع</th>
              <th>الرصيد المتبقي</th>
              <th>الحالة</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                  لا توجد بيانات للعرض
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td className="student-name">{student.student_name}</td>
                  <td>{student.phone || '-'}</td>
                  <td>
                    {student.education_level === 'elementary' ? 'ابتدائي' :
                     student.education_level === 'middle' ? 'إعدادي' :
                     student.education_level === 'secondary' ? 'ثانوي' : '-'}
                  </td>
                  <td>{student.lessons_count || 0}</td>
                  <td>{student.total_lessons_cost?.toFixed(2) || '0.00'} {student.currency || 'ILS'}</td>
                  <td className="amount-paid">{student.total_paid?.toFixed(2) || '0.00'} {student.currency || 'ILS'}</td>
                  <td className={`balance ${student.has_debt ? 'has-balance' : ''}`}>
                    {student.outstanding_balance?.toFixed(2) || '0.00'} {student.currency || 'ILS'}
                  </td>
                  <td>
                    {student.has_debt ? (
                      <span className="debt-badge">⚠️ مدين</span>
                    ) : (
                      <span className="paid-badge">✅ مدفوع بالكامل</span>
                    )}
                  </td>
                  <td className="actions">
                    {student.has_debt ? (
                      <Button variant="primary" size="small" onClick={() => alert(`إضافة دفعة للطالب: ${student.student_name}`)}>
                        ➕ إضافة دفعة
                      </Button>
                    ) : (
                      <span className="paid-badge">✅ مدفوع بالكامل</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="payments-actions">
        <Button variant="secondary" onClick={() => alert('تصدير CSV')}>
          ⬇️ تصدير CSV
        </Button>
        <Button variant="primary" onClick={() => window.location.href = '/admin/payments'}>
          ➕ إضافة دفعة جديدة
        </Button>
      </div>
    </div>
  )
}

export default MainPaymentsPage
