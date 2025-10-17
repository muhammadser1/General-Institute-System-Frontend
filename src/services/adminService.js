import api from './api'

export const adminService = {
  // User Management
  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData)
    return response.data
  },

  getUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters })
    return response.data
  },

  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`)
    return response.data
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  },

  deactivateUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`)
    return response.data
  },

  resetPassword: async (userId, newPassword) => {
    const response = await api.post(`/admin/users/${userId}/reset-password`, { new_password: newPassword })
    return response.data
  },

  // Earnings
  getTeacherEarnings: async (teacherId, month, year) => {
    const response = await api.get(`/admin/teacher-earnings/${teacherId}`, {
      params: { month, year }
    })
    return response.data
  },

  getSubjectPrices: async () => {
    const response = await api.get('/admin/subject-prices')
    return response.data
  }
}
