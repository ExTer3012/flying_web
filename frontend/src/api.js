import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// Ajoute le token auto
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
