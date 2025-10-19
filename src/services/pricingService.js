import api from './api'

export const pricingService = {
  // Admin Pricing Management
  createPricing: async (pricingData) => {
    const response = await api.post('/pricing/', pricingData)
    return response.data
  },

  getAllPricing: async (params = {}) => {
    const response = await api.get('/pricing/', { params })
    return response.data
  },

  getPricingById: async (pricingId) => {
    const response = await api.get(`/pricing/${pricingId}`)
    return response.data
  },

  updatePricing: async (pricingId, pricingData) => {
    const response = await api.put(`/pricing/${pricingId}`, pricingData)
    return response.data
  },

  deletePricing: async (pricingId) => {
    const response = await api.delete(`/pricing/${pricingId}`)
    return response.data
  },

  // User Pricing Lookup
  lookupPrice: async (subject) => {
    const response = await api.get(`/pricing/lookup/${subject}`)
    return response.data
  },

  // Public Pricing
  getPublicPricing: async () => {
    const response = await api.get('/pricing/public/all')
    return response.data
  }
}
