import { useState, useEffect } from 'react'
import { paymentService } from '../../services/paymentService'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Modal from '../../components/common/Modal'
import Alert from '../../components/common/Alert'
import Loading from '../../components/common/Loading'
import Card from '../../components/common/Card'
import '../../styles/pages/admin/PaymentsPage.css'

const PaymentsPageMobile = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Filters
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [studentFilter, setStudentFilter] = useState('')
  
  // Summary
  const [totalPayments, setTotalPayments] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [studentTotal, setStudentTotal] = useState(null)
  
  // Add Payment Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPayment, setNewPayment] = useState({
    student_name: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0]
  })
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Fetch payments
  const fetchPayments = async () => {
    setLoading(true)
    setError(null)
    try {
      let data
      
      // Determine which API to call based on filters
      if (studentFilter && !selectedMonth && !selectedYear) {
        // Student only - get all payments for this student
        data = await paymentService.getStudentPayments(studentFilter)
      } else {
        // Use the main payments endpoint with flexible filtering
        // API supports: no filters, month+year, student, or all combined
        data = await paymentService.getMonthlyPayments(
          selectedMonth,
          selectedYear,
          studentFilter || null
        )
      }
      
      setPayments(data.payments || [])
      setTotalPayments(data.total_payments || 0)
      setTotalAmount(data.total_amount || 0)
    } catch (err) {
      // Handle different error response formats
      let errorMessage = 'Failed to fetch payments'
      
      if (err.response?.data) {
        const errorData = err.response.data
        
        // Handle validation errors (422)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(e => e.msg || e.message).join(', ')
        } 
        // Handle simple detail string
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail
        }
        // Handle error message
        else if (errorData.message) {
          errorMessage = errorData.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Fetch student total across all months
  const fetchStudentTotal = async () => {
    if (!studentFilter) {
      setStudentTotal(null)
      return
    }
    
    try {
      const data = await paymentService.getStudentTotal(studentFilter)
      setStudentTotal(data)
    } catch (err) {
      console.error('Failed to fetch student total:', err)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [selectedMonth, selectedYear, studentFilter])

  useEffect(() => {
    fetchStudentTotal()
  }, [studentFilter])

  // Handle add payment
  const handleAddPayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const paymentData = {
        ...newPayment,
        amount: parseFloat(newPayment.amount),
        payment_date: new Date(newPayment.payment_date).toISOString()
      }
      
      await paymentService.createPayment(paymentData)
      setSuccess('Payment added successfully')
      setShowAddModal(false)
      setNewPayment({
        student_name: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0]
      })
      fetchPayments()
    } catch (err) {
      // Handle different error response formats
      let errorMessage = 'Failed to add payment'
      
      if (err.response?.data) {
        const errorData = err.response.data
        
        // Handle validation errors (422)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(e => e.msg || e.message).join(', ')
        } 
        // Handle simple detail string
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail
        }
        // Handle error message
        else if (errorData.message) {
          errorMessage = errorData.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle delete payment
  const handleDeletePayment = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await paymentService.deletePayment(deleteConfirm)
      setSuccess('Payment deleted successfully')
      setDeleteConfirm(null)
      fetchPayments()
    } catch (err) {
      // Handle different error response formats
      let errorMessage = 'Failed to delete payment'
      
      if (err.response?.data) {
        const errorData = err.response.data
        
        // Handle validation errors (422)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(e => e.msg || e.message).join(', ')
        } 
        // Handle simple detail string
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail
        }
        // Handle error message
        else if (errorData.message) {
          errorMessage = errorData.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`
  }

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2024, i).toLocaleDateString('en-US', { month: 'long' })
  }))

  // Generate year options
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear - 5 + i,
    label: (currentYear - 5 + i).toString()
  }))

  return (
    <div className="payments-page payments-page-mobile">
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          size="small"
        >
          + Add
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {/* Filters */}
      <div className="payments-filters">
        <Select
          label="Month (Optional)"
          value={selectedMonth || ''}
          onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
          options={[{ value: '', label: 'All Months' }, ...monthOptions]}
        />
        <Select
          label="Year (Optional)"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
          options={[{ value: '', label: 'All Years' }, ...yearOptions]}
        />
        <Input
          label="Filter by Student (Optional)"
          type="text"
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          placeholder="Enter student name..."
        />
      </div>

      {/* Summary Cards */}
      <div className="payments-summary">
        <div className="summary-card">
          <div className="summary-label">
            {studentFilter ? 'Payments This Month' : 'Total Payments'}
          </div>
          <div className="summary-value">{totalPayments}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">
            {studentFilter ? 'Amount This Month' : 'Total Amount'}
          </div>
          <div className="summary-value">{formatCurrency(totalAmount)}</div>
        </div>
        {studentTotal && (
          <>
            <div className="summary-card" style={{ background: 'var(--primary-color)', color: 'white' }}>
              <div className="summary-label" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Student Total (All Time)
              </div>
              <div className="summary-value" style={{ color: 'white' }}>
                {studentTotal.total_payments}
              </div>
            </div>
            <div className="summary-card" style={{ background: 'var(--primary-color)', color: 'white' }}>
              <div className="summary-label" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Student Total Amount (All Time)
              </div>
              <div className="summary-value" style={{ color: 'white' }}>
                {formatCurrency(studentTotal.total_amount)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Payments List */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Loading />
        </div>
      ) : payments.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No payments found for the selected period
        </div>
      ) : (
        <div className="payments-list">
          {payments.map((payment) => (
            <Card key={payment.id} className="payment-card">
              <div className="payment-card-header">
                <div>
                  <div className="payment-student">{payment.student_name}</div>
                  <div className="payment-date">{formatDate(payment.payment_date)}</div>
                </div>
                <div className="payment-amount">{formatCurrency(payment.amount)}</div>
              </div>
              {payment.notes && (
                <div className="payment-notes">
                  <strong>Notes:</strong> {payment.notes}
                </div>
              )}
              <div className="payment-actions">
                <Button
                  onClick={() => setDeleteConfirm(payment.id)}
                  variant="danger"
                  size="small"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Payment Modal */}
      <Modal
        isOpen={showAddModal}
        title="Add Payment"
        onClose={() => setShowAddModal(false)}
      >
          <form onSubmit={handleAddPayment}>
            <Input
              label="Student Name"
              type="text"
              value={newPayment.student_name}
              onChange={(e) => setNewPayment({ ...newPayment, student_name: e.target.value })}
              required
            />
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              required
            />
            <Input
              label="Payment Date"
              type="date"
              value={newPayment.payment_date}
              onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
              required
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                Add Payment
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        title="Delete Payment"
        onClose={() => setDeleteConfirm(null)}
      >
          <p style={{ marginBottom: '1.5rem' }}>
            Are you sure you want to delete this payment? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              onClick={handleDeletePayment}
              variant="danger"
              disabled={loading}
            >
              Delete
            </Button>
            <Button
              onClick={() => setDeleteConfirm(null)}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
      </Modal>
    </div>
  )
}

export default PaymentsPageMobile
