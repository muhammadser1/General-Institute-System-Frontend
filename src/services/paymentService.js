import api from './api'

export const paymentService = {
  createPayment: async (paymentData) => {
    const response = await api.post('/payments/', paymentData)
    return response.data
  },

  getMonthlyPayments: async (month, year, studentName = null) => {
    const params = { month, year }
    if (studentName) {
      params.student_name = studentName
    }
    const response = await api.get('/payments/monthly', { params })
    return response.data
  }
}
