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
    const response = await api.post(`/admin/users/${userId}/reset-password`, {
      old_password: 'string', // API expects this field (can be empty or placeholder for admin)
      new_password: newPassword
    })
    return response.data
  },

  // Admin Lesson Management
  getAdminLessons: async (filters = {}) => {
    const response = await api.get('/lessons/admin/all', { params: filters })
    return response.data
  },

  approveLesson: async (lessonId) => {
    const response = await api.put(`/lessons/admin/approve/${lessonId}`)
    return response.data
  },

  rejectLesson: async (lessonId) => {
    const response = await api.put(`/lessons/admin/reject/${lessonId}`)
    return response.data
  },

  // Legacy endpoints (kept for backward compatibility)
  getSubjectPrices: async () => {
    const response = await api.get('/admin/subject-prices')
    return response.data
  }
}
