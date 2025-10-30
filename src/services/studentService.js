import api from './api'

export const studentService = {
  // Get all students
  getAllStudents: async (params = {}) => {
    const response = await api.get('/students/', { params })
    return response.data
  },

  // Search students by name
  searchStudents: async (name) => {
    const response = await api.get('/students/search', { params: { name } })
    return response.data
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    const response = await api.get(`/students/${studentId}`)
    return response.data
  },

  // Create a new student
  createStudent: async (studentData) => {
    const response = await api.post('/students/', studentData)
    return response.data
  },

  // Update student
  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/students/${studentId}`, studentData)
    return response.data
  },

  // Delete student
  deleteStudent: async (studentId) => {
    await api.delete(`/students/${studentId}`)
  }
}

