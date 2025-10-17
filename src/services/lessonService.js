import api from './api'

export const lessonService = {
  submitLesson: async (lessonData) => {
    const response = await api.post('/lessons/submit', lessonData)
    return response.data
  },

  getMyLessons: async (filters = {}) => {
    const response = await api.get('/lessons/my-lessons', { params: filters })
    return response.data
  },

  getLessonById: async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}`)
    return response.data
  },

  updateLesson: async (lessonId, lessonData) => {
    const response = await api.put(`/lessons/${lessonId}`, lessonData)
    return response.data
  },

  deleteLesson: async (lessonId) => {
    const response = await api.delete(`/lessons/${lessonId}`)
    return response.data
  },

  getLessonsSummary: async () => {
    const response = await api.get('/lessons/summary')
    return response.data
  }
}
