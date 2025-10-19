import api from './api'

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (params = {}) => {
    const response = await api.get('/dashboard/stats', { params })
    return response.data
  },

  // Get teachers statistics
  getTeachersStats: async () => {
    const response = await api.get('/dashboard/stats/teachers')
    return response.data
  },

  // Get students statistics
  getStudentsStats: async () => {
    const response = await api.get('/dashboard/stats/students')
    return response.data
  },

  // Get lessons statistics
  getLessonsStats: async () => {
    const response = await api.get('/dashboard/stats/lessons')
    return response.data
  }
}

