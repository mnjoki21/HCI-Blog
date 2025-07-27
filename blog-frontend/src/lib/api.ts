import axios from 'axios'

// Update this to match your Flask backend URL
const API_BASE_URL = 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
      return Promise.reject(error.response.data)
    }
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)