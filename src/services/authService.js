import api from './api'

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/user/login', { username, password })
    return response.data
  },

  signup: async (userData) => {
    const response = await api.post('/user/signup', userData)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/user/logout')
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/user/me')
    return response.data
  }
}
