import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const predictStartup = (data) => api.post('/predict', data)
export const predictRevenue = (data) => api.post('/predict/revenue', data)
export const predictCluster = (data) => api.post('/predict/cluster', data)
export const getAnalytics = () => api.get('/analytics')
export const getModelInfo = () => api.get('/model-info')
export const checkHealth = () => api.get('/health')

export default api
