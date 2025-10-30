import api from './api'

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (params = {}) => {
    const response = await api.get('/dashboard/stats', { params })
    return response.data
  },

  // Get teachers statistics
  getTeachersStats: async (params = {}) => {
    const response = await api.get('/dashboard/stats/teachers', { params })
    return response.data
  },

  // Get students statistics
  getStudentsStats: async () => {
    const response = await api.get('/dashboard/stats/students')
    return response.data
  },

  // Get lessons statistics
  getLessonsStats: async (params = {}) => {
    const response = await api.get('/dashboard/stats/lessons', { params })
    return response.data
  },

  // Get teacher earnings breakdown by subject
  getTeacherEarnings: async (teacherId, params = {}) => {
    const response = await api.get(`/dashboard/teacher-earnings/${teacherId}`, { params })
    return response.data
  },

  // Get student hours summary
  getStudentHours: async (studentName, params = {}) => {
    const response = await api.get(`/dashboard/student-hours/${studentName}`, { params })
    return response.data
  }
}

