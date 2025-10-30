import api from './api'

export const paymentService = {
  // Create a new payment
  createPayment: async (paymentData) => {
    const response = await api.post('/payments/', paymentData)
    return response.data
  },

  // Get monthly payments with optional filters
  getMonthlyPayments: async (month, year, studentName = null) => {
    const params = {}
    
    // Only add month and year if they are provided
    if (month !== null && month !== undefined) {
      params.month = month
    }
    if (year !== null && year !== undefined) {
      params.year = year
    }
    if (studentName) {
      params.student_name = studentName
    }
    
    const response = await api.get('/payments/', { params })
    return response.data
  },

  // Get all payments for a specific student
  getStudentPayments: async (studentName) => {
    const response = await api.get(`/payments/student/${studentName}`)
    return response.data
  },

  // Get total payments for a specific student
  getStudentTotal: async (studentName) => {
    const response = await api.get(`/payments/student/${studentName}/total`)
    return response.data
  },

  // Get student cost summary (lessons cost vs paid amount)
  getStudentCostSummary: async (studentName, month = null, year = null) => {
    const params = {}
    if (month !== null && month !== undefined) {
      params.month = month
    }
    if (year !== null && year !== undefined) {
      params.year = year
    }
    
    const response = await api.get(`/payments/student/${studentName}/cost-summary`, { params })
    return response.data
  },

  // Delete a payment
  deletePayment: async (paymentId) => {
    await api.delete(`/payments/${paymentId}`)
  },

  // Get payment status for all students (dashboard endpoint)
  getStudentsPaymentStatus: async (month = null, year = null) => {
    const params = {}
    if (month !== null && month !== undefined) {
      params.month = month
    }
    if (year !== null && year !== undefined) {
      params.year = year
    }
    
    const response = await api.get('/dashboard/students/payment-status', { params })
    return response.data
  }
}
