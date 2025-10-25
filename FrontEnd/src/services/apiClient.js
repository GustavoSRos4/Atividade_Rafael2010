import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na API:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('Erro de rede:', error.request)
    } else {
      console.error('Erro:', error.message)
    }
    return Promise.reject(error)
  },
)

export default apiClient
